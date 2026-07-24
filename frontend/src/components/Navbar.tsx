import React, { useState, useEffect, useRef } from 'react';
import { Hexagon, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface NavbarProps {
  onOpenAuth: () => void;
  onNavigateHome: () => void;
  onNavigateProjects: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onNavigateHome, onNavigateProjects }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-3' 
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Left Side: Logo & App Name */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigateHome} title="Go Home">
              <div className="w-8 h-8 rounded-lg bg-accent-start/20 flex items-center justify-center text-accent-start">
                <Hexagon className="w-5 h-5 fill-accent-start" />
              </div>
              <span className="font-bold text-xl tracking-tight text-text-primary">Atich</span>
            </div>
          </div>
          
          {/* Right Side: Links & Auth */}
          <div className="flex items-center gap-3 sm:gap-6">
            {user && (
              <button onClick={onNavigateProjects} className="hidden sm:block text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                My Blueprints
              </button>
            )}
            
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-9 h-9 rounded-full border border-border bg-surface flex items-center justify-center text-text-primary hover:border-accent-start hover:text-accent-start transition-colors"
                >
                  <User className="w-5 h-5" />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-surface/90 backdrop-blur-md shadow-lg overflow-hidden py-1">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-xs text-text-secondary truncate">{user.email}</p>
                    </div>
                    <button 
                      onClick={() => {
                        setIsDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-text-primary hover:bg-white/5 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={onOpenAuth}
                  className="px-5 py-2 bg-text-primary text-background hover:bg-white transition-colors rounded-full text-sm font-medium shadow-sm"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </header>
  );
};
