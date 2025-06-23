import React from 'react';
import { Menu, Bell, Search, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export const Header: React.FC = () => {
  const { setSidebarOpen, currentView, notifications, removeNotification, clearNotifications } = useStore();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      todos: 'To-Do List',
      notes: 'Notes',
      habits: 'Habit Tracker',
      drawing: 'Drawing Pad',
      timer: 'Timer & Tools',
      calculator: 'Calculator',
      files: 'File Manager',
    };
    return titles[currentView] || 'Daily Utility';
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 lg:py-4">
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 flex-shrink-0"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </button>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent truncate">
              {getPageTitle()}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 hidden sm:block truncate">
              {format(new Date(), 'EEEE, MMMM do, yyyy')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 flex-shrink-0">
          {/* Search - Desktop */}
          <div className="hidden lg:flex items-center space-x-2 bg-gray-100/80 rounded-xl px-4 py-2 backdrop-blur-sm">
            <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm w-48 placeholder-gray-500"
            />
          </div>

          {/* Search - Mobile */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="lg:hidden p-2 sm:p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
          </button>
          
          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 sm:p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200 relative"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              {notifications.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
                >
                  {notifications.length > 9 ? '9+' : notifications.length}
                </motion.span>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 z-50 max-h-96 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-200/50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <div className="flex items-center space-x-2">
                        {notifications.length > 0 && (
                          <button
                            onClick={clearNotifications}
                            className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                          >
                            Clear All
                          </button>
                        )}
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-4 border-b border-gray-100/50 hover:bg-gray-50/50 transition-colors group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm truncate">
                                {notification.title}
                              </p>
                              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {format(notification.timestamp, 'MMM d, h:mm a')}
                              </p>
                            </div>
                            <button
                              onClick={() => removeNotification(notification.id)}
                              className="p-1 hover:bg-gray-200 rounded-lg transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0 ml-2"
                            >
                              <X className="w-3 h-3 text-gray-500" />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No notifications yet</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-200/50 p-4"
          >
            <div className="flex items-center space-x-2 bg-gray-100/80 rounded-xl px-4 py-3 backdrop-blur-sm">
              <Search className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm flex-1 placeholder-gray-500"
                autoFocus
              />
              <button
                onClick={() => setShowSearch(false)}
                className="p-1 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};