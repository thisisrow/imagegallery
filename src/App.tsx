import  { useState } from 'react';
import { Welcome } from './components/WellCome';
import { Gallery } from './components/Gallery';

function App() {
  const [currentView, setCurrentView] = useState(0); 

  const handleWelcomeComplete = () => {
    setCurrentView(1);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {currentView === 0 && (
        <Welcome onComplete={handleWelcomeComplete} />
      )}
      
      {currentView === 1 && (
        <Gallery isVisible={currentView === 1} />
      )}
    </div>
  );
}

export default App;