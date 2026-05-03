/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: 'audio' | 'accesorios-auto' | 'electrodomesticos';
  precio: number;
  imagenUrl: string;
  destacado: boolean;
  masVendido: boolean;
  novedad: boolean;
  activo: boolean;
  stock?: number;
}

export interface User {
  id: string;
  usuario: string;
  rol: 'ADMIN' | 'USER';
  email: string;
  activo: boolean;
}

export interface Pedido {
  pedidoId: string;
  fecha: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono: string;
  productos: {
    id: string;
    nombre: string;
    cantidad: number;
    precio: number;
  }[];
  total: number;
  estado: 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO';
  metodoPago: string;
  comprobante?: string;
}

export interface Config {
  nombreTienda: string;
  qrImagenUrl: string;
  cbu: string;
  aliasCBU: string;
  whatsappContacto: string;
  textoBienvenida: string;
  textoQuienesSomos: string;
}
