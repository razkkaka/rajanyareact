import express from 'express'
import db from '../db.js'
import { authenticateToken, requireOwner } from '../middleware/auth.js'

const router = express.Router()

router.post('/', (req, res) => {
  try {
    const { business_name, business_type, contact, message } = req.body
    if (!business_name || !business_type || !contact) {
      return res.status(400).json({ error: 'Nama usaha, jenis, dan kontak wajib diisi' })
    }
    if (!/^\d+$/.test(String(contact))) {
      return res.status(400).json({ error: 'Nomor kontak harus berupa angka' })
    }

    const result = db.prepare('INSERT INTO collaborations (business_name, business_type, contact, message) VALUES (?, ?, ?, ?)')
      .run(business_name, business_type, contact, message || null)

    res.status(201).json({ id: result.lastInsertRowid, message: 'Pengajuan berhasil dikirim' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

router.get('/', authenticateToken, requireOwner, (req, res) => {
  try {
    const collaborations = db.prepare('SELECT * FROM collaborations ORDER BY created_at DESC').all()
    res.json(collaborations)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

router.put('/:id', authenticateToken, requireOwner, (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ['pending', 'approved', 'rejected']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status tidak valid' })
    }

    const result = db.prepare('UPDATE collaborations SET status = ? WHERE id = ?').run(status, req.params.id)
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Pengajuan tidak ditemukan' })
    }

    res.json({ message: 'Status pengajuan diupdate' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

export default router
