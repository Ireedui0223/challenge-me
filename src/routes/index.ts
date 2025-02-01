import { Router } from 'express';

import seedRouter from './seed.route';

const router = Router();

router.use(`/seed`, seedRouter);

export default router;
