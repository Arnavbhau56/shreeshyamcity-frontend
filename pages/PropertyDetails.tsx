import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Property, PropertyType } from '../types';
import { propertyAPI, enquiryAPI } from '../api';
import { MapPin, Phone, CheckCircle2, Share2, X, ChevronLeft, ChevronRight, Facebook, Twitter, Copy, MessageCircle, School, Train, Stethoscope, ShoppingBag, Landmark as LandmarkIcon, Building, Maximize, Compass, Square } from 'lucide-react';
import Swal from 'sweetalert2';

export const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setIsShareMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') nextImage(e as any);
      if (e.key === 'ArrowLeft') prevImage(e as any);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isLightboxOpen]);

  const fetchProperty = async () => {
    try {
      const response = await propertyAPI.getById(id!);
      setProperty(response.data);
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-40 text-2xl text-slate-500 font-heading">Loading...</div>;
  }

  if (!property) {
    return <div className="text-center py-40 text-2xl text-slate-500 font-heading">Property not found.</div>;
  }

  const images = property.images?.map(img => typeof img === 'string' ? img : img.image_url) || [];

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this property: ${property.title} in ${property.location}`;
    
    let shareUrl = '';
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        Swal.fire({
          icon: 'success',
          title: 'Link Copied!',
          text: 'Property link copied to clipboard',
          timer: 2000,
          showConfirmButton: false
        });
        setIsShareMenuOpen(false);
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank');
      setIsShareMenuOpen(false);
    }
  };

  const getLandmarkIcon = (category: string) => {
      switch(category) {
          case 'Education': return <School className="w-5 h-5" />;
          case 'Healthcare': return <Stethoscope className="w-5 h-5" />;
          case 'Transport': return <Train className="w-5 h-5" />;
          case 'Lifestyle': return <ShoppingBag className="w-5 h-5" />;
          case 'Religious': return <LandmarkIcon className="w-5 h-5" />;
          case 'Business': return <Building className="w-5 h-5" />;
          default: return <MapPin className="w-5 h-5" />;
      }
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await enquiryAPI.create({ ...formData, property: property.id });
      Swal.fire({icon: 'success', title: 'Enquiry Sent!', text: 'We will contact you soon', timer: 2000, showConfirmButton: false}).then(() => window.location.reload());
    } catch (error) {
      Swal.fire({icon: 'error', title: 'Error', text: 'Failed to send enquiry. Please try again.'});
    }
  };


  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-12">
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 z-[70]"
          >
            <X size={32} />
          </button>

          {images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-4 md:left-8 text-white/70 hover:text-white transition-colors p-3 rounded-full hover:bg-white/10 z-[65]"
              >
                <ChevronLeft size={40} />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 md:right-8 text-white/70 hover:text-white transition-colors p-3 rounded-full hover:bg-white/10 z-[65]"
              >
                <ChevronRight size={40} />
              </button>
            </>
          )}

          <div className="relative max-w-7xl max-h-[90vh] w-full flex flex-col items-center">
            <img 
              src={images[currentImageIndex]} 
              alt={`Property View ${currentImageIndex + 1}`} 
              className="max-h-[75vh] md:max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl select-none"
            />
            <div className="mt-4 text-white/80 font-medium tracking-wider">
              {currentImageIndex + 1} / {images.length}
            </div>
            
            <div className="mt-6 flex gap-3 overflow-x-auto max-w-full pb-2 no-scrollbar px-4">
               {images.map((img, idx) => (
                 <button 
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 ${currentImageIndex === idx ? 'border-brand-primary scale-110 opacity-100 ring-2 ring-brand-primary/50' : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'}`}
                 >
                   <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
                 </button>
               ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-2">{property.title}</h1>
                <div className="flex items-center text-slate-500 font-medium">
                    <MapPin size={18} className="mr-1 text-brand-secondary" />
                    {property.location}, Dhanbad, Jharkhand
                </div>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0 items-center">
                
                <div className="relative" ref={shareMenuRef}>
                    <button 
                        onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                        className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-brand-primary hover:border-brand-primary transition shadow-sm flex items-center justify-center"
                        title="Share Property"
                    >
                        <Share2 size={20} />
                    </button>
                    
                    {isShareMenuOpen && (
                        <div className="absolute top-12 right-0 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <button onClick={() => handleShare('whatsapp')} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-medium text-slate-700 flex items-center transition-colors">
                                <span className="text-green-500 mr-3"><MessageCircle size={18} /></span> WhatsApp
                            </button>
                            <button onClick={() => handleShare('facebook')} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-medium text-slate-700 flex items-center transition-colors">
                                <span className="text-blue-600 mr-3"><Facebook size={18} /></span> Facebook
                            </button>
                            <button onClick={() => handleShare('twitter')} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-medium text-slate-700 flex items-center transition-colors">
                                <span className="text-sky-500 mr-3"><Twitter size={18} /></span> Twitter
                            </button>
                            <div className="h-px bg-slate-100 my-0"></div>
                            <button onClick={() => handleShare('copy')} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-medium text-slate-700 flex items-center transition-colors">
                                <span className="text-slate-400 mr-3"><Copy size={18} /></span> Copy Link
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm flex items-center">
                    <span className="text-slate-500 text-sm mr-2">{property.listing_type === 'Rent' ? 'Rent' : 'Price'}:</span>
                    <span className="text-2xl font-bold text-brand-primary">₹{property.price} {property.listing_type === 'Rent' ? 'k' : 'L'}</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 h-[400px] md:h-[550px]">
            {images.length === 1 && (
                <div 
                    onClick={() => openLightbox(0)}
                    className="md:col-span-4 h-full rounded-3xl overflow-hidden shadow-soft relative group cursor-pointer"
                >
                    <img src={images[0]} alt="Main" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                    <div className="absolute top-4 left-4">
                        <span className="bg-brand-primary text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
                            {property.status}
                        </span>
                    </div>
                </div>
            )}

            {images.length === 2 && (
                <>
                    <div onClick={() => openLightbox(0)} className="md:col-span-2 h-full rounded-3xl overflow-hidden shadow-soft relative group cursor-pointer">
                        <img src={images[0]} alt="View 1" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                        <div className="absolute top-4 left-4">
                            <span className="bg-brand-primary text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
                                {property.status}
                            </span>
                        </div>
                    </div>
                    <div onClick={() => openLightbox(1)} className="md:col-span-2 h-full rounded-3xl overflow-hidden shadow-soft relative group cursor-pointer">
                        <img src={images[1]} alt="View 2" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                    </div>
                </>
            )}

            {images.length >= 3 && (
                <>
                    <div onClick={() => openLightbox(0)} className="md:col-span-3 h-full rounded-3xl overflow-hidden shadow-soft relative group cursor-pointer">
                        <img src={images[0]} alt="Main" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                        <div className="absolute top-4 left-4">
                            <span className="bg-brand-primary text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
                                {property.status}
                            </span>
                        </div>
                    </div>
                    <div className="hidden md:flex flex-col gap-4 h-full">
                        <div onClick={() => openLightbox(1)} className="flex-1 rounded-3xl overflow-hidden shadow-sm relative cursor-pointer group">
                            <img src={images[1]} alt="Side 1" className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                        </div>
                        {images.length === 3 ? (
                            <div onClick={() => openLightbox(2)} className="flex-1 rounded-3xl overflow-hidden shadow-sm relative cursor-pointer group">
                                <img src={images[2]} alt="Side 2" className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                            </div>
                        ) : (
                            <div onClick={() => openLightbox(2)} className="flex-1 rounded-3xl overflow-hidden bg-slate-800 relative cursor-pointer group flex items-center justify-center text-white">
                                {images[2] && <img src={images[2]} alt="Side 2" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition duration-500" />}
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition"></div>
                                <span className="relative z-10 font-bold text-lg">+{images.length - 2} Photos</span>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center border-r border-slate-100">
                            <div className="text-slate-400 text-sm mb-1 font-medium uppercase tracking-wide">Plot Area</div>
                            <div className="text-2xl font-bold text-slate-800 flex justify-center items-center">
                                <Square className="mr-2 text-brand-primary" size={24} /> {property.area} <span className="text-base font-normal ml-1 text-slate-500">sqft</span>
                            </div>
                        </div>
                        <div className="text-center border-r border-slate-100">
                            <div className="text-slate-400 text-sm mb-1 font-medium uppercase tracking-wide">Dimensions</div>
                            <div className="text-2xl font-bold text-slate-800 flex justify-center items-center">
                                <Maximize className="mr-2 text-brand-primary" size={24} /> {property.dimensions || 'N/A'}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-slate-400 text-sm mb-1 font-medium uppercase tracking-wide">Facing</div>
                            <div className="text-2xl font-bold text-slate-800 flex justify-center items-center">
                                <Compass className="mr-2 text-brand-primary" size={24} /> {property.facing || 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-heading font-bold mb-4 text-slate-900">About this property</h3>
                    <p className="text-slate-600 leading-relaxed text-lg">{property.description}</p>
                </div>

                {property.amenities && property.amenities.length > 0 && (
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="text-xl font-heading font-bold mb-6 text-slate-900">Amenities</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {property.amenities.map(item => (
                                <div key={item} className="flex items-center text-slate-700 font-medium">
                                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                 {property.videos && property.videos.length > 0 && (
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-xl font-heading font-bold mb-6 text-slate-900">Video Tour</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {property.videos.map((video, idx) => (
                                <div key={idx} className="rounded-xl overflow-hidden shadow-sm border border-slate-100 bg-black aspect-video">
                                     <video controls className="w-full h-full">
                                        <source src={video} />
                                        Your browser does not support the video tag.
                                     </video>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {property.landmarks && property.landmarks.length > 0 && (
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center mb-6">
                            <MapPin className="text-brand-primary mr-3" size={24} />
                            <h3 className="text-xl font-heading font-bold text-slate-900">Location Highlights & Landmarks</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {property.landmarks.map((landmark, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-brand-primary/30 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white rounded-full text-brand-primary shadow-sm group-hover:scale-110 transition-transform duration-300">
                                            {getLandmarkIcon(landmark.category)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800">{landmark.name}</div>
                                            <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mt-0.5">{landmark.category}</div>
                                        </div>
                                    </div>
                                    <div className="bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-sm font-bold text-slate-700 text-sm">
                                        {landmark.distance}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                 <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-heading font-bold mb-6 text-slate-900">Location Map</h3>
                    <div className="w-full h-80 bg-slate-100 rounded-xl overflow-hidden relative">
                        <iframe 
                            width="100%" 
                            height="100%" 
                            frameBorder="0" 
                            scrolling="no" 
                            marginHeight={0} 
                            marginWidth={0} 
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(property.location + ', Dhanbad, Jharkhand')}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                            title="Property Location"
                            className="w-full h-full"
                        ></iframe>
                        <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md text-sm font-bold text-slate-700 flex items-center">
                            <MapPin size={16} className="text-brand-primary mr-2" />
                            {property.location}, Dhanbad
                        </div>
                    </div>
                </div>

            </div>

            <div className="lg:col-span-1">
                <div className="sticky top-28 bg-white p-6 rounded-3xl shadow-soft border border-slate-100">
                    {property.agent_details && (
                        <div className="flex items-center mb-6 pb-6 border-b border-slate-100">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 shadow-lg">
                                {property.agent_details.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <div>
                                <div className="font-bold text-lg text-slate-900">{property.agent_details.name}</div>
                                <div className="text-sm text-brand-primary font-medium">{property.agent_details.role}</div>
                            </div>
                        </div>
                    )}
                    
                    <h3 className="text-lg font-bold mb-4 text-slate-800">Schedule a Tour</h3>
                    <form className="space-y-4" onSubmit={handleEnquirySubmit}>
                        <input type="text" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none transition" required />
                        <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none transition" required />
                        <input type="tel" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none transition" required />
                        <textarea placeholder="I am interested in..." value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none h-32 resize-none transition"></textarea>
                        
                        <button type="submit" className="w-full bg-brand-primary text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-0.5">
                            Send Enquiry
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-3">
                        <div className="flex gap-3">
                            <button 
                                onClick={() => window.location.href = `tel:${property.agent_contact}`}
                                className="flex-1 py-3 rounded-xl border-2 border-slate-100 text-slate-700 font-bold hover:border-brand-primary hover:text-brand-primary hover:bg-blue-50 transition flex items-center justify-center"
                            >
                                <Phone size={18} className="mr-2" /> Call
                            </button>
                            <a 
                                href={`https://wa.me/${property.agent_contact.replace(/[^0-9]/g, '')}?text=Hi, I'm interested in ${property.title}`} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="flex-1 py-3 rounded-xl bg-[#25D366] text-white font-bold hover:bg-[#20bd5a] shadow-md transition flex items-center justify-center"
                            >
                                <MessageCircle size={18} className="mr-2" /> WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
