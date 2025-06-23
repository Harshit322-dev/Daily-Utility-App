import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Tag, Bell, Clock, Volume2, BookOpen } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { format, addMinutes } from 'date-fns';

const colorOptions = [
  'bg-yellow-200',
  'bg-pink-200',
  'bg-blue-200',
  'bg-green-200',
  'bg-purple-200',
  'bg-orange-200',
  'bg-red-200',
  'bg-indigo-200'
];

const categoryOptions = [
  'Personal',
  'Work',
  'Ideas',
  'Shopping',
  'Health',
  'Travel',
  'Finance',
  'Other'
];

const soundOptions = [
  { 
    value: 'bell', 
    label: '🔔 Bell',
    createAudio: () => {
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
      
      return { play: () => Promise.resolve() };
    }
  },
  { 
    value: 'chime', 
    label: '🎵 Chime',
    createAudio: () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
      
      return { play: () => Promise.resolve() };
    }
  },
  { 
    value: 'ding', 
    label: '🔊 Ding',
    createAudio: () => {
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
      
      return { play: () => Promise.resolve() };
    }
  },
  { 
    value: 'alert', 
    label: '⚠️ Alert',
    createAudio: () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      
      return { play: () => Promise.resolve() };
    }
  }
];

const playNotificationSound = (soundType: string) => {
  try {
    const soundOption = soundOptions.find(s => s.value === soundType);
    if (soundOption) {
      soundOption.createAudio();
    }
  } catch (error) {
    console.warn('Could not play notification sound:', error);
  }
};

export const Notes: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote, addNotification } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderNoteId, setReminderNoteId] = useState<string | null>(null);
  const [reminderDateTime, setReminderDateTime] = useState('');
  const [reminderSound, setReminderSound] = useState('bell');
  
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: 'Personal',
    color: 'bg-yellow-200'
  });

  // Check for due reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      notes.forEach(note => {
        if (note.reminder?.enabled && note.reminder.datetime <= now) {
          // Play sound
          playNotificationSound(note.reminder.sound);
          
          // Show notification
          addNotification({
            title: 'Note Reminder',
            message: note.title,
            type: 'note',
            itemId: note.id,
            sound: note.reminder.sound
          });
          
          // Disable the reminder to prevent repeated notifications
          updateNote(note.id, {
            reminder: { ...note.reminder, enabled: false }
          });
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [notes, addNotification, updateNote]);

  const handleCreateNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      addNote(newNote);
      setNewNote({ title: '', content: '', category: 'Personal', color: 'bg-yellow-200' });
      setIsCreating(false);
    }
  };

  const handleUpdateNote = (id: string, updates: any) => {
    updateNote(id, updates);
    setEditingId(null);
  };

  const handleSetReminder = () => {
    if (reminderNoteId && reminderDateTime) {
      updateNote(reminderNoteId, {
        reminder: {
          enabled: true,
          datetime: new Date(reminderDateTime),
          sound: reminderSound
        }
      });
      setShowReminderModal(false);
      setReminderNoteId(null);
      setReminderDateTime('');
    }
  };

  const openReminderModal = (noteId: string) => {
    setReminderNoteId(noteId);
    const defaultTime = addMinutes(new Date(), 30);
    setReminderDateTime(format(defaultTime, "yyyy-MM-dd'T'HH:mm"));
    setShowReminderModal(true);
  };

  const testSound = (soundType: string) => {
    playNotificationSound(soundType);
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 w-full bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
          >
            <option value="all">All Categories</option>
            {categoryOptions.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCreating(true)}
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-2xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>New Note</span>
        </motion.button>
      </div>

      {/* Create Note Modal */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setIsCreating(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-200/50"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-purple-600" />
                Create New Note
              </h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Note title..."
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                />
                
                <textarea
                  placeholder="Write your note here..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none transition-all duration-200"
                />
                
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <select
                      value={newNote.category}
                      onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                    >
                      {categoryOptions.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Color:</span>
                    <div className="flex space-x-1">
                      {colorOptions.map((color) => (
                        <motion.button
                          key={color}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setNewNote({ ...newNote, color })}
                          className={`w-8 h-8 rounded-full ${color} border-3 transition-all duration-200 ${
                            newNote.color === color ? 'border-gray-900 scale-110 shadow-lg' : 'border-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsCreating(false)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateNote}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-2xl hover:shadow-lg transition-all duration-200 font-medium"
                  >
                    Create Note
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredNotes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className={`${note.color} rounded-3xl p-5 shadow-lg border border-gray-200/50 cursor-pointer group hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-900 line-clamp-2 text-lg">{note.title}</h3>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openReminderModal(note.id)}
                    className="p-2 hover:bg-white/50 rounded-xl transition-colors"
                    title="Set Reminder"
                  >
                    <Clock className="w-4 h-4 text-gray-600" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setEditingId(note.id)}
                    className="p-2 hover:bg-white/50 rounded-xl transition-colors"
                    title="Edit Note"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteNote(note.id)}
                    className="p-2 hover:bg-white/50 rounded-xl transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </motion.button>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm line-clamp-6 mb-4 leading-relaxed">{note.content}</p>
              
              <div className="flex justify-between items-center text-xs text-gray-600">
                <span className="bg-white/60 px-3 py-1 rounded-full font-medium">{note.category}</span>
                <div className="flex items-center space-x-2">
                  {note.reminder?.enabled && (
                    <span className="text-purple-600 flex items-center bg-purple-100/80 px-2 py-1 rounded-full">
                      <Bell className="w-3 h-3 mr-1" />
                      {format(note.reminder.datetime, 'MMM d')}
                    </span>
                  )}
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {format(note.updatedAt, 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-12 h-12 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No notes found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Create your first note to get started!'}
          </p>
          {!searchQuery && selectedCategory === 'all' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCreating(true)}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-2xl hover:shadow-lg transition-all duration-200 font-medium"
            >
              Create Your First Note
            </motion.button>
          )}
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
              className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-200/50"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Bell className="w-6 h-6 mr-2 text-purple-600" />
                Set Note Reminder
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reminder Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={reminderDateTime}
                    onChange={(e) => setReminderDateTime(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        className={`p-3 rounded-xl border-2 transition-all duration-200 flex items-center justify-center ${
                          reminderSound === sound.value
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                        title="Double-click to test sound"
                      >
                        <Volume2 className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">{sound.label}</span>
                      </motion.button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Double-click to test sound</p>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowReminderModal(false)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSetReminder}
                    disabled={!reminderDateTime}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-2xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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