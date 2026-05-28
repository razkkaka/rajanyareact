import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'

const db = new Database('backseat.db')

export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      address TEXT,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'customer',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price INTEGER NOT NULL,
      image TEXT,
      category TEXT DEFAULT 'coffee',
      stock_status TEXT DEFAULT 'available',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id),
      UNIQUE(user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total_amount INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      payment_proof TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      price INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id),
      UNIQUE(user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS collaborations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_name TEXT NOT NULL,
      business_type TEXT NOT NULL,
      contact TEXT NOT NULL,
      message TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

  const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('fathia@backseat.com')
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('owner123', 10)
    db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(
      'Fathia Adhiana',
      'fathia@backseat.com',
      hashedPassword,
      'owner'
    )
  }

  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get()
  if (productCount.count === 0) {
    const products = [
      { name: 'Iced Palm Sugar Latte', description: 'Espresso, palm sugar, dan susu segar untuk rasa karamel yang lembut.', price: 28000, category: 'coffee', image: null, stock_status: 'available' },
      { name: 'Cold Brew', description: 'Kopi dingin 12 jam untuk cita rasa smooth dan low acidity.', price: 25000, category: 'coffee', image: null, stock_status: 'available' },
      { name: 'Matcha Latte', description: 'Matcha premium dengan susu segar, pilihan panas atau dingin.', price: 30000, category: 'non-coffee', image: null, stock_status: 'available' },
      { name: 'Caramel Macchiato', description: 'Espresso, susu, vanilla, dan drizzle caramel yang melimpah.', price: 32000, category: 'coffee', image: null, stock_status: 'available' },
      { name: 'Chocolate Frappe', description: 'Blended cokelat segar dengan whipped cream dan crunch.', price: 28000, category: 'non-coffee', image: null, stock_status: 'available' },
      { name: 'Espresso', description: 'Double shot espresso dengan crema pekat untuk kopi lovers.', price: 18000, category: 'coffee', image: null, stock_status: 'available' },
      { name: 'Taro Milk Tea', description: 'Teh susu taro creamy dengan topping boba lembut.', price: 25000, category: 'non-coffee', image: null, stock_status: 'available' },
      { name: 'Affogato', description: 'Vanilla ice cream disiram espresso panas yang menenangkan.', price: 35000, category: 'coffee', image: null, stock_status: 'available' },
    ]
    const insert = db.prepare('INSERT INTO products (name, description, price, category, image, stock_status) VALUES (?, ?, ?, ?, ?, ?)')
    products.forEach((product) => insert.run(product.name, product.description, product.price, product.category, product.image, product.stock_status))
  }
}

export default db
