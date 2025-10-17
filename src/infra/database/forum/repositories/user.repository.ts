import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaForumService } from "../prisma.forum.service";
import { Prisma } from "@prisma/client";
import { CreateUserDto, FindManyUserDto } from "src/infra/http/user/dto";
import { EncryptionService } from "src/infra/encryption/encryption.service";
import { DefaultArgs } from "@prisma/client/runtime/library";

@Injectable()
export class PrismaUserRepository {
    constructor(
        private readonly prismaService: PrismaForumService,
        private readonly encryption: EncryptionService,
    ) {}

    async findUniqueUser(condition: Prisma.UserWhereInput) {
        const find = await this.prismaService.user.findFirst({
            where: { ...condition }
        })

        return find;
    }

    async findById(userId: string) {
        const find = await this.prismaService.user.findUnique({
            where: {
                ID_USER: userId
            }
        })

        return find;
    }

    async findMany({ page = 0, limit = 10, ...args }: Prisma.UserWhereInput & FindManyUserDto) {
        const qry: Prisma.UserFindManyArgs<DefaultArgs> = {
            where: {
                ...args
            },
            select: {
                ID_USER: true,
                EMAIL: true,
                NAME: true,
                USERNAME: true,
                ROLE: true,
            },
            skip: page * limit,
            take: limit,
            orderBy: {
                DT_UP: 'desc'
            }
        }
        const total = await this.prismaService.user.count({ where: qry.where });
        const _data = await this.prismaService.user.findMany(qry);

        return {
            _data,
            _meta: {
                _results: _data.length,
                _total_results: total,
                _page: (page + 1),
                _total_page: Math.ceil(total / limit),
            }
        }
    }

    async createUser(user: CreateUserDto) {
        const existingUser = await this.findUniqueUser({ OR: [{ EMAIL: user.email }, { USERNAME: user.username }] })
        if (existingUser) {
            throw new HttpException(
                'Email ou usuário já registrado no sistema',
                HttpStatus.BAD_REQUEST,
            )
        }

        const hashedPassword = await this.encryption.hash(user.password)

        const newUser = await this.prismaService.user.create({
            data: {
                NAME: user.name,
                EMAIL: user.email,
                USERNAME: user.username,
                PASSWORD: hashedPassword,
            }
        })

        return {
            message: 'Usuário criado com sucesso',
            data: {
                id: newUser.ID_USER,
                name: newUser.NAME,
                email: newUser.EMAIL,
                username: newUser.USERNAME,
                role: newUser.ROLE
            }
        }
    }
}