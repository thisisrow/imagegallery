import React, { useState, useRef, useEffect } from 'react';
import { ImageItem } from './ImageItem';

const images = [
  'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'https://images.pexels.com/photos/2102589/pexels-photo-2102589.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'https://images.pexels.com/photos/2102588/pexels-photo-2102588.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'https://images.pexels.com/photos/1109543/pexels-photo-1109543.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'https://images.pexels.com/photos/323772/pexels-photo-323772.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'https://images.pexels.com/photos/2102590/pexels-photo-2102590.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'https://images.pexels.com/photos/1643385/pexels-photo-1643385.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'https://images.pexels.com/photos/1571464/pexels-photo-1571464.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'https://images.pexels.com/photos/2102591/pexels-photo-2102591.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
];

// Diamond pattern positions
const getDiamondPositions = (size: number) => {
  const positions = [];
  const spacing = size * 1.3;
  const centerX = 0;
  const centerY = 0;

  // Center image
  positions.push({ x: centerX, y: centerY });

  // First ring (4 images)
  positions.push({ x: centerX, y: centerY - spacing });
  positions.push({ x: centerX + spacing, y: centerY });
  positions.push({ x: centerX, y: centerY + spacing });
  positions.push({ x: centerX - spacing, y: centerY });

  // Second ring (8 images)
  const ring2Distance = spacing * 2;
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    positions.push({
      x: centerX + Math.cos(angle) * ring2Distance,
      y: centerY + Math.sin(angle) * ring2Distance,
    });
  }

  // Third ring (remaining images)
  const ring3Distance = spacing * 3.2;
  const remainingImages = Math.max(0, images.length - 13);
  for (let i = 0; i < remainingImages; i++) {
    const angle = (i * Math.PI * 2) / Math.max(1, remainingImages);
    positions.push({
      x: centerX + Math.cos(angle) * ring3Distance,
      y: centerY + Math.sin(angle) * ring3Distance,
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
  const [zoom, setZoom] = useState(2);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageSize = 180;
  const positions = getDiamondPositions(imageSize);

  // Start animation when gallery becomes visible
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
      return () => clearTimeout(timer);
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
      className="w-full h-screen overflow-hidden  from-slate-900  to-slate-900 cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleEnd}
      onWheel={handleWheel}
    >
      <div 
        className="relative w-full h-full transition-transform duration-300 ease-out"
        style={{ 
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transitionDuration: isDragging ? '0ms' : '300ms'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {images.map((src, index) => {
            const position = positions[index] || { x: 0, y: 0 };
            return (
              <ImageItem
                key={index}
                src={src}
                alt={`Image ${index + 1}`}
                x={position.x}
                y={position.y}
                size={imageSize}
                delay={index * 80}
                isAnimating={isAnimating}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};