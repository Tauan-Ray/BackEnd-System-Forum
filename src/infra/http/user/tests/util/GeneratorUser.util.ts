import { userPayload } from 'src/common/guards/types';
import { CreateUserDto } from '../../dto';
import { UpdateUserDto } from '../../dto/update-user.dto';

export function generateCreatedUser(user: CreateUserDto) {
  const createdUser: CreateUserDto = {
    username: user.username,
    email: user.email,
    name: user.name,
    password: user.password,
  };

  return createdUser;
}

export function generateUpdatedUser(user: UpdateUserDto) {
  const updatedUser: UpdateUserDto = {
    name: user.name,
    email: user.email,
    username: user.username,
    actualPassword: user.actualPassword,
  };

  return updatedUser;
}

export function generateUpdatedPayload(user: userPayload) {
  const updatedUser: userPayload = {
    sub: user.sub,
    email: user.email,
    username: user.username,
    role: user.role,
  };

  return updatedUser;
}
