import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Application, Request, Response } from 'express';
import {
  MockRequest,
  MockResponse,
  createRequest,
  createResponse,
} from 'node-mocks-http';
import { OrderService } from '../services/order.service';
import { ShowController } from './show.controller';
import { CustomError } from '../utils/custom-error.util';
import { ErrorResponse } from '../utils/response.util';
import { GENERIC_ERROR_MESSAGE } from '../utils/constants';
import { FetchOrdersDTO } from '../DTOs/order.dto';

describe('ShowController', () => {
  const showId = 1;
  const itemId = 1;

  const orderService: DeepMocked<OrderService> = createMock<OrderService>();
  const app: Application = createMock<Application>({
    get: jest.fn().mockReturnValue(orderService),
  });

  let req: MockRequest<Request>;
  let res: MockResponse<Response>;

  beforeEach(() => {
    req = createRequest({ app, params: { showId, itemId } });
    res = createResponse();
  });

  describe('buyItem', () => {
    it('should return 200 when order is successfully executed', async () => {
      await ShowController.buyItem(req, res);

      expect(res.statusCode).toBe(200);
      expect(orderService.upsertOrder).toHaveBeenCalledWith(showId, itemId);
      expect(res._getJSONData()).toEqual({
        message: 'Order has been executed successfully',
      });
    });

    it('should return error status code and message, when orderService.upsertOrder throws an error', async () => {
      const error = new CustomError(400, 'Item is currently out of stock');

      orderService.upsertOrder.mockRejectedValue(error);

      await ShowController.buyItem(req, res);

      expect(res.statusCode).toBe(error.status);
      expect(orderService.upsertOrder).toHaveBeenCalledWith(showId, itemId);
      expect(res._getJSONData()).toEqual({ message: error.message });
    });

    it('should return 500 when orderService.upsertOrder throws an unknown error', async () => {
      orderService.upsertOrder.mockRejectedValue(Error('error'));

      await ShowController.buyItem(req, res);

      expect(res.statusCode).toBe(500);
      expect(orderService.upsertOrder).toHaveBeenCalledWith(showId, itemId);
      expect(res._getJSONData()).toEqual({ message: GENERIC_ERROR_MESSAGE });
    });

    it('should return 500 when unexpected error occur in the handler', async () => {
      req.app.get = jest.fn().mockRejectedValueOnce(new Error());

      await ShowController.buyItem(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual(ErrorResponse());
    });
  });

  describe('getOrders', () => {
    const mockedOrder: FetchOrdersDTO = {
      itemID: 1,
      itemName: 'test',
      quantitySold: 1,
    };

    beforeAll(() => {
      orderService.getOrders.mockResolvedValue([mockedOrder]);
    });

    it('should call orderService.getOrders with showId value and itemId as undefined', async () => {
      req.params = { showId: '1' };

      await ShowController.getOrders(req, res);

      expect(orderService.getOrders).toHaveBeenCalledWith(showId, undefined);
      expect(res.statusCode).toEqual(200);
      expect(res._getJSONData()).toEqual([mockedOrder]);
    });

    it('should call orderService.getOrders with showId and itemId', async () => {
      await ShowController.getOrders(req, res);

      expect(orderService.getOrders).toHaveBeenCalledWith(showId, itemId);
      expect(res.statusCode).toEqual(200);
      expect(res._getJSONData()).toEqual([mockedOrder]);
    });

    it('should return 500 status code when unexpected error is thrown', async () => {
      orderService.getOrders.mockRejectedValue(new Error());

      await ShowController.getOrders(req, res);

      expect(res.statusCode).toEqual(500);
      expect(res._getJSONData()).toEqual(ErrorResponse());
    });
  });
});
