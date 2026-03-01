import React, { useState, useEffect } from 'react';
import { Customer } from '../types';
import { customerAPI } from '../api';
import { 
    Search, Filter, MoreVertical, Phone, Mail, MapPin, 
    DollarSign, Home, Clock, CheckCircle2, X, User, 
    ChevronRight, CreditCard, FileText, Calendar, Download, Plus, Edit, Trash2
} from 'lucide-react';
import Swal from 'sweetalert2';

export const AdminCustomers: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ 
        name: '', email: '', phone: '', address: '', status: 'Active', notes: '', avatar_url: '', total_paid: '0', pending_amount: '0',
        properties_bought: [] as any[],
        payment_history: [] as any[]
    });

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await customerAPI.getAll();
            setCustomers(response.data.results || response.data || []);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const handleExport = async () => {
        try {
            const response = await customerAPI.exportCSV();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'customers.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            Swal.fire('Error!', 'Failed to export', 'error');
        }
    };

    const handleSave = async () => {
        try {
            if (editId) {
                await customerAPI.update(editId, form);
            } else {
                await customerAPI.create(form);
            }
            setIsFormOpen(false);
            setEditId(null);
            setForm({ name: '', email: '', phone: '', address: '', status: 'Active', notes: '', avatar_url: '', total_paid: '0', pending_amount: '0', properties_bought: [], payment_history: [] });
            fetchCustomers();
            Swal.fire('Success!', 'Customer saved', 'success');
        } catch (error) {
            Swal.fire('Error!', 'Failed to save', 'error');
        }
    };

    const handleEdit = (customer: any) => {
        setEditId(customer.id);
        setForm({ 
            name: customer.name, 
            email: customer.email, 
            phone: customer.phone, 
            address: customer.address, 
            status: customer.status, 
            notes: customer.notes || '',
            avatar_url: customer.avatar_url || '',
            total_paid: customer.total_paid?.toString() || '0',
            pending_amount: customer.pending_amount?.toString() || '0',
            properties_bought: customer.properties_bought || [],
            payment_history: customer.payment_history || []
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({ title: 'Delete Customer?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#2563EB' });
        if (result.isConfirmed) {
            try {
                await customerAPI.delete(id);
                fetchCustomers();
                Swal.fire('Deleted!', '', 'success');
            } catch (error) {
                Swal.fire('Error!', 'Failed to delete', 'error');
            }
        }
    };

    const filteredCustomers = customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
    );

    const handleViewDetails = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCustomer(null);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-slate-900">Customer Management</h1>
                    <p className="text-slate-500 text-sm">View and manage customer details and history.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button onClick={() => setIsFormOpen(true)} className="bg-brand-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 flex items-center">
                        <Plus size={20} className="mr-2" /> Add Customer
                    </button>
                    <button onClick={handleExport} className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-green-700 flex items-center">
                        <Download size={20} className="mr-2" /> Export CSV
                    </button>
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search customers..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-brand-primary outline-none shadow-sm"
                        />
                    </div>
                    <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-brand-primary shadow-sm">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {isFormOpen && (
                <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100 mb-6">
                    <h3 className="text-lg font-bold mb-4">{editId ? 'Edit Customer' : 'Add New Customer'}</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="p-3 bg-slate-50 border border-slate-200 rounded-xl" />
                        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="p-3 bg-slate-50 border border-slate-200 rounded-xl" />
                        <input type="text" placeholder="Phone" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="p-3 bg-slate-50 border border-slate-200 rounded-xl" />
                        <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="VIP">VIP</option>
                        </select>
                        <input type="text" placeholder="Address" value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} className="p-3 bg-slate-50 border border-slate-200 rounded-xl col-span-2" />
                        <input type="text" placeholder="Avatar URL" value={form.avatar_url} onChange={(e) => setForm({...form, avatar_url: e.target.value})} className="p-3 bg-slate-50 border border-slate-200 rounded-xl col-span-2" />
                        <input type="number" placeholder="Total Paid (in Lakhs)" value={form.total_paid} onChange={(e) => setForm({...form, total_paid: e.target.value})} className="p-3 bg-slate-50 border border-slate-200 rounded-xl" />
                        <input type="number" placeholder="Pending Amount (in Lakhs)" value={form.pending_amount} onChange={(e) => setForm({...form, pending_amount: e.target.value})} className="p-3 bg-slate-50 border border-slate-200 rounded-xl" />
                    </div>
                    <textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4 h-24"></textarea>
                    
                    <div className="mb-4">
                        <h4 className="font-bold mb-2">Properties Bought</h4>
                        {form.properties_bought.map((prop, idx) => (
                            <div key={idx} className="flex gap-2 mb-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                                <input type="text" placeholder="Property ID" value={prop.property_id || ''} onChange={(e) => {
                                    const updated = [...form.properties_bought];
                                    updated[idx] = {...updated[idx], property_id: e.target.value};
                                    setForm({...form, properties_bought: updated});
                                }} className="flex-1 p-2 bg-white border border-slate-200 rounded-lg" />
                                <input type="text" placeholder="Title" value={prop.title || ''} onChange={(e) => {
                                    const updated = [...form.properties_bought];
                                    updated[idx] = {...updated[idx], title: e.target.value};
                                    setForm({...form, properties_bought: updated});
                                }} className="flex-1 p-2 bg-white border border-slate-200 rounded-lg" />
                                <input type="number" placeholder="Price" value={prop.price || ''} onChange={(e) => {
                                    const updated = [...form.properties_bought];
                                    updated[idx] = {...updated[idx], price: e.target.value};
                                    setForm({...form, properties_bought: updated});
                                }} className="w-32 p-2 bg-white border border-slate-200 rounded-lg" />
                                <input type="date" value={prop.date || ''} onChange={(e) => {
                                    const updated = [...form.properties_bought];
                                    updated[idx] = {...updated[idx], date: e.target.value};
                                    setForm({...form, properties_bought: updated});
                                }} className="w-40 p-2 bg-white border border-slate-200 rounded-lg" />
                                <button onClick={() => setForm({...form, properties_bought: form.properties_bought.filter((_, i) => i !== idx)})} className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">×</button>
                            </div>
                        ))}
                        <button onClick={() => setForm({...form, properties_bought: [...form.properties_bought, {property_id: '', title: '', price: '', date: ''}]})} className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 font-bold">+ Add Property</button>
                    </div>
                    
                    <div className="mb-4">
                        <h4 className="font-bold mb-2">Payment History</h4>
                        {form.payment_history.map((pay, idx) => (
                            <div key={idx} className="flex gap-2 mb-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                                <input type="number" placeholder="Amount" value={pay.amount || ''} onChange={(e) => {
                                    const updated = [...form.payment_history];
                                    updated[idx] = {...updated[idx], amount: e.target.value};
                                    setForm({...form, payment_history: updated});
                                }} className="w-32 p-2 bg-white border border-slate-200 rounded-lg" />
                                <input type="date" value={pay.date || ''} onChange={(e) => {
                                    const updated = [...form.payment_history];
                                    updated[idx] = {...updated[idx], date: e.target.value};
                                    setForm({...form, payment_history: updated});
                                }} className="w-40 p-2 bg-white border border-slate-200 rounded-lg" />
                                <input type="text" placeholder="Description" value={pay.description || ''} onChange={(e) => {
                                    const updated = [...form.payment_history];
                                    updated[idx] = {...updated[idx], description: e.target.value};
                                    setForm({...form, payment_history: updated});
                                }} className="flex-1 p-2 bg-white border border-slate-200 rounded-lg" />
                                <select value={pay.status || 'Paid'} onChange={(e) => {
                                    const updated = [...form.payment_history];
                                    updated[idx] = {...updated[idx], status: e.target.value};
                                    setForm({...form, payment_history: updated});
                                }} className="w-32 p-2 bg-white border border-slate-200 rounded-lg">
                                    <option value="Paid">Paid</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Failed">Failed</option>
                                </select>
                                <button onClick={() => setForm({...form, payment_history: form.payment_history.filter((_, i) => i !== idx)})} className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">×</button>
                            </div>
                        ))}
                        <button onClick={() => setForm({...form, payment_history: [...form.payment_history, {amount: '', date: '', description: '', status: 'Paid'}]})} className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 font-bold">+ Add Payment</button>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => { setIsFormOpen(false); setEditId(null); }} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-brand-primary text-white rounded-xl font-bold">Save Customer</button>
                    </div>
                </div>
            )}

            {/* Customer Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCustomers.map(customer => (
                    <div key={customer.id} className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden hover:shadow-lg transition group">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                                        {customer.avatar_url ? (
                                            <img src={customer.avatar_url} alt={customer.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="text-slate-400" size={24} />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{customer.name}</h3>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                            customer.status === 'VIP' ? 'bg-purple-100 text-purple-700' :
                                            customer.status === 'Active' ? 'bg-green-100 text-green-700' :
                                            'bg-slate-100 text-slate-600'
                                        }`}>
                                            {customer.status}
                                        </span>
                                    </div>
                                </div>
                                <button onClick={() => { handleEdit(customer); }} className="text-slate-400 hover:text-slate-600">
                                    <Edit size={20} />
                                </button>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center text-sm text-slate-600">
                                    <Mail size={16} className="mr-3 text-slate-400" />
                                    <span className="truncate">{customer.email}</span>
                                </div>
                                <div className="flex items-center text-sm text-slate-600">
                                    <Phone size={16} className="mr-3 text-slate-400" />
                                    <span>{customer.phone}</span>
                                </div>
                                <div className="flex items-center text-sm text-slate-600">
                                    <MapPin size={16} className="mr-3 text-slate-400" />
                                    <span className="truncate">{customer.address}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Properties Bought</p>
                                    <p className="font-bold text-slate-900">{(customer.properties_bought || []).length}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Total Paid</p>
                                    <p className="font-bold text-brand-primary">₹{((customer.total_paid || 0) / 100000).toFixed(1)} L</p>
                                </div>
                            </div>

                            <button 
                                onClick={() => handleViewDetails(customer)}
                                className="w-full py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-brand-primary hover:text-brand-primary transition flex items-center justify-center group-hover:shadow-md"
                            >
                                View Details <ChevronRight size={18} className="ml-2" />
                            </button>
                            <button 
                                onClick={() => handleDelete(customer.id)}
                                className="w-full py-2 mt-2 bg-red-50 border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-100 transition flex items-center justify-center"
                            >
                                <Trash2 size={16} className="mr-2" /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Customer Details Modal */}
            {isModalOpen && selectedCustomer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                                    {selectedCustomer.avatar_url ? (
                                        <img src={selectedCustomer.avatar_url} alt={selectedCustomer.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="text-slate-400" size={32} />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-heading font-bold text-slate-900">{selectedCustomer.name}</h2>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                            selectedCustomer.status === 'VIP' ? 'bg-purple-100 text-purple-700' :
                                            selectedCustomer.status === 'Active' ? 'bg-green-100 text-green-700' :
                                            'bg-slate-100 text-slate-600'
                                        }`}>
                                            {selectedCustomer.status}
                                        </span>
                                        <span>• Customer ID: {selectedCustomer.id}</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={closeModal}
                                className="p-2 bg-white rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition shadow-sm border border-slate-100"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column: Contact & Summary */}
                                <div className="space-y-6">
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <h3 className="font-bold text-slate-900 mb-4 flex items-center"><User size={18} className="mr-2 text-brand-primary"/> Contact Info</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <Mail size={18} className="text-slate-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-slate-500">Email Address</p>
                                                    <p className="text-sm font-medium text-slate-900">{selectedCustomer.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Phone size={18} className="text-slate-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-slate-500">Phone Number</p>
                                                    <p className="text-sm font-medium text-slate-900">{selectedCustomer.phone}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <MapPin size={18} className="text-slate-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-slate-500">Address</p>
                                                    <p className="text-sm font-medium text-slate-900">{selectedCustomer.address}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <h3 className="font-bold text-slate-900 mb-4 flex items-center"><FileText size={18} className="mr-2 text-brand-primary"/> Notes</h3>
                                        <p className="text-sm text-slate-600 italic leading-relaxed">
                                            "{selectedCustomer.notes}"
                                        </p>
                                    </div>
                                </div>

                                {/* Right Column: Properties & Payments */}
                                <div className="lg:col-span-2 space-y-8">
                                    {/* Financial Summary */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                            <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Total Paid</p>
                                            <p className="text-2xl font-bold text-green-700">₹{((selectedCustomer.total_paid || 0) / 100000).toFixed(2)} L</p>
                                        </div>
                                        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                                            <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Pending</p>
                                            <p className="text-2xl font-bold text-red-700">₹{((selectedCustomer.pending_amount || 0) / 100000).toFixed(2)} L</p>
                                        </div>
                                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Properties</p>
                                            <p className="text-2xl font-bold text-blue-700">{(selectedCustomer.properties_bought || []).length}</p>
                                        </div>
                                    </div>

                                    {/* Properties Section */}
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-4 flex items-center"><Home size={20} className="mr-2 text-brand-primary"/> Property Portfolio</h3>
                                        
                                        {(selectedCustomer.properties_bought || []).length > 0 && (
                                            <div className="mb-6">
                                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 ml-1">Purchased Properties</h4>
                                                <div className="space-y-3">
                                                    {selectedCustomer.properties_bought.map((prop, idx) => (
                                                        <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                                                    <CheckCircle2 size={20} />
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-slate-900">{prop.title}</p>
                                                                    <p className="text-xs text-slate-500">Purchased on {prop.date}</p>
                                                                </div>
                                                            </div>
                                                            <p className="font-bold text-slate-900">₹{(prop.price / 100000).toFixed(1)} L</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {(selectedCustomer.interested_properties || []).length > 0 && (
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 ml-1">Interested / Enquired</h4>
                                                <div className="space-y-3">
                                                    {selectedCustomer.interested_properties.map((prop, idx) => (
                                                        <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                                    <Clock size={20} />
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-slate-900">{prop.title}</p>
                                                                    <p className="text-xs text-slate-500">ID: {prop.propertyId}</p>
                                                                </div>
                                                            </div>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                                prop.status === 'Offer Made' ? 'bg-purple-100 text-purple-700' :
                                                                prop.status === 'Contacted' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-slate-100 text-slate-600'
                                                            }`}>
                                                                {prop.status}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Payment History */}
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-4 flex items-center"><CreditCard size={20} className="mr-2 text-brand-primary"/> Payment History</h3>
                                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                            <table className="w-full text-left">
                                                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                                                    <tr>
                                                        <th className="p-4">Date</th>
                                                        <th className="p-4">Description</th>
                                                        <th className="p-4">Amount</th>
                                                        <th className="p-4 text-right">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {(selectedCustomer.payment_history || []).length > 0 ? (
                                                        selectedCustomer.payment_history.map((pay) => (
                                                            <tr key={pay.id} className="hover:bg-slate-50">
                                                                <td className="p-4 text-sm text-slate-600">{pay.date}</td>
                                                                <td className="p-4 text-sm font-medium text-slate-900">{pay.description}</td>
                                                                <td className="p-4 text-sm font-bold text-slate-900">₹{pay.amount.toLocaleString()}</td>
                                                                <td className="p-4 text-right">
                                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                                        pay.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                                                        pay.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                                        'bg-red-100 text-red-700'
                                                                    }`}>
                                                                        {pay.status}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={4} className="p-8 text-center text-slate-400 text-sm">
                                                                No payment history available.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button 
                                onClick={closeModal}
                                className="px-6 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-white transition"
                            >
                                Close
                            </button>
                            <a 
                                href={`mailto:${selectedCustomer.email}?subject=Regarding Your Property Inquiry&body=Dear ${selectedCustomer.name},%0D%0A%0D%0A`}
                                className="px-6 py-2.5 rounded-xl bg-brand-primary text-white font-bold hover:bg-blue-700 shadow-lg flex items-center"
                            >
                                <Mail size={18} className="mr-2" /> Send Email
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
