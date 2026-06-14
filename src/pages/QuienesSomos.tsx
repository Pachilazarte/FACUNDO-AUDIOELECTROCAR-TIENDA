import React from 'react';
import { motion } from 'motion/react';
import { Info, Target, ShieldCheck, Mail, MapPin, MessageCircle, Star, Truck, Wrench, CheckCircle2 } from 'lucide-react';
import logo3 from '../img/logo3.webp';

const QuienesSomos = () => {
  return (
    <div className="min-h-screen bg-brand-gray-light font-sans selection:bg-brand-orange selection:text-white pb-24">
      
      {/* --- HERO SECTION --- */}
      <section className="relative bg-brand-black pt-24 pb-32 md:pt-40 md:pb-64 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://imgur.com/EkekaM8.png" 
            alt="AudioElectroCar Taller" 
            className="w-full h-full object-cover opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-gray-light via-brand-black/80 to-brand-black/40" />
        </div>
        
        <div className="absolute right-0 top-0 w-1/2 h-full bg-brand-orange/5 -skew-x-12 translate-x-1/3 blur-3xl pointer-events-none" />
        
        <div className="container-max px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Columna Izquierda: Historia */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-brand-orange/20 text-brand-orange px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-brand-orange/30 backdrop-blur-md">
                  Audio, Electro & Soluciones
                </span>
              </div>
              <h1 className="text-4xl md:text-7xl font-display font-black text-white uppercase italic leading-[1.1] md:leading-[0.9] tracking-tight">
                Evolución Tecnológica <br />
                <span className="text-brand-orange relative inline-block mt-1 md:mt-2">
                  a tu alcance
                  <span className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-1 md:h-1.5 bg-brand-orange rounded-full opacity-40 blur-sm"></span>
                </span>
              </h1>
              <p className="text-white/70 text-sm md:text-xl font-light leading-relaxed mt-4 md:mt-8">
                En <strong className="text-white font-bold">AudioElectroCar</strong>, anteriormente bajo el nombre de "Electrónica Fashion", ya llevamos más de 6 años transformando la forma en que interactúas con la tecnología. Nacimos con la pasión por el sonido de alta fidelidad y hemos evolucionado hasta convertirnos en un distribuidor integral.
              </p>
            </motion.div>

            {/* Columna Derecha: Mascota Emblema con Resplandor Ambiental */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 flex justify-center"
            >
              <div className="relative flex items-center justify-center w-full mt-2 md:mt-0">
                <div className="absolute w-56 h-56 md:w-72 md:h-72 bg-brand-orange/20 rounded-full blur-2xl md:blur-3xl opacity-80 pointer-events-none" />
                <img 
                  src={logo3} 
                  alt="AudioElectroCar Mascota Sticker" 
                  className="h-64 md:h-[28rem] w-auto object-contain relative z-10 select-none filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)] md:drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* --- STATS BAR (Flotante) --- */}
      <div className="container-max px-4 md:px-6 -mt-20 md:-mt-32 relative z-30 mb-8 md:mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 backdrop-blur-2xl border border-white/60 shadow-lg md:shadow-xl rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-brand-black/10"
        >
          <div className="flex flex-col items-center text-center pt-2 md:pt-0">
            <span className="text-3xl md:text-4xl font-display font-black text-brand-black italic mb-0.5 md:mb-1">+6 Años</span>
            <p className="text-brand-black/50 text-[10px] md:text-sm font-bold uppercase tracking-widest">De Trayectoria</p>
          </div>
          <div className="flex flex-col items-center text-center pt-4 md:pt-0">
            <span className="text-3xl md:text-4xl font-display font-black text-brand-orange italic mb-0.5 md:mb-1">+7.000</span>
            <p className="text-brand-black/50 text-[10px] md:text-sm font-bold uppercase tracking-widest">Ventas Exitosas</p>
          </div>
          <div className="flex flex-col items-center text-center pt-4 md:pt-0 pb-2 md:pb-0">
            <span className="text-3xl md:text-4xl font-display font-black text-brand-black italic mb-0.5 md:mb-1">100%</span>
            <p className="text-brand-black/50 text-[10px] md:text-sm font-bold uppercase tracking-widest">Cobertura Nacional</p>
          </div>
        </motion.div>
      </div>

      {/* --- CARDS SECTION (Misión, Visión, Respaldo) --- */}
      <div className="container-max px-6 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="bg-white border border-brand-black/5 p-4 md:p-12 rounded-[1.2rem] md:rounded-[2.5rem] shadow-sm md:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] group transition-all duration-300 flex flex-row md:flex-col items-center md:text-center gap-3 md:gap-4"
          >
            <div className="w-10 h-10 md:w-16 md:h-16 flex-shrink-0 bg-brand-orange/10 rounded-full md:rounded-2xl flex items-center justify-center text-brand-orange md:mx-auto md:mb-8 group-hover:scale-110 group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
              <Target size={20} className="md:w-8 md:h-8" strokeWidth={2} />
            </div>
            <div className="text-left md:text-center">
              <h3 className="text-[13px] md:text-2xl font-display font-black text-brand-black uppercase italic mb-0.5 md:mb-4">Nuestra Misión</h3>
              <p className="text-brand-black/60 text-[11px] md:text-sm leading-relaxed font-medium">
                Soluciones de alta calidad con precios de mayorista y atención excepcional.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white border border-brand-black/5 p-4 md:p-12 rounded-[1.2rem] md:rounded-[2.5rem] shadow-sm md:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] group transition-all duration-300 flex flex-row md:flex-col items-center md:text-center gap-3 md:gap-4"
          >
            <div className="w-10 h-10 md:w-16 md:h-16 flex-shrink-0 bg-brand-orange/10 rounded-full md:rounded-2xl flex items-center justify-center text-brand-orange md:mx-auto md:mb-8 group-hover:scale-110 group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
              <Info size={20} className="md:w-8 md:h-8" strokeWidth={2} />
            </div>
            <div className="text-left md:text-center">
              <h3 className="text-[13px] md:text-2xl font-display font-black text-brand-black uppercase italic mb-0.5 md:mb-4">Nuestra Visión</h3>
              <p className="text-brand-black/60 text-[11px] md:text-sm leading-relaxed font-medium">
                Ser la plataforma líder en Argentina por nuestra fiabilidad, innovación y servicio inigualable.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="bg-brand-black p-4 md:p-12 rounded-[1.2rem] md:rounded-[2.5rem] shadow-md md:shadow-[0_20px_50px_-12px_rgba(249,115,22,0.15)] group relative overflow-hidden transition-all duration-300 flex flex-row md:flex-col items-center md:text-center gap-3 md:gap-4 border border-brand-black"
          >
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-brand-orange/20 blur-2xl rounded-full pointer-events-none group-hover:bg-brand-orange/30 transition-colors" />
            
            <div className="relative z-10 w-10 h-10 md:w-16 md:h-16 flex-shrink-0 bg-white/10 rounded-full md:rounded-2xl flex items-center justify-center text-brand-orange md:mx-auto md:mb-8 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck size={20} className="md:w-8 md:h-8" strokeWidth={2} />
            </div>
            
            <div className="relative z-10 text-left md:text-center">
              <h3 className="text-[13px] md:text-2xl font-display font-black text-white uppercase italic mb-0.5 md:mb-4">Compra Segura</h3>
              <p className="text-white/60 text-[11px] md:text-sm leading-relaxed font-medium">
                Transacciones 100% protegidas y respaldadas. Tu inversión siempre segura con nosotros.
              </p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* --- PROPUESTA DE VALOR LIST --- */}
      <section className="container-max px-4 md:px-6 mt-16 md:mt-32">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-[10px] md:text-sm font-bold text-brand-orange uppercase tracking-[0.3em] mb-2 md:mb-4">Propuesta de Valor</h2>
          <h3 className="text-2xl md:text-5xl font-display font-black text-brand-black uppercase italic">¿Por qué elegirnos?</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <Star size={24}/>, title: "Trayectoria", desc: "Más de media década y miles de operaciones exitosas nos avalan." },
            { icon: <Truck size={24}/>, title: "Logística Nacional", desc: "Llegamos a cada provincia con envíos rápidos y embalajes seguros." },
            { icon: <Wrench size={24}/>, title: "Catálogo Versátil", desc: "Repuestos, herramientas, cuidado personal y Car Audio en un solo lugar." },
            { icon: <CheckCircle2 size={24}/>, title: "Expertos", desc: "Ofrecemos servicio técnico y asesoramiento personalizado por WhatsApp." }
          ].map((item, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 border border-brand-black/5 shadow-sm group hover:border-brand-orange/30 hover:shadow-lg transition-all flex flex-row md:flex-col items-center md:text-center gap-4 md:gap-0"
             >
               <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 mx-0 md:mx-auto bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange md:mb-6 group-hover:scale-110 transition-transform">
                 {React.cloneElement(item.icon as React.ReactElement, { className: "w-5 h-5 md:w-6 md:h-6" })}
               </div>
               <div className="text-left md:text-center">
                 <h4 className="font-display font-black uppercase italic text-sm md:text-lg text-brand-black mb-1 md:mb-3">{item.title}</h4>
                 <p className="text-brand-black/60 text-xs md:text-sm font-light leading-relaxed">{item.desc}</p>
               </div>
             </motion.div>
          ))}
        </div>
      </section>

      {/* --- CONTACT INFO --- */}
      <section className="container-max px-4 md:px-6 mt-16 md:mt-32">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-brand-black rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-20 relative overflow-hidden shadow-2xl border border-white/5"
        >
          <div className="absolute top-0 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-brand-orange/10 blur-[60px] md:blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-white/5 blur-[50px] md:blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <div className="text-center mb-8 md:mb-16 space-y-2 md:space-y-4">
              <h2 className="text-2xl md:text-6xl font-display font-black text-white uppercase italic tracking-tight">
                Conectá con <span className="text-brand-orange">Nosotros</span>
              </h2>
              <p className="text-white/40 font-light text-xs md:text-lg">Atención Online 24/7. Retiros presenciales exclusivos con cita previa.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
              
              <div className="flex flex-row md:flex-col items-center md:text-center text-left gap-4 md:gap-4 pt-6 md:pt-0 group">
                <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 bg-white/5 rounded-full flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                  <MapPin size={24} className="md:w-[28px] md:h-[28px]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-white font-black uppercase tracking-[0.2em] text-[10px] md:text-xs mb-1 md:mb-2">Punto de Retiro</p>
                  <p className="text-white/50 text-xs md:text-sm font-light mb-0.5 md:mb-1">Manuel Estrada 2177, CP 4000</p>
                  <p className="text-brand-orange/80 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">San Miguel de Tucumán</p>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:text-center text-left gap-4 md:gap-4 pt-6 md:pt-0 group">
                <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 bg-white/5 rounded-full flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                  <Mail size={24} className="md:w-[28px] md:h-[28px]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-white font-black uppercase tracking-[0.2em] text-[10px] md:text-xs mb-1 md:mb-2">Correo Oficial</p>
                  <a href="mailto:francoalexislazarte@gmail.com" className="text-white/50 text-xs md:text-sm font-light hover:text-brand-orange transition-colors">
                    francoalexislazarte@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:text-center text-left gap-4 md:gap-4 pt-6 md:pt-0 group">
                <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 bg-white/5 rounded-full flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-all duration-300">
                  <MessageCircle size={24} className="md:w-[28px] md:h-[28px]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-white font-black uppercase tracking-[0.2em] text-[10px] md:text-xs mb-1 md:mb-2">WhatsApp / Catálogo</p>
                  <a href="https://wa.me/c/5493813336575" target="_blank" rel="noopener noreferrer" className="text-white/50 text-xs md:text-sm font-light hover:text-[#25D366] transition-colors block mb-0.5 md:mb-1">
                    +54 9 381 333-6575
                  </a>
                  <p className="text-white/30 text-[9px] md:text-[10px] uppercase tracking-widest">Ventas Online 24/7</p>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default QuienesSomos;