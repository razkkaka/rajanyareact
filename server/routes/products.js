import express from 'express'
import multer from 'multer'
import path from 'path'
import db from '../db.js'
import { authenticateToken, requireOwner } from '../middleware/auth.js'

const router = express.Router()
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${path.basename(file.originalname)}`),
})
const upload = multer({ storage })

router.get('/', (req, res) => {
  try {
    const { category } = req.query
    let query = 'SELECT * FROM products'
    const params = []

    if (category && category !== 'all') {
      query += ' WHERE category = ?'
      params.push(category)
    }

    query += ' ORDER BY created_at DESC'
    const products = db.prepare(query).all(...params)
    res.json(products)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

router.get('/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)
    if (!product) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' })
    }
    res.json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

router.post('/', authenticateToken, requireOwner, upload.single('image'), (req, res) => {
  try {
    const { name, description, price, category, stock_status } = req.body
    const image = req.file ? `/uploads/${req.file.filename}` : null

    const result = db.prepare('INSERT INTO products (name, description, price, category, stock_status, image) VALUES (?, ?, ?, ?, ?, ?)')
      .run(name, description, Number(price), category || 'coffee', stock_status || 'available', image)

    res.status(201).json({ id: result.lastInsertRowid, message: 'Produk berhasil ditambahkan' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

router.put('/:id', authenticateToken, requireOwner, upload.single('image'), (req, res) => {
  try {
    const { name, description, price, category, stock_status } = req.body
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)
    if (!existing) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' })
    }

    const image = req.file ? `/uploads/${req.file.filename}` : existing.image
    db.prepare('UPDATE products SET name = ?, description = ?, price = ?, category = ?, stock_status = ?, image = ? WHERE id = ?')
      .run(name, description, Number(price), category, stock_status, image, req.params.id)

    res.json({ message: 'Produk berhasil diupdate' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

router.delete('/:id', authenticateToken, requireOwner, (req, res) => {
  try {
    const result = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id)
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' })
    }
    res.json({ message: 'Produk berhasil dihapus' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

export default router
