import { Application } from 'express';
import { sequelize } from '../database';
import { OrderService } from './order.service';
import { TypeOfInventoryModel } from '../database/models/inventory.model';
import { TypeOfOrderModel } from '../database/models/order.model';
import { InventoryService } from './inventory.service';

export const registerServices = (app: Application): void => {
  const { Order, Inventory } = sequelize.models;

  /*
  This statement initializes the database tables.
  Option force:true, enforces table recreation on startup, 
  remove the option to enabled data persistence.
  */
  sequelize.sync({ force: true });

  app.set(
    OrderService.name,
    new OrderService(
      Order as TypeOfOrderModel,
      Inventory as TypeOfInventoryModel,
      sequelize
    )
  );

  app.set(
    InventoryService.name,
    new InventoryService(Inventory as TypeOfInventoryModel)
  );
};
