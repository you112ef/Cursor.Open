const express = require('express')
const { exec } = require('child_process')
const { promisify } = require('util')
const cors = require('cors')

const app = express()
const execAsync = promisify(exec)

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

// Execute code endpoint
app.post('/execute', async (req, res) => {
  try {
    const { code, language } = req.body

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' })
    }

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
            timeout: 10000,
            cwd: '/sandbox'
          })
          output = jsResult.stdout
          break

        case 'python':
        case 'py':
          const pyResult = await execAsync(`python3 -c "${code.replace(/"/g, '\\"')}"`, {
            timeout: 10000,
            cwd: '/sandbox'
          })
          output = pyResult.stdout
          break

        case 'typescript':
        case 'ts':
          // Write to temporary file and execute
          const fs = require('fs')
          const path = require('path')
          const tempFile = path.join('/sandbox', `temp_${Date.now()}.ts`)
          
          fs.writeFileSync(tempFile, code)
          const tsResult = await execAsync(`npx ts-node ${tempFile}`, {
            timeout: 10000,
            cwd: '/sandbox'
          })
          output = tsResult.stdout
          fs.unlinkSync(tempFile)
          break

        default:
          throw new Error(`Unsupported language: ${language}`)
      }
    } catch (execError) {
      status = 'error'
      error = execError.message || 'Execution failed'
      output = execError.stdout || ''
    }

    res.json({
      output,
      error,
      status,
      language,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Sandbox error:', error)
  res.status(500).json({ error: 'Internal server error' })
})

const PORT = process.env.PORT || 3002
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Sandbox server running on port ${PORT}`)
})