import express from 'express'
import multer from 'multer'
import path from 'path'
import db from '../db.js'
import { authenticateToken, requireOwner } from '../middleware/auth.js'

const router = express.Router()
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `payment_${Date.now()}${path.extname(file.originalname)}`),
})
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (allowedTypes.includes(file.mimetype)) cb(null, true)
    else cb(new Error('Format file harus JPG atau PNG'), false)
  },
})

router.get('/', authenticateToken, (req, res) => {
  try {
    let orders
    if (req.user.role === 'owner' || req.user.role === 'admin') {
      orders = db.prepare(`
        SELECT o.*, u.name as customer_name, u.email as customer_email
        FROM orders o
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
      `).all()
    } else {
      orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id)
    }
    res.json(orders)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

router.get('/:id', authenticateToken, (req, res) => {
  try {
    const order = db.prepare(`
      SELECT o.*, u.name as customer_name, u.email as customer_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `).get(req.params.id)

    if (!order) {
      return res.status(404).json({ error: 'Pesanan tidak ditemukan' })
    }

    if (req.user.role !== 'owner' && req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Akses ditolak' })
    }

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(req.params.id)
    res.json({ ...order, items })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

router.post('/', authenticateToken, (req, res) => {
  try {
    const cartItems = db.prepare(`
      SELECT c.*, p.name, p.price, p.stock_status
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `).all(req.user.id)

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Keranjang masih kosong' })
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const orderResult = db.prepare('INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)')
      .run(req.user.id, totalAmount, 'pending')

    const orderId = orderResult.lastInsertRowid
    const insertItem = db.prepare('INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES (?, ?, ?, ?, ?)')
    cartItems.forEach((item) => {
      insertItem.run(orderId, item.product_id, item.name, item.price, item.quantity)
    })

    db.prepare('DELETE FROM cart WHERE user_id = ?').run(req.user.id)
    res.status(201).json({ orderId, total_amount: totalAmount, message: 'Pesanan berhasil dibuat' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

router.post('/:id/payment', authenticateToken, upload.single('payment_proof'), (req, res) => {
  try {
    const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id)
    if (!order) {
      return res.status(404).json({ error: 'Pesanan tidak ditemukan' })
    }
    if (!req.file) {
      return res.status(400).json({ error: 'File bukti pembayaran diperlukan' })
    }

    const paymentProof = `/uploads/${req.file.filename}`
    db.prepare('UPDATE orders SET payment_proof = ?, status = ? WHERE id = ?').run(paymentProof, 'waiting_verification', req.params.id)
    res.json({ message: 'Bukti pembayaran berhasil diunggah' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

router.put('/:id/status', authenticateToken, requireOwner, (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ['pending', 'waiting_verification', 'paid', 'processing', 'completed', 'rejected']

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status tidak valid' })
    }

    const result = db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id)
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Pesanan tidak ditemukan' })
    }

    res.json({ message: 'Status pesanan diupdate' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

router.get('/stats/summary', authenticateToken, requireOwner, (req, res) => {
  try {
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get()
    const totalRevenue = db.prepare('SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status IN (?, ?)').get('paid', 'completed')
    const pendingOrders = db.prepare('SELECT COUNT(*) as count FROM orders WHERE status = ?').get('waiting_verification')
    const completedOrders = db.prepare('SELECT COUNT(*) as count FROM orders WHERE status = ?').get('completed')

    res.json({
      total_orders: totalOrders.count,
      total_revenue: totalRevenue.total,
      pending_verification: pendingOrders.count,
      completed: completedOrders.count,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

export default router
