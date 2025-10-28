import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../user.controller';
import { UserService } from '../../user.service';
import { JwtGuard } from 'src/common/guards';
import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { plainToInstance } from 'class-transformer';
import { GetIdParamDto } from '../../dto';
import { validate } from 'class-validator';

describe('UserController - findById', () => {
  let controller: UserController;

  const mockService = {
    findById: jest.fn(),
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

  it('should call service when userId is provided', async () => {
    const uuid = randomUUID();
    await controller.findById({ id: uuid });

    expect(mockService.findById).toHaveBeenCalledTimes(1);
    expect(mockService.findById).toHaveBeenCalledWith(uuid);
  });

  it('should throw error in DTO if ID is missing', async () => {
    const dto = plainToInstance(GetIdParamDto, { id: '' });
    const errors = await validate(dto);
    const messages = errors.map((e) => Object.values(e.constraints || {})).flat();

    await controller.findById({ id: '' });

    expect(errors.length).toBeGreaterThan(0);
    expect(messages).toContain('O id deve ser um UUID válido');
    expect(messages).toContain('O campo de id não pode estar vazio');
  });

  it('should throw error in DTO if ID is not a UUID', async () => {
    const dto = plainToInstance(GetIdParamDto, { id: 'invalid_id' });
    const errors = await validate(dto);
    const messages = errors.map((e) => Object.values(e.constraints || {})).flat();

    await controller.findById({ id: 'invalid_id' });

    expect(errors.length).toBeGreaterThan(0);
    expect(messages).toContain('O id deve ser um UUID válido');
  });
});
