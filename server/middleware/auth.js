import jwt from 'jsonwebtoken'

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token diperlukan' })
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token tidak valid' })
    }
    req.user = user
    next()
  })
}

export function requireOwner(req, res, next) {
  if (req.user.role !== 'owner' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Akses ditolak' })
  }
  next()
}
