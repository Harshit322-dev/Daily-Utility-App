import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Camera, 
  Moon, 
  Sun, 
  LogOut, 
  Save,
  Mail,
  Calendar,
  Palette
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const avatarOptions = [
  '👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓', 
  '👨‍💻', '👩‍💻', '👨‍🎨', '👩‍🎨', '🧙‍♂️', '🧙‍♀️', '🦸‍♂️', '🦸‍♀️'
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '👤',
  });
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const handleSave = () => {
    updateProfile(formData);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-200/50 dark:border-gray-700/50 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <User className="w-6 h-6 mr-2 text-purple-600" />
              Settings
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Profile Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h3>
              
              {/* Avatar */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                    {formData.avatar}
                  </div>
                  <button
                    onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                    className="absolute -bottom-1 -right-1 p-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-lg transition-colors"
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{formData.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{formData.email}</p>
                </div>
              </div>

              {/* Avatar Picker */}
              {showAvatarPicker && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-8 gap-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl"
                >
                  {avatarOptions.map((avatar) => (
                    <motion.button
                      key={avatar}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setFormData({ ...formData, avatar });
                        setShowAvatarPicker(false);
                      }}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                        formData.avatar === avatar
                          ? 'bg-purple-500 shadow-lg'
                          : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500'
                      }`}
                    >
                      {avatar}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Preferences</h3>
              
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                <div className="flex items-center space-x-3">
                  {isDarkMode ? (
                    <Moon className="w-5 h-5 text-purple-600" />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {isDarkMode ? 'Dark theme enabled' : 'Light theme enabled'}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleDarkMode}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    isDarkMode ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                >
                  <motion.div
                    animate={{ x: isDarkMode ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                  />
                </motion.button>
              </div>

              {/* Account Info */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <p className="font-medium text-gray-900 dark:text-white">Member Since</p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 ml-8">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-2xl hover:shadow-lg transition-all duration-200 font-medium flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl transition-all duration-200 font-medium flex items-center space-x-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};