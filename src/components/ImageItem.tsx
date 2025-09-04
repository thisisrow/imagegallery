import React, { useState } from 'react';

interface ImageItemProps {
  src: string;
  alt: string;
  x: number;
  y: number;
  width: number;
  height: number;
  delay: number;
  isAnimating: boolean;
}

export const ImageItem: React.FC<ImageItemProps> = ({ 
  src, 
  alt, 
  x, 
  y, 
  width,
  height,
  delay,
  isAnimating 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={`
        absolute transition-all duration-1000 ease-out transform
      `}
      style={{
        left: `calc(50% + ${isAnimating ? 0 : x}px)`,
        top: `calc(50% + ${isAnimating ? 0 : y}px)`,
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate(-50%, -50%) ${isHovered ? 'scale(1.05)' : 'scale(1)'} ${isAnimating ? 'scale(0) ' : 'scale(1) rotate(0deg)'}`,
        transitionDelay: isAnimating ? `${delay}ms` : '0ms',
        opacity: isLoaded ? 1 : 0,
        zIndex: isHovered ? 10 : 1,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        w-full h-full  overflow-hidden shadow-2xl transition-all duration-300 backdrop-blur-sm
        ${isHovered ? 'shadow-purple-500/30 shadow-3xl' : 'shadow-xl'}
        ring-1 ring-white/20 bg-white/5
      `}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain transition-transform duration-300"
          style={{ 
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            pointerEvents: 'none'
          }}
          onLoad={() => setIsLoaded(true)}
          draggable={false}
        />
        
        {/* Subtle overlay for depth */}
        <div className={`
          absolute inset-0 bg-gradient-to-t from-black/10 to-transparent
        `} />
      </div>
    </div>
  );
};
