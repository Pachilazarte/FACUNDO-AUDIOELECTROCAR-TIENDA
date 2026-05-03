import React from 'react';
import { motion } from 'motion/react';
import { X, ShoppingCart, Zap, ShieldCheck, Info, Share2 } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

interface VisualizerProps {
  product: Product;
  onClose: () => void;
}

const parsePrice = (val: any): number => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const strVal = String(val);
  const cleaned = strVal.replace(/\$/g, '').replace(/\./g, '').replace(/\s/g, '').replace(/,/g, '.');
  return parseFloat(cleaned) || 0;
};

const ProductCardVisualizer: React.FC<VisualizerProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const precioLimpio = parsePrice(product.precio);
  
  const stockCount = Number(product.stock) || 0;
  const isLowStock = stockCount > 0 && stockCount <= 3;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 font-sans selection:bg-brand-orange">
      {/* Backdrop con desenfoque de cristal */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-black/60 backdrop-blur-xl"
      />

      {/* Contenedor Modal Refinado */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="bg-white rounded-[3rem] w-full max-w-5xl overflow-hidden flex flex-col md:flex-row relative z-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-white/10"
      >
        {/* Botón Cerrar Minimalista */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-30 w-10 h-10 bg-brand-gray-light rounded-full flex items-center justify-center text-brand-black/40 hover:text-brand-orange hover:bg-white transition-all shadow-sm active:scale-90"
        >
          <X size={20} />
        </button>

        {/* LADO IZQUIERDO: EXHIBICIÓN (SLIM) */}
        <div className="w-full md:w-[50%] bg-[#FDFCFB] p-8 md:p-12 flex flex-col items-center justify-center relative min-h-[350px] border-r border-brand-black/5">
          <div className="absolute top-8 left-10 text-brand-black/[0.02] pointer-events-none select-none font-display font-black text-[10rem] italic uppercase tracking-tighter leading-none">
            AEC
          </div>
          
          <motion.img 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            src={product.imagenUrl} 
            alt={product.nombre} 
            className="w-full h-auto max-h-[400px] object-contain relative z-10 mix-blend-multiply drop-shadow-xl" 
          />
          
          <div className="absolute bottom-8 left-8">
            <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl border border-brand-black/5 flex items-center gap-2 shadow-sm">
               <ShieldCheck size={16} className="text-brand-orange" />
               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-black/40">Garantía Certificada</span>
            </div>
          </div>
        </div>

        {/* LADO DERECHO: CONTENIDO REFINADO */}
        <div className="w-full md:w-[50%] p-8 md:p-14 flex flex-col bg-white">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
               <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg ${isLowStock ? 'bg-brand-orange/10 text-brand-orange' : 'bg-[#25D366]/10 text-[#25D366]'}`}>
                 {isLowStock ? 'Últimas Unidades' : 'En Stock'}
               </span>
               <span className="text-[9px] font-bold text-brand-black/10 tracking-widest uppercase">ID: {product.id}</span>
            </div>

            {/* Título con control de desborde */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-black text-brand-black italic mb-8 leading-[1.1] tracking-tight break-words">
              {product.nombre}
            </h2>

            {/* Bloque de Descripción Estilizado */}
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-3">
                 <div className="h-[2px] bg-brand-orange w-8" />
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-black/20">Descripción del Producto</h4>
              </div>
              <div className="bg-brand-gray-light/30 p-6 rounded-[2rem] border border-brand-black/5 relative group">
                <div className="absolute -right-2 -top-2 opacity-[0.02] pointer-events-none group-hover:opacity-5 transition-opacity">
                  <Info size={100} strokeWidth={1} />
                </div>
                <p className="text-[14px] md:text-[15px] font-medium text-brand-black/50 leading-relaxed italic relative z-10">
                  "{product.descripcion || "Este componente ha sido seleccionado por AudioElectroCar para elevar la experiencia sonora de tu vehículo."}"
                </p>
              </div>
            </div>
          </div>

          {/* Footer del Modal */}
          <div className="pt-8 border-t border-brand-black/5 flex flex-col gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-brand-black/20 uppercase tracking-[0.3em] mb-1">Inversión Final</span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl md:text-6xl font-display font-black text-brand-orange italic tracking-tighter leading-none">
                  ${precioLimpio.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-brand-black/20 uppercase tracking-widest italic">ars</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                disabled={!product.activo}
                onClick={() => { addToCart(product); onClose(); }}
                className="flex-1 bg-brand-black text-white py-5 rounded-[1.8rem] font-display font-black uppercase tracking-[0.2em] text-[11px] hover:bg-brand-orange active:scale-[0.97] transition-all shadow-xl flex items-center justify-center gap-4 disabled:opacity-20"
              >
                <ShoppingCart size={20} />
                {product.activo ? 'Agregar al Pedido' : 'Agotado'}
              </button>
              
              <button className="w-16 h-16 bg-brand-gray-light text-brand-black/40 rounded-[1.8rem] flex items-center justify-center hover:bg-white hover:text-brand-orange hover:shadow-md transition-all shadow-inner border border-brand-black/5">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductCardVisualizer;