import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { io, Socket } from 'socket.io-client'

export interface DishConfig {
  apiKey: string
  baseUrl?: string
  wsUrl?: string
}

export interface Project {
  id: string
  name: string
  description?: string
  language: string
  framework?: string
  isPublic: boolean
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface ProjectFile {
  id: string
  name: string
  path: string
  content: string
  language?: string
  size: number
  projectId: string
  createdAt: string
  updatedAt: string
}

export interface AIProvider {
  id: string
  name: string
  type: string
  isActive: boolean
  config: Record<string, any>
}

export interface AIRequest {
  provider: string
  prompt: string
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

export interface AIResponse {
  id: string
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  provider: string
  model: string
  createdAt: string
}

export interface SandboxExecution {
  id: string
  code: string
  language: string
  output?: string
  error?: string
  status: string
  userId: string
  createdAt: string
}

export class DishClient {
  private apiClient: AxiosInstance
  private wsClient?: Socket
  private config: DishConfig

  constructor(config: DishConfig) {
    this.config = config
    this.apiClient = axios.create({
      baseURL: config.baseUrl || 'https://api.dish-platform.dev',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    // Add request interceptor for logging
    this.apiClient.interceptors.request.use(
      (config) => {
        console.log(`Making request to ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Add response interceptor for error handling
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message)
        return Promise.reject(error)
      }
    )
  }

  // Project Management
  async getProjects(): Promise<Project[]> {
    const response = await this.apiClient.get('/projects')
    return response.data
  }

  async getProject(id: string): Promise<Project> {
    const response = await this.apiClient.get(`/projects/${id}`)
    return response.data
  }

  async createProject(project: Partial<Project>): Promise<Project> {
    const response = await this.apiClient.post('/projects', project)
    return response.data
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const response = await this.apiClient.patch(`/projects/${id}`, updates)
    return response.data
  }

  async deleteProject(id: string): Promise<void> {
    await this.apiClient.delete(`/projects/${id}`)
  }

  // File Management
  async getProjectFiles(projectId: string): Promise<ProjectFile[]> {
    const response = await this.apiClient.get(`/projects/${projectId}/files`)
    return response.data
  }

  async getProjectFile(projectId: string, filePath: string): Promise<ProjectFile> {
    const response = await this.apiClient.get(`/projects/${projectId}/files/${encodeURIComponent(filePath)}`)
    return response.data
  }

  async createProjectFile(projectId: string, file: Partial<ProjectFile>): Promise<ProjectFile> {
    const response = await this.apiClient.post(`/projects/${projectId}/files`, file)
    return response.data
  }

  async updateProjectFile(projectId: string, filePath: string, updates: Partial<ProjectFile>): Promise<ProjectFile> {
    const response = await this.apiClient.patch(`/projects/${projectId}/files/${encodeURIComponent(filePath)}`, updates)
    return response.data
  }

  async deleteProjectFile(projectId: string, filePath: string): Promise<void> {
    await this.apiClient.delete(`/projects/${projectId}/files/${encodeURIComponent(filePath)}`)
  }

  // AI Integration
  async getAIProviders(): Promise<AIProvider[]> {
    const response = await this.apiClient.get('/ai/providers')
    return response.data
  }

  async generateCode(request: AIRequest): Promise<AIResponse> {
    const response = await this.apiClient.post('/ai/generate', request)
    return response.data
  }

  async generateCodeStream(request: AIRequest, onChunk: (chunk: string) => void): Promise<void> {
    const response = await this.apiClient.post('/ai/generate/stream', request, {
      responseType: 'stream'
    })

    response.data.on('data', (chunk: Buffer) => {
      const lines = chunk.toString().split('\n')
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))
            if (data.content) {
              onChunk(data.content)
            }
          } catch (error) {
            // Ignore parsing errors for incomplete chunks
          }
        }
      }
    })
  }

  async explainCode(code: string, language: string): Promise<AIResponse> {
    const response = await this.apiClient.post('/ai/explain', {
      code,
      language
    })
    return response.data
  }

  async optimizeCode(code: string, language: string): Promise<AIResponse> {
    const response = await this.apiClient.post('/ai/optimize', {
      code,
      language
    })
    return response.data
  }

  async generateTests(code: string, language: string): Promise<AIResponse> {
    const response = await this.apiClient.post('/ai/tests', {
      code,
      language
    })
    return response.data
  }

  // Sandbox Execution
  async executeCode(code: string, language: string): Promise<SandboxExecution> {
    const response = await this.apiClient.post('/sandbox/execute', {
      code,
      language
    })
    return response.data
  }

  async getExecutionStatus(executionId: string): Promise<SandboxExecution> {
    const response = await this.apiClient.get(`/sandbox/executions/${executionId}`)
    return response.data
  }

  // Real-time Collaboration
  connectWebSocket(): Socket {
    if (this.wsClient) {
      return this.wsClient
    }

    this.wsClient = io(this.config.wsUrl || 'wss://api.dish-platform.dev', {
      auth: {
        token: this.config.apiKey
      }
    })

    return this.wsClient
  }

  joinProject(projectId: string): void {
    if (!this.wsClient) {
      this.connectWebSocket()
    }
    this.wsClient?.emit('join-project', projectId)
  }

  leaveProject(projectId: string): void {
    this.wsClient?.emit('leave-project', projectId)
  }

  onCodeChange(callback: (data: any) => void): void {
    this.wsClient?.on('code-change', callback)
  }

  onCursorMove(callback: (data: any) => void): void {
    this.wsClient?.on('cursor-move', callback)
  }

  emitCodeChange(data: any): void {
    this.wsClient?.emit('code-change', data)
  }

  emitCursorMove(data: any): void {
    this.wsClient?.emit('cursor-move', data)
  }

  // Utility Methods
  disconnect(): void {
    this.wsClient?.disconnect()
    this.wsClient = undefined
  }

  async healthCheck(): Promise<{ status: string; timestamp: string; version: string }> {
    const response = await this.apiClient.get('/health')
    return response.data
  }
}

// Export default instance factory
export function createDishClient(config: DishConfig): DishClient {
  return new DishClient(config)
}

// Export types
export * from './types'