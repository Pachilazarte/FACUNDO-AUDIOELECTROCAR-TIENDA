import React, { useState } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BarChart3,
  Package,
  Database,
  ShoppingCart,
  Settings,
  LogOut,
  LayoutDashboard,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import AdminProductos from './AdminProductos';
import AdminPedidos from './AdminPedidos';
import AdminStock from './AdminStock';
import AdminVentas from './AdminVentas';
import AdminConfiguracion from './AdminConfiguracion';

const Dashboard = () => {
  const [stats] = useState({ ped: 0, sales: 0, critical: 0 });

  return (
    <div className="space-y-8 text-brand-black">
      <div>
        <h2 className="text-3xl font-display font-black text-brand-navy uppercase italic">Resumen</h2>
        <p className="text-xs text-brand-black/40 font-bold uppercase tracking-widest mt-1">Snapshot del Estado del Negocio</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Pedidos Pendientes', value: stats.ped, icon: Bell, color: 'text-brand-orange' },
          { label: 'Ventas del Mes', value: `$${stats.sales.toLocaleString()}`, icon: BarChart3, color: 'text-emerald-500' },
          { label: 'Stock Crítico', value: stats.critical, icon: Database, color: 'text-red-500' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 border-l-4 border-brand-orange shadow-sm flex justify-between items-center"
          >
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase text-brand-black/40 tracking-widest">{stat.label}</p>
              <p className="text-3xl font-display font-black text-brand-navy italic">{stat.value}</p>
            </div>
            <stat.icon size={32} className={stat.color} />
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 border border-brand-gray-mid shadow-sm space-y-4">
          <h3 className="text-sm font-display font-black text-brand-navy uppercase italic">Accesos Rápidos</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Ver Pedidos', path: '/admin/pedidos', icon: ShoppingCart },
              { label: 'Gestionar Productos', path: '/admin/productos', icon: Package },
              { label: 'Revisar Stock', path: '/admin/stock', icon: Database },
              { label: 'Configuración', path: '/admin/configuracion', icon: Settings },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-2 p-4 bg-brand-gray-light hover:bg-brand-orange/5 border-2 border-transparent hover:border-brand-orange transition-all group"
              >
                <item.icon size={20} className="text-brand-orange group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-center text-brand-black/60">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="bg-brand-navy p-8 text-white space-y-4">
          <h3 className="text-sm font-display font-black uppercase italic text-brand-orange">AutoSound Store</h3>
          <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Panel de administración activo</p>
          <div className="flex items-center gap-2 mt-4">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-white/60 uppercase font-bold tracking-widest">Sistema operativo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  const menuItems = [
    { label: 'Resumen', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Productos', path: '/admin/productos', icon: Package },
    { label: 'Pedidos', path: '/admin/pedidos', icon: ShoppingCart },
    { label: 'Ventas', path: '/admin/ventas', icon: BarChart3 },
    { label: 'Stock', path: '/admin/stock', icon: Database },
    { label: 'Configuración', path: '/admin/configuracion', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-brand-gray-light flex">
      <aside className="w-64 bg-brand-navy text-white flex flex-col fixed h-full z-40 border-r border-brand-orange/10">
        <div className="p-8 border-b border-white/5 space-y-2">
          <Link to="/" className="text-brand-orange font-display font-black uppercase text-base italic tracking-widest">AutoSound</Link>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[8px] opacity-40 font-bold uppercase tracking-widest">{user?.usuario} (Online)</p>
          </div>
        </div>

        <nav className="flex-grow py-6">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-8 py-4 transition-all hover:bg-white/5 group ${
                  isActive ? 'border-r-4 border-brand-orange bg-white/5 text-brand-orange' : 'text-white/60'
                }`}
              >
                <item.icon size={18} className={isActive ? 'text-brand-orange' : 'group-hover:text-white transition-colors'} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={logout}
          className="p-8 border-t border-white/5 flex items-center gap-4 text-white/40 hover:text-red-400 transition-colors bg-black/20"
        >
          <LogOut size={18} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Cerrar Sesión</span>
        </button>
      </aside>

      <main className="flex-grow ml-64 p-12">
        <div className="container-max">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="productos" element={<AdminProductos />} />
              <Route path="pedidos" element={<AdminPedidos />} />
              <Route path="ventas" element={<AdminVentas />} />
              <Route path="stock" element={<AdminStock />} />
              <Route path="configuracion" element={<AdminConfiguracion />} />
              <Route path="*" element={<Navigate to="dashboard" />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;