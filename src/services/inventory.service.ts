import {
  InventoryDTO,
  TypeOfInventoryModel,
} from '../database/models/inventory.model';

export class InventoryService {
  constructor(private readonly inventoryModel: TypeOfInventoryModel) {}

  async upsertInventories(
    inventories: InventoryDTO[]
  ): Promise<InventoryDTO[]> {
    const result: InventoryDTO[] = await this.inventoryModel.bulkCreate(
      inventories,
      {
        updateOnDuplicate: ['itemName', 'quantity'],
      }
    );

    return result;
  }
}
