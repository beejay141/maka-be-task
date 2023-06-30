import express, { Router } from 'express';
import { ShowController } from '../controllers/show.controller';
import { ShowRequestValidator } from '../request-validator/show.request-validator';
import { validateRequest } from '../request-validator';

const router: Router = express.Router();

router.post(
  '/:showId/buy_item/:itemId',
  ShowRequestValidator.validateShowIdAndItemId(),
  validateRequest,
  ShowController.buyItem
);

router.get(
  '/:showId/sold_items/:itemId',
  ShowRequestValidator.validateShowIdAndItemId(),
  validateRequest,
  ShowController.getOrders
);

router.get(
  '/:showId/sold_items',
  ShowRequestValidator.validateShowId(),
  validateRequest,
  ShowController.getOrders
);

export default router;
