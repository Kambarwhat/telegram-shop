// backend/src/utils/crypto.ts
import crypto from 'crypto';

/**
 * Валидация initData от Telegram Web App
 * @param initData - строка initData из Telegram
 * @param botToken - токен вашего бота
 * @returns true если данные валидны
 */
export function validateTelegramInitData(initData: string, botToken: string): boolean {
  try {
    // Парсим строку initData в объект
    const urlParams = new URLSearchParams(initData);
    
    // Получаем hash для проверки
    const receivedHash = urlParams.get('hash');
    if (!receivedHash) {
      return false;
    }
    
    // Удаляем hash из параметров для вычисления своего хеша
    urlParams.delete('hash');
    
    // Сортируем параметры по алфавиту
    const sortedParams = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    // Создаём ключ подписи (HMAC-SHA256 от "WebAppData" с токеном бота)
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();
    
    // Вычисляем хеш от отсортированных параметров
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(sortedParams)
      .digest('hex');
    
    // Сравниваем хеши
    return calculatedHash === receivedHash;
  } catch (error) {
    console.error('Ошибка валидации initData:', error);
    return false;
  }
}

/**
 * Парсинг initData в объект
 */
export function parseTelegramInitData(initData: string): Record<string, string> {
  const params = new URLSearchParams(initData);
  const result: Record<string, string> = {};
  
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  
  return result;
}
