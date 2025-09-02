import { Producto, CategoriaProducto } from '../model/inventario/index.js';

// Obtener todos los productos con sus categorías
export const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll({
            include: [{ model: CategoriaProducto, as: 'categoria' }],
            order: [['product_name', 'ASC']]
        });

        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo producto
export const crearProducto = async (req, res) => {
    try {
        const {
            producto_id,
            nombre_prod,
            stock_actual,
            stock_critico,
            description,
            precio_unidad,
            tiempo_preparacion_min,
            personalizable,
            categoria_prod_id,
            estado_id
        } = req.body;

        const producto = await Producto.create({
            product_id: producto_id,
            product_name: nombre_prod,
            current_stock: stock_actual || 0,
            critical_stock: stock_critico || 5,
            description,
            unit_price: precio_unidad,
            preparation_time_min: tiempo_preparacion_min || 0,
            customizable: personalizable || false,
            product_category_id: categoria_prod_id,
            status_id: estado_id || 'active'
        });

        // Cargar la categoría relacionada
        await producto.reload({
            include: [{ model: CategoriaProducto, as: 'categoria' }]
        });

        res.status(201).json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener productos por categoría
export const obtenerProductosPorCategoria = async (req, res) => {
    try {
        const { categoriaId } = req.params;

        const productos = await Producto.findByCategoria(categoriaId);

        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar stock de un producto
export const actualizarStock = async (req, res) => {
    try {
        const { productoId } = req.params;
        const { cantidad, tipoMovimiento } = req.body;

        const producto = await Producto.findByPk(productoId);

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        await producto.actualizarStock(cantidad, tipoMovimiento);

        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Si necesitas mantener la exportación por defecto también
export default {
    obtenerProductos,
    crearProducto,
    obtenerProductosPorCategoria,
    actualizarStock
};