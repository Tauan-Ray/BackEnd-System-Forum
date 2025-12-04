import { ForbiddenException, Injectable } from '@nestjs/common';
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

  async findMany({
    page = 0,
    limit = 10,
    EMAIL,
    USERNAME,
    ID_USER,
    NAME,
    DT_IN,
    DT_FM,
  }: Prisma.UserWhereInput & FindManyUserDto) {
    const qry: Prisma.UserFindManyArgs<DefaultArgs> = {
      where: {},
      select: {
        ID_USER: true,
        EMAIL: true,
        NAME: true,
        USERNAME: true,
        ROLE: true,
        DT_CR: true,
        DT_UP: true,
        DEL_AT: true,
      },
      skip: page * limit,
      take: limit,
      orderBy: {
        DT_UP: 'desc',
      },
    };

    if (DT_IN || DT_FM) {
      qry.where!.DT_CR = {
        gte: DT_IN ? new Date(DT_IN.setHours(0, 0, 0)) : undefined,
        lte: DT_FM ? new Date(DT_FM.setHours(23, 59, 59)) : undefined,
      };
    }

    if (ID_USER) qry.where!.EMAIL = { contains: EMAIL };
    if (USERNAME) qry.where!.USERNAME = { contains: USERNAME };
    if (NAME) qry.where!.NAME = { contains: NAME };
    if (EMAIL) qry.where!.EMAIL = ID_USER;

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

  async findById(userId: string, returnPassword = false, addDelAt = true) {
    const find = await this.prismaService.user.findUnique({
      where: {
        ID_USER: userId,
        ...(addDelAt && { DEL_AT: null }),
      },
      select: {
        ID_USER: true,
        EMAIL: true,
        NAME: true,
        USERNAME: true,
        ROLE: true,
        DEL_AT: true,
        DT_CR: true,
        DT_UP: true,
        PASSWORD: returnPassword,
        _count: {
          select: {
            Question: {
              where: { DEL_AT: null },
            },
            Answers: {
              where: { DEL_AT: null },
            },
          },
        },
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
        OR: filters,
        DEL_AT: null,
      },
      select: {
        ID_USER: true,
        EMAIL: true,
        NAME: true,
        USERNAME: true,
        ROLE: true,
        DEL_AT: true,
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

  async updateUser(id: string, data: UpdateUserDto, isAdmin: boolean) {
    const existingUser = await this.findById(id, true);

    const passwordMatches = await this.encryption.compare(
      data.actualPassword,
      existingUser!.PASSWORD,
    );
    if (!passwordMatches && !isAdmin) throw new ForbiddenException('Senha atual incorreta!');
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
    if (!passwordMatches) throw new ForbiddenException('Senha atual incorreta!');

    const hashedPassword = await this.encryption.hash(password.newPassword);

    await this.prismaService.user.update({
      where: { ID_USER: userId },
      data: {
        PASSWORD: hashedPassword,
      },
    });
  }

  async deleteUser(userId: string, password: string, isAdmin: boolean) {
    const existingUser = await this.findById(userId, true);

    const passwordMatches = await this.encryption.compare(password, existingUser!.PASSWORD);
    if (!passwordMatches && !isAdmin) throw new ForbiddenException('Senha atual incorreta!');

    await this.prismaService.user.update({
      where: { ID_USER: userId },
      data: {
        DEL_AT: new Date(),
      },
    });
  }

  async modifyUpdateAtUser(ID_USER: string) {
    await this.prismaService.user.update({
      where: { ID_USER },
      data: {
        DT_UP: new Date(),
      },
    });
  }

  async restoreUser(id: string) {
    await this.prismaService.user.update({
      where: { ID_USER: id },
      data: {
        DEL_AT: null,
      },
    });
  }
}
