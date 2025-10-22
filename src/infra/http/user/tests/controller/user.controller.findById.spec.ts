import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../user.controller';
import { UserService } from '../../user.service';
import { JwtGuard } from 'src/common/guards';
import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';

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
    await controller.findById(uuid);

    expect(mockService.findById).toHaveBeenCalledTimes(1);
    expect(mockService.findById).toHaveBeenCalledWith(uuid);
  });

  it('should throw BadRequestException if id is missing', async () => {
    await expect(controller.findById(undefined as any)).rejects.toThrow(BadRequestException);
  });
});
