'use client'

import Collaboration from '@/components/Collaboration'

export default function CollaborationPage() {
  return (
    <div className="h-screen">
      <Collaboration 
        projectId="dish-platform"
        onUserJoin={(user) => console.log('User joined:', user)}
        onUserLeave={(userId) => console.log('User left:', userId)}
        onMessage={(message) => console.log('New message:', message)}
      />
    </div>
  )
}