import { Router } from 'express'
import { AuthRequest } from '../middleware/auth'
import { prisma } from '../index'
import { createError } from '../middleware/errorHandler'

const router = Router()

// Get user profile
router.get('/profile', async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            projects: true,
            collaborations: true
          }
        }
      }
    })

    if (!user) {
      throw createError('User not found', 404)
    }

    res.json(user)
  } catch (error) {
    next(error)
  }
})

// Update user profile
router.patch('/profile', async (req: AuthRequest, res, next) => {
  try {
    const { firstName, lastName, avatar } = req.body

    const updatedUser = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(avatar !== undefined && { avatar })
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        updatedAt: true
      }
    })

    res.json(updatedUser)
  } catch (error) {
    next(error)
  }
})

// Get user's API keys
router.get('/api-keys', async (req: AuthRequest, res, next) => {
  try {
    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: req.user!.id },
      select: {
        id: true,
        name: true,
        provider: true,
        isActive: true,
        createdAt: true
      }
    })

    res.json(apiKeys)
  } catch (error) {
    next(error)
  }
})

// Create API key
router.post('/api-keys', async (req: AuthRequest, res, next) => {
  try {
    const { name, provider, key } = req.body

    if (!name || !provider || !key) {
      throw createError('Name, provider, and key are required', 400)
    }

    const apiKey = await prisma.apiKey.create({
      data: {
        name,
        provider,
        key,
        userId: req.user!.id
      },
      select: {
        id: true,
        name: true,
        provider: true,
        isActive: true,
        createdAt: true
      }
    })

    res.status(201).json(apiKey)
  } catch (error) {
    next(error)
  }
})

// Update API key
router.patch('/api-keys/:id', async (req: AuthRequest, res, next) => {
  try {
    const { name, isActive } = req.body

    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id
      }
    })

    if (!apiKey) {
      throw createError('API key not found', 404)
    }

    const updatedApiKey = await prisma.apiKey.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(isActive !== undefined && { isActive })
      },
      select: {
        id: true,
        name: true,
        provider: true,
        isActive: true,
        updatedAt: true
      }
    })

    res.json(updatedApiKey)
  } catch (error) {
    next(error)
  }
})

// Delete API key
router.delete('/api-keys/:id', async (req: AuthRequest, res, next) => {
  try {
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id
      }
    })

    if (!apiKey) {
      throw createError('API key not found', 404)
    }

    await prisma.apiKey.delete({
      where: { id: req.params.id }
    })

    res.json({ message: 'API key deleted successfully' })
  } catch (error) {
    next(error)
  }
})

export default router