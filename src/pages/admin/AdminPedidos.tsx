import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { Pedido } from '../../types';
import { Eye, CheckCircle2, XCircle, ExternalLink, RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [detalle, setDetalle] = useState<Pedido | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const data = await api.getAllPedidos();
      setPedidos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.updatePedidoStatus(id, status);
      showSuccess(`Pedido ${status.toLowerCase()}`);
      fetchPedidos();
    } catch (err) {
      alert('Error al actualizar pedido');
    }
  };

  const getStatusStyle = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'CONFIRMADO' || s === 'PROCESSED' || s === 'CONFIRMED') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (s === 'CANCELADO' || s === 'CANCELED' || s === 'CANCELLED') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-amber-100 text-amber-700 border-amber-200';
  };

  const isPending = (status: string) => {
    const s = (status || '').toUpperCase();
    return s === 'PENDIENTE' || s === 'PENDING';
  };

  const pendientes = pedidos.filter(p => isPending(p.estado)).length;
  const confirmados = pedidos.filter(p => {
    const s = (p.estado || '').toUpperCase();
    return s === 'CONFIRMADO' || s === 'PROCESSED' || s === 'CONFIRMED';
  }).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-display font-black text-brand-navy uppercase italic">Pedidos</h2>
          <p className="text-xs text-brand-black/40 font-bold uppercase tracking-widest mt-1">Órdenes de Compra · {pedidos.length} total</p>
        </div>
        <button onClick={fetchPedidos} className="p-3 text-brand-navy hover:text-brand-orange transition-all">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: pedidos.length, color: 'border-brand-navy' },
          { label: 'Pendientes', value: pendientes, color: 'border-amber-400' },
          { label: 'Confirmados', value: confirmados, color: 'border-emerald-500' },
        ].map((s) => (
          <div key={s.label} className={`bg-white p-5 border-l-4 ${s.color} shadow-sm`}>
            <p className="text-[10px] font-bold uppercase text-brand-black/40 tracking-widest">{s.label}</p>
            <p className="text-2xl font-display font-black text-brand-navy italic mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Success */}
      <AnimatePresence>
        {successMsg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-emerald-50 text-emerald-700 p-4 border-l-4 border-emerald-500 text-xs font-bold uppercase">
            ✓ {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-white border border-brand-gray-mid shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-brand-navy text-white font-display text-[10px] uppercase tracking-[0.2em]">
            <tr>
              <th className="px-6 py-4">ID / Fecha</th>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Productos</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-gray-mid">
            {loading ? (
              <tr><td colSpan={6} className="p-10 text-center animate-pulse text-sm text-brand-black/40">Cargando órdenes...</td></tr>
            ) : pedidos.length === 0 ? (
              <tr><td colSpan={6} className="p-10 text-center italic text-brand-black/20 uppercase tracking-widest text-xs">No hay pedidos registrados</td></tr>
            ) : pedidos.map((pedido) => (
              <tr key={pedido.pedidoId || pedido.orderId} className="hover:bg-brand-gray-light/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-xs font-bold text-brand-navy font-mono">{pedido.pedidoId || pedido.orderId}</p>
                  <p className="text-[10px] text-brand-black/40 uppercase mt-0.5">
                    {pedido.fecha ? new Date(pedido.fecha).toLocaleDateString('es-AR') : '—'}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs font-bold text-brand-navy uppercase">{pedido.clienteNombre}</p>
                  <p className="text-[10px] text-brand-black/40">{pedido.clienteEmail}</p>
                  {pedido.clienteTelefono && (
                    <a
                      href={`https://wa.me/${String(pedido.clienteTelefono).replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-brand-orange hover:underline flex items-center gap-1 uppercase font-bold mt-0.5"
                    >
                      <ExternalLink size={10} /> WhatsApp
                    </a>
                  )}
                </td>
                <td className="px-6 py-4 max-w-[200px]">
                  <p className="text-[10px] text-brand-black/60 truncate">{pedido.productosDetalle || '—'}</p>
                  <p className="text-[10px] text-brand-black/40">Cant: {pedido.cantidadTotal || 1}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-xs font-bold">${Number(pedido.total || 0).toLocaleString()}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full border ${getStatusStyle(pedido.estado)}`}>
                    {pedido.estado || 'PENDIENTE'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    {isPending(pedido.estado) && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(pedido.pedidoId || pedido.orderId, 'CONFIRMADO')}
                          className="p-2 text-emerald-500 hover:bg-emerald-50 transition-colors rounded"
                          title="Confirmar"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(pedido.pedidoId || pedido.orderId, 'CANCELADO')}
                          className="p-2 text-red-400 hover:bg-red-50 transition-colors rounded"
                          title="Cancelar"
                        >
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setDetalle(pedido)}
                      className="p-2 text-brand-navy hover:text-brand-orange transition-colors rounded"
                      title="Ver detalle"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Detalle */}
      <AnimatePresence>
        {detalle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6"
            onClick={(e) => { if (e.target === e.currentTarget) setDetalle(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95 }}
              className="bg-white w-full max-w-lg shadow-2xl border-t-4 border-brand-orange"
            >
              <div className="flex justify-between items-center p-6 border-b border-brand-gray-mid">
                <h3 className="font-display font-black text-brand-navy uppercase italic">Detalle del Pedido</h3>
                <button onClick={() => setDetalle(null)} className="text-brand-black/30 hover:text-brand-black">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {[
                  ['ID', detalle.pedidoId || detalle.orderId],
                  ['Fecha', detalle.fecha ? new Date(detalle.fecha).toLocaleString('es-AR') : '—'],
                  ['Cliente', detalle.clienteNombre],
                  ['Email', detalle.clienteEmail],
                  ['Teléfono', detalle.clienteTelefono],
                  ['Productos', detalle.productosDetalle],
                  ['Cantidad', detalle.cantidadTotal],
                  ['Total', `$${Number(detalle.total || 0).toLocaleString()}`],
                  ['Método de Pago', detalle.metodoPago],
                  ['Estado', detalle.estado],
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 w-28 shrink-0">{label}</span>
                    <span className="text-xs font-bold text-brand-navy">{String(value || '—')}</span>
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