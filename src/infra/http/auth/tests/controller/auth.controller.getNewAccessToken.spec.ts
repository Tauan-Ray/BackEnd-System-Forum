import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../auth.controller';
import { AuthService } from '../../auth.service';

describe('AuthController - getNewAccessToken', () => {
  let controller: AuthController;

  const mockService = {
    getNewAccessToken: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service when refresh token is provided', async () => {
    const refreshTokenData = {
      refresh_token: 'refresh_token',
    };

    await controller.getNewAccessToken(refreshTokenData);

    expect(mockService.getNewAccessToken).toHaveBeenCalledTimes(1);
    expect(mockService.getNewAccessToken).toHaveBeenCalledWith(refreshTokenData.refresh_token);
  });
});
