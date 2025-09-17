import { motion } from 'framer-motion';

export const Info = () => {
  return (
    <motion.div
      className="min-h-screen bg-gray-50 pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
            <header className="absolute inset-x-0 top-0 mt-4">
        <div className="mx-auto flex h-auto max-w-6xl items-baseline justify-end px-6">
          <a
            href="/"
            className="text-xl  underline-offset-4 hover:underline"
            style={{ fontWeight: 600 }}
          >
            Home
          </a>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl font-serif text-black mb-8">
            About Us
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              We are a creative studio dedicated to visual storytelling through photography and design. 
              Our team brings together years of experience in capturing moments that matter.
            </p>
            
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              From intimate portraits to grand landscapes, we believe every image has a story to tell. 
              Our approach combines technical excellence with artistic vision to create compelling visual narratives.
            </p>
            
            <h2 className="text-2xl font-serif text-black mt-12 mb-6">
              Our Mission
            </h2>
            
            <p className="text-gray-700 text-lg leading-relaxed">
              To capture the beauty of the world around us and share it through our lens, 
              creating lasting memories and inspiring others to see the extraordinary in the ordinary.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
