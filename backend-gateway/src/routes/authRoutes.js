import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import {verifyToken} from '../middlewares/index.js';

const routerAuth = Router();

routerAuth.post('/login', authController.login);


routerAuth.post('/register', verifyToken, authController.register);

export default routerAuth;