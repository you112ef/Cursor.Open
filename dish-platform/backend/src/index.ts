import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import Redis from 'ioredis'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { logger } from './utils/logger'
import { errorHandler } from './middleware/errorHandler'
import { authMiddleware } from './middleware/auth'
import { validateEnv } from './utils/validateEnv'

// Import routes
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import projectRoutes from './routes/projects'
import aiRoutes from './routes/ai'
import sandboxRoutes from './routes/sandbox'
import fileRoutes from './routes/files'
import collaborationRoutes from './routes/collaboration'

// Load environment variables
dotenv.config()

// Validate environment variables
validateEnv()

// Initialize Prisma client
export const prisma = new PrismaClient()

// Initialize Express app
const app = express()
const server = createServer(app)

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
})

// Initialize Redis for Socket.IO adapter
const pubClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')
const subClient = pubClient.duplicate()

io.adapter(createAdapter(pubClient, subClient))

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
})
app.use('/api/', limiter)

// Body parsing middleware
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/users', authMiddleware, userRoutes)
app.use('/api/projects', authMiddleware, projectRoutes)
app.use('/api/ai', authMiddleware, aiRoutes)
app.use('/api/sandbox', authMiddleware, sandboxRoutes)
app.use('/api/files', authMiddleware, fileRoutes)
app.use('/api/collaboration', authMiddleware, collaborationRoutes)

// Socket.IO connection handling
io.use((socket, next) => {
  // Add authentication middleware for Socket.IO
  const token = socket.handshake.auth.token
  if (!token) {
    return next(new Error('Authentication error'))
  }
  // Verify JWT token here
  next()
})

io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`)

  // Join project room for collaboration
  socket.on('join-project', (projectId: string) => {
    socket.join(`project-${projectId}`)
    logger.info(`User ${socket.id} joined project ${projectId}`)
  })

  // Leave project room
  socket.on('leave-project', (projectId: string) => {
    socket.leave(`project-${projectId}`)
    logger.info(`User ${socket.id} left project ${projectId}`)
  })

  // Handle real-time collaboration events
  socket.on('code-change', (data) => {
    socket.to(`project-${data.projectId}`).emit('code-change', data)
  })

  socket.on('cursor-move', (data) => {
    socket.to(`project-${data.projectId}`).emit('cursor-move', data)
  })

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`)
  })
})

// Error handling middleware
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully')
  await prisma.$disconnect()
  server.close(() => {
    logger.info('Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully')
  await prisma.$disconnect()
  server.close(() => {
    logger.info('Server closed')
    process.exit(0)
  })
})

// Start server
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
  logger.info(`Environment: ${process.env.NODE_ENV}`)
})

export { io }