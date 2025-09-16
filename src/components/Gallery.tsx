import { useState, useRef, useEffect } from 'react';
import { ImageItem } from './ImageItem';
import { motion } from 'framer-motion';

/** -------------------- DATA -------------------- **/
const images = [
  '/images/1.jpg','/images/2.jpg','/images/3.jpg','/images/4.jpg','/images/5.jpg','/images/6.jpg',
  '/images/7.jpg','/images/8.jpg','/images/9.jpg','/images/10.jpg','/images/11.jpg','/images/12.jpg',
  '/images/13.jpg','/images/14.jpg','/images/15.jpg','/images/16.jpg','/images/17.jpg','/images/18.jpg',
  '/images/19.jpg','/images/20.jpg','/images/21.jpg','/images/22.jpg','/images/23.jpg','/images/24.jpg',
  '/images/25.jpg','/images/26.jpg'
];

/** -------------------- LAYOUT HELPERS -------------------- **/
const getResponsiveColumns = (): number => {
  // if (containerWidth <= 768) return 4;
  // if (containerWidth <= 1024) return 4;
  return 4;
};

const getResponsiveSpace = (containerWidth: number): number => {
  if (containerWidth <= 768) return 20;
  if (containerWidth <= 1024) return 30;
  return 30;
};

const getZoomSize = (containerWidth: number): number => {
  if (containerWidth <= 768) return 2;
  if (containerWidth <= 1024) return 2;
  if (containerWidth <= 1280) return 2.5;
  return 3;
};

const getResponsiveImageWidth = (containerWidth: number, cols: number): number => {
  const minWidth = 120;
  const maxWidth = 200;
  const calculatedWidth = (containerWidth - (cols + 1) * 20) / cols;
  return Math.max(minWidth, Math.min(maxWidth, calculatedWidth));
};

const getGridPositions = (containerWidth: number) => {
  const cols = getResponsiveColumns();
  const imageWidth = getResponsiveImageWidth(containerWidth, cols);
  const imageAspectRatio = 1060 / 1500;
  const imageHeight = imageWidth * imageAspectRatio;

  const positions: { x: number; y: number }[] = [];
  const rows = Math.ceil(images.length / cols);
  const spacingX = imageWidth + getResponsiveSpace(containerWidth);
  const spacingY = imageHeight + getResponsiveSpace(containerWidth);
  const staggerAmount = spacingX * 0.5;

  for (let i = 0; i < images.length; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const startX = -((cols - 1) * spacingX) / 2;
    const startY = -((rows - 1) * spacingY) / 2;
    const staggerOffset = row % 2 === 1 ? staggerAmount : 0;
    positions.push({
      x: startX + col * spacingX + staggerOffset,
      y: startY + row * spacingY,
    });
  }

  return { positions, imageWidth, imageHeight, cols };
};

/** -------------------- TYPES -------------------- **/
interface GalleryProps {
  isVisible: boolean;
}

/** -------------------- COMPONENT -------------------- **/
export const Gallery: React.FC<GalleryProps> = ({ isVisible }) => {
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [zoom, setZoom] = useState(getZoomSize(typeof window !== 'undefined' ? window.innerWidth : 1200));

  const panRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(zoom);
  const velRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const lastFrameTimeRef = useRef<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const { positions, imageWidth, imageHeight, cols } = getGridPositions(containerSize.width || 1200);

  type PointerState = { id: number; x: number; y: number };
  const pointersRef = useRef<Map<number, PointerState>>(new Map());
  const gestureStartRef = useRef({
    pan: { x: 0, y: 0 },
    zoom: 1,
    center: { x: 0, y: 0 },
    dist: 0,
  });


  /** -------------------- TUNING -------------------- **/
  const DRAG_MULT = 1.2;
  const FRICTION = 0.95;
  const MIN_VEL = 0.5;
  const MAX_VEL = 30; // <<< --- NEW: Maximum velocity for flick inertia
  const STATE_EPS = 0.9; // do not re-render for < 0.5px

  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

  // Dynamic overscroll based on grid dimensions
  const getOverscroll = () => {
    const { width: gridW, height: gridH, staggerAmount } = getGridSize();
    // Use a percentage of the grid size plus some extra for stagger
    const horizontalOverscroll = Math.max(100, gridW * 0.1 + staggerAmount);
    const verticalOverscroll = Math.max(100, gridH * 0.1);
    return { horizontal: horizontalOverscroll, vertical: verticalOverscroll };
  };
  
  const getGridSize = () => {
    const rows = Math.ceil(images.length / cols);
    const spacingX = imageWidth + getResponsiveSpace(containerSize.width || 1200);
    const spacingY = imageHeight + getResponsiveSpace(containerSize.width || 1200);
    const staggerAmount = spacingX * 0.5;
   
    const baseWidth = (cols - 1) * spacingX + imageWidth;
    const maxStaggerOffset = rows > 1 ? staggerAmount : 0;
    const width = baseWidth + maxStaggerOffset;
   
    const height = (rows - 1) * spacingY + imageHeight;
   
    return { width, height, staggerAmount };
  };

  const getPanBounds = (z = zoomRef.current) => {
    const { width: cw, height: ch } = containerSize;
    const { horizontal: overscrollX, vertical: overscrollY } = getOverscroll();
   
    if (!cw || !ch) {
      return {
        minPanX: -overscrollX / DRAG_MULT,
        maxPanX: overscrollX / DRAG_MULT,
        minPanY: -overscrollY / DRAG_MULT,
        maxPanY: overscrollY / DRAG_MULT,
      };
    }

    const { width: gridW, height: gridH } = getGridSize();
    const scaledW = gridW * z;
    const scaledH = gridH * z;

    const rangeFor = (content: number, container: number, overscroll: number) => {
      if (content >= container) {
        const half = (content - container) / 2;
        return [-half - overscroll, half + overscroll];
      } else {
        const dead = (container - content) / 2;
        return [-(dead + overscroll), dead + overscroll];
      }
    };

    const [minTX, maxTX] = rangeFor(scaledW, cw, overscrollX);
    const [minTY, maxTY] = rangeFor(scaledH, ch, overscrollY);

    return {
      minPanX: minTX / DRAG_MULT,
      maxPanX: maxTX / DRAG_MULT,
      minPanY: minTY / DRAG_MULT,
      maxPanY: maxTY / DRAG_MULT,
    };
  };

  useEffect(() => { panRef.current = { x: panX, y: panY }; }, [panX, panY]);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setContainerSize({ width: el.clientWidth, height: el.clientHeight });
    update();

    let ro: ResizeObserver | null = null;
   if (typeof globalThis !== 'undefined' && 'ResizeObserver' in globalThis) {
      ro = new ResizeObserver(update);
      ro.observe(el);
    } else if (typeof globalThis !== 'undefined') {
      globalThis.addEventListener('resize', update, { passive: true });
    }

    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', update as any);
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      const t = setTimeout(() => setWelcomeVisible(true), 500);
      return () => clearTimeout(t);
    }
  }, [isVisible]);

  /** -------------------- INERTIA (with edge-aware damping) -------------------- **/
  useEffect(() => {
    let raf = 0;
    const tick = (t: number) => {
      const dt = lastFrameTimeRef.current ? (t - lastFrameTimeRef.current) / (1000 / 60) : 1;
      lastFrameTimeRef.current = t;

      if (!isDraggingRef.current) {
        let nextX = panRef.current.x + velRef.current.x * dt;
        let nextY = panRef.current.y + velRef.current.y * dt;

        const { minPanX, maxPanX, minPanY, maxPanY } = getPanBounds();

        if ((nextX <= minPanX && velRef.current.x < 0) || (nextX >= maxPanX && velRef.current.x > 0)) {
          nextX = clamp(nextX, minPanX, maxPanX);
          velRef.current.x = 0;
        }
        if ((nextY <= minPanY && velRef.current.y < 0) || (nextY >= maxPanY && velRef.current.y > 0)) {
          nextY = clamp(nextY, minPanY, maxPanY);
          velRef.current.y = 0;
        }

        velRef.current.x *= FRICTION;
        velRef.current.y *= FRICTION;

        if (Math.abs(velRef.current.x) < MIN_VEL) velRef.current.x = 0;
        if (Math.abs(velRef.current.y) < MIN_VEL) velRef.current.y = 0;

        const clampedX = clamp(nextX, minPanX, maxPanX);
        const clampedY = clamp(nextY, minPanY, maxPanY);

        if (Math.abs(clampedX - panRef.current.x) > 1e-3) panRef.current.x = clampedX;
        if (Math.abs(clampedY - panRef.current.y) > 1e-3) panRef.current.y = clampedY;

        if (Math.abs(clampedX - panX) > STATE_EPS) setPanX(clampedX);
        if (Math.abs(clampedY - panY) > STATE_EPS) setPanY(clampedY);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerSize.width, containerSize.height]);

  /** -------------------- POINTER EVENTS -------------------- **/
  const computeGesture = () => {
    const pts = Array.from(pointersRef.current.values());
    const count = pts.length;

    let center = { x: 0, y: 0 };
    for (const p of pts) { center.x += p.x; center.y += p.y; }
    if (count > 0) { center.x /= count; center.y /= count; }

    let distance = 0;
    if (count >= 2) {
      const p0 = pts[0], p1 = pts[1];
      distance = Math.hypot(p1.x - p0.x, p1.y - p0.y);
    }
    return { center, distance, count };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointersRef.current.set(e.pointerId, { id: e.pointerId, x: e.clientX, y: e.clientY });

    const { center, distance } = computeGesture();
    gestureStartRef.current.pan = { ...panRef.current };
    gestureStartRef.current.zoom = zoomRef.current;
    gestureStartRef.current.center = center;
    gestureStartRef.current.dist = distance;

    velRef.current = { x: 0, y: 0 };
    isDraggingRef.current = true;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { id: e.pointerId, x: e.clientX, y: e.clientY });

    const { center, distance, count } = computeGesture();

    if (count === 1) {
      const dx = center.x - gestureStartRef.current.center.x;
      const dy = center.y - gestureStartRef.current.center.y;

      const { minPanX, maxPanX, minPanY, maxPanY } = getPanBounds();
      let nextX = gestureStartRef.current.pan.x + dx;
      let nextY = gestureStartRef.current.pan.y + dy;
      nextX = clamp(nextX, minPanX, maxPanX);
      nextY = clamp(nextY, minPanY, maxPanY);

      panRef.current.x = nextX;
      panRef.current.y = nextY;
      if (Math.abs(nextX - panX) > STATE_EPS) setPanX(nextX);
      if (Math.abs(nextY - panY) > STATE_EPS) setPanY(nextY);

      // --- MODIFIED SECTION: Limit velocity ---
      // 1. Calculate the raw velocity from the drag distance
      const velX = dx * 0.25;
      const velY = dy * 0.25;

      // 2. Clamp each velocity component to the MAX_VEL limit
      velRef.current.x = clamp(velX, -MAX_VEL, MAX_VEL);
      velRef.current.y = clamp(velY, -MAX_VEL, MAX_VEL);
      // --- END MODIFIED SECTION ---

    } else if (count >= 2) {
      const startZoom = gestureStartRef.current.zoom;
      const startDist = gestureStartRef.current.dist || distance || 1;
      const scale = distance > 0 ? distance / startDist : 1;
      const newZoom = clamp(startZoom * scale, 1.3, 3);

      const zPrev = zoomRef.current;
      const zNext = newZoom;

      let baseX = gestureStartRef.current.pan.x + (center.x - gestureStartRef.current.center.x);
      let baseY = gestureStartRef.current.pan.y + (center.y - gestureStartRef.current.center.y);

      let nextX = baseX * (zPrev / zNext);
      let nextY = baseY * (zPrev / zNext);

      const { minPanX, maxPanX, minPanY, maxPanY } = getPanBounds(zNext);
      nextX = clamp(nextX, minPanX, maxPanX);
      nextY = clamp(nextY, minPanY, maxPanY);

      zoomRef.current = zNext;
      if (Math.abs(zNext - zoom) > 0.001) setZoom(zNext);

      panRef.current.x = nextX;
      panRef.current.y = nextY;
      if (Math.abs(nextX - panX) > STATE_EPS) setPanX(nextX);
      if (Math.abs(nextY - panY) > STATE_EPS) setPanY(nextY);

      velRef.current = { x: 0, y: 0 };
    }
  };

  const endPointer = (id: number) => {
    pointersRef.current.delete(id);
    if (pointersRef.current.size === 0) {
      isDraggingRef.current = false;
    } else {
      const { center, distance } = computeGesture();
      gestureStartRef.current.center = center;
      gestureStartRef.current.pan = { ...panRef.current };
      gestureStartRef.current.zoom = zoomRef.current;
      gestureStartRef.current.dist = distance;
    }
  };

  const onPointerUp = (e: React.PointerEvent) => endPointer(e.pointerId);
  const onPointerCancel = (e: React.PointerEvent) => endPointer(e.pointerId);

  /** wheel zoom (desktop) */
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const dir = e.deltaY > 0 ? 0.9 : 1.1;
    const next = clamp(zoomRef.current * dir, 1.3, 3);

    const zPrev = zoomRef.current;
    zoomRef.current = next;
    setZoom(next);

    let nextPanX = panRef.current.x * (zPrev / next);
    let nextPanY = panRef.current.y * (zPrev / next);

    const { minPanX, maxPanX, minPanY, maxPanY } = getPanBounds(next);
    nextPanX = clamp(nextPanX, minPanX, maxPanX);
    nextPanY = clamp(nextPanY, minPanY, maxPanY);

    panRef.current.x = nextPanX;
    panRef.current.y = nextPanY;
    setPanX(nextPanX);
    setPanY(nextPanY);

    velRef.current = { x: 0, y: 0 };
  };

  /** re-clamp when layout/zoom changes */
  useEffect(() => {
    const { minPanX, maxPanX, minPanY, maxPanY } = getPanBounds(zoomRef.current);
    const clampedX = clamp(panRef.current.x, minPanX, maxPanX);
    const clampedY = clamp(panRef.current.y, minPanY, maxPanY);
    panRef.current.x = clampedX;
    panRef.current.y = clampedY;
    setPanX(clampedX);
    setPanY(clampedY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerSize.width, containerSize.height, cols, imageWidth, imageHeight]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      style={{ touchAction: 'none' }}
      className="w-full h-dvh overflow-hidden cursor-grab active:cursor-grabbing relative"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onWheel={handleWheel}
    >
      {/* Welcome text */}
      {welcomeVisible && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.img
            src="/images/logo.webp"
            alt="logo"
            className="w-[300px] md:w-[800px] z-[1] m-2"
            style={{ transform: `translate(${panX * 0.5}px, ${panY * 0.5}px)` }}
            initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
            transition={{ duration: 3, ease: 'easeInOut' }}
          />
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
          return (
            <ImageItem
              key={index}
              src={src}
              alt={`Image ${index + 1}`}
              x={position.x}
              y={position.y}
              width={imageWidth}
              height={imageHeight}
              delay={index * 50}
            />
          );
        })}
      </div>
    </div>
  );
};