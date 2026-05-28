import express from 'express'
import db from '../db.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authenticateToken, (req, res) => {
  try {
    const cartItems = db.prepare(`
      SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image, p.stock_status
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
      ORDER BY c.id ASC
    `).all(req.user.id)

    res.json(cartItems)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

router.post('/', authenticateToken, (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(product_id)
    if (!product) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' })
    }
    if (product.stock_status === 'out_of_stock') {
      return res.status(400).json({ error: 'Stok tidak mencukupi' })
    }

    const existing = db.prepare('SELECT * FROM cart WHERE user_id = ? AND product_id = ?').get(req.user.id, product_id)
    if (existing) {
      db.prepare('UPDATE cart SET quantity = quantity + ? WHERE id = ?').run(Number(quantity), existing.id)
    } else {
      db.prepare('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)').run(req.user.id, product_id, Number(quantity))
    }

    res.json({ message: 'Produk ditambahkan ke keranjang' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { quantity } = req.body
    if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
      return res.status(400).json({ error: 'Kuantitas harus diisi' })
    }

    const result = db.prepare('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?').run(Number(quantity), req.params.id, req.user.id)
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Item tidak ditemukan' })
    }

    res.json({ message: 'Keranjang diperbarui' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const result = db.prepare('DELETE FROM cart WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id)
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Item tidak ditemukan' })
    }
    res.json({ message: 'Produk dihapus dari keranjang' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

router.delete('/', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM cart WHERE user_id = ?').run(req.user.id)
    res.json({ message: 'Keranjang dikosongkan' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

export default router
