import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BarChart3, Package, Database, ShoppingCart,
  Settings, LogOut, LayoutDashboard, Bell, Zap, Activity,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  XCircle, Clock, DollarSign, Star, Eye, Upload, Menu, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../../utils/api';
import { Product, Pedido } from '../../types';
import { parsePrice, formatPrice } from './priceUtils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import AdminProductos from './AdminProductos';
import AdminPedidos from './AdminPedidos';
import AdminStock from './AdminStock';
import AdminVentas from './AdminVentas';
import AdminConfiguracion from './AdminConfiguracion';
import logo4 from '../../img/logo4.webp';

// ─── KPI CARD ───────────────────────────────────────────────────────────────
const KPI = ({ label, value, sub, icon: Icon, color }: any) => {
  return (
    <div className="bg-[#121212] border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:bg-[#1a1a1a] hover:border-white/10 transition-all group">
      <div className="flex justify-between items-start mb-3">
        <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
          <Icon size={16} className={color} />
        </div>
      </div>
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">{label}</p>
        <p className="text-xl font-display font-black text-white">{value}</p>
        {sub && <p className={`text-[9px] font-bold mt-1 ${color}`}>{sub}</p>}
      </div>
    </div>
  );
};

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [stockHistory, setStockHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem('aec_productos');
    if (cached) {
      try { setProducts(JSON.parse(cached)); } catch (e) {}
    }

    Promise.all([api.getProductos(), api.getAllPedidos(), api.getHistorialStock()])
      .then(([prods, peds, hist]) => {
        const safeProds = Array.isArray(prods) ? prods : [];
        setProducts(safeProds);
        localStorage.setItem('aec_productos', JSON.stringify(safeProds));
        setPedidos(Array.isArray(peds) ? peds : []);
        setStockHistory(Array.isArray(hist) ? hist : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Cálculos ─────────────────────────────────────────────────────────────
  const confirmados = pedidos.filter(p => ['CONFIRMADO','PROCESSED','CONFIRMED'].includes((p.estado||'').toUpperCase()));
  const pendientes  = pedidos.filter(p => ['PENDIENTE','PENDING'].includes((p.estado||'').toUpperCase()));
  const cancelados  = pedidos.filter(p => ['CANCELADO','CANCELED','CANCELLED'].includes((p.estado||'').toUpperCase()));

  const totalVentas = confirmados.reduce((a, p) => a + parsePrice(p.total), 0);
  const ticketProm  = confirmados.length ? totalVentas / confirmados.length : 0;

  const hace30 = new Date(Date.now() - 30*24*60*60*1000);
  const ventas30 = confirmados
    .filter(p => p.fecha && new Date(p.fecha) >= hace30)
    .reduce((a, p) => a + parsePrice(p.total), 0);

  const UMBRAL = 5;
  const activos    = products.filter(p => p.activo === true || String(p.activo).toUpperCase() === 'TRUE');
  const sinStock   = products.filter(p => (Number(p.stock)||0) === 0);
  const stockBajo  = products.filter(p => (Number(p.stock)||0) > 0 && (Number(p.stock)||0) <= UMBRAL);
  const novedades  = products.filter(p => p.novedad === true || String(p.novedad).toUpperCase() === 'TRUE');
  const destacados = products.filter(p => p.destacado === true || String(p.destacado).toUpperCase() === 'TRUE');

  // Más vendidos por nombre en pedidos
  const ventasPorProducto: Record<string, number> = {};
  confirmados.forEach(p => {
    const det = String(p.productosDetalle || '');
    det.split(',').forEach(item => {
      const nombre = item.replace(/\d+x\s*/,'').replace(/\s*\(\$.*?\)/,'').trim();
      if (nombre) ventasPorProducto[nombre] = (ventasPorProducto[nombre]||0) + 1;
    });
  });
  const masVendidos = Object.entries(ventasPorProducto).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const menosVendidos = Object.entries(ventasPorProducto).sort((a,b)=>a[1]-b[1]).slice(0,5);

  // Gráfico Semanal
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });
  const salesByDay = confirmados.reduce((acc, p) => {
    if (p.fecha) {
      const d = new Date(p.fecha).toISOString().split('T')[0];
      acc[d] = (acc[d] || 0) + parsePrice(p.total);
    }
    return acc;
  }, {} as Record<string, number>);
  const chartData = last7Days.map(date => ({
    name: date.split('-').slice(1).reverse().join('/'),
    ventas: salesByDay[date] || 0
  }));

  // Últimos pedidos
  const ultimosPedidos = [...pedidos].sort((a,b)=>{
    return new Date(b.fecha||0).getTime() - new Date(a.fecha||0).getTime();
  }).slice(0,5);

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-10 h-10 border-2 border-brand-orange/20 border-t-brand-orange rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-display font-black text-white uppercase tracking-wider">Resumen General</h2>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Métricas en tiempo real</p>
        </div>
      </div>

      {/* Unified KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
        <KPI label="Ventas Totales" value={`$${formatPrice(totalVentas)}`} sub={`${confirmados.length} ventas`} icon={DollarSign} color="text-brand-orange" />
        <KPI label="Últimos 30 días" value={`$${formatPrice(ventas30)}`} icon={TrendingUp} color="text-emerald-400" />
        <KPI label="Ticket Promedio" value={`$${formatPrice(ticketProm)}`} icon={BarChart3} color="text-blue-400" />
        <KPI label="Por Cobrar" value={pendientes.length} sub="atención" icon={Clock} color="text-amber-400" />
        
        <KPI label="Total Pedidos" value={pedidos.length} icon={ShoppingCart} color="text-white/50" />
        <KPI label="Confirmados" value={confirmados.length} icon={CheckCircle2} color="text-emerald-400" />
        <KPI label="Pendientes" value={pendientes.length} icon={Bell} color="text-amber-400" />
        <KPI label="Cancelados" value={cancelados.length} icon={XCircle} color="text-red-400" />
        
        <KPI label="Prods. Activos" value={activos.length} sub={`de ${products.length} total`} icon={Package} color="text-white/50" />
        <KPI label="Sin Stock" value={sinStock.length} sub={sinStock.length > 0 ? "⚠ crítico" : "✓ ok"} icon={AlertTriangle} color={sinStock.length > 0 ? "text-red-400" : "text-white/30"} />
        <KPI label="Stock Crítico" value={stockBajo.length} sub={stockBajo.length > 0 ? "reabastecer" : "✓ ok"} icon={Database} color={stockBajo.length > 0 ? "text-amber-400" : "text-white/30"} />
        <KPI label="Novedades" value={novedades.length} sub={`${destacados.length} destac`} icon={Star} color="text-purple-400" />
      </div>

      {/* Gráfico Semanal */}
      <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-brand-orange" />
            <span className="text-xs font-black uppercase tracking-widest text-white/60">Evolución de Ventas (Últimos 7 días)</span>
          </div>
        </div>
        <div className="w-full" style={{ height: 256 }}>
          <ResponsiveContainer width="100%" height={256}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickMargin={10} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickFormatter={(val) => `$${val/1000}k`} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f0f0f', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff' }}
                itemStyle={{ color: '#f97316', fontWeight: 'bold' }}
                formatter={(value: number) => [`$${formatPrice(value)}`, 'Ventas']}
              />
              <Line type="monotone" dataKey="ventas" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#000' }} activeDot={{ r: 6, fill: '#f97316' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tablas analíticas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Últimos pedidos */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart size={14} className="text-brand-orange" />
              <span className="text-xs font-black uppercase tracking-widest text-white/60">Últimos Pedidos</span>
            </div>
            <Link to="/admin/pedidos" className="text-[10px] text-brand-orange font-bold uppercase tracking-widest hover:underline">Ver todos →</Link>
          </div>
          <div className="divide-y divide-white/5">
            {ultimosPedidos.length === 0 ? (
              <p className="p-6 text-white/20 text-xs uppercase font-bold text-center">Sin pedidos</p>
            ) : ultimosPedidos.map(p => {
              const estado = (p.estado||'').toUpperCase();
              const colorEstado = ['CONFIRMADO','PROCESSED'].includes(estado) ? 'text-emerald-400' :
                ['CANCELADO','CANCELED'].includes(estado) ? 'text-red-400' : 'text-amber-400';
              return (
                <div key={p.pedidoId||p.orderId} className="px-6 py-4 flex items-center gap-3 hover:bg-white/3 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-black uppercase truncate">{p.clienteNombre}</p>
                    <p className="text-white/30 text-[10px] font-mono">{p.pedidoId||p.orderId}</p>
                  </div>
                  <p className="text-brand-orange font-black text-sm flex-shrink-0">${formatPrice(p.total)}</p>
                  <span className={`text-[9px] font-black uppercase flex-shrink-0 ${colorEstado}`}>{p.estado||'PEND.'}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Más vendidos */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
            <TrendingUp size={14} className="text-brand-orange" />
            <span className="text-xs font-black uppercase tracking-widest text-white/60">Más Vendidos</span>
          </div>
          <div className="divide-y divide-white/5">
            {masVendidos.length === 0 ? (
              <p className="p-6 text-white/20 text-xs uppercase font-bold text-center">Sin datos suficientes</p>
            ) : masVendidos.map(([nombre, qty], i) => (
              <div key={nombre} className="px-6 py-4 flex items-center gap-3 hover:bg-white/3 transition-colors">
                <span className="text-[10px] font-black text-white/20 w-4">{i+1}</span>
                <p className="text-white text-xs font-bold uppercase flex-1 truncate">{nombre}</p>
                <span className="bg-brand-orange/10 text-brand-orange text-[10px] font-black px-3 py-1 rounded-full border border-brand-orange/20">{qty} ventas</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stock crítico */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-400" />
              <span className="text-xs font-black uppercase tracking-widest text-white/60">Stock Crítico</span>
            </div>
            <Link to="/admin/stock" className="text-[10px] text-brand-orange font-bold uppercase tracking-widest hover:underline">Gestionar →</Link>
          </div>
          <div className="divide-y divide-white/5">
            {[...sinStock, ...stockBajo].length === 0 ? (
              <p className="p-6 text-emerald-400 text-xs uppercase font-bold text-center">✓ Todo el stock en orden</p>
            ) : [...sinStock, ...stockBajo].slice(0,6).map(p => (
              <div key={p.id} className="px-6 py-4 flex items-center gap-3 hover:bg-white/3 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-bold uppercase truncate">{p.nombre}</p>
                  <p className="text-white/30 text-[10px]">ID: {p.id}</p>
                </div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${
                  (Number(p.stock)||0) === 0
                    ? 'bg-red-500/10 text-red-400 border-red-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {Number(p.stock)||0} u.
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Productos sin ventas */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
            <TrendingDown size={14} className="text-red-400" />
            <span className="text-xs font-black uppercase tracking-widest text-white/60">Menos Vendidos</span>
          </div>
          <div className="divide-y divide-white/5">
            {menosVendidos.length === 0 ? (
              <p className="p-6 text-white/20 text-xs uppercase font-bold text-center">Sin datos suficientes</p>
            ) : menosVendidos.map(([nombre, qty], i) => (
              <div key={nombre} className="px-6 py-4 flex items-center gap-3 hover:bg-white/3 transition-colors">
                <span className="text-[10px] font-black text-white/20 w-4">{i+1}</span>
                <p className="text-white text-xs font-bold uppercase flex-1 truncate">{nombre}</p>
                <span className="bg-red-500/10 text-red-400 text-[10px] font-black px-3 py-1 rounded-full border border-red-500/20">{qty} venta{qty !== 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Historial de Stock Reciente */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden mt-6">
          <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Activity size={18} className="text-brand-orange" />
              <h3 className="font-display font-black uppercase italic tracking-wider">Últimos Movimientos de Inventario</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="p-4 text-[10px] font-black uppercase text-white/30 tracking-widest bg-white/[0.02]">Fecha</th>
                  <th className="p-4 text-[10px] font-black uppercase text-white/30 tracking-widest bg-white/[0.02]">Operación</th>
                  <th className="p-4 text-[10px] font-black uppercase text-white/30 tracking-widest bg-white/[0.02]">Producto</th>
                  <th className="p-4 text-[10px] font-black uppercase text-white/30 tracking-widest bg-white/[0.02] text-right">Cant.</th>
                  <th className="p-4 text-[10px] font-black uppercase text-white/30 tracking-widest bg-white/[0.02] text-right">Resultante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stockHistory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-white/20 text-xs font-bold uppercase tracking-widest">
                      Sin movimientos recientes
                    </td>
                  </tr>
                ) : stockHistory.slice(0, 10).map((h, i) => {
                   const isIngreso = h.operacion?.toUpperCase().includes('INGRESO');
                   const isVenta = h.operacion?.toUpperCase() === 'VENTA';
                   const badgeColor = isIngreso ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                      isVenta ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                                      'bg-brand-orange/10 text-brand-orange border-brand-orange/20';
                   return (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-[10px] font-bold text-white/40 whitespace-nowrap">
                        {new Date(h.fecha).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${badgeColor}`}>
                          {h.operacion}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-xs font-bold text-white uppercase">{h.nombre || h.productoId}</p>
                        {h.referencia && <p className="text-[9px] text-white/30 font-mono mt-1">{h.referencia}</p>}
                      </td>
                      <td className={`p-4 text-xs font-black text-right ${isIngreso ? 'text-emerald-400' : isVenta ? 'text-amber-400' : 'text-white'}`}>
                        {isIngreso ? '+' : isVenta ? '-' : ''}{h.cantidad}
                      </td>
                      <td className="p-4 text-xs font-black text-white/70 text-right">
                        {h.stockFinal}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

// ─── ADMIN PANEL LAYOUT ───────────────────────────────────────────────────────
const AdminPanel = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize(); // Init on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isAuthenticated) return <Navigate to="/admin/login" />;

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Productos', path: '/admin/productos', icon: Package },
    { label: 'Pedidos', path: '/admin/pedidos', icon: ShoppingCart },
    { label: 'Ventas', path: '/admin/ventas', icon: BarChart3 },
    { label: 'Stock', path: '/admin/stock', icon: Database },
    { label: 'Configuración', path: '/admin/configuracion', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-brand-black flex selection:bg-brand-orange selection:text-white overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col fixed inset-y-0 left-0 z-50 transition-transform duration-300 shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Botón de cierre para celular */}
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden absolute top-5 right-5 p-2.5 text-white/40 hover:text-brand-orange bg-white/5 hover:bg-white/10 rounded-xl transition-all z-50 active:scale-95"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        <div className="p-8 pb-4 relative z-10 flex flex-col items-center">
          <div className="relative flex items-center justify-center w-full px-2">
            <img 
              src={logo4} 
              alt="AudioElectroCar Logo" 
              className="w-full max-w-[110px] h-auto object-contain relative z-10 select-none drop-shadow-xl"
            />
          </div>
          <div className="mt-6 flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">{user?.usuario} · Online</p>
          </div>
        </div>

        <nav className="flex-grow py-4 px-3 relative z-10 flex flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group relative ${
                  isActive ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20' : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}>
                <item.icon size={18} className="relative z-10 flex-shrink-0" />
                <span className="text-[11px] font-black uppercase tracking-[0.15em] relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button onClick={logout}
          className="m-6 mt-auto p-4 rounded-2xl flex items-center justify-center gap-2 bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors border border-white/5 hover:border-red-500/30">
          <LogOut size={16} />
          <span className="text-[11px] font-black uppercase tracking-[0.15em]">Cerrar Sesión</span>
        </button>
      </aside>

      {/* Main */}
      <main className={`flex-grow min-h-screen relative flex flex-col w-full transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 md:py-6 sticky top-0 z-30 bg-brand-black/95 backdrop-blur-xl border-b border-white/5 shadow-xl">
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-11 h-11 flex items-center justify-center rounded-[1rem] bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-brand-orange transition-all active:scale-95 z-10 relative"
          >
            <Menu size={22} />
          </button>
          
          {/* Centered Logo on Mobile */}
          <div className={`absolute inset-0 flex items-center justify-center pointer-events-none md:hidden ${isSidebarOpen ? 'hidden' : 'flex'}`}>
            <img 
              src={logo4} 
              alt="AEC Logo" 
              className="w-32 h-auto filter drop-shadow-[0_0_15px_rgba(249,115,22,0.3)] brightness-110 contrast-110" 
            />
          </div>
          
          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4 ml-auto">
             {/* Espacio para notificaciones o perfil */}
          </div>
        </div>

        <div className="p-4 md:p-8 flex-grow">
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/3 blur-[120px] rounded-full" />
          </div>
          <div className="relative z-10 max-w-6xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
              <Routes location={location}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="productos" element={<AdminProductos />} />
                <Route path="pedidos" element={<AdminPedidos />} />
                <Route path="ventas" element={<AdminVentas />} />
                <Route path="stock" element={<AdminStock />} />
                <Route path="configuracion" element={<AdminConfiguracion />} />
                <Route path="*" element={<Navigate to="dashboard" />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
