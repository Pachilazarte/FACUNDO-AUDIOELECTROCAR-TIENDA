import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Zap, MapPin, Mail, Smartphone } from 'lucide-react';

const Footer = () => {
  // Año dinámico para que no tengas que actualizarlo manualmente
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full relative overflow-hidden bg-brand-black border-t border-white/5 pt-20 pb-10 font-sans selection:bg-brand-orange selection:text-white">
      
      {/* Brillo de fondo sutil (Premium Glass Effect) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-32 bg-brand-orange/10 blur-[100px] pointer-events-none" />

      <div className="container-max px-6 relative z-10">
        
        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Columna 1: Marca y Descripción */}
          <div className="md:col-span-12 lg:col-span-4 flex flex-col gap-6 items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-brand-orange/10 rounded-2xl flex items-center justify-center text-brand-orange shadow-inner border border-brand-orange/20">
                <Zap size={24} strokeWidth={1.5} />
              </div>
              <span className="text-white font-display font-black text-3xl uppercase italic tracking-tight leading-none">
                AudioElectro<span className="text-brand-orange">Car</span>
              </span>
            </div>
            <p className="text-white/40 text-sm font-light leading-relaxed max-w-sm">
              Distribuidor mayorista y minorista integral. Evolución tecnológica a tu alcance con envíos seguros a toda la República Argentina.
            </p>
            
            {/* Redes Sociales */}
            <div className="flex gap-4 mt-2 justify-center md:justify-start">
              <a href="#" aria-label="Facebook" className="w-12 h-12 rounded-[1rem] bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-brand-orange hover:text-white hover:border-brand-orange hover:shadow-[0_10px_20px_rgba(249,115,22,0.2)] transition-all duration-300 group">
                <Facebook size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" aria-label="Instagram" className="w-12 h-12 rounded-[1rem] bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-brand-orange hover:text-white hover:border-brand-orange hover:shadow-[0_10px_20px_rgba(249,115,22,0.2)] transition-all duration-300 group">
                <Instagram size={20} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Columna 2: Navegación Rápida */}
          <div className="md:col-span-6 lg:col-span-3 lg:col-start-6 flex flex-col gap-6 items-center md:items-start text-center md:text-left">
            <h4 className="text-white font-display font-black uppercase tracking-widest text-sm mb-2 opacity-90">Explorar</h4>
            <nav className="flex flex-col gap-4">
              <Link to="/" className="text-sm text-white/40 hover:text-brand-orange transition-colors uppercase tracking-widest flex items-center gap-3 group">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange/20 group-hover:bg-brand-orange group-hover:scale-150 transition-all hidden md:block" />
                Inicio
              </Link>
              <Link to="/productos" className="text-sm text-white/40 hover:text-brand-orange transition-colors uppercase tracking-widest flex items-center gap-3 group">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange/20 group-hover:bg-brand-orange group-hover:scale-150 transition-all hidden md:block" />
                Catálogo
              </Link>
              <Link to="/quienes-somos" className="text-sm text-white/40 hover:text-brand-orange transition-colors uppercase tracking-widest flex items-center gap-3 group">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange/20 group-hover:bg-brand-orange group-hover:scale-150 transition-all hidden md:block" />
                Quiénes Somos
              </Link>
            </nav>
          </div>

          {/* Columna 3: Información de Contacto */}
          <div className="md:col-span-6 lg:col-span-4 flex flex-col gap-6 items-center md:items-start text-center md:text-left">
            <h4 className="text-white font-display font-black uppercase tracking-widest text-sm mb-2 opacity-90">Contacto Oficial</h4>
            <div className="flex flex-col gap-5">
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-3 text-white/40 text-sm font-light group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-brand-orange flex-shrink-0 group-hover:bg-brand-orange group-hover:text-brand-black transition-colors">
                  <MapPin size={14} />
                </div>
                <p className="mt-1">Manuel Estrada 2177, CP 4000<br/>San Miguel de Tucumán</p>
              </div>
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-3 text-white/40 text-sm font-light group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-brand-orange flex-shrink-0 group-hover:bg-brand-orange group-hover:text-brand-black transition-colors">
                  <Mail size={14} />
                </div>
                <a href="mailto:francoalexislazarte@gmail.com" className="mt-1 hover:text-brand-orange transition-colors">
                  francoalexislazarte@gmail.com
                </a>
              </div>

              <div className="flex flex-col md:flex-row items-center md:items-start gap-3 text-white/40 text-sm font-light group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#25D366] flex-shrink-0 group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                  <Smartphone size={14} />
                </div>
                <a href="https://wa.me/5493813336575" target="_blank" rel="noopener noreferrer" className="mt-1 hover:text-[#25D366] transition-colors">
                  +54 9 381 333-6575
                </a>
              </div>

            </div>
          </div>

        </div>

        {/* BARRA INFERIOR (Copyright y Admin) */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] text-center md:text-left font-bold">
            © {currentYear} AudioElectroCar. Todos los derechos reservados.
          </p>
          
          <Link 
            to="/admin" 
            className="text-[10px] text-brand-orange/30 hover:text-brand-orange transition-colors uppercase tracking-[0.3em] font-black border border-brand-orange/10 hover:border-brand-orange/30 px-6 py-2 rounded-full"
          >
            Acceso Administrador
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;