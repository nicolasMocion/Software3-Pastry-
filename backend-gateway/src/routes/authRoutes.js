import { Router } from 'express';
import * as authController from '../controllers/authController.js';


const routerAuth = Router();

routerAuth.post('/login', authController.login);

routerAuth.post('/register', authController.register);

export default routerAuth;