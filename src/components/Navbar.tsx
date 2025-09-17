import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      {/* Desktop Navbar (unchanged) */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-20 px-6 py-4">
        <div className="flex items-center justify-center w-full">
          <div className="flex items-center bg-white rounded-full px-8 py-3 shadow-lg">
            {navItems.map((item) => {
  const active = isActive(item.path);

  return (
    <Link
      key={item.path}
      to={item.path}
      className="relative px-4 py-2 text-black font-serif text-sm transition-all duration-300 group"
    >
      {item.name}

      {/* Active underline (only show if active AND not hovering) */}
      {active && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 group-hover:opacity-0"
          style={{ background: "#b9a171" }}
          layoutId="activeIndicator"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}

      {/* Hover underline (shows on hover, even if active) */}
      <span
        className="absolute left-0 bottom-0 h-[3px] w-full scale-x-0 origin-right transition-transform duration-300 group-hover:scale-x-100 group-hover:origin-left"
        style={{ background: "#b9a171" }}
      />
    </Link>
  );
})}


          </div>
          <div className="w-8"></div>
        </div>
      </nav>

      {/* Mobile Navbar (hamburger) */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-10 h-10 p-2 flex flex-col justify-between items-center bg-white rounded-md shadow"
        >
          <motion.span
            className={"w-8 h-1 rounded "}
            style={{background:"#b9a171"}}
            animate={isMobileMenuOpen ? { rotate: 45, y: 10 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className={"w-8 h-1 rounded "}
            style={{background:"#b9a171"}}
            animate={isMobileMenuOpen ? { scaleX: 0 } : { scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className={"w-8 h-1 rounded "}
            style={{background:"#b9a171"}}
            animate={isMobileMenuOpen ? { rotate: -45, y: -10 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 flex items-center justify-center backdrop-blur-lg bg-white/9"
          >
            <motion.ul
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.15 } },
                exit: { transition: { staggerChildren: 0.1, staggerDirection: -1 } },
              }}
              className="flex flex-col space-y-8 text-4xl font-bold text-gray-200"
            >
              {navItems.map((item) => (
                <motion.li
                  key={item.path}
                  variants={{
                    hidden: { opacity: 0, x: -50 },
                    visible: { opacity: 1, x: 0 },
                    exit: { opacity: 0, x: -50 },
                  }}
                  transition={{ type: "spring", stiffness: 120, damping: 15 }}
                  whileHover={{ scale: 1.1 }}
                  className="relative"
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`relative inline-block pb-1 transition-colors ${
                      isActive(item.path) ? "text-white" : "hover:text-white"
                    }`}
                  >
                    {item.name}
                    {/* underline */}
                    <span
                      className={`absolute left-0 bottom-0 h-[4px]  transition-transform duration-300 ${
                        isActive(item.path)
                          ? "w-full scale-x-120"
                          : "w-full scale-x-0 group-hover:scale-x-100"
                      }`}
                      style={{background:"#b9a171"}}
                    />
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
