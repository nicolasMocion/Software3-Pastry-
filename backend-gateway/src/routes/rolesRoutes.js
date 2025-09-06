import { Router } from 'express';
import { getRoles } from '../controllers/roleController.js';

const routerRole = Router();

// Public endpoint to get roles for frontend
routerRole.get('/roles', getRoles);

export default routerRole;