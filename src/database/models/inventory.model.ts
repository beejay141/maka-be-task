import { Model, ModelAttributes, Optional, INTEGER, STRING } from 'sequelize';

export interface InventoryDTO {
  itemID: number;
  itemName: string;
  quantity: number;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

export default class Inventory
  extends Model<InventoryDTO>
  implements InventoryDTO
{
  itemID: number;
  itemName: string;
  quantity: number;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

export type TypeOfInventoryModel = typeof Inventory;

export const inventorySchema: ModelAttributes<
  Inventory,
  Optional<InventoryDTO, never>
> = {
  itemID: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  itemName: {
    type: STRING,
    allowNull: false,
  },
  quantity: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
};
