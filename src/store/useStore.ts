import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Todo, Note, Habit, DrawingPad, FileItem, User, Notification } from '../types';

interface AppState {
  // User
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Todos
  todos: Todo[];
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  reorderTodos: (startIndex: number, endIndex: number) => void;
  
  // Notes
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  
  // Habits
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'completedDates'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  markHabitComplete: (id: string, date: string) => void;
  
  // Drawing Pads
  drawingPads: DrawingPad[];
  addDrawingPad: (pad: Omit<DrawingPad, 'id' | 'createdAt'>) => void;
  updateDrawingPad: (id: string, updates: Partial<DrawingPad>) => void;
  deleteDrawingPad: (id: string) => void;
  
  // Files
  files: FileItem[];
  addFile: (file: Omit<FileItem, 'id' | 'createdAt'>) => void;
  deleteFile: (id: string) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // UI
  currentView: string;
  setCurrentView: (view: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),
      
      // Todos
      todos: [],
      addTodo: (todo) => set((state) => ({
        todos: [...state.todos, {
          ...todo,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
        }]
      })),
      updateTodo: (id, updates) => set((state) => ({
        todos: state.todos.map(todo => 
          todo.id === id ? { ...todo, ...updates } : todo
        )
      })),
      deleteTodo: (id) => set((state) => ({
        todos: state.todos.filter(todo => todo.id !== id)
      })),
      reorderTodos: (startIndex, endIndex) => set((state) => {
        const result = Array.from(state.todos);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return { todos: result };
      }),
      
      // Notes
      notes: [],
      addNote: (note) => set((state) => ({
        notes: [...state.notes, {
          ...note,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          updatedAt: new Date(),
        }]
      })),
      updateNote: (id, updates) => set((state) => ({
        notes: state.notes.map(note => 
          note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note
        )
      })),
      deleteNote: (id) => set((state) => ({
        notes: state.notes.filter(note => note.id !== id)
      })),
      
      // Habits
      habits: [],
      addHabit: (habit) => set((state) => ({
        habits: [...state.habits, {
          ...habit,
          id: Math.random().toString(36).substr(2, 9),
          streak: 0,
          completedDates: [],
          createdAt: new Date(),
        }]
      })),
      updateHabit: (id, updates) => set((state) => ({
        habits: state.habits.map(habit => 
          habit.id === id ? { ...habit, ...updates } : habit
        )
      })),
      deleteHabit: (id) => set((state) => ({
        habits: state.habits.filter(habit => habit.id !== id)
      })),
      markHabitComplete: (id, date) => set((state) => ({
        habits: state.habits.map(habit => {
          if (habit.id === id) {
            const completedDates = habit.completedDates.includes(date)
              ? habit.completedDates.filter(d => d !== date)
              : [...habit.completedDates, date];
            
            // Calculate streak
            const sortedDates = completedDates.sort();
            let streak = 0;
            const today = new Date().toISOString().split('T')[0];
            
            if (sortedDates.includes(today)) {
              for (let i = sortedDates.length - 1; i >= 0; i--) {
                const currentDate = new Date(sortedDates[i]);
                const expectedDate = new Date();
                expectedDate.setDate(expectedDate.getDate() - (sortedDates.length - 1 - i));
                
                if (currentDate.toDateString() === expectedDate.toDateString()) {
                  streak++;
                } else {
                  break;
                }
              }
            }
            
            return { ...habit, completedDates, streak };
          }
          return habit;
        })
      })),
      
      // Drawing Pads
      drawingPads: [],
      addDrawingPad: (pad) => set((state) => ({
        drawingPads: [...state.drawingPads, {
          ...pad,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
        }]
      })),
      updateDrawingPad: (id, updates) => set((state) => ({
        drawingPads: state.drawingPads.map(pad => 
          pad.id === id ? { ...pad, ...updates } : pad
        )
      })),
      deleteDrawingPad: (id) => set((state) => ({
        drawingPads: state.drawingPads.filter(pad => pad.id !== id)
      })),
      
      // Files
      files: [],
      addFile: (file) => set((state) => ({
        files: [...state.files, {
          ...file,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
        }]
      })),
      deleteFile: (id) => set((state) => ({
        files: state.files.filter(file => file.id !== id)
      })),
      
      // Notifications
      notifications: [],
      addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, {
          ...notification,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
        }]
      })),
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      clearNotifications: () => set({ notifications: [] }),
      
      // UI
      currentView: 'dashboard',
      setCurrentView: (view) => set({ currentView: view }),
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'daily-utility-storage',
      partialize: (state) => ({
        todos: state.todos,
        notes: state.notes,
        habits: state.habits,
        drawingPads: state.drawingPads,
        files: state.files,
        notifications: state.notifications,
        currentView: state.currentView,
      }),
    }
  )
);