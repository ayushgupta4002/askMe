"use client"

import type React from "react"
import { useState, useRef, createContext, useContext, useMemo } from "react"
import {
  File,
  Folder,
  FolderOpen,
  Terminal,
  Users,
  Settings,
  Search,
  Play,
  Square,
  ChevronRight,
  ChevronDown,
  Bold,
  Italic,
  Code,
  AlignLeft,
  GitBranch,
  Package,
  FileText,
  Minimize2,
} from "lucide-react"

const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  disabled = false,
  onClick,
  ...props
}: {
  children: React.ReactNode
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "icon"
  className?: string
  disabled?: boolean
  onClick?: (e: React.MouseEvent) => void
  [key: string]: any
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
  }

  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    icon: "h-10 w-10",
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

const Input = ({
  className = "",
  type = "text",
  placeholder,
  value,
  onChange,
  ...props
}: {
  className?: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  [key: string]: any
}) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...props}
    />
  )
}

const ScrollArea = ({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) => {

  return <div className={`overflow-auto ${className}`}>{children}</div>
}

const Separator = ({
  orientation = "horizontal",
  className = "",
}: {
  orientation?: "horizontal" | "vertical"
  className?: string
}) => {

  return <div className={`${orientation === "horizontal" ? "h-px w-full" : "w-px h-full"} bg-border ${className}`} />
}

const Badge = ({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode
  variant?: "default" | "outline"
  className?: string
}) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    outline: "text-foreground border border-input",
  }

  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  )
}

const TooltipContext = createContext<{
  open: boolean
  setOpen: (open: boolean) => void
}>({ open: false, setOpen: () => {} })

const TooltipProvider = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

const Tooltip = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false)

  return (
    
    <TooltipContext.Provider value={{ open, setOpen }}>

      <div className="relative inline-block">{children}</div>
    </TooltipContext.Provider>
  )
}

const TooltipTrigger = ({
  children,
  asChild = false,
}: {
  children: React.ReactNode
  asChild?: boolean
}) => {
  const { setOpen } = useContext(TooltipContext)

  return (
    <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {children}
    </div>
  )
}

const TooltipContent = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { open } = useContext(TooltipContext)

  if (!open) return null

  return (

    <div className="absolute z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full">
      {children}
    </div>
  )
}

const ResizablePanelGroup = ({
  children,
  direction = "horizontal",
  className = "",
}: {
  children: React.ReactNode
  direction?: "horizontal" | "vertical"
  className?: string
}) => {
  return <div className={`flex ${direction === "horizontal" ? "flex-row" : "flex-col"} ${className}`}>{children}</div>
}

const ResizablePanel = ({
  children,
  defaultSize = 50,
  minSize = 10,
  maxSize = 90,
  collapsible = false,
  onCollapse,
  onExpand,
  className = "",
}: {
  children: React.ReactNode
  defaultSize?: number
  minSize?: number
  maxSize?: number
  collapsible?: boolean
  onCollapse?: () => void
  onExpand?: () => void
  className?: string
}) => {
  return (
    <div className={`flex-1 ${className}`} style={{ flexBasis: `${defaultSize}%` }}>
      {children}
    </div>
  )
}
const ResizablePanelTwo = ({
  children,
  defaultSize = 50,
  minSize = 10,
  maxSize = 90,
  collapsible = false,
  onCollapse,
  onExpand,
  className = "",
}: {
  children: React.ReactNode
  defaultSize?: number
  minSize?: number
  maxSize?: number
  collapsible?: boolean
  onCollapse?: () => void
  onExpand?: () => void
  className?: string
}) => {
  return (
    <div className={` ${className}`} style={{ flexBasis: `${defaultSize}%` }}>
      {children}
    </div>
  )
}
const ResizableHandle = ({
  className = "",
}: {
  className?: string
}) => {
  return <div className={`bg-border hover:bg-accent transition-colors ${className}`} />
}

const SyntaxHighlighter = ({
  code,
  language,
}: {
  code: string
  language: string
}) => {
  const highlightedCode = useMemo(() => {
    if (!code) return []

    const lines = code.split("\n")

    return lines.map((line, lineIndex) => {
      const tokens = tokenizeLine(line, language)
      return (
        <div key={lineIndex} className="h-6 leading-6 whitespace-pre">
          {tokens.map((token, tokenIndex) => (
            <span key={tokenIndex} className={getTokenClass(token.type)}>
              {token.value}
            </span>
          ))}
        </div>
      )
    })
  }, [code, language])

  return <div className="font-mono text-sm whitespace-pre">{highlightedCode}</div>
}

type TokenType =
  | "keyword"
  | "string"
  | "comment"
  | "number"
  | "operator"
  | "function"
  | "variable"
  | "type"
  | "property"
  | "tag"
  | "attribute"
  | "text"

interface Token {
  type: TokenType
  value: string
}

const languagePatterns = {
  typescript: [
    { type: "comment" as TokenType, pattern: /\/\/.*$/gm },
    { type: "comment" as TokenType, pattern: /\/\*[\s\S]*?\*\//gm },
    { type: "string" as TokenType, pattern: /"(?:[^"\\]|\\.)*"/g },
    { type: "string" as TokenType, pattern: /'(?:[^'\\]|\\.)*'/g },
    { type: "string" as TokenType, pattern: /`(?:[^`\\]|\\.)*`/g },
    {
      type: "keyword" as TokenType,
      pattern:
        /\b(import|export|from|interface|type|class|function|const|let|var|if|else|for|while|return|async|await|try|catch|finally|throw|new|this|super|extends|implements|public|private|protected|static|readonly|abstract)\b/g,
    },
    {
      type: "type" as TokenType,
      pattern: /\b(string|number|boolean|object|any|void|null|undefined|Array|Promise|React|Component|Props|State)\b/g,
    },
    { type: "number" as TokenType, pattern: /\b\d+\.?\d*\b/g },
    { type: "operator" as TokenType, pattern: /[+\-*/%=<>!&|?:]/g },

    { type: "function" as TokenType, pattern: /\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\()/g },
    { type: "property" as TokenType, pattern: /\.[a-zA-Z_$][a-zA-Z0-9_$]*/g },
  ],
  javascript: [
    { type: "comment" as TokenType, pattern: /\/\/.*$/gm },
    
    { type: "comment" as TokenType, pattern: /\/\*[\s\S]*?\*\//gm },
    { type: "string" as TokenType, pattern: /"(?:[^"\\]|\\.)*"/g },

    { type: "string" as TokenType, pattern: /'(?:[^'\\]|\\.)*'/g },
    { type: "string" as TokenType, pattern: /`(?:[^`\\]|\\.)*`/g },
    {
      type: "keyword" as TokenType,
      pattern:
        /\b(import|export|from|class|function|const|let|var|if|else|for|while|return|async|await|try|catch|finally|throw|new|this|super|extends)\b/g,
    },
    { type: "number" as TokenType, pattern: /\b\d+\.?\d*\b/g },

    { type: "operator" as TokenType, pattern: /[+\-*/%=<>!&|?:]/g },
    { type: "function" as TokenType, pattern: /\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\()/g },

    { type: "property" as TokenType, pattern: /\.[a-zA-Z_$][a-zA-Z0-9_$]*/g },
  ],
  json: [
    { type: "string" as TokenType, pattern: /"(?:[^"\\]|\\.)*"/g },
    { type: "number" as TokenType, pattern: /\b\d+\.?\d*\b/g },
    { type: "keyword" as TokenType, pattern: /\b(true|false|null)\b/g },
    { type: "operator" as TokenType, pattern: /[{}[\]:,]/g },
  ],
  html: [
    { type: "comment" as TokenType, pattern: /<!--[\s\S]*?-->/g },
    { type: "tag" as TokenType, pattern: /<\/?[a-zA-Z][a-zA-Z0-9]*(?:\s[^>]*)?\/?>/g },
    { type: "attribute" as TokenType, pattern: /\s[a-zA-Z-]+(?==)/g },
    { type: "string" as TokenType, pattern: /"(?:[^"\\]|\\.)*"/g },
    { type: "string" as TokenType, pattern: /'(?:[^'\\]|\\.)*'/g },
  ],
  css: [
    { type: "comment" as TokenType, pattern: /\/\*[\s\S]*?\*\//g },

    { type: "property" as TokenType, pattern: /[a-zA-Z-]+(?=\s*:)/g },
    { type: "string" as TokenType, pattern: /"(?:[^"\\]|\\.)*"/g },

    { type: "string" as TokenType, pattern: /'(?:[^'\\]|\\.)*'/g },
    { type: "number" as TokenType, pattern: /\b\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|deg)?\b/g },
    { type: "operator" as TokenType, pattern: /[{}:;]/g },
  ],
  markdown: [
    { type: "keyword" as TokenType, pattern: /^#{1,6}\s.*/gm },
    { type: "string" as TokenType, pattern: /\*\*.*?\*\*/g },
    { type: "string" as TokenType, pattern: /\*.*?\*/g },
   
  ],
}

function tokenizeLine(line: string, language: string): Token[] {
  const patterns = languagePatterns[language as keyof typeof languagePatterns] || []
  const tokens: Token[] = []
  let remaining = line
  let offset = 0


  while (remaining.length > 0) {

    let matched = false

    for (const { type, pattern } of patterns) {
      pattern.lastIndex = 0 
      const match = pattern.exec(remaining)

      if (match && match.index === 0) {
        if (match.index > 0) {
          tokens.push({ type: "text", value: remaining.slice(0, match.index) })
        }
        tokens.push({ type, value: match[0] })
        remaining = remaining.slice(match.index + match[0].length)
        offset += match.index + match[0].length
        matched = true
        break
      }
    }

    if (!matched) {
      tokens.push({ type: "text", value: remaining[0] })
      remaining = remaining.slice(1)
      offset += 1
    }
  }

  return tokens
}

function getTokenClass(type: TokenType): string {
  const classes = {
    keyword: "text-purple-400",

    string: "text-green-400",
    comment: "text-gray-500 italic",
    number: "text-orange-400",
    operator: "text-cyan-400",
    function: "text-blue-400",
    variable: "text-slate-100",
    type: "text-teal-400",
    property: "text-yellow-400",
    tag: "text-red-400",
    attribute: "text-yellow-400",
    text: "text-slate-100",
  }
  return classes[type] || "text-slate-100"
}

function getLanguageFromPath(path: string | null): string {
  if (!path) return "text"

  const extension = path.split(".").pop()?.toLowerCase()
  const languageMap: Record<string, string> = {
    ts: "typescript",
    tsx: "typescript",
    js: "javascript",
    jsx: "javascript",
    json: "json",
    html: "html",
    css: "css",
    md: "markdown",
    markdown: "markdown",
  }
  return languageMap[extension || ""] || "text"
}

const fileContents = {
  "src/components/Editor.tsx": `import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface EditorProps {
  content: string
  onChange: (content: string) => void
  collaborators: Collaborator[]
}

export function CodeEditor({ content, onChange, collaborators }: EditorProps) {
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })

  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const handleCollaborativeEdit = (edit: Edit) => {

      const transformedEdit = transformEdit(edit, localEdits)
      applyEdit(transformedEdit)
    }

    socket.on('collaborative-edit', handleCollaborativeEdit)
    return () => socket.off('collaborative-edit', handleCollaborativeEdit)
  }, [])

  const handleTextChange = (newContent: string) => {
    onChange(newContent)
    broadcastEdit(newContent)
  }

  return (
    <div className="relative h-full">
      <textarea
        value={content}
        onChange={(e) => handleTextChange(e.target.value)}
        className="w-full h-full font-mono text-sm"
        placeholder="Start coding..."
      />
      {collaborators.map(collaborator => (
        <CollaboratorCursor
          key={collaborator.id}
          position={collaborator.cursorPosition}
          color={collaborator.color}
          name={collaborator.name}
        />
      ))}
    </div>
  )
}`,
  "src/components/FileTree.tsx": `import React, { useState } from 'react'
import { ChevronRight, ChevronDown, Folder, FolderOpen, File } from 'lucide-react'

interface FileTreeProps {
  files: FileItem[]
  onFileSelect: (file: FileItem) => void
}

interface FileItem {
  name: string
  type: 'file' | 'folder'
  children?: FileItem[]
  language?: string
}

export function FileTree({ files, onFileSelect }: FileTreeProps) {
  return (
    <div className="file-tree">
      {files.map((file, index) => (
        <FileTreeItem 
          key={index} 
          item={file} 
          onSelect={onFileSelect} 
        />
      ))}
    </div>
  )
}

function FileTreeItem({ item, onSelect, level = 0 }) {
  const [expanded, setExpanded] = useState(item.expanded || false)
  
  const handleClick = () => {
    if (item.type === 'folder') {
      setExpanded(!expanded)
    } else {
      onSelect(item)
    }
  }
  
  return (
    <div>
      <div 
        className="file-tree-item"
        style={{ paddingLeft: \`\${level * 16}px\` }}
        onClick={handleClick}
      >
        {item.type === 'folder' ? (
          <>
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            {expanded ? <FolderOpen size={16} /> : <Folder size={16} />}
          </>
        ) : (
          <File size={16} />
        )}
        <span>{item.name}</span>
      </div>
      
      {item.children && expanded && (
        <div>
          {item.children.map((child, index) => (
            <FileTreeItem 
              key={index} 
              item={child} 
              onSelect={onSelect} 
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  )
}`,
  "src/components/Terminal.tsx": `import React, { useState, useRef, useEffect } from 'react'
import { TerminalIcon } from 'lucide-react'

interface TerminalProps {
  initialOutput?: string[]
}

export function Terminal({ initialOutput = [] }: TerminalProps) {
  const [history, setHistory] = useState(initialOutput)
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [history])
  
  const handleCommand = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      const command = input.trim()
      

      setHistory(prev => [...prev, \`$ \${command}\`])
      

      if (command === 'clear') {

        setHistory([])
      } else if (command === 'help') {
        setHistory(prev => [...prev, 'Available commands: clear, help, ls, echo'])

      } else if (command === 'ls') {
        setHistory(prev => [...prev, 'src/ public/ package.json tsconfig.json README.md'])

      } else if (command.startsWith('echo ')) {
        setHistory(prev => [...prev, command.substring(5)])
      } else {

        setHistory(prev => [...prev, \`Command not found: \${command}\`])
      }
      
      setInput('')
    }
  }
  
  return (
    <div className="terminal">
      <div className="terminal-header">
        <TerminalIcon size={16} />
        <span>Terminal</span>
      </div>
      
      <div className="terminal-output" ref={outputRef}>
        {history.map((line, i) => (
          <div key={i} className="terminal-line">
            {line}
          </div>
        ))}
        
        <div className="terminal-input-line">
          <span className="terminal-prompt">$ </span> 
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            className="terminal-input"
            autoFocus
          />
        </div>
      </div>
    </div>
  )
}`,
  "src/App.tsx": `import React, { useState } from 'react'
import { Editor } from './components/Editor'
import { FileTree } from './components/FileTree'
import { Terminal } from './components/Terminal'

export default function App() {
  const [currentFile, setCurrentFile] = useState(null)
  
  return (
    <div className="app">
      <div className="sidebar">
        <FileTree 
          files={fileTree} 
          onFileSelect={setCurrentFile} 
        />
      </div>
      
      <div className="main">
        <Editor 
          file={currentFile} 
          collaborators={collaborators} 
        />
        
        <Terminal />
      </div>
    </div>
  )
}`,
  "src/index.tsx": `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`,
  "src/utils/helpers.ts": ` 

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

export function calculateCursorPosition(
  text: string,
  cursorIndex: number
): { line: number; column: number } {
  const textBeforeCursor = text.substring(0, cursorIndex)
  const lines = textBeforeCursor.split('\\n')
  
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  else return (bytes / 1048576).toFixed(1) + ' MB'
}`,
  "src/utils/api.ts": `


export async function saveFile(path: string, content: string): Promise<boolean> {
  console.log(\`Saving file \${path}\`)

  return new Promise(resolve => {

    setTimeout(() => resolve(true), 300)
  })
}

export async function broadcastEdit(
  fileId: string,
  change: { from: number; to: number; text: string }
): Promise<void> {

console.log(\`Broadcasting edit to \${fileId}\`, change)
  return new Promise(resolve => {
    setTimeout(resolve, 100)
  })
}

export function subscribeToFileChanges(
  fileId: string,
  callback: (change: any) => void
): () => void {  

  console.log(\`Subscribing to changes for \${fileId}\`)
  
  return () => {
    console.log(\`Unsubscribing from changes for \${fileId}\`)
  }
}`,
  "package.json": `{
  "name": "code-collab",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1",
    "tailwindcss": "^3.3.3",
    "typescript": "^5.1.6"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "vite": "^4.4.9",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.27"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}`,
  "tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`,
  "README.md": `# CodeCollab

A real-time collaborative code editor built with React and TypeScript.

## Features

- Real-time collaborative editing
- Syntax highlighting for multiple languages
- File explorer
- Integrated terminal
- Dependency management

## Getting Started

1. Clone the repository
2. Install dependencies with \`npm install\`
3. Start the development server with \`npm run dev\`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.`,
}

const fileTree = [
  {
    name: "src",
    type: "folder",
    expanded: true,
    path: "src",
    children: [
      {
        name: "components",
        type: "folder",
        expanded: true,
        path: "src/components",
        children: [
          { name: "Editor.tsx", type: "file", language: "typescript", path: "src/components/Editor.tsx" },
          { name: "FileTree.tsx", type: "file", language: "typescript", path: "src/components/FileTree.tsx" },
          { name: "Terminal.tsx", type: "file", language: "typescript", path: "src/components/Terminal.tsx" },
        ],
      },
      {
        name: "utils",
        type: "folder",
        expanded: false,
        path: "src/utils",
        children: [
          { name: "helpers.ts", type: "file", language: "typescript", path: "src/utils/helpers.ts" },
          { name: "api.ts", type: "file", language: "typescript", path: "src/utils/api.ts" },
        ],
      },
      { name: "App.tsx", type: "file", language: "typescript", path: "src/App.tsx" },
      { name: "index.tsx", type: "file", language: "typescript", path: "src/index.tsx" },
    ],
  },
  {
    name: "public",
    type: "folder",
    expanded: false,
    path: "public",
    children: [
      { name: "index.html", type: "file", language: "html", path: "public/index.html" },
      { name: "favicon.ico", type: "file", language: "binary", path: "public/favicon.ico" },
    ],
  },
  { name: "package.json", type: "file", language: "json", path: "package.json" },
  { name: "tsconfig.json", type: "file", language: "json", path: "tsconfig.json" },
  { name: "README.md", type: "file", language: "markdown", path: "README.md" },
]


const collaborators = [
  { id: 1, name: "Alice Chen", color: "#10B981", avatar: "AC", active: true },

  { id: 2, name: "Bob Smith", color: "#F59E0B", avatar: "BS", active: true },

  { id: 3, name: "Carol Davis", color: "#EF4444", avatar: "CD", active: false },
]


const dependencies = [
  { name: "react", version: "^18.2.0", type: "dependency" },

  { name: "typescript", version: "^5.0.0", type: "devDependency" },
  { name: "vite", version: "^4.4.0", type: "devDependency" },

  { name: "tailwindcss", version: "^3.3.0", type: "devDependency" },
  { name: "@types/react", version: "^18.2.0", type: "devDependency" },
]


const flattenFileTree = (tree: any[], result: any = {}) => {
  tree.forEach((item) => {
    if (item.path && item.type === "file") {
      result[item.path] = item
    }
    if (item.children) {
      flattenFileTree(item.children, result)
    }
  })
  return result
}

export default function CollaborativeEditor() {

  const [openFiles, setOpenFiles] = useState<string[]>([])

  const [activeFile, setActiveFile] = useState<string | null>(null)
  const [fileContentsMap, setFileContentsMap] = useState<Record<string, string>>(fileContents)

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<string[]>([])

  const [isSearching, setIsSearching] = useState(false)

  const [terminalInput, setTerminalInput] = useState("")

  const [terminalOutput, setTerminalOutput] = useState([
    "$ npm run dev",
    "  Local:   http://localhost:5173/",
    "  Network: use --host to expose",
    "",
    "  ready in 342ms.",
    "",
  ])


  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [terminalCollapsed, setTerminalCollapsed] = useState(true) 
  const [terminalExpanded, setTerminalExpanded] = useState(false) 
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false)

  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })

  const [explorerCollapsed, setExplorerCollapsed] = useState(false)
  const [dependenciesCollapsed, setDependenciesCollapsed] = useState(false)

  const editorRef = useRef<HTMLTextAreaElement>(null)
  const terminalInputRef = useRef<HTMLInputElement>(null)
  const flattenedFiles = useRef(flattenFileTree(fileTree)).current

  const handleFileOpen = (path: string) => {
    if (!openFiles.includes(path)) {

      setOpenFiles([...openFiles, path])
    }
    setActiveFile(path)
  }

  const handleFileClose = (path: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }

    const newOpenFiles = openFiles.filter((file) => file !== path)

    setOpenFiles(newOpenFiles)

    if (activeFile === path) {
      setActiveFile(newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null)
    }
  }

  const handleFileContentChange = (content: string) => {


    if (activeFile) {
      setFileContentsMap((prev) => ({
        ...prev,
        [activeFile]: content,
      }))


      if (editorRef.current) {
        const textarea = editorRef.current

        const lines = textarea.value.substring(0, textarea.selectionStart).split("\n")

        setCursorPosition({
            
          line: lines.length,
          column: lines[lines.length - 1].length + 1,
        })
      }
    }
  }

  const handleTerminalCommand = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && terminalInput.trim()) {
      const command = terminalInput.trim()

      setTerminalOutput((prev) => [...prev, `$ ${command}`])

      if (command === "clear") {
        setTerminalOutput([])

      } else if (command === "help") {

        setTerminalOutput((prev) => [...prev, "Available commands: clear, help, ls, echo, npm"])


      } else if (command === "ls") {
        setTerminalOutput((prev) => [...prev, "src/ public/ package.json tsconfig.json README.md"])
      } else if (command.startsWith("echo ")) {

        setTerminalOutput((prev) => [...prev, command.substring(5)])
      } else if (command.startsWith("npm ")) {
        setTerminalOutput((prev) => [...prev, "Executing npm command...", "Done"])

      } else {
        setTerminalOutput((prev) => [...prev, `Command not found: ${command}`])
      }

      setTerminalInput("")
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)

    if (query.trim() === "") {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    const results = Object.keys(flattenedFiles).filter((path) => {
      const file = flattenedFiles[path]

      return (
        file.name.toLowerCase().includes(query.toLowerCase()) ||

        (fileContentsMap[path] && fileContentsMap[path].toLowerCase().includes(query.toLowerCase()))
      )
    })

    setSearchResults(results)
    setIsSearching(false)
  }

  const FileTreeItem = ({ item, level = 0 }: { item: any; level?: number }) => {

    const [expanded, setExpanded] = useState(item.expanded || false)
    const isActive = activeFile === item.path

    return (
      <div>
        <div
          className={`flex items-center gap-2 px-2 py-1 hover:bg-slate-700/50 cursor-pointer text-sm ${
            isActive ? "bg-teal-500/20 text-teal-300" : "text-slate-300"
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            if (item.type === "folder") {
              setExpanded(!expanded)
            } else {
              handleFileOpen(item.path)
            }
          }}
        >
          {item.type === "folder" ? (
            <>
              {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              {expanded ? (
                <FolderOpen className="w-4 h-4 text-teal-400" />
              ) : (
                <Folder className="w-4 h-4 text-teal-400" />
              )}
            </>
          ) : (
            <>
              <div className="w-4" />
              <File className="w-4 h-4 text-slate-400" />
            </>
          )}
          <span className="truncate">{item.name}</span>
          {item.language && (
            <Badge variant="outline" className="ml-auto text-xs bg-slate-800 border-slate-600">
              {item.language}
            </Badge>
          )}
        </div>
        {item.children && expanded && (
          <div>
            {item.children.map((child: any, index: number) => (
              <FileTreeItem key={index} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="h-screen bg-slate-900 text-slate-100 flex flex-col">
        <div className="h-12 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Code className="w-6 h-6 text-teal-400" />
              <span className="font-semibold text-lg">CodeCollab</span>
            </div>
            <Separator orientation="vertical" className="h-6 bg-slate-600" />
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-300">main</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <div className="flex -space-x-2">
                {collaborators.map((collaborator) => (
                  <Tooltip key={collaborator.id}>
                    <TooltipTrigger>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 border-slate-800 ${
                          collaborator.active ? "ring-2 ring-green-400" : ""
                        }`}
                        style={{ backgroundColor: collaborator.color }}
                      >
                        {collaborator.avatar}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {collaborator.name} {collaborator.active ? "(Active)" : "(Away)"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>

            <Button variant="default" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full w-full">
            <ResizablePanelTwo
              defaultSize={2}
              minSize={1}
              maxSize={5}
              collapsible={true}
              onCollapse={() => setSidebarCollapsed(true)}
              onExpand={() => setSidebarCollapsed(false)}
            >
              <div className="h-full bg-slate-800 border-r border-slate-700 shadow-xl flex flex-col">
                <div className="p-3 border-b border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => setExplorerCollapsed(!explorerCollapsed)}
                      >
                        {explorerCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </Button>
                      <h3 className="font-medium text-slate-200">Explorer</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => setIsSearching(!isSearching)}
                    >
                      <Search className="w-3 h-3" />
                    </Button>
                  </div>

                  {!explorerCollapsed && (
                    <>
                      <Input
                        placeholder="Search files..."
                        className="h-8 bg-slate-700 border-slate-600 text-sm"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                      />

                      {searchQuery && searchResults.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-slate-400">Search results:</p>
                          {searchResults.map((path) => (
                            <div
                              key={path}
                              className="text-xs text-teal-300 hover:bg-slate-700 p-1 cursor-pointer flex items-center gap-1"
                              onClick={() => handleFileOpen(path)}
                            >
                              <File className="w-3 h-3" />
                              <span className="truncate">{path}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {!explorerCollapsed && (
                  <ScrollArea className="flex-1 overflow-auto">
                    <div className="p-2">
                      {fileTree.map((item, index) => (
                        <FileTreeItem key={index} item={item} />
                      ))}
                    </div>
                  </ScrollArea>
                )}

                <Separator className="bg-slate-700" />

                <div className="p-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => setDependenciesCollapsed(!dependenciesCollapsed)}
                      >
                        {dependenciesCollapsed ? (
                          <ChevronRight className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </Button>
                      <h3 className="font-medium text-slate-200 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Dependencies
                      </h3>
                    </div>
                  </div>

                  {!dependenciesCollapsed && (
                    <ScrollArea className="h-48">
                      <div className="space-y-2">
                        {dependencies.map((dep, index) => (
                          <div key={index} className="flex items-center justify-between text-xs">
                            <span className="text-slate-300 truncate">{dep.name}</span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                dep.type === "dependency"
                                  ? "bg-teal-500/20 border-teal-500 text-teal-300"
                                  : "bg-amber-500/20 border-amber-500 text-amber-300"
                              }`}
                            >
                              {dep.version}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </div>
            </ResizablePanelTwo>

            <ResizableHandle className="w-1 bg-slate-700 hover:bg-teal-500 transition-colors" />

            <ResizablePanel defaultSize={60}>
              <div className="h-full bg-slate-900 relative flex flex-col">
                <div className="h-10 bg-slate-800 border-b border-slate-700 flex items-center px-2 shrink-0">
                  {openFiles.length === 0 ? (
                    <div className="text-sm text-slate-500 px-2">No files open</div>
                  ) : (
                    openFiles.map((path) => (
                      <div
                        key={path}
                        className={`flex items-center gap-2 px-3 py-1 rounded-t-md mr-1 cursor-pointer ${
                          activeFile === path
                            ? "bg-slate-700 text-slate-100"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700/50"
                        }`}
                        onClick={() => setActiveFile(path)}
                      >
                        <FileText className="w-4 h-4 text-teal-400" />

                        <span className="text-sm truncate max-w-[120px]">{path.split("/").pop()}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1 hover:bg-slate-600 rounded-full"
                          onClick={(e) => handleFileClose(path, e)}
                        >
                          x
                        </Button>
                      </div>
                    ))
                  )}
                </div>

                {showFloatingToolbar && (
                  <div className="absolute top-16 left-4 z-10 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl p-2 flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-6 bg-slate-600" />
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <AlignLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Code className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                <div className="flex-1 relative overflow-hidden">

                  {activeFile ? (
                    <div className="h-full flex">
                      <div className="w-12 bg-slate-800 border-r border-slate-700 text-slate-500 text-sm font-mono flex-shrink-0">
                        <div className="min-h-full">

                          {(fileContentsMap[activeFile] || "").split("\n").map((_, index) => (
                            <div key={index} className="h-6 flex items-center justify-end px-2 leading-6">
                              {index + 1}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex-1 relative overflow-auto">
                        <div className="relative h-full">
                          <div 
                            className="absolute inset-0 p-4 font-mono text-sm overflow-auto whitespace-pre"
                            style={{ pointerEvents: 'none' }}
                          >
                            <SyntaxHighlighter
                              code={fileContentsMap[activeFile] || ""}
                              language={getLanguageFromPath(activeFile)}
                            />
                          </div>

                          <textarea
                            ref={editorRef}
                            value={fileContentsMap[activeFile] || ""}
                            onChange={(e) => handleFileContentChange(e.target.value)}
                            onFocus={() => setShowFloatingToolbar(true)}
                            onBlur={() => setShowFloatingToolbar(false)}
                            className="absolute inset-0 w-full h-full bg-transparent text-transparent font-mono text-sm p-4 resize-none outline-none leading-6 border-none overflow-auto"
                            placeholder="Start typing your code here..."
                            spellCheck={false}
                            style={{ caretColor: "white" }}
                            onScroll={(e) => {
                              // Sync scroll position of the syntax highlighting overlay with the textarea
                              const target = e.target as HTMLTextAreaElement;
                              const overlayElement = target.previousSibling as HTMLDivElement;
                              if (overlayElement) {
                                overlayElement.scrollTop = target.scrollTop;
                                overlayElement.scrollLeft = target.scrollLeft;
                              }
                            }}
                          />

                          {fileContentsMap[activeFile] && (
                            <>
                              <div className="absolute top-20 left-32 w-0.5 h-6 bg-green-400 animate-pulse pointer-events-none">
                                <div className="absolute -top-6 -left-2 bg-green-400 text-slate-900 text-xs px-2 py-1 rounded whitespace-nowrap">
                                  Alice Chen
                                </div>
                              </div>

                              <div className="absolute top-32 left-48 w-0.5 h-6 bg-amber-400 animate-pulse pointer-events-none">
                                <div className="absolute -top-6 -left-2 bg-amber-400 text-slate-900 text-xs px-2 py-1 rounded whitespace-nowrap">
                                  Bob Smith
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-500 bg-slate-900">
                      <div className="text-center">
                        <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <h3 className="text-xl font-medium mb-2">No file open</h3>
                        <p className="text-sm max-w-md">Select a file from the explorer to start editing</p>
                      </div>
                    </div>
                  )}
                </div>

             {terminalExpanded && (
              <div className="absolute bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-700 shadow-2xl">
                <div className="h-10 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-teal-400" />
                    <span className="text-sm font-medium">Terminal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Play className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Square className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => setTerminalExpanded(false)}
                    >
                      <Minimize2 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => setTerminalExpanded(false)}
                    >
                      x
                    </Button>
                  </div>
                </div>

                <div className="h-80 p-4 font-mono text-sm overflow-auto bg-slate-900">
                  <div className="space-y-1">
                    {terminalOutput.map((line, index) => (
                      <div key={index} className={line.startsWith("$") ? "text-teal-400" : "text-slate-300"}>
                        {line}
                      </div>
                    ))}
                    <div className="flex items-center">
                      <span className="text-teal-400">$ </span>
                      <input
                        ref={terminalInputRef}
                        type="text"
                        value={terminalInput}
                        onChange={(e) => setTerminalInput(e.target.value)}
                        onKeyDown={handleTerminalCommand}
                        className="flex-1 bg-transparent border-none outline-none text-slate-300 ml-1"
                        autoComplete="off"
                        spellCheck={false}
                        placeholder="Type a command..."
                      />
                    </div>
                  </div>
                </div>
              </div>
             )}

                <div className="absolute bottom-4 right-4 z-40">
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 bg-slate-800 border border-slate-600 hover:bg-slate-700 shadow-lg"
                onClick={() => setTerminalExpanded(!terminalExpanded)}
              >
                <Terminal className="w-4 h-4 text-teal-400" />
              </Button>
             </div>
        
                </div>
                </ResizablePanel>
              </ResizablePanelGroup>



      </div>
      </div>
    </TooltipProvider>
  )
}
