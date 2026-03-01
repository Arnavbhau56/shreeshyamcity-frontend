import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import LogoImg from "../src/assets/img/logo-ss-city.png";

import LogoTransparent from "../src/assets/img/logo-transparent.png";
import LogoScrolled from "../src/assets/img/logo-ss-city.png";


export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine text color based on position and page
  // On Home top: White text. Scrolled or other pages: Dark text.
  const isTransparent = isHome && !scrolled;
  const textColorClass = isTransparent ? "text-white hover:text-brand-secondary" : "text-slate-700 hover:text-brand-primary";
  const logoTextClass = isTransparent ? "text-white" : "text-slate-800";
  const buttonClass = isTransparent 
    ? "bg-white text-brand-primary hover:bg-gray-100" 
    : "bg-brand-primary text-white hover:bg-[#430a58]"; // Darker shade of new purple



  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass shadow-soft py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src={isTransparent ? LogoTransparent : LogoScrolled}
              alt="Shree Shyam City"
              className="w-auto object-contain transition-all duration-300 logo-sscity"
            />
          </Link>


          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`${textColorClass} font-medium transition-colors`}>Home</Link>
            <Link to="/properties" className={`${textColorClass} font-medium transition-colors`}>Properties</Link>
            <Link to="/about" className={`${textColorClass} font-medium transition-colors`}>About</Link>
            <Link to="/blog" className={`${textColorClass} font-medium transition-colors`}>Insights</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
             <div className="flex flex-col items-end mr-2">
                <span className={`text-xs font-bold uppercase tracking-wider ${isTransparent ? 'text-gray-200' : 'text-slate-500'}`}>Need Help?</span>
                <span className={`text-sm font-bold ${isTransparent ? 'text-white' : 'text-slate-800'}`}>+91 98765 43210</span>
             </div>
             <Link to="/contact" className={`${buttonClass} px-6 py-2.5 rounded-full font-medium transition-all shadow-glow hover:shadow-lg transform hover:-translate-y-0.5 flex items-center`}>
               Contact Us <ArrowRight size={16} className="ml-2" />
             </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className={`${textColorClass} focus:outline-none`}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-slate-100 absolute w-full shadow-xl">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-brand-primary">Home</Link>
            <Link to="/properties" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-brand-primary">Properties</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-brand-primary">About Us</Link>
            <Link to="/blog" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-brand-primary">Blog</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="block mt-4 px-4 py-3 rounded-xl text-center bg-brand-primary text-white font-bold shadow-lg">Contact Us</Link>
          </div>
        </div>
      )}
    </nav>
  );
};