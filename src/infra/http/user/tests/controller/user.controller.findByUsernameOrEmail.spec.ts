import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../user.controller';
import { UserService } from '../../user.service';
import { JwtGuard } from 'src/common/guards';

describe('UserController - findByUsernameOrEmail', () => {
  let controller: UserController;

  const mockService = {
    findByUsernameOrEmail: jest.fn(),
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

  it('should call service with email', async () => {
    await controller.findByUsernameOrEmail({ email: 'tauan@example.com' });

    expect(mockService.findByUsernameOrEmail).toHaveBeenCalledTimes(1);
    expect(mockService.findByUsernameOrEmail).toHaveBeenCalledWith({
      email: 'tauan@example.com',
    });
  });

  it('should call service with username', async () => {
    await controller.findByUsernameOrEmail({ username: '_tauankk' });

    expect(mockService.findByUsernameOrEmail).toHaveBeenCalledTimes(1);
    expect(mockService.findByUsernameOrEmail).toHaveBeenCalledWith({ username: '_tauankk' });
  });
});
