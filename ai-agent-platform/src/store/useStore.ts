import { create } from 'zustand'

export interface Service {
  id: string
  name: string
  description: string
  isAdded: boolean
  isAdding: boolean
}

export interface AgentActivity {
  id: string
  agent: string
  command: string
  output: string[]
  timestamp: Date
  status: 'running' | 'completed' | 'error'
}

interface AppState {
  services: Service[]
  agentActivities: AgentActivity[]
  isTerminalOpen: boolean
  currentAgent: string | null
  
  // Actions
  addService: (serviceId: string) => void
  setServiceAdding: (serviceId: string, isAdding: boolean) => void
  addAgentActivity: (activity: Omit<AgentActivity, 'id' | 'timestamp'>) => void
  updateAgentActivity: (id: string, updates: Partial<AgentActivity>) => void
  setTerminalOpen: (open: boolean) => void
  setCurrentAgent: (agent: string | null) => void
  clearAgentActivities: () => void
}

const initialServices: Service[] = [
  {
    id: 'supabase',
    name: 'Supabase',
    description: 'Open source Firebase alternative with Postgres, Auth, Storage, and more',
    isAdded: false,
    isAdding: false,
  },
  {
    id: 'upstash',
    name: 'Upstash',
    description: 'Serverless Redis and Kafka for modern applications',
    isAdded: false,
    isAdding: false,
  },
  {
    id: 'clerk',
    name: 'Clerk',
    description: 'Complete user management and authentication solution',
    isAdded: false,
    isAdding: false,
  },
  {
    id: 'sentry',
    name: 'Sentry',
    description: 'Error monitoring and performance tracking platform',
    isAdded: false,
    isAdding: false,
  },
]

export const useStore = create<AppState>((set) => ({
  services: initialServices,
  agentActivities: [],
  isTerminalOpen: false,
  currentAgent: null,

  addService: (serviceId: string) => {
    set((state) => ({
      services: state.services.map((service) =>
        service.id === serviceId
          ? { ...service, isAdded: true, isAdding: false }
          : service
      ),
    }))
  },

  setServiceAdding: (serviceId: string, isAdding: boolean) => {
    set((state) => ({
      services: state.services.map((service) =>
        service.id === serviceId ? { ...service, isAdding } : service
      ),
    }))
  },

  addAgentActivity: (activity) => {
    const newActivity: AgentActivity = {
      ...activity,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    }
    set((state) => ({
      agentActivities: [newActivity, ...state.agentActivities],
    }))
  },

  updateAgentActivity: (id: string, updates: Partial<AgentActivity>) => {
    set((state) => ({
      agentActivities: state.agentActivities.map((activity) =>
        activity.id === id ? { ...activity, ...updates } : activity
      ),
    }))
  },

  setTerminalOpen: (open: boolean) => {
    set({ isTerminalOpen: open })
  },

  setCurrentAgent: (agent: string | null) => {
    set({ currentAgent: agent })
  },

  clearAgentActivities: () => {
    set({ agentActivities: [] })
  },
}))