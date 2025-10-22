import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
      throw new HttpException('Email ou usuário já registrado no sistema', HttpStatus.BAD_REQUEST);
    }

    const newUser = await this.prismaUserRepository.createUser(createUserDto);

    return newUser;
  }

  async updateUser(user: userPayload, id: string, data: UpdateUserDto) {
    const existingUser = await this.prismaUserRepository.findById(id);
    if (!existingUser) throw new NotFoundException('Usuário não encontrado');

    if (user.sub !== id && user.role !== 'ADMIN')
      throw new UnauthorizedException('Você não pode alterar o usuário de outra pessoa');

    const updatedUser = await this.prismaUserRepository.updateUser(id, data);

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

  async deleteUser(user: userPayload, id: string) {
    const existingUser = await this.prismaUserRepository.findById(id);
    if (!existingUser) throw new NotFoundException('Usuário não encontrado');

    if (id !== user.sub && user.role !== 'ADMIN')
      throw new UnauthorizedException('Você não pode deletar o usuário de outra pessoa!');

    await this.prismaUserRepository.deleteUser(id);

    return { message: 'Usuário deletado com sucesso' };
  }
}
