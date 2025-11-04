import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../auth.controller';
import { AuthService } from '../../auth.service';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AuthDto } from '../../dto';
import { JwtGuard } from 'src/common/guards';

describe('AuthController - signIn', () => {
  let controller: AuthController;

  const mockService = {
    signIn: jest.fn(),
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
    })
      .overrideGuard(JwtGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service when email and password is provided', async () => {
    const signInData = {
      email: 'tauan@example.com',
      password: 'password',
    };
    const dto = plainToInstance(AuthDto, signInData);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);

    await controller.signIn(signInData);

    expect(mockService.signIn).toHaveBeenCalledTimes(1);
    expect(mockService.signIn).toHaveBeenCalledWith(signInData.email, signInData.password);
  });

  it('should fail validation when email or password is missing', async () => {
    const invalidData = {
      email: '',
      password: '',
    };

    const dto = plainToInstance(AuthDto, invalidData);
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);

    const messages = errors.map((e) => Object.values(e.constraints || {})).flat();
    expect(messages).toContain('email não deve estar vazio');
    expect(messages).toContain('senha não deve estar vazia');
  });
});
