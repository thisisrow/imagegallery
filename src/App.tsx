
import { Welcome } from './components/WellCome';
import { Gallery } from './components/Gallery';

function App() {
  
  return (
    <div className="relative w-full h-screen overflow-hidden">

        <Welcome onComplete={handleWelcomeComplete} />

      

        <Gallery isVisible={currentView === 1} />
     
    </div>
  );
}

export default App;