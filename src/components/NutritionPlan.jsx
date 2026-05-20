import React, { useState } from 'react';
import { Target, ArrowRight, Calculator, ChevronDown, ChevronUp, Info, CheckCircle2 } from 'lucide-react';
import nutritionData from '../data/nutrition.json';
import dietsData from '../data/diets.json';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const calcBMR = ({ sex, weight, height, age }) => {
  // Harris-Benedict equation (as used in the PDF)
  if (sex === 'male') {
    return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  }
  return 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
};

const ACTIVITY_FACTORS = [
  { label: 'Sedentary (little/no exercise)', value: 1.2 },
  { label: 'Lightly Active (1–3 days/week)', value: 1.375 },
  { label: 'Moderately Active (3–5 days/week)', value: 1.55 },
  { label: 'Very Active (6–7 days/week)', value: 1.725 },
];

const macrosFromCalories = (calories, diet) => {
  const fatCals = calories * (diet.fat / 100);
  const carbCals = calories * (diet.carbs / 100);
  const proteinCals = calories * (diet.protein / 100);
  return {
    fat: Math.round(fatCals / 9),
    carbs: Math.round(carbCals / 4),
    protein: Math.round(proteinCals / 4),
  };
};

const DIET_COLORS = {
  emerald: { ring: 'ring-emerald-500/40', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', active: 'bg-emerald-900/30 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.15)]', bar: 'bg-emerald-500', dot: 'bg-emerald-400' },
  blue:    { ring: 'ring-blue-500/40',    badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',          active: 'bg-blue-900/30 border-blue-500/50 shadow-[0_0_12px_rgba(59,130,246,0.15)]',    bar: 'bg-blue-500',    dot: 'bg-blue-400'    },
  orange:  { ring: 'ring-orange-500/40',  badge: 'bg-orange-500/15 text-orange-400 border-orange-500/30',    active: 'bg-orange-900/30 border-orange-500/50 shadow-[0_0_12px_rgba(249,115,22,0.15)]', bar: 'bg-orange-500',  dot: 'bg-orange-400'  },
};

// ─── Macro Ring Chart ─────────────────────────────────────────────────────────
const MacroDonut = ({ diet, macros }) => {
  const c = DIET_COLORS[diet.color];
  const segments = [
    { label: 'Protein', pct: diet.protein, color: 'stroke-emerald-400' },
    { label: 'Carbs',   pct: diet.carbs,   color: 'stroke-blue-400' },
    { label: 'Fat',     pct: diet.fat,      color: 'stroke-orange-400' },
  ];

  const r = 36;
  const circ = 2 * Math.PI * r;
  let cumulative = 0;

  const arcs = segments.map((s) => {
    const len = (s.pct / 100) * circ;
    const offset = circ - cumulative * circ / 100;
    cumulative += s.pct;
    return { ...s, len, offset };
  });

  return (
    <div className="flex items-center gap-4">
      <svg width="88" height="88" viewBox="0 0 88 88" className="shrink-0 -rotate-90">
        <circle cx="44" cy="44" r={r} fill="none" strokeWidth="10" className="stroke-gray-800" />
        {arcs.map((arc) => (
          <circle
            key={arc.label}
            cx="44" cy="44" r={r}
            fill="none"
            strokeWidth="10"
            className={arc.color}
            strokeDasharray={`${arc.len} ${circ - arc.len}`}
            strokeDashoffset={arc.offset}
            strokeLinecap="butt"
          />
        ))}
      </svg>
      <div className="space-y-1.5 flex-1">
        {macros ? (
          <>
            <MacroRow label="Protein" grams={macros.protein} pct={diet.protein} color="text-emerald-400" bg="bg-emerald-400" />
            <MacroRow label="Carbs"   grams={macros.carbs}   pct={diet.carbs}   color="text-blue-400"    bg="bg-blue-400"    />
            <MacroRow label="Fat"     grams={macros.fat}      pct={diet.fat}     color="text-orange-400"  bg="bg-orange-400"  />
          </>
        ) : (
          <>
            <MacroRow label="Protein" pct={diet.protein} color="text-emerald-400" bg="bg-emerald-400" />
            <MacroRow label="Carbs"   pct={diet.carbs}   color="text-blue-400"    bg="bg-blue-400"    />
            <MacroRow label="Fat"     pct={diet.fat}      color="text-orange-400"  bg="bg-orange-400"  />
          </>
        )}
      </div>
    </div>
  );
};

const MacroRow = ({ label, pct, grams, color, bg }) => (
  <div className="flex items-center gap-2">
    <div className={`w-2 h-2 rounded-full shrink-0 ${bg}`} />
    <span className="text-xs text-gray-400 w-12">{label}</span>
    <div className="flex-1 bg-gray-800 rounded-full h-1.5">
      <div className={`${bg} h-1.5 rounded-full opacity-80`} style={{ width: `${pct}%` }} />
    </div>
    {grams !== undefined ? (
      <span className={`text-xs font-bold ${color} w-10 text-right`}>{grams}g</span>
    ) : (
      <span className={`text-xs font-bold ${color} w-8 text-right`}>{pct}%</span>
    )}
  </div>
);

// ─── BMR Calculator ───────────────────────────────────────────────────────────
const BMRCalculator = ({ onResults }) => {
  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem('bmr_form');
      return saved ? JSON.parse(saved) : { sex: 'male', age: '', weight: '', height: '', bf: '', activity: 1.55 };
    } catch { return { sex: 'male', age: '', weight: '', height: '', bf: '', activity: 1.55 }; }
  });
  const [results, setResults] = useState(null);
  const [showForm, setShowForm] = useState(!results);

  const update = (key, val) => {
    const next = { ...form, [key]: val };
    setForm(next);
    try { localStorage.setItem('bmr_form', JSON.stringify(next)); } catch {}
  };

  const calculate = () => {
    const age = parseFloat(form.age);
    const weight = parseFloat(form.weight);
    const height = parseFloat(form.height);
    const bf = parseFloat(form.bf);
    if (!age || !weight || !height) return;

    let calcWeight = weight;
    const bfThreshold = form.sex === 'male' ? 20 : 28;
    const useLeanMass = bf && bf > bfThreshold;
    if (useLeanMass) {
      calcWeight = weight - (bf / 100) * weight;
    }

    const bmr = calcBMR({ sex: form.sex, weight: calcWeight, height, age });
    const tdee = bmr * parseFloat(form.activity);
    const deficit = tdee - 400;

    const res = { bmr: Math.round(bmr), tdee: Math.round(tdee), goal: Math.round(deficit), useLeanMass, leanMass: useLeanMass ? Math.round(calcWeight) : null };
    setResults(res);
    onResults(res);
    setShowForm(false);
  };

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full flex items-center justify-between p-4 bg-gray-800/30 border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Calculator size={18} className="text-emerald-400" />
          <span className="font-bold text-gray-100">BMR & Calorie Calculator</span>
        </div>
        {showForm ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>

      {showForm && (
        <div className="p-4 space-y-4">
          <p className="text-xs text-gray-400 leading-relaxed">
            Uses the <span className="text-emerald-400 font-medium">Harris-Benedict equation</span> — the same formula from the PDF. If your body fat is above 20% (men) / 28% (women), lean mass is used automatically.
          </p>

          {/* Sex */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Biological Sex</label>
            <div className="grid grid-cols-2 gap-2">
              {['male','female'].map(s => (
                <button key={s} onClick={() => update('sex', s)}
                  className={`py-2 rounded-xl text-sm font-medium border transition-all capitalize ${form.sex === s ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400' : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Inputs grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'age', label: 'Age', unit: 'years', placeholder: 'e.g. 28' },
              { key: 'weight', label: 'Weight', unit: 'kg', placeholder: 'e.g. 80' },
              { key: 'height', label: 'Height', unit: 'cm', placeholder: 'e.g. 175' },
              { key: 'bf', label: 'Body Fat %', unit: '%', placeholder: 'Optional' },
            ].map(({ key, label, unit, placeholder }) => (
              <div key={key}>
                <label className="text-xs text-gray-400 mb-1 block">{label}</label>
                <div className="flex items-center bg-gray-800 rounded-xl border border-gray-700 focus-within:border-emerald-500/50 transition-colors overflow-hidden">
                  <input
                    type="number"
                    value={form[key]}
                    onChange={e => update(key, e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent px-3 py-2 text-sm text-gray-100 outline-none min-w-0"
                  />
                  <span className="text-xs text-gray-500 pr-3 shrink-0">{unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Activity */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Activity Level</label>
            <div className="space-y-1.5">
              {ACTIVITY_FACTORS.map(f => (
                <button key={f.value} onClick={() => update('activity', f.value)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs border transition-all ${parseFloat(form.activity) === f.value ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-300' : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={calculate}
            disabled={!form.age || !form.weight || !form.height}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold rounded-xl transition-all text-sm"
          >
            Calculate My Targets
          </button>
        </div>
      )}

      {results && !showForm && (
        <div className="p-4">
          {results.useLeanMass && (
            <div className="flex items-start gap-2 bg-blue-900/20 border border-blue-500/30 rounded-xl p-3 mb-4 text-xs text-blue-200/80">
              <Info size={14} className="text-blue-400 mt-0.5 shrink-0" />
              Using lean mass ({results.leanMass}kg) for BMR since your BF% is above the threshold.
            </div>
          )}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <ResultCard label="BMR" value={results.bmr} sub="at rest" color="text-gray-300" />
            <ResultCard label="TDEE" value={results.tdee} sub="maintenance" color="text-blue-400" />
            <ResultCard label="Fat Loss" value={results.goal} sub="~400 deficit" color="text-emerald-400" />
          </div>
          <button onClick={() => setShowForm(true)} className="w-full text-xs text-gray-500 hover:text-gray-300 transition-colors py-1">
            Edit inputs
          </button>
        </div>
      )}
    </div>
  );
};

const ResultCard = ({ label, value, sub, color }) => (
  <div className="bg-gray-800/50 rounded-xl p-3 text-center border border-gray-700/50">
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className={`text-lg font-bold ${color}`}>{value}</p>
    <p className="text-[10px] text-gray-600">{sub}</p>
  </div>
);

// ─── Diet Selector Card ───────────────────────────────────────────────────────
const DietCard = ({ diet, isActive, onClick }) => {
  const c = DIET_COLORS[diet.color];
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-xl border transition-all duration-300 ${isActive ? c.active : 'bg-gray-800/30 border-gray-700/50 hover:border-gray-600'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-gray-100 text-sm">{diet.name}</p>
          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{diet.tagline}</p>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-lg border shrink-0 ${c.badge}`}>{diet.ratio}</span>
      </div>
    </button>
  );
};

// ─── Diet Detail ──────────────────────────────────────────────────────────────
const DietDetail = ({ diet, targetCalories }) => {
  const [showMeals, setShowMeals] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const macros = targetCalories ? macrosFromCalories(targetCalories, diet) : null;
  const c = DIET_COLORS[diet.color];

  return (
    <div className="space-y-4">
      {/* Macro Chart */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-gray-200 text-sm">Macro Breakdown</h4>
          {macros && <span className="text-xs text-gray-500">Based on {targetCalories} kcal</span>}
        </div>
        <MacroDonut diet={diet} macros={macros} />
        {!macros && (
          <p className="text-xs text-gray-500 mt-3 italic">Calculate your BMR above to see exact gram targets.</p>
        )}
      </div>

      {/* Description */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4">
        <p className="text-sm text-gray-300 leading-relaxed">{diet.description}</p>
        <p className="text-xs text-gray-500 mt-2"><span className="text-gray-400 font-medium">Ideal for:</span> {diet.ideal}</p>
      </div>

      {/* Tips */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <button onClick={() => setShowTips(!showTips)} className="w-full flex items-center justify-between p-4 hover:bg-gray-800/30 transition-colors">
          <span className="font-semibold text-gray-200 text-sm">JC's Tips for This Diet</span>
          {showTips ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </button>
        {showTips && (
          <div className="px-4 pb-4 space-y-2">
            {diet.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Meals */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <button onClick={() => setShowMeals(!showMeals)} className="w-full flex items-center justify-between p-4 hover:bg-gray-800/30 transition-colors">
          <span className="font-semibold text-gray-200 text-sm">Sample Day Meals</span>
          {showMeals ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </button>
        {showMeals && (
          <div className="px-4 pb-4 space-y-3">
            {diet.meals.map((meal, idx) => (
              <div key={idx} className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/50">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="text-sm font-semibold text-gray-200">{meal.title}</h5>
                  <span className="text-xs text-emerald-400 font-medium">{meal.protein} protein</span>
                </div>
                <ul className="space-y-1">
                  {meal.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                      <ArrowRight size={12} className="text-emerald-500/50 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Food Staples */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="p-4 bg-gray-800/30 border-b border-gray-800">
          <h4 className="font-bold text-gray-200 text-sm">Best Food Staples for This Diet</h4>
        </div>
        <div className="p-4 grid grid-cols-3 gap-3">
          {['protein', 'carbs', 'fats'].map(macro => (
            <div key={macro}>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{macro}</p>
              <div className="space-y-1">
                {diet.staples[macro].slice(0,5).map((item, i) => (
                  <p key={i} className="text-xs text-gray-300">{item}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const NutritionPlan = () => {
  const [activeDiet, setActiveDiet] = useState(() => {
    try { return localStorage.getItem('selected_diet') || 'lowcarb'; } catch { return 'lowcarb'; }
  });
  const [calculatedGoal, setCalculatedGoal] = useState(() => {
    try {
      const saved = localStorage.getItem('bmr_results');
      return saved ? JSON.parse(saved).goal : null;
    } catch { return null; }
  });

  const selectedDiet = dietsData.find(d => d.id === activeDiet) || dietsData[0];

  const handleDietChange = (id) => {
    setActiveDiet(id);
    try { localStorage.setItem('selected_diet', id); } catch {}
  };

  const handleBMRResults = (results) => {
    setCalculatedGoal(results.goal);
    try { localStorage.setItem('bmr_results', JSON.stringify(results)); } catch {}
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* BMR Calculator */}
      <BMRCalculator onResults={handleBMRResults} />

      {/* Diet Selector */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="p-4 bg-gray-800/30 border-b border-gray-800">
          <h3 className="font-bold text-gray-100 text-sm mb-0.5">Choose Your Diet Protocol</h3>
          <p className="text-xs text-gray-400">From JC's GetShredded guide — all use calorie deficit for fat loss.</p>
        </div>
        <div className="p-3 space-y-2">
          {dietsData.map(diet => (
            <DietCard key={diet.id} diet={diet} isActive={activeDiet === diet.id} onClick={() => handleDietChange(diet.id)} />
          ))}
        </div>
      </div>

      {/* Diet Detail */}
      <DietDetail diet={selectedDiet} targetCalories={calculatedGoal} />

      {/* Reminder */}
      <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 text-sm text-gray-400 italic text-center mb-6">
        "Drink at least 3 litres of water daily. Fat loss happens in the kitchen, muscle happens on the pull-up bar." — JC
      </div>
    </div>
  );
};

export default NutritionPlan;
