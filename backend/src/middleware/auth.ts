// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { validateTelegramInitData, parseTelegramInitData } from '../utils/crypto';
import { TelegramUser } from '../types';

// Расширяем интерфейс Request для доступа к данным пользователя
declare global {
  namespace Express {
    interface Request {
      telegramUser?: TelegramUser;
      telegramChatId?: number;
    }
  }
}

/**
 * Мидлваре для проверки initData от Telegram
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const botToken = process.env.BOT_TOKEN;
  
  if (!botToken) {
    return res.status(500).json({ error: 'BOT_TOKEN не настроен' });
  }
  
  // Получаем initData из заголовка или тела запроса
  const initData = req.headers['x-telegram-init-data'] as string || req.body.initData;
  
  if (!initData) {
    return res.status(401).json({ error: 'initData не предоставлена' });
  }
  
  // Валидируем initData
  const isValid = validateTelegramInitData(initData, botToken);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Невалидная initData' });
  }
  
  // Парсим данные пользователя
  const parsedData = parseTelegramInitData(initData);
  
  if (parsedData.user) {
    try {
      const user = JSON.parse(parsedData.user);
      req.telegramUser = {
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
      };
    } catch (e) {
      return res.status(400).json({ error: 'Неверный формат данных пользователя' });
    }
  }
  
  if (parsedData.chat_id) {
    req.telegramChatId = parseInt(parsedData.chat_id, 10);
  }
  
  next();
}