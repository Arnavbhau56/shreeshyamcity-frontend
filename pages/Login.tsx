import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoTransparent from "../src/assets/img/logo-transparent.png";
import { Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { authAPI } from '../api';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    
    try {
      const response = await authAPI.login(loginForm.email, loginForm.password);
      
      if (response.data.success) {
        const userRole = response.data.user.role;
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        if (userRole === 'admin') {
          navigate('/admin');
        } else if (userRole === 'agent') {
          navigate('/agents');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
      setLoginError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900 font-sans selection:bg-brand-primary selection:text-white">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-brand-primary/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-brand-secondary/20 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-6">
        <div className="text-center mb-10">
          <img src={LogoTransparent} alt="Shree Shyam City" />
          <br /><br />
          <p className="text-slate-400">Enter your credentials to access the portal.</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={20} />
                </div>
                <input 
                  type="email" 
                  value={loginForm.email}
                  onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition placeholder-slate-500"
                  placeholder="admin@admin.com"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 ml-1">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={20} />
                </div>
                <input 
                  type="password"
                  value={loginForm.password}
                  onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition placeholder-slate-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {loginError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center animate-in fade-in slide-in-from-top-2">
                <ShieldCheck size={16} className="mr-2 flex-shrink-0" /> {loginError}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-primary to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'} {!loading && <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>

        <div className="text-center mt-8">
          <button onClick={() => navigate('/')} className="text-slate-500 hover:text-white text-sm font-medium transition-colors">
            Back to Website
          </button>
        </div>
      </div>
    </div>
  );
};
