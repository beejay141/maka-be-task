import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { InventoryService } from './inventory.service';
import Inventory, {
  InventoryDTO,
  TypeOfInventoryModel,
} from '../database/models/inventory.model';

describe('InventoryService', () => {
  const mockedInventoryModel: DeepMocked<TypeOfInventoryModel> =
    createMock<TypeOfInventoryModel>({
      bulkCreate: jest.fn(),
    });

  const inventoryService: InventoryService = new InventoryService(
    mockedInventoryModel
  );

  describe('upsertInventories', () => {
    const inventories: InventoryDTO[] = createMock<InventoryDTO[]>([
      createMock<InventoryDTO>(),
    ]);

    it('should call bulkCreate to create or update inventories', async () => {
      mockedInventoryModel.bulkCreate.mockResolvedValue(
        inventories as Inventory[]
      );

      const result: InventoryDTO[] = await inventoryService.upsertInventories(
        inventories
      );

      expect(result).toEqual(inventories);
      expect(mockedInventoryModel.bulkCreate).toHaveBeenCalledWith(
        inventories,
        {
          updateOnDuplicate: ['itemName', 'quantity'],
        }
      );
    });
  });
});
