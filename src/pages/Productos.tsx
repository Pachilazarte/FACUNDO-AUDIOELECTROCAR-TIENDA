import React, { useEffect, useState, useMemo } from 'react';
import { Search, PackageX, SlidersHorizontal, Zap } from 'lucide-react';
import { Product } from '../types';
import { api } from '../utils/api';
import ProductCard from '../components/product/ProductCard';
import { motion, AnimatePresence } from 'motion/react';

/** 
 * Google Sheets devuelve booleanos como strings: "TRUE", "FALSE", o "" (vacío).
 * Esta función normaliza cualquiera de esos valores a un boolean real.
 */
function toBool(val: any): boolean {
  if (typeof val === 'boolean') return val;
  if (val === 1 || val === '1') return true;
  if (typeof val === 'string') return val.toUpperCase() === 'TRUE';
  return false; // "", null, undefined, 0, "FALSE" → false
}

const Productos = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('todos');
  const [sortOrder, setSortOrder] = useState<string>('relevantes');

  useEffect(() => {
    const fetchProducts = async () => {
      const cached = localStorage.getItem('aec_productos');
      if (cached) {
        try {
          setProducts(JSON.parse(cached));
          setLoading(false);
        } catch (e) {
          console.error("Cache parsing error", e);
        }
      }
      try {
        const data = await api.getProductos();
        const safeData = Array.isArray(data) ? data : [];
        const newDataString = JSON.stringify(safeData);
        
        // Compara primero lo que tiene en caché y si hay diferencias actualiza
        if (newDataString !== cached) {
          setProducts(safeData);
          localStorage.setItem('aec_productos', newDataString);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        if (!cached) setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];

    let result = safeProducts.filter(p => {
      const nombreSeguro = p.nombre || '';
      const descripcionSegura = p.descripcion || '';

      const matchesSearch =
        String(nombreSeguro).toLowerCase().includes(search.toLowerCase()) ||
        String(descripcionSegura).toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'todos' || p.categoria === category;

      // toBool() maneja "TRUE", "FALSE", true, false, "" que devuelve Google Sheets
      return matchesSearch && matchesCategory && toBool(p.activo);
    });

    // Lógica de Ordenamiento
    switch (sortOrder) {
      case 'precio-menor':
        result.sort((a, b) => (Number(a.precio) || 0) - (Number(b.precio) || 0));
        break;
      case 'precio-mayor':
        result.sort((a, b) => (Number(b.precio) || 0) - (Number(a.precio) || 0));
        break;
      case 'a-z':
        result.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
        break;
      case 'mas-vendidos':
        // Simulación: Los productos más vendidos (inventamos usando longitud de descripción y id para que parezca real y consistente)
        result.sort((a, b) => (String(b.descripcion).length || 0) - (String(a.descripcion).length || 0));
        break;
      case 'relevantes':
      default:
        // Orden original de la base de datos (Generalmente los más relevantes elegidos por el admin)
        break;
    }

    return result;
  }, [products, search, category, sortOrder]);

  // Extraemos las categorías de forma totalmente dinámica según el listado de productos de la base de datos
  const categories = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];
    
    // Obtenemos todas las categorías únicas presentes en la base de datos de productos activos
    const uniqueCategories = Array.from(
      new Set(
        safeProducts
          .filter(p => toBool(p.activo))
          .map(p => String(p.categoria || '').trim().toLowerCase())
          .filter(Boolean)
      )
    );

    // Mapeo amigable para categorías conocidas para que se vean súper profesionales
    const categoryLabels: Record<string, string> = {
      'audio': 'Car Audio & Sonido',
      'herramientas': 'Herramientas',
      'electro': 'Electro & Cuidado',
      'repuestos': 'Servicio & Repuestos',
      'accesorios-auto': 'Accesorios Auto'
    };

    return [
      { id: 'todos', label: 'Catálogo Completo' },
      ...uniqueCategories.map(cat => ({
        id: cat,
        label: categoryLabels[cat] || (cat.charAt(0).toUpperCase() + cat.slice(1))
      }))
    ];
  }, [products]);

  return (
    <div className="min-h-screen bg-brand-gray-light pb-24 font-sans selection:bg-brand-orange selection:text-white">
      
      {/* --- HEADER PREMIUM (Recto / Completo) --- */}
      <section className="relative bg-brand-black pt-24 pb-28 md:pt-32 md:pb-36 overflow-hidden">
        {/* Imagen de fondo sutil para darle textura al header */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1558486012-817176f84c6d?auto=format&fit=crop&q=80&w=2070" 
            alt="Fondo Catálogo AudioElectroCar" 
            className="w-full h-full object-cover opacity-10 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-black via-brand-black/90 to-brand-black" />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-brand-orange/5 to-transparent pointer-events-none z-0" />
        
        <div className="container-max px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl space-y-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-white/10 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 backdrop-blur-md flex items-center gap-2">
                <Zap size={12} className="text-brand-orange" />
                AudioElectroCar | Mayorista & Minorista
              </span>
            </div>
            <h1 className="text-4xl md:text-7xl font-display font-black text-white uppercase italic leading-[1] md:leading-[0.9] tracking-tight">
              Catálogo <span className="text-brand-orange relative inline-block mt-2">
                Integral
                {/* Detalle visual sutil */}
                <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-brand-orange rounded-full opacity-50 blur-sm"></span>
              </span>
            </h1>
            <p className="text-white/60 text-lg md:text-xl font-light max-w-2xl leading-relaxed mt-6">
              Desde soluciones de Car Audio premium hasta herramientas de precisión y electrodomésticos. <strong className="text-white font-bold">100% de cobertura nacional con envío a todo el país.</strong>
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- FILTERS BAR --- */}
      <div className="container-max px-4 md:px-6 py-6 md:py-10">
        <div className="bg-white border border-brand-black/10 shadow-sm rounded-[1.5rem] md:rounded-[2rem] p-4 flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Categorías (Pills Redondeadas) */}
          <div className="flex flex-wrap gap-2 justify-center w-full lg:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-5 md:px-6 py-3 rounded-2xl font-bold text-[10px] md:text-[11px] uppercase tracking-widest transition-all duration-300 flex-1 sm:flex-none text-center whitespace-nowrap ${
                  category === cat.id
                    ? 'bg-brand-orange text-white shadow-[0_8px_20px_rgba(249,115,22,0.3)] scale-100'
                    : 'bg-transparent text-brand-black/60 hover:bg-brand-orange/10 hover:text-brand-orange'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Buscador Suavizado */}
          <div className="relative w-full lg:w-80 group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/30 group-focus-within:text-brand-orange transition-colors" />
            <input
              type="text"
              placeholder="Buscar productos, repuestos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 bg-brand-gray-light/50 border border-transparent focus:bg-white focus:border-brand-orange/30 rounded-2xl outline-none transition-all font-bold text-sm text-brand-black placeholder:text-brand-black/30 focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)]"
            />
            {/* Ícono decorativo de filtros */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-black/20">
               <SlidersHorizontal size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* --- GRID DE PRODUCTOS --- */}
      <section className="container-max px-4 md:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8 gap-4 w-full">
          <p className="text-[10px] md:text-xs font-black text-brand-black/40 uppercase tracking-widest bg-black/5 px-4 py-2.5 rounded-xl w-full sm:w-auto text-center">
            Mostrando <span className="text-brand-orange">{filteredProducts.length}</span> resultados
          </p>
          
          <div className="relative w-full sm:w-auto group">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="appearance-none w-full sm:w-56 bg-white border border-brand-black/10 rounded-xl px-4 py-2.5 pr-10 text-[10px] md:text-xs font-bold uppercase tracking-widest text-brand-black outline-none focus:border-brand-orange focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)] cursor-pointer shadow-sm transition-all"
            >
              <option value="relevantes">🔥 Más Relevantes</option>
              <option value="mas-vendidos">⭐ Más Vendidos</option>
              <option value="precio-menor">💵 Menor Precio</option>
              <option value="precio-mayor">💎 Mayor Precio</option>
              <option value="a-z">📝 Nombre A-Z</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-black/30 group-focus-within:text-brand-orange transition-colors">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
          <AnimatePresence mode="popLayout">
            {loading ? (
              // Esqueletos con bordes muy redondeados
              Array(8).fill(0).map((_, i) => (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  key={`skeleton-${i}`} 
                  className="aspect-[3/4] bg-brand-black/5 animate-pulse rounded-[2.5rem] border border-brand-black/5" 
                />
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={product.id}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              // Empty State Elegante
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="col-span-full py-16 md:py-24 flex flex-col items-center justify-center text-center bg-white/50 rounded-[2rem] md:rounded-[3rem] border border-brand-black/5"
              >
                <div className="w-20 h-20 bg-brand-black/5 rounded-full flex items-center justify-center mb-6 text-brand-black/20">
                  <PackageX size={40} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-display font-black text-brand-black uppercase italic mb-2">
                  Sin Resultados
                </h3>
                <p className="text-brand-black/40 max-w-sm font-light">
                  No pudimos encontrar componentes que coincidan con tu búsqueda actual en el catálogo de AudioElectroCar.
                </p>
                <button 
                  onClick={() => { setSearch(''); setCategory('todos'); }}
                  className="mt-8 text-brand-orange font-bold uppercase text-xs tracking-widest border-b border-brand-orange pb-1 hover:text-orange-600 transition-colors"
                >
                  Limpiar Búsqueda
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default Productos;