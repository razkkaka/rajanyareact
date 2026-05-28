import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { mkdirSync } from 'fs'
import { initDB } from './db.js'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import cartRoutes from './routes/cart.js'
import orderRoutes from './routes/orders.js'
import favoriteRoutes from './routes/favorites.js'
import collaborationRoutes from './routes/collaboration.js'
import aiRoutes from './routes/ai.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const PORT = Number(process.env.PORT || 3000)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mkdirSync(path.join(__dirname, '../uploads'), { recursive: true })
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

initDB()

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/favorites', favoriteRoutes)
app.use('/api/collaboration', collaborationRoutes)
app.use('/api/ai', aiRoutes)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`?? Backseat Barista server running on port ${PORT}`)
})
