import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../auth.controller';
import { AuthService } from '../../auth.service';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AuthDto } from '../../dto';
import { CreateUserDto } from 'src/infra/http/user/dto';

describe('AuthController - signUp', () => {
  let controller: AuthController;

  const mockService = {
    signUp: jest.fn(),
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

  it('should call service when data is provided', async () => {
    const signUpData = {
      username: '_tauankk',
      name: 'Tauan-Ray',
      email: 'tauan@example.com',
      password: 'password_hash',
    };
    const dto = plainToInstance(CreateUserDto, signUpData);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);

    await controller.signUp(signUpData);

    expect(mockService.signUp).toHaveBeenCalledTimes(1);
    expect(mockService.signUp).toHaveBeenCalledWith(signUpData);
  });

  it('should fail validation when data invalid', async () => {
    const signUpData = {
      username: 'a',
      name: 'Tauan-Ray',
      email: 'tauanexample',
      password: 'password_hash',
    };

    const dto = plainToInstance(CreateUserDto, signUpData);
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);

    const messages = errors.map((e) => Object.values(e.constraints || {})).flat();
    expect(messages).toContain('Insira um email em formato válido');
    expect(messages).toContain('Nome de usuário deve conter no minímo 3 caracteres e no máximo 12');
  });
});
