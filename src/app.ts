import express, { Application } from 'express';
import bodyParser from 'body-parser';

import routers from './routers';
import { registerServices } from './services';

const app: Application = express();

registerServices(app);

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routers);

export default app;
