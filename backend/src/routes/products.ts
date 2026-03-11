// backend/src/routes/products.ts
import { Router, Request, Response } from 'express';
import { db } from '../config/database';
import { Product } from '../types';

const router = Router();

/**
 * GET /api/products
 * Получить список всех товаров
 */
router.get('/', (req: Request, res: Response) => {
  const category = req.query.category as string;
  
  let query = 'SELECT * FROM products';
  const params: any[] = [];
  
  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }
  
  query += ' ORDER BY created_at DESC';
  
  db.all(query, params, (err, rows: Product[]) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка получения товаров' });
    }
    
    res.json({ success: true, data: rows });
  });
});

/**
 * GET /api/products/:id
 * Получить товар по ID
 */
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row: Product) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка получения товара' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    
    res.json({ success: true, data: row });
  });
});

export default router;