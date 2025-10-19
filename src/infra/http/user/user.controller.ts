import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, FindManyUserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.userService.createUser(createUserDto);

    return newUser;
  }

  @HttpCode(HttpStatus.OK)
  @Get('/all')
  async findMany(@Query() query: FindManyUserDto) {
    return await this.userService.findMany(query);
  }
}
