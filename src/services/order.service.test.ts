import { DeepMocked, createMock } from '@golevelup/ts-jest';
import Inventory, {
  TypeOfInventoryModel,
} from '../database/models/inventory.model';
import Order, { TypeOfOrderModel } from '../database/models/order.model';
import { Sequelize, Transaction } from 'sequelize';
import { OrderService } from './order.service';
import { CustomError } from '../utils/custom-error.util';
import { FetchOrdersDTO } from '../DTOs/order.dto';

describe('OrderService', () => {
  const showId = 8;
  const itemId = 7;
  const mockedTransaction: DeepMocked<Transaction> = createMock<Transaction>();

  const mockedInventoryModel: DeepMocked<TypeOfInventoryModel> =
    createMock<TypeOfInventoryModel>();
  const mockedOrderModel: DeepMocked<TypeOfOrderModel> =
    createMock<TypeOfOrderModel>();
  const mockedSequelize: DeepMocked<Sequelize> = createMock<Sequelize>({
    transaction: jest.fn().mockImplementation((fn) => fn(mockedTransaction)),
  });

  const orderService = new OrderService(
    mockedOrderModel,
    mockedInventoryModel,
    mockedSequelize
  );

  const mockedInventory: Inventory = createMock<Inventory>({ quantity: 1 });
  const mockedOrder: Order = createMock<Order>();
  const mockedOrders: FetchOrdersDTO[] = [createMock<FetchOrdersDTO>()];

  describe('upsertOrder', () => {
    it('should throw item not found error, when item with itemId is not found', async () => {
      mockedInventoryModel.findOne.mockResolvedValue(null);

      await expect(orderService.upsertOrder(showId, itemId)).rejects.toEqual(
        new CustomError(404, 'Item not found.')
      );

      expect(mockedInventoryModel.findOne).toHaveBeenCalledWith({
        where: {
          itemID: itemId,
        },
        transaction: mockedTransaction,
      });
    });

    it('should throw item is out of stock, when item quantity is 0', async () => {
      mockedInventoryModel.findOne.mockResolvedValue({
        quantity: 0,
      } as Inventory);

      await expect(orderService.upsertOrder(showId, itemId)).rejects.toEqual(
        new CustomError(400, 'Item is currently out of stock')
      );
    });

    it('should decrease inventory when item is found and sufficient', async () => {
      mockedInventoryModel.findOne.mockResolvedValue(mockedInventory);

      await orderService.upsertOrder(showId, itemId);

      expect(mockedInventoryModel.decrement).toHaveBeenCalledWith(
        { quantity: 1 },
        {
          where: {
            itemID: itemId,
          },
          transaction: mockedTransaction,
        }
      );
    });

    it('should increment quantity sold when a similar order with the same showId and itemId already exist', async () => {
      mockedInventoryModel.findOne.mockResolvedValue(mockedInventory);
      mockedOrderModel.findOne.mockResolvedValue(mockedOrder);

      await orderService.upsertOrder(showId, itemId);

      expect(mockedOrderModel.increment).toHaveBeenCalledWith(
        { quantitySold: 1 },
        {
          where: { showID: showId, itemID: itemId },
          transaction: mockedTransaction,
        }
      );
    });

    it('should create a new order, when new purchase is made and an order with the same showId and itemId does not exist yet', async () => {
      mockedInventoryModel.findOne.mockResolvedValue(mockedInventory);
      mockedOrderModel.findOne.mockResolvedValue(null);

      await orderService.upsertOrder(showId, itemId);

      expect(mockedOrderModel.create).toHaveBeenCalledWith(
        { showID: showId, itemID: itemId, quantitySold: 1 },
        { transaction: mockedTransaction }
      );
    });
  });

  describe('getOrders', () => {
    it('should query for orders with showId and itemId', async () => {
      mockedSequelize.query.mockResolvedValue([mockedOrders, null]);

      const result = await orderService.getOrders(showId, itemId);

      expect(result).toEqual(mockedOrders);
      expect(mockedSequelize.query).toHaveBeenCalledWith(
        'SELECT o.itemID, i.itemName, o.quantitySold FROM Orders o JOIN Inventories i ON o.itemID = i.itemID WHERE o.showID = :showId AND o.itemID = :itemId',
        {
          replacements: {
            showId,
            itemId,
          },
        }
      );
    });

    it('should query for orders with only showId', async () => {
      mockedSequelize.query.mockResolvedValue([mockedOrders, null]);

      const result = await orderService.getOrders(showId);

      expect(result).toEqual(mockedOrders);
      expect(mockedSequelize.query).toHaveBeenCalledWith(
        'SELECT o.itemID, i.itemName, o.quantitySold FROM Orders o JOIN Inventories i ON o.itemID = i.itemID WHERE o.showID = :showId',
        {
          replacements: {
            showId,
          },
        }
      );
    });
  });
});
