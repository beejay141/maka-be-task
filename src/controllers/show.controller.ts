import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { GENERIC_ERROR_MESSAGE } from '../utils/constants';
import { ErrorResponse } from '../utils/response.util';
import { FetchOrdersDTO } from '../DTOs/order.dto';

export class ShowController {
  static async buyItem(req: Request, res: Response): Promise<Response> {
    try {
      const {
        params: { showId, itemId },
        app,
      } = req;

      const orderService: OrderService = app.get(OrderService.name);

      try {
        await orderService.upsertOrder(parseInt(showId), parseInt(itemId));

        return res.json({ message: 'Order has been executed successfully' });
      } catch (error) {
        return res.status(error.status ?? 500).json({
          message: error.status ? error.message : GENERIC_ERROR_MESSAGE,
        });
      }
    } catch (error) {
      return res.status(500).json(ErrorResponse());
    }
  }

  static async getOrders(req: Request, res: Response): Promise<Response> {
    try {
      const {
        params: { showId, itemId },
        app,
      } = req;

      const orderService: OrderService = app.get(OrderService.name);

      const itemID: number | undefined = itemId ? parseInt(itemId) : undefined;

      const result: FetchOrdersDTO[] = await orderService.getOrders(
        parseInt(showId),
        itemID
      );

      return res.json(result);
    } catch (error) {
      return res.status(500).json(ErrorResponse());
    }
  }
}
