import express, { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';
import { InventoryRequestValidator } from '../request-validator/inventory.request-validator';
import { validateRequest } from '../request-validator';

const router: Router = express.Router();

router.post(
  '',
  InventoryRequestValidator.validateCreate(),
  validateRequest,
  InventoryController.create
);

export default router;
