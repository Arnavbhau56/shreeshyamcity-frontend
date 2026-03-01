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
              {/* <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-brand-primary hover:text-white transition-all"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-brand-secondary hover:text-white transition-all"><Instagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-black hover:text-white transition-all"><X size={18} /></a> */}
              <a href="https://wa.me/919876543210" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-green-500 hover:text-white transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.386"/>
                </svg>
              </a>
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