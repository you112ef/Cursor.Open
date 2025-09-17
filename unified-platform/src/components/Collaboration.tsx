'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  UserPlus, 
  MessageCircle, 
  Video, 
  Mic, 
  MicOff,
  VideoOff,
  Share,
  Settings,
  Crown,
  Shield,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Send,
  Smile,
  Paperclip,
  Phone,
  PhoneOff,
  Monitor,
  MonitorOff
} from 'lucide-react'

interface User {
  id: string
  name: string
  avatar: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  status: 'online' | 'away' | 'busy' | 'offline'
  isTyping?: boolean
  cursor?: { x: number; y: number }
  color: string
}

interface Message {
  id: string
  userId: string
  content: string
  timestamp: Date
  type: 'text' | 'code' | 'file' | 'system'
}

interface CollaborationProps {
  projectId: string
  onUserJoin?: (user: User) => void
  onUserLeave?: (userId: string) => void
  onMessage?: (message: Message) => void
}

export default function Collaboration({ 
  projectId, 
  onUserJoin, 
  onUserLeave, 
  onMessage 
}: CollaborationProps) {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'You',
      avatar: '👤',
      role: 'owner',
      status: 'online',
      color: '#3b82f6'
    },
    {
      id: '2',
      name: 'Alice Johnson',
      avatar: '👩',
      role: 'admin',
      status: 'online',
      isTyping: true,
      color: '#ef4444'
    },
    {
      id: '3',
      name: 'Bob Smith',
      avatar: '👨',
      role: 'member',
      status: 'away',
      color: '#10b981'
    },
    {
      id: '4',
      name: 'Carol Davis',
      avatar: '👩‍💻',
      role: 'viewer',
      status: 'offline',
      color: '#f59e0b'
    }
  ])
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      userId: '2',
      content: 'Hey everyone! Ready to start working on this feature?',
      timestamp: new Date(Date.now() - 300000),
      type: 'text'
    },
    {
      id: '2',
      userId: '1',
      content: 'Absolutely! I\'ve been working on the authentication flow.',
      timestamp: new Date(Date.now() - 240000),
      type: 'text'
    },
    {
      id: '3',
      userId: '3',
      content: '```javascript\nconst auth = {\n  login: async (credentials) => {\n    // Implementation here\n  }\n};\n```',
      timestamp: new Date(Date.now() - 180000),
      type: 'code'
    },
    {
      id: '4',
      userId: '2',
      content: 'That looks great! Should we add error handling?',
      timestamp: new Date(Date.now() - 120000),
      type: 'text'
    }
  ])
  
  const [newMessage, setNewMessage] = useState('')
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [activeUsers, setActiveUsers] = useState<string[]>(['1', '2'])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      userId: '1',
      content: newMessage,
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
    onMessage?.(message)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-3 w-3 text-yellow-500" />
      case 'admin':
        return <Shield className="h-3 w-3 text-blue-500" />
      case 'member':
        return <Edit className="h-3 w-3 text-green-500" />
      case 'viewer':
        return <Eye className="h-3 w-3 text-gray-500" />
    }
  }

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'away':
        return 'bg-yellow-500'
      case 'busy':
        return 'bg-red-500'
      case 'offline':
        return 'bg-gray-400'
    }
  }

  const formatMessage = (content: string, type: Message['type']) => {
    if (type === 'code') {
      return (
        <pre className="bg-muted p-3 rounded-lg overflow-x-auto text-sm">
          <code>{content.replace(/```\w*\n?|\n?```/g, '')}</code>
        </pre>
      )
    }
    return content
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <Users className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Collaboration
            </h2>
            <p className="text-sm text-muted-foreground">
              {activeUsers.length} active users • Project: {projectId}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Call Controls */}
          <div className="p-4 border-b bg-card/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live Session</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activeUsers.length} participants
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={isMicOn ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsMicOn(!isMicOn)}
                >
                  {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant={isVideoOn ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                >
                  {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant={isScreenSharing ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                >
                  {isScreenSharing ? <Monitor className="h-4 w-4" /> : <MonitorOff className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => {
              const user = users.find(u => u.id === message.userId)
              if (!user) return null

              return (
                <div key={message.id} className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm">
                      {user.avatar}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{user.name}</span>
                      {getRoleIcon(user.role)}
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="bg-card border rounded-lg p-3">
                      {formatMessage(message.content, message.type)}
                    </div>
                  </div>
                </div>
              )
            })}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t bg-card/30">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="w-full px-4 py-2 pr-20 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Paperclip className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Smile className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Users Sidebar */}
        <div className="w-80 border-l bg-card/30 backdrop-blur">
          <div className="p-4 border-b">
            <h3 className="font-semibold mb-4">Participants</h3>
            
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    activeUsers.includes(user.id) ? 'bg-primary/10' : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm">
                      {user.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(user.status)}`}></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{user.name}</span>
                      {getRoleIcon(user.role)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                      {user.isTyping && (
                        <Badge variant="outline" className="text-xs">
                          typing...
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4">
            <h4 className="font-medium text-sm mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Team Member
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Share className="h-4 w-4 mr-2" />
                Share Project
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Collaboration Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}