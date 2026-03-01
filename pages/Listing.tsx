import React, { useState, useEffect } from 'react';
import { PropertyCard } from '../components/PropertyCard';
import { Property, PropertyType, PropertyStatus } from '../types';
import { propertyAPI } from '../api';
import { Filter, Search, ArrowUpDown, X } from 'lucide-react';

const LOCATIONS = ['Hirapur', 'Saraidhela', 'Bank More', 'Govindpur', 'Kusum Vihar', 'Dhansar'];

export const Listing: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [listingType, setListingType] = useState<string>('');
  const [budgetMax, setBudgetMax] = useState<number>(200);
  const [sortOption, setSortOption] = useState<string>('default');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await propertyAPI.getAll();
      setProperties(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(prop => {
    const matchesSearch = prop.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          prop.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType ? prop.type === selectedType : true;
    const matchesLocation = selectedLocation ? prop.location === selectedLocation : true;
    const matchesStatus = selectedStatus ? prop.status === selectedStatus : true;
    const matchesListing = listingType ? prop.listing_type === listingType : true;
    const matchesBudget = prop.price <= budgetMax;

    return matchesSearch && matchesType && matchesLocation && matchesStatus && matchesListing && matchesBudget;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortOption) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'area-asc': return a.area - b.area;
      case 'area-desc': return b.area - a.area;
      default: return 0;
    }
  });

  const FilterSidebar = () => (
    <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center text-slate-800">
            <Filter size={20} className="mr-2 text-brand-primary" />
            <h2 className="text-xl font-heading font-bold">Filters</h2>
        </div>
        <button onClick={() => setMobileFiltersOpen(false)} className="lg:hidden text-slate-400">
            <X size={24} />
        </button>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
          <select 
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 border focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition text-slate-700"
          >
            <option value="">All Locations</option>
            {LOCATIONS.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Property Type</label>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setSelectedType('')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${selectedType === '' ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>All</button>
            {Object.values(PropertyType).map(type => (
                <button 
                    key={type} 
                    onClick={() => setSelectedType(type)} 
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${selectedType === type ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                    {type}
                </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
           <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 border focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition text-slate-700"
          >
            <option value="">All Statuses</option>
            {Object.values(PropertyStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Looking For</label>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
                onClick={() => setListingType('')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${listingType === '' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500'}`}
            >Any</button>
            <button 
                onClick={() => setListingType('Buy')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${listingType === 'Buy' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500'}`}
            >Buy</button>
            <button 
                onClick={() => setListingType('Rent')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${listingType === 'Rent' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500'}`}
            >Rent</button>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
             <label className="block text-sm font-bold text-slate-700">Max Price</label>
             <span className="text-sm font-bold text-brand-primary">{budgetMax} Lakhs</span>
          </div>
          <input 
            type="range" 
            min="10" 
            max="500" 
            step="5"
            value={budgetMax}
            onChange={(e) => setBudgetMax(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>10L</span>
            <span>5 Cr</span>
          </div>
        </div>
        
        <button onClick={() => {setSearchTerm(''); setSelectedLocation(''); setSelectedType(''); setSelectedStatus(''); setListingType(''); setBudgetMax(200);}} className="w-full py-2.5 text-slate-500 font-medium hover:text-brand-primary transition">
            Reset Filters
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8">
            <div>
                <h1 className="text-4xl font-heading font-bold text-slate-900">Properties in Dhanbad</h1>
                <p className="text-slate-500 mt-2">Find your perfect home from our verified listings.</p>
            </div>
            <button 
                className="lg:hidden flex items-center bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm font-medium text-slate-700 mt-4 md:mt-0"
                onClick={() => setMobileFiltersOpen(true)}
            >
                <Filter size={18} className="mr-2" /> Filters
            </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-1/4">
             <div className="sticky top-28">
                <FilterSidebar />
             </div>
          </div>

          {/* Mobile Filters Overlay */}
          {mobileFiltersOpen && (
              <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                  <div className="w-full max-w-md">
                      <FilterSidebar />
                  </div>
              </div>
          )}

          {/* Listings Grid */}
          <div className="w-full lg:w-3/4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
              <div className="relative flex-1 w-full">
                 <input 
                    type="text" 
                    placeholder="Search properties..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none bg-transparent text-slate-800 placeholder-slate-400"
                 />
                 <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
              </div>
              
              <div className="w-full sm:w-auto flex items-center border-l border-slate-100 pl-4">
                 <ArrowUpDown className="text-slate-400 mr-2" size={18} />
                 <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="py-3 pr-8 bg-transparent outline-none text-slate-700 font-medium cursor-pointer"
                 >
                    <option value="default">Sort: Relevant</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="area-asc">Area: Low to High</option>
                 </select>
              </div>
            </div>

            {loading ? (
                <div className="text-center py-20 bg-white rounded-3xl shadow-soft border border-slate-100">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Loading properties...</h3>
                </div>
            ) : sortedProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {sortedProperties.map(prop => (
                      <PropertyCard key={prop.id} property={prop} />
                  ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl shadow-soft border border-slate-100">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No properties found</h3>
                    <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
