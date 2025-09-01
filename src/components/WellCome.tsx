import React, { useEffect, useState } from 'react';

interface WelcomeProps {
  onComplete: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start welcome animation
    const timer1 = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    // Start exit animation
    const timer2 = setTimeout(() => {
      setIsExiting(true);
    }, 2500);

    // Complete transition
    const timer3 = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className={`
      fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900
      flex items-center justify-center transition-all duration-1000 ease-out
      ${isExiting ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}
    `}>
      <div className={`
        text-center transition-all duration-1000 ease-out transform
        ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-8'}
      `}>
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-wider">
          <span className={`
            inline-block transition-all duration-700 ease-out transform
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `} style={{ transitionDelay: '200ms' }}>
            W
          </span>
          <span className={`
            inline-block transition-all duration-700 ease-out transform
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `} style={{ transitionDelay: '300ms' }}>
            e
          </span>
          <span className={`
            inline-block transition-all duration-700 ease-out transform
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `} style={{ transitionDelay: '400ms' }}>
            l
          </span>
          <span className={`
            inline-block transition-all duration-700 ease-out transform
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `} style={{ transitionDelay: '500ms' }}>
            c
          </span>
          <span className={`
            inline-block transition-all duration-700 ease-out transform
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `} style={{ transitionDelay: '600ms' }}>
            o
          </span>
          <span className={`
            inline-block transition-all duration-700 ease-out transform
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `} style={{ transitionDelay: '700ms' }}>
            m
          </span>
          <span className={`
            inline-block transition-all duration-700 ease-out transform
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `} style={{ transitionDelay: '800ms' }}>
            e
          </span>
        </h1>
        
        <div className={`
          w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full
          transition-all duration-1000 ease-out transform
          ${isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}
        `} style={{ transitionDelay: '1000ms' }} />
      </div>
    </div>
  );
};