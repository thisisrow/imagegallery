import React, { useState } from 'react';

interface ImageItemProps {
  src: string;
  alt: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  isAnimating: boolean;
}

export const ImageItem: React.FC<ImageItemProps> = ({ 
  src, 
  alt, 
  x, 
  y, 
  size, 
  delay,
  isAnimating 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        absolute transition-all duration-1000 ease-out transform
        ${isAnimating ? 'scale-0 opacity-0 ' : 'scale-100 opacity-100 '}
      `}
      style={{
        left: `calc(50% + ${isAnimating ? 0 : x}px)`,
        top: `calc(50% + ${isAnimating ? 0 : y}px)`,
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(-50%, -50%) ${isHovered ? 'scale(1.1)' : 'scale(1)'} ${isAnimating ? 'scale(0)' : 'scale(1) '}`,
        transitionDelay: isAnimating ? `${delay}ms` : '0ms',
        zIndex: isHovered ? 10 : 1,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        w-full h-full rounded-xl overflow-hidden shadow-2xl transition-all duration-300
        ${isHovered ? 'shadow-purple-500/30 shadow-3xl' : 'shadow-xl'}
        ${isLoaded ? 'opacity-100' : 'opacity-0'}
        ring-2 ring-white/10
      `}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300"
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
          absolute inset-0 bg-gradient-to-t from-black/20 to-transparent
          transition-opacity duration-300
          ${isHovered ? 'opacity-0' : 'opacity-100'}
        `} />
      </div>
    </div>
  );
};