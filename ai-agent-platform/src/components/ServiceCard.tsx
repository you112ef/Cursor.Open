'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store/useStore'
import { useToast } from '@/components/ui/use-toast'

interface ServiceCardProps {
  service: {
    id: string
    name: string
    description: string
    isAdded: boolean
    isAdding: boolean
  }
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { addService, setServiceAdding } = useStore()
  const { toast } = useToast()

  const handleAddService = async () => {
    setServiceAdding(service.id, true)
    
    toast({
      title: `Configuring ${service.name}...`,
      description: "Setting up integration and dependencies",
    })

    // Simulate integration process
    setTimeout(() => {
      addService(service.id)
      toast({
        title: `${service.name} Added Successfully!`,
        description: "Integration completed and ready to use",
      })
    }, 2000)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl"># {service.name}</CardTitle>
        <CardDescription className="text-base">
          {service.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleAddService}
          disabled={service.isAdded || service.isAdding}
          className="w-full"
          size="lg"
        >
          {service.isAdding 
            ? `Adding ${service.name}...` 
            : service.isAdded 
            ? `${service.name} Added` 
            : `+ Add ${service.name}`
          }
        </Button>
      </CardContent>
    </Card>
  )
}