import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';

const ExerciseImage = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  const imagePath = `${import.meta.env.BASE_URL}images/exercises/${src}`;

  if (error || !src) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-800 ${className}`}>
        <ImageIcon className="text-gray-600 mb-2" size={24} />
        <span className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">
          {alt || 'Exercise Image'}
        </span>
      </div>
    );
  }

  return (
    <img 
      src={imagePath} 
      alt={alt} 
      className={className} 
      onError={() => setError(true)}
    />
  );
};

export default ExerciseImage;
