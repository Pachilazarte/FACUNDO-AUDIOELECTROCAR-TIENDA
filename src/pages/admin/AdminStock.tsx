import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { Product } from '../../types';
import { AlertTriangle, Plus, Minus, RefreshCw, Zap, Database, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getCleanImageUrl } from './priceUtils';

const AdminStock = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [adjusting, setAdjusting] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const umbral = 5;

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProductos();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleAdjust = async (product: Product, delta: number) => {
    const newStock = Math.max(0, (Number(product.stock) || 0) + delta);
    setAdjusting(String(product.id));
    try {
      await api.updateStock(String(product.id), newStock);
      showToast(`"${product.nombre}" → ${newStock} u.`);
      fetchProducts();
    } catch { alert('Error al actualizar stock'); }
    finally { setAdjusting(null); }
  };

  const handleToggleStatus = async (product: Product) => {
    const isCurrentlyActive = product.activo === true || String(product.activo).toUpperCase() === 'TRUE';
    const nextStatus = isCurrentlyActive ? 'deshabilitado' : 'habilitado';
    setAdjusting(String(product.id));
    try {
      await api.updateStockStatus(String(product.id), nextStatus);
      showToast(`"${product.nombre}" → ${nextStatus.toUpperCase()}`);
      fetchProducts();
    } catch {
      alert('Error al actualizar estado del stock');
    } finally {
      setAdjusting(null);
    }
  };

  const totalUnidades = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  const criticos = products.filter(p => (Number(p.stock) || 0) > 0 && (Number(p.stock) || 0) <= umbral);
  const sinStock = products.filter(p => (Number(p.stock) || 0) === 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-orange">
            <Zap size={13} fill="currentColor" />
            <span className="font-bold text-[10px] uppercase tracking-[0.3em]">Inventario</span>
          </div>
          <h2 className="text-3xl font-display font-black text-white uppercase italic">Stock</h2>
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Control de unidades disponibles y estados de venta</p>
        </div>
        <button onClick={fetchProducts} className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-all">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-[1.2rem] p-5">
          <p className="text-[9px] font-bold uppercase text-white/30 tracking-widest">Total Unidades</p>
          <p className="text-2xl font-display font-black text-white italic mt-0.5">{totalUnidades}</p>
        </div>
        <div className={`border rounded-[1.2rem] p-5 ${criticos.length > 0 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-white/5 border-white/10'}`}>
          <p className={`text-[9px] font-bold uppercase tracking-widest ${criticos.length > 0 ? 'text-amber-400' : 'text-white/30'}`}>Stock Crítico (≤{umbral})</p>
          <p className={`text-2xl font-display font-black italic mt-0.5 ${criticos.length > 0 ? 'text-amber-400' : 'text-white'}`}>{criticos.length}</p>
        </div>
        <div className={`border rounded-[1.2rem] p-5 ${sinStock.length > 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-white/5 border-white/10'}`}>
          <p className={`text-[9px] font-bold uppercase tracking-widest ${sinStock.length > 0 ? 'text-red-400' : 'text-white/30'}`}>Sin Stock</p>
          <p className={`text-2xl font-display font-black italic mt-0.5 ${sinStock.length > 0 ? 'text-red-400' : 'text-white'}`}>{sinStock.length}</p>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-emerald-500/10 text-emerald-400 p-3 rounded-xl border border-emerald-500/20 text-xs font-bold uppercase tracking-widest">
            ✓ {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alertas */}
      {[...sinStock, ...criticos].length > 0 && (
        <div className="bg-amber-500/5 border border-amber-500/15 rounded-[1.5rem] p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle size={14} />
            <span className="text-xs font-black uppercase tracking-widest">Requieren atención</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[...sinStock, ...criticos].map(p => (
              <span key={p.id} className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-full border ${
                (Number(p.stock)||0) === 0
                  ? 'bg-red-500/10 text-red-400 border-red-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {p.nombre} · {p.stock || 0} u.
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
        <div className="hidden md:grid min-w-[700px] grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-white/25">
          <span className="w-10">Img</span>
          <span>Producto</span>
          <span className="w-20 text-center">Stock</span>
          <span className="w-28 text-center">Estado Catálogo</span>
          <span className="w-24 text-right">Ajuste Unidades</span>
        </div>

        <div className="w-full overflow-x-auto custom-scrollbar">
          <div className="min-w-full md:min-w-[700px]">
            {loading ? (
              <div className="p-10 text-center text-white/20 animate-pulse text-xs uppercase font-bold">Cargando...</div>
            ) : products.length === 0 ? (
              <div className="p-10 flex flex-col items-center">
                <Database size={32} className="text-white/10 mb-3" strokeWidth={1.5} />
                <p className="text-white/20 text-xs uppercase font-bold">Sin productos</p>
              </div>
            ) : products.map((product, i) => {
            const stock = Number(product.stock) || 0;
            const isCrit = stock > 0 && stock <= umbral;
            const isZero = stock === 0;
            const isAdj = adjusting === String(product.id);
            const isActive = product.activo === true || String(product.activo).toUpperCase() === 'TRUE';

            return (
              <div key={product.id}
                className={`flex flex-col md:grid md:grid-cols-[auto_1fr_auto_auto_auto] gap-4 md:items-center px-5 py-4 hover:bg-white/3 transition-colors ${i < products.length - 1 ? 'border-b border-white/5' : ''} ${isZero ? 'bg-red-500/3' : isCrit ? 'bg-amber-500/3' : ''}`}>

                {/* Mobile Top Row */}
                <div className="flex items-center justify-between md:contents">
                  <div className="flex items-center gap-3 md:contents">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                      {product.imagenUrl ? (
                        <img src={getCleanImageUrl(product.imagenUrl)} alt="" className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Database size={14} className="text-white/10" strokeWidth={1} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-white font-black uppercase text-sm truncate">{product.nombre}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <p className="text-white/25 text-[10px] font-bold">ID: {product.id} · {product.categoria}</p>
                        {isZero && <span className="bg-red-500/10 text-red-400 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-red-500/20">Sin stock</span>}
                        {isCrit && <span className="bg-amber-500/10 text-amber-400 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-amber-500/20">Crítico</span>}
                      </div>
                    </div>
                  </div>

                  {/* Cantidad Stock Mobile */}
                  <div className="md:hidden w-auto text-right">
                    <p className={`text-2xl font-display font-black italic ${isZero ? 'text-red-400' : isCrit ? 'text-amber-400' : 'text-white'}`}>{stock}</p>
                    <p className="text-white/20 text-[9px] uppercase">u.</p>
                  </div>
                </div>

                {/* Cantidad Stock Desktop */}
                <div className="hidden md:block w-20 text-center">
                  <p className={`text-2xl font-display font-black italic ${isZero ? 'text-red-400' : isCrit ? 'text-amber-400' : 'text-white'}`}>{stock}</p>
                  <p className="text-white/20 text-[9px] uppercase">u.</p>
                </div>

                {/* Mobile Bottom Row */}
                <div className="flex items-center justify-between md:contents mt-2 md:mt-0">
                  {/* Estado Catálogo */}
                  <div className="w-auto md:w-28 flex justify-center">
                    <button
                      onClick={() => handleToggleStatus(product)}
                      disabled={!!isAdj}
                      className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                        isActive
                          ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/25'
                          : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/25'
                      }`}
                    >
                      {isActive ? 'Habilitado' : 'Deshabilitado'}
                    </button>
                  </div>

                  {/* Ajustar Unidades */}
                  <div className="w-auto md:w-24 flex justify-end items-center gap-1.5">
                    <button onClick={() => handleAdjust(product, -1)} disabled={stock === 0 || !!isAdj}
                      className="w-10 h-10 md:w-8 md:h-8 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl md:rounded-lg flex items-center justify-center text-red-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm">
                      <Minus size={16} className="md:w-[13px] md:h-[13px]" />
                    </button>
                    <button onClick={() => handleAdjust(product, 1)} disabled={!!isAdj}
                      className="w-10 h-10 md:w-8 md:h-8 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl md:rounded-lg flex items-center justify-center text-emerald-400 transition-all disabled:opacity-30 shadow-sm">
                      {isAdj ? <RefreshCw size={16} className="animate-spin md:w-[13px] md:h-[13px]" /> : <Plus size={16} className="md:w-[13px] md:h-[13px]" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStock;
