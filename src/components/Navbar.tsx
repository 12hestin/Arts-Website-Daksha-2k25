import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Trophy } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useStore();

  return (
    <nav className={cn(
      "sticky top-0 z-50 border-b",
      darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Trophy className="h-6 w-6" />
            <span className="font-bold text-xl">DAKSHA</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/events" className="hover:text-primary">Events</Link>
            <Link to="/results" className="hover:text-primary">Results</Link>
            <Link to="/criteria" className="hover:text-primary">Criteria</Link>
            <button
              onClick={toggleDarkMode}
              className={cn(
                "p-2 rounded-lg",
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              )}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;