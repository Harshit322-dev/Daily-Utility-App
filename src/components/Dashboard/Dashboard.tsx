import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckSquare, 
  FileText, 
  Target, 
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { todos, notes, habits, setCurrentView } = useStore();

  const completedTodos = todos.filter(todo => todo.completed).length;
  const totalHabits = habits.length;
  const activeStreaks = habits.filter(habit => habit.streak > 0).length;

  const cards = [
    {
      title: 'Tasks Completed',
      value: `${completedTodos}/${todos.length}`,
      icon: CheckSquare,
      color: 'from-green-400 to-emerald-600',
      onClick: () => setCurrentView('todos')
    },
    {
      title: 'Notes Created',
      value: notes.length.toString(),
      icon: FileText,
      color: 'from-blue-400 to-blue-600',
      onClick: () => setCurrentView('notes')
    },
    {
      title: 'Active Habits',
      value: `${activeStreaks}/${totalHabits}`,
      icon: Target,
      color: 'from-purple-400 to-purple-600',
      onClick: () => setCurrentView('habits')
    },
    {
      title: 'Productivity',
      value: '00%',
      icon: TrendingUp,
      color: 'from-orange-400 to-red-500',
      onClick: () => {}
    }
  ];

  const recentTodos = todos.slice(0, 5);
  const recentNotes = notes.slice(0, 3);

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-6 lg:space-y-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="text-center py-4 sm:py-6 lg:py-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2 lg:mb-4"
        >
          Welcome to Daily Utility App
        </motion.h1>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg px-4">
          Your all-in-one productivity suite for {format(new Date(), 'EEEE, MMMM do, yyyy')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={card.onClick}
              className="bg-white/70 backdrop-blur-xl rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-gray-200/50 shadow-xl cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r ${card.color} rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate ml-2">{card.value}</span>
              </div>
              <h3 className="text-gray-600 font-medium text-xs sm:text-sm lg:text-base truncate">{card.title}</h3>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/70 backdrop-blur-xl rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-gray-200/50"
        >
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900">Recent Tasks</h3>
            <button
              onClick={() => setCurrentView('todos')}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm lg:text-base"
            >
              View All
            </button>
          </div>
          <div className="space-y-2 lg:space-y-3">
            {recentTodos.length > 0 ? (
              recentTodos.map((todo) => (
                <div key={todo.id} className="flex items-center space-x-3 p-2 lg:p-3 hover:bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${todo.color} flex-shrink-0`}></div>
                  <span className={`flex-1 text-sm lg:text-base min-w-0 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    <span className="truncate block">{todo.text}</span>
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                    todo.priority === 'high' ? 'bg-red-100 text-red-800' :
                    todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {todo.priority}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-6 lg:py-8 text-sm lg:text-base">No tasks yet. Create your first task!</p>
            )}
          </div>
        </motion.div>

        {/* Recent Notes */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/70 backdrop-blur-xl rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-gray-200/50"
        >
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900">Recent Notes</h3>
            <button
              onClick={() => setCurrentView('notes')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm lg:text-base"
            >
              View All
            </button>
          </div>
          <div className="space-y-3 lg:space-y-4">
            {recentNotes.length > 0 ? (
              recentNotes.map((note) => (
                <div key={note.id} className="p-3 lg:p-4 hover:bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${note.color} flex-shrink-0`}></div>
                    <h4 className="font-medium text-gray-900 text-sm lg:text-base truncate flex-1">{note.title}</h4>
                  </div>
                  <p className="text-gray-600 text-xs lg:text-sm line-clamp-2 mb-2">{note.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 truncate flex-1">{note.category}</span>
                    <span className="text-xs text-gray-500 flex items-center flex-shrink-0 ml-2">
                      <Clock className="w-3 h-3 mr-1" />
                      {format(note.updatedAt, 'MMM d')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-6 lg:py-8 text-sm lg:text-base">No notes yet. Start writing!</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};