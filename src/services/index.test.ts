import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Application } from 'express';
import { registerServices } from '.';
import { OrderService } from './order.service';
import { TypeOfOrderModel } from '../database/models/order.model';
import { TypeOfInventoryModel } from '../database/models/inventory.model';
import { sequelize, Order, Inventory } from '../database';
import { InventoryService } from './inventory.service';

jest.mock('../database');

describe('registerServices', () => {
  let app: DeepMocked<Application>;

  beforeEach(() => {
    app = createMock<Application>();
  });

  it('should register order service', () => {
    registerServices(app);

    expect(app.set).toBeCalledWith(
      OrderService.name,
      new OrderService(
        Order as TypeOfOrderModel,
        Inventory as unknown as TypeOfInventoryModel,
        sequelize
      )
    );
  });

  it('should register inventory service', () => {
    registerServices(app);

    expect(app.set).toBeCalledWith(
      InventoryService.name,
      new InventoryService(Inventory as TypeOfInventoryModel)
    );
  });
});
