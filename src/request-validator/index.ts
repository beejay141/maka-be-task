import { NextFunction, Request, Response } from 'express';
import { ValidationError, validationResult } from 'express-validator';
import { ErrorResponse } from '../utils/response.util';

export const validateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json(
      ErrorResponse(
        'Invalid request data',
        errors.array().map((e: ValidationError) => {
          return e.msg;
        })
      )
    );

  next();
};
