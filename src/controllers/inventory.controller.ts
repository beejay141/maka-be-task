import { Request, Response } from 'express';
import { InventoryService } from '../services/inventory.service';
import { ErrorResponse } from '../utils/response.util';
import { InventoryDTO } from '../database/models/inventory.model';

export class InventoryController {
  static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body, app } = req;

      const inventoryService: InventoryService = app.get(InventoryService.name);

      const result: InventoryDTO[] = await inventoryService.upsertInventories(
        body
      );

      return res.json(result);
    } catch (error) {
      return res.status(500).json(ErrorResponse());
    }
  }
}
