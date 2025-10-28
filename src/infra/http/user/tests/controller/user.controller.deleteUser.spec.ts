import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../user.controller';
import { UserService } from '../../user.service';
import { JwtGuard } from 'src/common/guards';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { generateUpdatedPayload } from '../util/GeneratorUser.util';
import { GetIdParamDto } from '../../dto';
import { randomUUID } from 'crypto';

describe('UserController - deleteUser', () => {
  let controller: UserController;

  const mockService = {
    deleteUser: jest.fn(),
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

    const dtoId = plainToInstance(GetIdParamDto, { id: loggedUser.sub });
    const errorsId = await validate(dtoId);
    expect(errorsId.length).toBe(0);

    await controller.deleteUser(loggedUser, { id: loggedUser.sub }, { actualPassword: 'password' });

    expect(mockService.deleteUser).toHaveBeenCalledTimes(1);
    expect(mockService.deleteUser).toHaveBeenCalledWith(loggedUser, loggedUser.sub, 'password');
  });
});
