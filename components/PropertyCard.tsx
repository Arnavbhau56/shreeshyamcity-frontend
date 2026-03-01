import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Heart } from 'lucide-react';
import { Property, ListingType } from '../types';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const firstImage = property.images && property.images.length > 0 
    ? (typeof property.images[0] === 'string' ? property.images[0] : property.images[0].image_url)
    : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={firstImage} 
          alt={property.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
        
        <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-white/90 backdrop-blur-sm text-brand-dark text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                {property.type}
            </span>
            {property.featured && (
                <span className="bg-brand-secondary text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex items-center">
                    Featured
                </span>
            )}
        </div>

        <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-colors">
            <Heart size={18} />
        </button>
        
         <div className="absolute bottom-4 left-4 text-white">
             <div className="text-xl font-bold font-heading">₹{property.price} {property.listing_type === 'Rent' ? 'k/mo' : 'L'}</div>
        </div>
        <div className="absolute bottom-4 right-4">
             <span className={`px-3 py-1 rounded-full text-xs font-bold ${property.listing_type === 'Buy' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'}`}>
                {property.listing_type}
             </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold font-heading text-slate-800 mb-2 truncate group-hover:text-brand-primary transition-colors">
            <Link to={`/property/${property.id}`}>
                {property.title}
            </Link>
        </h3>
        
        <div className="flex items-center text-slate-500 text-sm mb-4">
          <MapPin size={16} className="mr-1 text-brand-secondary" />
          {property.location}, Dhanbad
        </div>
        
        <Link 
            to={`/property/${property.id}`} 
            className="mt-4 w-full flex items-center justify-center py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all group/btn"
          >
            View Details <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};