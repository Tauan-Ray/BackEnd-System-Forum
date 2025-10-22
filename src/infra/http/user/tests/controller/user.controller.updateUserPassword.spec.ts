import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../user.controller';
import { UserService } from '../../user.service';
import { JwtGuard } from 'src/common/guards';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { generateUpdatedPayload } from '../util/GeneratorUser.util';
import { getUserDto, UpdatePasswordDto } from '../../dto';
import { randomUUID } from 'crypto';

describe('UserController - updateUserPassword', () => {
  let controller: UserController;

  const mockService = {
    updateUserPassword: jest.fn(),
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

    const updatePasswordData = {
      newPassword: 'password_hash2',
      actualPassword: 'password_hash',
    };

    const dto = plainToInstance(UpdatePasswordDto, updatePasswordData);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);

    const dtoId = plainToInstance(getUserDto, { userId: loggedUser.sub });
    const errorsId = await validate(dtoId);
    expect(errorsId.length).toBe(0);

    await controller.updateUserPassword(loggedUser, loggedUser.sub, updatePasswordData);

    expect(mockService.updateUserPassword).toHaveBeenCalledTimes(1);
    expect(mockService.updateUserPassword).toHaveBeenCalledWith(
      loggedUser,
      loggedUser.sub,
      updatePasswordData,
    );
  });
});
