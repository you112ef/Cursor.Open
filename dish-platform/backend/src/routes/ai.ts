import { Router } from 'express'
import { AuthRequest } from '../middleware/auth'
import { prisma } from '../index'
import { createError } from '../middleware/errorHandler'
import OpenAI from 'openai'

const router = Router()

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Get available AI providers
router.get('/providers', async (req: AuthRequest, res, next) => {
  try {
    const providers = [
      {
        id: 'openai',
        name: 'OpenAI',
        type: 'completion',
        isActive: !!process.env.OPENAI_API_KEY,
        models: ['gpt-4', 'gpt-3.5-turbo', 'gpt-4-turbo']
      },
      {
        id: 'anthropic',
        name: 'Anthropic',
        type: 'completion',
        isActive: !!process.env.ANTHROPIC_API_KEY,
        models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku']
      },
      {
        id: 'google',
        name: 'Google',
        type: 'completion',
        isActive: !!process.env.GOOGLE_API_KEY,
        models: ['gemini-pro', 'gemini-pro-vision']
      }
    ]

    res.json(providers)
  } catch (error) {
    next(error)
  }
})

// Generate code with AI
router.post('/generate', async (req: AuthRequest, res, next) => {
  try {
    const { provider, prompt, model, temperature, maxTokens } = req.body

    if (!provider || !prompt) {
      throw createError('Provider and prompt are required', 400)
    }

    let response

    switch (provider) {
      case 'openai':
        if (!process.env.OPENAI_API_KEY) {
          throw createError('OpenAI API key not configured', 400)
        }

        response = await openai.chat.completions.create({
          model: model || 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert software developer. Generate clean, efficient, and well-documented code based on the user\'s request.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: temperature || 0.7,
          max_tokens: maxTokens || 1000
        })

        break

      default:
        throw createError('Unsupported AI provider', 400)
    }

    const aiResponse = {
      id: response.id || 'unknown',
      content: response.choices[0]?.message?.content || '',
      usage: response.usage,
      provider,
      model: model || 'gpt-3.5-turbo',
      createdAt: new Date().toISOString()
    }

    res.json(aiResponse)
  } catch (error) {
    next(error)
  }
})

// Explain code
router.post('/explain', async (req: AuthRequest, res, next) => {
  try {
    const { code, language } = req.body

    if (!code) {
      throw createError('Code is required', 400)
    }

    const prompt = `Please explain the following ${language || 'code'}:\n\n\`\`\`${language || ''}\n${code}\n\`\`\``

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert software developer. Explain code in a clear, concise, and educational manner.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    })

    const aiResponse = {
      id: response.id,
      content: response.choices[0]?.message?.content || '',
      usage: response.usage,
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      createdAt: new Date().toISOString()
    }

    res.json(aiResponse)
  } catch (error) {
    next(error)
  }
})

// Optimize code
router.post('/optimize', async (req: AuthRequest, res, next) => {
  try {
    const { code, language } = req.body

    if (!code) {
      throw createError('Code is required', 400)
    }

    const prompt = `Please optimize the following ${language || 'code'} for better performance, readability, and best practices:\n\n\`\`\`${language || ''}\n${code}\n\`\`\``

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert software developer. Optimize code for performance, readability, and best practices while maintaining functionality.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500
    })

    const aiResponse = {
      id: response.id,
      content: response.choices[0]?.message?.content || '',
      usage: response.usage,
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      createdAt: new Date().toISOString()
    }

    res.json(aiResponse)
  } catch (error) {
    next(error)
  }
})

// Generate tests
router.post('/tests', async (req: AuthRequest, res, next) => {
  try {
    const { code, language } = req.body

    if (!code) {
      throw createError('Code is required', 400)
    }

    const prompt = `Please generate comprehensive unit tests for the following ${language || 'code'}:\n\n\`\`\`${language || ''}\n${code}\n\`\`\``

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert software developer. Generate comprehensive unit tests that cover edge cases and various scenarios.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500
    })

    const aiResponse = {
      id: response.id,
      content: response.choices[0]?.message?.content || '',
      usage: response.usage,
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      createdAt: new Date().toISOString()
    }

    res.json(aiResponse)
  } catch (error) {
    next(error)
  }
})

export default router