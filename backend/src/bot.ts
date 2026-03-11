import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN не найден в .env файле!');
}

const bot = new Telegraf(BOT_TOKEN);
const WEB_APP_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

bot.start((ctx) => {
  ctx.reply(
    '🛍️ Добро пожаловать в наш магазин!\n\nНажмите кнопку ниже, чтобы открыть каталог товаров.',
    Markup.keyboard([
      Markup.button.webApp('🛍️ Открыть магазин', WEB_APP_URL)
    ]).resize()
  );
});

bot.command('menu', (ctx) => {
  ctx.reply(
    '📦 Каталог товаров',
    Markup.inlineKeyboard([
      Markup.button.webApp('🛍️ Открыть магазин', WEB_APP_URL)
    ])
  );
});

export function startBot() {
  bot.launch();
  console.log('✅ Бот запущен!');
  
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

export { bot };