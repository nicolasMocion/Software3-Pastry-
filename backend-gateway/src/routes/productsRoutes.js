import { Router } from 'express';
import * as productsController from '../controllers/productsController.js';

const routerProducto = Router();

// GET /api/products
routerProducto.get('/', productsController.obtenerProductos);              // Get all products
//routerProducto.get('/:id', getProductById);     // Get product by ID
//routerProducto.post('/', createProduct);       // Create product
//routerProducto.put('/:id', updateProduct);     // Update productml,
//routerProducto.delete('/:id', deleteProduct);  // Delete product

export default routerProducto;