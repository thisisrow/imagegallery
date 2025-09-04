import React, { useState, useRef, useEffect } from 'react';
import { ImageItem } from './ImageItem';

const images = [
  '/src/assets/1-1.jpeg',
  '/src/assets/1-2.jpeg',
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

// Grid positions (unchanged)
const getGridPositions = (size: number) => {
  const positions = [];
  const cols = 5;
  const rows = Math.ceil(images.length / cols);
  const spacing = size + 20;

  for (let i = 0; i < images.length; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;

    const startX = -((cols - 1) * spacing) / 2;
    const startY = -((rows - 1) * spacing) / 2;

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
  const [zoom, setZoom] = useState(2);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [animatedImages, setAnimatedImages] = useState(0);
  const [welcomeVisible, setWelcomeVisible] = useState(false);

  const textPanX = panX * 0.5; // parallax
  const textPanY = panY * 0.5;

  const containerRef = useRef<HTMLDivElement>(null);

  // Bounds + transform constants
  const OVERSCROLL = 100;   // 100px beyond content edges
  const DRAG_MULT = 1.5;    // you use this in the translate

  // 🔸 Inertia tuning
  const FRICTION = 0.0025;  // velocity decay per ms (↑ = shorter glide)
  const BOUNCE = 0.25;      // bounce amount on hitting bounds [0..1]
  const MIN_SPEED = 0.01;   // px/ms; stop inertia under this speed
  const VEL_SMOOTH = 0.15;  // velocity smoothing [0..1]

  // Momentum refs
  const lastPointer = useRef({ x: 0, y: 0, t: 0 });
  const velocityRef = useRef({ x: 0, y: 0 }); // px/ms
  const inertiaRaf = useRef<number | null>(null);

  const imageSize = 200;
  const positions = getGridPositions(imageSize);

  // --- container size (used to compute dynamic bounds) ---
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

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
      window.addEventListener('resize', update);
    }
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  // --- helpers to compute grid size and bounds ---
  const getGridSize = () => {
    const cols = 5;
    const rows = Math.ceil(images.length / cols);
    const spacing = imageSize + 20;

    // total extents (centers + half tile each side)
    const width = (cols - 1) * spacing + imageSize;
    const height = (rows - 1) * spacing + imageSize;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, containerSize.width, containerSize.height]);

  // --- welcome + image cascade (unchanged) ---
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

  // ---- inertia helpers ----
  const cancelInertia = () => {
    if (inertiaRaf.current != null) {
      cancelAnimationFrame(inertiaRaf.current);
      inertiaRaf.current = null;
    }
  };

  const startInertia = () => {
    let prev = performance.now();

    const tick = (t: number) => {
      const dt = Math.min(50, Math.max(1, t - prev)); // cap dt and avoid 0
      prev = t;

      // current velocity (px/ms)
      let vx = velocityRef.current.x;
      let vy = velocityRef.current.y;

      // frictional decay
      const decay = Math.max(0, 1 - FRICTION * dt);
      vx *= decay;
      vy *= decay;

      const { minPanX, maxPanX, minPanY, maxPanY } = getPanBounds();

      // advance + soft bounce at edges
      setPanX((x) => {
        let nx = x + vx * dt;
        if (nx < minPanX && vx < 0) {
          nx = minPanX;
          vx = -vx * BOUNCE;
        } else if (nx > maxPanX && vx > 0) {
          nx = maxPanX;
          vx = -vx * BOUNCE;
        }
        return nx;
      });

      setPanY((y) => {
        let ny = y + vy * dt;
        if (ny < minPanY && vy < 0) {
          ny = minPanY;
          vy = -vy * BOUNCE;
        } else if (ny > maxPanY && vy > 0) {
          ny = maxPanY;
          vy = -vy * BOUNCE;
        }
        return ny;
      });

      // store updated velocity
      velocityRef.current.x = vx;
      velocityRef.current.y = vy;

      const speed = Math.hypot(vx, vy);
      if (speed < MIN_SPEED) {
        inertiaRaf.current = null;
        return;
      }

      inertiaRaf.current = requestAnimationFrame(tick);
    };

    inertiaRaf.current = requestAnimationFrame(tick);
  };

  // --- drag handling with dynamic bounds + velocity tracking ---
  const handleStart = (clientX: number, clientY: number) => {
    cancelInertia(); // stop any ongoing glide
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
    setPanStart({ x: panX, y: panY });
    lastPointer.current = { x: clientX, y: clientY, t: performance.now() };
    velocityRef.current = { x: 0, y: 0 };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;

    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;

    const { minPanX, maxPanX, minPanY, maxPanY } = getPanBounds();

    const newPanX = clamp(panStart.x + deltaX, minPanX, maxPanX);
    const newPanY = clamp(panStart.y + deltaY, minPanY, maxPanY);

    setPanX(newPanX);
    setPanY(newPanY);

    // velocity (px/ms), smoothed
    const now = performance.now();
    const dt = Math.max(1, now - lastPointer.current.t);
    const dx = clientX - lastPointer.current.x;
    const dy = clientY - lastPointer.current.y;
    lastPointer.current = { x: clientX, y: clientY, t: now };

    const vx = dx / dt;
    const vy = dy / dt;

    velocityRef.current.x =
      velocityRef.current.x * (1 - VEL_SMOOTH) + vx * VEL_SMOOTH;
    velocityRef.current.y =
      velocityRef.current.y * (1 - VEL_SMOOTH) + vy * VEL_SMOOTH;
  };

  const handleEnd = () => {
    setIsDragging(false);
    startInertia(); // kick off glide
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

  // mouse/touch handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handleStart(e.touches[0].clientX, e.touches[0].clientY);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };

  // global listeners for drag
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
  }, [isDragging, dragStart, panStart]);

  // cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (inertiaRaf.current != null) cancelAnimationFrame(inertiaRaf.current);
    };
  }, []);

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
      {/* Welcome text */}
      {welcomeVisible && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <h1
            className={`text-8xl md:text-9xl font-bold text-black tracking-wider select-none transition-all`}
            style={{ transform: `translate(${textPanX}px, ${textPanY}px)` }}
          >
            Welcome
          </h1>
        </div>
      )}

      {/* Image grid */}
      <div
        className="relative w-full h-full z-10"
        style={{
          transform: `translate(${panX * DRAG_MULT}px, ${panY * DRAG_MULT}px) scale(${zoom})`,
          transformOrigin: 'center center',
          willChange: 'transform',
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
