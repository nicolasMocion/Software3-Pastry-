import { Router } from 'express';
import * as productsController from '../controllers/productsController.js';
import {requireRoles} from '../middlewares/auth.js';
import {upload} from '../config/cloudinary.js';
import {crearProductoImages} from "../controllers/productsController.js";

const routerProducto = Router();



//  /api/products
routerProducto.get('/', requireRoles(['rol_admin','rol_chef']), productsController.obtenerProductos);
routerProducto.post('/', upload.array('imagenes', 5), crearProductoImages);
//routerProducto.get('/:id', getProductById);     // Get product by ID
//routerProducto.post('/', createProduct);       // Create product
//routerProducto.put('/:id', updateProduct);     // Update productml,
//routerProducto.delete('/:id', deleteProduct);  // Delete product
//routerProducto.delete('/:id', deleteProduct);  // Delete product

export default routerProducto;