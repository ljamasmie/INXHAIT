# Dashboard de Entregas — despliegue en GitHub Pages

Este paquete trae todo lo necesario para publicar el dashboard como una página web real (con URL propia), fuera del entorno restringido de Claude, para que las llamadas a Google Sheets funcionen sin problema.

## Contenido

- `index.html` — el dashboard completo (GitHub Pages sirve automáticamente este archivo como página principal).
- `sheets_bridge.gs` — script para conectar una hoja **privada** de Google Sheets sin exponerla (opcional, solo si no quieres dejar la hoja pública).

## Pasos para publicarlo

1. **Crea una cuenta gratuita en GitHub** (si no tienes una): [github.com/signup](https://github.com/signup)

2. **Crea un repositorio nuevo**:
   - Botón verde "New" en [github.com/new](https://github.com/new)
   - Nombre sugerido: `dashboard-entregas`
   - Marca "Public" (puede ser privado también, pero GitHub Pages en cuentas gratuitas solo publica repos públicos)
   - Clic en "Create repository"

3. **Sube el archivo `index.html`**:
   - En la página del repo recién creado, clic en "uploading an existing file" (o el botón "Add file" → "Upload files")
   - Arrastra `index.html` (y `sheets_bridge.gs` si lo vas a usar)
   - Clic en "Commit changes"

4. **Activa GitHub Pages**:
   - Ve a la pestaña **Settings** del repositorio
   - Menú izquierdo → **Pages**
   - En "Build and deployment" → "Source" elige **"Deploy from a branch"**
   - En "Branch" elige **main** y carpeta **/ (root)** → **Save**
   - Espera 1-2 minutos. GitHub te mostrará la URL pública, algo así:
     `https://TU-USUARIO.github.io/dashboard-entregas/`

5. **Abre esa URL.** Ahí el dashboard corre como una página normal, sin las restricciones de red del chat, y debería poder leer tu Google Sheet.

## Sobre la privacidad de tus datos

- **Si tu hoja de Google Sheets está pública** ("Cualquiera con el enlace"), este dashboard sí podrá leerla, pero recuerda que es información con cédulas y nombres reales — cualquiera con el enlace de la hoja (no solo del dashboard) puede verla completa.
- **Recomendado:** vuelve a restringir la hoja a privada y usa el modo **"Apps Script (privado)"** dentro del panel de Configuración del dashboard (ícono de engranaje), siguiendo las instrucciones dentro de `sheets_bridge.gs`. Así la hoja se mantiene privada y solo el dashboard (con el token secreto) puede leerla.
- El repositorio de GitHub en sí puede ser público sin problema — el archivo `index.html` no contiene datos, solo el código del dashboard. Los datos reales siempre se consultan en vivo desde Google Sheets, nunca quedan guardados en GitHub.

## Actualizaciones futuras

Si más adelante quieres cambiar el diseño o la lógica del dashboard, puedes:
- Volver a este chat y pedirme los cambios; te regenero `index.html`.
- Subir el archivo actualizado a GitHub reemplazando el anterior (Add file → Upload files → mismo nombre → Commit).

GitHub Pages se actualiza solo, 1-2 minutos después de cada cambio subido.
