import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaUserRepository } from 'src/infra/database/forum/repositories/user.repository';
import { CreateUserDto, FindManyUserDto, FindUniqueUserDto, UpdatePasswordDto } from './dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaUserRepository: PrismaUserRepository) {}

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.findUnique({
      username: createUserDto.username,
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new HttpException('Email ou usuário já registrado no sistema', HttpStatus.BAD_REQUEST);
    }

    const newUser = this.prismaUserRepository.createUser(createUserDto);

    return newUser;
  }

  async findMany(args: FindManyUserDto) {
    const getUsers = await this.prismaUserRepository.findMany(args);

    return getUsers;
  }

  async findUnique(condition: FindUniqueUserDto, returnPassword = false) {
    const user = await this.prismaUserRepository.findUniqueUser(condition, returnPassword);

    return user;
  }

  async findById(userId: string) {
    const user = await this.prismaUserRepository.findById(userId);

    return user;
  }

  async updateUser(userId: string, id: string, data: UpdateUserDto) {
    const existingUpdateUser = await this.findById(id);
    if (!existingUpdateUser) throw new UnauthorizedException('Usuário não encontrado');

    const existingUser = await this.findById(userId);
    if (userId !== id && existingUser?.ROLE !== 'ADMIN')
      throw new UnauthorizedException('Você não pode alterar o usuário de outra pessoa');

    const updatedUser = await this.prismaUserRepository.updateUser(id, data);

    return updatedUser;
  }

  async updatePassword(userId: string, id: string, updatePasswordData: UpdatePasswordDto) {
    const existingUpdateUser = await this.findById(id);
    if (!existingUpdateUser) throw new UnauthorizedException('Usuário não encontrado');

    const existingUser = await this.findById(userId);
    if (userId !== id && existingUser?.ROLE !== 'ADMIN')
      throw new UnauthorizedException('Você não pode alterar o usuário de outra pessoa');

    await this.prismaUserRepository.updatePassword(id, updatePasswordData);

    return { message: 'Senha atualizada com sucesso!' };
  }

  async deleteUser(userId: string) {
    const existingUser = await this.findById(userId);

    if (!existingUser) {
      throw new HttpException('ID de usuário não encontrado', HttpStatus.BAD_REQUEST);
    }

    await this.prismaUserRepository.deleteUser(userId);

    return { message: 'Usuário deletado com sucesso' };
  }
}
