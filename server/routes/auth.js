import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

router.post('/register', (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nama, email, dan password wajib diisi' })
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password minimal 8 karakter' })
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
    if (existing) {
      return res.status(409).json({ error: 'Email sudah terdaftar' })
    }

    const hashedPassword = bcrypt.hashSync(password, 10)
    const result = db.prepare('INSERT INTO users (name, email, phone, address, password) VALUES (?, ?, ?, ?, ?)')
      .run(name, email, phone || null, address || null, hashedPassword)

    res.status(201).json({ user: { id: result.lastInsertRowid, name, email, phone, address, role: 'customer' } })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password wajib diisi' })
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
    if (!user) {
      return res.status(401).json({ error: 'Email atau password salah' })
    }

    const validPassword = bcrypt.compareSync(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: 'Email atau password salah' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, phone, address, role FROM users WHERE id = ?').get(req.user.id)
    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan' })
    }
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

export default router
