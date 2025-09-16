import { Router } from 'express'
import { AuthRequest } from '../middleware/auth'
import { prisma } from '../index'
import { createError } from '../middleware/errorHandler'
import { exec } from 'child_process'
import { promisify } from 'util'

const router = Router()
const execAsync = promisify(exec)

// Execute code in sandbox
router.post('/execute', async (req: AuthRequest, res, next) => {
  try {
    const { code, language } = req.body

    if (!code || !language) {
      throw createError('Code and language are required', 400)
    }

    // Create execution record
    const execution = await prisma.sandboxExecution.create({
      data: {
        code,
        language,
        status: 'pending',
        userId: req.user!.id
      }
    })

    // Execute code based on language
    let output = ''
    let error = ''
    let status = 'success'

    try {
      switch (language.toLowerCase()) {
        case 'javascript':
        case 'js':
          const jsCode = `
            const { Console } = require('console');
            const console = new Console({
              stdout: process.stdout,
              stderr: process.stderr
            });
            ${code}
          `
          const jsResult = await execAsync(`node -e "${jsCode.replace(/"/g, '\\"')}"`, {
            timeout: 10000
          })
          output = jsResult.stdout
          break

        case 'python':
        case 'py':
          const pyResult = await execAsync(`python3 -c "${code.replace(/"/g, '\\"')}"`, {
            timeout: 10000
          })
          output = pyResult.stdout
          break

        case 'typescript':
        case 'ts':
          // Write to temporary file and execute
          const fs = require('fs')
          const path = require('path')
          const tempFile = path.join('/tmp', `temp_${Date.now()}.ts`)
          
          fs.writeFileSync(tempFile, code)
          const tsResult = await execAsync(`npx ts-node ${tempFile}`, {
            timeout: 10000
          })
          output = tsResult.stdout
          fs.unlinkSync(tempFile)
          break

        default:
          throw new Error(`Unsupported language: ${language}`)
      }
    } catch (execError: any) {
      status = 'error'
      error = execError.message || 'Execution failed'
      output = execError.stdout || ''
    }

    // Update execution record
    const updatedExecution = await prisma.sandboxExecution.update({
      where: { id: execution.id },
      data: {
        output,
        error,
        status
      }
    })

    res.json(updatedExecution)
  } catch (error) {
    next(error)
  }
})

// Get execution status
router.get('/executions/:id', async (req: AuthRequest, res, next) => {
  try {
    const execution = await prisma.sandboxExecution.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id
      }
    })

    if (!execution) {
      throw createError('Execution not found', 404)
    }

    res.json(execution)
  } catch (error) {
    next(error)
  }
})

// Get user's execution history
router.get('/executions', async (req: AuthRequest, res, next) => {
  try {
    const executions = await prisma.sandboxExecution.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    res.json(executions)
  } catch (error) {
    next(error)
  }
})

export default router