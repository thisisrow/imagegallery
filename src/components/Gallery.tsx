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

// Function to calculate positions for masonry layout with alternating offsets
const getColumnPositions = (baseSize: number, count: number, numCols: number = 4) => {
  const positions = [];
  const columnHeights = new Array(numCols).fill(0);
  const columnLastOffset = new Array(numCols).fill(0); // Track last offset for each column
  const horizontalSpacing = baseSize * 1.1;
  const offsetAmount = baseSize * 0.3; // Amount to offset odd/even images
  const verticalGap = baseSize * 0.3; // Minimum vertical gap between images
  
  for (let i = 0; i < count; i++) {
    // Generate a random height variation for each image
    const heightRatio = Math.random() * 0.5 + 0.75; // Random between 0.75 and 1.25
    const itemHeight = baseSize * heightRatio;
    
    // Find the shortest column to place the next image
    const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
    
    const x = (shortestColumnIndex - Math.floor(numCols / 2)) * horizontalSpacing;
    
    // Calculate offset based on column's last image
    const isEven = Math.floor(columnHeights[shortestColumnIndex] / (baseSize + verticalGap)) % 2 === 0;
    const offsetY = isEven ? offsetAmount : -offsetAmount;
    
    // Ensure minimum gap from previous image in the same column
    const minY = columnHeights[shortestColumnIndex] + verticalGap;
    const y = Math.max(minY, columnHeights[shortestColumnIndex] + offsetY);
    
    positions.push({ 
      x, 
      y,
      height: itemHeight,
      width: baseSize
    });
    
    // Update the column height considering the actual position and height
    columnHeights[shortestColumnIndex] = y + itemHeight;
    columnLastOffset[shortestColumnIndex] = offsetY;
  }
  return positions;
};

interface GalleryProps {
  isVisible: boolean;
}

export const Gallery: React.FC<GalleryProps> = ({ isVisible }) => {
  // Store the positions using useState to ensure they are fixed
  const [positions] = useState(() => {
    const imageSize = 200;
    const numColumns = 5; // You can adjust the number of columns here
    return getColumnPositions(imageSize, images.length, numColumns);
  });
  
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [zoom, setZoom] = useState(2);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);

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
      className="w-full h-screen overflow-hidden from-slate-900 to-slate-900 cursor-grab active:cursor-grabbing"
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
                width={position.width}
                height={position.height}
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