import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, X, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import LogoTransparent from "../src/assets/img/logo-transparent.png";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
                {/* <span className="bg-brand-primary text-white p-1.5 rounded-lg font-bold font-heading">SSC</span>
                <span className="text-2xl font-heading font-bold">Shree Shyam<span className="text-brand-primary">City</span></span> */}
                <img src={LogoTransparent} className="logo-sscity-footer" />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Empowering Dhanbad with premium real estate solutions. We bridge the gap between dream homes and reality with trust and transparency.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-brand-primary hover:text-white transition-all"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-brand-secondary hover:text-white transition-all"><Instagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-black hover:text-white transition-all"><X size={18} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-heading font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/properties" className="hover:text-brand-secondary transition-colors flex items-center"><ArrowRight size={14} className="mr-2" /> Search Properties</Link></li>
              <li><Link to="/about" className="hover:text-brand-secondary transition-colors flex items-center"><ArrowRight size={14} className="mr-2" /> About Us</Link></li>
              <li><Link to="/blog" className="hover:text-brand-secondary transition-colors flex items-center"><ArrowRight size={14} className="mr-2" /> Market Insights</Link></li>
              <li><Link to="/contact" className="hover:text-brand-secondary transition-colors flex items-center"><ArrowRight size={14} className="mr-2" /> Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-heading font-bold mb-6">Get in Touch</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start">
                <MapPin size={20} className="mr-3 mt-0.5 flex-shrink-0 text-brand-secondary" />
                <span>2nd Floor, City Centre,<br />Bank More, Dhanbad, 826001</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-3 flex-shrink-0 text-brand-secondary" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-3 flex-shrink-0 text-brand-secondary" />
                <span>hello@shreeshyamcity.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-heading font-bold mb-6">Newsletter</h4>
            <p className="text-slate-400 text-sm mb-4">Subscribe for the latest property updates.</p>
            <form className="flex flex-col gap-2">
                <input type="email" placeholder="Your email" className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:border-brand-primary outline-none" />
                <button type="button" className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 transition">Subscribe</button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-16 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Shree Shyam City. Crafted with care in Dhanbad.</p>
        </div>
      </div>
    </footer>
  );
};