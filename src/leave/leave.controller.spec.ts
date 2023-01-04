import { Leave } from './entities/leave.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { LeaveController } from './leave.controller';
import { LeaveService } from './leave.service';

describe('LeaveController', () => {
  let leaveController: LeaveController;
  let leaveService: LeaveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaveController],
      providers: [LeaveService],
    }).compile();

    leaveController = module.get<LeaveController>(LeaveController);
    leaveService = module.get<LeaveService>(LeaveService);
  });

  describe('findAll', () => {
    it('should return an array of leaves', async () => {
      const result: Leave[] = [];
      jest
        .spyOn(leaveService, 'findAll')
        .mockImplementation(async () => result);

      expect(await leaveController.findAll({})).toBe(result);
    });
  });

  describe('remove', async () => {
    it('should remove the leave with the given id', async () => {
      const deleteLeaveSpy = jest.spyOn(leaveService, 'remove');
      const id = '1';
      await leaveController.remove(id);
      expect(deleteLeaveSpy).toHaveBeenCalledWith(+id);
    });
  });
});
