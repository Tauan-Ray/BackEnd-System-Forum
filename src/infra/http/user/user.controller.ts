import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, FindManyUserDto, FindUniqueUserDto, UpdatePasswordDto } from './dto';
import { RouteAdmin } from 'src/common/decorators/admin.decorator';
import { JwtGuard } from 'src/common/guards';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator';
import type { userPayload } from 'src/common/guards/types';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get('/all')
  @RouteAdmin()
  async findMany(@Query() query: FindManyUserDto) {
    return await this.userService.findMany(query);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/find')
  async findById(@Query('id') userId: string) {
    if (!userId) throw new BadRequestException('Obrigatório enviar o id do usuário');
    const user = await this.userService.findById(userId);

    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Get('/unique')
  async findByUsernameOrEmail(@Query() query: FindUniqueUserDto) {
    const user = await this.userService.findByUsernameOrEmail(query);

    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('/create')
  @RouteAdmin()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.userService.createUser(createUserDto);

    return newUser;
  }

  @HttpCode(HttpStatus.OK)
  @Patch('update/:id')
  async updateUser(
    @GetCurrentUser('payload') user: userPayload,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(user, id, updateUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('update/:id/password')
  async updateUserPassword(
    @GetCurrentUser('payload') user: userPayload,
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return await this.userService.updateUserPassword(user, id, updatePasswordDto);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('delete/:id')
  async deleteUser(@GetCurrentUser('payload') user: userPayload, @Param('id') userId: string) {
    return await this.userService.deleteUser(user, userId);
  }
}
