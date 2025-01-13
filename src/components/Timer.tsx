import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimerProps {
  onTimerComplete: () => void;
  isWorkTime: boolean;
  workMinutes: number;
  breakMinutes: number;
}

const CIRCLE_CIRCUMFERENCE = 282.74; // 2 * π * 45 (radius)

export const Timer: React.FC<TimerProps> = ({ onTimerComplete, isWorkTime, workMinutes, breakMinutes }) => {
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [endTime, setEndTime] = useState<string>('');
  const timerRef = useRef<number>();

  useEffect(() => {
    setTimeLeft(isWorkTime ? workMinutes * 60 : breakMinutes * 60);
  }, [isWorkTime, workMinutes, breakMinutes]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const updateEndTimeDisplay = (seconds: number) => {
    const endTime = new Date(Date.now() + seconds * 1000);
    return endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateProgress = () => {
    const totalTime = isWorkTime ? workMinutes * 60 : breakMinutes * 60;
    const progress = timeLeft / totalTime;
    return CIRCLE_CIRCUMFERENCE * (1 - progress);
  };

  const startTimer = () => {
    if (timerRef.current) return;
    
    setIsActive(true);
    setEndTime(updateEndTimeDisplay(timeLeft));

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsActive(false);
          setEndTime('');
          onTimerComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    }
    setIsActive(false);
    setEndTime('');
  };

  const resetTimer = () => {
    pauseTimer();
    setTimeLeft(workMinutes * 60);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          {isWorkTime ? 'Work Time' : 'Break Time'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {isActive ? (isWorkTime ? 'Working...' : 'Taking a break...') : 'Ready to start'}
        </p>
        {endTime && <p className="text-xs text-gray-400 mt-1">Ends at {endTime}</p>}
      </div>

      <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto mb-4 sm:mb-6">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="4"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={isWorkTime ? '#ef4444' : '#22c55e'}
            strokeWidth="4"
            strokeDasharray={CIRCLE_CIRCUMFERENCE}
            strokeDashoffset={calculateProgress()}
            className="timer-ring transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl sm:text-4xl font-bold text-gray-800">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="flex space-x-3 sm:space-x-4">
        <button
          onClick={isActive ? pauseTimer : startTimer}
          className="flex items-center px-4 sm:px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-sm sm:text-base"
        >
          {isActive ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
          <span className="ml-2">{isActive ? 'Pause' : 'Start'}</span>
        </button>
        <button
          onClick={resetTimer}
          className="flex items-center px-4 sm:px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors text-sm sm:text-base"
        >
          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="ml-2">Reset</span>
        </button>
      </div>
    </div>
  );
};