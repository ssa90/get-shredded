import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, PlayCircle, ExternalLink, Zap, Heart, TrendingDown, Timer } from 'lucide-react';
import ExerciseImage from './ExerciseImage';
import workoutData from '../data/workouts.json';

// ─── Cardio Guide ─────────────────────────────────────────────────────────────
const CardioGuide = () => {
  const [open, setOpen] = useState(false);
  const [activeCard, setActiveCard] = useState('hiit');

  const cards = [
    {
      id: 'hiit',
      title: 'HIIT',
      subtitle: 'High-Intensity Interval Training',
      icon: Zap,
      color: 'orange',
      verdict: '✅ Recommended',
      verdictColor: 'text-emerald-400',
      description: 'Burst at max speed for 30-45 seconds, walk for 60 seconds, repeat. Your body cannot go as long as LISS, but results are superior.',
      benefits: [
        'Preserves and even builds muscle mass',
        'Burns more total calories in less time',
        'Raises metabolism for 24+ hours (EPOC effect)',
        'Elevates testosterone & growth hormone — balances cortisol',
      ],
      warning: null,
      protocol: ['Sprint at maximum speed for 30–45 seconds', 'Walk or rest for 60 seconds', 'Repeat 6–10 rounds', 'Done in 15–20 minutes total'],
    },
    {
      id: 'liss',
      title: 'LISS',
      subtitle: 'Low-Intensity Steady State',
      icon: Heart,
      color: 'blue',
      verdict: '⚠️ Use carefully',
      verdictColor: 'text-yellow-400',
      description: 'Jogging, cycling, walking at 70-75% max heart rate for 30-60 min. Burns fat but at the cost of muscle mass if done alone.',
      benefits: [
        'Good for cardiovascular health',
        'Low stress on the nervous system',
        'Useful for active recovery days',
        'Can burn the last few pounds pre-contest (in combo with weights)',
      ],
      warning: 'LISS without resistance training increases cortisol, causing muscle breakdown. Always pair with weight training.',
      protocol: ['Maintain 70–75% of max heart rate', 'Duration: 30–60 minutes', 'Cycling, brisk walk, or elliptical', 'Always combine with strength training'],
    },
  ];

  const activeData = cards.find(c => c.id === activeCard);

  const Icon = activeData.icon;

  const cardColors = {
    orange: { border: 'border-orange-500/40 bg-orange-900/20', badge: 'bg-orange-500/15 text-orange-400', dot: 'bg-orange-400', ring: 'ring-orange-500/30' },
    blue:   { border: 'border-blue-500/40 bg-blue-900/20',     badge: 'bg-blue-500/15 text-blue-400',     dot: 'bg-blue-400',   ring: 'ring-blue-500/30'   },
  };

  const ac = cardColors[activeData.color];

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 bg-gray-800/30 border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <TrendingDown size={18} className="text-orange-400" />
          <span className="font-bold text-gray-100">Cardio Guide: LISS vs HIIT</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 hidden sm:block">From JC's guide</span>
          {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="p-4 space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
          <p className="text-sm text-gray-400 leading-relaxed">
            JC's verdict: <span className="text-gray-200 font-medium">cardio alone is NOT the best tool for fat loss</span> — your diet is. Use cardio for cardiovascular health, and choose the right type.
          </p>

          {/* Selector */}
          <div className="grid grid-cols-2 gap-2">
            {cards.map(card => {
              const CardIcon = card.icon;
              const c = cardColors[card.color];
              return (
                <button
                  key={card.id}
                  onClick={() => setActiveCard(card.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-left ${activeCard === card.id ? c.border : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'}`}
                >
                  <CardIcon size={16} className={activeCard === card.id ? `text-${card.color}-400` : 'text-gray-500'} />
                  <div>
                    <p className={`text-sm font-bold ${activeCard === card.id ? `text-${card.color}-300` : 'text-gray-400'}`}>{card.title}</p>
                    <p className="text-[10px] text-gray-500">{card.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-200">{activeData.title} — {activeData.subtitle}</h4>
              <span className={`text-xs font-semibold ${activeData.verdictColor}`}>{activeData.verdict}</span>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed">{activeData.description}</p>

            {activeData.warning && (
              <div className="flex items-start gap-2 bg-yellow-900/15 border border-yellow-500/25 rounded-xl p-3">
                <span className="text-yellow-400 text-base shrink-0">⚠️</span>
                <p className="text-xs text-yellow-200/80 leading-relaxed">{activeData.warning}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/50">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Benefits</p>
                <ul className="space-y-1">
                  {activeData.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-gray-300">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${ac.dot}`} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/50">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Timer size={10} /> Protocol</p>
                <ul className="space-y-1">
                  {activeData.protocol.map((step, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-gray-300">
                      <span className="text-gray-600 shrink-0 font-mono">{i+1}.</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-700/50 text-center">
            <p className="text-xs text-gray-500 italic">
              "Use cardio for cardiovascular health. The more muscles you have, the more fat you burn — even while resting." — JC
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Exercise Card ────────────────────────────────────────────────────────────
const ExerciseCard = ({ ex, colorClass = 'text-emerald-400', expandedId, toggleExpand }) => {
  const isExpanded = expandedId === ex.id;
  return (
    <div className="border-b border-gray-800/50 last:border-0 last:pb-0 pb-4">
      <button
        onClick={() => toggleExpand(ex.id)}
        className="w-full flex justify-between items-start text-left focus:outline-none group"
      >
        <div className="pr-4 flex-1">
          <p className={`font-semibold text-gray-200 group-hover:${colorClass} transition-colors flex items-center`}>
            {ex.name}
            {isExpanded ? <ChevronUp size={16} className="ml-2 text-gray-500" /> : <ChevronDown size={16} className="ml-2 text-gray-500" />}
          </p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{ex.notes}</p>
        </div>
        <div className="text-right whitespace-nowrap bg-gray-800 px-3 py-1.5 rounded-lg">
          <p className={`text-sm font-bold ${colorClass}`}>{ex.sets} Sets</p>
          <p className="text-xs text-gray-400">{ex.reps}</p>
        </div>
      </button>

      {isExpanded && (
        <div className="mt-4 animate-in slide-in-from-top-2 fade-in duration-200">
          <div
            className="relative aspect-video rounded-xl overflow-hidden bg-gray-950 mb-2 group/video cursor-pointer border border-gray-800"
            onClick={() => window.open(ex.video, '_blank')}
          >
            <ExerciseImage src={ex.image} alt={ex.name} className="w-full h-full object-contain opacity-60 group-hover/video:opacity-40 transition-opacity" />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 group-hover/video:bg-black/40 transition-colors">
              <PlayCircle size={40} className={`${colorClass} mb-2 drop-shadow-lg group-hover/video:scale-110 transition-transform`} />
              <span className="text-xs font-semibold text-white drop-shadow-md flex items-center">
                Watch Form Tutorial <ExternalLink size={12} className="ml-1" />
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Section Wrapper ──────────────────────────────────────────────────────────
const SectionWrapper = ({ children, title, subtitle, desc, id, highlight, accentColor = 'text-emerald-400' }) => (
  <div
    id={id}
    className={`bg-gray-900 rounded-2xl border overflow-hidden mb-6 transition-all duration-700 ${
      highlight
        ? 'border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)] scale-[1.02]'
        : 'border-gray-800'
    }`}
  >
    <div className="p-4 bg-gray-800/30 border-b border-gray-800">
      <span className={`text-xs font-bold ${accentColor} uppercase tracking-wider`}>{subtitle}</span>
      <h4 className="text-lg font-bold text-gray-100 mt-1">{title}</h4>
      <p className="text-xs text-gray-400">{desc}</p>
    </div>
    <div className="p-4 space-y-4">{children}</div>
  </div>
);

// ─── Main WorkoutPlan ─────────────────────────────────────────────────────────
const WorkoutPlan = ({ scrollToDay, clearScrollToDay }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [highlightedDay, setHighlightedDay] = useState(null);
  const { warmups, routines, cooldowns } = workoutData;

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  useEffect(() => {
    if (scrollToDay) {
      const dayId = `workout-day-${scrollToDay.toLowerCase()}`;
      const element = document.getElementById(dayId);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setHighlightedDay(scrollToDay);
          const highlightTimer = setTimeout(() => setHighlightedDay(null), 2500);
          return () => clearTimeout(highlightTimer);
        }, 150);
        return () => clearTimeout(timer);
      }
      clearScrollToDay();
    }
  }, [scrollToDay, clearScrollToDay]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-2xl">
        <h3 className="text-emerald-400 font-bold mb-1">The 7-Day Shred & Build</h3>
        <p className="text-sm text-emerald-100/80">
          Always do your posture warmup before your Monday, Tuesday, Thursday, and Friday workouts.
        </p>
      </div>

      {/* Cardio Guide */}
      <CardioGuide />

      <div className="space-y-4">
        {/* Dynamic Warm-up */}
        <SectionWrapper
          title="Dynamic Warm-up"
          subtitle="Before Every Workout"
          desc="Prep joints and raise core temp (3 mins)"
          accentColor="text-orange-400"
        >
          {warmups.map(ex => (
            <ExerciseCard key={ex.id} ex={ex} colorClass="text-orange-400" expandedId={expandedId} toggleExpand={toggleExpand} />
          ))}
        </SectionWrapper>

        {routines.map((routine, idx) => (
          <SectionWrapper
            key={idx}
            id={`workout-day-${routine.day.toLowerCase()}`}
            title={routine.title}
            subtitle={routine.day}
            desc={routine.focus}
            highlight={highlightedDay === routine.day}
          >
            {routine.exercises.map(ex => (
              <ExerciseCard key={ex.id} ex={ex} expandedId={expandedId} toggleExpand={toggleExpand} />
            ))}
          </SectionWrapper>
        ))}

        {/* Static Cool-down */}
        <SectionWrapper
          title="Static Cool-down"
          subtitle="After Every Workout"
          desc="Lower heart rate and stretch muscles (3 mins)"
          accentColor="text-blue-400"
        >
          {cooldowns.map(ex => (
            <ExerciseCard key={ex.id} ex={ex} colorClass="text-blue-400" expandedId={expandedId} toggleExpand={toggleExpand} />
          ))}
        </SectionWrapper>
      </div>
    </div>
  );
};

export default WorkoutPlan;
