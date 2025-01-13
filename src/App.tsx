import React, { useState } from 'react';
import { Timer } from './components/Timer';
import { TodoList } from './components/TodoList';
import { BreakModal } from './components/BreakModal';
import { UpdatePrompt } from './components/UpdatePrompt';
import { usePWA } from './hooks/usePWA';
import { Clock } from 'lucide-react';

function App() {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const { isUpdateAvailable, updateServiceWorker } = usePWA();

  const handleTimerComplete = () => {
    if (isWorkTime) {
      setShowBreakModal(true);
      playAlarm();
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Work session complete!', {
          body: 'Time for a break!',
          icon: '/pwa-192x192.png'
        });
      }
    } else {
      setIsWorkTime(true);
      playAlarm();
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Break time complete!', {
          body: 'Ready to work?',
          icon: '/pwa-192x192.png'
        });
      }
    }
  };

  const playAlarm = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(console.error);
  };

  const handleStartBreak = () => {
    setShowBreakModal(false);
    setIsWorkTime(false);
  };

  const handleSkipBreak = () => {
    setShowBreakModal(false);
    setIsWorkTime(true);
  };

  // Request notification permission when the app starts
  React.useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-4 sm:py-8 px-2 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-4 sm:mb-8">
          <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 mr-2" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Pomodoro Timer</h1>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 max-w-sm mx-auto">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Work Minutes
              </label>
              <input
                type="number"
                value={workMinutes}
                onChange={(e) => setWorkMinutes(Math.max(1, Math.min(60, parseInt(e.target.value) || 25)))}
                className="w-full px-2 sm:px-3 py-1 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Break Minutes
              </label>
              <input
                type="number"
                value={breakMinutes}
                onChange={(e) => setBreakMinutes(Math.max(1, Math.min(30, parseInt(e.target.value) || 5)))}
                className="w-full px-2 sm:px-3 py-1 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
          </div>

          <Timer
            onTimerComplete={handleTimerComplete}
            isWorkTime={isWorkTime}
            workMinutes={workMinutes}
            breakMinutes={breakMinutes}
          />

          <TodoList />
        </div>
      </div>

      <BreakModal
        isOpen={showBreakModal}
        onStartBreak={handleStartBreak}
        onSkipBreak={handleSkipBreak}
      />

      <UpdatePrompt
        isUpdateAvailable={isUpdateAvailable}
        onUpdate={updateServiceWorker}
      />
    </div>
  );
}

export default App;