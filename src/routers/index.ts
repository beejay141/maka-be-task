import express, { Router, Response } from 'express';
import inventoryRouter from './inventory.router';
import showRouter from './show.router';
import { UNMAPPED_ROUTE_MESSAGE } from '../utils/constants';

const router: Router = express.Router();

router.use('/inventory', inventoryRouter);

router.use('/show', showRouter);

// for unmapped routes
router.use((_, res: Response) => {
  return res.status(404).json({ message: UNMAPPED_ROUTE_MESSAGE });
});

export default router;
