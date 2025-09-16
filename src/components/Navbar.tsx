import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    // { name: 'Team', path: '/team' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-20 px-6 py-4">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0  ">
            <img 
              src="/images/logo-t.png" 
              alt="Company Logo" 
              className="h-12 w-auto "
              style={{ filter: "drop-shadow(2px 4px 6px gold)" }}
            />
          </Link>

          {/* Center Navigation */}
          <div className="flex items-center bg-white rounded-full px-8 py-3 shadow-lg">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 text-black font-serif text-sm transition-all duration-300`}
              >
                {item.name}
                {isActive(item.path) && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                    layoutId="activeIndicator"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right side - hidden on desktop */}
          <div className="w-8"></div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-20 px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src="/images/logo.webp" 
              alt="Company Logo" 
              className="h-8 w-auto"
            />
          </Link>

          {/* Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center ${
              isMobileMenuOpen ? 'hidden' : 'block'
            }`}
          >
            <div className="w-5 h-5 flex flex-col justify-center space-y-1">
              <span className={`block h-0.5 w-full bg-black transition-transform duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
              }`}></span>
              <span className={`block h-0.5 w-full bg-black transition-opacity duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`}></span>
              <span className={`block h-0.5 w-full bg-black transition-transform duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
              }`}></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.215, 0.61, 0.355, 1] }}
          >
            {/* Blue Background Overlay */}
            <div className="absolute inset-0 " style={{background: "#212d8e",opacity: "0.9"}}/>
            
            {/* White Menu Card */}
            <motion.div
              className="absolute top-15 left-4 right-4 bg-white rounded-lg shadow-xl p-8"
              style={{ height: '60vh' }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: [0.215, 0.61, 0.355, 1] }}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center text-2xl font-light text-gray-500 text-black transition-colors"
              >
                ×
              </button>

              {/* Navigation Links */}
              <div className="flex flex-col space-y-6 mt-8">
                {navItems.map((item) => (
                  <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`relative text-black font-serif text-lg transition-all duration-300 ${
                    isActive(item.path)
                      ? 'underline underline-offset-4 decoration-2' // active style
                      : 'hover:underline underline-offset-4 decoration-2' // inactive style with hover
                  }`}
                >
                  {item.name}
                </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
