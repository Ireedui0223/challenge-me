import { Router } from 'express';
import { UserController } from '../controller/user/user.controller';

export const router = Router();

router.get('/seedAdmin', async (__, res) => {
  try {
    res.json({
      message: await UserController.seedAdmin(),
      success: true
    });
  } catch (error) {
    res.json({
      message: error.message,
      success: false
    });
  }
});

export default router;
