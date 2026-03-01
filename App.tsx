import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Listing } from './pages/Listing';
import { PropertyDetails } from './pages/PropertyDetails';
import { Admin } from './pages/Admin';
import { AgentPortal } from './pages/AgentPortal';
import { Login } from './pages/Login';
import { blogAPI } from './api';
import { ArrowRight, Mail, Phone, MapPin, Award, Users, TrendingUp, Target, X, Linkedin, Globe, CheckCircle2, Building2, Landmark, Map, FileText, BadgePercent, Coins, Lightbulb, ChevronRight, Bus, School, ShoppingBag, Stethoscope } from 'lucide-react';

const ScrollToTop = () => {
    const { pathname } = useLocation();
  
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
  
    return null;
  };
import { teamAPI } from './api';

// Modern About Page
const About = () => {
    const navigate = useNavigate();
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    
    useEffect(() => {
        console.log('[ABOUT] Fetching team members...');
        teamAPI.getAll()
            .then(res => {
                console.log('[ABOUT] Team members fetched:', res.data);
                setTeamMembers(res.data.results || []);
            })
            .catch(err => {
                console.error('[ABOUT] Error fetching team:', err);
            });
    }, []);

    const [selectedMember, setSelectedMember] = useState<typeof teamMembers[0] | null>(null);

    // Lock body scroll when panel is open
    useEffect(() => {
        if (selectedMember) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedMember]);

    return (
        <div className="pt-24 pb-20 bg-slate-50 min-h-screen font-sans">
             <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .slide-in-panel {
                    animation: slideIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
            `}</style>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="max-w-3xl mx-auto text-center">
                    <span className="text-brand-primary font-bold tracking-wider uppercase text-sm bg-blue-50 px-4 py-1.5 rounded-full">Since 2015</span>
                    <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-slate-900 mt-6 mb-6">Building Trust in Every <span className="text-brand-primary">Square Foot</span></h1>
                    <p className="text-xl text-slate-600 leading-relaxed font-light">
                        We are Dhanbad's premier real estate consultancy. Our mission is to simplify property buying for everyone in Jharkhand through transparency, technology, and trust.
                    </p>
                </div>
            </div>

            {/* Company Profile & Experience */}
            <div className="bg-white py-20 mb-20 shadow-sm border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-brand-secondary/20 rounded-full blur-xl"></div>
                            <img 
                                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" 
                                alt="Our Office" 
                                className="relative rounded-3xl shadow-2xl z-10"
                            />
                            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl z-20 border border-slate-100 max-w-xs hidden md:block">
                                <p className="font-heading font-bold text-lg text-slate-800">"We don't just sell properties; we build relationships."</p>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Award className="text-brand-primary" size={24} />
                                <span className="text-brand-primary font-bold tracking-wider uppercase text-sm">Company Profile</span>
                            </div>
                            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-6">Deep Roots in the Coal Capital</h2>
                            <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
                                <p>
                                    Founded in 2015, <strong>Shree Shyam City</strong> emerged from a simple observation: the real estate market in Dhanbad lacked a professional, data-driven approach. 
                                </p>
                                <p>
                                    Over the last decade, we have transformed the landscape by bridging the gap between buyers and sellers. Our deep understanding of local micro-markets—from the commercial hustle of <strong>Bank More</strong> to the educational hub of <strong>Hirapur</strong>—allows us to offer advice that is both practical and profitable.
                                </p>
                                <div className="grid grid-cols-2 gap-6 mt-8">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="text-3xl font-bold text-brand-primary mb-1">10+</div>
                                        <div className="text-sm font-medium text-slate-500">Years of Experience</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="text-3xl font-bold text-brand-secondary mb-1">2000+</div>
                                        <div className="text-sm font-medium text-slate-500">Happy Families</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="text-center mb-12">
                     <h2 className="text-3xl font-heading font-bold text-slate-900">Our Core Values</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] text-white shadow-xl transform hover:-translate-y-1 transition duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 relative z-10">
                           <Target size={32} />
                        </div>
                        <h3 className="text-2xl font-heading font-bold mb-4 relative z-10">Our Mission</h3>
                        <p className="text-blue-100 leading-relaxed text-lg relative z-10">
                            To revolutionize the real estate experience in Jharkhand by providing transparent, ethical, and technology-driven solutions. We aim to make property ownership a hassle-free reality for every aspiring homeowner.
                        </p>
                    </div>
                    <div className="p-10 bg-white rounded-[2.5rem] border border-slate-200 shadow-lg hover:shadow-xl transition duration-300 relative overflow-hidden">
                         <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-secondary/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
                        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-8 text-brand-secondary relative z-10">
                           <TrendingUp size={32} />
                        </div>
                        <h3 className="text-2xl font-heading font-bold mb-4 text-slate-900 relative z-10">Our Vision</h3>
                        <p className="text-slate-600 leading-relaxed text-lg relative z-10">
                            To be the most trusted and preferred real estate partner in Eastern India, known for our integrity, customer-centric approach, and contribution to sustainable urban development.
                        </p>
                    </div>
                </div>
            </div>

            {/* Creative Leadership Grid */}
            <div className="py-20 relative overflow-hidden">
                 {/* Abstract Background Elements */}
                 <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                     <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl"></div>
                     <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-3xl"></div>
                 </div>

                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                     <div className="mb-16 text-center">
                         <span className="text-brand-primary font-bold tracking-wider uppercase text-sm bg-white px-4 py-1.5 rounded-full shadow-sm">The Dream Team</span>
                         <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mt-6">Leadership Team</h2>
                         <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg font-light">Meet the visionaries building the future of Dhanbad, one brick at a time.</p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                         {teamMembers.length === 0 ? (
                             <div className="col-span-full text-center py-12">
                                 <p className="text-slate-500">Loading team members...</p>
                             </div>
                         ) : (
                             teamMembers.map((member, idx) => (
                             <div 
                                key={idx} 
                                onClick={() => setSelectedMember(member)}
                                className="group relative h-[420px] rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 bg-slate-900 ring-offset-2 ring-transparent hover:ring-2 hover:ring-brand-primary/50"
                             >
                                 {/* Image */}
                                 <img 
                                    src={member.image} 
                                    alt={member.name} 
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-90 group-hover:opacity-100"
                                 />
                                 
                                 {/* Default Gradient Overlay */}
                                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-0"></div>

                                 {/* Minimal Info (Bottom Left) - Fades out on hover */}
                                 <div className="absolute bottom-0 left-0 p-8 w-full transform transition-all duration-500 group-hover:translate-y-10 group-hover:opacity-0">
                                     <div className="w-10 h-1 bg-brand-secondary mb-4 rounded-full"></div>
                                     <h3 className="text-2xl font-bold text-white font-heading leading-tight">{member.name}</h3>
                                     <p className="text-slate-300 text-sm font-medium uppercase tracking-widest mt-2">{member.role}</p>
                                 </div>

                                 {/* Hover Reveal Content (Slide Up Glass) - Modified to just show "View Profile" */}
                                 <div className="absolute inset-0 bg-brand-primary/90 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out flex flex-col items-center justify-center p-8 text-center text-white">
                                     <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                                        <ArrowRight size={32} />
                                     </div>
                                     <span className="text-lg font-bold tracking-widest uppercase">View Profile</span>
                                 </div>
                             </div>
                         )))}
                     </div>
                 </div>
            </div>

            {/* Slide-out Details Panel */}
            {selectedMember && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" 
                        onClick={() => setSelectedMember(null)}
                    ></div>
                    
                    {/* Panel */}
                    <div className="relative w-full md:w-[550px] bg-white h-full shadow-2xl overflow-y-auto slide-in-panel flex flex-col">
                        {/* Close Button */}
                        <button 
                            onClick={() => setSelectedMember(null)}
                            className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full z-20 text-white transition-all transform hover:rotate-90"
                        >
                            <X size={24} />
                        </button>

                        {/* Hero Image */}
                        <div className="relative h-[45%] min-h-[350px] shrink-0">
                            <img src={selectedMember.image} alt={selectedMember.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90"></div>
                            
                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <div className="inline-block px-3 py-1 bg-brand-secondary text-white text-xs font-bold uppercase tracking-widest rounded-full mb-3 shadow-lg">
                                    {selectedMember.role}
                                </div>
                                <h2 className="text-4xl md:text-5xl font-heading font-bold text-white leading-tight mb-2">
                                    {selectedMember.name}
                                </h2>
                                <div className="flex items-center gap-4 text-slate-300 text-sm font-medium">
                                    <span className="flex items-center gap-1"><Award size={16} className="text-brand-primary" /> {selectedMember.experience} Exp</span>
                                    <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                                    <span className="flex items-center gap-1"><Globe size={16} className="text-brand-primary" /> {selectedMember.languages.length} Languages</span>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-8 flex-grow">
                             <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Professional Bio</h3>
                                <p className="text-slate-600 leading-relaxed text-lg font-light">
                                    "{selectedMember.bio}"
                                </p>
                             </div>

                             <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Areas of Expertise</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedMember.specialization.map((tag: string) => (
                                        <span key={tag} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium text-sm hover:border-brand-primary hover:text-brand-primary transition-colors cursor-default">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                             </div>

                             <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                                    <div className="text-blue-500 mb-2"><TrendingUp size={24} /></div>
                                    <div className="text-2xl font-bold text-slate-900">150+</div>
                                    <div className="text-xs text-slate-500 font-bold uppercase mt-1">Deals Closed</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100">
                                    <div className="text-orange-500 mb-2"><Users size={24} /></div>
                                    <div className="text-2xl font-bold text-slate-900">4.9/5</div>
                                    <div className="text-xs text-slate-500 font-bold uppercase mt-1">Client Rating</div>
                                </div>
                             </div>
                        </div>

                        {/* Sticky Action Footer */}
                        <div className="p-6 border-t border-slate-100 bg-white sticky bottom-0 z-10 flex gap-4">
                             <a 
                                href={`mailto:${selectedMember.email}`} 
                                className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center hover:bg-brand-primary transition shadow-lg transform active:scale-95 duration-200"
                             >
                                <Mail className="mr-2" size={20} /> Email
                             </a>
                             <a 
                                href={`tel:${selectedMember.phone}`} 
                                className="flex-1 bg-white border-2 border-slate-200 text-slate-900 py-4 rounded-xl font-bold flex items-center justify-center hover:border-brand-primary hover:text-brand-primary transition shadow-sm transform active:scale-95 duration-200"
                             >
                                <Phone className="mr-2" size={20} /> Call
                             </a>
                        </div>
                    </div>
                </div>
            )}

            {/* CTA */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                 <div className="bg-brand-primary rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-heading font-bold mb-4">Ready to start your journey?</h2>
                        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">Whether you are buying your first home or investing in commercial real estate, our team is here to guide you.</p>
                        <button onClick={() => navigate('/contact')} className="bg-white text-brand-primary px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-50 transition transform hover:-translate-y-1">Get in Touch</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Modern Contact Page
const Contact = () => (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-heading font-bold text-slate-900 mb-4">Contact Us</h1>
                <p className="text-slate-600">We'd love to hear from you. Drop us a line or visit our office.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-white p-10 shadow-soft rounded-3xl border border-slate-100">
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">First Name</label>
                                <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none transition" placeholder="John" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Last Name</label>
                                <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none transition" placeholder="Doe" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Email</label>
                            <input type="email" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none transition" placeholder="john@example.com" />
                        </div>
                        <div className="space-y-2">
                             <label className="text-sm font-bold text-slate-700">Message</label>
                            <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl h-40 focus:border-brand-primary outline-none transition resize-none" placeholder="Tell us about your property needs..."></textarea>
                        </div>
                        <button className="w-full bg-brand-primary text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-lg">Send Message</button>
                    </form>
                </div>

                <div className="space-y-8">
                    <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
                        <h3 className="text-xl font-heading font-bold text-slate-900 mb-6">Contact Information</h3>
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-primary shadow-sm mr-4">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">Office Location</p>
                                    <p className="text-slate-600 text-sm mt-1">2nd Floor, City Centre, Bank More,<br/>Dhanbad, Jharkhand 826001</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-primary shadow-sm mr-4">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">Phone</p>
                                    <p className="text-slate-600 text-sm mt-1">+91 98765 43210</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-primary shadow-sm mr-4">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">Email</p>
                                    <p className="text-slate-600 text-sm mt-1">hello@shreeshyamcity.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Modern Blog Page
const Blog = () => {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedArea, setSelectedArea] = useState<any>(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await blogAPI.getAll();
                setBlogs(response.data.results || response.data || []);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const trends = blogs.filter(b => b.category === 'property_trends');
    const schemes = blogs.filter(b => b.category === 'government_schemes');
    const areas = blogs.filter(b => b.category === 'area_guides');

    // Investment Tips (static content)
    const tips = [
        {
            title: 'First-Time Home Buyer Checklist',
            content: 'Understand your budget, check your credit score, and get pre-approved for a loan. Always verify the RERA registration number.',
            icon: <CheckCircle2 size={32} />
        },
        {
            title: 'Carpet Area vs Super Built-up',
            content: 'Don’t pay for what you don’t get. Carpet area is the actual usable space, while super built-up includes common areas.',
            icon: <Building2 size={32} />
        },
        {
            title: 'Legal Due Diligence',
            content: 'Ensure the property has a clear title, is free from litigation, and has all necessary municipal approvals before signing.',
            icon: <Award size={32} />
        },
        {
            title: 'Location Analysis',
            content: 'Look for future infrastructure developments. Proximity to schools and hospitals significantly impacts appreciation.',
            icon: <MapPin size={32} />
        },
        {
            title: 'Rental Yield Calculation',
            content: 'For investors, calculating rental yield is crucial. Dhanbad averages 3-4% rental yield for residential properties.',
            icon: <BadgePercent size={32} />
        },
        {
            title: 'Tax Benefits',
            content: 'Learn about deductions under Section 80C and 24(b) of the Income Tax Act on principal and interest repayment.',
            icon: <Coins size={32} />
        }
    ];

    // Lock body scroll when modal is open
    useEffect(() => {
        if (selectedArea) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedArea]);

    return (
        <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
             {/* Area Guide Modal */}
             {selectedArea && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                        onClick={() => setSelectedArea(null)}
                    ></div>
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 animate-in fade-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => setSelectedArea(null)}
                            className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full z-20 text-white transition-all"
                        >
                            <X size={24} />
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {/* Image Side */}
                            <div className="h-64 md:h-auto relative">
                                <img src={selectedArea.image} alt={selectedArea.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-8 text-white">
                                    <h2 className="text-4xl font-heading font-bold">{selectedArea.title}</h2>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="p-8">
                                <div className="mb-8">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Overview</h3>
                                    <p className="text-slate-600 leading-relaxed text-lg">{selectedArea.short_description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="text-slate-400 text-xs font-bold uppercase mb-1">Avg Price</div>
                                        <div className="text-lg font-bold text-brand-primary">{selectedArea.avg_price || 'N/A'}</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="text-slate-400 text-xs font-bold uppercase mb-1">Rental Yield</div>
                                        <div className="text-lg font-bold text-brand-secondary">{selectedArea.rental_yield || 'N/A'}</div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {selectedArea.key_landmarks && selectedArea.key_landmarks.length > 0 && (
                                        <div className="flex items-start">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 text-brand-primary flex items-center justify-center shrink-0 mr-4">
                                                <Landmark size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">Key Landmarks</h4>
                                                <p className="text-slate-600 text-sm">{selectedArea.key_landmarks.join(', ')}</p>
                                            </div>
                                        </div>
                                    )}
                                    {selectedArea.connectivity && (
                                        <div className="flex items-start">
                                            <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0 mr-4">
                                                <Bus size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">Connectivity</h4>
                                                <p className="text-slate-600 text-sm">{selectedArea.connectivity}</p>
                                            </div>
                                        </div>
                                    )}
                                    {selectedArea.lifestyle && (
                                        <div className="flex items-start">
                                            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mr-4">
                                                <ShoppingBag size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">Lifestyle</h4>
                                                <p className="text-slate-600 text-sm">{selectedArea.lifestyle}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-100">
                                    <button 
                                        onClick={() => {setSelectedArea(null); window.scrollTo({ top: 0, behavior: 'smooth' });}}
                                        className="w-full bg-brand-primary text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition"
                                    >
                                        Explore Properties in {selectedArea.title}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
                <span className="text-brand-primary font-bold tracking-wider uppercase text-sm bg-blue-50 px-4 py-1.5 rounded-full">Knowledge Hub</span>
                <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 mt-6 mb-6">Real Estate Insights</h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
                    Your comprehensive guide to the Dhanbad property market. From latest trends to legal advice, we have got you covered.
                </p>
            </div>

            {/* SECTION 1: MARKET TRENDS */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <div className="flex items-center gap-3 mb-10">
                    <div className="p-3 bg-blue-100 text-brand-primary rounded-xl">
                        <TrendingUp size={28} />
                    </div>
                    <h2 className="text-3xl font-heading font-bold text-slate-900">Property Trends in Dhanbad</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {loading ? (
                        <div className="col-span-4 text-center py-10 text-slate-500">Loading...</div>
                    ) : trends.length === 0 ? (
                        <div className="col-span-4 text-center py-10 text-slate-400">No property trends available</div>
                    ) : (
                        trends.map((item, idx) => (
                            <div key={idx} className="bg-white rounded-[2rem] overflow-hidden shadow-soft group cursor-pointer border border-slate-100 hover:shadow-2xl transition-all duration-300 flex flex-col h-full">
                                <div className="h-48 overflow-hidden relative">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center text-slate-400 text-xs font-bold mb-3 space-x-2">
                                        <span>{item.date || 'N/A'}</span>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                        <span>{item.time_to_read || '5 min read'}</span>
                                    </div>
                                    <h3 className="text-lg font-bold font-heading text-slate-900 mb-3 group-hover:text-brand-primary transition-colors">{item.title}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-grow">{item.short_description}</p>
                                    <div className="flex items-center gap-2 mt-auto">
                                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                                            {item.writer ? item.writer.charAt(0) : 'A'}
                                        </div>
                                        <span className="text-xs font-bold text-slate-700">{item.writer || 'Admin'}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* SECTION 2: INVESTMENT TIPS */}
            <div className="bg-slate-900 py-24 mb-24 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-secondary/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="text-brand-secondary" size={24} />
                                <span className="text-brand-secondary font-bold tracking-wider uppercase text-sm">Expert Advice</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mt-2">Smart Investment Tips</h2>
                        </div>
                        <p className="text-slate-400 max-w-md text-right md:text-left">
                            Essential guidelines to help you make informed decisions and maximize your real estate returns.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tips.map((tip, idx) => (
                            <div key={idx} className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition duration-300 group">
                                <div className="flex flex-col h-full">
                                    <div className="p-4 bg-white/10 text-brand-secondary rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        {tip.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-secondary transition-colors">{tip.title}</h3>
                                        <p className="text-slate-300 leading-relaxed text-sm">{tip.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SECTION 3: HOUSING SCHEMES */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <div className="flex items-center gap-3 mb-10">
                    <div className="p-3 bg-orange-100 text-brand-secondary rounded-xl">
                        <Landmark size={28} />
                    </div>
                    <h2 className="text-3xl font-heading font-bold text-slate-900">Government Housing Schemes</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="col-span-3 text-center py-10 text-white">Loading...</div>
                    ) : schemes.length === 0 ? (
                        <div className="col-span-3 text-center py-10 text-slate-400">No government schemes available</div>
                    ) : (
                        schemes.map((scheme, idx) => (
                            <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-soft border border-slate-100 flex flex-col h-full">
                                <div className="h-56 relative">
                                    <img src={scheme.image} alt={scheme.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-8 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold font-heading text-slate-900 mb-3">{scheme.title}</h3>
                                    <p className="text-slate-600 leading-relaxed mb-6 text-sm flex-grow">{scheme.short_description}</p>
                                    {scheme.link && (
                                        <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="self-start text-brand-primary font-bold flex items-center hover:underline group">
                                            Learn Eligibility <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* SECTION 4: AREA GUIDES */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 mb-10">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                        <Map size={28} />
                    </div>
                    <h2 className="text-3xl font-heading font-bold text-slate-900">Area Guides</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                    {loading ? (
                        <div className="col-span-6 text-center py-10 text-slate-500">Loading...</div>
                    ) : areas.length === 0 ? (
                        <div className="col-span-6 text-center py-10 text-slate-400">No area guides available</div>
                    ) : (
                        areas.map((area, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => setSelectedArea(area)}
                                className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer shadow-lg"
                            >
                                <img src={area.image} alt={area.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                                
                                <div className="absolute bottom-0 left-0 p-5 w-full transform transition-all duration-300 group-hover:-translate-y-2">
                                    <h3 className="text-xl font-heading font-bold text-white mb-2">{area.title}</h3>
                                    <div className="flex items-center text-slate-200 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                                        Explore <ArrowRight size={14} className="ml-1" />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Final CTA */}
            <div className="max-w-4xl mx-auto px-4 mt-24 text-center">
                <div className="p-12 bg-blue-50 rounded-[3rem] border border-blue-100">
                    <h2 className="text-3xl font-heading font-bold text-slate-900 mb-4">Have specific questions?</h2>
                    <p className="text-slate-600 mb-8 max-w-lg mx-auto">Our experts are here to help you navigate the complexities of real estate.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">Ask an Expert</button>
                        <button className="bg-white text-slate-700 border border-slate-200 px-8 py-3 rounded-xl font-bold hover:bg-slate-50 transition">Read FAQs</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin') || location.pathname.startsWith('/agents') || location.pathname === '/login';

    return (
        <div className="flex flex-col min-h-screen font-sans">
            {!isAdmin && <Navbar />}
            <main className="flex-grow">
                {children}
            </main>
            {!isAdmin && <Footer />}
        </div>
    );
}

const App: React.FC = () => {
  return (
    <Router>
         <ScrollToTop />
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/properties" element={<Listing />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/agents" element={<AgentPortal />} />
            </Routes>
        </Layout>
    </Router>
  );
};

export default App;