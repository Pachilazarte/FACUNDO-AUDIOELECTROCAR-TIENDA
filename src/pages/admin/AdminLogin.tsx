import React, { useState } from 'react';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

const AdminLogin = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.login({ usuario, password });
      if (res.success && res.user) {
        login(res.user);
        navigate('/admin/dashboard');
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      console.error(err);
      setError('Error al conectar con la base de datos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-navy/30 via-brand-black to-brand-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white p-10 border-t-4 border-brand-orange shadow-2xl space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-display font-black text-brand-black uppercase italic tracking-widest">Admin Access</h1>
          <p className="text-[10px] text-brand-black/40 font-bold uppercase tracking-[0.2em]">AutoSound Store Control</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 border-l-4 border-red-500 flex items-center gap-3">
            <AlertCircle size={18} />
            <span className="text-xs font-bold uppercase">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/50">Usuario</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-black/20" size={16} />
              <input
                required
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-brand-gray-light border-2 border-transparent focus:border-brand-orange text-sm font-bold uppercase outline-none transition-all"
                placeholder="ADMIN"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/50">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-black/20" size={16} />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-brand-gray-light border-2 border-transparent focus:border-brand-orange text-sm font-bold outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-orange text-white py-4 font-display font-black uppercase tracking-widest text-sm hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-[8px] text-brand-black/20 font-bold uppercase tracking-[0.3em]">Acceso restringido a personal autorizado</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;