# تصميم واجهة المستخدم وتجربة المستخدم - Cursor Agents Clone

## 🎨 فلسفة التصميم

### **المبادئ الأساسية**
1. **الوضوح والبساطة**: واجهة نظيفة غير معقدة تركز على المحتوى
2. **الكفاءة**: تقليل عدد النقرات المطلوبة للوصول للميزات الأساسية
3. **الاتساق**: استخدام عناصر تصميم موحدة عبر التطبيق
4. **الإستجابة**: تصميم يتكيف مع أحجام الشاشات المختلفة
5. **إمكانية الوصول**: دعم المستخدمين ذوي الاحتياجات الخاصة

### **شخصية التطبيق**
- **احترافي ومتطور**: يعكس طبيعة العمل التطويرية
- **ودود ومساعد**: AI يشعر المستخدم بأنه مساعد ذكي
- **موثوق وآمن**: يبعث الثقة في التعامل مع الكود الحساس

---

## 🖥️ تخطيط الواجهة الرئيسية

### **التخطيط العام (Layout)**
```
┌─────────────────────────────────────────────────────────────────┐
│                     Title Bar / Menu Bar                       │
├────────────┬──────────────────────────────────┬─────────────────┤
│            │                                  │                 │
│  Sidebar   │         Main Editor Area         │   Chat Panel    │
│   (300px)  │            (flexible)            │     (400px)     │
│            │                                  │                 │
│  File Tree │  ┌─────────────────────────────┐ │  ┌─────────────┐ │
│  Explorer  │  │      Code Editor Tabs       │ │  │   Agent     │ │
│            │  ├─────────────────────────────┤ │  │    Chat     │ │
│            │  │                             │ │  │             │ │
│            │  │      Monaco Editor          │ │  │             │ │
│            │  │                             │ │  │             │ │
│            │  │                             │ │  │             │ │
│            │  └─────────────────────────────┘ │  └─────────────┘ │
│            │                                  │                 │
├────────────┴──────────────────────────────────┴─────────────────┤
│                    Terminal / Output Panel                     │
│                           (200px)                              │
└─────────────────────────────────────────────────────────────────┘
```

### **Responsive Breakpoints**
- **Desktop**: 1200px+ (Full layout)
- **Tablet**: 768px - 1199px (Collapsible sidebar)
- **Mobile**: < 768px (Tab-based navigation)

---

## 🎨 نظام الألوان والمظاهر

### **Dark Theme (الوضع الداكن)**
```css
:root[data-theme="dark"] {
  /* Primary Colors */
  --bg-primary: #0d1117;          /* Background main */
  --bg-secondary: #161b22;        /* Sidebar, panels */
  --bg-tertiary: #21262d;         /* Cards, elevated elements */
  
  /* Text Colors */
  --text-primary: #f0f6fc;        /* Main text */
  --text-secondary: #8b949e;      /* Secondary text */
  --text-muted: #6e7681;          /* Muted text */
  
  /* Accent Colors */
  --accent-blue: #58a6ff;         /* Links, buttons */
  --accent-green: #3fb950;        /* Success states */
  --accent-orange: #d29922;       /* Warnings */
  --accent-red: #f85149;          /* Errors */
  --accent-purple: #a5a5ff;       /* AI elements */
  
  /* Border Colors */
  --border-primary: #30363d;      /* Main borders */
  --border-secondary: #21262d;    /* Subtle borders */
  
  /* Editor Colors */
  --editor-bg: #0d1117;
  --editor-line-numbers: #6e7681;
  --editor-selection: #264f78;
  --editor-cursor: #f0f6fc;
}
```

### **Light Theme (الوضع الفاتح)**
```css
:root[data-theme="light"] {
  /* Primary Colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f6f8fa;
  --bg-tertiary: #f1f3f5;
  
  /* Text Colors */
  --text-primary: #1f2328;
  --text-secondary: #656d76;
  --text-muted: #8b949e;
  
  /* Accent Colors */
  --accent-blue: #0969da;
  --accent-green: #1a7f37;
  --accent-orange: #d1242f;
  --accent-red: #cf222e;
  --accent-purple: #6639ba;
  
  /* Border Colors */
  --border-primary: #d1d9e0;
  --border-secondary: #eaeef2;
  
  /* Editor Colors */
  --editor-bg: #ffffff;
  --editor-line-numbers: #8b949e;
  --editor-selection: #b6e3ff;
  --editor-cursor: #1f2328;
}
```

---

## 📝 التايبوجرافيا

### **نظام الخطوط**
```css
/* Font Families */
--font-ui: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Source Code Pro', monospace;
--font-title: 'Inter', --font-ui;

/* Font Sizes */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 2rem;       /* 32px */

/* Line Heights */
--leading-tight: 1.2;
--leading-normal: 1.5;
--leading-relaxed: 1.75;

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## 🧩 مكونات الواجهة الأساسية

### **1. Title Bar**
```tsx
interface TitleBarProps {
  title: string;
  isMaximized: boolean;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
}

const TitleBar: React.FC<TitleBarProps> = ({ title, isMaximized, onMinimize, onMaximize, onClose }) => (
  <div className="h-8 bg-bg-secondary border-b border-border-primary flex items-center justify-between px-4 select-none">
    <div className="flex items-center space-x-2">
      <img src="/logo.svg" alt="Logo" className="w-4 h-4" />
      <span className="text-sm font-medium text-text-primary">{title}</span>
    </div>
    
    <div className="flex items-center space-x-1">
      <button onClick={onMinimize} className="w-6 h-6 hover:bg-bg-tertiary rounded flex items-center justify-center">
        <MinimizeIcon size={14} />
      </button>
      <button onClick={onMaximize} className="w-6 h-6 hover:bg-bg-tertiary rounded flex items-center justify-center">
        {isMaximized ? <RestoreIcon size={14} /> : <MaximizeIcon size={14} />}
      </button>
      <button onClick={onClose} className="w-6 h-6 hover:bg-accent-red rounded flex items-center justify-center">
        <CloseIcon size={14} />
      </button>
    </div>
  </div>
);
```

### **2. Sidebar Navigation**
```tsx
interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType;
  badge?: number;
  shortcut?: string;
}

const Sidebar: React.FC<{
  items: SidebarItem[];
  activeItem: string;
  onItemClick: (id: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}> = ({ items, activeItem, onItemClick, isCollapsed, onToggleCollapse }) => (
  <div className={`bg-bg-secondary border-r border-border-primary transition-all duration-200 ${
    isCollapsed ? 'w-12' : 'w-64'
  }`}>
    <div className="p-3 border-b border-border-primary">
      <button 
        onClick={onToggleCollapse}
        className="w-full flex items-center space-x-3 text-sm font-medium text-text-primary hover:bg-bg-tertiary rounded-md px-2 py-1.5"
      >
        <MenuIcon size={16} />
        {!isCollapsed && <span>Explorer</span>}
      </button>
    </div>
    
    <nav className="p-2">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onItemClick(item.id)}
          className={`w-full flex items-center space-x-3 text-sm rounded-md px-2 py-1.5 mb-1 transition-colors ${
            activeItem === item.id 
              ? 'bg-accent-blue/20 text-accent-blue' 
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
          }`}
        >
          <item.icon size={16} />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="bg-accent-blue text-white text-xs rounded-full px-2 py-0.5">
                  {item.badge}
                </span>
              )}
              {item.shortcut && (
                <kbd className="text-xs text-text-muted">{item.shortcut}</kbd>
              )}
            </>
          )}
        </button>
      ))}
    </nav>
  </div>
);
```

### **3. File Explorer Tree**
```tsx
interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  isExpanded?: boolean;
  isSelected?: boolean;
}

const FileTree: React.FC<{
  nodes: FileNode[];
  onNodeClick: (node: FileNode) => void;
  onNodeExpand: (nodeId: string) => void;
}> = ({ nodes, onNodeClick, onNodeExpand }) => (
  <div className="p-2">
    {nodes.map((node) => (
      <FileTreeNode
        key={node.id}
        node={node}
        level={0}
        onNodeClick={onNodeClick}
        onNodeExpand={onNodeExpand}
      />
    ))}
  </div>
);

const FileTreeNode: React.FC<{
  node: FileNode;
  level: number;
  onNodeClick: (node: FileNode) => void;
  onNodeExpand: (nodeId: string) => void;
}> = ({ node, level, onNodeClick, onNodeExpand }) => (
  <div>
    <div
      className={`flex items-center space-x-2 py-1 px-2 rounded-md cursor-pointer hover:bg-bg-tertiary ${
        node.isSelected ? 'bg-accent-blue/20' : ''
      }`}
      style={{ paddingLeft: `${level * 16 + 8}px` }}
      onClick={() => onNodeClick(node)}
    >
      {node.type === 'folder' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNodeExpand(node.id);
          }}
          className="w-4 h-4 flex items-center justify-center"
        >
          {node.isExpanded ? <ChevronDownIcon size={12} /> : <ChevronRightIcon size={12} />}
        </button>
      )}
      
      <div className="w-4 h-4 flex items-center justify-center">
        {node.type === 'folder' ? (
          <FolderIcon size={14} className="text-accent-blue" />
        ) : (
          <FileIcon size={14} className="text-text-secondary" />
        )}
      </div>
      
      <span className="text-sm text-text-primary truncate">{node.name}</span>
    </div>
    
    {node.type === 'folder' && node.isExpanded && node.children && (
      <div>
        {node.children.map((child) => (
          <FileTreeNode
            key={child.id}
            node={child}
            level={level + 1}
            onNodeClick={onNodeClick}
            onNodeExpand={onNodeExpand}
          />
        ))}
      </div>
    )}
  </div>
);
```

### **4. Code Editor Tabs**
```tsx
interface EditorTab {
  id: string;
  filename: string;
  filepath: string;
  isModified: boolean;
  isActive: boolean;
  language?: string;
}

const EditorTabs: React.FC<{
  tabs: EditorTab[];
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onNewTab: () => void;
}> = ({ tabs, onTabClick, onTabClose, onNewTab }) => (
  <div className="flex items-center bg-bg-secondary border-b border-border-primary">
    <div className="flex-1 flex items-center overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex items-center space-x-2 px-3 py-2 border-r border-border-primary cursor-pointer ${
            tab.isActive 
              ? 'bg-bg-primary text-text-primary' 
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
          }`}
          onClick={() => onTabClick(tab.id)}
        >
          <FileIcon size={14} />
          <span className="text-sm truncate max-w-32">{tab.filename}</span>
          {tab.isModified && <div className="w-2 h-2 bg-accent-orange rounded-full" />}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
            className="w-4 h-4 hover:bg-bg-tertiary rounded flex items-center justify-center"
          >
            <CloseIcon size={12} />
          </button>
        </div>
      ))}
    </div>
    
    <button
      onClick={onNewTab}
      className="w-8 h-8 flex items-center justify-center hover:bg-bg-tertiary"
    >
      <PlusIcon size={14} />
    </button>
  </div>
);
```

### **5. Chat Interface**
```tsx
interface ChatMessage {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  files?: string[];
  codeBlocks?: CodeBlock[];
}

const ChatInterface: React.FC<{
  messages: ChatMessage[];
  isProcessing: boolean;
  onSendMessage: (message: string) => void;
}> = ({ messages, isProcessing, onSendMessage }) => (
  <div className="flex flex-col h-full bg-bg-primary">
    <div className="p-3 border-b border-border-primary">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-text-primary">Agent Chat</h3>
        <AgentModeSelector />
      </div>
    </div>
    
    <div className="flex-1 overflow-y-auto p-3 space-y-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      
      {isProcessing && (
        <div className="flex items-center space-x-2 text-text-secondary">
          <Spinner size={16} />
          <span className="text-sm">Agent is thinking...</span>
        </div>
      )}
    </div>
    
    <ChatInput onSendMessage={onSendMessage} disabled={isProcessing} />
  </div>
);

const ChatMessage: React.FC<{ message: ChatMessage }> = ({ message }) => (
  <div className={`flex space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
      message.type === 'user' 
        ? 'bg-accent-blue text-white' 
        : 'bg-accent-purple text-white'
    }`}>
      {message.type === 'user' ? <UserIcon size={16} /> : <BotIcon size={16} />}
    </div>
    
    <div className={`flex-1 max-w-md ${message.type === 'user' ? 'text-right' : ''}`}>
      <div className={`rounded-lg p-3 ${
        message.type === 'user' 
          ? 'bg-accent-blue text-white ml-8' 
          : 'bg-bg-tertiary text-text-primary mr-8'
      }`}>
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
        
        {message.codeBlocks && message.codeBlocks.map((block, index) => (
          <CodeBlock key={index} code={block.code} language={block.language} />
        ))}
      </div>
      
      <div className="text-xs text-text-muted mt-1">
        {formatTime(message.timestamp)}
      </div>
    </div>
  </div>
);
```

---

## ⚡ التفاعلات والأنيميشن

### **1. Micro-animations**
```css
/* Smooth transitions for interactive elements */
.interactive {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover effects */
.hover-lift:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Focus states */
.focus-ring:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--accent-blue);
}

/* Loading states */
.loading-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Slide animations */
.slide-in-right {
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

### **2. Loading States**
```tsx
const LoadingSpinner: React.FC<{ size?: number; color?: string }> = ({ 
  size = 20, 
  color = 'currentColor' 
}) => (
  <div className="animate-spin" style={{ width: size, height: size }}>
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" strokeOpacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  </div>
);

const SkeletonLoader: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-bg-tertiary rounded ${className}`} />
);

const ProgressBar: React.FC<{ progress: number; className?: string }> = ({ 
  progress, 
  className = '' 
}) => (
  <div className={`w-full bg-bg-tertiary rounded-full h-2 ${className}`}>
    <div 
      className="bg-accent-blue h-2 rounded-full transition-all duration-300"
      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
    />
  </div>
);
```

### **3. Toast Notifications**
```tsx
interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

const Toast: React.FC<{ 
  notification: ToastNotification; 
  onClose: (id: string) => void 
}> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
    if (notification.duration) {
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(notification.id), 300);
      }, notification.duration);
    }
  }, []);
  
  const colors = {
    success: 'bg-accent-green border-accent-green',
    error: 'bg-accent-red border-accent-red',
    warning: 'bg-accent-orange border-accent-orange',
    info: 'bg-accent-blue border-accent-blue'
  };
  
  return (
    <div className={`
      toast-container fixed top-4 right-4 z-50 transition-all duration-300 transform
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
    `}>
      <div className={`
        ${colors[notification.type]} text-white rounded-lg shadow-lg border-l-4 p-4 max-w-sm
      `}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 pt-0.5">
            {notification.type === 'success' && <CheckIcon size={20} />}
            {notification.type === 'error' && <XIcon size={20} />}
            {notification.type === 'warning' && <AlertTriangleIcon size={20} />}
            {notification.type === 'info' && <InfoIcon size={20} />}
          </div>
          
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{notification.title}</h4>
            {notification.message && (
              <p className="text-sm opacity-90 mt-1">{notification.message}</p>
            )}
          </div>
          
          <button 
            onClick={() => onClose(notification.id)}
            className="flex-shrink-0 opacity-70 hover:opacity-100"
          >
            <CloseIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

## ⌨️ اختصارات لوحة المفاتيح

### **Global Shortcuts**
```tsx
const globalShortcuts = {
  // File operations
  'Ctrl+N': 'New File',
  'Ctrl+O': 'Open File',
  'Ctrl+S': 'Save File',
  'Ctrl+Shift+S': 'Save All',
  'Ctrl+W': 'Close Tab',
  'Ctrl+Shift+W': 'Close All Tabs',
  
  // Navigation
  'Ctrl+P': 'Quick Open File',
  'Ctrl+Shift+P': 'Command Palette',
  'Ctrl+G': 'Go to Line',
  'Ctrl+F': 'Find in File',
  'Ctrl+Shift+F': 'Find in Files',
  
  // Agent interactions
  'Ctrl+I': 'Open Agent Chat',
  'Ctrl+K': 'Inline Edit',
  'Ctrl+L': 'Chat with Selection',
  'Ctrl+T': 'New Chat Tab',
  'Ctrl+Shift+T': 'Reopen Chat Tab',
  
  // Terminal
  'Ctrl+`': 'Toggle Terminal',
  'Ctrl+Shift+`': 'New Terminal',
  
  // UI
  'Ctrl+B': 'Toggle Sidebar',
  'Ctrl+Shift+E': 'Show Explorer',
  'Ctrl+Shift+X': 'Show Extensions',
  'F11': 'Toggle Fullscreen',
  'Ctrl+,': 'Open Settings'
};

const KeyboardShortcutHandler: React.FC = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const shortcut = buildShortcutString(event);
      const action = globalShortcuts[shortcut];
      
      if (action) {
        event.preventDefault();
        executeShortcutAction(action);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return null;
};
```

---

## ♿ إمكانية الوصول (Accessibility)

### **ARIA Support**
```tsx
// Accessible button with proper ARIA attributes
const AccessibleButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel?: string;
  disabled?: boolean;
}> = ({ children, onClick, ariaLabel, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    aria-disabled={disabled}
    className="focus:outline-none focus:ring-2 focus:ring-accent-blue rounded"
    tabIndex={disabled ? -1 : 0}
  >
    {children}
  </button>
);

// Accessible modal dialog
const AccessibleModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-bg-primary rounded-lg shadow-xl max-w-md w-full m-4 focus:outline-none"
        onClick={e => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="p-6">
          <h2 id="modal-title" className="text-lg font-semibold text-text-primary mb-4">
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>
  );
};
```

### **Screen Reader Support**
```tsx
// Live region for dynamic content updates
const LiveRegion: React.FC<{ message: string; priority?: 'polite' | 'assertive' }> = ({ 
  message, 
  priority = 'polite' 
}) => (
  <div
    aria-live={priority}
    aria-atomic="true"
    className="sr-only"
  >
    {message}
  </div>
);

// Screen reader only text
const ScreenReaderOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="sr-only">{children}</span>
);
```

### **Focus Management**
```tsx
const useFocusManagement = () => {
  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };
    
    container.addEventListener('keydown', handleTab);
    firstElement?.focus();
    
    return () => container.removeEventListener('keydown', handleTab);
  };
  
  return { trapFocus };
};
```

---

## 📱 التصميم المتجاوب

### **Mobile Layout Adaptations**
```tsx
const ResponsiveLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col">
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
        <TabNavigation />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
        {sidebarOpen && (
          <MobileSidebar onClose={() => setSidebarOpen(false)} />
        )}
      </div>
    );
  }
  
  return (
    <div className="h-screen flex">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
};

const TabNavigation: React.FC = () => (
  <div className="flex bg-bg-secondary border-t border-border-primary">
    {['Files', 'Chat', 'Terminal', 'Settings'].map((tab) => (
      <button
        key={tab}
        className="flex-1 py-3 text-sm text-text-secondary hover:text-text-primary"
      >
        {tab}
      </button>
    ))}
  </div>
);
```

---

## 🎭 حالات التطبيق المختلفة

### **Empty States**
```tsx
const EmptyState: React.FC<{
  icon: React.ComponentType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({ icon: Icon, title, description, actionLabel, onAction }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8">
    <div className="w-16 h-16 bg-bg-tertiary rounded-full flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-text-muted" />
    </div>
    
    <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
    <p className="text-text-secondary max-w-md mb-6">{description}</p>
    
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="bg-accent-blue hover:bg-accent-blue/90 text-white px-4 py-2 rounded-md font-medium"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

// Usage examples
const EmptyFileExplorer = () => (
  <EmptyState
    icon={FolderIcon}
    title="No Project Open"
    description="Open a folder or create a new project to get started with coding."
    actionLabel="Open Folder"
    onAction={() => {/* Open folder dialog */}}
  />
);

const EmptyChat = () => (
  <EmptyState
    icon={MessageCircleIcon}
    title="Start a Conversation"
    description="Ask questions about your code or request changes using natural language."
    actionLabel="Start Chatting"
    onAction={() => {/* Focus chat input */}}
  />
);
```

### **Error States**
```tsx
const ErrorBoundary: React.FC<{ 
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}> = ({ children, fallback: Fallback }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      setHasError(true);
      setError(new Error(error.message));
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  const resetError = () => {
    setHasError(false);
    setError(null);
  };
  
  if (hasError && error) {
    if (Fallback) {
      return <Fallback error={error} resetError={resetError} />;
    }
    
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="w-16 h-16 bg-accent-red/20 rounded-full flex items-center justify-center mb-4">
          <AlertTriangleIcon className="w-8 h-8 text-accent-red" />
        </div>
        
        <h3 className="text-lg font-semibold text-text-primary mb-2">Something went wrong</h3>
        <p className="text-text-secondary max-w-md mb-6">{error.message}</p>
        
        <button
          onClick={resetError}
          className="bg-accent-blue hover:bg-accent-blue/90 text-white px-4 py-2 rounded-md font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return <>{children}</>;
};
```

---

## 🎨 نظام الأيقونات

### **Icon Library Structure**
```tsx
// icons/index.ts
export { default as FileIcon } from './file.svg?react';
export { default as FolderIcon } from './folder.svg?react';
export { default as ChevronRightIcon } from './chevron-right.svg?react';
export { default as ChevronDownIcon } from './chevron-down.svg?react';
export { default as UserIcon } from './user.svg?react';
export { default as BotIcon } from './bot.svg?react';
export { default as SearchIcon } from './search.svg?react';
export { default as SettingsIcon } from './settings.svg?react';
export { default as TerminalIcon } from './terminal.svg?react';
export { default as PlusIcon } from './plus.svg?react';
export { default as CloseIcon } from './close.svg?react';
export { default as CheckIcon } from './check.svg?react';
export { default as XIcon } from './x.svg?react';
export { default as InfoIcon } from './info.svg?react';
export { default as AlertTriangleIcon } from './alert-triangle.svg?react';
export { default as LoaderIcon } from './loader.svg?react';

// Icon wrapper component for consistency
const Icon: React.FC<{
  name: string;
  size?: number;
  className?: string;
}> = ({ name, size = 16, className = '' }) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  return (
    <IconComponent 
      width={size} 
      height={size} 
      className={`icon ${className}`}
    />
  );
};
```

---

هذا التصميم يوفر تجربة مستخدم سلسة ومتسقة مع التركيز على الوضوح والكفاءة والوصولية. التصميم مرن وقابل للتخصيص ويدعم المظاهر المختلفة والأجهزة المتنوعة.