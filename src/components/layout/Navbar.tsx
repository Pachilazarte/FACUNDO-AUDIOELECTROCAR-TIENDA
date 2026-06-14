import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import logo1 from '../../img/logo1.webp';

// Utilidad para concatenar clases de Tailwind de forma segura
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = ({ onOpenCart, onToggleSidebar }: { onOpenCart: () => void, onToggleSidebar: () => void }) => {
  const { totalItems } = useCart();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Efecto para detectar el scroll y cambiar el estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Enlaces de navegación sincronizados con el resto de la página
  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Catálogo', path: '/productos' },
    { name: 'Quiénes Somos', path: '/quienes-somos' },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 px-4 md:px-8 h-16 md:h-20 flex justify-between items-center transition-all duration-500 font-sans selection:bg-brand-orange selection:text-white",
        scrolled
          ? "bg-brand-black/90 backdrop-blur-xl border-b border-white/5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
          : "bg-brand-black border-b border-transparent"
      )}
    >
      {/* LADO IZQUIERDO: Menú Móvil y Logo */}
      <div className="flex items-center gap-4 md:gap-6">
        <button
          onClick={onToggleSidebar}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-brand-orange hover:bg-brand-orange/10 hover:border-brand-orange/30 active:scale-95 transition-all md:hidden group"
        >
          <Menu size={20} className="group-hover:scale-110 transition-transform" />
        </button>

        <Link to="/" className="flex items-center outline-none">
          <img
            src={logo1}
            alt="AudioElectroCar Logo"
            className="h-12 md:h-14 w-auto object-contain hover:opacity-95 transition-all duration-300 filter drop-shadow-[0_0_15px_rgba(249,115,22,0.4)] brightness-115 contrast-110"
          />
        </Link>
      </div>

      {/* CENTRO: Enlaces de Navegación (Desktop) */}
      <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-xs font-display font-black uppercase tracking-[0.2em] transition-all duration-300 relative py-2 group outline-none",
                isActive
                  ? "text-white"
                  : "text-white/40 hover:text-white"
              )}
            >
              {link.name}

              {/* Indicador animado de la página activa */}
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-2 left-0 w-full h-1 bg-brand-orange rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Hover effect sutil para links inactivos */}
              {!isActive && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-1 bg-white/20 rounded-full transition-all duration-300 group-hover:w-1/2" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* LADO DERECHO: Carrito de Compras */}
      <div className="flex items-center">
        <button
          onClick={onOpenCart}
          className="relative w-10 h-10 md:w-12 md:h-12 rounded-[1rem] bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-brand-orange hover:bg-brand-orange/10 hover:border-brand-orange/30 active:scale-95 transition-all group outline-none"
        >
          <ShoppingCart size={20} className="md:w-6 md:h-6 group-hover:scale-110 transition-transform" />

          {/* Badge del carrito Premium con Animación al Agregar */}
          <AnimatePresence>
            {totalItems > 0 && (
              <motion.div
                key={totalItems} // Fuerzo el re-montaje para que se anime en CADA cambio
                initial={{ scale: 0.2, y: 10, rotate: -20 }}
                animate={{ scale: 1, y: 0, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                className="absolute -top-2 -right-2 bg-brand-orange text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[1.25rem] h-5 flex items-center justify-center border-2 border-brand-black shadow-[0_0_15px_rgba(249,115,22,0.6)]"
              >
                {totalItems}
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </header>
  );
};

export default Navbar;