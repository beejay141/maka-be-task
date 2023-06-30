import { ValidationChain, param } from 'express-validator';

export class ShowRequestValidator {
  static validateShowIdAndItemId(): ValidationChain[] {
    return [
      param('showId').isNumeric().withMessage('showId must be a number'),
      param('itemId').isNumeric().withMessage('itemId must be a number'),
    ];
  }

  static validateShowId(): ValidationChain[] {
    return [param('showId').isNumeric().withMessage('showId must be a number')];
  }
}
