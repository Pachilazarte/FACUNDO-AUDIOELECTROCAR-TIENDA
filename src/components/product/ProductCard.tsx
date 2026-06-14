import React, { useState, useMemo } from 'react';
import { Plus, Zap, Eye, ShoppingCart, Star, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import ProductCardVisualizer from './ProductCardVisualizer';
import { getCleanImageUrl, parsePrice } from '../../pages/admin/priceUtils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  
  const precioLimpio = useMemo(() => parsePrice(product.precio), [product.precio]);

  // Lógica de estado de stock para añadir detalle visual
  const s = Number(product.stock) || 0;
  const isAgotado = !product.activo || s <= 0;
  const isLowStock = !isAgotado && s <= 3;

  const stockLabel = useMemo(() => {
    if (isAgotado) return { text: 'Agotado', color: 'text-brand-black/40', bg: 'bg-brand-black/5' };
    if (isLowStock) return { text: `¡Quedan ${s}!`, color: 'text-brand-orange', bg: 'bg-brand-orange/10' };
    return { text: 'En Stock', color: 'text-[#25D366]', bg: 'bg-[#25D366]/10' };
  }, [isAgotado, isLowStock, s]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAgotado) return;
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <>
      <motion.article 
        layout
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={!isAgotado ? { y: -8 } : undefined}
        viewport={{ once: true }}
        onClick={() => !isAgotado && setShowVisualizer(true)}
        className={`group relative flex flex-col bg-white rounded-[1.5rem] md:rounded-[2.8rem] p-2.5 md:p-3 transition-all duration-500 border border-brand-black/5 ${
          isAgotado 
            ? 'opacity-75 grayscale cursor-not-allowed hover:opacity-100' 
            : 'cursor-pointer hover:border-brand-orange/20 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)]'
        }`}
      >
        {/* ILUMINACIÓN DINÁMICA (GLOW) */}
        {!isAgotado && <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[1.5rem] md:rounded-[2.8rem] pointer-events-none" />}

        {/* CONTENEDOR DE IMAGEN UNIFICADO */}
        <div className="relative aspect-square overflow-hidden rounded-[1.2rem] md:rounded-[2.2rem] bg-brand-gray-light mb-4">
          <motion.img 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            src={getCleanImageUrl(product.imagenUrl)} 
            alt={product.nombre}
          />
          
          {/* OVERLAY DE ACCIÓN RÁPIDA (Solo si hay stock) */}
          {!isAgotado && (
            <div className="absolute inset-0 bg-brand-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
               <div className="flex flex-col items-center gap-2 scale-75 group-hover:scale-100 transition-transform duration-500">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-brand-black shadow-2xl">
                     <Eye size={24} />
                  </div>
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] drop-shadow-md">Vista Previa</span>
               </div>
            </div>
          )}

          {/* OVERLAY DE SIN STOCK */}
          {isAgotado && (
            <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] z-10 flex items-center justify-center">
              <span className="bg-brand-black text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-2xl rotate-[-12deg] border border-white/20">
                Sin Stock
              </span>
            </div>
          )}

          {/* INDICADOR DE BAJO STOCK */}
          {isLowStock && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[90%] pointer-events-none">
               <div className="bg-brand-orange/95 backdrop-blur-sm text-white py-2 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest text-center shadow-lg border border-white/20 animate-pulse">
                 ¡Se agota pronto!
               </div>
            </div>
          )}

          {/* BADGES SUPERIORES */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.novedad && (
              <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-sm flex items-center gap-2 border border-white/20">
                <Zap size={12} className="fill-brand-orange text-brand-orange" />
                <span className="text-[9px] font-black uppercase tracking-widest text-brand-black">Nuevo</span>
              </div>
            )}
          </div>
        </div>
        
        {/* BLOQUE DE INFORMACIÓN INTEGRADO */}
        <div className="px-2 md:px-3 pb-3 flex flex-col gap-3 md:gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-display font-black text-sm md:text-lg text-brand-black leading-tight group-hover:text-brand-orange transition-colors duration-300 line-clamp-2 md:line-clamp-1">
                {product.nombre}
              </h3>
              <span className="font-display font-black text-base md:text-xl text-brand-black italic shrink-0 tracking-tighter">
                ${precioLimpio.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-brand-black/20 uppercase tracking-widest">{product.categoria || 'Audio Premium'}</span>
              <div className="h-px bg-brand-black/5 flex-1" />
            </div>
          </div>
          
          {/* DESCRIPCIÓN CON FONDO CREMA INTEGRADO */}
          <div className="hidden md:block bg-[#FDFCFB]/80 rounded-[1.5rem] p-4 border border-brand-black/5 group-hover:bg-white transition-all duration-300">
            <p className="text-[11px] text-brand-black/50 font-light leading-relaxed line-clamp-2 h-[32px] italic">
              "{product.descripcion || "Diseñado para la excelencia sonora y durabilidad extrema."}"
            </p>
          </div>

          {/* FOOTER DE LA CARD */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${stockLabel.bg} ${stockLabel.color}`}>
                {stockLabel.text}
              </span>
            </div>

            <motion.button 
              whileTap={!isAgotado ? { scale: 0.9 } : undefined}
              disabled={isAgotado}
              onClick={!isAgotado ? handleAddToCart : undefined}
              className={`w-11 h-11 rounded-[1.2rem] flex items-center justify-center transition-all duration-500 shadow-xl relative z-20 ${
                isAgotado ? 'bg-brand-black/5 text-brand-black/20 cursor-not-allowed shadow-none' :
                isAdded ? 'bg-[#25D366] text-white' : 'bg-brand-black text-white hover:bg-brand-orange hover:shadow-brand-orange/30'
              }`}
            >
              {isAdded ? <Check size={20} /> : <Plus size={22} />}
            </motion.button>
          </div>
        </div>
      </motion.article>

      {/* Visualizador Detallado */}
      <AnimatePresence>
        {showVisualizer && (
          <ProductCardVisualizer 
            product={product} 
            onClose={() => setShowVisualizer(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductCard;