import React from 'react';
import { Target, Sun, Moon, Monitor } from 'lucide-react';

const Header = ({ theme, setTheme }) => {
  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10 px-4 py-3 shadow-md">
      <div className="max-w-md mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Get Shredded
          </h1>
          <p className="text-xs text-gray-400">Target: Shred & Build</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Segmented Theme Picker */}
          <div className="flex bg-gray-800/80 p-1 rounded-full border border-gray-700/50 relative items-center">
            <button
              onClick={() => setTheme('light')}
              className={`p-2 rounded-full transition-all duration-200 relative z-10 ${theme === 'light' ? 'text-emerald-400 bg-gray-700/80 shadow-sm' : 'text-gray-400 hover:text-gray-200'
                }`}
              title="Light Mode"
            >
              <Sun size={16} />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-2 rounded-full transition-all duration-200 relative z-10 ${theme === 'dark' ? 'text-emerald-400 bg-gray-700/80 shadow-sm' : 'text-gray-400 hover:text-gray-200'
                }`}
              title="Dark Mode"
            >
              <Moon size={16} />
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`p-2 rounded-full transition-all duration-200 relative z-10 ${theme === 'system' ? 'text-emerald-400 bg-gray-700/80 shadow-sm' : 'text-gray-400 hover:text-gray-200'
                }`}
              title="System Theme"
            >
              <Monitor size={16} />
            </button>
          </div>

          <div className="flex items-center space-x-1.5 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700">
            <Target size={14} className="text-emerald-400" />
            <span className="text-sm font-medium">80.1 kg</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
