import express, { Router } from 'express';
import { validateRequest } from 'zod-express-middleware';
import { loginSchema, registerSchema } from '../libs/validate-schema';
import { registerUser, loginUser } from '../controllers/authController';

const router: Router = express.Router();

router.post(
  "/register",
  validateRequest({
    body: registerSchema
  }),
  registerUser
);

router.post(
  "/register",
  validateRequest({
    body: loginSchema
  }),
  loginUser
);

export default router;