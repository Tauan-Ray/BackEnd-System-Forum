import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { EncryptionModule } from "src/infra/encryption/encryption.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [UserModule, EncryptionModule, JwtModule.register({})],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule { }