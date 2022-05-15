import { Router } from 'express';

import { getKinds } from '../controllers/kindsController.js';

const kindsRouter = Router();

kindsRouter.get('/kinds', getKinds);

export default kindsRouter;
