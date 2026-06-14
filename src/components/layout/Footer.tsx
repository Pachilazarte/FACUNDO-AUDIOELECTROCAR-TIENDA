import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, MapPin, Mail, Smartphone } from 'lucide-react';
import logo4 from '../../img/logo4.webp';

const Footer = () => {
  // Año dinámico para que no tengas que actualizarlo manualmente
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full relative overflow-hidden bg-brand-black border-t border-white/5 pt-10 pb-6 font-sans selection:bg-brand-orange selection:text-white">

      {/* Brillo de fondo sutil */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-32 bg-brand-orange/10 blur-[100px] pointer-events-none" />

      <div className="container-max px-6 relative z-10">

        {/* LAYOUT PRINCIPAL */}
        <div className="flex flex-col items-center text-center md:grid md:grid-cols-12 md:text-left gap-y-10 gap-x-2 md:gap-8 mb-8 md:mb-10 w-full">

          {/* Logo y Redes */}
          <div className="md:col-span-12 lg:col-span-4 flex flex-col items-center md:items-start gap-5 md:gap-4 w-full">
            <img
              src={logo4}
              alt="AudioElectroCar Logo"
              className="h-16 md:h-20 w-auto object-contain filter drop-shadow-[0_0_20px_rgba(249,115,22,0.3)] brightness-115 contrast-110"
            />
            <p className="hidden md:block text-white/40 text-[11px] md:text-sm font-light leading-relaxed max-w-sm">
              Distribuidor mayorista y minorista integral. Evolución tecnológica a tu alcance con envíos seguros a toda la República Argentina.    V.1.0.1
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full md:rounded-[1rem] bg-white/5 border border-white/10 flex items-center justify-center text-white/50 md:text-white/40 hover:bg-brand-orange hover:text-white hover:border-brand-orange md:hover:shadow-[0_10px_20px_rgba(249,115,22,0.2)] transition-all duration-300 group">
                <Facebook size={18} className="md:group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full md:rounded-[1rem] bg-white/5 border border-white/10 flex items-center justify-center text-white/50 md:text-white/40 hover:bg-brand-orange hover:text-white hover:border-brand-orange md:hover:shadow-[0_10px_20px_rgba(249,115,22,0.2)] transition-all duration-300 group">
                <Instagram size={18} className="md:group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div className="md:col-span-6 lg:col-span-3 lg:col-start-6 flex flex-col items-center md:items-start w-full">
            <h4 className="hidden md:block text-white font-display font-black uppercase tracking-widest text-[10px] md:text-xs mb-4 opacity-90">Explorar</h4>
            <nav className="flex flex-row md:flex-col flex-wrap justify-center md:justify-start gap-x-6 gap-y-3">
              <Link to="/" className="text-xs md:text-[10px] lg:text-xs font-bold md:font-normal text-white/60 md:text-white/40 hover:text-brand-orange transition-colors uppercase tracking-widest flex items-center gap-3 group">
                <span className="w-1 h-1 rounded-full bg-brand-orange/20 group-hover:bg-brand-orange group-hover:scale-150 transition-all hidden md:block" />
                Inicio
              </Link>
              <Link to="/productos" className="text-xs md:text-[10px] lg:text-xs font-bold md:font-normal text-white/60 md:text-white/40 hover:text-brand-orange transition-colors uppercase tracking-widest flex items-center gap-3 group">
                <span className="w-1 h-1 rounded-full bg-brand-orange/20 group-hover:bg-brand-orange group-hover:scale-150 transition-all hidden md:block" />
                Catálogo
              </Link>
              <Link to="/quienes-somos" className="text-xs md:text-[10px] lg:text-xs font-bold md:font-normal text-white/60 md:text-white/40 hover:text-brand-orange transition-colors uppercase tracking-widest flex items-center gap-3 group">
                <span className="w-1 h-1 rounded-full bg-brand-orange/20 group-hover:bg-brand-orange group-hover:scale-150 transition-all hidden md:block" />
                Quiénes Somos
              </Link>
            </nav>
          </div>

          {/* Información de Contacto */}
          <div className="md:col-span-6 lg:col-span-4 flex flex-col items-center md:items-start w-full">
            <h4 className="hidden md:block text-white font-display font-black uppercase tracking-widest text-[10px] md:text-xs mb-4 opacity-90">Contacto Oficial</h4>
            <div className="flex flex-col md:flex-col items-center md:items-start gap-4 md:gap-4 text-white/50 md:text-white/40 text-xs md:text-[10px] lg:text-xs font-light">
              <div className="flex items-center md:items-start gap-2 md:gap-3 group">
                <div className="hidden md:flex w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/5 items-center justify-center text-brand-orange flex-shrink-0 group-hover:bg-brand-orange group-hover:text-brand-black transition-colors">
                  <MapPin size={10} className="md:w-3 md:h-3" />
                </div>
                <MapPin size={14} className="md:hidden text-brand-orange" />
                <span className="mt-0 md:mt-0.5">Manuel Estrada 2177, CP 4000<br className="hidden md:block" />Tucumán</span>
              </div>
              <div className="flex items-center md:items-start gap-2 md:gap-3 group">
                <div className="hidden md:flex w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/5 items-center justify-center text-brand-orange flex-shrink-0 group-hover:bg-brand-orange group-hover:text-brand-black transition-colors">
                  <Mail size={10} className="md:w-3 md:h-3" />
                </div>
                <Mail size={14} className="md:hidden text-brand-orange" />
                <a href="mailto:francoalexislazarte@gmail.com" className="mt-0 md:mt-0.5 hover:text-brand-orange transition-colors break-all">francoalexislazarte@gmail.com</a>
              </div>
              <div className="flex items-center md:items-start gap-2 md:gap-3 group">
                <div className="hidden md:flex w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/5 items-center justify-center text-[#25D366] flex-shrink-0 group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                  <Smartphone size={10} className="md:w-3 md:h-3" />
                </div>
                <Smartphone size={14} className="md:hidden text-[#25D366]" />
                <a href="https://wa.me/5493813336575" target="_blank" rel="noopener noreferrer" className="mt-0 md:mt-0.5 hover:text-[#25D366] transition-colors">+54 9 381 333-6575</a>
              </div>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="md:hidden w-full h-px bg-white/10 mb-6" />
        <div className="hidden md:block pt-8 border-t border-white/10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">
            © {currentYear} AudioElectroCar. Todos los derechos reservados.
          </p>
          <Link
            to="/admin"
            className="text-[10px] text-white/10 hover:text-brand-orange uppercase tracking-[0.2em] font-bold transition-colors"
            aria-label="Acceso Administrador"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;