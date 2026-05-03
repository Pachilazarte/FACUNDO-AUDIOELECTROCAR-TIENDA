import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { api } from '../utils/api';
import { User, ChevronRight, CheckCircle2, MessageSquare, ShieldCheck, ShoppingBag, QrCode, ArrowRight, Smartphone, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

/**
 * Función robusta para limpiar precios de Google Sheets.
 */
const parsePrice = (val: any): number => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const strVal = String(val);
  if (!isNaN(Number(strVal)) && strVal.trim() !== '') return Number(strVal);
  const cleaned = strVal.replace(/\$/g, '').replace(/\./g, '').replace(/\s/g, '').replace(/,/g, '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

const Checkout = () => {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  
  // ESTADOS DEL FLUJO
  // 1 = Formulario | 2 = QR de WhatsApp | 3 = Éxito / Gracias
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [contactConfirmed, setContactConfirmed] = useState(false);
  
  // Congelamos los datos del pedido final para que el QR no se borre al vaciar el carrito
  const [finalOrder, setFinalOrder] = useState({ id: '', total: 0 });
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
  });

  // Calculamos el total en tiempo real para el paso 1
  const calculatedTotal = useMemo(() => {
    return items.reduce((total, item) => {
      return total + (parsePrice(item.precio) * (Number(item.quantity) || 1));
    }, 0);
  }, [items]);

  const totalItemsCount = useMemo(() => {
    return items.reduce((count, item) => count + (Number(item.quantity) || 1), 0);
  }, [items]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // PASO 1 -> PASO 2 (Crear Pedido en la Base de Datos)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    try {
      const newOrderId = `AudioElectroCar-${new Date().getTime().toString().slice(-6)}`;
      const currentTotal = calculatedTotal;

      // Generamos un string legible con el resumen de productos para la celda de Excel
      const resumenProductos = items.map(i => 
        `${i.quantity}x ${i.nombre} ($${parsePrice(i.precio).toLocaleString()})`
      ).join(' | ');

      // NUEVO: Generamos el string técnico con IDs y cantidades para descontar stock luego
      const idsYCantidades = items.map(i => 
        `${i.id}:${i.quantity}`
      ).join(' | ');

      // ESTE PAYLOAD DEBE COINCIDIR EXACTAMENTE CON TUS ENCABEZADOS DE EXCEL
      const payload = {
        orderId: newOrderId,
        // La columna "fecha" la rellena automáticamente el Apps Script
        clienteNombre: formData.nombre,
        clienteEmail: formData.email,
        clienteTelefono: formData.telefono,
        productosDetalle: resumenProductos,
        productosIds: idsYCantidades, // <--- AQUÍ AGREGAMOS EL ID Y LA CANTIDAD PARA EL STOCK
        cantidadTotal: totalItemsCount,
        total: currentTotal,
        estado: 'PENDIENTE',
        metodoPago: 'Transferencia/WhatsApp',
      };

      // Enviamos a Google Sheets
      await api.crearPedido(payload);
      
      // Congelamos los datos para generar el WhatsApp y el QR correctamente
      setFinalOrder({ id: newOrderId, total: currentTotal });
      
      // Pasamos al paso 2 SIN vaciar el carrito aún
      setStep(2); 
    } catch (err) {
      console.error("Error creating order:", err);
      alert("Hubo un error al guardar tu pedido. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CONFIGURACIÓN OFICIAL DE WHATSAPP
  // ==========================================
  const whatsappNum = '5493813336575';
  const whatsappMessage = `Hola mi compra es de $${finalOrder.total.toLocaleString()}, te comparto el comprobante de pago. (Pedido: ${finalOrder.id})`;
  const whatsappLink = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(whatsappMessage)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(whatsappLink)}&color=000000&bgcolor=ffffff`;

  // PASO 2 -> PASO 3 (Finalizar Compra y Vaciar Carrito)
  const handleFinalize = () => {
    if (contactConfirmed) {
      clearCart(); // Recién aquí vaciamos el carrito para no perder los datos antes
      setStep(3);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-brand-gray-light font-sans selection:bg-brand-orange selection:text-white flex items-center justify-center">
      <div className="container-max px-6 w-full">
        
        <AnimatePresence mode="wait">
          
          {/* ==========================================
              PASO 1: FORMULARIO Y RESUMEN
              ========================================== */}
          {step === 1 && (
            <motion.div 
              key="step-1"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
            >
              {/* Lado Izquierdo: Formulario */}
              <div className="lg:col-span-7 flex flex-col gap-8">
                <div>
                  <h1 className="text-4xl md:text-5xl font-display font-black text-brand-black uppercase italic tracking-tight">
                    Completar <span className="text-brand-orange">Pedido</span>
                  </h1>
                  <p className="text-brand-black/40 font-light mt-2">Ingresa tus datos para registrar la compra. El pago se coordina vía WhatsApp.</p>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-brand-black/5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-brand-orange/10 rounded-2xl flex items-center justify-center text-brand-orange">
                      <User size={24} />
                    </div>
                    <h2 className="text-2xl font-display font-black text-brand-black uppercase italic">Tus Datos</h2>
                  </div>
                  
                  <form id="checkout-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/50 ml-2">Nombre Completo</label>
                      <input 
                        required name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Juan Pérez"
                        className="w-full p-4 bg-brand-gray-light/50 border border-transparent focus:bg-white focus:border-brand-orange/50 rounded-2xl outline-none transition-all font-bold text-sm text-brand-black placeholder:text-brand-black/20 focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)]" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/50 ml-2">Email</label>
                      <input 
                        required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="juan@ejemplo.com"
                        className="w-full p-4 bg-brand-gray-light/50 border border-transparent focus:bg-white focus:border-brand-orange/50 rounded-2xl outline-none transition-all font-bold text-sm text-brand-black placeholder:text-brand-black/20 focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)]" 
                      />
                    </div>
                    <div className="md:col-span-2 flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/50 ml-2">WhatsApp / Teléfono</label>
                      <div className="flex items-center bg-brand-gray-light/50 border border-transparent focus-within:bg-white focus-within:border-brand-orange/50 rounded-2xl transition-all focus-within:shadow-[0_0_0_4px_rgba(249,115,22,0.1)] overflow-hidden">
                        <span className="px-5 text-brand-black/40 font-black text-xs bg-black/5 h-[56px] flex items-center border-r border-black/5 select-none">+54</span>
                        <input 
                          required name="telefono" value={formData.telefono} onChange={handleChange} placeholder="381 0000 000"
                          className="w-full p-4 bg-transparent outline-none text-sm font-bold text-brand-black placeholder:text-brand-black/20" 
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* Lado Derecho: Resumen */}
              <aside className="lg:col-span-5">
                <div className="sticky top-28 bg-brand-black rounded-[3rem] p-8 md:p-10 border border-white/5 shadow-2xl flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 blur-[80px] rounded-full pointer-events-none" />
                  
                  <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6 relative z-10">
                     <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-brand-orange">
                       <ShoppingBag size={24} />
                     </div>
                     <div>
                       <h3 className="text-2xl font-display font-black text-white uppercase italic leading-none">Resumen</h3>
                       <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">{totalItemsCount} Artículos</p>
                     </div>
                  </div>
                  
                  <div className="space-y-6 mb-8 max-h-[35vh] overflow-y-auto pr-2 custom-scrollbar relative z-10">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <div className="w-14 h-14 rounded-xl bg-brand-gray-light flex-shrink-0 overflow-hidden">
                          <img src={item.imagenUrl} alt={item.nombre} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-bold text-white uppercase line-clamp-1 mb-1">{item.nombre}</span>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-brand-orange uppercase font-black bg-brand-orange/10 px-2 py-0.5 rounded">Cant: {item.quantity}</span>
                            <span className="text-sm text-white font-black italic">${(parsePrice(item.precio) * item.quantity).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 pt-6 border-t border-white/10 mt-auto relative z-10">
                    <div className="flex justify-between items-end text-brand-orange uppercase italic">
                      <span className="text-sm font-black tracking-widest text-white">Total</span>
                      <span className="text-4xl font-black leading-none">${calculatedTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    form="checkout-form"
                    disabled={loading || items.length === 0}
                    className="w-full mt-8 bg-brand-orange text-white py-5 rounded-2xl font-display font-black uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-brand-black active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 relative z-10"
                  >
                    {loading ? "Procesando..." : (<>Confirmar y Pagar <ArrowRight size={16} /></>)}
                  </button>
                </div>
              </aside>
            </motion.div>
          )}

          {/* ==========================================
              PASO 2: COORDINACIÓN VÍA WHATSAPP (QR)
              ========================================== */}
          {step === 2 && (
            <motion.div 
              key="step-2"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto w-full"
            >
              <div className="bg-white rounded-[3rem] p-10 md:p-14 text-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-brand-black/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#25D366]/5 blur-[80px] rounded-full pointer-events-none" />
                
                <h2 className="text-3xl md:text-4xl font-display font-black text-brand-black uppercase italic mb-4 relative z-10">
                  ¡Pedido Registrado!
                </h2>
                <p className="text-brand-black/50 font-light mb-8 text-sm md:text-base relative z-10 max-w-md mx-auto">
                  Para finalizar, escanea el QR o haz clic en el botón para contactar a tu asesor de ventas. <strong>Envíanos el comprobante de pago para procesar el envío.</strong>
                </p>

                {/* Contenedor del QR */}
                <div className="bg-brand-gray-light p-6 md:p-8 rounded-[2rem] inline-block mx-auto mb-8 border border-brand-black/5 relative z-10 shadow-inner group">
                  <div className="w-48 h-48 bg-white rounded-2xl shadow-sm p-4 mx-auto relative overflow-hidden">
                    <div className="absolute inset-0 border-4 border-[#25D366]/30 rounded-2xl scale-[1.05] opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 pointer-events-none" />
                    <img src={qrCodeUrl} alt="WhatsApp QR" className="w-full h-full mix-blend-multiply" />
                  </div>
                  <p className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-black/40 mt-6">
                    <QrCode size={14} /> Escanear para enviar
                  </p>
                </div>

                {/* Botón Celular */}
                <div className="relative z-10 mb-10">
                  <span className="text-[10px] uppercase font-bold text-brand-black/30 tracking-widest block mb-4">¿Estás desde el celular?</span>
                  <a 
                    href={whatsappLink} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-2xl font-display font-black uppercase tracking-widest text-xs hover:bg-[#20b858] active:scale-[0.98] transition-all shadow-[0_10px_20px_rgba(37,211,102,0.3)] w-full sm:w-auto"
                  >
                    <Smartphone size={18} /> Abrir WhatsApp Directo
                  </a>
                </div>

                <div className="h-px bg-brand-black/5 w-full mb-8 relative z-10" />

                {/* Checkbox de Confirmación Personalizado */}
                <div className="relative z-10 flex flex-col items-center">
                  <label className="flex items-center gap-4 cursor-pointer group mb-8 bg-brand-gray-light/50 p-4 pr-6 rounded-2xl border border-transparent hover:border-brand-black/10 transition-colors">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={contactConfirmed} 
                        onChange={(e) => setContactConfirmed(e.target.checked)}
                        className="peer sr-only" 
                      />
                      <div className="w-8 h-8 rounded-xl border-2 border-brand-black/20 bg-white peer-checked:bg-brand-orange peer-checked:border-brand-orange transition-all flex items-center justify-center">
                        <Check size={16} className={`text-white transition-transform ${contactConfirmed ? 'scale-100' : 'scale-0'}`} strokeWidth={3} />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-brand-black uppercase tracking-wide select-none">
                      Ya envié el comprobante al vendedor
                    </span>
                  </label>

                  <button 
                    onClick={handleFinalize}
                    disabled={!contactConfirmed}
                    className="w-full bg-brand-black text-white py-5 rounded-2xl font-display font-black uppercase tracking-[0.2em] text-xs hover:bg-brand-orange active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    Confirmar Compra <CheckCircle2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==========================================
              PASO 3: ÉXITO TOTAL (AGRADECIMIENTO)
              ========================================== */}
          {step === 3 && (
            <motion.div 
              key="step-3"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto w-full"
            >
              <div className="bg-brand-black rounded-[3rem] p-12 md:p-16 text-center shadow-2xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-orange/20 blur-[80px] rounded-full pointer-events-none" />
                
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 relative z-10">
                  <ShieldCheck size={48} className="text-brand-orange" />
                </div>
                
                <h2 className="text-4xl md:text-5xl font-display font-black text-white uppercase italic mb-4 relative z-10">
                  ¡Muchas <span className="text-brand-orange">Gracias!</span>
                </h2>
                <p className="text-white/50 font-light mb-10 text-lg relative z-10">
                  Hemos recibido tu confirmación. Tu asesor validará el pago y preparará tu pedido (<strong>{finalOrder.id}</strong>).
                </p>

                <button 
                  onClick={() => navigate('/')}
                  className="bg-white text-brand-black px-10 py-4 rounded-2xl font-display font-black uppercase tracking-widest text-xs hover:bg-brand-orange hover:text-white transition-all relative z-10"
                >
                  Volver al Catálogo
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default Checkout;