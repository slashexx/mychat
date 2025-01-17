export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  code?: string; // Optional code snippet
  language?: string; // Optional programming language
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  context?: string; // Development context (frontend, backend, etc.)
  language?: string; // Primary programming language
}