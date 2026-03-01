import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, User, LogOut, Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { leadAPI } from '../api';
import Swal from 'sweetalert2';

export const AgentPortal: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [agent, setAgent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'leads' | 'profile'>('leads');
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [editLeadId, setEditLeadId] = useState<string | null>(null);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', message: '', status: 'New' });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', role: '' });

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.role === 'agent') {
        setAgent(userData);
        setIsAuthenticated(true);
        fetchLeads();
        setProfileForm({ name: userData.agentName || '', phone: '', role: 'Agent' });
      } else {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await leadAPI.getAll();
      const allLeads = response.data.results || response.data || [];
      // Filter leads by agent name in source field
      const agentName = JSON.parse(localStorage.getItem('user') || '{}').agentName;
      const filteredLeads = allLeads.filter((lead: any) => lead.source === agentName);
      setLeads(filteredLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLead = async () => {
    if (!leadForm.name || !leadForm.email || !leadForm.phone) {
      Swal.fire('Missing Fields', 'Please fill in all required fields', 'warning');
      return;
    }

    try {
      const agentData = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('Agent Data from localStorage:', agentData);
      const agentName = agentData.agentName;
      console.log('Agent Name:', agentName);
      
      if (!agentName) {
        Swal.fire('Error', 'Agent name not found. Please login again.', 'error');
        return;
      }
      
      const saveData = { ...leadForm, source: agentName };
      console.log('Saving lead with data:', saveData);
      
      if (editLeadId) {
        await leadAPI.update(editLeadId, saveData);
        Swal.fire('Updated!', 'Lead has been updated', 'success');
      } else {
        await leadAPI.create(saveData);
        Swal.fire('Created!', 'Lead has been created', 'success');
      }
      
      setIsAddingLead(false);
      setEditLeadId(null);
      setLeadForm({ name: '', email: '', phone: '', message: '', status: 'New' });
      fetchLeads();
    } catch (error) {
      console.error('Save lead error:', error);
      Swal.fire('Error!', 'Failed to save lead', 'error');
    }
  };

  const handleEditLead = (lead: any) => {
    setEditLeadId(lead.id);
    setLeadForm({ name: lead.name, email: lead.email, phone: lead.phone, message: lead.message || '', status: lead.status });
    setIsAddingLead(true);
  };

  const handleDeleteLead = async (id: string) => {
    const result = await Swal.fire({
      title: 'Delete Lead?',
      text: 'Are you sure you want to delete this lead?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563EB',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await leadAPI.delete(id);
        Swal.fire('Deleted!', 'Lead has been deleted', 'success');
        fetchLeads();
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete lead', 'error');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleUpdateProfile = () => {
    const updatedAgent = { ...agent, agentName: profileForm.name };
    setAgent(updatedAgent);
    localStorage.setItem('user', JSON.stringify(updatedAgent));
    setIsEditingProfile(false);
    Swal.fire('Updated!', 'Profile has been updated', 'success');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white p-6 fixed h-full z-10">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center font-bold">A</div>
          <h2 className="text-xl font-heading font-bold">Agent Portal</h2>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center p-3 rounded-xl transition mb-1 font-medium ${activeTab === 'leads' ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Users size={20} className="mr-3" /> My Leads
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center p-3 rounded-xl transition mb-1 font-medium ${activeTab === 'profile' ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <User size={20} className="mr-3" /> Profile
          </button>
        </nav>
        
        <div className="mt-auto pt-6 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-slate-800 transition text-left group"
          >
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
              {agent?.agentName?.charAt(0) || 'A'}
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold">{agent?.agentName || 'Agent'}</div>
              <div className="text-xs text-slate-500">Agent</div>
            </div>
            <LogOut size={18} className="text-slate-500 group-hover:text-red-400" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        {/* LEADS TAB */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-heading font-bold text-slate-900">My Leads</h1>
                <p className="text-slate-500 text-sm">Manage your assigned leads</p>
              </div>
              <button
                onClick={() => {
                  setIsAddingLead(!isAddingLead);
                  setEditLeadId(null);
                  setLeadForm({ name: '', email: '', phone: '', message: '', status: 'New' });
                }}
                className="bg-brand-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 flex items-center shadow-lg"
              >
                {isAddingLead ? <X size={20} className="mr-2" /> : <Plus size={20} className="mr-2" />}
                {isAddingLead ? 'Cancel' : 'Add Lead'}
              </button>
            </div>

            {isAddingLead && (
              <div className="bg-white p-8 rounded-2xl shadow-soft border border-slate-100">
                <h3 className="text-lg font-bold mb-6">{editLeadId ? 'Edit Lead' : 'Add New Lead'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      placeholder="Enter name"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      placeholder="Enter email"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Phone <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      placeholder="Enter phone"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Status</label>
                    <select
                      value={leadForm.status}
                      onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-700">Message</label>
                    <textarea
                      value={leadForm.message}
                      onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                      placeholder="Enter message"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none h-24"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setIsAddingLead(false);
                      setEditLeadId(null);
                      setLeadForm({ name: '', email: '', phone: '', message: '', status: 'New' });
                    }}
                    className="px-6 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveLead}
                    className="px-6 py-3 rounded-xl bg-brand-primary text-white font-bold hover:bg-blue-700 shadow-lg flex items-center"
                  >
                    <Save size={18} className="mr-2" /> Save Lead
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-5">Name</th>
                    <th className="p-5">Email</th>
                    <th className="p-5">Phone</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan={5} className="p-5 text-center text-slate-500">Loading...</td></tr>
                  ) : leads.length === 0 ? (
                    <tr><td colSpan={5} className="p-5 text-center text-slate-400">No leads found</td></tr>
                  ) : (
                    leads.map(lead => (
                      <tr key={lead.id} className="hover:bg-slate-50">
                        <td className="p-5 font-bold text-slate-800 text-sm">{lead.name}</td>
                        <td className="p-5 text-sm text-slate-600">{lead.email}</td>
                        <td className="p-5 text-sm text-slate-600">{lead.phone}</td>
                        <td className="p-5">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            lead.status === 'New' ? 'bg-blue-100 text-blue-700' :
                            lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleEditLead(lead)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => handleDeleteLead(lead.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-heading font-bold text-slate-900">My Profile</h1>
                <p className="text-slate-500 text-sm">Update your profile information</p>
              </div>
              {!isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="bg-brand-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 flex items-center"
                >
                  <Edit size={20} className="mr-2" /> Edit Profile
                </button>
              )}
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-soft border border-slate-100 max-w-2xl">
              {isEditingProfile ? (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-bold text-slate-700">Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="mt-2 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700">Phone</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="Enter phone number"
                      className="mt-2 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700">Email</label>
                    <div className="mt-2 p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500">
                      {agent?.email || 'N/A'}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setIsEditingProfile(false);
                        setProfileForm({ name: agent?.agentName || '', phone: '', role: 'Agent' });
                      }}
                      className="px-6 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      className="px-6 py-3 rounded-xl bg-brand-primary text-white font-bold hover:bg-blue-700 shadow-lg flex items-center"
                    >
                      <Save size={18} className="mr-2" /> Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-bold text-slate-700">Name</label>
                    <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800">
                      {agent?.agentName || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700">Phone</label>
                    <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800">
                      {profileForm.phone || 'Not provided'}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700">Email</label>
                    <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800">
                      {agent?.email || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700">Role</label>
                    <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800">
                      Agent
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
