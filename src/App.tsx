// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Gallery } from './components/Gallery';
import { Navbar } from './components/Navbar';
import { Info } from './components/Info';
import { Contact } from './components/Contact';

function GalleryWithNav() {
  return (
    <div className="relative h-screen overflow-hidden">
      {/* Navbar sits on top of the gallery */}
      <div className="absolute inset-x-0 top-0 z-50">
        <Navbar />
      </div>

      {/* Your gallery below it */}
      <Gallery isVisible={true} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="relative w-full min-h-screen">
        <Routes>
          <Route path="/" element={<GalleryWithNav />} />
          <Route path="/about" element={<Info />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}
