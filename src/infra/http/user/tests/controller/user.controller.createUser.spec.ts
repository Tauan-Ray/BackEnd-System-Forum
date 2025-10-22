import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../user.controller';
import { UserService } from '../../user.service';
import { JwtGuard } from 'src/common/guards';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { generateCreatedUser } from '../util/GeneratorUser.util';
import { CreateUserDto } from '../../dto';

describe('UserController - createUser', () => {
  let controller: UserController;

  const mockService = {
    createUser: jest.fn(),
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

  it('should call service with correct data', async () => {
    const user = generateCreatedUser({
      username: '_tauankk',
      name: 'Tauan-Ray',
      email: 'tauan@example.com',
      password: 'password_hash',
    });

    const dto = plainToInstance(CreateUserDto, user);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);

    await controller.createUser(user);

    expect(mockService.createUser).toHaveBeenCalledTimes(1);
    expect(mockService.createUser).toHaveBeenCalledWith(user);
  });
});
