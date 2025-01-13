import React from 'react';
import { RefreshCw } from 'lucide-react';

interface UpdatePromptProps {
  isUpdateAvailable: boolean;
  onUpdate: () => void;
}

export const UpdatePrompt: React.FC<UpdatePromptProps> = ({ isUpdateAvailable, onUpdate }) => {
  if (!isUpdateAvailable) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
      <span>Update available!</span>
      <button
        onClick={onUpdate}
        className="flex items-center space-x-1 bg-blue-600 px-2 py-1 rounded hover:bg-blue-700 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Update</span>
      </button>
    </div>
  );
};