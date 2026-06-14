import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { Product } from '../../types';
import { Plus, Edit2, X, Save, Search, RefreshCw, Zap, Package, PackageOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { parsePrice, formatPrice, getCleanImageUrl } from './priceUtils';

const EMPTY_PRODUCT: Partial<Product> = {
  nombre: '', descripcion: '', categoria: '',
  precio: 0, imagenUrl: '', destacado: false,
  masVendido: false, novedad: false, activo: true,
  stock: 10,
};

const AdminProductos = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [priceInput, setPriceInput] = useState(''); // precio como string editable
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
  const [imageFile, setImageFile] = useState<{ base64: string; type: string; name: string } | null>(null);
  const [stockToSum, setStockToSum] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState('todos');
  const [isMassEditing, setIsMassEditing] = useState(false);
  const [massEditProducts, setMassEditProducts] = useState<Product[]>([]);
  const [stockFlowStep, setStockFlowStep] = useState<'SELECT' | 'FORM' | null>(null);
  const [selectedCatForUpload, setSelectedCatForUpload] = useState<string>('');

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    const cached = localStorage.getItem('aec_productos');
    if (cached) {
      try {
        setProducts(JSON.parse(cached));
        setLoading(false);
      } catch (e) {}
    } else {
      setLoading(true);
    }
    try {
      const data = await api.getProductos();
      const safeData = Array.isArray(data) ? data : [];
      setProducts(safeData);
      localStorage.setItem('aec_productos', JSON.stringify(safeData));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const openEdit = (product: Partial<Product>) => {
    setEditingProduct({ ...product });
    setPriceInput(product.precio !== undefined ? String(parsePrice(product.precio)) : '0');
    setShowCustomCategoryInput(false);
    setImageFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageFile({
        base64: reader.result as string,
        type: file.type,
        name: file.name
      });
      // También guardamos temporalmente en el preview del producto
      setEditingProduct(prev => prev ? { ...prev, imagenUrl: reader.result as string } : null);
    };
    reader.readAsDataURL(file);
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await api.saveProduct({ ...product, activo: !product.activo });
      showToast(`Producto ${!product.activo ? 'activado' : 'desactivado'}`);
      fetchProducts();
    } catch { alert('Error al actualizar estado'); }
  };

  const handleSave = async () => {
    if (!editingProduct) return;
    setSaving(true);
    try {
      const payload: Record<string, any> = {
        ...editingProduct,
        precio: parsePrice(priceInput), // convertir precio limpio
      };

      if (editingProduct.id) {
        payload.stock = (editingProduct.stock || 0) + Number(stockToSum || 0);
      }

      if (imageFile) {
        payload.archivo = imageFile.base64;
        payload.tipo = imageFile.type;
        payload.nombreArchivo = imageFile.name;
      }

      await api.saveProduct(payload);
      showToast(editingProduct.id ? 'Producto actualizado ✓' : 'Producto creado ✓');
      setEditingProduct(null);
      setImageFile(null);
      
      // Pequeño retardo para asegurar que Google Sheets terminó de escribir la fila
      setTimeout(() => {
        fetchProducts();
      }, 800);
    } catch (err) {
      console.error(err);
      alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const startMassEdit = () => {
    setMassEditProducts(JSON.parse(JSON.stringify(filtered)));
    setIsMassEditing(true);
  };

  const saveMassEdit = async () => {
    setSaving(true);
    try {
      await api.batchSaveProducts(massEditProducts);
      showToast('Productos actualizados ✓');
      setIsMassEditing(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Error al guardar masivamente');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editingProduct) return;
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name === 'categoria' && value === '__NEW_CATEGORY__') {
      setShowCustomCategoryInput(true);
      setEditingProduct({
        ...editingProduct,
        categoria: '',
      });
      return;
    }

    setEditingProduct({
      ...editingProduct,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value),
    });
  };

  const filtered = products.filter(p => {
    const matchesSearch = 
      String(p.nombre || '').toLowerCase().includes(search.toLowerCase()) ||
      String(p.categoria || '').toLowerCase().includes(search.toLowerCase());
    
    const pCat = String(p.categoria || (p as any).category || '').trim().toLowerCase();
    const matchesCategory = filterCategory === 'todos' || pCat === filterCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-orange">
            <Zap size={13} fill="currentColor" />
            <span className="font-bold text-[10px] uppercase tracking-[0.3em]">Inventario</span>
          </div>
          <h2 className="text-3xl font-display font-black text-white uppercase italic">Productos</h2>
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">{products.length} en catálogo</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
          <button onClick={fetchProducts} className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex-shrink-0 flex items-center justify-center text-white/40 hover:text-white transition-all">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => isMassEditing ? saveMassEdit() : startMassEdit()}
            className="flex-1 md:flex-none justify-center bg-white/5 border border-white/10 hover:border-white/30 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-display font-black uppercase text-[10px] tracking-widest transition-all whitespace-nowrap">
            {isMassEditing ? <><Save size={14} /> Guardar</> : <><Edit2 size={14} /> Edición Masiva</>}
          </button>
          {!isMassEditing && (
            <button onClick={() => setStockFlowStep('SELECT')}
              className="flex-1 md:flex-none justify-center bg-brand-orange text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-display font-black uppercase text-[10px] tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-brand-orange/20 whitespace-nowrap">
              <PackageOpen size={14} /> <span className="hidden sm:inline">Cargar</span> Nuevo
            </button>
          )}
        </div>
      </div>

      {/* Toast Notificación Flotante */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-emerald-500/20 text-emerald-400 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-emerald-500/30 shadow-2xl flex items-center gap-3 text-xs font-black uppercase tracking-[0.15em]"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filtros (Búsqueda y Categorías) */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative w-full max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
          <input type="text" placeholder="Buscar productos..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-bold placeholder:text-white/20 outline-none focus:border-brand-orange/40 transition-all"
          />
        </div>

        {/* Selector de Categorías (Exclusivamente del Backend) */}
        <div className="w-full sm:w-56">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-bold outline-none focus:border-brand-orange/40 transition-all uppercase cursor-pointer"
          >
            <option value="todos" className="bg-[#0f0f0f] text-white/40">Todas las Categorías</option>
            {Array.from(
              new Set(
                products
                  .map(p => String(p.categoria || (p as any).category || '').trim().toLowerCase())
                  .filter(Boolean)
              )
            ).map(cat => (
              <option key={cat} value={cat} className="bg-[#0f0f0f] text-white uppercase">{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla / filas */}
      <div className="bg-white/5 border border-white/10 rounded-[1.5rem] overflow-hidden">
        {/* Header tabla */}
        <div className="hidden md:grid min-w-[900px] grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-white/25">
          <span className="w-10">Img</span>
          <span>Nombre / Categoría</span>
          <span className="w-24 text-right">Precio</span>
          <span className="w-20 text-center">Flags</span>
          <span className="w-20 text-center">Estado</span>
          <span className="w-16 text-right">Acc.</span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-white/20 animate-pulse text-xs uppercase font-bold">Cargando catálogo...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 flex flex-col items-center text-center">
            <Package size={32} className="text-white/10 mb-3" strokeWidth={1.5} />
            <p className="text-white/20 text-xs uppercase font-bold">Sin productos</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto custom-scrollbar">
            <div className="min-w-full md:min-w-[900px]">
              {isMassEditing ? massEditProducts.map((product, i) => (
                <div key={product.id}
                  className={`flex flex-col md:grid md:grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 md:items-center px-5 py-4 hover:bg-white/3 transition-colors ${i < massEditProducts.length - 1 ? 'border-b border-white/5' : ''}`}>
                  
                  {/* Mobile Row 1: Image & Name */}
                  <div className="flex items-center gap-3 md:contents">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                      {product.imagenUrl ? (
                        <img src={getCleanImageUrl(product.imagenUrl)} alt="" className="w-full h-full object-cover" />
                      ) : <Package size={14} className="text-white/10" />}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <input type="text" value={product.nombre} onChange={(e) => {
                        const newProds = [...massEditProducts];
                        newProds[i].nombre = e.target.value;
                        setMassEditProducts(newProds);
                      }} className="bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white uppercase font-bold outline-none focus:border-brand-orange/50 w-full" placeholder="Nombre del producto" />
                      
                      {/* Desktop Stock (oculto en móvil) */}
                      <input type="number" value={product.stock} onChange={(e) => {
                        const newProds = [...massEditProducts];
                        newProds[i].stock = Number(e.target.value);
                        setMassEditProducts(newProds);
                      }} className="hidden md:block bg-white/5 border border-white/10 rounded px-2 py-1 text-[10px] text-white outline-none focus:border-brand-orange/50 w-24" placeholder="Stock" />
                    </div>
                  </div>

                  {/* Mobile Row 2: Stock & Price (Sólo visible en celular) */}
                  <div className="flex items-center gap-3 md:hidden">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-[9px] uppercase font-black tracking-widest pointer-events-none">STOCK</span>
                      <input type="number" value={product.stock} onChange={(e) => {
                        const newProds = [...massEditProducts];
                        newProds[i].stock = Number(e.target.value);
                        setMassEditProducts(newProds);
                      }} className="w-full pl-16 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white outline-none focus:border-brand-orange/50 font-bold" />
                    </div>
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-orange/60 font-black pointer-events-none">$</span>
                      <input type="number" value={product.precio} onChange={(e) => {
                        const newProds = [...massEditProducts];
                        newProds[i].precio = Number(e.target.value);
                        setMassEditProducts(newProds);
                      }} className="w-full pl-7 pr-3 py-2 bg-brand-orange/5 border border-brand-orange/20 rounded-lg text-xs text-brand-orange font-bold outline-none focus:border-brand-orange/50 text-right" />
                    </div>
                  </div>

                  {/* Desktop Price */}
                  <div className="hidden md:flex w-24 text-right flex-col items-end justify-center">
                    <input type="number" value={product.precio} onChange={(e) => {
                      const newProds = [...massEditProducts];
                      newProds[i].precio = Number(e.target.value);
                      setMassEditProducts(newProds);
                    }} className="bg-brand-orange/5 border border-brand-orange/20 rounded px-2 py-1.5 text-xs text-brand-orange font-bold outline-none focus:border-brand-orange/50 w-full text-right" />
                  </div>

                  {/* Mobile Row 3: Flags */}
                  <div className="flex items-center justify-between gap-2 md:contents mt-2 md:mt-0 bg-white/5 md:bg-transparent rounded-lg p-3 md:p-0 border border-white/5 md:border-none">
                    <div className="flex gap-4 md:flex-col md:gap-1 md:w-20 md:text-center justify-start md:justify-center">
                       <label className="text-[10px] text-white/50 flex items-center gap-1.5 cursor-pointer select-none">
                         <input type="checkbox" checked={product.destacado} onChange={(e) => {
                            const newProds = [...massEditProducts]; newProds[i].destacado = e.target.checked; setMassEditProducts(newProds);
                         }} className="accent-orange-500 w-3 h-3" /> Destacado
                       </label>
                       <label className="text-[10px] text-white/50 flex items-center gap-1.5 cursor-pointer select-none">
                         <input type="checkbox" checked={product.masVendido} onChange={(e) => {
                            const newProds = [...massEditProducts]; newProds[i].masVendido = e.target.checked; setMassEditProducts(newProds);
                         }} className="accent-orange-500 w-3 h-3" /> +Vendido
                       </label>
                    </div>
                    <div className="w-auto md:w-20 flex justify-end md:justify-center">
                       <label className="text-[10px] text-emerald-400 flex items-center gap-1.5 cursor-pointer select-none font-bold">
                         <input type="checkbox" checked={product.activo} onChange={(e) => {
                            const newProds = [...massEditProducts]; newProds[i].activo = e.target.checked; setMassEditProducts(newProds);
                         }} className="accent-emerald-500 w-3 h-3" /> Activo
                       </label>
                    </div>
                    <div className="hidden md:flex w-16 justify-end"></div>
                  </div>
                </div>
              )) : filtered.map((product, i) => (
                <div key={product.id}
                  className={`flex flex-col md:grid md:grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 md:items-center px-5 py-4 hover:bg-white/3 transition-colors ${i < filtered.length - 1 ? 'border-b border-white/5' : ''}`}>

                  {/* Mobile Top Row: Image & Name */}
                  <div className="flex items-center gap-3 md:contents">
                    {/* Imagen */}
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                      {product.imagenUrl ? (
                        <img src={getCleanImageUrl(product.imagenUrl)} alt="" className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={14} className="text-white/10" strokeWidth={1} />
                        </div>
                      )}
                    </div>

                    {/* Nombre */}
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-black uppercase text-sm truncate">{product.nombre}</p>
                      <p className="text-white/25 text-[10px] font-bold">ID: {product.id} · {product.categoria}</p>
                    </div>
                    
                    {/* Precio en Mobile */}
                    <div className="md:hidden text-right">
                      <p className="text-brand-orange font-black text-sm">${formatPrice(product.precio)}</p>
                    </div>
                  </div>

                  {/* Precio en Desktop */}
                  <div className="hidden md:block w-24 text-right">
                    <p className="text-brand-orange font-black text-sm">${formatPrice(product.precio)}</p>
                  </div>

                  {/* Mobile Bottom Row */}
                  <div className="flex items-center justify-between gap-2 md:contents mt-3 md:mt-0">
                    {/* Flags */}
                    <div className="flex-1 flex flex-wrap gap-1 justify-start md:w-20 md:justify-center">
                      {(product.novedad === true || String(product.novedad).toUpperCase() === 'TRUE') && (
                        <span className="bg-purple-500/10 text-purple-400 text-[7px] font-black uppercase px-1.5 py-0.5 rounded-full border border-purple-500/20">NEW</span>
                      )}
                      {(product.destacado === true || String(product.destacado).toUpperCase() === 'TRUE') && (
                        <span className="bg-brand-orange/10 text-brand-orange text-[7px] font-black uppercase px-1.5 py-0.5 rounded-full border border-brand-orange/20">★</span>
                      )}
                      {(product.masVendido === true || String(product.masVendido).toUpperCase() === 'TRUE') && (
                        <span className="bg-blue-500/10 text-blue-400 text-[7px] font-black uppercase px-1.5 py-0.5 rounded-full border border-blue-500/20">🔥</span>
                      )}
                    </div>

                    {/* Estado */}
                    <div className="w-auto md:w-20 flex justify-center">
                      <button onClick={() => handleToggleActive(product)}
                        className={`px-2.5 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${
                          (product.activo === true || String(product.activo).toUpperCase() === 'TRUE')
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                        }`}>
                        {(product.activo === true || String(product.activo).toUpperCase() === 'TRUE') ? 'Activo' : 'Inactivo'}
                      </button>
                    </div>

                    {/* Editar */}
                    <div className="w-auto md:w-16 flex justify-end">
                      <button onClick={() => {
                        setEditingProduct(product);
                        setPriceInput(product.precio?.toString() || '0');
                        setImageFile(null);
                        setStockFlowStep('FORM');
                      }}
                        className="w-8 h-8 bg-white/5 hover:bg-brand-orange/10 hover:text-brand-orange border border-white/10 hover:border-brand-orange/30 rounded-xl flex items-center justify-center text-white/30 transition-all">
                        <Edit2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Editar / Crear / Stock Flow */}
      <AnimatePresence>
        {stockFlowStep === 'SELECT' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-[#0f0f0f] border border-white/10 rounded-[2rem] w-full max-w-2xl shadow-2xl relative overflow-hidden flex flex-col">
              
              <div className="flex justify-between items-center p-7 border-b border-white/5 bg-white/5">
                <div>
                  <h3 className="font-display font-black text-white uppercase italic text-xl">Gestión de Stock</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">¿Qué deseas hacer?</p>
                </div>
                <button onClick={() => setStockFlowStep(null)} className="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-white/30 hover:text-white transition-all">
                  <X size={16} />
                </button>
              </div>

              <div className="p-7 space-y-8">
                {/* Option 1: Update Existing */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-brand-orange">
                    <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center text-xs font-black">1</div>
                    <h4 className="text-xs font-bold uppercase tracking-widest">Actualizar stock de producto existente</h4>
                  </div>
                  
                  <div className="pl-9 space-y-3">
                    <select
                      value={selectedCatForUpload}
                      onChange={(e) => setSelectedCatForUpload(e.target.value)}
                      className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-bold outline-none focus:border-brand-orange/50 transition-all uppercase"
                    >
                      <option value="" disabled className="bg-[#0f0f0f] text-white/30">Seleccionar Categoría para buscar...</option>
                      {Array.from(new Set(products.map(p => String(p.categoria || (p as any).category || '').trim().toLowerCase()).filter(Boolean))).map(cat => (
                        <option key={cat} value={cat} className="bg-[#0f0f0f] text-white uppercase">{cat}</option>
                      ))}
                    </select>

                    {selectedCatForUpload && (
                      <div className="bg-black/30 border border-white/5 rounded-xl p-2 max-h-48 overflow-y-auto custom-scrollbar space-y-1">
                        {products.filter(p => String(p.categoria || (p as any).category || '').trim().toLowerCase() === selectedCatForUpload).map(p => (
                          <button
                            key={p.id}
                            onClick={() => {
                              setEditingProduct(p);
                              setPriceInput(p.precio?.toString() || '0');
                              setImageFile(null);
                              setStockToSum('');
                              setStockFlowStep('FORM');
                            }}
                            className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-white/5 transition-colors group text-left"
                          >
                            <div>
                              <p className="text-xs font-bold text-white uppercase">{p.nombre}</p>
                              <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">Stock actual: <span className={p.stock! <= 5 ? 'text-brand-orange' : 'text-emerald-400'}>{p.stock} u.</span></p>
                            </div>
                            <Edit2 size={14} className="text-white/20 group-hover:text-brand-orange transition-colors" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-px bg-white/10 flex-grow" />
                  <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">O</span>
                  <div className="h-px bg-white/10 flex-grow" />
                </div>

                {/* Option 2: Create New */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-emerald-400">
                    <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center text-xs font-black">2</div>
                    <h4 className="text-xs font-bold uppercase tracking-widest">Subir un producto totalmente nuevo</h4>
                  </div>
                  <div className="pl-9">
                    <button onClick={() => {
                      setEditingProduct({ nombre: '', precio: 0, stock: 10, categoria: '', activo: true } as any);
                      setPriceInput('');
                      setImageFile(null);
                      setStockToSum('');
                      setStockFlowStep('FORM');
                    }} className="w-full p-4 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                      <PackageOpen size={16} /> Crear Producto Nuevo
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}

        {stockFlowStep === 'FORM' && editingProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-[#0f0f0f] border border-white/10 rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
              
              {/* Pantalla de Carga (Saving) */}
              <AnimatePresence>
                {saving && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#0f0f0f]/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-8 text-center"
                  >
                    <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mb-6" />
                    <h4 className="font-display font-black text-white uppercase italic text-base tracking-wider mb-2">Guardando Producto</h4>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest max-w-xs leading-relaxed">
                      Subiendo archivo de imagen a Google Drive y sincronizando inventario...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between items-center p-7 border-b border-white/5">
                <h3 className="font-display font-black text-white uppercase italic text-lg">
                  {editingProduct.id ? 'Editar Producto' : 'Nuevo Producto'}
                </h3>
                <button onClick={() => setStockFlowStep(null)} className="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-white/30 hover:text-white transition-all">
                  <X size={16} />
                </button>
              </div>

              <div className="p-7 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Nombre *</label>
                    <input name="nombre" value={editingProduct.nombre || ''} onChange={handleChange} autoComplete="off"
                      className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-bold placeholder:text-white/20 outline-none focus:border-brand-orange/50 transition-all" />
                  </div>

                  {/* PRECIO — input separado para evitar NaN */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Precio *</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 font-black text-sm">$</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        value={priceInput}
                        onChange={(e) => {
                          // Solo permitir números y punto decimal
                          const val = e.target.value.replace(/[^\d.]/g, '');
                          setPriceInput(val);
                        }}
                        className="w-full pl-7 pr-3.5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-bold placeholder:text-white/20 outline-none focus:border-brand-orange/50 transition-all"
                        placeholder="0"
                      />
                    </div>
                    {priceInput && !isNaN(Number(priceInput)) && (
                      <p className="text-brand-orange text-[10px] font-bold">= ${Number(priceInput).toLocaleString('es-AR')}</p>
                    )}
                  </div>

                  {/* STOCK LOGIC */}
                  {editingProduct.id ? (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                        Stock Actual: <span className="text-white bg-white/10 px-2 py-0.5 rounded ml-1">{editingProduct.stock || 0} u.</span>
                      </label>
                      <input
                        type="number"
                        value={stockToSum}
                        onChange={(e) => setStockToSum(e.target.value)}
                        placeholder="Ej: 10 (Ingreso) o -5 (Retiro)"
                        className="w-full p-3.5 bg-white/5 border border-brand-orange/30 rounded-xl text-white text-sm font-bold placeholder:text-white/20 outline-none focus:border-brand-orange/50 transition-all"
                      />
                      {(stockToSum && !isNaN(Number(stockToSum))) ? (
                        <p className="text-[9px] text-brand-orange font-bold uppercase tracking-widest mt-1">
                          Stock Final Resultante: {(editingProduct.stock || 0) + Number(stockToSum)} u.
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Stock Inicial *</label>
                      <input
                        type="number"
                        name="stock"
                        autoComplete="off"
                        min="0"
                        value={editingProduct.stock !== undefined ? editingProduct.stock : '10'}
                        onChange={handleChange}
                        placeholder="10"
                        className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-bold placeholder:text-white/20 outline-none focus:border-brand-orange/50 transition-all"
                      />
                    </div>
                  )}

                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Categoría *</label>
                    <p className="text-[9px] text-white/40 mb-1 leading-relaxed">Puedes escribir una categoría nueva directamente o hacer clic para seleccionar una ya existente.</p>
                    <input
                      list="categories-list"
                      name="categoria"
                      autoComplete="off"
                      value={editingProduct.categoria || ''}
                      onChange={handleChange}
                      placeholder="Escribe o selecciona..."
                      className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-bold placeholder:text-white/20 outline-none focus:border-brand-orange/50 transition-all uppercase"
                    />
                    <datalist id="categories-list">
                      {Array.from(new Set(products.map(p => String(p.categoria || (p as any).category || '').trim().toLowerCase()).filter(Boolean))).map(cat => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Imagen del Producto</label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Subir archivo */}
                      <div className="relative border-2 border-dashed border-white/10 hover:border-brand-orange/40 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-white/2 hover:bg-white/4 group">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                        />
                        <Plus className="text-white/20 group-hover:text-brand-orange mb-2 transition-colors animate-pulse" size={24} />
                        <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors">
                          {imageFile ? imageFile.name : "Subir Imagen a Drive"}
                        </span>
                        <span className="text-[9px] text-white/20 mt-1 uppercase">Imagen, PNG, JPG, WEBP</span>
                      </div>

                      {/* Vista previa / URL manual */}
                      <div className="bg-white/2 border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center border border-white/5">
                            {editingProduct.imagenUrl ? (
                              <img src={getCleanImageUrl(editingProduct.imagenUrl)} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <Package className="text-white/10" size={16} />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[9px] font-black uppercase text-white/40 tracking-wider">Vista previa</p>
                            <p className="text-[10px] text-white/20 truncate">{editingProduct.imagenUrl || 'Sin imagen'}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-[8px] font-bold uppercase tracking-widest text-white/20">O pegar link manual:</label>
                          <input 
                            name="imagenUrl" 
                            autoComplete="off"
                            value={imageFile ? '' : (editingProduct.imagenUrl || '')} 
                            disabled={!!imageFile}
                            onChange={(e) => {
                              handleChange(e);
                              setImageFile(null); // Borrar archivo si edita link manualmente
                            }}
                            placeholder="https://..."
                            className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-[10px] placeholder:text-white/20 outline-none focus:border-brand-orange/40 transition-all disabled:opacity-30" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Descripción</label>
                    <textarea name="descripcion" value={editingProduct.descripcion || ''} onChange={handleChange} rows={3}
                      className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-brand-orange/50 transition-all resize-none" />
                  </div>
                </div>

                {/* Flags */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {(['destacado', 'masVendido', 'novedad', 'activo'] as const).map((flag) => {
                    const val = editingProduct[flag];
                    const isOn = val === true || String(val).toUpperCase() === 'TRUE';
                    return (
                      <label key={flag} className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all select-none ${
                        isOn ? 'bg-brand-orange/10 border-brand-orange/30 text-brand-orange' : 'bg-white/5 border-white/10 text-white/30 hover:text-white/60'
                      }`}>
                        <input type="checkbox" name={flag} checked={isOn}
                          onChange={(e) => setEditingProduct({ ...editingProduct, [flag]: e.target.checked })}
                          className="hidden" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{flag}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="p-7 border-t border-white/5 flex justify-end gap-3">
                <button onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/40 text-xs font-bold uppercase tracking-widest hover:text-white/60 transition-all">
                  Cancelar
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="bg-brand-orange text-white px-7 py-2.5 rounded-xl flex items-center gap-2 font-display font-black uppercase text-xs tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-50">
                  <Save size={14} /> {saving ? 'Guardando...' : 'Guardar'}
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
