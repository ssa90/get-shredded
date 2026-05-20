import React from 'react';
import { Home, Dumbbell, Activity, Utensils, BookOpen } from 'lucide-react';

const tabs = [
  { id: 'dashboard', label: 'Home',     icon: Home      },
  { id: 'workout',   label: 'Training', icon: Dumbbell  },
  { id: 'posture',   label: 'Posture',  icon: Activity  },
  { id: 'nutrition', label: 'Diet',     icon: Utensils  },
  { id: 'learn',     label: 'Learn',    icon: BookOpen  },
];

const Navigation = ({ activeTab, setActiveTab }) => (
  <nav className="fixed bottom-0 w-full bg-gray-900 border-t border-gray-800 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
    <div className="max-w-md mx-auto flex justify-around p-2">
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 ${
              isActive ? 'text-emerald-400 bg-emerald-400/10' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Icon size={19} className="mb-1" strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[9px] font-medium leading-none">{label}</span>
          </button>
        );
      })}
    </div>
  </nav>
);

export default Navigation;
