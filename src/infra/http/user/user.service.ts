import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaUserRepository } from 'src/infra/database/forum/repositories/user.repository';
import { CreateUserDto, FindManyUserDto, FindUniqueUserDto, UpdatePasswordDto } from './dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { userPayload } from 'src/common/guards/types';

@Injectable()
export class UserService {
  constructor(private readonly prismaUserRepository: PrismaUserRepository) {}

  async findMany(args: FindManyUserDto) {
    const getUsers = await this.prismaUserRepository.findMany(args);

    return getUsers;
  }

  async findById(userId: string) {
    const user = await this.prismaUserRepository.findById(userId);

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return user;
  }

  async findByUsernameOrEmail(condition: FindUniqueUserDto, returnPassword = false) {
    if (!condition.email && !condition.username) {
      throw new BadRequestException('Necessário enviar pelo menos um parâmetro (username/email)');
    }

    const user = await this.prismaUserRepository.findByUsernameOrEmail(condition, returnPassword);

    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.prismaUserRepository.findByUsernameOrEmail({
      username: createUserDto.username,
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException('Email ou usuário já registrado no sistema');
    }

    const newUser = await this.prismaUserRepository.createUser(createUserDto);

    return newUser;
  }

  async updateUser(user: userPayload, id: string, data: UpdateUserDto) {
    const isAdmin = user.role === 'ADMIN';
    const existingUser = await this.prismaUserRepository.findById(id);
    if (!existingUser) throw new NotFoundException('Usuário não encontrado');

    const searchByUsernameOrEmail = await this.findByUsernameOrEmail({
      email: data.email,
      username: data.username,
    });

    if (user.sub !== id && !isAdmin)
      throw new UnauthorizedException('Você não pode alterar o usuário de outra pessoa');

    if (isAdmin) {
      if (searchByUsernameOrEmail && searchByUsernameOrEmail.ID_USER !== id)
        throw new ConflictException('Email ou username em uso');
    } else {
      if (searchByUsernameOrEmail && searchByUsernameOrEmail.ID_USER !== user.sub)
        throw new ConflictException('Email ou username em uso');
    }

    const updatedUser = await this.prismaUserRepository.updateUser(id, data, isAdmin);

    return updatedUser;
  }

  async updateUserPassword(user: userPayload, id: string, updatePasswordData: UpdatePasswordDto) {
    const existingUser = await this.prismaUserRepository.findById(id);
    if (!existingUser) throw new NotFoundException('Usuário não encontrado');

    if (user.sub !== id && user.role !== 'ADMIN')
      throw new UnauthorizedException('Você não pode alterar o usuário de outra pessoa');

    await this.prismaUserRepository.updateUserPassword(id, updatePasswordData);

    return { message: 'Senha atualizada com sucesso' };
  }

  async deleteUser(user: userPayload, id: string, password: string) {
    const isAdmin = user.role === 'ADMIN';
    const existingUser = await this.prismaUserRepository.findById(id);
    if (!existingUser) throw new NotFoundException('Usuário não encontrado');

    if (id !== user.sub && !isAdmin)
      throw new UnauthorizedException('Você não pode deletar o usuário de outra pessoa!');

    await this.prismaUserRepository.deleteUser(id, password, isAdmin);

    return { message: 'Usuário deletado com sucesso' };
  }

  async modifyUpdateAtUser(ID_USER: string) {
    await this.prismaUserRepository.modifyUpdateAtUser(ID_USER);
  }

  async restoreUser(id: string) {
    const existingUser = await this.prismaUserRepository.findById(id, false, false);
    if (!existingUser) throw new NotFoundException('Usuário não encontrado');

    if (!existingUser.DEL_AT)
      throw new UnprocessableEntityException('O usuário não está com o status de deletado');

    await this.prismaUserRepository.restoreUser(id);

    return {
      message: 'Usuário restaurado com sucesso',
    };
  }
}
