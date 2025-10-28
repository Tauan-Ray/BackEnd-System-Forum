import { UserService } from './user.service';
import { RouteAdmin } from 'src/common/decorators/admin.decorator';
import { JwtGuard } from 'src/common/guards';
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator';
import type { userPayload } from 'src/common/guards/types';
import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiForbiddenResponse } from 'src/common/decorators/swagger/api-forbiddenResponse.decorator';
import {
  CreateUserDto,
  DeleteUserDto,
  FindManyUserDto,
  FindUniqueUserDto,
  GetIdParamDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from './dto';
import {
  ApiCreateUser,
  ApiDeleteUser,
  ApiFindByIdUser,
  ApiFindByUsernameOrEmail,
  ApiFindManyUsers,
  ApiUpdateUser,
  ApiUpdateUserPassword,
} from 'src/common/decorators/swagger/users';

@ApiTags('User')
@ApiBearerAuth()
@ApiResponse({ status: 500, description: 'Erro interno no servidor' })
@UseGuards(JwtGuard)
@Controller('user')
@RouteAdmin()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/all')
  @RouteAdmin()
  @ApiFindManyUsers()
  @ApiForbiddenResponse()
  async findMany(@Query() query: FindManyUserDto) {
    return await this.userService.findMany(query);
  }

  @Get('/find')
  @RouteAdmin()
  @ApiFindByIdUser()
  @ApiForbiddenResponse()
  async findById(@Query() userId: GetIdParamDto) {
    const user = await this.userService.findById(userId.id);

    return user;
  }

  @Get('/unique')
  @RouteAdmin()
  @ApiFindByUsernameOrEmail()
  @ApiForbiddenResponse()
  async findByUsernameOrEmail(@Query() query: FindUniqueUserDto) {
    const user = await this.userService.findByUsernameOrEmail(query);

    return user;
  }

  @Post('/create')
  @RouteAdmin()
  @ApiCreateUser()
  @ApiForbiddenResponse()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.userService.createUser(createUserDto);

    return newUser;
  }

  @Patch('update/:id')
  @ApiUpdateUser()
  async updateUser(
    @GetCurrentUser('payload') user: userPayload,
    @Param() idUser: GetIdParamDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(user, idUser.id, updateUserDto);
  }

  @Patch('update/:id/password')
  @ApiUpdateUserPassword()
  async updateUserPassword(
    @GetCurrentUser('payload') user: userPayload,
    @Param() userId: GetIdParamDto,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return await this.userService.updateUserPassword(user, userId.id, updatePasswordDto);
  }

  @Patch('delete/:id')
  @ApiDeleteUser()
  async deleteUser(
    @GetCurrentUser('payload') user: userPayload,
    @Param() userId: GetIdParamDto,
    @Body() password: DeleteUserDto,
  ) {
    return await this.userService.deleteUser(user, userId.id, password.actualPassword);
  }
}
