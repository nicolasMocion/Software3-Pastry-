import { pool } from "../config/db.js";


export const getProducts = async (req, res) => {
    try {
        const result = await pool.query(`
        select *
            from producto
                     limit 10;
    `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Database Query failed Server Error' });
    }
};

export const getProductById = async (req, res) => {
    const { id } = req.params;

    // Validate UUID before querying
    if (!isUuid(id)) {
        return res.status(400).json({ error: 'Invalid UUID format' });
    }

    try {
        const result = await pool.query(`
      SELECT id, category_id, name, description, base_price, 
             preparation_time_hours, image_url, is_customizable, 
             is_active, is_featured, created_at, updated_at
      FROM products
      WHERE id = $1;
    `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ error: 'Database Query failed Server Error' });
    }
};

export const createProduct = async (req, res) => {
    const {
      category_id,
      name,
      description,
      base_price,
      preparation_time_hours = 1,
      image_url = '',
      is_customizable = false,
      is_active = true,
      is_featured = false
    } = req.body;
  
    const now = new Date(); // current timestamp for created_at and updated_at
  
    try {
      const result = await pool.query(
        `INSERT INTO products 
         (category_id, name, description, base_price, preparation_time_hours, image_url, is_customizable, is_active, is_featured, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         RETURNING *;`,
        [
          category_id,
          name,
          description,
          base_price,
          preparation_time_hours,
          image_url,
          is_customizable,
          is_active,
          is_featured,
          now,
          now
        ]
      );
  
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Database insert failed' });
    }
  };
  
export const updateProduct = async (req, res) => {  
    const { id } = req.params;
  const {
    category_id,
    name,
    description,
    base_price,
    preparation_time_hours,
    image_url,
    is_customizable,
    is_active,
    is_featured
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE products
       SET category_id=$1, name=$2, description=$3, base_price=$4, preparation_time_hours=$5,
           image_url=$6, is_customizable=$7, is_active=$8, is_featured=$9, updated_at=NOW()
       WHERE id=$10
       RETURNING *`,
      [category_id, name, description, base_price, preparation_time_hours, image_url, is_customizable, is_active, is_featured, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Database update failed' });
  }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query(
        `DELETE FROM products WHERE id=$1 RETURNING *`,
        [id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.json({ message: 'Product deleted', product: result.rows[0] });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Database delete failed' });
    }
  };
  

