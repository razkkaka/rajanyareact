import express from 'express'
import db from '../db.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authenticateToken, (req, res) => {
  try {
    const favorites = db.prepare(`
      SELECT f.id, f.product_id, p.name, p.price, p.image, p.stock_status, p.description
      FROM favorites f
      JOIN products p ON f.product_id = p.id
      WHERE f.user_id = ?
    `).all(req.user.id)
    res.json(favorites)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

router.get('/check/:productId', authenticateToken, (req, res) => {
  try {
    const favorite = db.prepare('SELECT id FROM favorites WHERE user_id = ? AND product_id = ?').get(req.user.id, req.params.productId)
    res.json({ isFavorited: !!favorite })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

router.post('/toggle/:productId', authenticateToken, (req, res) => {
  try {
    const existing = db.prepare('SELECT id FROM favorites WHERE user_id = ? AND product_id = ?').get(req.user.id, req.params.productId)
    if (existing) {
      db.prepare('DELETE FROM favorites WHERE id = ?').run(existing.id)
      res.json({ isFavorited: false, message: 'Dihapus dari favorit' })
    } else {
      db.prepare('INSERT INTO favorites (user_id, product_id) VALUES (?, ?)').run(req.user.id, req.params.productId)
      res.json({ isFavorited: true, message: 'Ditambahkan ke favorit' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

export default router
