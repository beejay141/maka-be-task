import { Model, ModelAttributes, Optional, INTEGER } from 'sequelize';

export interface OrderDTO {
  showID: number;
  itemID: number;
  quantitySold: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export default class Order extends Model<OrderDTO> implements OrderDTO {
  showID: number;
  itemID: number;
  quantitySold: number;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

export type TypeOfOrderModel = typeof Order;

export const orderSchema: ModelAttributes<Order, Optional<OrderDTO, never>> = {
  showID: {
    type: INTEGER,
    allowNull: false,
  },
  itemID: {
    type: INTEGER,
    allowNull: false,
  },
  quantitySold: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
};
