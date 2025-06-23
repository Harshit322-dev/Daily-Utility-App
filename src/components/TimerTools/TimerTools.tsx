import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, RotateCcw, Plus, Minus } from 'lucide-react';

const playTimerSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Create a pleasant notification sound
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.warn('Could not play timer sound:', error);
  }
};

export const TimerTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'timer' | 'stopwatch' | 'counter'>('timer');

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
        {[
          { id: 'timer', label: 'Timer' },
          { id: 'stopwatch', label: 'Stopwatch' },
          { id: 'counter', label: 'Tap Counter' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'timer' && <Timer />}
      {activeTab === 'stopwatch' && <Stopwatch />}
      {activeTab === 'counter' && <TapCounter />}
    </div>
  );
};

const Timer: React.FC = () => {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            // Play notification sound
            playTimerSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(minutes * 60 + seconds);
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const displayTime = timeLeft > 0 ? formatTime(timeLeft) : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 text-center">
      <div className="mb-8">
        <div className="text-6xl font-mono font-bold text-gray-900 mb-6">
          {displayTime}
        </div>
        
        {timeLeft === 0 && !isRunning && (
          <div className="flex justify-center space-x-8 mb-6">
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">Minutes</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setMinutes(Math.max(0, minutes - 1))}
                  className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-semibold w-12">{minutes}</span>
                <button
                  onClick={() => setMinutes(Math.min(59, minutes + 1))}
                  className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">Seconds</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSeconds(Math.max(0, seconds - 1))}
                  className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-semibold w-12">{seconds}</span>
                <button
                  onClick={() => setSeconds(Math.min(59, seconds + 1))}
                  className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isRunning ? pauseTimer : startTimer}
          disabled={timeLeft === 0 && minutes === 0 && seconds === 0}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          <span>{isRunning ? 'Pause' : 'Start'}</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetTimer}
          className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-all duration-200 flex items-center space-x-2"
        >
          <RotateCcw className="w-6 h-6" />
          <span>Reset</span>
        </motion.button>
      </div>
    </div>
  );
};

const Stopwatch: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (centiseconds: number) => {
    const minutes = Math.floor(centiseconds / 6000);
    const seconds = Math.floor((centiseconds % 6000) / 100);
    const cs = centiseconds % 100;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };
  const handleLap = () => setLaps([...laps, time]);

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 text-center">
      <div className="mb-8">
        <div className="text-6xl font-mono font-bold text-gray-900 mb-6">
          {formatTime(time)}
        </div>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isRunning ? handlePause : handleStart}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          <span>{isRunning ? 'Pause' : 'Start'}</span>
        </motion.button>
        
        {isRunning && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLap}
            className="px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition-all duration-200"
          >
            Lap
          </motion.button>
        )}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-all duration-200 flex items-center space-x-2"
        >
          <RotateCcw className="w-6 h-6" />
          <span>Reset</span>
        </motion.button>
      </div>

      {laps.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Laps</h3>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {laps.map((lap, index) => (
              <div key={index} className="flex justify-between items-center py-2 px-4 bg-gray-50 rounded-lg">
                <span className="font-medium">Lap {index + 1}</span>
                <span className="font-mono text-lg">{formatTime(lap)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TapCounter: React.FC = () => {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(100);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(Math.max(0, count - 1));
  const reset = () => setCount(0);

  const progress = (count / target) * 100;

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 text-center">
      <div className="mb-8">
        <div className="text-8xl font-bold text-gray-900 mb-4">
          {count}
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Target: {target}</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-center items-center space-x-4 mb-6">
          <label className="text-sm font-medium text-gray-700">Target:</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={increment}
          className="px-12 py-6 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 text-xl font-semibold"
        >
          TAP +
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={decrement}
          className="px-8 py-6 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition-all duration-200 flex items-center"
        >
          <Minus className="w-6 h-6" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={reset}
          className="px-8 py-6 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-all duration-200 flex items-center"
        >
          <RotateCcw className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
};

export default TimerTools;