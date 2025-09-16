import React, { useState, useEffect, useRef } from 'react';

interface ImageItemProps {
  src: string;
  alt: string;
  x: number;
  y: number;
  width: number;
  height: number;
  delay: number;
}

export const ImageItem: React.FC<ImageItemProps> = ({ 
  src, 
  alt, 
  x, 
  y, 
  width,
  height,
  delay
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  // Start image animation after 1 second (when logo is halfway through)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000 + delay); // 1 second base delay + individual image delay

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
  ref={itemRef}
  className={`
    absolute transform transition-all duration-3000 ease-fast-slow
    ${isLoaded && isVisible ? "opacity-100" : "opacity-0"}
  `}
  style={{
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    width: `${width}px`,
    height: `${height}px`,
    transform: `translate(-50%, -50%) 
                ${isHovered ? "scale(1.05)" : "scale(1)"}
                ${isVisible ? "translateY(0)" : "translateY(20px) scale(0)"}`,
    zIndex: isHovered ? 10 : (isVisible ? 3 : -1),
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
