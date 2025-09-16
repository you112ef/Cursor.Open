import { Router } from 'express'
import { AuthRequest } from '../middleware/auth'
import { prisma } from '../index'
import { createError } from '../middleware/errorHandler'

const router = Router()

// Get project files
router.get('/projects/:projectId/files', async (req: AuthRequest, res, next) => {
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

    const files = await prisma.projectFile.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' }
    })

    res.json(files)
  } catch (error) {
    next(error)
  }
})

// Get single file
router.get('/projects/:projectId/files/*', async (req: AuthRequest, res, next) => {
  try {
    const { projectId } = req.params
    const filePath = req.params[0]

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

    const file = await prisma.projectFile.findFirst({
      where: {
        projectId,
        path: filePath
      }
    })

    if (!file) {
      throw createError('File not found', 404)
    }

    res.json(file)
  } catch (error) {
    next(error)
  }
})

// Create file
router.post('/projects/:projectId/files', async (req: AuthRequest, res, next) => {
  try {
    const { projectId } = req.params
    const { name, path, content, language } = req.body

    if (!name || !path) {
      throw createError('Name and path are required', 400)
    }

    // Check if user has edit access to project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
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

    // Check if file already exists
    const existingFile = await prisma.projectFile.findFirst({
      where: {
        projectId,
        path
      }
    })

    if (existingFile) {
      throw createError('File already exists', 409)
    }

    const file = await prisma.projectFile.create({
      data: {
        name,
        path,
        content: content || '',
        language,
        size: (content || '').length,
        projectId
      }
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'FILE_CREATED',
        message: `Created file "${name}"`,
        userId: req.user!.id,
        projectId
      }
    })

    res.status(201).json(file)
  } catch (error) {
    next(error)
  }
})

// Update file
router.patch('/projects/:projectId/files/*', async (req: AuthRequest, res, next) => {
  try {
    const { projectId } = req.params
    const filePath = req.params[0]
    const { content, language } = req.body

    // Check if user has edit access to project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
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

    const file = await prisma.projectFile.findFirst({
      where: {
        projectId,
        path: filePath
      }
    })

    if (!file) {
      throw createError('File not found', 404)
    }

    const updatedFile = await prisma.projectFile.update({
      where: { id: file.id },
      data: {
        ...(content !== undefined && { 
          content,
          size: content.length
        }),
        ...(language !== undefined && { language })
      }
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'FILE_UPDATED',
        message: `Updated file "${file.name}"`,
        userId: req.user!.id,
        projectId
      }
    })

    res.json(updatedFile)
  } catch (error) {
    next(error)
  }
})

// Delete file
router.delete('/projects/:projectId/files/*', async (req: AuthRequest, res, next) => {
  try {
    const { projectId } = req.params
    const filePath = req.params[0]

    // Check if user has edit access to project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
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

    const file = await prisma.projectFile.findFirst({
      where: {
        projectId,
        path: filePath
      }
    })

    if (!file) {
      throw createError('File not found', 404)
    }

    await prisma.projectFile.delete({
      where: { id: file.id }
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'FILE_DELETED',
        message: `Deleted file "${file.name}"`,
        userId: req.user!.id,
        projectId
      }
    })

    res.json({ message: 'File deleted successfully' })
  } catch (error) {
    next(error)
  }
})

export default router