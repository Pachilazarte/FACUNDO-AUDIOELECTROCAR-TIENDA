import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { Product } from '../../types';
import { Plus, Edit2, Trash2, X, Save, Search, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const EMPTY_PRODUCT: Partial<Product> = {
  nombre: '',
  descripcion: '',
  categoria: 'audio',
  precio: 0,
  imagenUrl: '',
  destacado: false,
  masVendido: false,
  novedad: false,
  activo: true,
};

const AdminProductos = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [search, setSearch] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProductos();
      setProducts(Array.isArray(data) ? data : []);
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

  const handleToggleActive = async (product: Product) => {
    try {
      await api.saveProduct({ ...product, activo: !product.activo });
      showSuccess(`Producto ${!product.activo ? 'activado' : 'desactivado'}`);
      fetchProducts();
    } catch (err) {
      alert('Error al actualizar estado');
    }
  };

  const handleSave = async () => {
    if (!editingProduct) return;
    setSaving(true);
    try {
      await api.saveProduct(editingProduct);
      showSuccess(editingProduct.id ? 'Producto actualizado' : 'Producto creado');
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      alert('Error al guardar producto');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editingProduct) return;
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setEditingProduct({
      ...editingProduct,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    });
  };

  const filtered = products.filter(p =>
    p.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    p.categoria?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-display font-black text-brand-navy uppercase italic">Productos</h2>
          <p className="text-xs text-brand-black/40 font-bold uppercase tracking-widest mt-1">Gestión del Inventario · {products.length} productos</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchProducts} className="p-3 text-brand-navy hover:text-brand-orange transition-all">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setEditingProduct({ ...EMPTY_PRODUCT })}
            className="bg-brand-orange text-white px-6 py-3 flex items-center gap-2 font-display font-bold uppercase text-[10px] tracking-widest hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus size={16} /> Nuevo Producto
          </button>
        </div>
      </div>

      {/* Success message */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-emerald-50 text-emerald-700 p-4 border-l-4 border-emerald-500 text-xs font-bold uppercase"
          >
            ✓ {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-black/30" />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-brand-gray-mid text-xs font-bold uppercase outline-none focus:border-brand-orange transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-brand-gray-mid shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-brand-navy text-white font-display text-[10px] uppercase tracking-[0.2em]">
            <tr>
              <th className="px-6 py-4">Imagen</th>
              <th className="px-6 py-4">Nombre / Categoría</th>
              <th className="px-6 py-4">Precio</th>
              <th className="px-6 py-4">Flags</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-gray-mid">
            {loading ? (
              <tr><td colSpan={6} className="p-10 text-center animate-pulse text-sm text-brand-black/40">Cargando catálogo...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="p-10 text-center italic text-brand-black/20 uppercase tracking-widest text-xs">Sin productos</td></tr>
            ) : filtered.map((product) => (
              <tr key={product.id} className="hover:bg-brand-gray-light/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-12 h-12 bg-brand-gray-light overflow-hidden border border-brand-gray-mid">
                    {product.imagenUrl ? (
                      <img src={product.imagenUrl} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-black/10 text-xs">N/A</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-brand-navy uppercase">{product.nombre}</p>
                  <p className="text-[10px] text-brand-black/40 uppercase font-medium">ID: {product.id} · {product.categoria}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-xs font-bold">${Number(product.precio).toLocaleString()}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1 flex-wrap">
                    {product.destacado && <span className="px-2 py-0.5 bg-brand-orange/10 text-brand-orange text-[8px] font-black uppercase rounded-full">★ Dest.</span>}
                    {product.masVendido && <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase rounded-full">🔥 Top</span>}
                    {product.novedad && <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[8px] font-black uppercase rounded-full">✦ Nuevo</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleActive(product)}
                    className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full transition-all ${
                      product.activo ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {product.activo ? '● Activo' : '○ Inactivo'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingProduct({ ...product })}
                      className="p-2 text-brand-navy hover:text-brand-orange transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Editar / Crear */}
      <AnimatePresence>
        {editingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6"
            onClick={(e) => { if (e.target === e.currentTarget) setEditingProduct(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-t-4 border-brand-orange"
            >
              <div className="flex justify-between items-center p-6 border-b border-brand-gray-mid">
                <h3 className="font-display font-black text-brand-navy uppercase italic text-lg">
                  {editingProduct.id ? 'Editar Producto' : 'Nuevo Producto'}
                </h3>
                <button onClick={() => setEditingProduct(null)} className="text-brand-black/30 hover:text-brand-black">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/50">Nombre</label>
                    <input name="nombre" value={editingProduct.nombre || ''} onChange={handleChange}
                      className="w-full p-3 bg-brand-gray-light border-2 border-transparent focus:border-brand-orange text-sm font-bold outline-none transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/50">Precio</label>
                    <input name="precio" type="number" value={editingProduct.precio || 0} onChange={handleChange}
                      className="w-full p-3 bg-brand-gray-light border-2 border-transparent focus:border-brand-orange text-sm font-bold outline-none transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/50">Categoría</label>
                    <select name="categoria" value={editingProduct.categoria || 'audio'} onChange={handleChange}
                      className="w-full p-3 bg-brand-gray-light border-2 border-transparent focus:border-brand-orange text-sm font-bold outline-none transition-all">
                      <option value="audio">Audio</option>
                      <option value="accesorios-auto">Accesorios Auto</option>
                      <option value="electrodomesticos">Electrónica</option>
                    </select>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/50">URL Imagen</label>
                    <input name="imagenUrl" value={editingProduct.imagenUrl || ''} onChange={handleChange}
                      className="w-full p-3 bg-brand-gray-light border-2 border-transparent focus:border-brand-orange text-xs outline-none transition-all" />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/50">Descripción</label>
                    <textarea name="descripcion" value={editingProduct.descripcion || ''} onChange={handleChange} rows={3}
                      className="w-full p-3 bg-brand-gray-light border-2 border-transparent focus:border-brand-orange text-sm outline-none transition-all resize-none" />
                  </div>
                </div>

                <div className="flex gap-6">
                  {(['destacado', 'masVendido', 'novedad', 'activo'] as const).map((flag) => (
                    <label key={flag} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name={flag} checked={!!editingProduct[flag]} onChange={handleChange}
                        className="w-4 h-4 accent-brand-orange" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-black/60">{flag}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-brand-gray-mid flex justify-end gap-3">
                <button onClick={() => setEditingProduct(null)}
                  className="px-6 py-3 border-2 border-brand-gray-mid text-brand-black/50 text-xs font-bold uppercase tracking-widest hover:border-brand-black/30 transition-all">
                  Cancelar
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="bg-brand-orange text-white px-8 py-3 flex items-center gap-2 font-display font-black uppercase text-xs tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-50">
                  <Save size={16} /> {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProductos;