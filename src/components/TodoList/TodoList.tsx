import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, GripVertical, Calendar, Bell, Clock, Volume2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ColorPicker } from '../ColorPicker/ColorPicker';
import { format, addMinutes } from 'date-fns';

const priorityColors = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500'
};

const colorOptions = [
  'bg-red-400',
  'bg-orange-400',
  'bg-yellow-400',
  'bg-green-400',
  'bg-blue-400',
  'bg-purple-400',
  'bg-pink-400',
  'bg-indigo-400',
  'bg-teal-400',
  'bg-cyan-400',
  'bg-emerald-400',
  'bg-lime-400'
];

const soundOptions = [
  { 
    value: 'bell', 
    label: '🔔 Bell',
    play: () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  },
  { 
    value: 'chime', 
    label: '🎵 Chime',
    play: () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create multiple tones for a chime effect
      [523, 659, 784].forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.1);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + index * 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.1 + 0.4);
        
        oscillator.start(audioContext.currentTime + index * 0.1);
        oscillator.stop(audioContext.currentTime + index * 0.1 + 0.4);
      });
    }
  },
  { 
    value: 'ding', 
    label: '🔊 Ding',
    play: () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    }
  },
  { 
    value: 'alert', 
    label: '⚠️ Alert',
    play: () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create alternating tones for alert effect
      [440, 880, 440].forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.1);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + index * 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.1 + 0.1);
        
        oscillator.start(audioContext.currentTime + index * 0.1);
        oscillator.stop(audioContext.currentTime + index * 0.1 + 0.1);
      });
    }
  }
];

const playNotificationSound = (soundType: string) => {
  try {
    const soundOption = soundOptions.find(s => s.value === soundType);
    if (soundOption) {
      soundOption.play();
    }
  } catch (error) {
    console.warn('Could not play notification sound:', error);
  }
};

export const TodoList: React.FC = () => {
  const { todos, addTodo, updateTodo, deleteTodo, addNotification } = useStore();
  const [newTodo, setNewTodo] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [selectedColor, setSelectedColor] = useState('bg-blue-400');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderTodoId, setReminderTodoId] = useState<string | null>(null);
  const [reminderDateTime, setReminderDateTime] = useState('');
  const [reminderSound, setReminderSound] = useState('bell');

  // Check for due reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      todos.forEach(todo => {
        if (todo.reminder?.enabled && todo.reminder.datetime <= now && !todo.completed) {
          // Play sound
          playNotificationSound(todo.reminder.sound);
          
          // Show notification
          addNotification({
            title: 'Todo Reminder',
            message: todo.text,
            type: 'todo',
            itemId: todo.id,
            sound: todo.reminder.sound
          });
          
          // Disable the reminder to prevent repeated notifications
          updateTodo(todo.id, {
            reminder: { ...todo.reminder, enabled: false }
          });
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [todos, addNotification, updateTodo]);

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      addTodo({
        text: newTodo.trim(),
        completed: false,
        priority: selectedPriority,
        color: selectedColor,
      });
      setNewTodo('');
    }
  };

  const handleSetReminder = () => {
    if (reminderTodoId && reminderDateTime) {
      updateTodo(reminderTodoId, {
        reminder: {
          enabled: true,
          datetime: new Date(reminderDateTime),
          sound: reminderSound
        }
      });
      setShowReminderModal(false);
      setReminderTodoId(null);
      setReminderDateTime('');
    }
  };

  const openReminderModal = (todoId: string) => {
    setReminderTodoId(todoId);
    const defaultTime = addMinutes(new Date(), 30);
    setReminderDateTime(format(defaultTime, "yyyy-MM-dd'T'HH:mm"));
    setShowReminderModal(true);
  };

  const testSound = (soundType: string) => {
    playNotificationSound(soundType);
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const sortedTodos = filteredTodos.sort((a, b) => {
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    return priorityWeight[b.priority] - priorityWeight[a.priority];
  });

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-6xl mx-auto space-y-4 lg:space-y-6">
      {/* Add Todo Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 lg:p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
      >
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-3 lg:mb-4 flex items-center">
          <Plus className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-purple-600" />
          Add New Task
        </h3>
        
        <div className="space-y-3 lg:space-y-4">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 lg:space-x-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
              placeholder="What needs to be done?"
              className="flex-1 px-3 lg:px-4 py-2.5 lg:py-3 bg-gray-50/80 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm lg:text-base dark:text-white"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddTodo}
              className="px-6 lg:px-8 py-2.5 lg:py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl lg:rounded-2xl hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 font-medium text-sm lg:text-base"
            >
              <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
              <span>Add Task</span>
            </motion.button>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 lg:gap-4">
            {/* Priority Selection */}
            <div className="flex items-center space-x-2">
              <span className="text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">Priority:</span>
              <div className="flex space-x-1">
                {(['high', 'medium', 'low'] as const).map((priority) => (
                  <motion.button
                    key={priority}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedPriority(priority)}
                    className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg lg:rounded-xl text-xs font-medium transition-all duration-200 ${
                      selectedPriority === priority
                        ? `${priorityColors[priority]} text-white shadow-lg`
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="flex items-center space-x-2">
              <span className="text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">Color:</span>
              <ColorPicker
                colors={colorOptions}
                selectedColor={selectedColor}
                onColorSelect={setSelectedColor}
                size="sm"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-1">
        {(['all', 'active', 'completed'] as const).map((filterOption) => (
          <motion.button
            key={filterOption}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilter(filterOption)}
            className={`flex-1 py-2.5 lg:py-3 px-3 lg:px-4 rounded-lg lg:rounded-xl font-medium transition-all duration-200 text-sm lg:text-base ${
              filter === filterOption
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-600/50'
            }`}
          >
            <span className="truncate">
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </span>
            <span className="ml-1 lg:ml-2 text-xs opacity-75">
              ({filterOption === 'all' ? todos.length : 
                filterOption === 'active' ? todos.filter(t => !t.completed).length :
                todos.filter(t => t.completed).length})
            </span>
          </motion.button>
        ))}
      </div>

      {/* Todo List */}
      <div className="space-y-2 lg:space-y-3">
        <AnimatePresence>
          {sortedTodos.map((todo, index) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01, y: -2 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center space-x-3 lg:space-x-4">
                <GripVertical className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 dark:text-gray-500 cursor-move hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0" />
                
                <div className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full ${todo.color} shadow-sm flex-shrink-0`}></div>
                
                <motion.input
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="checkbox"
                  checked={todo.completed}
                  onChange={(e) => updateTodo(todo.id, { completed: e.target.checked })}
                  className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600 rounded-lg focus:ring-purple-500 focus:ring-2 flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <p className={`font-medium transition-all duration-200 text-sm lg:text-base ${
                    todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                  }`}>
                    <span className="block truncate">{todo.text}</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-2 lg:gap-3 mt-1 lg:mt-2">
                    <span className={`text-xs px-2 lg:px-3 py-1 rounded-full ${priorityColors[todo.priority]} text-white font-medium shadow-sm flex-shrink-0`}>
                      {todo.priority}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center flex-shrink-0">
                      <Calendar className="w-3 h-3 mr-1" />
                      {format(new Date(todo.createdAt), 'MMM d, yyyy')}
                    </span>
                    {todo.reminder?.enabled && (
                      <span className="text-xs text-purple-600 dark:text-purple-400 flex items-center bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-full flex-shrink-0">
                        <Bell className="w-3 h-3 mr-1" />
                        <span className="truncate">{format(todo.reminder.datetime, 'MMM d, h:mm a')}</span>
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 lg:space-x-2 flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openReminderModal(todo.id)}
                    className="p-1.5 lg:p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg lg:rounded-xl transition-all duration-200"
                    title="Set Reminder"
                  >
                    <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteTodo(todo.id)}
                    className="p-1.5 lg:p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg lg:rounded-xl transition-all duration-200"
                    title="Delete Task"
                  >
                    <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {sortedTodos.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 lg:py-16"
        >
          <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6">
            <Plus className="w-10 h-10 lg:w-12 lg:h-12 text-purple-400" />
          </div>
          <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2">No tasks found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 lg:mb-6 text-sm lg:text-base px-4">
            {filter === 'all' ? 'Add your first task to get started!' :
             filter === 'active' ? 'No active tasks. Great job!' :
             'No completed tasks yet.'}
          </p>
        </motion.div>
      )}

      {/* Reminder Modal */}
      <AnimatePresence>
        {showReminderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowReminderModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 lg:p-6 w-full max-w-md shadow-2xl border border-gray-200/50 dark:border-gray-700/50 mx-4"
            >
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 flex items-center">
                <Bell className="w-5 h-5 lg:w-6 lg:h-6 mr-2 text-purple-600" />
                Set Reminder
              </h3>
              
              <div className="space-y-3 lg:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reminder Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={reminderDateTime}
                    onChange={(e) => setReminderDateTime(e.target.value)}
                    className="w-full px-3 lg:px-4 py-2.5 lg:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm lg:text-base dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notification Sound
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {soundOptions.map((sound) => (
                      <motion.button
                        key={sound.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setReminderSound(sound.value)}
                        onDoubleClick={() => testSound(sound.value)}
                        className={`p-2 lg:p-3 rounded-lg lg:rounded-xl border-2 transition-all duration-200 flex items-center justify-center ${
                          reminderSound === sound.value
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                        }`}
                        title="Double-click to test sound"
                      >
                        <Volume2 className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2 flex-shrink-0" />
                        <span className="text-xs lg:text-sm font-medium truncate">{sound.label}</span>
                      </motion.button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Double-click to test sound</p>
                </div>
                
                <div className="flex justify-end space-x-3 pt-2 lg:pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowReminderModal(false)}
                    className="px-4 lg:px-6 py-2 lg:py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium text-sm lg:text-base"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSetReminder}
                    disabled={!reminderDateTime}
                    className="px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl lg:rounded-2xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm lg:text-base"
                  >
                    Set Reminder
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};