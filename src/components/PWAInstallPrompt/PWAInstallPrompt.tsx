import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Apple } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check device type
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const android = /Android/.test(navigator.userAgent);
    setIsIOS(iOS);
    setIsAndroid(android);

    // Check if app is already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after a delay if not dismissed before
      setTimeout(() => {
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        const lastDismissed = localStorage.getItem('pwa-install-last-dismissed');
        const now = Date.now();
        const daysSinceLastDismiss = lastDismissed ? 
          (now - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24) : 999;
        
        // Show again after 7 days or if never dismissed
        if ((!dismissed || daysSinceLastDismiss > 7) && !standalone) {
          setShowPrompt(true);
        }
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show install prompt if not standalone and not dismissed recently
    if (iOS && !standalone) {
      setTimeout(() => {
        const dismissed = localStorage.getItem('pwa-install-dismissed-ios');
        const lastDismissed = localStorage.getItem('pwa-install-last-dismissed-ios');
        const now = Date.now();
        const daysSinceLastDismiss = lastDismissed ? 
          (now - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24) : 999;
        
        if (!dismissed || daysSinceLastDismiss > 7) {
          setShowPrompt(true);
        }
      }, 5000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    const now = Date.now().toString();
    
    if (isIOS) {
      localStorage.setItem('pwa-install-dismissed-ios', 'true');
      localStorage.setItem('pwa-install-last-dismissed-ios', now);
    } else {
      localStorage.setItem('pwa-install-dismissed', 'true');
      localStorage.setItem('pwa-install-last-dismissed', now);
    }
  };

  // Don't show if already installed
  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-gray-200/50">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              {isIOS ? (
                <Apple className="w-6 h-6 text-white" />
              ) : (
                <Smartphone className="w-6 h-6 text-white" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-1">
                {isIOS ? 'Add to Home Screen' : 'Install Daily Utility'}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {isIOS 
                  ? 'Tap the share button (⬆️) in Safari and select "Add to Home Screen" for the best experience.'
                  : isAndroid
                  ? 'Install this app on your Android device for quick access and offline use!'
                  : 'Install this app on your device for a better experience!'
                }
              </p>
              
              {isIOS && (
                <div className="text-xs text-gray-500 mb-3 p-2 bg-blue-50 rounded-lg">
                  <strong>Steps:</strong><br/>
                  1. Tap the Share button (⬆️) at the bottom<br/>
                  2. Scroll down and tap "Add to Home Screen"<br/>
                  3. Tap "Add" to confirm
                </div>
              )}
              
              <div className="flex space-x-2">
                {!isIOS && deferredPrompt && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleInstallClick}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl text-sm font-medium flex items-center space-x-1"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install</span>
                  </motion.button>
                )}
                
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
                >
                  {isIOS ? 'Got it' : 'Later'}
                </button>
              </div>
            </div>
            
            <button
              onClick={handleDismiss}
              className="p-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};