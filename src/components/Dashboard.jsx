import React, { useEffect, useState } from 'react';
import { Target, CheckCircle2, Circle, Dumbbell, ArrowRight, Flame, TrendingUp, Trophy } from 'lucide-react';
import * as Icons from 'lucide-react';
import dashboardData from '../data/dashboard.json';

// ─── Streak helpers ───────────────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

const loadStreakData = () => {
  try {
    const raw = localStorage.getItem('streak_data');
    return raw ? JSON.parse(raw) : { currentStreak: 0, bestStreak: 0, lastCompleted: null };
  } catch {
    return { currentStreak: 0, bestStreak: 0, lastCompleted: null };
  }
};

const saveStreakData = (data) => {
  try { localStorage.setItem('streak_data', JSON.stringify(data)); } catch {}
};

const getStreakMilestone = (streak) => {
  if (streak >= 30) return { label: '30-Day Legend 🏆', color: 'text-yellow-400' };
  if (streak >= 14) return { label: '2-Week Warrior 🔥', color: 'text-orange-400' };
  if (streak >= 7)  return { label: '7-Day Streak 💪',  color: 'text-emerald-400' };
  if (streak >= 3)  return { label: '3 Days Strong',     color: 'text-blue-400'    };
  return null;
};

// ─── Streak Display ───────────────────────────────────────────────────────────
const StreakCard = ({ streak, best }) => {
  const milestone = getStreakMilestone(streak);
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 flex items-center gap-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />
        <div className="p-2 bg-orange-500/15 rounded-xl">
          <Flame size={20} className="text-orange-400" />
        </div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Streak</p>
          <p className="text-2xl font-black text-gray-100 leading-none">{streak}<span className="text-sm font-normal text-gray-500 ml-1">days</span></p>
          {milestone && <p className={`text-[10px] font-semibold mt-0.5 ${milestone.color}`}>{milestone.label}</p>}
        </div>
      </div>
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 flex items-center gap-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent pointer-events-none" />
        <div className="p-2 bg-yellow-500/15 rounded-xl">
          <Trophy size={20} className="text-yellow-400" />
        </div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Best</p>
          <p className="text-2xl font-black text-gray-100 leading-none">{best}<span className="text-sm font-normal text-gray-500 ml-1">days</span></p>
          <p className="text-[10px] text-gray-500 mt-0.5">All-time record</p>
        </div>
      </div>
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const Dashboard = ({ progress, toggleProgress, setActiveTab, onViewWorkout }) => {
  const { tasks, routines } = dashboardData;
  const completedCount = Object.values(progress).filter(Boolean).length;
  const progressPercentage = (completedCount / tasks.length) * 100;
  const allDone = completedCount === tasks.length;

  const dayOfWeek = new Date().getDay().toString();
  const todaysRoutine = routines[dayOfWeek] || routines['0'];

  // ── Streak logic ──
  const [streakData, setStreakData] = useState(loadStreakData);

  useEffect(() => {
    if (!allDone) return;
    const today = todayStr();
    setStreakData(prev => {
      if (prev.lastCompleted === today) return prev; // already counted today

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().slice(0, 10);

      const isConsecutive = prev.lastCompleted === yStr;
      const newStreak = isConsecutive ? prev.currentStreak + 1 : 1;
      const newBest = Math.max(prev.bestStreak, newStreak);
      const next = { currentStreak: newStreak, bestStreak: newBest, lastCompleted: today };
      saveStreakData(next);
      return next;
    });
  }, [allDone]);

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Streak */}
      <StreakCard streak={streakData.currentStreak} best={streakData.bestStreak} />

      {/* Daily Progress Card */}
      <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 shadow-lg">
        <h2 className="text-lg font-bold mb-4 flex items-center">
          <Target className="mr-2 text-emerald-400" size={20} />
          Today's Goals
        </h2>

        {/* Progress Bar */}
        <div className="mb-5">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Progress</span>
            <span className="font-bold text-emerald-400">{completedCount} of {tasks.length}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-700 ease-out ${allDone ? 'bg-gradient-to-r from-emerald-500 to-green-400' : 'bg-emerald-500'}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {allDone && (
            <p className="text-xs text-emerald-400 font-semibold mt-2 text-center animate-in fade-in duration-500">
              🎉 All done! Streak updated!
            </p>
          )}
        </div>

        {/* Checklist */}
        <div className="space-y-3">
          {tasks.map((task) => {
            const Icon = Icons[task.icon];
            return (
              <button
                key={task.id}
                onClick={() => toggleProgress(task.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                  progress[task.id]
                    ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-100'
                    : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={18} className={progress[task.id] ? 'text-emerald-400' : task.color} />
                  <span className={`font-medium ${progress[task.id] ? 'line-through text-emerald-300/70' : ''}`}>
                    {task.label}
                  </span>
                </div>
                {progress[task.id] ? (
                  <CheckCircle2 size={22} className="text-emerald-400" />
                ) : (
                  <Circle size={22} className="text-gray-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800">
          <p className="text-xs text-gray-400 mb-1">Target Calories</p>
          <p className="text-xl font-bold text-gray-100">~1,950</p>
          <p className="text-xs text-orange-400 mt-1">Deficit for fat loss</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800">
          <p className="text-xs text-gray-400 mb-1">Target Protein</p>
          <p className="text-xl font-bold text-gray-100">140g</p>
          <p className="text-xs text-emerald-400 mt-1">Muscle building</p>
        </div>
      </div>

      {/* Today's Routine Card */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-2xl border border-gray-700 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
          <Dumbbell size={64} />
        </div>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center">
          <Dumbbell className="mr-2 text-emerald-400" size={14} />
          Today's Focus
        </h2>
        <h3 className="text-lg font-bold text-gray-100">{todaysRoutine.title}</h3>
        <p className="text-sm text-gray-400 mb-4">{todaysRoutine.desc}</p>

        <button
          onClick={() => {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            onViewWorkout(days[new Date().getDay()]);
          }}
          className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center"
        >
          View Exercises <ArrowRight size={16} className="ml-2" />
        </button>
      </div>

      {/* Quick links to other tabs */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Diet Plan', tab: 'nutrition', icon: 'Utensils', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
          { label: 'Posture', tab: 'posture', icon: 'Activity', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
          { label: 'Learn', tab: 'learn', icon: 'BookOpen', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
        ].map(({ label, tab, icon, color }) => {
          const Icon = Icons[icon];
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all hover:scale-[1.02] ${color}`}
            >
              <Icon size={18} />
              <span className="text-xs font-semibold">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
