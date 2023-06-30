import { Sequelize } from 'sequelize';
import Inventory, { inventorySchema } from './models/inventory.model';
import Order, { orderSchema } from './models/order.model';

const sequelize: Sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite3',
});

Inventory.init(inventorySchema, {
  modelName: Inventory.name,
  sequelize,
  timestamps: true,
});

Order.init(orderSchema, {
  modelName: Order.name,
  sequelize,
  timestamps: true,
});

Order.belongsTo(Inventory, { foreignKey: 'itemID' });

export { sequelize, Inventory, Order };
