import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Home, Grid, Info, Zap, ShieldCheck, MessageSquare } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const location = useLocation();

  // Enlaces de navegación con iconos incorporados
  const links = [
    { name: 'Inicio', path: '/', icon: <Home size={18} /> },
    { name: 'Catálogo', path: '/productos', icon: <Grid size={18} /> },
    { name: 'Quiénes Somos', path: '/quienes-somos', icon: <Info size={18} /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay oscuro con blur (Glassmorphism) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-black/60 backdrop-blur-md z-[100]"
          />
          
          {/* Panel del Menú Lateral (Desliza desde la izquierda) */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-brand-black z-[110] shadow-[20px_0_50px_rgba(0,0,0,0.5)] flex flex-col rounded-r-[2.5rem] overflow-hidden border-r border-white/5 font-sans selection:bg-brand-orange selection:text-white"
          >
            {/* Brillos decorativos de fondo */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-brand-orange/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none" />

            {/* Header del Menú */}
            <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-xl relative z-10">
              <Link to="/" onClick={onClose} className="flex items-center gap-3 group outline-none">
                <div className="w-10 h-10 bg-brand-orange/10 rounded-xl flex items-center justify-center text-brand-orange shadow-inner border border-brand-orange/20 group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                  <Zap size={20} strokeWidth={2} />
                </div>
                <span className="font-display font-black text-xl uppercase italic tracking-tight text-white">
                  AudioElectro<span className="text-brand-orange">Car</span>
                </span>
              </Link>
              
              <button 
                onClick={onClose} 
                className="w-10 h-10 rounded-full bg-white/5 text-white/40 hover:bg-brand-orange hover:text-white transition-all flex items-center justify-center border border-white/10"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Navegación Principal */}
            <nav className="flex flex-col p-6 gap-2 relative z-10 flex-grow">
              <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold mb-4 ml-2">Menú Principal</p>
              
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={onClose}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 outline-none group ${
                      isActive 
                        ? 'bg-brand-orange text-white shadow-[0_10px_20px_-10px_rgba(249,115,22,0.5)]' 
                        : 'bg-transparent text-white/60 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10'
                    }`}
                  >
                    <div className={`flex items-center justify-center ${isActive ? 'text-white' : 'text-brand-orange group-hover:scale-110 transition-transform'}`}>
                      {link.icon}
                    </div>
                    <span className="text-sm font-display font-bold uppercase tracking-[0.2em] mt-0.5">
                      {link.name}
                    </span>
                    
                    {/* Flecha indicadora pequeña a la derecha */}
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                      <ChevronRightIcon size={14} className={isActive ? 'text-white/50' : 'text-white/30'} />
                    </div>
                  </Link>
                );
              })}
            </nav>
            
            {/* Footer del Menú (Contacto rápido y confianza) */}
            <div className="p-6 md:p-8 border-t border-white/5 bg-white/5 backdrop-blur-md relative z-10">
              <div className="flex flex-col gap-4">
                <a 
                  href="https://wa.me/5493813336575" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300 group"
                >
                  <MessageSquare size={18} className="group-hover:scale-110 transition-transform" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-80">Asesoramiento 24/7</span>
                    <span className="text-xs font-black uppercase tracking-wider mt-0.5">Contactar WhatsApp</span>
                  </div>
                </a>

                <div className="flex items-center justify-center gap-2 text-white/30 mt-2">
                  <ShieldCheck size={14} className="text-brand-orange" />
                  <p className="text-[9px] uppercase tracking-[0.2em] font-bold">
                    Compras 100% Seguras
                  </p>
                </div>
              </div>
            </div>

          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

// Pequeño componente helper para la flecha sin importar otro icono de lucide arriba
const ChevronRightIcon = ({ size, className }: { size: number, className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

export default Sidebar;