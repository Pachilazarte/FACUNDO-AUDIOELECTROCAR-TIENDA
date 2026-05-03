import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, ChevronRight, ChevronLeft, ShoppingCart, Zap, Box, ShieldCheck, Truck, Headphones, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { Product } from '../types';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProductos();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const safeProducts = Array.isArray(products) ? products : [];
  
  // Priorizamos Novedades para la sección principal
  const novedades = safeProducts.filter(p => p && p.novedad).slice(0, 6);
  // Destacados listos para ser usados
  const destacados = safeProducts.filter(p => p && p.destacado).slice(0, 4);

  return (
    <div className="bg-brand-black min-h-screen font-sans selection:bg-brand-orange selection:text-white pb-12">
      
      {/* --- HERO SECTION REDONDEADO (Adaptado a AudioElectroCar Solutions) --- */}
      <section className="relative min-h-[85vh] flex flex-col justify-center px-4 md:px-10 py-20">
        <div className="absolute inset-0 z-0 overflow-hidden rounded-[3rem] m-4 md:m-6 shadow-2xl border border-white/5">
          <img 
            src="https://imgur.com/EkekaM8.png" 
            alt="AudioElectroCar" 
            className="w-full h-full object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/80 to-brand-black/20" />
        </div>
        
        <div className="container-max px-6 relative z-10 w-full mt-10 md:mt-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="bg-brand-orange/20 text-brand-orange px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-orange/30 backdrop-blur-md">
                Audio, Electro & Soluciones
              </span>
              <span className="bg-white/10 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-md flex items-center gap-1">
                <ShieldCheck size={12} /> Compra Segura
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-white uppercase italic leading-[0.9] mb-6 tracking-tight">
              Potencia tu <br className="hidden md:block" />sonido.<br />
              <span className="text-brand-orange">Facilita tu vida.</span>
            </h1>
            
            <p className="text-white/70 text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-light">
              <strong className="text-white font-bold">AudioElectroCar: Tu soluciones tecnológicos.</strong> Desde Car Audio de alta fidelidad hasta herramientas y cuidado personal. Todo en un solo lugar.
            </p>
            
            <div className="flex flex-wrap gap-4">
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
      <section className="py-12 container-max px-6">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-brand-orange">
              <Zap size={16} fill="currentColor" />
              <span className="font-bold text-xs uppercase tracking-[0.3em]">Recién llegados</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black text-white uppercase italic">
              Novedades <span className="text-white/20">/ AudioElectroCar</span>
            </h2>
          </div>
          <div className="hidden md:flex gap-3">
            <button className="w-12 h-12 rounded-2xl border border-white/10 text-white hover:bg-white hover:text-brand-black transition-all flex items-center justify-center group">
              <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <button className="w-12 h-12 rounded-2xl border border-white/10 text-white hover:bg-white hover:text-brand-black transition-all flex items-center justify-center group">
              <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-brand-navy/20 rounded-[2.5rem] border border-white/5 animate-pulse" />
            ))
          ) : novedades.length > 0 ? (
            novedades.map((product) => (
              <motion.div 
                key={product.id}
                whileHover={{ y: -10 }}
                className="group relative bg-brand-navy/5 border border-white/5 rounded-[2.5rem] p-4 transition-all hover:bg-brand-navy/10 hover:border-brand-orange/30 hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.1)]"
              >
                <div className="aspect-square overflow-hidden rounded-[2rem] mb-6 relative bg-white/5">
                  <img 
                    src={product.imagenUrl} 
                    alt={product.nombre} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-brand-black/70 backdrop-blur-md text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase border border-white/10">
                    Nuevo
                  </div>
                </div>
                
                <div className="px-4 pb-4">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <h3 className="text-xl font-display font-black text-white uppercase italic line-clamp-2 leading-tight">{product.nombre}</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-brand-orange font-black text-2xl">${product.precio.toLocaleString()}</span>
                  </div>
                  <p className="text-white/40 text-sm mb-6 line-clamp-2 font-light">{product.descripcion}</p>
                  
                  <div className="flex gap-2">
                    <Link 
                      to={`/productos?id=${product.id}`} 
                      className="flex-1 bg-white/5 hover:bg-brand-orange hover:text-white text-white py-3.5 rounded-2xl text-center font-bold text-xs uppercase tracking-widest transition-all border border-white/5"
                    >
                      Ver detalle
                    </Link>
                    <button className="w-14 bg-brand-orange rounded-2xl text-white shadow-lg shadow-brand-orange/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center">
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            // Mensaje por si no hay productos marcados como novedad
            <div className="col-span-full py-20 text-center bg-brand-navy/5 rounded-[3rem] border border-white/5">
               <p className="text-white/40 font-light text-lg">Cargando novedades de catálogo...</p>
            </div>
          )}
        </div>
      </section>

      {/* --- BANNER DE SERVICIO TÉCNICO (Texto Oficial del Copywriting) --- */}
      <section className="py-20 container-max px-6">
        <div className="bg-gradient-to-br from-brand-orange to-orange-700 rounded-[3rem] p-10 md:p-20 overflow-hidden relative group shadow-[0_20px_50px_-12px_rgba(249,115,22,0.3)]">
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
             <Wrench size={400} className="text-white -rotate-12 translate-x-20" />
          </div>
          
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-brand-black/20 text-brand-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                Taller Oficial
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-black text-white uppercase italic leading-[0.9] mb-6">
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
      <section className="py-12 container-max px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-brand-navy/10 border border-white/5 rounded-[2.5rem] p-8 text-center hover:bg-brand-navy/20 transition-colors">
            <div className="w-14 h-14 mx-auto bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange mb-6">
              <ShieldCheck size={28} />
            </div>
            <h4 className="text-white font-display font-black uppercase italic text-xl mb-3">Perfil Oficial</h4>
            <p className="text-white/50 text-sm font-light">Operamos de forma segura en Mercado Libre brindando protección total al comprador.</p>
          </div>
          <div className="bg-brand-navy/10 border border-white/5 rounded-[2.5rem] p-8 text-center hover:bg-brand-navy/20 transition-colors">
            <div className="w-14 h-14 mx-auto bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange mb-6">
              <Truck size={28} />
            </div>
            <h4 className="text-white font-display font-black uppercase italic text-xl mb-3">Envíos Rápidos</h4>
            <p className="text-white/50 text-sm font-light">Llegamos a todas las provincias de Argentina con embalaje seguro y código de seguimiento.</p>
          </div>
          <div className="bg-brand-navy/10 border border-white/5 rounded-[2.5rem] p-8 text-center hover:bg-brand-navy/20 transition-colors">
            <div className="w-14 h-14 mx-auto bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange mb-6">
              <Headphones size={28} />
            </div>
            <h4 className="text-white font-display font-black uppercase italic text-xl mb-3">Asesoramiento</h4>
            <p className="text-white/50 text-sm font-light">No somos solo vendedores, somos expertos listos para ayudarte en cada proyecto.</p>
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA / CONTACTO DIRECTO --- */}
      <section className="py-20 container-max px-6">
        <div className="bg-brand-black border border-white/10 rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
          {/* Brillos de fondo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="space-y-4 text-center md:text-left relative z-10">
            <h3 className="text-3xl md:text-4xl font-display font-black text-white uppercase italic tracking-tight">Accede a nuestro <span className="text-brand-orange">Catálogo</span></h3>
            <p className="text-white/50 max-w-md font-light">
              Ventas Online 24/7. Descubre nuestros precios competitivos a mayorista, actualizados en tiempo real.
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