import { Router } from 'express'
import { AuthRequest } from '../middleware/auth'
import { prisma } from '../index'
import { createError } from '../middleware/errorHandler'

const router = Router()

// Add collaborator to project
router.post('/projects/:projectId/collaborators', async (req: AuthRequest, res, next) => {
  try {
    const { projectId } = req.params
    const { userId, role } = req.body

    if (!userId || !role) {
      throw createError('User ID and role are required', 400)
    }

    // Check if user is project owner
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: req.user!.id
      }
    })

    if (!project) {
      throw createError('Project not found or insufficient permissions', 404)
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, email: true }
    })

    if (!user) {
      throw createError('User not found', 404)
    }

    // Check if collaboration already exists
    const existingCollaboration = await prisma.projectCollaborator.findFirst({
      where: {
        projectId,
        userId
      }
    })

    if (existingCollaboration) {
      throw createError('User is already a collaborator', 409)
    }

    const collaboration = await prisma.projectCollaborator.create({
      data: {
        projectId,
        userId,
        role
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'COLLABORATOR_ADDED',
        message: `Added ${user.username} as ${role}`,
        userId: req.user!.id,
        projectId
      }
    })

    res.status(201).json(collaboration)
  } catch (error) {
    next(error)
  }
})

// Update collaborator role
router.patch('/projects/:projectId/collaborators/:userId', async (req: AuthRequest, res, next) => {
  try {
    const { projectId, userId } = req.params
    const { role } = req.body

    if (!role) {
      throw createError('Role is required', 400)
    }

    // Check if user is project owner
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: req.user!.id
      }
    })

    if (!project) {
      throw createError('Project not found or insufficient permissions', 404)
    }

    const collaboration = await prisma.projectCollaborator.findFirst({
      where: {
        projectId,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    if (!collaboration) {
      throw createError('Collaboration not found', 404)
    }

    const updatedCollaboration = await prisma.projectCollaborator.update({
      where: { id: collaboration.id },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'COLLABORATOR_UPDATED',
        message: `Updated ${collaboration.user.username}'s role to ${role}`,
        userId: req.user!.id,
        projectId
      }
    })

    res.json(updatedCollaboration)
  } catch (error) {
    next(error)
  }
})

// Remove collaborator
router.delete('/projects/:projectId/collaborators/:userId', async (req: AuthRequest, res, next) => {
  try {
    const { projectId, userId } = req.params

    // Check if user is project owner
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: req.user!.id
      }
    })

    if (!project) {
      throw createError('Project not found or insufficient permissions', 404)
    }

    const collaboration = await prisma.projectCollaborator.findFirst({
      where: {
        projectId,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    })

    if (!collaboration) {
      throw createError('Collaboration not found', 404)
    }

    await prisma.projectCollaborator.delete({
      where: { id: collaboration.id }
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'COLLABORATOR_REMOVED',
        message: `Removed ${collaboration.user.username} from project`,
        userId: req.user!.id,
        projectId
      }
    })

    res.json({ message: 'Collaborator removed successfully' })
  } catch (error) {
    next(error)
  }
})

// Get project collaborators
router.get('/projects/:projectId/collaborators', async (req: AuthRequest, res, next) => {
  try {
    const { projectId } = req.params

    // Check if user has access to project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: req.user!.id },
          {
            collaborators: {
              some: {
                userId: req.user!.id
              }
            }
          }
        ]
      }
    })

    if (!project) {
      throw createError('Project not found or access denied', 404)
    }

    const collaborators = await prisma.projectCollaborator.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true
          }
        }
      },
      orderBy: { joinedAt: 'asc' }
    })

    res.json(collaborators)
  } catch (error) {
    next(error)
  }
})

export default router