import React, { useState } from 'react';
import { Plus, Download, Edit, Trash2, Mail, Phone, X } from 'lucide-react';
import { leadAPI, agentAPI } from '../../api';
import Swal from 'sweetalert2';

export const LeadsManager: React.FC<{ leads: any[], agents: any[], onUpdate: () => void, userRole?: string, userEmail?: string }> = ({ leads, agents, onUpdate, userRole = 'admin', userEmail }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', source: 'Website', status: 'New' });

  // Filter leads for agents - only show their own leads
  const filteredLeads = userRole === 'agent' 
    ? leads.filter(lead => lead.source === agents.find(a => a.email === userEmail)?.name)
    : leads;

  const handleSave = async () => {
    try {
      const saveData = { ...form };
      // For agents, set source as their name
      if (userRole === 'agent') {
        const currentAgent = agents.find(a => a.email === userEmail);
        if (currentAgent) {
          saveData.source = currentAgent.name;
        }
      }
      
      if (editId) {
        await leadAPI.update(editId, saveData);
      } else {
        await leadAPI.create(saveData);
      }
      setIsAdding(false);
      setEditId(null);
      setForm({ name: '', email: '', phone: '', message: '', source: 'Website', status: 'New' });
      onUpdate();
      Swal.fire('Success!', 'Lead saved', 'success');
    } catch (error) {
      Swal.fire('Error!', 'Failed to save lead', 'error');
    }
  };

  const handleEdit = (lead: any) => {
    setEditId(lead.id);
    setForm({ name: lead.name, email: lead.email, phone: lead.phone, message: lead.message || '', source: lead.source, status: lead.status });
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({ title: 'Delete Lead?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#2563EB' });
    if (result.isConfirmed) {
      try {
        await leadAPI.delete(id);
        onUpdate();
        Swal.fire('Deleted!', '', 'success');
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete', 'error');
      }
    }
  };

  const handleExport = async () => {
    try {
      const response = await leadAPI.exportCSV();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'leads.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      Swal.fire('Error!', 'Failed to export', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900">Lead Management</h1>
          <p className="text-slate-500 text-sm">Track and manage leads</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button onClick={handleExport} className="flex-1 sm:flex-none bg-green-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-green-700 flex items-center justify-center text-sm">
            <Download size={18} className="mr-2" /> Export
          </button>
          <button onClick={() => setIsAdding(!isAdding)} className="flex-1 sm:flex-none bg-brand-primary text-white px-4 py-2.5 rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center text-sm">
            {isAdding ? <X size={18} className="mr-2" /> : <Plus size={18} className="mr-2" />}
            {isAdding ? 'Cancel' : 'Add'}
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100">
          <h3 className="text-lg font-bold mb-4">{editId ? 'Edit Lead' : 'Add New Lead'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="p-3 bg-slate-50 border border-slate-200 rounded-xl" />
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="p-3 bg-slate-50 border border-slate-200 rounded-xl" />
            <input type="text" placeholder="Phone" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="p-3 bg-slate-50 border border-slate-200 rounded-xl" />
            {userRole === 'admin' && (
              <select value={form.source} onChange={(e) => setForm({...form, source: e.target.value})} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <option value="Website">Website</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="Referral">Referral</option>
                <option value="Other">Other</option>
              </select>
            )}
            <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <textarea placeholder="Message" value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4 h-24"></textarea>
          <div className="flex justify-end gap-3">
            <button onClick={() => { setIsAdding(false); setEditId(null); }} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-brand-primary text-white rounded-xl font-bold">Save Lead</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="p-5">Name</th>
                <th className="p-5">Contact</th>
                <th className="p-5">Source</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-slate-50">
                  <td className="p-5 font-bold text-slate-800 text-sm">{lead.name}</td>
                  <td className="p-5 text-sm text-slate-600">
                    <div className="flex flex-col">
                      <span className="flex items-center gap-1"><Mail size={12}/> {lead.email}</span>
                      <span className="flex items-center gap-1 mt-1"><Phone size={12}/> {lead.phone}</span>
                    </div>
                  </td>
                  <td className="p-5 text-sm text-slate-600">{lead.source}</td>
                  <td className="p-5">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${lead.status === 'New' ? 'bg-blue-100 text-blue-700' : lead.status === 'Closed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(lead)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(lead.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredLeads.map(lead => (
            <div key={lead.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1">{lead.name}</h3>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="flex items-center gap-1"><Mail size={12}/> {lead.email}</div>
                    <div className="flex items-center gap-1"><Phone size={12}/> {lead.phone}</div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${lead.status === 'New' ? 'bg-blue-100 text-blue-700' : lead.status === 'Closed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {lead.status}
                </span>
              </div>
              <div className="text-xs text-slate-500 mb-3">Source: {lead.source}</div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(lead)} className="flex-1 p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-sm font-medium">
                  <Edit size={14} className="inline mr-1" /> Edit
                </button>
                <button onClick={() => handleDelete(lead.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
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
