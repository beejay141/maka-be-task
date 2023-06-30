import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Application, Request, Response } from 'express';
import httpMock, { MockRequest, MockResponse } from 'node-mocks-http';
import { InventoryService } from '../services/inventory.service';
import { InventoryDTO } from '../database/models/inventory.model';
import { InventoryController } from './inventory.controller';
import { ErrorResponse } from '../utils/response.util';

describe('InventoryController', () => {
  const inventories: InventoryDTO = {
    itemID: 1,
    itemName: 'test',
    quantity: 1,
  };
  const inventoryService: DeepMocked<InventoryService> = createMock();

  const app: Application = createMock<Application>({
    get: jest.fn().mockReturnValue(inventoryService),
  });

  let req: MockRequest<Request>;
  let res: MockResponse<Response>;

  beforeEach(() => {
    req = httpMock.createRequest({ app, body: inventories });
    res = httpMock.createResponse();
  });

  describe('create', () => {
    it('should create inventories and return status code 200 with data', async () => {
      inventoryService.upsertInventories.mockResolvedValue([inventories]);

      await InventoryController.create(req, res);

      expect(inventoryService.upsertInventories).toHaveBeenCalledWith(
        inventories
      );
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual([inventories]);
    });

    it('should return status code 500 when an exception is thrown', async () => {
      inventoryService.upsertInventories.mockRejectedValue(new Error());

      await InventoryController.create(req, res);

      expect(inventoryService.upsertInventories).toHaveBeenCalledWith(
        inventories
      );
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual(ErrorResponse());
    });
  });
});
