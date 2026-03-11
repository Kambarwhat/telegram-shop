// backend/src/routes/orders.ts
import { Router, Request, Response } from 'express';
import { db } from '../config/database';
import { authMiddleware } from '../middleware/auth';
import { OrderItem } from '../types';

const router = Router();

/**
 * POST /api/orders
 * Создать новый заказ (требуется авторизация)
 */
router.post('/', authMiddleware, (req: Request, res: Response) => {
  const { items } = req.body;
  const userId = req.telegramUser?.id;
  const username = req.telegramUser?.username;
  
  if (!userId) {
    return res.status(401).json({ error: 'Пользователь не авторизован' });
  }
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Корзина пуста' });
  }
  
  // Вычисляем общую сумму
  const totalAmount = items.reduce((sum: number, item: OrderItem) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  // Сохраняем пользователя если его нет
  db.run(
    'INSERT OR IGNORE INTO users (id, username, first_name, last_name) VALUES (?, ?, ?, ?)',
    [
      userId,
      username,
      req.telegramUser?.first_name,
      req.telegramUser?.last_name,
    ]
  );
  
  // Создаём заказ
  db.run(
    `INSERT INTO orders (user_id, username, items, total_amount, status)
     VALUES (?, ?, ?, ?, 'pending')`,
    [
      userId,
      username,
      JSON.stringify(items),
      totalAmount,
    ],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Ошибка создания заказа' });
      }
      
      const orderId = this.lastID;
      
      // Отправляем уведомление боту (опционально)
      notifyAboutOrder(orderId, userId, totalAmount, items);
      
      res.json({
        success: true,
        data: {
          id: orderId,
          totalAmount,
          status: 'pending',
        },
      });
    }
  );
});

/**
 * GET /api/orders
 * Получить историю заказов пользователя (требуется авторизация)
 */
router.get('/', authMiddleware, (req: Request, res: Response) => {
  const userId = req.telegramUser?.id;
  
  if (!userId) {
    return res.status(401).json({ error: 'Пользователь не авторизован' });
  }
  
  db.all(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Ошибка получения заказов' });
      }
      
      // Парсим items из JSON
      const orders = rows.map((row: any) => ({
        ...row,
        items: JSON.parse(row.items),
      }));
      
      res.json({ success: true, data: orders });
    }
  );
});

/**
 * Уведомление о новом заказе (отправляется в бот)
 */
async function notifyAboutOrder(
  orderId: number,
  userId: number,
  totalAmount: number,
  items: OrderItem[]
) {
  // Здесь можно отправить уведомление администратору
  // Пример: через bot.telegram.sendMessage()
  console.log(`📦 Новый заказ #${orderId} на сумму ${totalAmount}₽`);
}

export default router;