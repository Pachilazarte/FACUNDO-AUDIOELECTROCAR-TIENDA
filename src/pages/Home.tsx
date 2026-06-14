import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, ChevronRight, ChevronLeft, ShoppingCart, Zap, Box, ShieldCheck, Truck, Headphones, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { Product } from '../types';
import logo1 from '../img/logo1.webp';
import logo3 from '../img/logo3.webp';
import { getCleanImageUrl, parsePrice } from './admin/priceUtils';
import { useCart } from '../context/CartContext';

const Home = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const safeProducts = Array.isArray(products) ? products : [];

  // Novedades con paginación
  const allNovedades = safeProducts.filter(p => p && p.novedad);
  const totalPages = Math.ceil(allNovedades.length / ITEMS_PER_PAGE);
  const novedades = allNovedades.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Destacados listos para ser usados
  const destacados = safeProducts.filter(p => p && p.destacado).slice(0, 4);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Un pequeño delay para que React actualice el DOM primero
    setTimeout(() => {
      document.getElementById('novedades-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <div className="bg-brand-black min-h-screen font-sans selection:bg-brand-orange selection:text-white pb-12">

      {/* --- HERO SECTION REDONDEADO (Adaptado a AudioElectroCar Solutions) --- */}
      <section className="relative flex flex-col justify-center px-4 md:px-10 py-24 md:py-32 md:min-h-[85vh]">
        <div className="absolute inset-0 z-0 overflow-hidden rounded-[2.5rem] md:rounded-[3rem] m-3 md:m-6 shadow-2xl border border-white/5">
          <img
            src="https://imgur.com/EkekaM8.png"
            alt="AudioElectroCar"
            className="w-full h-full object-cover md:object-center object-[70%_center] opacity-30 md:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/80 to-brand-black/40" />
        </div>

        <div className="container-max px-4 md:px-6 relative z-10 w-full mt-10 md:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl space-y-6"
          >
            {/* Logo Completo Oficial (Sin contenedor, elegante con resplandor ambiental) */}
            <div className="relative flex items-center justify-start w-fit mb-8">
              <div className="absolute -inset-16 bg-gradient-to-r from-blue-500/25 to-brand-orange/30 rounded-full blur-3xl opacity-70 pointer-events-none" />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-brand-orange/20 text-brand-orange px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-orange/30 backdrop-blur-md">
                Audio, Electro & Soluciones
              </span>
              <span className="bg-white/10 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-md flex items-center gap-1">
                <ShieldCheck size={12} /> Compra Segura
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-black text-white uppercase italic leading-[1] md:leading-[0.9] tracking-tight">
              Potencia tu <br className="hidden sm:block" />sonido.<br />
              <span className="text-brand-orange mt-1 md:mt-2 inline-block">Facilita tu vida.</span>
            </h1>

            <p className="text-white/70 text-base md:text-xl max-w-xl leading-relaxed font-light">
              <strong className="text-white font-bold">AudioElectroCar: Tus soluciones tecnológicas.</strong> Desde Car Audio de alta fidelidad hasta herramientas y cuidado personal. Todo en un solo lugar con la mejor trayectoria.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/productos"
                className="bg-brand-orange text-white px-10 py-4 rounded-2xl font-display font-black uppercase tracking-widest text-sm hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] active:scale-95 transition-all flex items-center gap-2 group"
              >
                Explorar catálogo <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>


      {/* --- SECCIÓN DE NOVEDADES (Protagonista) --- */}
      <section id="novedades-section" className="py-10 md:py-12 container-max px-4 md:px-6 scroll-mt-24">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-brand-orange">
              <Zap size={16} fill="currentColor" />
              <span className="font-bold text-xs uppercase tracking-[0.3em]">Recién llegados</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-black text-white uppercase italic">
              Novedades
            </h2>
          </div>
          <div className="hidden md:flex gap-3">
            <Link to="/productos" className="px-6 h-12 rounded-2xl border border-white/10 text-white hover:bg-white hover:text-brand-black transition-all flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest group">
              Ver Catálogo <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 min-h-[500px]">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-brand-navy/20 rounded-2xl md:rounded-[2.5rem] border border-white/5 animate-pulse" />
            ))
          ) : novedades.length > 0 ? (
            novedades.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -5 }}
                className="group relative bg-brand-navy/5 border border-white/5 rounded-2xl md:rounded-[2.5rem] p-2 md:p-4 transition-all hover:bg-brand-navy/10 hover:border-brand-orange/30 hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.1)] flex flex-col"
              >
                <div className="aspect-square overflow-hidden rounded-xl md:rounded-[2rem] mb-3 md:mb-6 relative bg-white/5">
                  <img
                    src={getCleanImageUrl(product.imagenUrl)}
                    alt={product.nombre}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-brand-black/70 backdrop-blur-md text-white text-[8px] md:text-[10px] font-bold px-2 py-1 md:px-4 md:py-2 rounded-full uppercase border border-white/10">
                    Nuevo
                  </div>
                </div>

                <div className="px-1 md:px-4 pb-2 md:pb-4 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-1 md:mb-2 gap-2 md:gap-4">
                    <h3 className="text-xs md:text-xl font-display font-black text-white uppercase italic line-clamp-2 leading-tight">{product.nombre}</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-2 md:mb-4 mt-auto">
                    <span className="text-brand-orange font-black text-sm md:text-2xl">${parsePrice(product.precio).toLocaleString()}</span>
                  </div>
                  <p className="hidden md:block text-white/40 text-sm mb-6 line-clamp-2 font-light">{product.descripcion}</p>

                  <div className="flex gap-2 mt-auto">
                    <Link
                      to={`/productos?id=${product.id}`}
                      className="flex-1 bg-white/5 hover:bg-brand-orange hover:text-white text-white py-2 md:py-3.5 rounded-xl md:rounded-2xl text-center font-bold text-[9px] md:text-xs uppercase tracking-widest transition-all border border-white/5 flex items-center justify-center"
                    >
                      <span className="md:hidden">Ver</span>
                      <span className="hidden md:block">Ver detalle</span>
                    </Link>
                    <button
                      onClick={(e) => { e.preventDefault(); addToCart(product); }}
                      className="w-10 h-10 md:w-14 md:h-14 flex-shrink-0 bg-brand-orange rounded-xl md:rounded-2xl text-white shadow-lg shadow-brand-orange/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                    >
                      <ShoppingCart size={16} className="md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            // Mensaje por si no hay productos marcados como novedad
            <div className="col-span-full py-20 text-center bg-brand-navy/5 rounded-[2rem] md:rounded-[3rem] border border-white/5">
              <p className="text-white/40 font-light text-sm md:text-lg">Cargando novedades de catálogo...</p>
            </div>
          )}
        </div>

        {/* Paginación de Novedades */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 gap-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${currentPage === i + 1
                    ? 'bg-brand-orange text-white border-brand-orange shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                    : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </section>

      {/* --- BANNER DE SERVICIO TÉCNICO (Texto Oficial del Copywriting) --- */}
      <section className="py-12 md:py-20 container-max px-4 md:px-6">
        <div className="bg-gradient-to-br from-brand-orange to-orange-700 rounded-[2rem] md:rounded-[3rem] p-8 md:p-20 overflow-hidden relative shadow-[0_20px_50px_-12px_rgba(249,115,22,0.3)]">
          <div className="absolute right-6 top-1/2 -translate-y-1/2 h-[75%] opacity-20 pointer-events-none select-none">
            <img src={logo3} alt="AudioElectroCar Mascota Marca de Agua" className="h-full w-auto object-contain" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-brand-black/20 text-brand-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                Taller Oficial
              </span>
            </div>
            <h2 className="text-3xl md:text-6xl font-display font-black text-white uppercase italic leading-[1] md:leading-[0.9] mb-4 md:mb-6">
              ¿Necesitas reparar <br /><span className="text-brand-black">tu equipo?</span>
            </h2>
            <p className="text-white/90 text-lg md:text-xl mb-10 font-medium leading-relaxed max-w-xl">
              Contamos con Servicio Técnico Especializado en Drivers, Parlantes y componentes de audio. Revivimos tu sonido con repuestos originales y garantía de trabajo.
            </p>
            <a
              href="https://wa.me/c/5493813336575"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand-black text-white px-10 py-4 rounded-2xl font-display font-black uppercase tracking-widest text-sm hover:bg-white hover:text-brand-black transition-all shadow-xl"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID (Propuesta de valor rápida) --- */}
      <section className="py-8 md:py-12 container-max px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-brand-navy/10 border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-8 flex flex-row md:flex-col items-center md:text-center gap-4 hover:bg-brand-navy/20 transition-colors">
            <div className="w-12 h-12 md:w-14 md:h-14 flex-shrink-0 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange md:mx-auto md:mb-2">
              <ShieldCheck size={24} className="md:w-7 md:h-7" />
            </div>
            <div className="text-left md:text-center">
              <h4 className="text-white font-display font-black uppercase italic text-sm md:text-xl mb-1 md:mb-3">Perfil Oficial</h4>
              <p className="text-white/50 text-xs md:text-sm font-light leading-relaxed">Operamos de forma segura en Mercado Libre brindando protección total al comprador.</p>
            </div>
          </div>

          <div className="bg-brand-navy/10 border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-8 flex flex-row md:flex-col items-center md:text-center gap-4 hover:bg-brand-navy/20 transition-colors">
            <div className="w-12 h-12 md:w-14 md:h-14 flex-shrink-0 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange md:mx-auto md:mb-2">
              <Truck size={24} className="md:w-7 md:h-7" />
            </div>
            <div className="text-left md:text-center">
              <h4 className="text-white font-display font-black uppercase italic text-sm md:text-xl mb-1 md:mb-3">Envíos Rápidos</h4>
              <p className="text-white/50 text-xs md:text-sm font-light leading-relaxed">Llegamos a todas las provincias de Argentina con embalaje seguro y código de seguimiento.</p>
            </div>
          </div>

          <div className="bg-brand-navy/10 border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-8 flex flex-row md:flex-col items-center md:text-center gap-4 hover:bg-brand-navy/20 transition-colors">
            <div className="w-12 h-12 md:w-14 md:h-14 flex-shrink-0 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange md:mx-auto md:mb-2">
              <Headphones size={24} className="md:w-7 md:h-7" />
            </div>
            <div className="text-left md:text-center">
              <h4 className="text-white font-display font-black uppercase italic text-sm md:text-xl mb-1 md:mb-3">Asesoramiento</h4>
              <p className="text-white/50 text-xs md:text-sm font-light leading-relaxed">No somos solo vendedores, somos expertos listos para ayudarte en cada proyecto.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA / CONTACTO DIRECTO --- */}
      <section className="py-12 md:py-20 container-max px-4 md:px-6">
        <div className="bg-brand-black border border-white/10 rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 relative overflow-hidden shadow-2xl">
          {/* Brillos de fondo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="space-y-4 text-center md:text-left relative z-10">
            <h3 className="text-3xl md:text-4xl font-display font-black text-white uppercase italic tracking-tight">Accede a nuestro <span className="text-brand-orange">Catálogo</span></h3>
            <p className="text-white/50 max-w-md font-light">
              Ventas Online 24/7. Descubre nuestros precios competitivos a mayorista, actualizados en tiempo real.   V.1.0.1
            </p>
          </div>

          <div className="w-full md:w-auto relative z-10">
            <a
              href="https://wa.me/c/5493813336575"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#25D366] text-white px-10 py-5 rounded-2xl font-display font-black uppercase tracking-widest text-sm hover:bg-[#20b858] active:scale-95 transition-all shadow-[0_10px_20px_-10px_rgba(37,211,102,0.5)]"
            >
              Ver en WhatsApp <ArrowRight size={18} />
            </a>
            <p className="text-center text-white/30 text-[10px] uppercase tracking-widest mt-4">Retiros en Tucumán solo con cita</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;