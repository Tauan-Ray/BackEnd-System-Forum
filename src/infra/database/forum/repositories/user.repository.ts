import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaForumService } from '../prisma.forum.service';
import { Prisma } from '@prisma/client';
import {
  CreateUserDto,
  FindManyUserDto,
  FindUniqueUserDto,
  UpdatePasswordDto,
} from 'src/infra/http/user/dto';
import { EncryptionService } from 'src/infra/encryption/encryption.service';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { UpdateUserDto } from 'src/infra/http/user/dto/update-user.dto';

@Injectable()
export class PrismaUserRepository {
  constructor(
    private readonly prismaService: PrismaForumService,
    private readonly encryption: EncryptionService,
  ) {}

  async findMany({ page = 0, limit = 10, ...args }: Prisma.UserWhereInput & FindManyUserDto) {
    const qry: Prisma.UserFindManyArgs<DefaultArgs> = {
      where: {
        ...args,
        DEL_AT: null,
      },
      select: {
        ID_USER: true,
        EMAIL: true,
        NAME: true,
        USERNAME: true,
        ROLE: true,
        DEL_AT: true,
      },
      skip: page * limit,
      take: limit,
      orderBy: {
        DT_UP: 'desc',
      },
    };
    const total = await this.prismaService.user.count({ where: qry.where });
    const _data = await this.prismaService.user.findMany(qry);

    return {
      _data,
      _meta: {
        _results: _data.length,
        _total_results: total,
        _page: page + 1,
        _total_page: Math.ceil(total / limit),
      },
    };
  }

  async findById(userId: string, returnPassword = false) {
    const find = await this.prismaService.user.findUnique({
      where: {
        ID_USER: userId,
        DEL_AT: null,
      },
      select: {
        ID_USER: true,
        USERNAME: true,
        NAME: true,
        ROLE: true,
        DT_CR: true,
        PASSWORD: returnPassword,
      },
    });

    return find;
  }

  async findByUsernameOrEmail(condition: FindUniqueUserDto, returnPassword = false) {
    const filters: Prisma.UserWhereInput[] = [];

    if (condition.email) {
      filters.push({ EMAIL: condition.email });
    }

    if (condition.username) {
      filters.push({ USERNAME: condition.username });
    }

    const qry: Prisma.UserFindFirstArgs = {
      where: {
        AND: filters,
        DEL_AT: null,
      },
      select: {
        ID_USER: true,
        USERNAME: true,
        NAME: true,
        EMAIL: true,
        ROLE: true,
        DT_CR: true,
        PASSWORD: returnPassword,
      },
    };

    const find = await this.prismaService.user.findFirst(qry);

    return find;
  }

  async createUser(user: CreateUserDto) {
    const hashedPassword = await this.encryption.hash(user.password);

    const newUser = await this.prismaService.user.create({
      data: {
        NAME: user.name,
        EMAIL: user.email,
        USERNAME: user.username,
        PASSWORD: hashedPassword,
      },
    });

    return {
      message: 'Usuário criado com sucesso',
      data: {
        id: newUser.ID_USER,
        name: newUser.NAME,
        email: newUser.EMAIL,
        username: newUser.USERNAME,
        role: newUser.ROLE,
      },
    };
  }

  async updateUser(id: string, data: UpdateUserDto) {
    const updatedUser = await this.prismaService.user.update({
      where: { ID_USER: id },
      data: {
        ...(data.username && { USERNAME: data.username }),
        ...(data.email && { EMAIL: data.email }),
        ...(data.name && { NAME: data.name }),
      },
    });

    return {
      message: 'Usuário atualizado com sucesso',
      data: {
        id: updatedUser.ID_USER,
        name: updatedUser.NAME,
        email: updatedUser.EMAIL,
        username: updatedUser.USERNAME,
        role: updatedUser.ROLE,
      },
    };
  }

  async updateUserPassword(userId: string, password: UpdatePasswordDto) {
    const existingUser = await this.findById(userId, true);

    const passwordMatches = await this.encryption.compare(
      password.actualPassword,
      existingUser!.PASSWORD,
    );
    if (!passwordMatches) throw new UnauthorizedException('Senha atual incorreta!');

    const hashedPassword = await this.encryption.hash(password.newPassword);

    await this.prismaService.user.update({
      where: { ID_USER: userId },
      data: {
        PASSWORD: hashedPassword,
      },
    });
  }

  async deleteUser(userId: string) {
    await this.prismaService.user.update({
      where: { ID_USER: userId },
      data: {
        DEL_AT: new Date(),
      },
    });
  }
}
