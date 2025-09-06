import { Router } from 'express';
import * as rolesController from '../controllers/rolesController.js';

const routerRole = Router();

routerRole.get('/',rolesController.getAllRoles);

export default routerRole;