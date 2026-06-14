import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { Config } from '../../types';
import { Save, Image, Smartphone, CreditCard, Layout, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AdminConfiguracion = () => {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => { fetchConfig(); }, []);

  const fetchConfig = async () => {
    try { setConfig(await api.getConfig()); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!config) return;
    setSaving(true);
    try { await api.updateConfig(config); showToast('Configuración guardada'); }
    catch { alert('Error al guardar'); }
    finally { setSaving(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!config) return;
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-10 h-10 border-2 border-brand-orange/20 border-t-brand-orange rounded-full animate-spin" />
    </div>
  );

  const inputCls = "w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-bold placeholder:text-white/20 outline-none focus:border-brand-orange/50 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)] transition-all";
  const labelCls = "text-[10px] font-bold uppercase tracking-[0.2em] text-white/30";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-orange">
            <Zap size={13} fill="currentColor" />
            <span className="font-bold text-[10px] uppercase tracking-[0.3em]">Sistema</span>
          </div>
          <h2 className="text-3xl font-display font-black text-white uppercase italic">Configuración</h2>
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Identidad y datos de la tienda</p>
        </div>
        <button onClick={() => handleSave()} disabled={saving}
          className="bg-brand-orange text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 font-display font-black uppercase text-xs tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 w-full md:w-auto">
          <Save size={14} /> {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-emerald-500/10 text-emerald-400 p-3 rounded-xl border border-emerald-500/20 text-xs font-bold uppercase tracking-widest">
            ✓ {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Identidad */}
        <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-6 space-y-5">
          <h3 className="text-sm font-display font-black text-white uppercase italic flex items-center gap-2">
            <Layout size={15} className="text-brand-orange" /> Identidad Visual
          </h3>
          <div className="space-y-1.5">
            <label className={labelCls}>Nombre de la Tienda</label>
            <input name="nombreTienda" value={config?.nombreTienda || ''} onChange={handleChange} className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Texto Bienvenida (Hero)</label>
            <textarea name="textoBienvenida" value={config?.textoBienvenida || ''} onChange={handleChange} rows={3}
              className={inputCls + " resize-none leading-relaxed"} />
          </div>
        </div>

        {/* Pagos */}
        <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-6 space-y-5">
          <h3 className="text-sm font-display font-black text-white uppercase italic flex items-center gap-2">
            <CreditCard size={15} className="text-brand-orange" /> Datos de Pago
          </h3>
          <div className="space-y-1.5">
            <label className={labelCls}>CBU / CVU</label>
            <input name="cbu" value={config?.cbu || ''} onChange={handleChange} placeholder="0000003100..." className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Alias CBU</label>
            <input name="aliasCBU" value={config?.aliasCBU || ''} onChange={handleChange} placeholder="TIENDA.ALIAS.MP" className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>URL Imagen QR</label>
            <div className="flex gap-3">
              <input name="qrImagenUrl" value={config?.qrImagenUrl || ''} onChange={handleChange}
                placeholder="https://..." className={inputCls + " flex-1 text-xs"} />
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                {config?.qrImagenUrl ? (
                  <img src={config.qrImagenUrl} alt="QR" className="w-full h-full object-contain p-1"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : <Image size={18} className="text-white/15" />}
              </div>
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-6 space-y-5 lg:col-span-2">
          <h3 className="text-sm font-display font-black text-white uppercase italic flex items-center gap-2">
            <Smartphone size={15} className="text-brand-orange" /> Contacto y Soporte
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className={labelCls}>WhatsApp de Atención</label>
              <input name="whatsappContacto" value={config?.whatsappContacto || ''} onChange={handleChange}
                placeholder="549381..." className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Texto Quiénes Somos</label>
              <textarea name="textoQuienesSomos" value={config?.textoQuienesSomos || ''} onChange={handleChange} rows={4}
                className={inputCls + " resize-none leading-relaxed"} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminConfiguracion;
