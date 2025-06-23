import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TodoList } from './components/TodoList/TodoList';
import { Notes } from './components/Notes/Notes';
import { HabitTracker } from './components/HabitTracker/HabitTracker';
import { DrawingPad } from './components/DrawingPad/DrawingPad';
import { TimerTools } from './components/TimerTools/TimerTools';
import { Calculator } from './components/Calculator/Calculator';
import { FileManager } from './components/FileManager/FileManager';
import { LoginForm } from './components/Auth/LoginForm';
import { PWAInstallPrompt } from './components/PWAInstallPrompt/PWAInstallPrompt';
import { useStore } from './store/useStore';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const { currentView, sidebarOpen } = useStore();
  const [isLogin, setIsLogin] = useState(true);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'todos':
        return <TodoList />;
      case 'notes':
        return <Notes />;
      case 'habits':
        return <HabitTracker />;
      case 'drawing':
        return <DrawingPad />;
      case 'timer':
        return <TimerTools />;
      case 'calculator':
        return <Calculator />;
      case 'files':
        return <FileManager />;
      default:
        return <Dashboard />;
    }
  };

  if (!user) {
    return <LoginForm onToggleMode={() => setIsLogin(!isLogin)} isLogin={isLogin} />;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 overflow-hidden">
      <Sidebar />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-72 xl:ml-80' : 'lg:ml-72 xl:ml-80'
      } w-full min-w-0`}>
        <Header />
        
        <main className="flex-1 overflow-auto">
          <div className="min-h-full">
            {renderCurrentView()}
          </div>
        </main>
      </div>
      
      <PWAInstallPrompt />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;