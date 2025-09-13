import React, { useState, useRef, useEffect } from 'react';
import { ImageItem } from './ImageItem';
import { motion } from "framer-motion";

const images = [
  '/images/1.jpg',
  '/images/2.jpg',
  '/images/3.jpg',
  '/images/4.jpg',
  '/images/5.jpg',
  '/images/6.jpg',
  '/images/7.jpg',
  '/images/8.jpg',
  '/images/9.jpg',
  '/images/10.jpg',
  '/images/11.jpg',
  '/images/12.jpg',
  '/images/13.jpg',
  '/images/14.jpg',
  '/images/15.jpg',
  '/images/16.jpg',
  '/images/17.jpg',
  '/images/18.jpg',
  '/images/19.jpg',
  '/images/20.jpg',
  '/images/21.jpg',
  '/images/22.jpg',
  '/images/23.jpg',
  '/images/24.jpg',
  '/images/25.jpg',
  '/images/26.jpg'
]
;
// Calculate responsive columns based on container width
const getResponsiveColumns = (containerWidth: number): number => {
  if (containerWidth <= 768) return 3; // Mobile
  if (containerWidth <= 1024) return 3; // Tablet
  return 5; // Desktop
};

// Calculate responsive columns based on container width
const getResponsiveSpace = (containerWidth: number): number => {
  if (containerWidth <= 768) return 20; // Mobile
  if (containerWidth <= 1024) return 30; // Tablet
  return 30; // Desktop
};

const getZoomSize = (containerWidth: number): number => {
  if (containerWidth <= 768) return 2; // Mobile
  if (containerWidth <= 1024) return 2; // Tablet
  return 3; // Desktop
};

// Calculate responsive image width
const getResponsiveImageWidth = (containerWidth: number, cols: number): number => {
  const minWidth = 120;
  const maxWidth = 200;
  const calculatedWidth = (containerWidth - (cols + 1) * 20) / cols; // Account for gaps
  return Math.max(minWidth, Math.min(maxWidth, calculatedWidth));
};

// Grid positions with responsive layout
const getGridPositions = (containerWidth: number) => {
  const cols = getResponsiveColumns(containerWidth);
  const imageWidth = getResponsiveImageWidth(containerWidth, cols);
  const imageAspectRatio = 1060 / 1500;
  const imageHeight = imageWidth * imageAspectRatio;
  
  const positions = [];
  const rows = Math.ceil(images.length / cols);
  const spacingX = imageWidth + getResponsiveSpace(containerWidth);
  const spacingY = imageHeight + getResponsiveSpace(containerWidth);
  const staggerAmount = spacingX * 0.5; // Half spacing for brick pattern

  for (let i = 0; i < images.length; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;

    const startX = -((cols - 1) * spacingX) / 2;
    const startY = -((rows - 1) * spacingY) / 2;

    // Add stagger offset for odd rows (brick pattern)
    const staggerOffset = row % 2 === 1 ? staggerAmount : 0;

    positions.push({
      x: startX + col * spacingX + staggerOffset,
      y: startY + row * spacingY,
    });
  }

  return { positions, imageWidth, imageHeight, cols };
};

interface GalleryProps {
  isVisible: boolean;
}

export const Gallery: React.FC<GalleryProps> = ({ isVisible }) => {
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [zoom, setZoom] = useState(getZoomSize(window.innerWidth));
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [animatedImages, setAnimatedImages] = useState(0);
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  
  // Momentum and velocity tracking
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [lastMoveTime, setLastMoveTime] = useState(0);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const momentumRef = useRef<number | null>(null);
  
  // Touch handling for pinch-to-zoom
  const [initialTouchDistance, setInitialTouchDistance] = useState<number | null>(null);
  const [initialZoom, setInitialZoom] = useState(1);

  const textPanX = panX * 0.5; // parallax
  const textPanY = panY * 0.5;

  const containerRef = useRef<HTMLDivElement>(null);

  // 🔧 tweak here if you want a different overscroll
  const OVERSCROLL = 100;
  const DRAG_MULT = 1.5;
  const DRAG_AMPLIFICATION = 2.5; // Amplify user movement during dragging
  const FRICTION = 0.98; // Momentum decay factor
  const MIN_VELOCITY = 0.1; // Stop momentum when velocity is below this

  // Calculate responsive grid layout
  // --- container size (used to compute dynamic bounds) ---
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Calculate responsive grid layout based on container size
  const { positions, imageWidth, imageHeight, cols } = getGridPositions(containerSize.width || 1200);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () =>
      setContainerSize({ width: el.clientWidth, height: el.clientHeight });

    update();

    let ro: ResizeObserver | null = null;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(() => update());
      ro.observe(el);
    } else {
      (window as Window).addEventListener('resize', update);
    }
    return () => {
      ro?.disconnect();
      (window as Window).removeEventListener('resize', update);
    };
  }, []);

  // --- helpers to compute grid size and bounds ---
  const getGridSize = () => {
    const rows = Math.ceil(images.length / cols);
    const spacingX = imageWidth + 10;
    const spacingY = imageHeight + 10;
    const staggerAmount = spacingX * 0.5; // Same stagger amount as in getGridPositions

    // total extents (centers + half tile each side)
    const width = (cols - 1) * spacingX + imageWidth + (rows > 1 ? staggerAmount : 0);
    const height = (rows - 1) * spacingY + imageHeight;
    return { width, height };
  };

  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

  const getPanBounds = (z = zoom) => {
    const { width: cw, height: ch } = containerSize;
    if (!cw || !ch) {
      // before we know container size, allow small movement
      return {
        minPanX: -OVERSCROLL / DRAG_MULT,
        maxPanX: OVERSCROLL / DRAG_MULT,
        minPanY: -OVERSCROLL / DRAG_MULT,
        maxPanY: OVERSCROLL / DRAG_MULT,
      };
    }

    const { width: gridW, height: gridH } = getGridSize();
    const scaledW = gridW * z;
    const scaledH = gridH * z;

    // derive allowed TRANSLATE (not pan) ranges with overscroll
    const rangeFor = (content: number, container: number) => {
      if (content >= container) {
        const half = (content - container) / 2;
        return [-half - OVERSCROLL, half + OVERSCROLL];
      } else {
        const dead = (container - content) / 2;
        return [-(dead + OVERSCROLL), dead + OVERSCROLL];
      }
    };

    const [minTX, maxTX] = rangeFor(scaledW, cw);
    const [minTY, maxTY] = rangeFor(scaledH, ch);

    // you render translate = pan * DRAG_MULT, so convert back to pan ranges
    return {
      minPanX: minTX / DRAG_MULT,
      maxPanX: maxTX / DRAG_MULT,
      minPanY: minTY / DRAG_MULT,
      maxPanY: maxTY / DRAG_MULT,
    };
  };

  // keep pan inside bounds whenever zoom/container changes
  useEffect(() => {
    const { minPanX, maxPanX, minPanY, maxPanY } = getPanBounds();
    setPanX((x) => clamp(x, minPanX, maxPanX));
    setPanY((y) => clamp(y, minPanY, maxPanY));
  }, [zoom, containerSize.width, containerSize.height]);

  // Momentum animation loop
  useEffect(() => {
    if (isDragging || (Math.abs(velocity.x) < MIN_VELOCITY && Math.abs(velocity.y) < MIN_VELOCITY)) {
      if (momentumRef.current) {
        cancelAnimationFrame(momentumRef.current);
        momentumRef.current = null;
      }
      return;
    }

    const animate = () => {
      setVelocity(prev => ({
        x: prev.x * FRICTION,
        y: prev.y * FRICTION
      }));

      setPanX(prev => {
        const { minPanX, maxPanX } = getPanBounds();
        return clamp(prev + velocity.x, minPanX, maxPanX);
      });
      
      setPanY(prev => {
        const { minPanY, maxPanY } = getPanBounds();
        return clamp(prev + velocity.y, minPanY, maxPanY);
      });

      if (Math.abs(velocity.x) >= MIN_VELOCITY || Math.abs(velocity.y) >= MIN_VELOCITY) {
        momentumRef.current = requestAnimationFrame(animate);
      }
    };

    momentumRef.current = requestAnimationFrame(animate);

    return () => {
      if (momentumRef.current) {
        cancelAnimationFrame(momentumRef.current);
        momentumRef.current = null;
      }
    };
  }, [velocity, isDragging]);

  // Helper function to calculate distance between two touch points
  const getTouchDistance = (touches: React.TouchList): number => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
  };

  // --- your existing effects (welcome + image cascade) stay as-is ---
  useEffect(() => {
    if (isVisible) {
      setTimeout(() => setWelcomeVisible(true), 500);

      const animationTimer = setTimeout(() => {
        const interval = setInterval(() => {
          setAnimatedImages((prev) => {
            if (prev >= images.length) {
              clearInterval(interval);
              return prev;
            }
            return prev + 1;
          });
        }, 150);
        return () => clearInterval(interval);
      }, 2500);

      return () => clearTimeout(animationTimer);
    }
  }, [isVisible]);

  // --- drag handling with dynamic bounds ---
  const handleStart = (clientX: number, clientY: number) => {
    // Stop any ongoing momentum
    if (momentumRef.current) {
      cancelAnimationFrame(momentumRef.current);
      momentumRef.current = null;
    }
    setVelocity({ x: 0, y: 0 });
    
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
    setPanStart({ x: panX, y: panY });
    setLastMoveTime(Date.now());
    setLastPosition({ x: clientX, y: clientY });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;

    const now = Date.now();
    const timeDelta = now - lastMoveTime;
    
    // Calculate amplified movement
    const deltaX = (clientX - dragStart.x) * DRAG_AMPLIFICATION;
    const deltaY = (clientY - dragStart.y) * DRAG_AMPLIFICATION;

    const newPanX = panStart.x + deltaX;
    const newPanY = panStart.y + deltaY;

    const { minPanX, maxPanX, minPanY, maxPanY } = getPanBounds();

    setPanX(clamp(newPanX, minPanX, maxPanX));
    setPanY(clamp(newPanY, minPanY, maxPanY));
    
    // Track velocity for momentum (based on actual movement, not amplified)
    if (timeDelta > 0) {
      const actualDeltaX = clientX - lastPosition.x;
      const actualDeltaY = clientY - lastPosition.y;
      
      setVelocity({
        x: (actualDeltaX / timeDelta) * 16 * DRAG_AMPLIFICATION, // Convert to per-frame velocity
        y: (actualDeltaY / timeDelta) * 16 * DRAG_AMPLIFICATION
      });
    }
    
    setLastMoveTime(now);
    setLastPosition({ x: clientX, y: clientY });
  };

  const handleEnd = () => {
    setIsDragging(false);
    // Momentum will continue based on the last velocity
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => {
      const next = Math.max(1.3, Math.min(3, prev * delta));
      // after zoom changes, also clamp pan immediately to new bounds
      const { minPanX, maxPanX, minPanY, maxPanY } = getPanBounds(next);
      setPanX((x) => clamp(x, minPanX, maxPanX));
      setPanY((y) => clamp(y, minPanY, maxPanY));
      return next;
    });
  };

  // mouse/touch handlers (unchanged)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 1) {
      // Single touch - start dragging
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2) {
      // Two touches - start pinch-to-zoom
      setIsDragging(false); // Stop any dragging
      const distance = getTouchDistance(e.touches);
      setInitialTouchDistance(distance);
      setInitialZoom(zoom);
      
      // Stop momentum
      if (momentumRef.current) {
        cancelAnimationFrame(momentumRef.current);
        momentumRef.current = null;
      }
      setVelocity({ x: 0, y: 0 });
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 1 && isDragging) {
      // Single touch - continue dragging
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2 && initialTouchDistance !== null) {
      // Two touches - handle pinch-to-zoom
      const currentDistance = getTouchDistance(e.touches);
      const scale = currentDistance / initialTouchDistance;
      const newZoom = Math.max(1.3, Math.min(3, initialZoom * scale));
      
      setZoom(newZoom);
      
      // Clamp pan to new zoom bounds
      const { minPanX, maxPanX, minPanY, maxPanY } = getPanBounds(newZoom);
      setPanX((x) => clamp(x, minPanX, maxPanX));
      setPanY((y) => clamp(y, minPanY, maxPanY));
    }
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      // All touches ended
      handleEnd();
      setInitialTouchDistance(null);
    } else if (e.touches.length === 1 && initialTouchDistance !== null) {
      // Went from pinch to single touch
      setInitialTouchDistance(null);
      // Start dragging with remaining touch
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleGlobalMouseUp = () => handleEnd();

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart, panStart]); // deps OK

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-hidden cursor-grab active:cursor-grabbing relative"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Welcome text */}
      {welcomeVisible && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
 
           <motion.img
            src="/images/logo.webp"
            alt="logo"
            className="w-[300px] md:w-[700px]"
            style={{ transform: `translate(${textPanX}px, ${textPanY}px)` }}
            initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
            transition={{
              duration: 2, // slower = smoother reveal
              ease: "easeInOut"
            }}
          />
        </div>
      )}

      {/* Image grid */}
      <div
        className="relative w-full h-full z-10"
        style={{
          transform: `translate(${panX * DRAG_MULT}px, ${panY * DRAG_MULT}px) scale(${zoom})`,
          transformOrigin: 'center center',
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
              width={imageWidth}
              height={imageHeight}
              delay={index * 100}
              isAnimating={!shouldAnimate}
            />
          );
        })}
      </div>
    </div>
  );
};
