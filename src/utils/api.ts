import { Product, Pedido, User, Config } from '../types';

const API_URL = import.meta.env.VITE_GAS_API_URL;

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'PROD-001',
    nombre: 'Subwoofer Premium Pro-X',
    descripcion: 'Bajos profundos y controlados con diafragma de fibra de carbono. Ideal para sistemas de alta fidelidad.',
    categoria: 'audio',
    precio: 145000,
    imagenUrl: 'https://images.unsplash.com/photo-1545453343-ae6a3a99252c?auto=format&fit=crop&q=80&w=800',
    destacado: true,
    masVendido: true,
    novedad: true,
    activo: true
  },
  {
    id: 'PROD-002',
    nombre: 'Receptor Digital SmartDrive',
    descripcion: 'Pantalla táctil de 9 pulgadas con Android Auto y Apple CarPlay inalámbrico.',
    categoria: 'electrodomesticos',
    precio: 210900,
    imagenUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800',
    destacado: true,
    masVendido: false,
    novedad: true,
    activo: true
  },
  {
    id: 'PROD-003',
    nombre: 'Amplificador Titan 800W',
    descripcion: 'Potencia pura de 4 canales clase D con disipador térmico de aluminio cepillado.',
    categoria: 'audio',
    precio: 189500,
    imagenUrl: 'https://images.unsplash.com/photo-1616428236113-56903328e37b?auto=format&fit=crop&q=80&w=800',
    destacado: false,
    masVendido: true,
    novedad: false,
    activo: true
  }
];

const MOCK_CONFIG: Config = {
  nombreTienda: "AutoSound Store",
  qrImagenUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://www.mercadopago.com.ar",
  cbu: "0000003100094857362514",
  aliasCBU: "AUTOSOUND.STORE.MP",
  whatsappContacto: "5493812345678",
  textoBienvenida: "Sonó bien. Se ve mejor.",
  textoQuienesSomos: "En AutoSound Store, no solo vendemos audio; calibramos experiencias sensoriales para audiófilos exigentes."
};

/**
 * Todos los requests van como GET con parámetros en la URL.
 * Esto evita el problema de CORS preflight que bloquea los POST
 * en Google Apps Script Web Apps.
 */
async function fetchGAS<T>(params: Record<string, string>): Promise<T> {
  if (!API_URL) {
    console.warn('VITE_GAS_API_URL no está definida. Usando datos mock.');
    const action = params.action;
    if (action === 'getProductos') return MOCK_PRODUCTS as unknown as T;
    if (action === 'getConfiguracion') return MOCK_CONFIG as unknown as T;
    if (action === 'loginAdmin') return { success: true, user: { usuario: 'Admin Mock', id: '1', rol: 'ADMIN' } } as unknown as T;
    return [] as unknown as T;
  }

  const url = new URL(API_URL);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString(), {
    method: 'GET',
    redirect: 'follow', // Necesario para GAS Web Apps (redirige a googleapis.com)
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // --- Públicas ---
  getProductos: () =>
    fetchGAS<Product[]>({ action: 'getProductos' }),

  getConfig: () =>
    fetchGAS<Config>({ action: 'getConfiguracion' }),

  crearPedido: (pedido: Partial<Pedido>) =>
    fetchGAS<{ success: boolean }>({
      action: 'crearPedido',
      ...flattenObject(pedido),
    }),

  // --- Admin ---
  login: (credentials: { usuario: string; password: string }) =>
    fetchGAS<{ success: boolean; user?: User }>({
      action: 'loginAdmin',
      usuario: credentials.usuario,
      password: credentials.password,
    }),

  getAllPedidos: () =>
    fetchGAS<Pedido[]>({ action: 'getPedidos' }),

  updatePedidoStatus: (pedidoId: string, estado: string) =>
    fetchGAS<{ success: boolean }>({
      action: 'updatePedido',
      pedidoId,
      estado,
    }),

  saveProduct: (product: Partial<Product>) =>
    fetchGAS<{ success: boolean }>({
      action: product.id ? 'editarProducto' : 'crearProducto',
      ...flattenObject(product),
    }),

  updateStock: (productoId: string, cantidad: number) =>
    fetchGAS<{ success: boolean }>({
      action: 'updateStock',
      productoId,
      cantidad: String(cantidad),
    }),

  updateConfig: (config: Partial<Config>) =>
    fetchGAS<{ success: boolean }>({
      action: 'setConfiguracion',
      ...flattenObject(config),
    }),
};

/** Aplana un objeto para pasarlo como query params (serializa objetos anidados a JSON) */
function flattenObject(obj: Record<string, any>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;
    result[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
  }
  return result;
}