import { Router } from 'express';
import { getProducts, getProductById, updateProduct, deleteProduct, createProduct} from '../controllers/productsController.js';

const router = Router();

// GET /api/products
router.get('/', getProducts);              // Get all products
router.get('/:id', getProductById);     // Get product by ID
router.post('/', createProduct);       // Create product
router.put('/:id', updateProduct);     // Update productml,  
router.delete('/:id', deleteProduct);  // Delete product

export default router;