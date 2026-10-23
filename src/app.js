import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
// import helmet from 'helmet'
// import rateLimit from 'express-rate-limit'
import postsRouter from './routes/posts.js'
import { connectDB } from './config/db.js'

const app = express()(async () => {
  await connectDB()
})

console.log('process.env.CLIENT_URL', process.env.CLIENT_URL)

// app.disable('x-powered-by')
// app.use(helmet())

app.use(
  cors({})
  //   cors({
  //     origin: process.env.CLIENT_URL || 'http://localhost:5174'
  //   })
)

app.use(express.json({ limit: '32kb' }))

// app.use(
//   '/api',
//   rateLimit({
//     windowMs: 60 * 1000,
//     limit: 120,
//     standardHeaders: 'draft-7',
//     legacyHeaders: false
//   })
// )

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'orbit-api' })
})

app.use('/api/posts', postsRouter)

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found.' })
})

app.use((error, _req, res, _next) => {
  console.error(error)

  res.status(500).json({
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error.'
        : error.message
  })
})

export default app
