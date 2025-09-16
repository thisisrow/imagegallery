import React from "react"; 
import { motion } from "framer-motion";

export const Contact: React.FC = () => {
  return (
    <motion.section
      className="relative h-dvh bg-gray-50 text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      {/* Top bar: logo (left) + Home (right) */}
      <header className="absolute inset-x-0 top-0 mt-4">
        <div className="mx-auto flex h-30 max-w-6xl items-baseline justify-between px-6">
          <a href="/" aria-label="Home" className="flex items-center">
          <img
            src="/images/logo-t.png"
            alt="STUDIO HOLMBERG ARKITEKTUR"
            className="h-15 w-auto object-contain"   // example: 60px height
            loading="eager"
            style={{ filter: "drop-shadow(2px 4px 6px gold)" }}
          />
          </a>

          <a
            href="/"
            className="text-xl  underline-offset-4 hover:underline"
            style={{ fontWeight: 600 }}
          >
            Home
          </a>
        </div>
      </header>

      {/* Centered contact info */}
      <div className="flex h-full items-center justify-center px-6">
        <motion.div
          className="max-w-lg text-center space-y-10 leading-relaxed"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="space-y-2">
            <p className="text-2xl">Ar. Dhanvay Mhatre</p>

            <a
              href="mailto: hello@dhanvayymhatre.com"
              className="underline underline-offset-4 hover:text-black "
            >
              hello@dhanvayymhatre.com
            </a>

            <div className="mt-2">
              <a
                href="tel:+919765944222"
                className="underline underline-offset-4 hover:text-black"
              >
                +91 97659 44222
              </a>
            </div>
          </div>

          <div className="space-y-1 text-gray-700">
            <p>Shop no. 4, Ground Floor, Building No.5 Behind Philia Hospital,</p>
            <p>Ramkrushna Garden, Tembhode Rd,</p>
            <p>Palghar, Maharashtra 401404</p>
          </div>

          <p className="text-gray-700">Ar. Dhanvay Mhatre : Architect | CG Artist | Entrepreneur | Building DMS</p>
        </motion.div>
      </div>

      {/* Social icons bottom-right */}
      <div className="absolute bottom-6 right-6 flex space-x-4 text-gray-800">
        {/* Instagram */}
        <a
          href="https://www.instagram.com/dhanvaymhatre/"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          className="hover:opacity-80"
        >
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="h-7 w-7" viewBox="0 0 50 50">
    <path d="M 16 3 C 8.83 3 3 8.83 3 16 L 3 34 C 3 41.17 8.83 47 16 47 L 34 47 C 41.17 47 47 41.17 47 34 L 47 16 C 47 8.83 41.17 3 34 3 L 16 3 z M 37 11 C 38.1 11 39 11.9 39 13 C 39 14.1 38.1 15 37 15 C 35.9 15 35 14.1 35 13 C 35 11.9 35.9 11 37 11 z M 25 14 C 31.07 14 36 18.93 36 25 C 36 31.07 31.07 36 25 36 C 18.93 36 14 31.07 14 25 C 14 18.93 18.93 14 25 14 z M 25 16 C 20.04 16 16 20.04 16 25 C 16 29.96 20.04 34 25 34 C 29.96 34 34 29.96 34 25 C 34 20.04 29.96 16 25 16 z"></path>
</svg>
        </a>

        {/* YouTube */}
        <a
          href="https://www.youtube.com/channel/UCWVivJcCzt7FNS3DXuoKaYA"
          target="_blank"
          rel="noreferrer"
          aria-label="YouTube"
          className="hover:opacity-80"
        >
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="h-7 w-7" viewBox="0 0 50 50">
<path d="M 44.898438 14.5 C 44.5 12.300781 42.601563 10.699219 40.398438 10.199219 C 37.101563 9.5 31 9 24.398438 9 C 17.800781 9 11.601563 9.5 8.300781 10.199219 C 6.101563 10.699219 4.199219 12.199219 3.800781 14.5 C 3.398438 17 3 20.5 3 25 C 3 29.5 3.398438 33 3.898438 35.5 C 4.300781 37.699219 6.199219 39.300781 8.398438 39.800781 C 11.898438 40.5 17.898438 41 24.5 41 C 31.101563 41 37.101563 40.5 40.601563 39.800781 C 42.800781 39.300781 44.699219 37.800781 45.101563 35.5 C 45.5 33 46 29.398438 46.101563 25 C 45.898438 20.5 45.398438 17 44.898438 14.5 Z M 19 32 L 19 18 L 31.199219 25 Z"></path>
</svg>
        </a>

        {/* Linkdin */}
        <a
          href="https://www.linkedin.com/in/dhanvayymhatre/"
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp"
          className="hover:opacity-80"
        >
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="h-7 w-7" viewBox="0 0 50 50">
    <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"></path>
</svg>
        </a>
      </div>
    </motion.section>
  )
};
