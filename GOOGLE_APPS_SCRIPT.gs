// ══════════════════════════════════════════════════════════
// CONFIGURACIÓN CENTRALIZADA (COMPLETAR MANUALMENTE SI DESEAS)
// ══════════════════════════════════════════════════════════
// ID de tu carpeta de Google Drive. Si se deja vacío ("") o no es accesible,
// el script buscará o creará automáticamente una carpeta llamada "AutoSound Store" en tu Drive.
var folderId = "1n-MpsN9KKmx9xvU1tTGPqzHqMqNPNBrA"; 

// ID de tu Google Sheet. Si dejas esto vacío (""), el script asumirá 
// que está vinculado a la hoja de cálculo donde se abrió la consola (Script Contenedor).
var spreadsheetId = ""; 

// 1. PETICIÓN GET (Lectura de Datos y Acciones Rápidas)
function doGet(e) {
  var params = (e && e.parameter) ? e.parameter : {};
  return routeRequest(params);
}

// 2. PETICIÓN POST (Creación, Edición y Carga de Archivos Base64)
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000); // Bloqueo para evitar colisiones de escritura concurrente
  try {
    var raw = e.postData ? e.postData.contents : '{}';
    var params = JSON.parse(raw);
    return routeRequest(params);
  } catch(err) {
    return respond({ success: false, error: 'Error en petición POST: ' + err.toString() });
  } finally {
    lock.releaseLock();
  }
}

// 3. ENRUTADOR PRINCIPAL
function routeRequest(params) {
  var action = params.action;
  
  // Obtener referencia al libro de cálculo (por ID si está configurado, o activo por defecto)
  var ss;
  try {
    if (typeof spreadsheetId !== 'undefined' && spreadsheetId !== "") {
      ss = SpreadsheetApp.openById(spreadsheetId);
    } else {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    }
  } catch (errSS) {
    return respond({ success: false, error: 'No se pudo abrir la hoja de cálculo. Asegúrate de configurar SpreadsheetId o vincular el script: ' + errSS.toString() });
  }

  if (!ss) {
    return respond({ success: false, error: 'No hay ninguna hoja de cálculo activa disponible.' });
  }

  try {
    // --- 3.1 OBTENER PRODUCTOS ---
    if (action === 'getProductos') {
      var prodSheet = getSheetCaseInsensitive(ss, 'Productos');
      
      // Auto-creación de la hoja de productos si no existe
      if (!prodSheet) {
        prodSheet = ss.insertSheet('Productos');
        prodSheet.appendRow(['id', 'nombre', 'descripcion', 'categoria', 'precio', 'imagenUrl', 'destacado', 'masVendido', 'novedad', 'activo', 'stock']);
        
        // Agregar algunos productos iniciales/ejemplo para que no empiece vacío
        prodSheet.appendRow(['PROD-1001', 'Subwoofer Premium Pro-X', 'Bajos profundos y controlados con diafragma de fibra de carbono. Ideal para sistemas de alta fidelidad.', 'audio', 145000, 'https://images.unsplash.com/photo-1545453343-ae6a3a99252c?auto=format&fit=crop&q=80&w=800', 'true', 'true', 'true', 'true', 15]);
        prodSheet.appendRow(['PROD-1002', 'Receptor Digital SmartDrive', 'Pantalla táctil de 9 pulgadas con Android Auto y Apple CarPlay inalámbrico.', 'electrodomesticos', 210900, 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800', 'true', 'false', 'true', 'true', 8]);
        prodSheet.appendRow(['PROD-1003', 'Amplificador Titan 800W', 'Potencia pura de 4 canales clase D con disipador térmico de aluminio cepillado.', 'audio', 189500, 'https://images.unsplash.com/photo-1616428236113-56903328e37b?auto=format&fit=crop&q=80&w=800', 'false', 'true', 'false', 'true', 12]);
      }

      var prodsData = readSheetAsJSON(prodSheet);
      return respond(prodsData);
    }

    // --- 3.1.5 OBTENER HISTORIAL STOCK ---
    if (action === 'getHistorialStock') {
      var histSheet = getSheetCaseInsensitive(ss, 'Historial_Stock');
      if (!histSheet) {
        return respond([]);
      }
      var histData = readSheetAsJSON(histSheet);
      // Sort by date descending (newest first)
      histData.sort(function(a, b) { return new Date(b.fecha) - new Date(a.fecha); });
      return respond(histData);
    }

    // --- 3.2 OBTENER CONFIGURACIÓN ---
    if (action === 'getConfiguracion') {
      var configSheet = getSheetCaseInsensitive(ss, 'Configuracion') || getSheetCaseInsensitive(ss, 'Configuración');
      
      // Auto-creación de la hoja de configuración con los campos reales que usa React
      if (!configSheet) {
        configSheet = ss.insertSheet('Configuracion');
        configSheet.appendRow(['nombreTienda', 'qrImagenUrl', 'cbu', 'aliasCBU', 'whatsappContacto', 'textoBienvenida', 'textoQuienesSomos']);
        configSheet.appendRow([
          'AutoSound Store', 
          'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://www.mercadopago.com.ar', 
          '0000003100094857362514', 
          'AUTOSOUND.STORE.MP', 
          '5493813336575', 
          'Sonó bien. Se ve mejor.', 
          'En AutoSound Store, no solo vendemos audio; calibramos experiencias sensoriales para audiófilos exigentes.'
        ]);
      }
      var configData = readSheetAsJSON(configSheet);
      return respond(configData[0] || {});
    }

    // --- 3.3 GUARDAR CONFIGURACIÓN ---
    if (action === 'setConfiguracion') {
      var configSheet = getSheetCaseInsensitive(ss, 'Configuracion') || getSheetCaseInsensitive(ss, 'Configuración');
      if (!configSheet) return respond({ success: false, error: 'Hoja Configuracion/Configuración no encontrada' });
      
      var headers = configSheet.getDataRange().getValues()[0].map(String);
      var values = [];
      headers.forEach(function(h) {
        values.push(params[h] !== undefined ? String(params[h]) : '');
      });

      if (configSheet.getLastRow() < 2) {
        configSheet.appendRow(values);
      } else {
        configSheet.getRange(2, 1, 1, values.length).setValues([values]);
      }
      return respond({ success: true });
    }

    // --- 3.4 CREAR PEDIDO (Se guarda en la hoja 'stock' o 'Pedidos') ---
    if (action === 'crearPedido') {
      // Intentamos buscar 'Pedidos' o 'stock'
      var orderSheet = getSheetCaseInsensitive(ss, 'stock') || getSheetCaseInsensitive(ss, 'Pedidos');
      if (!orderSheet) {
        orderSheet = ss.insertSheet('stock');
        orderSheet.appendRow(['orderId', 'fecha', 'productosIds', 'clienteNombre', 'clienteEmail', 'clienteTelefono', 'productosDetalle', 'cantidadTotal', 'total', 'estado', 'metodoPago']);
      }

      // Leemos los encabezados para guardar los datos en el orden exacto de las columnas de la hoja
      var headers = orderSheet.getDataRange().getValues()[0].map(function(h) { 
        return String(h).trim(); 
      });

      var rowValues = [];
      headers.forEach(function(h) {
        if (h === 'orderId') rowValues.push(params.orderId || '');
        else if (h === 'fecha') rowValues.push(new Date());
        else if (h === 'clienteNombre') rowValues.push(params.clienteNombre || '');
        else if (h === 'clienteEmail') rowValues.push(params.clienteEmail || '');
        else if (h === 'clienteTelefono') rowValues.push(params.clienteTelefono || '');
        else if (h === 'productosDetalle') rowValues.push(params.productosDetalle || '');
        else if (h === 'productosIds') rowValues.push(params.productosIds || '');
        else if (h === 'cantidadTotal') rowValues.push(Number(params.cantidadTotal || 0));
        else if (h === 'total') rowValues.push(Number(params.total || 0));
        else if (h === 'estado') rowValues.push(params.estado || 'PENDIENTE');
        else if (h === 'metodoPago') rowValues.push(params.metodoPago || '');
        else rowValues.push('');
      });

      orderSheet.appendRow(rowValues);

      // --- DESCUENTO DE STOCK AUTOMÁTICO EN LA HOJA DE PRODUCTOS ---
      if (params.productosIds) {
        try {
          var prodSheet = getSheetCaseInsensitive(ss, 'Productos');
          if (prodSheet) {
            var items = String(params.productosIds).split('|');
            items.forEach(function(item) {
              var parts = item.split(':');
              if (parts.length === 2) {
                var pId = parts[0].trim();
                var cantADescontar = Number(parts[1]);
                descontarStock(ss, prodSheet, pId, cantADescontar, params.orderId);
              }
            });
          }
        } catch(errStock) {
          console.error('Error al descontar stock: ' + errStock.toString());
        }
      }

      return respond({ success: true });
    }

    // --- 3.5 OBTENER PEDIDOS (De la hoja 'stock' o 'Pedidos') ---
    if (action === 'getPedidos') {
      var orderSheet = getSheetCaseInsensitive(ss, 'stock') || getSheetCaseInsensitive(ss, 'Pedidos');
      if (!orderSheet) return respond([]);
      var orders = readSheetAsJSON(orderSheet);
      return respond(orders);
    }

    // --- 3.6 ACTUALIZAR PEDIDO (CAMBIO DE ESTADO) ---
    if (action === 'updatePedido') {
      var orderSheet = getSheetCaseInsensitive(ss, 'stock') || getSheetCaseInsensitive(ss, 'Pedidos');
      if (!orderSheet) return respond({ success: false, error: 'Hoja de pedidos no encontrada' });
      var success = updateRowById(orderSheet, 'orderId', params.pedidoId, { estado: params.estado });
      return respond({ success: success });
    }

    // --- 3.7 INGRESO ADMINISTRADOR (LOGIN) ---
    if (action === 'loginAdmin') {
      var auth = false;
      var userSheet = getSheetCaseInsensitive(ss, 'Usuarios');
      if (userSheet) {
        var users = readSheetAsJSON(userSheet);
        for (var i = 0; i < users.length; i++) {
          var u = users[i];
          if (String(u.usuario).trim().toUpperCase() === String(params.usuario).trim().toUpperCase() && 
              String(u.password).trim().toUpperCase() === String(params.password).trim().toUpperCase()) {
            auth = true;
            break;
          }
        }
      } else {
        // Fallback si no existe la hoja Usuarios
        auth = (String(params.usuario).trim().toUpperCase() === 'ADMIN' && String(params.password).trim().toUpperCase() === 'ADMIN');
      }

      if (auth) {
        return respond({ success: true, user: { usuario: params.usuario.toUpperCase(), rol: 'ADMIN', id: 'admin-1', email: 'admin@autosound.com', activo: true } });
      }
      return respond({ success: false, error: 'Credenciales incorrectas' });
    }

    // --- 3.8 CREAR O EDITAR PRODUCTO (Subida de Imagen Directa a Google Drive) ---
    if (action === 'crearProducto' || action === 'editarProducto') {
      var isEdit = (action === 'editarProducto');
      var prodSheet = getSheetCaseInsensitive(ss, 'Productos');

      if (!prodSheet) return respond({ success: false, error: 'Hoja Productos no encontrada' });

      // Generar ID correlativo secuencial si es nuevo
      var prodId = isEdit ? String(params.id) : ('PROD-' + (1000 + prodSheet.getLastRow()));

      // --- PROCESAR CARGA DE IMAGEN DIRECTA A GOOGLE DRIVE ---
      var urlImagen = params.imagenUrl || '';
      if (params.archivo) {
        try {
          var b64Data = params.archivo.split(",")[1];
          var blob = Utilities.newBlob(Utilities.base64Decode(b64Data), params.tipo || 'image/png', params.nombreArchivo || (prodId + '.png'));
          
          var folder;
          if (folderId && folderId !== "") {
            try {
              folder = DriveApp.getFolderById(folderId);
            } catch(e) {
              folder = getOrCreateFolder("AutoSound Store");
            }
          } else {
            folder = getOrCreateFolder("AutoSound Store");
          }
          
          var archivo = folder.createFile(blob);
          archivo.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          urlImagen = "https://lh3.googleusercontent.com/d/" + archivo.getId();
        } catch(errImg) {
          console.error("Error cargando imagen a Drive: " + errImg.toString());
        }
      }

      var stockNumber = Number(params.stock !== undefined ? params.stock : 10);
      var productValues = {
        id: prodId,
        nombre: params.nombre || '',
        category: String(params.categoria || params.category || 'audio').trim().toLowerCase(),
        descripcion: params.descripcion || '',
        precio: Number(params.precio || 0),
        imagenUrl: urlImagen,
        destacado: params.destacado === 'true' || params.destacado === true,
        masVendido: params.masVendido === 'true' || params.masVendido === true,
        novedad: params.novedad === 'true' || params.novedad === true,
        activo: params.activo !== 'false' && params.activo !== false,
        stock: stockNumber
      };

      if (isEdit) {
        var oldStock = 0;
        var data = prodSheet.getDataRange().getValues();
        var headers = data[0].map(String);
        var idIdx = headers.indexOf('id');
        var stockIdx = headers.indexOf('stock');
        if (idIdx !== -1 && stockIdx !== -1) {
          for (var i = 1; i < data.length; i++) {
            if (String(data[i][idIdx]) === prodId) {
              oldStock = Number(data[i][stockIdx]) || 0;
              break;
            }
          }
        }
        
        updateRowById(prodSheet, 'id', prodId, productValues);
        
        var stockDiff = stockNumber - oldStock;
        if (stockDiff !== 0) {
          registrarHistorialStock(ss, prodId, productValues.nombre, stockDiff > 0 ? 'INGRESO' : 'AJUSTE', Math.abs(stockDiff), stockNumber, "Edición Manual");
        }
      } else {
        appendRowFromObject(prodSheet, productValues);
        registrarHistorialStock(ss, prodId, productValues.nombre, 'INGRESO INICIAL', stockNumber, stockNumber, "Creación");
      }

      return respond({ success: true, id: prodId, imagenUrl: urlImagen });
    }

    // --- 3.9 ACTUALIZAR STOCK DE UN PRODUCTO ---
    if (action === 'updateStock') {
      var prodSheet = getSheetCaseInsensitive(ss, 'Productos');
      if (!prodSheet) return respond({ success: false, error: 'Hoja Productos no encontrada' });
      var newStock = Number(params.cantidad || 0);
      
      var oldStock = 0;
      var prodName = "Desconocido";
      var data = prodSheet.getDataRange().getValues();
      var headers = data[0].map(String);
      var idIdx = headers.indexOf('id');
      var nameIdx = headers.indexOf('nombre');
      var stockIdx = headers.indexOf('stock');
      if (idIdx !== -1 && stockIdx !== -1) {
        for (var i = 1; i < data.length; i++) {
          if (String(data[i][idIdx]) === String(params.productoId)) {
            oldStock = Number(data[i][stockIdx]) || 0;
            if (nameIdx !== -1) prodName = String(data[i][nameIdx]);
            break;
          }
        }
      }

      var success = updateRowById(prodSheet, 'id', params.productoId, {
        stock: newStock
      });
      
      var diff = newStock - oldStock;
      if (diff !== 0) {
        registrarHistorialStock(ss, params.productoId, prodName, diff > 0 ? 'INGRESO' : 'AJUSTE', Math.abs(diff), newStock, "Ajuste Rápido");
      }

      return respond({ success: success });
    }

    // --- 3.10 ACTUALIZAR ESTADO ACTIVO DEL PRODUCTO (Habilitar / Deshabilitar) ---
    if (action === 'updateStockStatus') {
      var prodSheet = getSheetCaseInsensitive(ss, 'Productos');
      if (!prodSheet) return respond({ success: false, error: 'Hoja Productos no encontrada' });
      
      var nextActive = (params.estado === 'habilitado');
      var success = updateRowById(prodSheet, 'id', params.productoId, {
        activo: nextActive
      });
      return respond({ success: success });
    }

    // --- 3.11 GUARDADO MASIVO DE PRODUCTOS (BATCH) ---
    if (action === 'batchSaveProducts') {
      var prodSheet = getSheetCaseInsensitive(ss, 'Productos');
      if (!prodSheet) {
        prodSheet = ss.insertSheet('Productos');
        prodSheet.appendRow(['id', 'nombre', 'descripcion', 'categoria', 'precio', 'imagenUrl', 'destacado', 'masVendido', 'novedad', 'activo', 'stock']);
      }

      var productsList = [];
      try {
        productsList = JSON.parse(params.productos);
      } catch(errJson) {
        return respond({ success: false, error: 'JSON malformado en parámetro productos: ' + errJson.toString() });
      }

      if (!Array.isArray(productsList)) {
        return respond({ success: false, error: 'El parámetro productos debe ser un arreglo JSON.' });
      }

      var data = prodSheet.getDataRange().getValues();
      var headers = data[0].map(function(h) { return String(h).trim(); });
      var idIdx = headers.indexOf('id');
      if (idIdx === -1) {
        return respond({ success: false, error: 'Columna id no encontrada en la hoja Productos.' });
      }

      // Mapear los IDs existentes a su fila
      var idRowMap = {};
      for (var i = 1; i < data.length; i++) {
        var existingId = String(data[i][idIdx]).trim();
        if (existingId !== "") {
          idRowMap[existingId] = i + 1;
        }
      }

      var nextRow = prodSheet.getLastRow() + 1;

      productsList.forEach(function(p) {
        var pId = p.id ? String(p.id).trim() : "";
        
        // Preparar valores del producto
        var productValues = {
          id: pId,
          nombre: p.nombre || '',
          categoria: String(p.categoria || p.category || 'audio').trim().toLowerCase(),
          category: String(p.categoria || p.category || 'audio').trim().toLowerCase(),
          descripcion: p.descripcion || '',
          precio: Number(p.precio || 0),
          imagenUrl: p.imagenUrl || '',
          destacado: String(p.destacado).toLowerCase() === 'true' || p.destacado === true,
          masVendido: String(p.masVendido).toLowerCase() === 'true' || p.masVendido === true,
          novedad: String(p.novedad).toLowerCase() === 'true' || p.novedad === true,
          activo: String(p.activo).toLowerCase() !== 'false' && p.activo !== false,
          stock: Number(p.stock !== undefined ? p.stock : 10)
        };

        var rowNum = idRowMap[pId];
        if (pId !== "" && rowNum) {
          // ACTUALIZAR PRODUCTO EXISTENTE
          headers.forEach(function(h, colIdx) {
            var val = productValues[h];
            if (val === undefined && h === 'category') val = productValues.categoria;
            if (val !== undefined) {
              prodSheet.getRange(rowNum, colIdx + 1).setValue(val);
            }
          });
        } else {
          // CREAR NUEVO PRODUCTO
          var generatedId = pId !== "" ? pId : ('PROD-' + (1000 + nextRow));
          productValues.id = generatedId;

          var newRow = headers.map(function(h) {
            var val = productValues[h];
            if (val === undefined && h === 'category') val = productValues.categoria;
            return val !== undefined ? val : '';
          });
          prodSheet.appendRow(newRow);
          nextRow++;
        }
      });

      return respond({ success: true, count: productsList.length });
    }

    return respond({ error: 'Acción no válida o no especificada: ' + action });

  } catch(e) {
    return respond({ error: 'Excepción interna en la ejecución: ' + e.toString() });
  }
}

// ─── FUNCIONES AUXILIARES ────────────────────────────────────────────────────

// Obtiene una carpeta de Drive por nombre o la crea si no existe
function getOrCreateFolder(name) {
  var folders = DriveApp.getFoldersByName(name);
  if (folders.hasNext()) {
    return folders.next();
  }
  var newFolder = DriveApp.createFolder(name);
  newFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return newFolder;
}

// Obtener hoja de forma tolerante a mayúsculas y minúsculas
function getSheetCaseInsensitive(ss, name) {
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().toLowerCase() === name.toLowerCase()) {
      return sheets[i];
    }
  }
  return null;
}

// Leer hoja de cálculo y transformarla a JSON con conversión de booleanos
function readSheetAsJSON(sheet) {
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  var headers = data[0].map(function(h) { return String(h).trim(); });
  var rows = data.slice(1);
  return rows.map(function(row) {
    var obj = {};
    headers.forEach(function(h, idx) {
      var val = row[idx];
      if (val instanceof Date) {
        obj[h] = Utilities.formatDate(val, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
      } else if (typeof val === 'string' && (val.trim().toLowerCase() === 'true' || val.trim().toLowerCase() === 'false')) {
        obj[h] = (val.trim().toLowerCase() === 'true');
      } else {
        obj[h] = (val !== undefined && val !== null) ? val : '';
      }
    });
    // Mapeo automático de 'category' a 'categoria' para que React no falle
    if (obj.category !== undefined) {
      obj.categoria = obj.category;
    }
    return obj;
  });
}

// Descontar unidades vendidas de la columna 'stock' en la hoja de 'Productos'
function descontarStock(ss, sheet, productoId, cant, orderId) {
  var data = sheet.getDataRange().getValues();
  var headers = data[0].map(String);
  var idIdx = headers.indexOf('id');
  var nameIdx = headers.indexOf('nombre');
  var stockIdx = headers.indexOf('stock');

  if (idIdx === -1 || stockIdx === -1) return;

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][idIdx]) === String(productoId)) {
      var currentStock = Number(data[i][stockIdx]) || 0;
      var prodName = (nameIdx !== -1) ? String(data[i][nameIdx]) : "Desconocido";
      var newStock = Math.max(0, currentStock - cant);
      sheet.getRange(i + 1, stockIdx + 1).setValue(newStock);
      
      registrarHistorialStock(ss, productoId, prodName, 'VENTA', cant, newStock, orderId);
      break;
    }
  }
}

// Registrar historial de movimientos de stock
function registrarHistorialStock(ss, productoId, nombre, operacion, cantidad, stockFinal, referencia) {
  try {
    var histSheet = getSheetCaseInsensitive(ss, 'Historial_Stock');
    if (!histSheet) {
      histSheet = ss.insertSheet('Historial_Stock');
      histSheet.appendRow(['fecha', 'productoId', 'nombre', 'operacion', 'cantidad', 'stockFinal', 'referencia']);
    }
    histSheet.appendRow([new Date(), productoId, nombre, operacion, cantidad, stockFinal, referencia || '']);
  } catch(e) {
    console.error("Error registrando historial de stock: " + e.toString());
  }
}

// Actualizar una fila buscando por ID genérico en una columna
function updateRowById(sheet, colIdName, idValue, updates) {
  var data = sheet.getDataRange().getValues();
  var headers = data[0].map(String);
  var colIdx = headers.indexOf(colIdName);

  if (colIdx === -1) return false;

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][colIdx]) === String(idValue)) {
      Object.entries(updates).forEach(function(entry) {
        var key = entry[0];
        var val = entry[1];
        
        // Si nos piden actualizar 'categoria' y la hoja usa 'category', actualizamos 'category'
        var finalKey = key;
        if (key === 'categoria' && headers.indexOf('category') !== -1) {
          finalKey = 'category';
        }

        var headerIdx = headers.indexOf(finalKey);
        if (headerIdx !== -1) {
          sheet.getRange(i + 1, headerIdx + 1).setValue(val);
        }
      });
      return true;
    }
  }
  return false;
}

// Añadir una fila a partir de un objeto según la estructura de cabeceras
function appendRowFromObject(sheet, obj) {
  var headers = sheet.getDataRange().getValues()[0].map(String);
  var newRow = headers.map(function(h) {
    var val = obj[h];
    if (val === undefined && h === 'category') {
      val = obj.categoria;
    }
    return val !== undefined ? val : '';
  });
  sheet.appendRow(newRow);
}

// Formateador de respuesta JSON amigable (CORS nativo de Google Apps Script)
function respond(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}