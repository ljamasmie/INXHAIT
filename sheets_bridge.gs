/**
 * PUENTE SEGURO: Google Sheets (privado) -> Dashboard de Entregas
 * ------------------------------------------------------------------
 * Este script se ejecuta con TU identidad (la persona que lo despliega),
 * que ya tiene acceso a la hoja. La hoja NUNCA se hace pública: solo se
 * publica esta URL, y esta URL exige un token secreto antes de devolver
 * cualquier dato.
 *
 * INSTALACIÓN:
 * 1. En tu Google Sheet: Extensiones -> Apps Script.
 * 2. Reemplaza todo el contenido de Code.gs por este archivo.
 * 3. Cambia SECRET_TOKEN por una clave propia (cualquier texto largo y
 *    difícil de adivinar).
 * 4. Si tus datos están en una pestaña distinta a la primera, ajusta
 *    SHEET_NAME más abajo (déjalo en null para usar la primera pestaña
 *    / la hoja con gid indicado).
 * 5. Implementar -> Nueva implementación -> tipo "Aplicación web".
 *    - Ejecutar como: Yo (tu cuenta)
 *    - Quién tiene acceso: Cualquier usuario
 *    (Esto no expone la hoja: solo expone este endpoint, protegido por token)
 * 6. Copia la URL /exec resultante y pégala en el dashboard.
 */

const SECRET_TOKEN = 'CAMBIA_ESTE_TOKEN_POR_UNO_PROPIO';
const SHEET_NAME = null; // null = usa la primera hoja del archivo. O escribe el nombre exacto de la pestaña, ej: 'Base'

function doGet(e) {
  try {
    const token = e.parameter.token || '';
    if (token !== SECRET_TOKEN) {
      return jsonResponse({ status: 'error', message: 'Token inválido.' }, 401);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
    if (!sheet) {
      return jsonResponse({ status: 'error', message: 'No se encontró la hoja indicada.' }, 404);
    }

    const range = sheet.getDataRange();
    const values = range.getDisplayValues(); // valores formateados tal como se ven en la hoja
    const rawValues = range.getValues();     // valores crudos (fechas como Date reales, números como number)

    if (values.length === 0) {
      return jsonResponse({ status: 'ok', headers: [], rows: [] });
    }

    const headers = values[0].map(h => String(h).trim());
    const rows = [];
    for (let r = 1; r < values.length; r++) {
      const rowObj = {};
      for (let c = 0; c < headers.length; c++) {
        const raw = rawValues[r][c];
        // Si el valor crudo es una fecha real de Google Sheets, la mandamos en ISO
        // para que el dashboard la parsee sin ambigüedad. Si no, mandamos el texto
        // tal como se muestra en la celda.
        if (Object.prototype.toString.call(raw) === '[object Date]' && !isNaN(raw)) {
          // Formateado SIN conversión de zona horaria: preserva la hora exacta
          // tal como está escrita en la hoja (ej. 09:00 significa 09:00,
          // sin importar en qué zona horaria esté quien abre el dashboard).
          rowObj[headers[c]] = Utilities.formatDate(raw, ss.getSpreadsheetTimeZone(), "yyyy-MM-dd'T'HH:mm:ss");
        } else {
          rowObj[headers[c]] = values[r][c];
        }
      }
      rows.push(rowObj);
    }

    return jsonResponse({ status: 'ok', headers: headers, rows: rows, fetchedAt: new Date().toISOString() });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.message }, 500);
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
