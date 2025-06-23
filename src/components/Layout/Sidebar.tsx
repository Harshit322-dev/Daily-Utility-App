import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  CheckSquare, 
  FileText, 
  Target, 
  PenTool, 
  Timer, 
  Calculator, 
  Folder,
  User,
  Settings,
  X,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../contexts/AuthContext';
import { SettingsModal } from '../Settings/SettingsModal';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, gradient: 'from-purple-500 to-blue-600' },
  { id: 'todos', label: 'To-Do List', icon: CheckSquare, gradient: 'from-green-500 to-emerald-600' },
  { id: 'notes', label: 'Notes', icon: FileText, gradient: 'from-blue-500 to-cyan-600' },
  { id: 'habits', label: 'Habit Tracker', icon: Target, gradient: 'from-orange-500 to-red-600' },
  { id: 'drawing', label: 'Drawing Pad', icon: PenTool, gradient: 'from-pink-500 to-rose-600' },
  { id: 'timer', label: 'Timer & Tools', icon: Timer, gradient: 'from-indigo-500 to-purple-600' },
  { id: 'calculator', label: 'Calculator', icon: Calculator, gradient: 'from-teal-500 to-cyan-600' },
  { id: 'files', label: 'File Manager', icon: Folder, gradient: 'from-amber-500 to-orange-600' },
];

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, sidebarOpen, setSidebarOpen } = useStore();
  const { user } = useAuth();
  const [showSettings, setShowSettings] = React.useState(false);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -320,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 h-full w-72 sm:w-80 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 z-50 lg:relative lg:translate-x-0 shadow-xl lg:shadow-none flex flex-col"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b border-gray-200/50 dark:border-gray-700/50 flex-shrink-0">
            <motion.div 
              className="flex items-center space-x-2 lg:space-x-3 min-w-0 flex-1"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent truncate">
                  Daily Utility
                </h1>
                <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 font-medium truncate">Your productivity suite</p>
              </div>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200 flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 sm:p-3 lg:p-4 space-y-1 lg:space-y-2 overflow-y-auto">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCurrentView(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2 sm:space-x-3 lg:space-x-4 px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 rounded-xl lg:rounded-2xl transition-all duration-300 group ${
                    isActive
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-purple-500/25`
                      : 'hover:bg-gray-100/80 dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className={`p-1 sm:p-1.5 lg:p-2 rounded-lg lg:rounded-xl transition-all duration-300 flex-shrink-0 ${
                    isActive 
                      ? 'bg-white/20' 
                      : 'bg-gray-100 dark:bg-gray-600 group-hover:bg-white dark:group-hover:bg-gray-500 group-hover:shadow-sm'
                  }`}>
                    <Icon className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200'
                    }`} />
                  </div>
                  <span className="font-medium text-xs sm:text-sm lg:text-sm truncate flex-1 text-left">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full flex-shrink-0"
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-2 sm:p-3 lg:p-4 border-t border-gray-200/50 dark:border-gray-700/50 flex-shrink-0">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowSettings(true)}
              className="flex items-center space-x-2 lg:space-x-3 p-2 sm:p-3 lg:p-4 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-xl lg:rounded-2xl transition-all duration-300 cursor-pointer group"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 text-lg sm:text-xl lg:text-2xl">
                {user?.avatar || <User className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm truncate">
                  {user?.name || 'Demo User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || 'demo@dailyutility.com'}
                </p>
              </div>
              <Settings className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300 flex-shrink-0" />
            </motion.div>
          </div>
        </div>
      </motion.aside>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
};