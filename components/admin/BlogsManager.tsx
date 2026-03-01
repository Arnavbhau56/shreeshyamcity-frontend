import React, { useState } from 'react';
import { Plus, X, Save, Edit, Trash2, FileText, ExternalLink, MapPin, TrendingUp, Landmark } from 'lucide-react';
import { blogAPI } from '../../api';
import Swal from 'sweetalert2';

interface Blog {
    id: string;
    category: 'property_trends' | 'government_schemes' | 'area_guides';
    image: string;
    title: string;
    short_description: string;
    description?: string;
    link?: string;
    lifestyle?: string;
    connectivity?: string;
    key_landmarks?: string[];
    avg_price?: string;
    rental_yield?: string;
    date?: string;
    time_to_read?: string;
    writer?: string;
}

interface BlogsManagerProps {
    blogs: Blog[];
    onUpdate: () => void;
}

const INITIAL_FORM = {
    category: 'property_trends' as const,
    image: '',
    title: '',
    short_description: '',
    description: '',
    link: '',
    lifestyle: '',
    connectivity: '',
    key_landmarks: [] as string[],
    avg_price: '',
    rental_yield: '',
    date: '',
    time_to_read: '',
    writer: ''
};

export const BlogsManager: React.FC<BlogsManagerProps> = ({ blogs, onUpdate }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [landmarkInput, setLandmarkInput] = useState('');

    const handleEdit = (blog: Blog) => {
        setEditId(blog.id);
        setFormData({
            category: blog.category,
            image: blog.image,
            title: blog.title,
            short_description: blog.short_description,
            description: blog.description || '',
            link: blog.link || '',
            lifestyle: blog.lifestyle || '',
            connectivity: blog.connectivity || '',
            key_landmarks: blog.key_landmarks || [],
            avg_price: blog.avg_price || '',
            rental_yield: blog.rental_yield || '',
            date: blog.date || '',
            time_to_read: blog.time_to_read || '',
            writer: blog.writer || ''
        });
        setIsAdding(true);
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Delete Blog?',
            text: 'Are you sure you want to delete this blog post?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2563EB',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await blogAPI.delete(id);
                Swal.fire('Deleted!', 'Blog has been deleted.', 'success');
                onUpdate();
            } catch (error) {
                console.error('Error deleting blog:', error);
                Swal.fire('Error!', 'Failed to delete blog', 'error');
            }
        }
    };

    const handleSave = async () => {
        if (!formData.title || !formData.image || !formData.short_description) {
            Swal.fire('Missing Fields', 'Please fill in required fields (Title, Image, Short Description)', 'warning');
            return;
        }

        const payload: any = {
            category: formData.category,
            image: formData.image,
            title: formData.title,
            short_description: formData.short_description
        };

        // Add category-specific fields
        if (formData.category === 'property_trends') {
            payload.description = formData.description;
            payload.date = formData.date;
            payload.time_to_read = formData.time_to_read;
            payload.writer = formData.writer;
        } else if (formData.category === 'government_schemes') {
            payload.link = formData.link;
        } else if (formData.category === 'area_guides') {
            payload.lifestyle = formData.lifestyle;
            payload.connectivity = formData.connectivity;
            payload.key_landmarks = formData.key_landmarks;
            payload.avg_price = formData.avg_price;
            payload.rental_yield = formData.rental_yield;
        }

        try {
            if (editId) {
                await blogAPI.update(editId, payload);
                Swal.fire('Updated!', 'Blog has been updated successfully.', 'success');
            } else {
                await blogAPI.create(payload);
                Swal.fire('Created!', 'Blog has been created successfully.', 'success');
            }
            setIsAdding(false);
            setFormData(INITIAL_FORM);
            setEditId(null);
            onUpdate();
        } catch (error) {
            console.error('Error saving blog:', error);
            Swal.fire('Error!', 'Failed to save blog. Please try again.', 'error');
        }
    };

    const addLandmark = () => {
        if (landmarkInput.trim() && !formData.key_landmarks.includes(landmarkInput.trim())) {
            setFormData({ ...formData, key_landmarks: [...formData.key_landmarks, landmarkInput.trim()] });
            setLandmarkInput('');
        }
    };

    const removeLandmark = (landmark: string) => {
        setFormData({ ...formData, key_landmarks: formData.key_landmarks.filter(l => l !== landmark) });
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'property_trends': return <TrendingUp size={16} />;
            case 'government_schemes': return <Landmark size={16} />;
            case 'area_guides': return <MapPin size={16} />;
            default: return <FileText size={16} />;
        }
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'property_trends': return 'Property Trends';
            case 'government_schemes': return 'Government Schemes';
            case 'area_guides': return 'Area Guides';
            default: return category;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-slate-900">Blog Management</h1>
                    <p className="text-slate-500 text-sm">Manage insights, trends, and area guides.</p>
                </div>
                <button
                    onClick={() => {
                        setIsAdding(!isAdding);
                        setEditId(null);
                        setFormData(INITIAL_FORM);
                    }}
                    className="w-full sm:w-auto bg-brand-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center shadow-lg shadow-brand-primary/30"
                >
                    {isAdding ? <X size={20} className="mr-2" /> : <Plus size={20} className="mr-2" />}
                    {isAdding ? 'Cancel' : 'Add Blog'}
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-8 rounded-2xl shadow-soft border border-slate-100 animate-in slide-in-from-top-4 duration-300">
                    <h3 className="text-lg font-bold mb-6 text-slate-800 border-b border-slate-100 pb-2">
                        {editId ? 'Edit Blog' : 'Add New Blog'}
                    </h3>

                    {/* Step 1: Category Selection */}
                    <div className="mb-6">
                        <h4 className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-4">Step 1: Select Category</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className={`p-6 border-2 rounded-xl cursor-pointer transition ${formData.category === 'property_trends' ? 'border-brand-primary bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                <input
                                    type="radio"
                                    name="category"
                                    value="property_trends"
                                    checked={formData.category === 'property_trends'}
                                    onChange={(e) => setFormData({ ...INITIAL_FORM, category: e.target.value as any })}
                                    className="sr-only"
                                />
                                <div className="flex items-center gap-3 mb-2">
                                    <TrendingUp className="text-brand-primary" size={24} />
                                    <span className="font-bold text-slate-800">Property Trends</span>
                                </div>
                                <p className="text-xs text-slate-500">Market insights and trends in Dhanbad</p>
                            </label>

                            <label className={`p-6 border-2 rounded-xl cursor-pointer transition ${formData.category === 'government_schemes' ? 'border-brand-primary bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                <input
                                    type="radio"
                                    name="category"
                                    value="government_schemes"
                                    checked={formData.category === 'government_schemes'}
                                    onChange={(e) => setFormData({ ...INITIAL_FORM, category: e.target.value as any })}
                                    className="sr-only"
                                />
                                <div className="flex items-center gap-3 mb-2">
                                    <Landmark className="text-brand-secondary" size={24} />
                                    <span className="font-bold text-slate-800">Govt. Schemes</span>
                                </div>
                                <p className="text-xs text-slate-500">Housing schemes and subsidies</p>
                            </label>

                            <label className={`p-6 border-2 rounded-xl cursor-pointer transition ${formData.category === 'area_guides' ? 'border-brand-primary bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                <input
                                    type="radio"
                                    name="category"
                                    value="area_guides"
                                    checked={formData.category === 'area_guides'}
                                    onChange={(e) => setFormData({ ...INITIAL_FORM, category: e.target.value as any })}
                                    className="sr-only"
                                />
                                <div className="flex items-center gap-3 mb-2">
                                    <MapPin className="text-emerald-600" size={24} />
                                    <span className="font-bold text-slate-800">Area Guides</span>
                                </div>
                                <p className="text-xs text-slate-500">Locality reviews and analysis</p>
                            </label>
                        </div>
                    </div>

                    {/* Step 2: Common Fields */}
                    <div className="mb-6 border-t border-slate-100 pt-6">
                        <h4 className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-4">Step 2: Basic Information</h4>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Image URL <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Title <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter blog title"
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Short Description <span className="text-red-500">*</span></label>
                                <textarea
                                    value={formData.short_description}
                                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                                    placeholder="Brief description (excerpt)"
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none h-24"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Category-Specific Fields */}
                    <div className="mb-6 border-t border-slate-100 pt-6">
                        <h4 className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-4">Step 3: Additional Details</h4>

                        {/* Property Trends Fields */}
                        {formData.category === 'property_trends' && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Full Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Detailed article content..."
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none h-40"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Date</label>
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Time to Read</label>
                                        <input
                                            type="text"
                                            value={formData.time_to_read}
                                            onChange={(e) => setFormData({ ...formData, time_to_read: e.target.value })}
                                            placeholder="5 min read"
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Writer</label>
                                        <input
                                            type="text"
                                            value={formData.writer}
                                            onChange={(e) => setFormData({ ...formData, writer: e.target.value })}
                                            placeholder="Author name"
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Government Schemes Fields */}
                        {formData.category === 'government_schemes' && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Eligibility Link</label>
                                <input
                                    type="url"
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    placeholder="https://example.com/eligibility"
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none"
                                />
                                <p className="text-xs text-slate-500">Link for "Learn Eligibility" button</p>
                            </div>
                        )}

                        {/* Area Guides Fields */}
                        {formData.category === 'area_guides' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Lifestyle</label>
                                        <textarea
                                            value={formData.lifestyle}
                                            onChange={(e) => setFormData({ ...formData, lifestyle: e.target.value })}
                                            placeholder="Describe the lifestyle..."
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none h-24"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Connectivity</label>
                                        <textarea
                                            value={formData.connectivity}
                                            onChange={(e) => setFormData({ ...formData, connectivity: e.target.value })}
                                            placeholder="Transport and connectivity info..."
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none h-24"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Key Landmarks</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={landmarkInput}
                                            onChange={(e) => setLandmarkInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLandmark())}
                                            placeholder="Add landmark and press Enter"
                                            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={addLandmark}
                                            className="px-4 py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-blue-700"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.key_landmarks.map((landmark, idx) => (
                                            <span key={idx} className="bg-brand-primary text-white text-sm px-3 py-1 rounded-full flex items-center">
                                                {landmark}
                                                <button onClick={() => removeLandmark(landmark)} className="ml-2 hover:text-red-200">
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Avg. Price</label>
                                        <input
                                            type="text"
                                            value={formData.avg_price}
                                            onChange={(e) => setFormData({ ...formData, avg_price: e.target.value })}
                                            placeholder="₹3,500 - ₹4,500 / sqft"
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Rental Yield</label>
                                        <input
                                            type="text"
                                            value={formData.rental_yield}
                                            onChange={(e) => setFormData({ ...formData, rental_yield: e.target.value })}
                                            placeholder="3.5%"
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                        <button
                            onClick={() => {
                                setIsAdding(false);
                                setFormData(INITIAL_FORM);
                                setEditId(null);
                            }}
                            className="px-6 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-3 rounded-xl bg-brand-primary text-white font-bold hover:bg-blue-700 shadow-lg flex items-center"
                        >
                            <Save size={18} className="mr-2" /> Save Blog
                        </button>
                    </div>
                </div>
            )}

            {/* Blogs List */}
            <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                            <tr>
                                <th className="p-5">Blog</th>
                                <th className="p-5">Category</th>
                                <th className="p-5">Created</th>
                                <th className="p-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {blogs.map(blog => (
                                <tr key={blog.id} className="hover:bg-slate-50 transition">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <img src={blog.image} className="w-16 h-16 rounded-lg object-cover" alt="blog" />
                                            <div>
                                                <span className="font-bold text-slate-800 text-sm block">{blog.title}</span>
                                                <span className="text-xs text-slate-500 line-clamp-1">{blog.short_description}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                                            {getCategoryIcon(blog.category)}
                                            {getCategoryLabel(blog.category)}
                                        </span>
                                    </td>
                                    <td className="p-5 text-sm text-slate-600">
                                        {blog.date || 'N/A'}
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(blog)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(blog.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                            >
                                                <Trash2 size={18} />
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
                    {blogs.map(blog => (
                        <div key={blog.id} className="p-4">
                            <div className="flex gap-3 mb-3">
                                <img src={blog.image} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" alt="blog" />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-800 text-sm mb-1 line-clamp-2">{blog.title}</h3>
                                    <p className="text-xs text-slate-500 line-clamp-2 mb-2">{blog.short_description}</p>
                                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                                        {getCategoryIcon(blog.category)}
                                        {getCategoryLabel(blog.category)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-3 border-t border-slate-100">
                                <button onClick={() => handleEdit(blog)} className="flex-1 p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-sm font-medium">
                                    <Edit size={14} className="inline mr-1" /> Edit
                                </button>
                                <button onClick={() => handleDelete(blog.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
