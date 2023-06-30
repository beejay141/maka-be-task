import { Sequelize } from 'sequelize';
import Order, { TypeOfOrderModel } from '../database/models/order.model';
import { FetchOrdersDTO } from '../DTOs/order.dto';
import Inventory, {
  TypeOfInventoryModel,
} from '../database/models/inventory.model';
import { CustomError } from '../utils/custom-error.util';

export class OrderService {
  constructor(
    private readonly orderModel: TypeOfOrderModel,
    private readonly inventoryModel: TypeOfInventoryModel,
    private readonly sequelize: Sequelize
  ) {}

  async upsertOrder(showID: number, itemID: number): Promise<void> {
    await this.sequelize.transaction(async (transaction) => {
      const inventory: Inventory | null = await this.inventoryModel.findOne({
        where: {
          itemID,
        },
        transaction,
      });

      if (!inventory) {
        throw new CustomError(404, 'Item not found.');
      }

      if (inventory.quantity <= 0) {
        throw new CustomError(400, 'Item is currently out of stock');
      }

      await this.inventoryModel.decrement(
        { quantity: 1 },
        {
          where: {
            itemID,
          },
          transaction,
        }
      );

      const order: Order | null = await this.orderModel.findOne({
        where: {
          showID,
          itemID,
        },
        transaction,
      });

      if (order) {
        await this.orderModel.increment(
          { quantitySold: 1 },
          { where: { showID, itemID }, transaction }
        );
      } else {
        await this.orderModel.create(
          { showID, itemID, quantitySold: 1 },
          { transaction }
        );
      }
    });
  }

  async getOrders(showId: number, itemId?: number): Promise<FetchOrdersDTO[]> {
    const query = `SELECT o.itemID, i.itemName, o.quantitySold FROM Orders o JOIN Inventories i ON o.itemID = i.itemID WHERE o.showID = :showId${
      itemId ? ' AND o.itemID = :itemId' : ''
    }`;

    const [orders] = await this.sequelize.query(query, {
      replacements: {
        showId,
        ...(itemId && { itemId }),
      },
    });

    return orders as FetchOrdersDTO[];
  }
}
