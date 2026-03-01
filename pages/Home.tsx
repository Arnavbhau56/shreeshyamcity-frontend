import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, TrendingUp, Home as HomeIcon, Clock, Building2, ChevronRight, CheckCircle2 } from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { Property } from '../types';
import { propertyAPI } from '../api';
import HeroBg from "../src/assets/img/plot3.png"

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'buy' | 'rent' | 'commercial'>('buy');
  const [searchLocation, setSearchLocation] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [newProjects, setNewProjects] = useState<Property[]>([]);
  const [commercialProperties, setCommercialProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured, newLaunches, commercial] = await Promise.all([
          propertyAPI.getFeatured(),
          propertyAPI.getNewLaunches(),
          propertyAPI.getCommercial()
        ]);
        setFeaturedProperties(featured.data.slice(0, 3));
        setNewProjects(newLaunches.data.slice(0, 3));
        setCommercialProperties(commercial.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/properties');
  };

  return (
    <div className="min-h-screen">
      {/* Modern Hero Section */}
      <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-fixed bg-no-repeat"
            style={{ backgroundImage: `url(${HeroBg})` }}
          />
          {/* Lighter overlay for better visibility of background image */}
          <div className="absolute inset-0 bg-slate-900/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
             <div className="lg:w-1/2 text-center lg:text-left">
                {/* Improved Badge Contrast */}
                <div className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-sm mb-6 shadow-lg">
                    #1 Real Estate Platform in Jharkhand
                </div>
                <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white leading-tight mb-6 drop-shadow-xl">
                Find Your Dream<br/>
                    {/* Vibrant Title Gradient using new Brand Secondary and Accent */}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BBF9] to-[#0EAD69]">Plot or Villa</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-100 mb-8 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed drop-shadow-md">
                    Browse thousands of verified listings in Dhanbad. From luxury villas in Saraidhela to commercial hubs in Bank More.
                </p>
                
                {/* Stats */}
                <div className="flex justify-center lg:justify-start gap-8 text-white">
                    <div className="text-center lg:text-left">
                        <div className="text-3xl font-bold font-heading text-brand-secondary">500+</div>
                        <div className="text-sm text-slate-200 font-medium">Properties</div>
                    </div>
                    <div className="text-center lg:text-left">
                        <div className="text-3xl font-bold font-heading text-brand-secondary">2k+</div>
                        <div className="text-sm text-slate-200 font-medium">Happy Clients</div>
                    </div>
                    <div className="text-center lg:text-left">
                        <div className="text-3xl font-bold font-heading text-brand-secondary">10+</div>
                        <div className="text-sm text-slate-200 font-medium">Years Trust</div>
                    </div>
                </div>
             </div>

             <div className="lg:w-1/2 w-full">
                <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-secondary to-brand-primary"></div>
                    <div className="flex space-x-6 mb-8 border-b border-slate-200 pb-2">
                        <button 
                            onClick={() => setActiveTab('buy')}
                            className={`pb-2 text-lg font-bold transition-all ${activeTab === 'buy' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Buy
                        </button>
                        <button 
                            onClick={() => setActiveTab('rent')}
                            className={`pb-2 text-lg font-bold transition-all ${activeTab === 'rent' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Rent
                        </button>
                        <button 
                            onClick={() => setActiveTab('commercial')}
                            className={`pb-2 text-lg font-bold transition-all ${activeTab === 'commercial' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Commercial
                        </button>
                    </div>

                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-3.5 text-slate-400" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Where do you want to live?" 
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none text-slate-800 font-medium"
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/2 space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Type</label>
                                <select className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none text-slate-800 cursor-pointer appearance-none">
                                    <option>Apartment</option>
                                    <option>Villa</option>
                                    <option>Plot</option>
                                </select>
                            </div>
                            <div className="w-1/2 space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Budget</label>
                                <select className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none text-slate-800 cursor-pointer appearance-none">
                                    <option>Max Price</option>
                                    <option>20 Lakh</option>
                                    <option>50 Lakh</option>
                                    <option>1 Cr+</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-brand-primary text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-brand-primary/30 hover:bg-[#430a58] hover:shadow-brand-primary/50 transition-all transform hover:-translate-y-0.5 flex items-center justify-center">
                            Search Properties <Search size={20} className="ml-2" />
                        </button>
                    </form>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Features / Trust Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-brand-secondary font-bold tracking-wider uppercase text-sm">Our Promise</span>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mt-2">Redefining Real Estate in Dhanbad</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="p-8 rounded-3xl bg-slate-50 hover:bg-white border border-slate-100 hover:shadow-soft transition-all duration-300 group">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-brand-primary group-hover:scale-110 transition-transform">
                        <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-xl font-bold font-heading mb-3">Verified Listings</h3>
                    <p className="text-slate-600 leading-relaxed">Every property on our platform is physically verified by our team to ensure legal cleanliness and quality.</p>
                </div>
                <div className="p-8 rounded-3xl bg-slate-50 hover:bg-white border border-slate-100 hover:shadow-soft transition-all duration-300 group">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-brand-secondary group-hover:scale-110 transition-transform">
                        <TrendingUp size={32} />
                    </div>
                    <h3 className="text-xl font-bold font-heading mb-3">Market Analysis</h3>
                    <p className="text-slate-600 leading-relaxed">We provide data-driven insights to help you make smart investment decisions for maximum ROI.</p>
                </div>
                <div className="p-8 rounded-3xl bg-slate-50 hover:bg-white border border-slate-100 hover:shadow-soft transition-all duration-300 group">
                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 transition-transform">
                        <HomeIcon size={32} />
                    </div>
                    <h3 className="text-xl font-bold font-heading mb-3">End-to-End Support</h3>
                    <p className="text-slate-600 leading-relaxed">From site visits to registration, our legal and sales team assists you at every step of the journey.</p>
                </div>
            </div>
        </div>
      </div>

      {/* Featured Properties */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
                <span className="text-brand-primary font-bold tracking-wider uppercase text-sm">Exclusive</span>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mt-2">Featured Properties</h2>
            </div>
            <Link to="/properties" className="group flex items-center text-slate-700 font-semibold hover:text-brand-primary transition-colors mt-4 md:mt-0">
                View All Listings <ChevronRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-3 text-center py-10">Loading...</div>
            ) : (
              featuredProperties.map(prop => (
                <PropertyCard key={prop.id} property={prop} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* New Projects Section - Dark Theme Accent */}
      <section className="py-20 bg-brand-dark relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-brand-secondary/20 text-brand-secondary p-1 rounded">
                        <Clock size={20} />
                    </span>
                    <span className="text-brand-secondary font-bold tracking-wider uppercase text-sm">Pre-Launch & Ongoing</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mt-2">New & Upcoming Projects</h2>
            </div>
            <Link to="/properties" className="group flex items-center text-slate-300 font-semibold hover:text-white transition-colors mt-4 md:mt-0">
                View All Projects <ChevronRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-3 text-center py-10 text-white">Loading...</div>
            ) : (
              newProjects.map(prop => (
                <PropertyCard key={prop.id} property={prop} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Commercial Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Building2 className="text-brand-primary" size={24} />
                    <span className="text-brand-primary font-bold tracking-wider uppercase text-sm">For Business</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mt-2">Prime Commercial Spaces</h2>
            </div>
            <Link to="/properties" className="group flex items-center text-slate-700 font-semibold hover:text-brand-primary transition-colors mt-4 md:mt-0">
                View Commercial <ChevronRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-3 text-center py-10">Loading...</div>
            ) : (
              commercialProperties.map(prop => (
                <PropertyCard key={prop.id} property={prop} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section 
        className="py-24 relative bg-fixed bg-cover bg-center" 
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1920&q=80")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/90 to-[#430a58]/90"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold mb-6">Ready to find your dream space?</h2>
            <p className="text-blue-100 mb-10 max-w-2xl mx-auto text-lg">
                Connect with our expert consultants today. Whether you are buying, selling, or renting, we make it seamless.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/contact" className="bg-white text-brand-primary font-bold py-4 px-10 rounded-xl shadow-xl hover:bg-slate-50 transition transform hover:-translate-y-1">
                    Contact Our Team
                </Link>
                <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="bg-green-500 text-white font-bold py-4 px-10 rounded-xl shadow-xl hover:bg-green-600 transition transform hover:-translate-y-1 flex items-center justify-center">
                    WhatsApp Chat
                </a>
            </div>
        </div>
      </section>
    </div>
  );
};