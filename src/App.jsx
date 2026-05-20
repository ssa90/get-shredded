import React, { useState, useEffect } from 'react';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import Dashboard from './components/Dashboard';
import WorkoutPlan from './components/WorkoutPlan';
import PostureRoutine from './components/PostureRoutine';
import NutritionPlan from './components/NutritionPlan';
import Learn from './components/Learn';
import { useLocalStorage } from './hooks/useLocalStorage';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scrollToDay, setScrollToDay] = useState(null);

  // Theme Management
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme_preference') || 'system';
    } catch (e) {
      console.warn('localStorage is not accessible:', e);
      return 'system';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    try {
      localStorage.setItem('theme_preference', theme);
    } catch (e) {
      console.warn('localStorage is not accessible:', e);
    }

    const applyTheme = (currentTheme) => {
      if (currentTheme === 'system') {
        const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.setAttribute('data-theme', isDark ? 'dark' : 'light');
      } else {
        root.setAttribute('data-theme', currentTheme);
      }
    };

    applyTheme(theme);

    if (theme === 'system' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      };

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, [theme]);

  const [dailyProgress, setDailyProgress] = useLocalStorage('recomp_progress', {
    workout: false,
    posture: false,
    steps: false,
    protein: false,
  });

  const toggleProgress = (key) => {
    setDailyProgress(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleViewWorkout = (dayName) => {
    setScrollToDay(dayName);
    setActiveTab('workout');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-green-500/30">
      <Header theme={theme} setTheme={setTheme} />

      <main className="max-w-md mx-auto pb-24 p-4 space-y-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            progress={dailyProgress}
            toggleProgress={toggleProgress}
            setActiveTab={setActiveTab}
            onViewWorkout={handleViewWorkout}
          />
        )}
        {activeTab === 'workout' && (
          <WorkoutPlan
            scrollToDay={scrollToDay}
            clearScrollToDay={() => setScrollToDay(null)}
          />
        )}
        {activeTab === 'posture'   && <PostureRoutine />}
        {activeTab === 'nutrition' && <NutritionPlan  />}
        {activeTab === 'learn'     && <Learn          />}
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
