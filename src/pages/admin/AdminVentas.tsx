import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { Pedido } from '../../types';
import { Download, TrendingUp, Zap, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';
import { parsePrice, formatPrice } from './priceUtils';

const AdminVentas = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAllPedidos()
      .then(data => setPedidos(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const confirmados = pedidos.filter(p =>
    ['CONFIRMADO', 'PROCESSED', 'CONFIRMED'].includes((p.estado || '').toUpperCase())
  );

  const totalHistorico = confirmados.reduce((acc, p) => acc + parsePrice(p.total), 0);
  const ticketPromedio = confirmados.length > 0 ? totalHistorico / confirmados.length : 0;
  const hace30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const ventas30 = confirmados
    .filter(p => p.fecha && new Date(p.fecha) >= hace30)
    .reduce((acc, p) => acc + parsePrice(p.total), 0);

  const handleExport = () => {
    const headers = ['ID', 'Fecha', 'Cliente', 'Email', 'Total', 'Estado', 'Método'];
    const rows = confirmados.map(p => [
      p.pedidoId || p.orderId || '',
      p.fecha ? new Date(p.fecha).toLocaleDateString('es-AR') : '',
      p.clienteNombre || '',
      p.clienteEmail || '',
      parsePrice(p.total),
      p.estado || '',
      p.metodoPago || '',
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ventas_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-orange">
            <Zap size={13} fill="currentColor" />
            <span className="font-bold text-[10px] uppercase tracking-[0.3em]">Reportes</span>
          </div>
          <h2 className="text-3xl font-display font-black text-white uppercase italic">Ventas</h2>
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Reporte de facturación</p>
        </div>
        <button onClick={handleExport}
          className="bg-white/5 border border-white/10 hover:border-brand-orange/30 hover:bg-brand-orange/5 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-display font-bold uppercase text-[10px] tracking-widest transition-all">
          <Download size={13} /> Exportar CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 border border-brand-orange/20 rounded-[1.5rem] p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={70} className="text-brand-orange" />
          </div>
          <p className="text-[9px] font-bold uppercase text-brand-orange tracking-widest mb-1">Total Histórico</p>
          <p className="text-3xl font-display font-black italic text-white">${formatPrice(totalHistorico)}</p>
          <p className="text-white/30 text-[10px] uppercase mt-1 font-bold">{confirmados.length} ventas confirmadas</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="bg-white/5 border border-white/10 rounded-[1.5rem] p-6">
          <p className="text-[9px] font-bold uppercase text-white/30 tracking-widest mb-1">Últimos 30 Días</p>
          <p className="text-3xl font-display font-black italic text-white">${formatPrice(ventas30)}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
          className="bg-white/5 border border-white/10 rounded-[1.5rem] p-6">
          <p className="text-[9px] font-bold uppercase text-white/30 tracking-widest mb-1">Ticket Promedio</p>
          <p className="text-3xl font-display font-black italic text-white">${formatPrice(ticketPromedio)}</p>
        </motion.div>
      </div>

      {/* Tabla */}
      <div className="bg-white/5 border border-white/10 rounded-[1.5rem] overflow-x-auto custom-scrollbar">
        <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
          <BarChart3 size={14} className="text-brand-orange" />
          <span className="text-xs font-black uppercase tracking-widest text-white/50">Ventas Confirmadas</span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-white/20 animate-pulse text-xs uppercase font-bold">Cargando...</div>
        ) : confirmados.length === 0 ? (
          <div className="p-16 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mb-4 text-white/10">
              <TrendingUp size={28} strokeWidth={1.5} />
            </div>
            <p className="text-white/20 font-display italic uppercase">Sin ventas confirmadas todavía</p>
          </div>
        ) : (
          <>
            {/* Header tabla */}
            <div className="min-w-[800px] grid grid-cols-[1fr_auto_1fr_auto_auto] gap-4 px-5 py-3 border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-white/25">
              <span>ID</span>
              <span className="w-28">Fecha</span>
              <span>Cliente</span>
              <span className="w-28 text-right">Total</span>
              <span className="w-28">Método</span>
            </div>
            <div className="min-w-[800px]">
              {confirmados.map((p, i) => (
                <div key={p.pedidoId || p.orderId}
                className={`grid grid-cols-[1fr_auto_1fr_auto_auto] gap-4 items-center px-5 py-4 hover:bg-white/3 transition-colors ${i < confirmados.length - 1 ? 'border-b border-white/5' : ''}`}>
                <p className="text-white/50 text-xs font-black font-mono truncate">{p.pedidoId || p.orderId}</p>
                <p className="text-white/30 text-xs font-bold w-28">
                  {p.fecha ? new Date(p.fecha).toLocaleDateString('es-AR') : '—'}
                </p>
                <p className="text-white text-xs font-bold uppercase truncate">{p.clienteNombre}</p>
                <p className="text-brand-orange font-black text-sm w-28 text-right">${formatPrice(p.total)}</p>
                  <p className="text-white/30 text-[10px] font-bold uppercase w-28">{p.metodoPago || '—'}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminVentas;
