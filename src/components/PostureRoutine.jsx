import React, { useState } from 'react';
import { Activity, ChevronUp, ChevronDown, PlayCircle, ExternalLink } from 'lucide-react';
import ExerciseImage from './ExerciseImage';
import postureData from '../data/posture.json';

const PostureRoutine = () => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-blue-900/20 border border-blue-500/30 p-5 rounded-2xl flex items-start space-x-4">
        <Activity className="text-blue-400 shrink-0 mt-1" size={24} />
        <div>
          <h3 className="text-blue-400 font-bold mb-1">Fixing Forward Head & Shoulders</h3>
          <p className="text-sm text-blue-100/80 leading-relaxed">
            Do this 10-minute circuit before every strength workout to decompress your spine and strengthen your upper back.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {postureData.map((ex) => {
          const isExpanded = expandedId === ex.id;
          return (
            <div key={ex.id} className="bg-gray-900 p-5 rounded-2xl border border-gray-800 transition-colors hover:border-gray-700">
              <button 
                onClick={() => toggleExpand(ex.id)}
                className="w-full focus:outline-none text-left group"
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-lg text-gray-100 group-hover:text-blue-400 transition-colors flex items-center">
                    {ex.title}
                    {isExpanded ? <ChevronUp size={18} className="ml-2 text-gray-500" /> : <ChevronDown size={18} className="ml-2 text-gray-500" />}
                  </h4>
                  <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded whitespace-nowrap">{ex.sets}</span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  {ex.desc}
                </p>
              </button>
              
              {isExpanded && (
                <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                  <div 
                    className="relative aspect-video rounded-xl overflow-hidden bg-gray-950 mb-4 group/video cursor-pointer border border-gray-800"
                    onClick={() => window.open(ex.video, '_blank')}
                  >
                    <ExerciseImage src={ex.image} alt={ex.title} className="w-full h-full object-contain opacity-60 group-hover/video:opacity-40 transition-opacity" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 group-hover/video:bg-black/40 transition-colors">
                      <PlayCircle size={40} className="text-blue-400 mb-2 drop-shadow-lg group-hover/video:scale-110 transition-transform" />
                      <span className="text-xs font-semibold text-white drop-shadow-md flex items-center">
                        Watch Form Tutorial <ExternalLink size={12} className="ml-1" />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700/50">
                <p className="text-xs text-gray-300"><span className="text-blue-400 font-semibold">Why:</span> {ex.why}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostureRoutine;
