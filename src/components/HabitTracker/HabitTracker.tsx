import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Calendar, Flame, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { format, startOfWeek, addDays, isToday, parseISO } from 'date-fns';

const colorOptions = [
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-green-500',
  'bg-blue-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500'
];

export const HabitTracker: React.FC = () => {
  const { habits, addHabit, deleteHabit, markHabitComplete } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    color: 'bg-blue-500'
  });

  const handleCreateHabit = () => {
    if (newHabit.name.trim()) {
      addHabit(newHabit);
      setNewHabit({ name: '', description: '', color: 'bg-blue-500' });
      setIsCreating(false);
    }
  };

  const getWeekDates = () => {
    const start = startOfWeek(new Date());
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const weekDates = getWeekDates();

  const isHabitCompletedOnDate = (habit: any, date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return habit.completedDates.includes(dateString);
  };

  const handleToggleHabit = (habitId: string, date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    markHabitComplete(habitId, dateString);
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Habit Tracker</h2>
          <p className="text-sm sm:text-base text-gray-600">Build positive habits and track your progress</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreating(true)}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>New Habit</span>
        </motion.button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-400 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{habits.length}</p>
              <p className="text-xs sm:text-sm text-gray-600">Active Habits</p>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg sm:rounded-xl flex items-center justify-center">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {Math.max(...habits.map(h => h.streak), 0)}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Best Streak</p>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-400 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {habits.reduce((sum, habit) => sum + habit.completedDates.length, 0)}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Total Completions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Habit Modal */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setIsCreating(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-md"
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Create New Habit</h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Habit name (e.g., Drink 8 glasses of water)"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                />
                
                <textarea
                  placeholder="Description (optional)"
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm sm:text-base"
                />
                
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <span className="text-sm font-medium text-gray-700">Color:</span>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewHabit({ ...newHabit, color })}
                        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${color} border-2 transition-all ${
                          newHabit.color === color ? 'border-gray-900 scale-110' : 'border-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateHabit}
                    className="px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
                  >
                    Create Habit
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Habits List */}
      <div className="space-y-3 sm:space-y-4">
        {/* Week Header */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200/50 overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-8 gap-2 sm:gap-3">
              <div className="font-medium text-gray-900 text-sm sm:text-base">Habits</div>
              {weekDates.map((date) => (
                <div key={date.toISOString()} className="text-center">
                  <div className="text-xs font-medium text-gray-600">
                    {format(date, 'EEE')}
                  </div>
                  <div className={`text-sm font-bold ${isToday(date) ? 'text-purple-600' : 'text-gray-900'}`}>
                    {format(date, 'd')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Habits */}
        <AnimatePresence>
          {habits.map((habit) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/70 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200/50 shadow-sm overflow-x-auto"
            >
              <div className="min-w-[600px]">
                <div className="grid grid-cols-8 gap-2 sm:gap-3 items-center">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                    <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${habit.color} flex-shrink-0`}></div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{habit.name}</p>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <Flame className="w-2 h-2 sm:w-3 sm:h-3 text-orange-500 flex-shrink-0" />
                        <span className="text-xs text-gray-600">{habit.streak} day streak</span>
                        <button
                          onClick={() => deleteHabit(habit.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-2 h-2 sm:w-3 sm:h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {weekDates.map((date) => (
                    <div key={date.toISOString()} className="flex justify-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleToggleHabit(habit.id, date)}
                        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 transition-all ${
                          isHabitCompletedOnDate(habit, date)
                            ? `${habit.color} border-gray-700`
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {isHabitCompletedOnDate(habit, date) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-full h-full flex items-center justify-center"
                          >
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                          </motion.div>
                        )}
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {habits.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 sm:py-12"
        >
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No habits yet</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">Create your first habit to start building positive routines!</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreating(true)}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
          >
            Create Your First Habit
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};