import 'dotenv/config'
import mongoose from 'mongoose'
import app from './app.js'
import { connectDB } from './config/db.js'

const port = Number(process.env.PORT) || 5000

try {
  await connectDB()

  const server = app.listen(port, () => {
    console.log(`Orbit API running at http://localhost:${port}`)
  })

  async function shutdown () {
    server.close(async () => {
      await mongoose.disconnect()
      process.exit(0)
    })
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
} catch (error) {
  console.error('Failed to start server:', error.message)
  process.exit(1)
}
