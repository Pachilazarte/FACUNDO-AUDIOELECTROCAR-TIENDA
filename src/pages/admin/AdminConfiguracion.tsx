import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { Config } from '../../types';
import { Save, Image, Smartphone, CreditCard, Layout } from 'lucide-react';

const AdminConfiguracion = () => {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const data = await api.getConfig();
      setConfig(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    setSaving(true);
    try {
      await api.updateConfig(config);
      alert("Configuración actualizada correctamente");
    } catch (err) {
      alert("Error al guardar configuración");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!config) return;
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-20 text-center animate-pulse">Cargando configuración...</div>;

  return (
    <div className="space-y-8 text-brand-black">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-display font-black text-brand-navy uppercase italic">Configuración</h2>
          <p className="text-xs text-brand-black/40 font-bold uppercase tracking-widest mt-1">Identidad y Pagos de la Tienda</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-brand-orange text-white px-8 py-4 flex items-center gap-2 font-display font-black uppercase text-xs tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* General Identity */}
        <section className="bg-white p-8 border border-brand-gray-mid shadow-sm space-y-6">
          <h3 className="text-xl font-display font-black text-brand-navy uppercase italic flex items-center gap-2">
            <Layout size={20} className="text-brand-orange" />
            Identidad Visual
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/50">Nombre de la Tienda</label>
              <input 
                name="nombreTienda" value={config?.nombreTienda || ''} onChange={handleChange}
                className="w-full p-3 bg-brand-gray-light border-2 border-transparent focus:border-brand-orange text-sm font-bold uppercase outline-none" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/50">Texto Bienvenida (Hero)</label>
              <textarea 
                name="textoBienvenida" value={config?.textoBienvenida || ''} onChange={handleChange} rows={3}
                className="w-full p-3 bg-brand-gray-light border-2 border-transparent focus:border-brand-orange text-sm font-bold uppercase outline-none" 
              />
            </div>
          </div>
        </section>

        {/* Payments & Contact */}
        <section className="bg-white p-8 border border-brand-gray-mid shadow-sm space-y-6">
          <h3 className="text-xl font-display font-black text-brand-navy uppercase italic flex items-center gap-2">
            <CreditCard size={20} className="text-brand-orange" />
            Datos de Pago
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/50">CBU / CVU</label>
              <input 
                name="cbu" value={config?.cbu || ''} onChange={handleChange}
                className="w-full p-3 bg-brand-gray-light border-2 border-transparent focus:border-brand-orange text-sm font-mono font-bold outline-none" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/50">Alias CBU</label>
              <input 
                name="aliasCBU" value={config?.aliasCBU || ''} onChange={handleChange}
                className="w-full p-3 bg-brand-gray-light border-2 border-transparent focus:border-brand-orange text-sm font-bold uppercase outline-none" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/50">Imagen QR (URL)</label>
              <div className="flex gap-2">
                <input 
                  name="qrImagenUrl" value={config?.qrImagenUrl || ''} onChange={handleChange}
                  className="flex-1 p-3 bg-brand-gray-light border-2 border-transparent focus:border-brand-orange text-xs outline-none" 
                />
                <div className="w-12 h-12 bg-white border border-brand-gray-mid flex items-center justify-center">
                  <Image size={24} className="text-brand-black/20" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support */}
        <section className="bg-white p-8 border border-brand-gray-mid shadow-sm space-y-6 lg:col-span-2">
          <h3 className="text-xl font-display font-black text-brand-navy uppercase italic flex items-center gap-2">
            <Smartphone size={20} className="text-brand-orange" />
            Contacto y Soporte
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/50">WhatsApp de Atención</label>
              <input 
                name="whatsappContacto" value={config?.whatsappContacto || ''} onChange={handleChange}
                className="w-full p-3 bg-brand-gray-light border-2 border-transparent focus:border-brand-orange text-sm font-bold outline-none" 
                placeholder="549381..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/50">Texto Quiénes Somos</label>
              <textarea 
                name="textoQuienesSomos" value={config?.textoQuienesSomos || ''} onChange={handleChange} rows={4}
                className="w-full p-3 bg-brand-gray-light border-2 border-transparent focus:border-brand-orange text-sm leading-relaxed outline-none" 
              />
            </div>
          </div>
        </section>
      </form>
    </div>
  );
};

export default AdminConfiguracion;
