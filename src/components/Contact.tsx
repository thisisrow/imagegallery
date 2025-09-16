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
          className="max-w-md text-center space-y-10 leading-relaxed"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="space-y-2">
            <p className="text-2xl">Ar. Dhanvay Mhatre</p>

            <a
              href="mailto:mathias@studioholmberg.se"
              className="underline underline-offset-4 hover:text-black "
            >
              hello@dhanvayymhatre.com
            </a>

            <div className="mt-2">
              <a
                href="tel:+460702171701"
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
<path d="M 44.898438 14.5 C 44.5 12.300781 42.601563 10.699219 40.398438 10.199219 C 37.101563 9.5 31 9 24.398438 9 C 17.800781 9 11.601563 9.5 8.300781 10.199219 C 6.101563 10.699219 4.199219 12.199219 3.800781 14.5 C 3.398438 17 3 20.5 3 25 C 3 29.5 3.398438 33 3.898438 35.5 C 4.300781 37.699219 6.199219 39.300781 8.398438 39.800781 C 11.898438 40.5 17.898438 41 24.5 41 C 31.101563 41 37.101563 40.5 40.601563 39.800781 C 42.800781 39.300781 44.699219 37.800781 45.101563 35.5 C 45.5 33 46 29.398438 46.101563 25 C 45.898438 20.5 45.398438 17 44.898438 14.5 Z M 19 32 L 19 18 L 31.199219 25 Z"></path>
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
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="h-8 w-8" viewBox="0 0 50 50">
<path d="M 24.402344 9 C 17.800781 9 11.601563 9.5 8.300781 10.199219 C 6.101563 10.699219 4.199219 12.199219 3.800781 14.5 C 3.402344 16.898438 3 20.5 3 25 C 3 29.5 3.398438 33 3.898438 35.5 C 4.300781 37.699219 6.199219 39.300781 8.398438 39.800781 C 11.902344 40.5 17.898438 41 24.5 41 C 31.101563 41 37.097656 40.5 40.597656 39.800781 C 42.800781 39.300781 44.699219 37.800781 45.097656 35.5 C 45.5 33 46 29.402344 46.097656 24.902344 C 46.097656 20.402344 45.597656 16.800781 45.097656 14.300781 C 44.699219 12.101563 42.800781 10.5 40.597656 10 C 37.097656 9.5 31 9 24.402344 9 Z M 24.402344 11 C 31.601563 11 37.398438 11.597656 40.199219 12.097656 C 41.699219 12.5 42.898438 13.5 43.097656 14.800781 C 43.699219 18 44.097656 21.402344 44.097656 24.902344 C 44 29.199219 43.5 32.699219 43.097656 35.199219 C 42.800781 37.097656 40.800781 37.699219 40.199219 37.902344 C 36.597656 38.601563 30.597656 39.097656 24.597656 39.097656 C 18.597656 39.097656 12.5 38.699219 9 37.902344 C 7.5 37.5 6.300781 36.5 6.101563 35.199219 C 5.300781 32.398438 5 28.699219 5 25 C 5 20.398438 5.402344 17 5.800781 14.902344 C 6.101563 13 8.199219 12.398438 8.699219 12.199219 C 12 11.5 18.101563 11 24.402344 11 Z M 19 17 L 19 33 L 33 25 Z M 21 20.402344 L 29 25 L 21 29.597656 Z"></path>
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
