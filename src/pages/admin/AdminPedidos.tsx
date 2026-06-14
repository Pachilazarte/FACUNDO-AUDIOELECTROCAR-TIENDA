import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { Pedido } from '../../types';
import { Eye, CheckCircle2, XCircle, ExternalLink, RefreshCw, X, Zap, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatPrice } from './priceUtils';

const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [detalle, setDetalle] = useState<Pedido | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => { fetchPedidos(); }, []);

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const data = await api.getAllPedidos();
      setPedidos(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.updatePedidoStatus(id, status);
      showToast(`Pedido ${status.toLowerCase()} ✓`);
      fetchPedidos();
    } catch { alert('Error al actualizar pedido'); }
  };

  const getStatusStyle = (status: string) => {
    const s = (status || '').toUpperCase();
    if (['CONFIRMADO', 'PROCESSED', 'CONFIRMED'].includes(s)) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (['CANCELADO', 'CANCELED', 'CANCELLED'].includes(s)) return 'bg-red-500/10 text-red-400 border-red-500/20';
    return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  };

  const isPending = (status: string) => ['PENDIENTE', 'PENDING'].includes((status || '').toUpperCase());

  const stats = [
    { label: 'Total', value: pedidos.length, color: 'border-white/10 bg-white/5' },
    { label: 'Pendientes', value: pedidos.filter(p => isPending(p.estado)).length, color: 'border-amber-500/20 bg-amber-500/10' },
    { label: 'Confirmados', value: pedidos.filter(p => ['CONFIRMADO','PROCESSED','CONFIRMED'].includes((p.estado||'').toUpperCase())).length, color: 'border-emerald-500/20 bg-emerald-500/10' },
    { label: 'Cancelados', value: pedidos.filter(p => ['CANCELADO','CANCELED','CANCELLED'].includes((p.estado||'').toUpperCase())).length, color: 'border-red-500/20 bg-red-500/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-orange">
            <Zap size={13} fill="currentColor" />
            <span className="font-bold text-[10px] uppercase tracking-[0.3em]">Gestión</span>
          </div>
          <h2 className="text-3xl font-display font-black text-white uppercase italic">Pedidos</h2>
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">{pedidos.length} órdenes registradas</p>
        </div>
        <button onClick={fetchPedidos} className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-all">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className={`${s.color} border rounded-[1.2rem] p-4 text-center md:text-left`}>
            <p className="text-[9px] font-bold uppercase text-white/30 tracking-widest">{s.label}</p>
            <p className="text-2xl font-display font-black text-white italic mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-emerald-500/10 text-emerald-400 p-3 rounded-xl border border-emerald-500/20 text-xs font-bold uppercase tracking-widest">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabla */}
      <div className="bg-white/5 border border-white/10 rounded-[1.5rem] overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-4 px-5 py-3 border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-white/25">
            <span>ID / Fecha</span>
            <span>Cliente</span>
            <span>Productos</span>
            <span className="text-right w-24">Total</span>
            <span className="text-right w-28">Acciones</span>
          </div>

          {loading ? (
            <div className="p-10 text-center text-white/20 animate-pulse text-xs uppercase font-bold">Cargando órdenes...</div>
          ) : pedidos.length === 0 ? (
            <div className="p-10 flex flex-col items-center">
              <ShoppingCart size={32} className="text-white/10 mb-3" strokeWidth={1.5} />
              <p className="text-white/20 text-xs uppercase font-bold">No hay pedidos registrados</p>
            </div>
          ) : pedidos.map((pedido, i) => (
            <div key={pedido.pedidoId || pedido.orderId}
              className={`grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-4 items-center px-5 py-4 hover:bg-white/3 transition-colors ${i < pedidos.length - 1 ? 'border-b border-white/5' : ''}`}>

              {/* ID / Fecha */}
              <div>
                <p className="text-white text-xs font-black font-mono">{pedido.pedidoId || pedido.orderId}</p>
                <p className="text-white/30 text-[10px] mt-0.5">
                  {pedido.fecha ? new Date(pedido.fecha).toLocaleDateString('es-AR') : '—'}
                </p>
                <span className={`inline-block mt-1 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-full border ${getStatusStyle(pedido.estado)}`}>
                  {pedido.estado || 'PENDIENTE'}
                </span>
              </div>

              {/* Cliente */}
              <div>
                <p className="text-white text-xs font-black uppercase">{pedido.clienteNombre}</p>
                <p className="text-white/30 text-[10px] truncate">{pedido.clienteEmail}</p>
                {pedido.clienteTelefono && (
                  <a href={`https://wa.me/${String(pedido.clienteTelefono).replace(/\D/g,'')}`}
                    target="_blank" rel="noreferrer"
                    className="text-[10px] text-brand-orange hover:underline flex items-center gap-1 uppercase font-bold mt-0.5">
                    <ExternalLink size={9} /> WhatsApp
                  </a>
                )}
              </div>

              {/* Productos */}
              <div>
                <p className="text-white/40 text-[10px] line-clamp-2">{pedido.productosDetalle || '—'}</p>
                <p className="text-white/20 text-[9px] mt-0.5">Cant: {pedido.cantidadTotal || 1}</p>
              </div>

              {/* Total */}
              <div className="w-24 text-right">
                <p className="text-brand-orange font-black text-sm">${formatPrice(pedido.total)}</p>
              </div>

              {/* Acciones */}
              <div className="w-28 flex justify-end items-center gap-1">
                {isPending(pedido.estado) && (
                  <>
                    <button onClick={() => handleUpdateStatus(pedido.pedidoId || pedido.orderId, 'CONFIRMADO')}
                      className="w-8 h-8 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 transition-all" title="Confirmar">
                      <CheckCircle2 size={14} />
                    </button>
                    <button onClick={() => handleUpdateStatus(pedido.pedidoId || pedido.orderId, 'CANCELADO')}
                      className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg flex items-center justify-center text-red-400 transition-all" title="Cancelar">
                      <XCircle size={14} />
                    </button>
                  </>
                )}
                <button onClick={() => setDetalle(pedido)}
                  className="w-8 h-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-white/30 hover:text-white transition-all">
                  <Eye size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Detalle */}
      <AnimatePresence>
        {detalle && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={(e) => { if (e.target === e.currentTarget) setDetalle(null); }}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-[#0f0f0f] border border-white/10 rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-white/5">
                <div>
                  <h3 className="font-display font-black text-white uppercase italic">Detalle del Pedido</h3>
                  <p className="text-white/30 text-[10px] uppercase font-bold mt-0.5">{detalle.pedidoId || detalle.orderId}</p>
                </div>
                <button onClick={() => setDetalle(null)} className="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-white/30 hover:text-white transition-all">
                  <X size={16} />
                </button>
              </div>
              <div className="p-6 space-y-2">
                {[
                  ['Fecha', detalle.fecha ? new Date(detalle.fecha).toLocaleString('es-AR') : '—'],
                  ['Cliente', detalle.clienteNombre],
                  ['Email', detalle.clienteEmail],
                  ['Teléfono', detalle.clienteTelefono],
                  ['Productos', detalle.productosDetalle],
                  ['Cantidad', detalle.cantidadTotal],
                  ['Total', `$${formatPrice(detalle.total)}`],
                  ['Método de Pago', detalle.metodoPago],
                  ['Estado', detalle.estado],
                ].map(([label, value]) => (
                  <div key={String(label)} className="flex gap-4 py-2 border-b border-white/5 last:border-0">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/25 w-28 shrink-0">{label}</span>
                    <span className="text-xs font-bold text-white/60">{String(value || '—')}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPedidos;
