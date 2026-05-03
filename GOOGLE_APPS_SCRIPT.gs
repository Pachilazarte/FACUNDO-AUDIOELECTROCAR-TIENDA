/*
  GOOGLE APPS SCRIPT - BACKEND PARA AUTOSOUND STORE
  1. Crear un Google Sheet.
  2. Ir a Extensiones > Apps Script.
  3. Pegar este código y hacer Deploy como Web App.
  4. Configurar el acceso para "Anyone" (Cualquiera).
  5. Copiar la URL del Web App y ponerla en VITE_GAS_API_URL en el proyecto React.
*/

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doGet(e) {
  const action = e.parameter.action;
  let data;

  try {
    switch (action) {
      case 'getProductos':
        data = getSheetData('Productos');
        break;
      case 'getConfiguracion':
        data = getConfigData();
        break;
      case 'getPedidos':
        data = getSheetData('Pedidos');
        break;
      default:
        throw new Error('Acción no válida');
    }
    return respond(data);
  } catch (err) {
    return respond({ error: err.message }, 500);
  }
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  const action = body.action;
  let result;

  try {
    switch (action) {
      case 'loginAdmin':
        result = validateLogin(body.usuario, body.password);
        break;
      case 'crearPedido':
        result = addRow('Pedidos', body);
        break;
      case 'crearProducto':
        result = addRow('Productos', body);
        break;
      case 'editarProducto':
        result = updateRow('Productos', body.id, body);
        break;
      case 'updatePedido':
        result = updateRow('Pedidos', body.pedidoId, { estado: body.estado }, 'pedidoId');
        break;
      default:
        throw new Error('Acción POST no válida');
    }
    return respond(result);
  } catch (err) {
    return respond({ error: err.message }, 500);
  }
}

// Helpers
function getSheetData(name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();
  return values.map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function respond(data, status = 200) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function addRow(sheetName, data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const newRow = headers.map(h => {
    if (h === 'fecha') return new Date();
    if (typeof data[h] === 'object') return JSON.stringify(data[h]);
    return data[h] || '';
  });
  sheet.appendRow(newRow);
  return { success: true };
}

function updateRow(sheetName, id, data, idColName = 'id') {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const headers = values[0];
  const idIndex = headers.indexOf(idColName);
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][idIndex] === id) {
      Object.keys(data).forEach(key => {
        const colIndex = headers.indexOf(key);
        if (colIndex > -1) {
          sheet.getRange(i + 1, colIndex + 1).setValue(data[key]);
        }
      });
      return { success: true };
    }
  }
  return { success: false, message: 'ID no encontrado' };
}

function validateLogin(u, p) {
  const users = getSheetData('Usuarios');
  const user = users.find(row => row.usuario === u && row.password === p);
  if (user) {
    return { success: true, user: { id: user.id, usuario: user.usuario, rol: user.rol, email: user.email } };
  }
  return { success: false };
}

function getConfigData() {
  const data = getSheetData('Configuración');
  let config = {};
  data.forEach(row => config[row.Clave] = row.Valor);
  return config;
}
