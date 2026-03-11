// backend/src/config/database.ts
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

// Создаём папку для БД если не существует
const dbDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'shop.db');

// Создаём подключение к БД
export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Ошибка подключения к БД:', err);
  } else {
    console.log('✅ Подключено к SQLite:', dbPath);
    initializeDatabase();
  }
});

/**
 * Инициализация таблиц БД
 */
function initializeDatabase() {
  // Таблица товаров
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price INTEGER NOT NULL,
      image TEXT,
      category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Таблица заказов
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      username TEXT,
      items TEXT NOT NULL,
      total_amount INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Таблица пользователей (для истории заказов)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT,
      first_name TEXT,
      last_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Заполняем тестовыми товарами если таблица пустая
  db.get('SELECT COUNT(*) as count FROM products', (err, row: any) => {
    if (!err && row.count === 0) {
      seedProducts();
    }
  });
}

/**
 * Заполнение БД тестовыми товарами
 */
function seedProducts() {
  const products = [
    { name: 'iPhone 15 Pro', description: 'Флагманский смартфон Apple', price: 99990, image: 'https://via.placeholder.com/300?text=iPhone', category: 'smartphones' },
    { name: 'MacBook Air M2', description: 'Лёгкий и мощный ноутбук', price: 119990, image: 'https://via.placeholder.com/300?text=MacBook', category: 'laptops' },
    { name: 'AirPods Pro 2', description: 'Беспроводные наушники с шумоподавлением', price: 24990, image: 'https://via.placeholder.com/300?text=AirPods', category: 'audio' },
    { name: 'Apple Watch Ultra', description: 'Спортивные умные часы', price: 79990, image: 'https://via.placeholder.com/300?text=Watch', category: 'wearables' },
    { name: 'iPad Pro 12.9', description: 'Планшет для профессионалов', price: 109990, image: 'https://via.placeholder.com/300?text=iPad', category: 'tablets' },
    { name: 'Magic Keyboard', description: 'Беспроводная клавиатура', price: 14990, image: 'https://via.placeholder.com/300?text=Keyboard', category: 'accessories' },
  ];
  
  const stmt = db.prepare(`
    INSERT INTO products (name, description, price, image, category)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  for (const product of products) {
    stmt.run(product.name, product.description, product.price, product.image, product.category);
  }
  
  stmt.finalize();
  console.log('✅ Добавлено тестовых товаров:', products.length);
}

export default db;