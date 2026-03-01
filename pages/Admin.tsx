import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoTransparent from "../src/assets/img/logo-transparent.png";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { AdminCustomers } from './AdminCustomers.tsx';
import { LeadsManager } from '../components/admin/LeadsManager';
import { AgentsManager } from '../components/admin/AgentsManager';
import { BlogsManager } from '../components/admin/BlogsManager';
import { 
  LayoutDashboard, Home, Users, Plus, Trash2, Edit, Image as ImageIcon, 
  Video, FileText, Settings, Download, Search, Mail, Phone, MessageSquare, 
  UserCheck, Bell, Save, UploadCloud, X, ChevronLeft, ChevronRight, CheckSquare, Square,
  Tag, LogOut, MapPin, PlayCircle, User, Clock, CheckCircle, Menu
} from 'lucide-react';
import { LOCATIONS, SUGGESTED_AMENITIES } from '../constants';
import { Property, ListingType, PropertyType, PropertyStatus, Landmark } from '../types';
import { propertyAPI, leadAPI, enquiryAPI, agentAPI, blogAPI, analyticsAPI } from '../api';
import Swal from 'sweetalert2';

// Mock Data for analytics only
const ANALYTICS_DATA = [
  { name: 'Mon', leads: 4, visits: 120 },
  { name: 'Tue', leads: 7, visits: 150 },
  { name: 'Wed', leads: 2, visits: 180 },
  { name: 'Thu', leads: 6, visits: 140 },
  { name: 'Fri', leads: 8, visits: 200 },
  { name: 'Sat', leads: 12, visits: 250 },
  { name: 'Sun', leads: 5, visits: 210 },
];

const INITIAL_FORM_STATE = {
    title: '',
    description: '',
    price: '',
    location: '',
    type: PropertyType.PLOT, // Default to PLOT
    status: PropertyStatus.READY,
    listingType: ListingType.BUY,
    bedrooms: '',
    bathrooms: '',
    area: '',
    dimensions: '',
    facing: '',
    amenities: [] as string[],
    agent: '',
    agentContact: '',
    featured: false,
    newLaunch: false,
    primeCommercial: false,
    images: [] as string[],
    videos: [] as string[],
    landmarks: [] as Landmark[]
};

export const Admin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'agent'>('admin');
  const [agentProfile, setAgentProfile] = useState<any>(null);
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'properties' | 'leads' | 'enquiries' | 'agents' | 'blogs' | 'settings' | 'customers'>('dashboard');
  
  // Lists State
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  
  // Email Modal State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [emailBody, setEmailBody] = useState('');
  
  // Analytics State
  const [analytics, setAnalytics] = useState<any>({
    stats: { properties: {count: 0, growth: 0}, leads: {count: 0, growth: 0}, enquiries: {count: 0, pending: 0}, blogs: {count: 0} },
    weekly_data: []
  });

  // Pagination State for Properties
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Property Form State
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [editPropertyId, setEditPropertyId] = useState<string | null>(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  
  // Amenities State
  const [amenityInput, setAmenityInput] = useState('');

  // File Input Refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Blog Form State
  const [isAddingBlog, setIsAddingBlog] = useState(false);

  // Settings State
  const [emailNotifications, setEmailNotifications] = useState({
      newLead: true,
      newEnquiry: true,
      weeklyReport: false
  });

  // Logout State
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Mobile menu state
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Lead CRUD State
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [editLeadId, setEditLeadId] = useState<string | null>(null);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', message: '', source: 'Website', status: 'New', agent: '' });

  // Agent CRUD State
  const [isAddingAgent, setIsAddingAgent] = useState(false);
  const [editAgentId, setEditAgentId] = useState<string | null>(null);
  const [agentForm, setAgentForm] = useState({ name: '', role: '', email: '', phone: '', photo: '', username: '', password: '', userRole: 'agent', deals: 0 });

  // Check authentication on mount
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.role === 'admin') {
        setIsAuthenticated(true);
        setUserRole('admin');
      } else {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Sync active tab with URL hash
  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as typeof activeTab;
    if (hash && ['dashboard', 'properties', 'leads', 'enquiries', 'agents', 'blogs', 'settings', 'customers'].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  // Update URL hash when tab changes
  useEffect(() => {
    window.location.hash = activeTab;
  }, [activeTab]);

  // Listen to browser back/forward
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as typeof activeTab;
      if (hash && ['dashboard', 'properties', 'leads', 'enquiries', 'agents', 'blogs', 'settings', 'customers'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch data on authentication
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [propsRes, leadsRes, enquiriesRes, agentsRes, blogsRes, analyticsRes] = await Promise.all([
        propertyAPI.getAll(),
        leadAPI.getAll(),
        enquiryAPI.getAll(),
        agentAPI.getAll(),
        blogAPI.getAll(),
        analyticsAPI.getDashboard()
      ]);
      setProperties(propsRes.data.results || propsRes.data || []);
      setLeads(leadsRes.data.results || leadsRes.data || []);
      setEnquiries(enquiriesRes.data.results || enquiriesRes.data || []);
      setAgents(agentsRes.data.results || agentsRes.data || []);
      setBlogs(blogsRes.data.results || blogsRes.data || []);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setShowLogoutConfirm(false);
    navigate('/login');
  };

  // If not authenticated, return null (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Calculate Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProperties = properties.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(properties.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteProperty = async (id: string) => {
    const result = await Swal.fire({
      title: 'Delete Property?',
      text: 'Are you sure you want to delete this property?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563EB',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    });
    
    if(result.isConfirmed) {
      try {
        await propertyAPI.delete(id);
        setProperties(properties.filter(p => p.id !== id));
        Swal.fire('Deleted!', 'Property has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting property:', error);
        Swal.fire('Error!', 'Failed to delete property', 'error');
      }
    }
  };

  const handleEditProperty = (property: any) => {
      setEditPropertyId(property.id);
      setFormData({
          title: property.title,
          description: property.description,
          price: property.price.toString(),
          location: property.location,
          type: property.type,
          status: property.status,
          listingType: property.listing_type,
          bedrooms: property.bedrooms?.toString() || '',
          bathrooms: property.bathrooms?.toString() || '',
          area: property.area.toString(),
          dimensions: property.dimensions || '',
          facing: property.facing || '',
          amenities: property.amenities || [],
          agent: property.agent || '',
          agentContact: property.agent_contact,
          featured: property.featured || false,
          newLaunch: property.new_launch || false,
          primeCommercial: property.prime_commercial || false,
          images: property.images || [],
          videos: property.videos || [],
          landmarks: property.landmarks || []
      });
      setIsAddingProperty(true);
      setAmenityInput('');
  };

  const handleAddAmenity = (amenity: string) => {
      const trimmed = amenity.trim();
      if (trimmed && !formData.amenities.includes(trimmed)) {
          setFormData({ ...formData, amenities: [...formData.amenities, trimmed] });
          setAmenityInput('');
      }
  };

  const handleAmenityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault();
          handleAddAmenity(amenityInput);
      }
  };

  const removeAmenity = (amenity: string) => {
      setFormData({ ...formData, amenities: formData.amenities.filter(a => a !== amenity) });
  };

  // File Upload Handlers
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const processedFiles = await Promise.all(files.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file as Blob);
        });
      }));
      
      if (type === 'image') {
        setFormData(prev => ({ ...prev, images: [...prev.images, ...processedFiles] }));
      } else {
        setFormData(prev => ({ ...prev, videos: [...prev.videos, ...processedFiles] }));
      }
    }
  };

  const removeMedia = (index: number, type: 'image' | 'video') => {
      if (type === 'image') {
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
      } else {
        setFormData(prev => ({ ...prev, videos: prev.videos.filter((_, i) => i !== index) }));
      }
  };

  // Landmark Handlers
  const handleAddLandmark = () => {
    setFormData({
        ...formData,
        landmarks: [...formData.landmarks, { name: '', distance: '', category: 'Transport' }]
    });
  };

  const handleRemoveLandmark = (index: number) => {
      const newLandmarks = [...formData.landmarks];
      newLandmarks.splice(index, 1);
      setFormData({ ...formData, landmarks: newLandmarks });
  };

  const handleLandmarkChange = (index: number, field: keyof Landmark, value: string) => {
      const newLandmarks = [...formData.landmarks];
      // @ts-ignore
      newLandmarks[index] = { ...newLandmarks[index], [field]: value };
      setFormData({ ...formData, landmarks: newLandmarks });
  };


  const filteredAmenitiesSuggestions = SUGGESTED_AMENITIES.filter(
      a => a.toLowerCase().includes(amenityInput.toLowerCase()) && !formData.amenities.includes(a)
  ).slice(0, 5); // Limit to 5 suggestions

  const handleSaveProperty = async () => {
      // Basic Validation
      if (!formData.title || !formData.price || !formData.area) {
          Swal.fire('Missing Fields', 'Please fill in required fields (Title, Price, Area)', 'warning');
          return;
      }

      const propertyData: any = {
          title: formData.title,
          description: formData.description,
          price: Number(formData.price),
          location: formData.location || 'Dhanbad',
          type: formData.type,
          status: formData.status,
          listing_type: formData.listingType,
          bedrooms: Number(formData.bedrooms) || 0,
          bathrooms: Number(formData.bathrooms) || 0,
          area: Number(formData.area),
          dimensions: formData.dimensions,
          facing: formData.facing,
          amenities: formData.amenities,
          agent: formData.agent || null,
          agent_contact: formData.agentContact || '+91 9876543210',
          featured: formData.featured,
          new_launch: formData.newLaunch,
          prime_commercial: formData.primeCommercial,
          images: formData.images.map((img, idx) => ({ image_url: img, order: idx })),
          videos: formData.videos.map(vid => ({ video_url: vid })),
          landmarks: formData.landmarks
      };

      try {
          setLoading(true);
          if (editPropertyId) {
              const response = await propertyAPI.update(editPropertyId, propertyData);
              setProperties(properties.map(p => p.id === editPropertyId ? response.data : p));
              Swal.fire('Updated!', 'Property has been updated successfully.', 'success');
          } else {
              const response = await propertyAPI.create(propertyData);
              setProperties([response.data, ...properties]);
              Swal.fire('Created!', 'Property has been created successfully.', 'success');
          }

          setIsAddingProperty(false);
          setFormData(INITIAL_FORM_STATE);
          setEditPropertyId(null);
      } catch (error) {
          console.error('Error saving property:', error);
          Swal.fire('Error!', 'Failed to save property. Please try again.', 'error');
      } finally {
          setLoading(false);
      }
  };

  const handleExportLeads = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Name,Email,Phone,Source,Status\n"
        + leads.map(e => `${e.name},${e.email},${e.phone},${e.source},${e.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leads_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendEnquiryEmail = async (enquiry: any) => {
    setSelectedEnquiry(enquiry);
    setEmailBody(`Dear ${enquiry.name},\n\nThank you for your enquiry regarding ${enquiry.property}.\n\nWe will get back to you soon.\n\nBest regards,\nShree Shyam City`);
    setShowEmailModal(true);
  };

  const handleSendEmail = async () => {
    if (!selectedEnquiry) return;
    try {
      await enquiryAPI.sendEmail(selectedEnquiry.id, emailBody);
      setEnquiries(enquiries.filter(e => e.id !== selectedEnquiry.id));
      Swal.fire('Sent!', 'Email sent successfully and enquiry marked as resolved!', 'success');
      setShowEmailModal(false);
      setSelectedEnquiry(null);
      setEmailBody('');
    } catch (error) {
      console.error('Error sending email:', error);
      Swal.fire('Error!', 'Failed to send email', 'error');
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    const result = await Swal.fire({
      title: 'Delete Enquiry?',
      text: 'Are you sure you want to delete this enquiry?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563EB',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    });
    
    if(result.isConfirmed) {
      try {
        await enquiryAPI.delete(id);
        setEnquiries(enquiries.filter(e => e.id !== id));
        Swal.fire('Deleted!', 'Enquiry has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting enquiry:', error);
        Swal.fire('Error!', 'Failed to delete enquiry', 'error');
      }
    }
  };

  const handleResolveEnquiry = async (id: string) => {
    const result = await Swal.fire({
      title: 'Resolve Enquiry?',
      text: 'Mark this enquiry as resolved?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, resolve it!'
    });
    
    if(result.isConfirmed) {
      try {
        await enquiryAPI.resolve(id);
        setEnquiries(enquiries.filter(e => e.id !== id));
        Swal.fire('Resolved!', 'Enquiry has been marked as resolved.', 'success');
      } catch (error) {
        console.error('Error resolving enquiry:', error);
        Swal.fire('Error!', 'Failed to resolve enquiry', 'error');
      }
    }
  };

  const SidebarItem = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button 
        onClick={() => {
          setActiveTab(id);
          setShowMobileMenu(false);
        }}
        className={`w-full flex items-center p-3 rounded-xl transition mb-1 font-medium ${activeTab === id ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
    >
        <Icon size={20} className="mr-3" /> {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
            <p className="mt-4 text-slate-600 font-medium">Loading...</p>
          </div>
        </div>
      )}
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white p-6 hidden md:flex flex-col fixed h-full z-10 overflow-y-auto">
        <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center font-bold font-heading">SC</div>
            <h2 className="text-xl font-heading font-bold">Admin Panel</h2>
        </div>
        
        <nav className="flex-1 space-y-2">
            {userRole === 'admin' && <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />}
            {userRole === 'admin' && (
              <>
                <SidebarItem id="properties" icon={Home} label="Properties" />
                <SidebarItem id="customers" icon={User} label="Customers" />
              </>
            )}
            <SidebarItem id="leads" icon={Users} label="Leads" />
            {userRole === 'admin' && (
              <>
                <SidebarItem id="enquiries" icon={MessageSquare} label="Enquiries" />
                <SidebarItem id="agents" icon={UserCheck} label="Agents" />
                <SidebarItem id="blogs" icon={FileText} label="Blogs" />
                <SidebarItem id="settings" icon={Settings} label="Settings" />
              </>
            )}
        </nav>
        
        <div className="mt-auto pt-6 border-t border-slate-800">
            <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-slate-800 transition text-left group"
            >
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80" className="w-10 h-10 rounded-full border-2 border-slate-700" alt="Admin" />
                <div className="flex-1">
                    <div className="text-sm font-bold group-hover:text-white text-slate-200">Admin User</div>
                    <div className="text-xs text-slate-500">Super Admin</div>
                </div>
                <LogOut size={18} className="text-slate-500 group-hover:text-red-400 transition-colors" />
            </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setShowMobileMenu(false)}>
          <div className="w-64 bg-slate-900 text-white p-6 h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center font-bold font-heading">SC</div>
                <h2 className="text-xl font-heading font-bold">Admin Panel</h2>
              </div>
              <button onClick={() => setShowMobileMenu(false)} className="p-2 hover:bg-slate-800 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <nav className="flex-1 space-y-2">
                {userRole === 'admin' && <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />}
                {userRole === 'admin' && (
                  <>
                    <SidebarItem id="properties" icon={Home} label="Properties" />
                    <SidebarItem id="customers" icon={User} label="Customers" />
                  </>
                )}
                <SidebarItem id="leads" icon={Users} label="Leads" />
                {userRole === 'admin' && (
                  <>
                    <SidebarItem id="enquiries" icon={MessageSquare} label="Enquiries" />
                    <SidebarItem id="agents" icon={UserCheck} label="Agents" />
                    <SidebarItem id="blogs" icon={FileText} label="Blogs" />
                    <SidebarItem id="settings" icon={Settings} label="Settings" />
                  </>
                )}
            </nav>
            
            <div className="mt-auto pt-6 border-t border-slate-800">
                <button 
                    onClick={() => { setShowLogoutConfirm(true); setShowMobileMenu(false); }}
                    className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-slate-800 transition text-left group"
                >
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80" className="w-10 h-10 rounded-full border-2 border-slate-700" alt="Admin" />
                    <div className="flex-1">
                        <div className="text-sm font-bold group-hover:text-white text-slate-200">Admin User</div>
                        <div className="text-xs text-slate-500">Super Admin</div>
                    </div>
                    <LogOut size={18} className="text-slate-500 group-hover:text-red-400 transition-colors" />
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-4 md:p-8">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <button onClick={() => setShowMobileMenu(true)} className="p-2 hover:bg-slate-100 rounded-lg transition">
            <Menu size={24} className="text-slate-700" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-primary rounded-lg flex items-center justify-center font-bold text-white text-xs">SC</div>
            <h2 className="font-heading font-bold text-slate-900">Admin Panel</h2>
          </div>
          <button onClick={() => setShowLogoutConfirm(true)} className="p-2 hover:bg-slate-100 rounded-lg transition">
            <LogOut size={20} className="text-slate-700" />
          </button>
        </div>
        
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && userRole === 'admin' && (
            <div className="space-y-8 animate-in fade-in duration-300">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-slate-900">Dashboard Overview</h1>
                        <p className="text-slate-500">Welcome back, here's what's happening today.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-brand-primary shadow-sm"><Bell size={20} /></button>
                    </div>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <div onClick={() => setActiveTab('properties')} className="bg-white p-4 md:p-6 rounded-2xl shadow-soft border border-slate-100 group hover:border-blue-200 transition cursor-pointer">
                        <div className="flex justify-between items-start mb-3 md:mb-4">
                            <div className="p-2 md:p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition"><Home size={20} className="md:w-6 md:h-6" /></div>
                            {analytics.stats.properties.growth !== 0 && (
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${analytics.stats.properties.growth > 0 ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'}`}>
                                    {analytics.stats.properties.growth > 0 ? '+' : ''}{analytics.stats.properties.growth}%
                                </span>
                            )}
                        </div>
                        <div className="text-slate-500 text-xs md:text-sm font-medium">Total Properties</div>
                        <div className="text-2xl md:text-3xl font-bold text-slate-900">{analytics.stats.properties.count}</div>
                    </div>
                    <div onClick={() => setActiveTab('leads')} className="bg-white p-4 md:p-6 rounded-2xl shadow-soft border border-slate-100 group hover:border-orange-200 transition cursor-pointer">
                        <div className="flex justify-between items-start mb-3 md:mb-4">
                            <div className="p-2 md:p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition"><Users size={20} className="md:w-6 md:h-6" /></div>
                            {analytics.stats.leads.growth !== 0 && (
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${analytics.stats.leads.growth > 0 ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'}`}>
                                    {analytics.stats.leads.growth > 0 ? '+' : ''}{analytics.stats.leads.growth}%
                                </span>
                            )}
                        </div>
                        <div className="text-slate-500 text-xs md:text-sm font-medium">Total Leads</div>
                        <div className="text-2xl md:text-3xl font-bold text-slate-900">{analytics.stats.leads.count}</div>
                        {analytics.stats.leads.pending > 0 && (
                            <div className="text-xs text-orange-600 font-medium mt-1">{analytics.stats.leads.pending} pending</div>
                        )}
                    </div>
                    <div onClick={() => setActiveTab('enquiries')} className="bg-white p-4 md:p-6 rounded-2xl shadow-soft border border-slate-100 group hover:border-purple-200 transition cursor-pointer">
                        <div className="flex justify-between items-start mb-3 md:mb-4">
                            <div className="p-2 md:p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition"><MessageSquare size={20} className="md:w-6 md:h-6" /></div>
                            {analytics.stats.enquiries.pending > 0 && (
                                <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                                    {analytics.stats.enquiries.pending} pending
                                </span>
                            )}
                        </div>
                        <div className="text-slate-500 text-xs md:text-sm font-medium">Active Enquiries</div>
                        <div className="text-2xl md:text-3xl font-bold text-slate-900">{analytics.stats.enquiries.count}</div>
                    </div>
                    <div onClick={() => setActiveTab('blogs')} className="bg-white p-4 md:p-6 rounded-2xl shadow-soft border border-slate-100 group hover:border-green-200 transition cursor-pointer">
                        <div className="flex justify-between items-start mb-3 md:mb-4">
                            <div className="p-2 md:p-3 bg-green-50 text-green-600 rounded-xl group-hover:bg-green-600 group-hover:text-white transition"><FileText size={20} className="md:w-6 md:h-6" /></div>
                        </div>
                        <div className="text-slate-500 text-xs md:text-sm font-medium">Total Blogs</div>
                        <div className="text-2xl md:text-3xl font-bold text-slate-900">{analytics.stats.blogs.count}</div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100">
                        <h3 className="text-lg font-bold font-heading mb-6 text-slate-800">Lead Generation</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analytics.weekly_data.length > 0 ? analytics.weekly_data : ANALYTICS_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        cursor={{fill: '#f8fafc'}}
                                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                    />
                                    <Bar dataKey="leads" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100">
                        <h3 className="text-lg font-bold font-heading mb-6 text-slate-800">Site Visits</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={analytics.weekly_data.length > 0 ? analytics.weekly_data : ANALYTICS_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                    />
                                    <Line type="monotone" dataKey="visits" stroke="#F97316" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 text-center">Note: Site visit tracking requires frontend analytics integration</p>
                    </div>
                </div>
            </div>
        )}

        {/* PROPERTIES */}
        {activeTab === 'properties' && (
            <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-heading font-bold text-slate-900">Property Management</h1>
                        <p className="text-slate-500 text-sm">Manage listings, edit details, and upload media.</p>
                    </div>
                    <button 
                        onClick={() => { setIsAddingProperty(!isAddingProperty); setEditPropertyId(null); setFormData(INITIAL_FORM_STATE); setAmenityInput(''); }}
                        className="bg-brand-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition flex items-center shadow-lg shadow-brand-primary/30"
                    >
                        {isAddingProperty ? <X size={20} className="mr-2" /> : <Plus size={20} className="mr-2" />} 
                        {isAddingProperty ? 'Cancel' : 'Add Property'}
                    </button>
                </div>

                {isAddingProperty && (
                    <div className="bg-white p-8 rounded-2xl shadow-soft border border-slate-100 animate-in slide-in-from-top-4 duration-300">
                        <h3 className="text-lg font-bold mb-6 text-slate-800 border-b border-slate-100 pb-2">
                            {editPropertyId ? 'Edit Property' : 'Add New Property'}
                        </h3>
                        
                        {/* 1. Basic Details */}
                        <div className="mb-6">
                            <h4 className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-4">Basic Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Property Title <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        placeholder="e.g. Luxury Villa in Hirapur" 
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Location</label>
                                    <select 
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none"
                                    >
                                        <option value="">Select Location</option>
                                        {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Price (in Lakhs) <span className="text-red-500">*</span></label>
                                    <input 
                                        type="number" 
                                        value={formData.price}
                                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                                        placeholder="45" 
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Listing Type</label>
                                    <select 
                                        value={formData.listingType}
                                        onChange={(e) => setFormData({...formData, listingType: e.target.value as ListingType})}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none"
                                    >
                                        <option value={ListingType.BUY}>Buy (Sale)</option>
                                        <option value={ListingType.RENT}>Rent</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* 2. Property Specifications */}
                        <div className="mb-6 border-t border-slate-100 pt-6">
                            <h4 className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-4">Specifications</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Area (sq ft) <span className="text-red-500">*</span></label>
                                    <input 
                                        type="number" 
                                        value={formData.area}
                                        onChange={(e) => setFormData({...formData, area: e.target.value})}
                                        placeholder="1200" 
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Dimensions</label>
                                    <input 
                                        type="text" 
                                        value={formData.dimensions}
                                        onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
                                        placeholder="e.g. 40x50 ft" 
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Facing</label>
                                    <select 
                                        value={formData.facing}
                                        onChange={(e) => setFormData({...formData, facing: e.target.value})}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none" 
                                    >
                                        <option value="">Select Facing</option>
                                        <option value="North">North</option>
                                        <option value="South">South</option>
                                        <option value="East">East</option>
                                        <option value="West">West</option>
                                        <option value="North-East">North-East</option>
                                        <option value="North-West">North-West</option>
                                        <option value="South-East">South-East</option>
                                        <option value="South-West">South-West</option>
                                        <option value="Corner">Corner</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Bedrooms</label>
                                    <input 
                                        type="number" 
                                        value={formData.bedrooms}
                                        onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                                        placeholder="3" 
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Bathrooms</label>
                                    <input 
                                        type="number" 
                                        value={formData.bathrooms}
                                        onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                                        placeholder="2" 
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none" 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 3. Categories & Visibility */}
                        <div className="mb-6 border-t border-slate-100 pt-6">
                            <h4 className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-4">Categories & Visibility</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Property Category (Physical Type)</label>
                                        <select 
                                            value={formData.type}
                                            onChange={(e) => setFormData({...formData, type: e.target.value as PropertyType})}
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none"
                                        >
                                            {Object.values(PropertyType).map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Construction Status</label>
                                        <select 
                                            value={formData.status}
                                            onChange={(e) => setFormData({...formData, status: e.target.value as PropertyStatus})}
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none"
                                        >
                                            {Object.values(PropertyStatus).map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-700">Marketing Categories (Select all that apply)</label>
                                    
                                    <label className="flex items-center p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition">
                                        <input 
                                            type="checkbox" 
                                            checked={formData.featured}
                                            onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                                            className="w-5 h-5 text-brand-primary border-slate-300 rounded focus:ring-brand-primary" 
                                        />
                                        <span className="ml-3 text-sm font-medium text-slate-800">Featured Property</span>
                                    </label>

                                    <label className="flex items-center p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition">
                                        <input 
                                            type="checkbox" 
                                            checked={formData.newLaunch}
                                            onChange={(e) => setFormData({...formData, newLaunch: e.target.checked})}
                                            className="w-5 h-5 text-brand-primary border-slate-300 rounded focus:ring-brand-primary" 
                                        />
                                        <span className="ml-3 text-sm font-medium text-slate-800">New & Upcoming Project</span>
                                    </label>

                                    <label className="flex items-center p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition">
                                        <input 
                                            type="checkbox" 
                                            checked={formData.primeCommercial}
                                            onChange={(e) => setFormData({...formData, primeCommercial: e.target.checked})}
                                            className="w-5 h-5 text-brand-primary border-slate-300 rounded focus:ring-brand-primary" 
                                        />
                                        <span className="ml-3 text-sm font-medium text-slate-800">Prime Commercial Space</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* 4. Details & Media */}
                        <div className="mb-6 border-t border-slate-100 pt-6">
                            <h4 className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-4">Additional Details</h4>
                            
                            {/* Smart Amenities Input */}
                            <div className="space-y-2 mb-6">
                                <label className="text-sm font-bold text-slate-700">Amenities</label>
                                <div className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-brand-primary focus-within:ring-1 focus-within:ring-brand-primary/20 transition min-h-[50px] flex flex-wrap gap-2 items-center">
                                    {formData.amenities.map((amenity, idx) => (
                                        <span key={idx} className="bg-brand-primary text-white text-sm px-3 py-1 rounded-full flex items-center font-medium">
                                            {amenity}
                                            <button 
                                                onClick={() => removeAmenity(amenity)}
                                                className="ml-2 hover:text-red-200 focus:outline-none"
                                            >
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                    <div className="relative flex-grow">
                                        <input 
                                            type="text" 
                                            value={amenityInput}
                                            onChange={(e) => setAmenityInput(e.target.value)}
                                            onKeyDown={handleAmenityKeyDown}
                                            placeholder={formData.amenities.length === 0 ? "Type amenity and press Enter or Comma..." : "Add another..."}
                                            className="w-full bg-transparent outline-none text-slate-700 placeholder-slate-400" 
                                        />
                                        {/* Suggestions Dropdown */}
                                        {amenityInput && filteredAmenitiesSuggestions.length > 0 && (
                                            <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-100 rounded-xl shadow-lg z-50 overflow-hidden">
                                                {filteredAmenitiesSuggestions.map(suggestion => (
                                                    <div 
                                                        key={suggestion}
                                                        onClick={() => handleAddAmenity(suggestion)}
                                                        className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm text-slate-700"
                                                    >
                                                        {suggestion}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500">Type comma (,) or press Enter to add a tag. Select from suggestions for standard amenities.</p>
                            </div>

                             {/* Landmarks Section - NEW */}
                             <div className="space-y-4 mb-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center">
                                        <MapPin size={16} className="mr-2 text-brand-primary" /> 
                                        Nearby Landmarks
                                    </label>
                                    <button 
                                        onClick={handleAddLandmark}
                                        className="text-xs font-bold text-white bg-brand-primary px-3 py-1.5 rounded-lg hover:bg-blue-700 transition flex items-center"
                                    >
                                        <Plus size={14} className="mr-1" /> Add Landmark
                                    </button>
                                </div>
                                
                                {formData.landmarks.length === 0 ? (
                                    <div className="text-center py-6 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 text-sm">
                                        No landmarks added yet. Add nearby locations to highlight property value.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {formData.landmarks.map((landmark, index) => (
                                            <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                                <div className="flex-1 w-full sm:w-auto">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Name (e.g. City Centre)"
                                                        value={landmark.name}
                                                        onChange={(e) => handleLandmarkChange(index, 'name', e.target.value)}
                                                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-brand-primary outline-none"
                                                    />
                                                </div>
                                                <div className="w-full sm:w-24">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Dist (2km)"
                                                        value={landmark.distance}
                                                        onChange={(e) => handleLandmarkChange(index, 'distance', e.target.value)}
                                                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-brand-primary outline-none"
                                                    />
                                                </div>
                                                <div className="w-full sm:w-32">
                                                    <select 
                                                        value={landmark.category}
                                                        onChange={(e) => handleLandmarkChange(index, 'category', e.target.value as any)}
                                                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-brand-primary outline-none"
                                                    >
                                                        <option value="Transport">Transport</option>
                                                        <option value="Education">Education</option>
                                                        <option value="Healthcare">Healthcare</option>
                                                        <option value="Lifestyle">Lifestyle</option>
                                                        <option value="Religious">Religious</option>
                                                        <option value="Business">Business</option>
                                                    </select>
                                                </div>
                                                <button 
                                                    onClick={() => handleRemoveLandmark(index)} 
                                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Remove Landmark"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 mb-4">
                                <label className="text-sm font-bold text-slate-700">Assign Agent</label>
                                <select 
                                    value={formData.agent}
                                    onChange={(e) => setFormData({...formData, agent: e.target.value})}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none"
                                >
                                    <option value="">Select Agent (Optional)</option>
                                    {agents.map(agent => (
                                        <option key={agent.id} value={agent.id}>{agent.name} - {agent.role}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2 mb-6">
                                <label className="text-sm font-bold text-slate-700">Description</label>
                                <textarea 
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none h-32" 
                                    placeholder="Detailed description of the property..."
                                ></textarea>
                            </div>

                            {/* Hidden File Inputs */}
                            <input 
                                type="file" 
                                ref={imageInputRef} 
                                className="hidden" 
                                accept="image/*" 
                                multiple 
                                onChange={(e) => handleFileSelect(e, 'image')} 
                            />
                            <input 
                                type="file" 
                                ref={videoInputRef} 
                                className="hidden" 
                                accept="video/*" 
                                multiple 
                                onChange={(e) => handleFileSelect(e, 'video')} 
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div 
                                    onClick={() => imageInputRef.current?.click()}
                                    className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition cursor-pointer hover:border-brand-primary"
                                >
                                    <div className="w-12 h-12 bg-blue-50 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-3">
                                        <ImageIcon size={24} />
                                    </div>
                                    <h4 className="font-bold text-slate-700">Upload Images</h4>
                                    <p className="text-xs text-slate-500 mt-1">Drag & drop or click to browse</p>
                                </div>
                                <div 
                                    onClick={() => videoInputRef.current?.click()}
                                    className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition cursor-pointer hover:border-brand-primary"
                                >
                                    <div className="w-12 h-12 bg-orange-50 text-brand-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Video size={24} />
                                    </div>
                                    <h4 className="font-bold text-slate-700">Upload Videos</h4>
                                    <p className="text-xs text-slate-500 mt-1">MP4, WebM supported</p>
                                </div>
                            </div>

                            {/* Image Previews */}
                            {formData.images.length > 0 && (
                                <div className="mb-6">
                                    <h5 className="text-sm font-bold text-slate-700 mb-3 flex items-center"><ImageIcon size={14} className="mr-2"/> Uploaded Images</h5>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        {formData.images.map((img, idx) => (
                                            <div key={`img-${idx}`} className="relative group rounded-xl overflow-hidden shadow-sm border border-slate-200 aspect-square">
                                                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); removeMedia(idx, 'image'); }}
                                                    className="absolute top-2 right-2 bg-white/90 text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white"
                                                    title="Remove Image"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Video Previews */}
                            {formData.videos.length > 0 && (
                                <div>
                                    <h5 className="text-sm font-bold text-slate-700 mb-3 flex items-center"><Video size={14} className="mr-2"/> Uploaded Videos</h5>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {formData.videos.map((vid, idx) => (
                                            <div key={`vid-${idx}`} className="relative group rounded-xl overflow-hidden shadow-sm border border-slate-200 aspect-video bg-black">
                                                <video src={vid} className="w-full h-full object-cover opacity-80" />
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                                                        <PlayCircle size={24} className="text-white" />
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); removeMedia(idx, 'video'); }}
                                                    className="absolute top-2 right-2 bg-white/90 text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white z-10"
                                                    title="Remove Video"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                            <button onClick={() => setIsAddingProperty(false)} className="px-6 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                            <button onClick={handleSaveProperty} className="px-6 py-3 rounded-xl bg-brand-primary text-white font-bold hover:bg-blue-700 shadow-lg flex items-center">
                                <Save size={18} className="mr-2" /> Save Property
                            </button>
                        </div>
                    </div>
                )}

                {/* Properties Table */}
                <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                                <tr>
                                    <th className="p-5">Property</th>
                                    <th className="p-5">Location</th>
                                    <th className="p-5">Agent</th>
                                    <th className="p-5">Price</th>
                                    <th className="p-5">Active Categories</th>
                                    <th className="p-5">Status</th>
                                    <th className="p-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {currentProperties.map(p => (
                                    <tr key={p.id} className="hover:bg-slate-50 transition">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                {p.images && p.images[0] && <img src={p.images[0]} className="w-12 h-12 rounded-lg object-cover" alt="thumb" />}
                                                <div>
                                                    <span className="font-bold text-slate-800 text-sm block">{p.title}</span>
                                                    <span className="text-xs text-slate-500">{p.type} • {p.area} sqft</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 text-sm text-slate-600">{p.location}</td>
                                        <td className="p-5 text-sm text-slate-600">
                                            {p.agent_details ? p.agent_details.name : <span className="text-slate-400">Unassigned</span>}
                                        </td>
                                        <td className="p-5 text-sm font-bold text-slate-800">₹{p.price} L</td>
                                <td className="p-5 text-sm">
                                            <div className="flex flex-wrap gap-1">
                                                {p.featured && <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold">Featured</span>}
                                                {p.prime_commercial && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold">Commercial</span>}
                                                {p.new_launch && <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold">New Project</span>}
                                            </div>
                                        </td>
                                        <td className="p-5 text-sm">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${p.status === 'Ready to Move' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleEditProperty(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit size={18} /></button>
                                                <button onClick={() => handleDeleteProperty(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden divide-y divide-slate-100">
                        {currentProperties.map(p => (
                            <div key={p.id} className="p-4 hover:bg-slate-50 transition">
                                <div className="flex gap-3 mb-3">
                                    {p.images && p.images[0] && <img src={p.images[0]} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" alt="thumb" />}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-800 text-sm mb-1 truncate">{p.title}</h3>
                                        <p className="text-xs text-slate-500 mb-2">{p.type} • {p.area} sqft • {p.location}</p>
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {p.featured && <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold">Featured</span>}
                                            {p.prime_commercial && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold">Commercial</span>}
                                            {p.new_launch && <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold">New</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <div>
                                        <div className="text-lg font-bold text-slate-800">₹{p.price} L</div>
                                        <div className="text-xs text-slate-500">{p.agent_details ? p.agent_details.name : 'Unassigned'}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEditProperty(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit size={18} /></button>
                                        <button onClick={() => handleDeleteProperty(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Pagination */}
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-sm text-slate-500">
                            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, properties.length)} of {properties.length}
                        </span>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={20} className="text-slate-600" />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button 
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-10 h-10 rounded-lg font-bold text-sm ${currentPage === page ? 'bg-brand-primary text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button 
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={20} className="text-slate-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* CUSTOMERS */}
        {activeTab === 'customers' && <AdminCustomers />}

        {/* LEADS */}
        {activeTab === 'leads' && <LeadsManager leads={leads} agents={agents} onUpdate={fetchAllData} userRole={userRole} />}

        {/* ENQUIRIES */}
        {activeTab === 'enquiries' && (
             <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-heading font-bold text-slate-900">Enquiry Database</h1>
                        <p className="text-slate-500 text-sm">View and manage property enquiries.</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                                <tr>
                                    <th className="p-5">From</th>
                                    <th className="p-5">Property Interest</th>
                                    <th className="p-5">Message</th>
                                    <th className="p-5">Date</th>
                                    <th className="p-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {enquiries.map(enq => (
                                    <tr key={enq.id} className={`hover:bg-slate-50 transition ${enq.status === 'Unread' ? 'bg-blue-50/50' : ''}`}>
                                        <td className="p-5 font-bold text-slate-800 text-sm">{enq.name}</td>
                                        <td className="p-5 text-sm text-brand-primary font-medium">{enq.property}</td>
                                        <td className="p-5 text-sm text-slate-600 max-w-xs truncate">{enq.message}</td>
                                        <td className="p-5 text-sm text-slate-500">{enq.date}</td>
                                        <td className="p-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => handleSendEnquiryEmail(enq)}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition" 
                                                    title="Send Email"
                                                >
                                                    <Mail size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleResolveEnquiry(enq.id)}
                                                    className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition" 
                                                    title="Mark as Resolved"
                                                >
                                                    <CheckCircle size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteEnquiry(enq.id)}
                                                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition" 
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-slate-100">
                        {enquiries.map(enq => (
                            <div key={enq.id} className={`p-4 ${enq.status === 'Unread' ? 'bg-blue-50/50' : ''}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-bold text-slate-800 text-sm">{enq.name}</div>
                                    <div className="text-xs text-slate-500">{enq.date}</div>
                                </div>
                                <div className="text-sm text-brand-primary font-medium mb-2">{enq.property}</div>
                                <div className="text-sm text-slate-600 mb-3">{enq.message}</div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleSendEnquiryEmail(enq)} className="flex-1 p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-sm font-medium">
                                        <Mail size={14} className="inline mr-1" /> Email
                                    </button>
                                    <button onClick={() => handleResolveEnquiry(enq.id)} className="flex-1 p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition text-sm font-medium">
                                        <CheckCircle size={14} className="inline mr-1" /> Resolve
                                    </button>
                                    <button onClick={() => handleDeleteEnquiry(enq.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* AGENTS */}
        {activeTab === 'agents' && <AgentsManager agents={agents} onUpdate={fetchAllData} />}

        {/* BLOGS */}
        {activeTab === 'blogs' && <BlogsManager blogs={blogs} onUpdate={fetchAllData} />}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-slate-900">Settings</h1>
                    <p className="text-slate-500 text-sm">Configure your admin preferences.</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-soft border border-slate-100 max-w-2xl">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center"><Mail size={20} className="mr-2" /> Email Notifications</h3>
                    
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-bold text-slate-800">New Lead Alert</div>
                                <div className="text-xs text-slate-500">Get notified when a new lead is captured</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={emailNotifications.newLead} onChange={() => setEmailNotifications({...emailNotifications, newLead: !emailNotifications.newLead})} className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-bold text-slate-800">Enquiry Received</div>
                                <div className="text-xs text-slate-500">Get notified for new property enquiries</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={emailNotifications.newEnquiry} onChange={() => setEmailNotifications({...emailNotifications, newEnquiry: !emailNotifications.newEnquiry})} className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-bold text-slate-800">Weekly Reports</div>
                                <div className="text-xs text-slate-500">Receive weekly analytics digest</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={emailNotifications.weeklyReport} onChange={() => setEmailNotifications({...emailNotifications, weeklyReport: !emailNotifications.weeklyReport})} className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm m-4 transform scale-100 animate-in zoom-in-95 duration-200">
                <h3 className="text-xl font-heading font-bold text-slate-900 mb-2">Confirm Logout</h3>
                <p className="text-slate-600 mb-6">Are you sure you want to log out of the admin panel?</p>
                <div className="flex justify-end gap-3">
                    <button 
                        onClick={() => setShowLogoutConfirm(false)}
                        className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg transition"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl m-4 transform scale-100 animate-in zoom-in-95 duration-200">
                <h3 className="text-xl font-heading font-bold text-slate-900 mb-4">Send Email</h3>
                <div className="space-y-4 mb-6">
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-1 block">To:</label>
                        <input 
                            type="text" 
                            value={`${selectedEnquiry.name} <${selectedEnquiry.email}>`}
                            disabled
                            className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-600"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-1 block">Subject:</label>
                        <input 
                            type="text" 
                            value={`Enquiry - ${selectedEnquiry.property}`}
                            disabled
                            className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-600"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-1 block">Message:</label>
                        <textarea 
                            value={emailBody}
                            onChange={(e) => setEmailBody(e.target.value)}
                            rows={10}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none"
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-3">
                    <button 
                        onClick={() => { setShowEmailModal(false); setSelectedEnquiry(null); setEmailBody(''); }}
                        className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSendEmail}
                        className="px-4 py-2 rounded-xl bg-brand-primary text-white font-bold hover:bg-blue-700 shadow-lg transition flex items-center"
                    >
                        <Mail size={18} className="mr-2" /> Send Email
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};