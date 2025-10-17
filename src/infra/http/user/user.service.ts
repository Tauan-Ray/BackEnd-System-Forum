import { Injectable, Query } from "@nestjs/common";
import { PrismaUserRepository } from "src/infra/database/forum/repositories/user.repository";
import { CreateUserDto, FindManyUserDto } from "./dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class UserService {
    constructor(private readonly prismaUserRepository: PrismaUserRepository) {}

    async createUser(createUserDto: CreateUserDto) {
        const newUser = this.prismaUserRepository.createUser(createUserDto);

        return newUser;
    }

    async findMany(args: FindManyUserDto) {
        const getUsers = await this.prismaUserRepository.findMany(args)

        return getUsers
    }

    async findUnique(condition: Prisma.UserWhereUniqueInput) {
        const user = await this.prismaUserRepository.findUniqueUser(condition)

        return user;
    }

    async findById(userId: string) {
        const user = await this.prismaUserRepository.findById(userId);

        return user;
    }
}