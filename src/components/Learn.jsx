import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { BookOpen, ChevronDown, ChevronUp, CheckCircle2, XCircle, Zap, FlaskConical } from 'lucide-react';
import supplementsData from '../data/supplements.json';
import hormonesData from '../data/hormones.json';

// ─── Color Maps ───────────────────────────────────────────────────────────────
const COLOR = {
  emerald: { badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', icon: 'text-emerald-400', ring: 'focus:ring-emerald-500/30', glow: 'hover:border-emerald-500/40', activeBorder: 'border-emerald-500/50 bg-emerald-900/20' },
  yellow:  { badge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',   icon: 'text-yellow-400',  ring: 'focus:ring-yellow-500/30',  glow: 'hover:border-yellow-500/40',  activeBorder: 'border-yellow-500/50 bg-yellow-900/20'  },
  purple:  { badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30',   icon: 'text-purple-400',  ring: 'focus:ring-purple-500/30',  glow: 'hover:border-purple-500/40',  activeBorder: 'border-purple-500/50 bg-purple-900/20'  },
  blue:    { badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',         icon: 'text-blue-400',    ring: 'focus:ring-blue-500/30',    glow: 'hover:border-blue-500/40',    activeBorder: 'border-blue-500/50 bg-blue-900/20'      },
  pink:    { badge: 'bg-pink-500/15 text-pink-400 border-pink-500/30',         icon: 'text-pink-400',    ring: 'focus:ring-pink-500/30',    glow: 'hover:border-pink-500/40',    activeBorder: 'border-pink-500/50 bg-pink-900/20'      },
  orange:  { badge: 'bg-orange-500/15 text-orange-400 border-orange-500/30',   icon: 'text-orange-400',  ring: 'focus:ring-orange-500/30',  glow: 'hover:border-orange-500/40',  activeBorder: 'border-orange-500/50 bg-orange-900/20'  },
  red:     { badge: 'bg-red-500/15 text-red-400 border-red-500/30',            icon: 'text-red-400',     ring: 'focus:ring-red-500/30',     glow: 'hover:border-red-500/40',     activeBorder: 'border-red-500/50 bg-red-900/20'        },
  cyan:    { badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',         icon: 'text-cyan-400',    ring: 'focus:ring-cyan-500/30',    glow: 'hover:border-cyan-500/40',    activeBorder: 'border-cyan-500/50 bg-cyan-900/20'      },
};

// ─── Supplement Card ──────────────────────────────────────────────────────────
const SupplementCard = ({ supp }) => {
  const [open, setOpen] = useState(false);
  const c = COLOR[supp.color] || COLOR.emerald;
  const Icon = Icons[supp.icon] || Icons.Pill;

  return (
    <div className={`bg-gray-900 rounded-2xl border transition-all duration-300 overflow-hidden ${open ? c.activeBorder : `border-gray-800 ${c.glow}`}`}>
      <button onClick={() => setOpen(!open)} className="w-full text-left p-4 focus:outline-none">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl bg-gray-800/80 shrink-0 mt-0.5 ${c.icon}`}>
            <Icon size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="font-bold text-gray-100">{supp.name}</h4>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.badge}`}>{supp.category}</span>
                {open ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{supp.tagline}</p>
          </div>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="h-px bg-gray-800" />

          {/* Worth it indicator */}
          <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border ${supp.worth_it ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400' : 'bg-gray-800/40 border-gray-700 text-gray-400'}`}>
            {supp.worth_it ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
            {supp.worth_it ? 'Highly Recommended by JC' : 'Situational — only if you need it'}
          </div>

          {/* How it works */}
          <div>
            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">How It Works</h5>
            <p className="text-sm text-gray-300 leading-relaxed">{supp.how_it_works}</p>
          </div>

          {/* Dosage & Timing */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Dosage</p>
              <p className="text-xs text-gray-300 leading-relaxed">{supp.dosage}</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">When</p>
              <p className="text-xs text-gray-300 leading-relaxed">{supp.timing}</p>
            </div>
          </div>

          {/* JC's tip */}
          <div className="bg-emerald-900/15 border border-emerald-500/20 rounded-xl p-3">
            <p className="text-xs text-emerald-300/90 italic leading-relaxed">
              <span className="text-emerald-400 font-semibold not-italic">JC says: </span>
              {supp.jc_tip}
            </p>
          </div>

          {/* Myths */}
          {supp.myths?.length > 0 && (
            <div>
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Common Myths — Busted</h5>
              <div className="space-y-1.5">
                {supp.myths.map((myth, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                    <XCircle size={13} className="text-red-400/70 mt-0.5 shrink-0" />
                    <span className="leading-relaxed line-through decoration-gray-600">{myth}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Hormone Card ─────────────────────────────────────────────────────────────
const HormoneCard = ({ hormone }) => {
  const [open, setOpen] = useState(false);
  const c = COLOR[hormone.color] || COLOR.blue;
  const Icon = Icons[hormone.icon] || Icons.Activity;

  const TYPE_BADGE = {
    Metabolic: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    Anabolic: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Regulatory: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    Catabolic: 'bg-red-500/15 text-red-400 border-red-500/30',
  };

  return (
    <div className={`bg-gray-900 rounded-2xl border transition-all duration-300 overflow-hidden ${open ? c.activeBorder : `border-gray-800 ${c.glow}`}`}>
      <button onClick={() => setOpen(!open)} className="w-full text-left p-4 focus:outline-none">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl bg-gray-800/80 shrink-0 mt-0.5 ${c.icon}`}>
            <Icon size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="font-bold text-gray-100">{hormone.name}</h4>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${TYPE_BADGE[hormone.type] || 'bg-gray-800 text-gray-400'}`}>{hormone.type}</span>
                {open ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{hormone.role}</p>
          </div>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="h-px bg-gray-800" />

          <div>
            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">What It Does</h5>
            <p className="text-sm text-gray-300 leading-relaxed">{hormone.description}</p>
          </div>

          <div>
            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Why It Matters for Your Goals</h5>
            <p className="text-sm text-gray-300 leading-relaxed">{hormone.fitness_relevance}</p>
          </div>

          <div>
            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Practical Tips</h5>
            <div className="space-y-2">
              {hormone.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <CheckCircle2 size={14} className={`${c.icon} mt-0.5 shrink-0`} />
                  <span className="leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, subtitle, color }) => (
  <div className={`flex items-start gap-3 p-4 rounded-2xl border ${color}`}>
    <Icon size={22} className="shrink-0 mt-0.5" />
    <div>
      <h3 className="font-bold mb-0.5">{title}</h3>
      <p className="text-sm opacity-80 leading-relaxed">{subtitle}</p>
    </div>
  </div>
);

// ─── Tab Switcher ─────────────────────────────────────────────────────────────
const TabSwitcher = ({ active, onChange }) => (
  <div className="flex bg-gray-800/80 p-1 rounded-2xl border border-gray-700/50">
    {[
      { id: 'supplements', label: 'Supplements', icon: FlaskConical },
      { id: 'hormones',    label: 'Hormones',    icon: Zap },
    ].map(({ id, label, icon: Icon }) => (
      <button
        key={id}
        onClick={() => onChange(id)}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
          active === id
            ? 'bg-gray-700 text-gray-100 shadow-sm'
            : 'text-gray-500 hover:text-gray-300'
        }`}
      >
        <Icon size={15} />
        {label}
      </button>
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Learn = () => {
  const [activeTab, setActiveTab] = useState('supplements');

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-[0.04] p-4">
          <BookOpen size={64} />
        </div>
        <div className="flex items-start gap-3">
          <BookOpen size={22} className="text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h2 className="font-bold text-gray-100 mb-1">GetShredded Knowledge Base</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Science-backed guides on supplements and hormones — directly from JC's <span className="text-emerald-400">GetShredded V4</span> guide.
            </p>
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <TabSwitcher active={activeTab} onChange={setActiveTab} />

      {/* Supplements */}
      {activeTab === 'supplements' && (
        <div className="space-y-4">
          <SectionHeader
            icon={FlaskConical}
            title="Supplementation Guide"
            subtitle="JC's take: supplements are the last 5% of your effort. Nail diet and training first. These are the only ones worth considering."
            color="bg-emerald-900/15 border-emerald-500/25 text-emerald-300"
          />
          {supplementsData.map(supp => (
            <SupplementCard key={supp.id} supp={supp} />
          ))}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 text-center">
            <p className="text-xs text-gray-500 italic">
              "There are N numbers of supplements in the market. Give 100% to your diet and training first. Supplements are just 5% of the equation." — JC
            </p>
          </div>
        </div>
      )}

      {/* Hormones */}
      {activeTab === 'hormones' && (
        <div className="space-y-4">
          <SectionHeader
            icon={Zap}
            title="Hormone Guide"
            subtitle="Understanding how your hormones work makes your diet and training decisions much smarter. JC's introductory breakdown of the 7 hormones that matter most."
            color="bg-blue-900/15 border-blue-500/25 text-blue-300"
          />
          {hormonesData.map(hormone => (
            <HormoneCard key={hormone.id} hormone={hormone} />
          ))}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 text-center">
            <p className="text-xs text-gray-500 italic">
              "Minimize your stress, be on a proper diet and make sure you take your micronutrients. Health is not just in your body but also in your mind." — JC
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Learn;
