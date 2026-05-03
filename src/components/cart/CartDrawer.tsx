import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

/**
 * Función robusta para limpiar precios de Google Sheets.
 * Convierte "$ 15.000,50" o "15.000" en el número JS real 15000.50
 */
const parsePrice = (val: any): number => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  
  const strVal = String(val);
  
  // Si Javascript ya lo puede interpretar como número directo (ej: "15000")
  if (!isNaN(Number(strVal)) && strVal.trim() !== '') {
    return Number(strVal);
  }

  // Limpiamos formato argentino/latino
  const cleaned = strVal
    .replace(/\$/g, '')   // Quita el signo $
    .replace(/\./g, '')   // Quita el punto de los miles
    .replace(/\s/g, '')   // Quita espacios
    .replace(/,/g, '.');  // Cambia la coma decimal a punto

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { items, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  // CALCULADORA LOCAL: Multiplica Precio (limpio) x Cantidad
  const calculatedTotal = useMemo(() => {
    return items.reduce((total, item) => {
      const precioLimpio = parsePrice(item.precio);
      const cantidad = Number(item.quantity) || 1;
      return total + (precioLimpio * cantidad);
    }, 0);
  }, [items]);

  // Contabiliza el total real de artículos (sumando las cantidades)
  const totalItemsCount = useMemo(() => {
    return items.reduce((count, item) => count + (Number(item.quantity) || 1), 0);
  }, [items]);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay oscuro con blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-black/60 backdrop-blur-md z-[100]"
          />
          
          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-brand-gray-light z-[110] shadow-[-20px_0_50px_rgba(0,0,0,0.3)] flex flex-col rounded-l-[2rem] overflow-hidden border-l border-brand-black/5 font-sans selection:bg-brand-orange selection:text-white"
          >
            {/* Header del Carrito */}
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-brand-black/5 bg-white/50 backdrop-blur-xl z-20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-[1rem] shadow-sm border border-brand-black/5 flex items-center justify-center text-brand-orange">
                  <ShoppingBag size={22} strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-brand-black font-display font-black uppercase text-2xl italic leading-none">Mi Carrito</h2>
                  <p className="text-brand-black/40 text-[10px] font-bold uppercase tracking-widest mt-1">
                    {totalItemsCount} {totalItemsCount === 1 ? 'Artículo' : 'Artículos'} en total
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="w-10 h-10 rounded-full bg-brand-black/5 text-brand-black/40 hover:bg-brand-orange hover:text-white transition-all flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>

            {/* Lista de Productos */}
            <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-5 bg-transparent relative z-10">
              {items.length === 0 ? (
                // --- ESTADO VACÍO ---
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-6"
                >
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner border border-brand-black/5 text-brand-black/20 relative">
                    <ShoppingBag size={48} strokeWidth={1} />
                    <div className="absolute top-0 right-0 w-6 h-6 bg-brand-orange/20 rounded-full blur-sm" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-brand-black uppercase italic text-2xl mb-2">Carrito Vacío</h3>
                    <p className="text-brand-black/40 font-light max-w-[250px] mx-auto text-sm">
                      Parece que aún no has agregado ningún componente tecnológico a tu pedido.
                    </p>
                  </div>
                  <button 
                    onClick={() => { onClose(); navigate('/productos'); }}
                    className="bg-brand-black text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] hover:bg-brand-orange transition-colors shadow-lg flex items-center gap-2"
                  >
                    Explorar Catálogo <ArrowRight size={14} />
                  </button>
                </motion.div>
              ) : (
                // --- ITEMS DEL CARRITO ---
                items.map((item) => {
                  // Limpiamos el precio localmente para esta iteración
                  const precioLimpio = parsePrice(item.precio);
                  const subtotalItem = precioLimpio * item.quantity;

                  return (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                      key={item.id} 
                      className="group flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-[1.5rem] border border-brand-black/5 shadow-sm hover:border-brand-orange/30 hover:shadow-md transition-all"
                    >
                      {/* Imagen del Producto */}
                      <div className="h-24 w-24 sm:w-28 sm:h-28 flex-shrink-0 bg-brand-gray-light rounded-[1rem] overflow-hidden relative border border-brand-black/5 mx-auto sm:mx-0">
                        <img src={item.imagenUrl} alt={item.nombre} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      
                      {/* Detalles del Producto */}
                      <div className="flex flex-col justify-between flex-grow">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-display font-bold text-sm md:text-base text-brand-black uppercase leading-tight line-clamp-2 pr-2">
                              {item.nombre}
                            </h3>
                            <button 
                              onClick={() => removeFromCart(item.id)} 
                              className="text-brand-black/20 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors flex-shrink-0"
                              title="Eliminar producto"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          
                          <div className="flex items-center flex-wrap gap-2 mt-2">
                            <span className="inline-flex items-center gap-1 bg-brand-orange/10 text-brand-orange px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest">
                              <Tag size={10} /> {item.categoria}
                            </span>
                            <span className="text-[11px] font-medium text-brand-black/40 bg-brand-gray-light px-2 py-1 rounded-md">
                              ${precioLimpio.toLocaleString()} c/u
                            </span>
                          </div>
                        </div>

                        {/* Controles de Cantidad y Subtotal por Línea */}
                        <div className="flex items-end justify-between mt-4 border-t border-brand-black/5 pt-3">
                          <div className="flex items-center bg-brand-gray-light rounded-xl border border-brand-black/10 h-10">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-10 h-full flex items-center justify-center text-brand-black/50 hover:text-brand-orange hover:bg-brand-orange/10 rounded-l-xl transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-xs font-bold text-brand-black text-center select-none">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-10 h-full flex items-center justify-center text-brand-black/50 hover:text-brand-orange hover:bg-brand-orange/10 rounded-r-xl transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-[9px] font-bold text-brand-black/30 uppercase tracking-widest mb-0.5">Subtotal</p>
                            <span className="font-display font-black text-brand-black text-lg italic leading-none block">
                              ${subtotalItem.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* --- FOOTER / RESUMEN DE PAGO --- */}
            {items.length > 0 && (
              <div className="p-6 md:p-8 bg-white border-t border-brand-black/5 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-20">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-brand-black/60">
                    <span className="text-[11px] font-bold uppercase tracking-widest">Subtotal ({totalItemsCount} prod.)</span>
                    <span className="text-sm font-medium">${calculatedTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-brand-black/60">
                    <span className="text-[11px] font-bold uppercase tracking-widest">Envío Nacional</span>
                    <span className="text-[11px] font-bold text-brand-orange uppercase tracking-widest bg-brand-orange/10 px-2 py-0.5 rounded">Calculado en Checkout</span>
                  </div>
                  
                  <div className="h-px bg-brand-black/10 w-full my-2" />
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="font-display font-black text-brand-black uppercase text-sm tracking-widest block">Total Estimado</span>
                      <span className="text-[10px] text-brand-black/40 font-medium">Impuestos incluidos</span>
                    </div>
                    <span className="font-display font-black text-4xl text-brand-orange italic leading-none">
                      ${calculatedTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-brand-black text-white py-5 rounded-2xl flex items-center justify-center gap-3 font-display font-black uppercase text-sm tracking-[0.2em] hover:bg-brand-orange hover:shadow-[0_10px_30px_rgba(249,115,22,0.3)] active:scale-[0.98] transition-all duration-300 group"
                >
                  Finalizar Compra
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                <p className="text-center text-brand-black/30 text-[10px] uppercase tracking-widest mt-5 flex items-center justify-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#25D366]" /> 
                  Operación protegida y segura
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;