import React, { useState, useRef, useEffect } from 'react';
import { ImageItem } from './ImageItem';

const images = [
  'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  'https://images.pexels.com/photos/2102589/pexels-photo-2102589.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  'https://images.pexels.com/photos/2102588/pexels-photo-2102588.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  'https://images.pexels.com/photos/1109543/pexels-photo-1109543.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  'https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  'https://images.pexels.com/photos/323772/pexels-photo-323772.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  'https://images.pexels.com/photos/2102590/pexels-photo-2102590.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  'https://images.pexels.com/photos/1643385/pexels-photo-1643385.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  'https://images.pexels.com/photos/1571464/pexels-photo-1571464.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  'https://images.pexels.com/photos/2102591/pexels-photo-2102591.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
];

// Grid positions
const getGridPositions = (size: number) => {
  const positions = [];
  const cols = 5;
  const rows = Math.ceil(images.length / cols);
  const spacing = size + 20;
  
  for (let i = 0; i < images.length; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    
    // Center the grid
    const startX = -(cols - 1) * spacing / 2;
    const startY = -(rows - 1) * spacing / 2;
    
    positions.push({
      x: startX + col * spacing,
      y: startY + row * spacing,
    });
  }
  
  return positions;
};

interface GalleryProps {
  isVisible: boolean;
}

export const Gallery: React.FC<GalleryProps> = ({ isVisible }) => {
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [animatedImages, setAnimatedImages] = useState(0);
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [textScale, setTextScale] = useState(1);
  const textPanX = panX * 0.5; // Parallax effect
  const textPanY = panY * 0.5;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageSize = 200;
  const positions = getGridPositions(imageSize);

  // Start image animation when gallery becomes visible
  useEffect(() => {
    if (isVisible) {
      // Start welcome animation immediately
      setTimeout(() => setWelcomeVisible(true), 500);
      
      // Start image animations after welcome is partially complete
      const animationTimer = setTimeout(() => {
        const interval = setInterval(() => {
          setAnimatedImages(prev => {
            if (prev >= images.length) {
              clearInterval(interval);
              return prev;
            }
            return prev + 1;
          });
        }, 150);
        
        return () => clearInterval(interval);
      }, 2500); // Start after welcome animation
      
      return () => clearTimeout(animationTimer);
    }
  }, [isVisible]);

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
    setPanStart({ x: panX, y: panY });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    
    setPanX(panStart.x + deltaX);
    setPanY(panStart.y + deltaY);
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.3, Math.min(3, prev * delta)));
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handleStart(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };

  // Global mouse events
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        handleMove(e.clientX, e.clientY);
      };
      
      const handleGlobalMouseUp = () => {
        handleEnd();
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, dragStart, panStart]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-hidden cursor-grab active:cursor-grabbing relative"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleEnd}
      onWheel={handleWheel}
    >
      {/* Welcome text in background */}
      {welcomeVisible && (
        <h1 
          className={`text-8xl md:text-9xl font-bold text-black/30 tracking-wider select-none transition-all duration-2000 ease-out ${
            welcomeVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
          }`}
          style={{ 
            transform: `translate(${textPanX}px, ${textPanY}px) scale(${textScale})`
          }}
        >
          Welcome
        </h1>
      )}
      
      {/* Image grid */}
      <div className="relative w-full h-full"
        style={{
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`
        }}
      >
        {images.map((src, index) => {
          const position = positions[index] || { x: 0, y: 0 };
          const shouldAnimate = index < animatedImages;
          
          return (
            <ImageItem
              key={index}
              src={src}
              alt={`Image ${index + 1}`}
              x={position.x}
              y={position.y}
              size={imageSize}
              delay={index * 100}
              isAnimating={!shouldAnimate}
            />
          );
        })}
      </div>
    </div>
  );
};
