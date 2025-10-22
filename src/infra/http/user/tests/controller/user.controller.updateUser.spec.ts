import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../user.controller';
import { UserService } from '../../user.service';
import { JwtGuard } from 'src/common/guards';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { generateUpdatedPayload, generateUpdatedUser } from '../util/GeneratorUser.util';
import { getUserDto } from '../../dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { randomUUID } from 'crypto';

describe('UserController - updateUser', () => {
  let controller: UserController;

  const mockService = {
    updateUser: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(JwtGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UserController>(UserController);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service with correct parameters', async () => {
    const uuid = randomUUID();
    const loggedUser = generateUpdatedPayload({
      sub: uuid,
      username: '_tauankk',
      email: 'tauan@example.com',
      role: 'USER',
    });

    const updateUserData = generateUpdatedUser({
      name: 'Tauan Ray',
      email: 'tauan@example.com',
      username: 'TauanKk',
    });

    const dto = plainToInstance(UpdateUserDto, updateUserData);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);

    const dtoId = plainToInstance(getUserDto, { userId: loggedUser.sub });
    const errorsId = await validate(dtoId);
    expect(errorsId.length).toBe(0);

    await controller.updateUser(loggedUser, loggedUser.sub, updateUserData);

    expect(mockService.updateUser).toHaveBeenCalledTimes(1);
    expect(mockService.updateUser).toHaveBeenCalledWith(loggedUser, loggedUser.sub, updateUserData);
  });
});
