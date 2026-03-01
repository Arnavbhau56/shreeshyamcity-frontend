import React, { useState } from 'react';
import { Plus, Download, Edit, Trash2, Phone, Mail, X } from 'lucide-react';
import { agentAPI } from '../../api';
import Swal from 'sweetalert2';

export const AgentsManager: React.FC<{ agents: any[], onUpdate: () => void }> = ({ agents, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', role: '', email: '', phone: '', photo: '', password: '', deals: 0 });

  const handleSave = async () => {
    if (!form.password && !editId) {
      Swal.fire('Error!', 'Password is required', 'error');
      return;
    }
    try {
      const data = { ...form, username: form.email.split('@')[0], userRole: 'agent' };
      if (editId) {
        await agentAPI.update(editId, data);
      } else {
        await agentAPI.create(data);
      }
      setIsAdding(false);
      setEditId(null);
      setForm({ name: '', role: '', email: '', phone: '', photo: '', password: '', deals: 0 });
      onUpdate();
      Swal.fire('Success!', 'Agent saved', 'success');
    } catch (error) {
      Swal.fire('Error!', 'Failed to save agent', 'error');
    }
  };

  const handleEdit = (agent: any) => {
    setEditId(agent.id);
    setForm({ name: agent.name, role: agent.role, email: agent.email, phone: agent.phone, photo: agent.photo || '', password: '', deals: agent.deals });
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({ title: 'Delete Agent?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#2563EB' });
    if (result.isConfirmed) {
      try {
        await agentAPI.delete(id);
        onUpdate();
        Swal.fire('Deleted!', '', 'success');
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete', 'error');
      }
    }
  };

  const handleExport = async () => {
    try {
      const response = await agentAPI.exportCSV();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'agents.csv');
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
          <h1 className="text-2xl font-heading font-bold text-slate-900">Agent Management</h1>
          <p className="text-slate-500 text-sm">Manage sales team and create login credentials</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-green-700 flex items-center">
            <Download size={20} className="mr-2" /> Export CSV
          </button>
          <button onClick={() => setIsAdding(!isAdding)} className="bg-brand-secondary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-600 flex items-center">
            {isAdding ? <X size={20} className="mr-2" /> : <Plus size={20} className="mr-2" />}
            {isAdding ? 'Cancel' : 'Add Agent'}
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100">
          <h3 className="text-lg font-bold mb-4">{editId ? 'Edit Agent' : 'Add New Agent'}</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="Name *" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="p-3 bg-slate-50 border border-slate-200 rounded-xl" required />
            <input type="text" placeholder="Role *" value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} className="p-3 bg-slate-50 border border-slate-200 rounded-xl" required />
            <input type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="p-3 bg-slate-50 border border-slate-200 rounded-xl" required />
            <input type="text" placeholder="Phone" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="p-3 bg-slate-50 border border-slate-200 rounded-xl" />
            <input type="text" placeholder="Photo URL" value={form.photo} onChange={(e) => setForm({...form, photo: e.target.value})} className="p-3 bg-slate-50 border border-slate-200 rounded-xl col-span-2" />
            {!editId && (
              <input type="password" placeholder="Password *" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} className="p-3 bg-slate-50 border border-slate-200 rounded-xl col-span-2" required />
            )}
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => { setIsAdding(false); setEditId(null); }} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-brand-secondary text-white rounded-xl font-bold">Save Agent</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map(agent => (
          <div key={agent.id} className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100 hover:shadow-lg transition">
            <div className="flex items-start gap-4 mb-4">
              <img src={agent.photo || 'https://via.placeholder.com/80'} className="w-20 h-20 rounded-full object-cover border-4 border-slate-50" alt={agent.name} />
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">{agent.name}</h3>
                <p className="text-xs text-brand-primary font-bold uppercase tracking-wide mb-2">{agent.role}</p>
                <div className="text-sm text-slate-500 flex items-center gap-1 mb-1"><Phone size={12}/> {agent.phone}</div>
                <div className="text-sm text-slate-500 flex items-center gap-1"><Mail size={12}/> {agent.email}</div>
                <div className="mt-3 text-sm font-medium text-slate-700 bg-slate-100 inline-block px-2 py-1 rounded">
                  {agent.deals} Deals
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button onClick={() => handleEdit(agent)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
              <button onClick={() => handleDelete(agent.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
