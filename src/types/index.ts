export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  color: string;
  createdAt: Date;
  dueDate?: Date;
  reminder?: {
    enabled: boolean;
    datetime: Date;
    sound: string;
  };
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  reminder?: {
    enabled: boolean;
    datetime: Date;
    sound: string;
  };
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  color: string;
  streak: number;
  completedDates: string[];
  createdAt: Date;
}

export interface DrawingPad {
  id: string;
  name: string;
  imageData: string;
  createdAt: Date;
  folder?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string;
  folder?: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'todo' | 'note';
  itemId: string;
  timestamp: Date;
  sound: string;
}