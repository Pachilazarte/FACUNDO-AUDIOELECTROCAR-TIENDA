import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { Download, Calendar, TrendingUp, Filter } from 'lucide-react';
import { motion } from 'motion/react';

const AdminVentas = () => {
  const [ventas, setVentas] = useState<any[]>([]); // To be defined
  const [loading, setLoading] = useState(true);

  return (
    <div className="space-y-8 text-brand-black">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-display font-black text-brand-navy uppercase italic">Ventas</h2>
          <p className="text-xs text-brand-black/40 font-bold uppercase tracking-widest mt-1">Reporte de Facturación</p>
        </div>
        <button className="bg-brand-navy text-white px-6 py-3 flex items-center gap-2 font-display font-bold uppercase text-[10px] tracking-widest hover:bg-brand-navy/90 active:scale-95 transition-all shadow-lg">
          <Download size={14} />
          Exportar Excel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-brand-black p-8 text-white relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={64} />
          </div>
          <p className="text-[10px] font-bold uppercase text-brand-orange tracking-widest mb-1">Total Histórico</p>
          <p className="text-4xl font-display font-black italic">$0,00</p>
        </div>
        <div className="bg-white p-8 border border-brand-gray-mid">
          <p className="text-[10px] font-bold uppercase text-brand-black/40 tracking-widest mb-1">Últimos 30 Días</p>
          <p className="text-4xl font-display font-black text-brand-navy italic">$0,00</p>
        </div>
        <div className="bg-white p-8 border border-brand-gray-mid">
          <p className="text-[10px] font-bold uppercase text-brand-black/40 tracking-widest mb-1">Ticket Promedio</p>
          <p className="text-4xl font-display font-black text-brand-navy italic">$0,00</p>
        </div>
      </div>

      <div className="bg-white border border-brand-gray-mid shadow-sm overflow-hidden">
        <div className="p-6 border-b border-brand-gray-mid flex justify-between items-center bg-brand-gray-light/30">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-brand-orange" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Filtrar por Período</span>
          </div>
          <button className="p-2 text-brand-black/40 hover:text-brand-orange transition-colors">
            <Filter size={18} />
          </button>
        </div>
        <div className="p-20 text-center space-y-4">
          <div className="w-16 h-16 bg-brand-gray-light rounded-full border border-brand-gray-mid flex items-center justify-center mx-auto text-brand-black/20">
            <TrendingUp size={32} />
          </div>
          <p className="text-brand-black/30 font-display italic text-lg uppercase tracking-widest">No hay registros de ventas confirmadas todavía</p>
        </div>
      </div>
    </div>
  );
};

export default AdminVentas;
