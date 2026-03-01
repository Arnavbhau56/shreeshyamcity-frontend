import React, { useState, useEffect } from 'react';
import { Plus, Download, Edit, Trash2, X, User, Mail, Phone, MapPin } from 'lucide-react';
import { customerAPI } from '../../api';
import Swal from 'sweetalert2';

export const CustomersManager: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', status: 'Active', notes: '' });

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

  const handleSave = async () => {
    try {
      if (editId) {
        await customerAPI.update(editId, form);
      } else {
        await customerAPI.create(form);
      }
      setIsAdding(false);
      setEditId(null);
      setForm({ name: '', email: '', phone: '', address: '', status: 'Active', notes: '' });
      fetchCustomers();
      Swal.fire('Success!', 'Customer saved', 'success');
    } catch (error) {
      Swal.fire('Error!', 'Failed to save customer', 'error');
    }
  };

  const handleEdit = (customer: any) => {
    setEditId(customer.id);
    setForm({ name: customer.name, email: customer.email, phone: customer.phone, address: customer.address, status: customer.status, notes: customer.notes || '' });
    setIsAdding(true);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900">Customer Management</h1>
          <p className="text-slate-500 text-sm">Manage customer details and history</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-green-700 flex items-center">
            <Download size={20} className="mr-2" /> Export CSV
          </button>
          <button onClick={() => setIsAdding(!isAdding)} className="bg-brand-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 flex items-center">
            {isAdding ? <X size={20} className="mr-2" /> : <Plus size={20} className="mr-2" />}
            {isAdding ? 'Cancel' : 'Add Customer'}
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100">
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
          </div>
          <textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4 h-24"></textarea>
          <div className="flex justify-end gap-3">
            <button onClick={() => { setIsAdding(false); setEditId(null); }} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-brand-primary text-white rounded-xl font-bold">Save Customer</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map(customer => (
          <div key={customer.id} className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <User className="text-slate-400" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{customer.name}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${customer.status === 'VIP' ? 'bg-purple-100 text-purple-700' : customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                    {customer.status}
                  </span>
                </div>
              </div>
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
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button onClick={() => handleEdit(customer)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
              <button onClick={() => handleDelete(customer.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
