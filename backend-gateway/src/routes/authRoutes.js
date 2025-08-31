import { Router } from 'express';
import * as authController from '../controllers/AuthController';


const routerAuth = Router();

routerAuth.post('/login', authController.login);

routerAuth.post('/register', authController.register);

export default routerAuth;