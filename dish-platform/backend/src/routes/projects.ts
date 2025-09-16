import { Router } from 'express'
import { AuthRequest } from '../middleware/auth'
import { prisma } from '../index'
import { createError } from '../middleware/errorHandler'

const router = Router()

// Get all projects for user
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
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
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
          }
        },
        collaborators: {
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
        },
        _count: {
          select: {
            files: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    res.json(projects)
  } catch (error) {
    next(error)
  }
})

// Get single project
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.id,
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
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
          }
        },
        collaborators: {
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
        },
        files: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    if (!project) {
      throw createError('Project not found', 404)
    }

    res.json(project)
  } catch (error) {
    next(error)
  }
})

// Create new project
router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const { name, description, language, framework, isPublic } = req.body

    if (!name) {
      throw createError('Project name is required', 400)
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        language: language || 'typescript',
        framework,
        isPublic: isPublic || false,
        ownerId: req.user!.id
      },
      include: {
        owner: {
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
        type: 'PROJECT_CREATED',
        message: `Created project "${name}"`,
        userId: req.user!.id,
        projectId: project.id
      }
    })

    res.status(201).json(project)
  } catch (error) {
    next(error)
  }
})

// Update project
router.patch('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { name, description, language, framework, isPublic } = req.body

    // Check if user has permission to update
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.id,
        OR: [
          { ownerId: req.user!.id },
          {
            collaborators: {
              some: {
                userId: req.user!.id,
                role: { in: ['OWNER', 'EDITOR'] }
              }
            }
          }
        ]
      }
    })

    if (!project) {
      throw createError('Project not found or insufficient permissions', 404)
    }

    const updatedProject = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(language && { language }),
        ...(framework !== undefined && { framework }),
        ...(isPublic !== undefined && { isPublic })
      },
      include: {
        owner: {
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
        type: 'PROJECT_UPDATED',
        message: `Updated project "${updatedProject.name}"`,
        userId: req.user!.id,
        projectId: updatedProject.id
      }
    })

    res.json(updatedProject)
  } catch (error) {
    next(error)
  }
})

// Delete project
router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    // Check if user is owner
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.id,
        ownerId: req.user!.id
      }
    })

    if (!project) {
      throw createError('Project not found or insufficient permissions', 404)
    }

    await prisma.project.delete({
      where: { id: req.params.id }
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'PROJECT_DELETED',
        message: `Deleted project "${project.name}"`,
        userId: req.user!.id
      }
    })

    res.json({ message: 'Project deleted successfully' })
  } catch (error) {
    next(error)
  }
})

export default router