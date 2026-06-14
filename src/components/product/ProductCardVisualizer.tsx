import React from 'react';
import { motion } from 'motion/react';
import { X, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { getCleanImageUrl, parsePrice } from '../../pages/admin/priceUtils';

interface VisualizerProps {
  product: Product;
  onClose: () => void;
}

const ProductCardVisualizer: React.FC<VisualizerProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const precioLimpio = parsePrice(product.precio);
  
  const stockCount = Number(product.stock) || 0;
  const isLowStock = stockCount > 0 && stockCount <= 3;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 lg:p-12 font-sans selection:bg-brand-orange selection:text-white">
      {/* Backdrop con desenfoque de cristal */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-black/70 backdrop-blur-md"
      />

      {/* Contenedor Modal (Identidad de Marca + Premium) */}
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white w-full h-full md:h-auto md:h-[85vh] md:max-w-6xl lg:max-w-[1400px] md:rounded-[2.5rem] overflow-y-auto md:overflow-hidden flex flex-col md:flex-row relative z-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] border border-white/20 custom-scrollbar"
      >
        {/* Botón Cerrar (Estilo AudioElectroCar) */}
        <button 
          onClick={onClose}
          className="fixed md:absolute top-4 right-4 md:top-8 md:right-8 z-50 w-11 h-11 md:w-14 md:h-14 bg-white/90 md:bg-brand-gray-light backdrop-blur-md rounded-full flex items-center justify-center text-brand-black/40 hover:text-brand-orange hover:bg-white hover:shadow-lg transition-all active:scale-90 border border-brand-black/5"
        >
          <X size={26} strokeWidth={2} />
        </button>

        {/* LADO IZQUIERDO: IMAGEN CON GLOW SUTIL */}
        <div className="w-full md:w-[55%] bg-brand-gray-light flex flex-col items-center justify-center relative min-h-[350px] md:min-h-full overflow-hidden">
          {/* Brillo de fondo sutil naranja */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-transparent opacity-50 pointer-events-none" />
          
          <motion.img 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            src={getCleanImageUrl(product.imagenUrl)} 
            alt={product.nombre} 
            className="w-full h-full object-cover md:object-contain p-0 md:p-20 lg:p-28 absolute inset-0 md:relative mix-blend-multiply drop-shadow-2xl z-10" 
          />
          
          <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 hidden md:flex z-20">
            <div className="px-4 py-2 md:px-6 md:py-3 rounded-xl border border-brand-black/5 bg-white/90 backdrop-blur-md flex items-center gap-3 shadow-md">
               <ShieldCheck size={20} className="text-brand-orange" />
               <span className="text-[10px] md:text-xs font-black text-brand-black/60 uppercase tracking-[0.2em]">Garantía Oficial</span>
            </div>
          </div>
        </div>

        {/* LADO DERECHO: TIPOGRAFÍA DE MARCA */}
        <div className="w-full md:w-[45%] p-8 md:p-14 lg:p-20 xl:p-24 flex flex-col bg-[#FDFCFB]">
          <div className="flex-1">
            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
               <span className={`text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] px-3 py-1.5 md:px-4 md:py-2 rounded-lg ${isLowStock ? 'bg-brand-orange/10 text-brand-orange' : 'bg-[#25D366]/10 text-[#25D366]'}`}>
                 {isLowStock ? 'Últimas Unidades' : 'Stock Disponible'}
               </span>
               <span className="text-[9px] md:text-[11px] font-bold text-brand-black/30 tracking-widest uppercase">ID: {product.id}</span>
            </div>

            {/* Título de Marca */}
            <h2 className="text-2xl md:text-5xl lg:text-6xl font-display font-black text-brand-black mb-6 md:mb-10 leading-[1.1] tracking-tight">
              {product.nombre}
            </h2>

            {/* Precio de Marca */}
            <div className="mb-10 md:mb-12 flex items-baseline gap-2">
              <span className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-brand-orange tracking-tighter">
                ${precioLimpio.toLocaleString()}
              </span>
            </div>

            {/* Separador de Marca */}
            <div className="w-full h-px bg-brand-black/5 mb-8 md:mb-12" />

            {/* Descripción */}
            <div className="mb-10 lg:mb-14">
              <div className="flex items-center gap-3 mb-5 md:mb-6">
                 <div className="h-[2px] bg-brand-orange w-6 md:w-8" />
                 <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-brand-black/40">Acerca del Producto</h4>
              </div>
              <p className="text-sm md:text-lg lg:text-xl font-medium text-brand-black/60 leading-relaxed italic">
                "{product.descripcion || "Componente premium seleccionado para una integración perfecta y rendimiento superior en su vehículo. Diseñado para ofrecer durabilidad y excelencia técnica."}"
              </p>
            </div>
          </div>

          {/* Botón de Acción de Marca */}
          <div className="pt-6 md:pt-10 mt-auto">
            <button 
              disabled={!product.activo}
              onClick={() => { addToCart(product); onClose(); }}
              className="w-full bg-brand-black text-white py-5 md:py-7 lg:py-8 rounded-[1.5rem] md:rounded-[2rem] font-display font-black uppercase tracking-[0.2em] text-[11px] md:text-[14px] lg:text-[16px] hover:bg-brand-orange hover:shadow-[0_15px_30px_rgba(249,115,22,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 md:gap-4 disabled:bg-brand-gray-light disabled:text-brand-black/30 disabled:cursor-not-allowed disabled:shadow-none"
            >
              <ShoppingBag size={24} className="md:w-7 md:h-7" />
              {product.activo ? 'Agregar al Pedido' : 'Agotado'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductCardVisualizer;