/**
 * Google Sheets puede devolver precios con espacios ("39 990"), comas ("39,990")
 * o como strings. Esta función los convierte siempre a number válido.
 */
export function parsePrice(val: any): number {
  if (val === null || val === undefined || val === '') return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  // Remover cualquier caracter que no sea dígito, punto, coma o signo menos
  const cleaned = String(val)
    .replace(/[^\d.,-]/g, '') // Quitar letras, símbolos, espacios raros
    .replace(/\./g, '')       // Quitar puntos de miles: "39.990" → "39990"
    .replace(',', '.');       // Coma decimal: "39,99" → "39.99"
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

export function formatPrice(val: any): string {
  return parsePrice(val).toLocaleString('es-AR');
}

/**
 * Convierte enlaces de Google Drive (compartidos, editables, etc.) a URLs de miniaturas
 * directas para que se puedan embeber sin problemas de cookies o CORS en la web.
 */
export function getCleanImageUrl(url: string): string {
  if (!url) return '';
  
  // Si ya es un enlace lh3.googleusercontent.com directo, lo devolvemos tal cual.
  // IMPORTANTE: Requiere <meta name="referrer" content="no-referrer" /> en index.html
  if (url.includes('lh3.googleusercontent.com')) {
    return url;
  }
  
  // Si no es un enlace de Google Drive, retornar tal cual
  if (!url.includes('drive.google.com') && !url.includes('googleusercontent.com')) {
    return url;
  }
  
  let fileId = '';
  
  // Caso 1: https://drive.google.com/file/d/FILE_ID/...
  if (url.includes('/file/d/')) {
    const parts = url.split('/file/d/');
    if (parts.length > 1) fileId = parts[1].split('/')[0].split('?')[0];
  }
  // Caso 2: ...?id=FILE_ID o ...&id=FILE_ID
  else if (url.includes('id=')) {
    const match = url.match(/[?&]id=([^&]+)/);
    if (match) fileId = match[1];
  }
  
  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  }
  
  return url;
}

