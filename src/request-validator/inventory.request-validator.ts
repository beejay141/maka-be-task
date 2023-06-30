import { ValidationChain, body } from 'express-validator';

export class InventoryRequestValidator {
  static validateCreate(): ValidationChain[] {
    return [
      body()
        .isArray()
        .withMessage('request payload must be an array')
        .custom((payload) => {
          if (!payload.length)
            throw new Error('request payload must contain at least 1 item');

          return true;
        }),
      body('*.itemID')
        .notEmpty()
        .withMessage('itemID is required')
        .custom((itemID: string) => {
          if (parseInt(itemID) <= 0) {
            throw new Error('itemID must be numeric and greater than 0');
          }

          return true;
        }),
      body('*.quantity')
        .notEmpty()
        .withMessage('quantity is required')
        .custom((quantity: string) => {
          if (parseInt(quantity) <= 0) {
            throw new Error('quantity must be numeric and greater than 0');
          }

          return true;
        }),
      body('*.itemName').notEmpty().withMessage('itemName is required'),
    ];
  }
}
