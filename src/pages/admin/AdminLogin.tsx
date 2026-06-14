import React, { useState } from 'react';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Lock, User as UserIcon, AlertCircle, ChevronLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import logo2 from '../../img/logo2.webp';

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
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-6 relative overflow-hidden selection:bg-brand-orange selection:text-white">
      {/* Fondo atmosférico */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(249,115,22,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(30,41,59,0.4),transparent_50%)]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card glassmorphism */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)]">

          {/* Logo / Header */}
          <div className="text-center space-y-4 mb-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute w-36 h-36 bg-brand-orange/25 rounded-full blur-2xl opacity-80 pointer-events-none" />
              <img 
                src={logo2} 
                alt="AudioElectroCar Mascot Logo" 
                className="h-32 md:h-36 w-auto object-contain relative z-10 select-none filter drop-shadow-[0_10px_20px_rgba(249,115,22,0.15)]"
              />
            </div>
            <h1 className="text-3xl font-display font-black text-white uppercase italic tracking-widest">
              Admin Access
            </h1>
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.3em]">
              AudioElectroCar · Panel de Control
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 text-red-400 p-4 rounded-2xl border border-red-500/20 flex items-center gap-3 mb-6"
            >
              <AlertCircle size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">Usuario</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                <input
                  required
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm font-bold uppercase placeholder:text-white/20 outline-none focus:border-brand-orange/50 focus:bg-white/8 focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)] transition-all"
                  placeholder="ADMIN"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm font-bold placeholder:text-white/20 outline-none focus:border-brand-orange/50 focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)] transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-brand-orange text-white py-4 rounded-2xl font-display font-black uppercase tracking-widest text-sm hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? 'Verificando...' : 'Ingresar al Panel'}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Link to="/" className="text-[10px] text-white/30 hover:text-brand-orange font-bold uppercase tracking-[0.2em] flex items-center gap-2 transition-colors">
              <ChevronLeft size={14} /> Volver a la Tienda
            </Link>
            <p className="text-center text-[8px] text-white/15 font-bold uppercase tracking-[0.3em]">
              Acceso restringido a personal autorizado
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
