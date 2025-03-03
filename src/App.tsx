import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useStore } from './store/useStore';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import Results from './pages/Results';
import Criteria from './pages/Criteria';
import { cn } from './lib/utils';

function App() {
  const darkMode = useStore((state) => state.darkMode);

  return (
    <Router>
      <div className={cn(
        "min-h-screen transition-colors duration-300",
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      )}>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/results" element={<Results />} />
            <Route path="/criteria" element={<Criteria />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;