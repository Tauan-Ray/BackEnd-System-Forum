import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaForumService extends PrismaClient implements OnModuleInit {

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await this.$disconnect()
      await app.close()
    })
  }

  catchPrismaError<T>(error: Error, document: T) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      if (error.message.includes('P2002')) {
        throw new Prisma.PrismaClientValidationError(
          `Chave primária violada. Documento => ${document}`,
          { clientVersion: error.clientVersion },
        )
      }

      if (error.message.includes('P2025')) {
        throw new Prisma.PrismaClientValidationError(
          `Operação depende de um registro não encontrado. Documento => ${document}`,
          { clientVersion: error.clientVersion },
        )
      }
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error?.code == 'P2003') {
        throw new Prisma.PrismaClientValidationError(
          `Chave primária não localizada. Documento => ${document}`,
          { clientVersion: error.clientVersion },
        )
      }
    }

    throw error.message
  }
}