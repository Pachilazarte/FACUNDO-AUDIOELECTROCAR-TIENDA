import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { Product } from '../../types';
import { AlertTriangle, ArrowUpCircle, ArrowDownCircle, RefreshCw } from 'lucide-react';

const AdminStock = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProductos();
      setProducts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const umbralAlerta = 5;

  return (
    <div className="space-y-8 text-brand-black">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-display font-black text-brand-navy uppercase italic">Control de Stock</h2>
          <p className="text-xs text-brand-black/40 font-bold uppercase tracking-widest mt-1">Inventario y Alertas</p>
        </div>
        <button 
          onClick={fetchProducts}
          className="p-3 text-brand-navy hover:text-brand-orange transition-all"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 border border-brand-gray-mid shadow-sm">
          <p className="text-[10px] font-bold uppercase text-brand-black/40 mb-1">Total Unidades</p>
          <p className="text-2xl font-display font-black text-brand-navy italic">
            {products.reduce((acc, p) => acc + (p.stock || 0), 0)}
          </p>
        </div>
        <div className="bg-red-50 p-6 border border-red-200 shadow-sm">
          <p className="text-[10px] font-bold uppercase text-red-400 mb-1">Stock Crítico</p>
          <p className="text-2xl font-display font-black text-red-600 italic">
            {products.filter(p => (p.stock || 0) <= umbralAlerta).length}
          </p>
        </div>
      </div>

      <div className="bg-white border border-brand-gray-mid shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-brand-navy text-white font-display text-[10px] uppercase tracking-[0.2em]">
            <tr>
              <th className="px-6 py-4">Producto</th>
              <th className="px-6 py-4">Cantidad</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Ajuste Manual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-gray-mid">
            {products.map((product) => {
              const lowStock = (product.stock || 0) <= umbralAlerta;
              return (
                <tr key={product.id} className="hover:bg-brand-gray-light/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-brand-navy uppercase">{product.nombre}</p>
                    <p className="text-[10px] text-brand-black/40 uppercase font-medium">ID: {product.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-mono text-sm font-bold ${lowStock ? 'text-red-600' : 'text-brand-navy'}`}>
                      {product.stock || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {lowStock && (
                      <span className="flex items-center gap-1 text-red-600 text-[8px] font-black uppercase tracking-widest bg-red-50 px-2 py-1 rounded-full border border-red-100 w-fit">
                        <AlertTriangle size={10} /> Stock Bajo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-emerald-500 hover:bg-emerald-50 transition-all rounded">
                        <ArrowUpCircle size={20} />
                      </button>
                      <button className="p-2 text-red-400 hover:bg-red-50 transition-all rounded">
                        <ArrowDownCircle size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStock;
