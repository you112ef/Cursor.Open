'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Folder, 
  File, 
  FileText, 
  Image, 
  Code2, 
  Database,
  Music,
  Video,
  Archive,
  Plus,
  Upload,
  Download,
  Trash2,
  Edit,
  Copy,
  Move,
  Search,
  Filter,
  Grid,
  List,
  ChevronRight,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react'

interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  size?: number
  modified: Date
  path: string
  children?: FileItem[]
  isExpanded?: boolean
}

interface FileManagerProps {
  onFileSelect?: (file: FileItem) => void
  onFileEdit?: (file: FileItem) => void
  onFileDelete?: (file: FileItem) => void
}

export default function FileManager({ 
  onFileSelect, 
  onFileEdit, 
  onFileDelete 
}: FileManagerProps) {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: 'src',
      type: 'folder',
      modified: new Date(),
      path: '/src',
      isExpanded: true,
      children: [
        {
          id: '2',
          name: 'components',
          type: 'folder',
          modified: new Date(),
          path: '/src/components',
          children: [
            {
              id: '3',
              name: 'Button.tsx',
              type: 'file',
              size: 2048,
              modified: new Date(),
              path: '/src/components/Button.tsx'
            },
            {
              id: '4',
              name: 'Card.tsx',
              type: 'file',
              size: 1536,
              modified: new Date(),
              path: '/src/components/Card.tsx'
            }
          ]
        },
        {
          id: '5',
          name: 'pages',
          type: 'folder',
          modified: new Date(),
          path: '/src/pages',
          children: [
            {
              id: '6',
              name: 'index.tsx',
              type: 'file',
              size: 3072,
              modified: new Date(),
              path: '/src/pages/index.tsx'
            }
          ]
        },
        {
          id: '7',
          name: 'App.tsx',
          type: 'file',
          size: 1024,
          modified: new Date(),
          path: '/src/App.tsx'
        }
      ]
    },
    {
      id: '8',
      name: 'public',
      type: 'folder',
      modified: new Date(),
      path: '/public',
      children: [
        {
          id: '9',
          name: 'favicon.ico',
          type: 'file',
          size: 512,
          modified: new Date(),
          path: '/public/favicon.ico'
        },
        {
          id: '10',
          name: 'logo.png',
          type: 'file',
          size: 8192,
          modified: new Date(),
          path: '/public/logo.png'
        }
      ]
    },
    {
      id: '11',
      name: 'package.json',
      type: 'file',
      size: 4096,
      modified: new Date(),
      path: '/package.json'
    },
    {
      id: '12',
      name: 'README.md',
      type: 'file',
      size: 2048,
      modified: new Date(),
      path: '/README.md'
    }
  ])
  
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'file' | 'folder'>('all')

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return <Folder className="h-4 w-4 text-blue-500" />
    }
    
    const extension = file.name.split('.').pop()?.toLowerCase()
    
    switch (extension) {
      case 'tsx':
      case 'ts':
      case 'jsx':
      case 'js':
        return <Code2 className="h-4 w-4 text-green-500" />
      case 'json':
      case 'md':
      case 'txt':
        return <FileText className="h-4 w-4 text-gray-500" />
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return <Image className="h-4 w-4 text-purple-500" />
      case 'mp4':
      case 'avi':
      case 'mov':
        return <Video className="h-4 w-4 text-red-500" />
      case 'mp3':
      case 'wav':
      case 'flac':
        return <Music className="h-4 w-4 text-yellow-500" />
      case 'zip':
      case 'rar':
      case '7z':
        return <Archive className="h-4 w-4 text-orange-500" />
      case 'sql':
      case 'db':
        return <Database className="h-4 w-4 text-cyan-500" />
      default:
        return <File className="h-4 w-4 text-gray-400" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const toggleFolder = (file: FileItem) => {
    if (file.type === 'folder') {
      const updateFiles = (items: FileItem[]): FileItem[] => {
        return items.map(item => {
          if (item.id === file.id) {
            return { ...item, isExpanded: !item.isExpanded }
          }
          if (item.children) {
            return { ...item, children: updateFiles(item.children) }
          }
          return item
        })
      }
      setFiles(updateFiles(files))
    }
  }

  const handleFileClick = (file: FileItem) => {
    if (file.type === 'folder') {
      toggleFolder(file)
    } else {
      setSelectedFile(file)
      onFileSelect?.(file)
    }
  }

  const handleFileAction = (action: string, file: FileItem) => {
    switch (action) {
      case 'edit':
        onFileEdit?.(file)
        break
      case 'delete':
        onFileDelete?.(file)
        break
      case 'copy':
        navigator.clipboard.writeText(file.path)
        break
      case 'download':
        // Simulate download
        console.log('Downloading:', file.name)
        break
    }
  }

  const renderFileItem = (file: FileItem, level: number = 0) => {
    const isSelected = selectedFile?.id === file.id
    const hasChildren = file.children && file.children.length > 0
    
    return (
      <div key={file.id}>
        <div
          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
            isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => handleFileClick(file)}
        >
          {file.type === 'folder' && (
            <div className="flex-shrink-0">
              {file.isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          )}
          
          <div className="flex-shrink-0">
            {getFileIcon(file)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{file.name}</div>
            {file.type === 'file' && (
              <div className="text-xs text-muted-foreground">
                {file.size && formatFileSize(file.size)} • {file.modified.toLocaleDateString()}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {file.type === 'file' && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  handleFileAction('edit', file)
                }}
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                // Show context menu
              }}
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {file.type === 'folder' && file.isExpanded && file.children && (
          <div>
            {file.children.map(child => renderFileItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || file.type === filterType
    return matchesSearch && matchesFilter
  })

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <Folder className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              File Manager
            </h2>
            <p className="text-sm text-muted-foreground">Manage your project files</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-card/30">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'file' | 'folder')}
            className="px-3 py-2 border rounded-md bg-background text-sm"
          >
            <option value="all">All Items</option>
            <option value="file">Files Only</option>
            <option value="folder">Folders Only</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-4">
        {viewMode === 'list' ? (
          <div className="space-y-1">
            {filteredFiles.map(file => renderFileItem(file))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFiles.map(file => (
              <Card
                key={file.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedFile?.id === file.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleFileClick(file)}
              >
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-3">
                    {getFileIcon(file)}
                  </div>
                  <h3 className="font-medium text-sm truncate">{file.name}</h3>
                  {file.type === 'file' && file.size && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatFileSize(file.size)}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* File Info Panel */}
      {selectedFile && (
        <div className="border-t bg-card/30 p-4">
          <div className="flex items-center gap-3">
            {getFileIcon(selectedFile)}
            <div className="flex-1">
              <h3 className="font-medium">{selectedFile.name}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedFile.type === 'file' && selectedFile.size && formatFileSize(selectedFile.size)} • 
                Modified: {selectedFile.modified.toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy Path
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}