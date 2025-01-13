import React from 'react';

interface BreakModalProps {
  isOpen: boolean;
  onStartBreak: () => void;
  onSkipBreak: () => void;
}

export const BreakModal: React.FC<BreakModalProps> = ({ isOpen, onStartBreak, onSkipBreak }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <h3 className="text-xl font-bold mb-4">Work Time Complete!</h3>
        <p className="mb-6">Would you like to start your break?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onSkipBreak}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Skip Break
          </button>
          <button
            onClick={onStartBreak}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Start Break
          </button>
        </div>
      </div>
    </div>
  );
};