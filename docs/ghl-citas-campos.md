# GoHighLevel — Campos personalizados para el formulario de Citas

Este documento describe los campos personalizados que deben crearse en GoHighLevel para que la automatización del formulario de reserva de citas funcione correctamente.

---

## Campos estándar (ya existen en GHL)

Estos campos son nativos de GHL y no requieren creación manual:

| Campo GHL | Valor enviado |
|-----------|---------------|
| `firstName` | Primer nombre (extraído de "Nombre y Apellidos") |
| `lastName` | Apellidos (extraído de "Nombre y Apellidos") |
| `name` | Nombre completo |
| `phone` | Teléfono |
| `email` | Email |
| `source` | `"Landing Citas EFA"` (fijo) |
| `tags` | `["lead cita landing"]` |

---

## Campos personalizados a crear en GHL

Ve a **Settings → Custom Fields → Contacts** y crea los siguientes campos:

### 1. `ciudad_tatuaje`
- **Nombre visible**: Ciudad del tatuaje
- **Tipo**: Text (o Dropdown con opciones Barcelona / Zurich)
- **Field Key**: `ciudad_tatuaje`
- **Valores posibles**: `Barcelona`, `Zurich`

### 2. `idea_tatuaje`
- **Nombre visible**: Idea del tatuaje
- **Tipo**: Text Area
- **Field Key**: `idea_tatuaje`
- **Descripción**: Descripción libre del diseño o concepto que el cliente quiere.

### 3. `zona_cuerpo`
- **Nombre visible**: Zona del cuerpo
- **Tipo**: Text
- **Field Key**: `zona_cuerpo`
- **Descripción**: Zona donde el cliente quiere hacerse el tatuaje (ej. antebrazo interior).

### 4. `disponibilidad`
- **Nombre visible**: Disponibilidad
- **Tipo**: Text
- **Field Key**: `disponibilidad`
- **Descripción**: Cuándo quiere el cliente hacerse el tatuaje (ej. "Lo antes posible", "En las próximas semanas").

### 5. `informacion_adicional`
- **Nombre visible**: Información adicional
- **Tipo**: Text Area
- **Field Key**: `informacion_adicional`
- **Descripción**: Datos extra del cliente: alergias, si es cover-up, fechas concretas, etc. Campo opcional.

### 6. `tattoo_img`
- **Nombre visible**: Imagen de referencia
- **Tipo**: Text (URL)
- **Field Key**: `tattoo_img`
- **Descripción**: URL pública de la imagen de referencia subida por el cliente. El archivo se almacena en Vercel Blob y se envía aquí como link directo. Campo opcional — solo se envía si el cliente adjunta una imagen.

---

## Cómo obtener el Field Key correcto en GHL

1. Ve a **Settings → Custom Fields**
2. Haz clic en el campo creado
3. El **Field Key** aparece bajo el nombre (normalmente en minúsculas con guiones bajos)
4. Copia ese valor exacto — debe coincidir con las claves en `api/ghl/booking.js`

> **Importante**: Si GHL genera un key distinto (ej. `ciudad_tatuaje_1`), actualiza el valor correspondiente en `api/ghl/booking.js`.

---

## Variables de entorno requeridas

Asegúrate de que estas variables estén configuradas en Vercel (o en `.env.local` para desarrollo local):

```
GHL_PRIVATE_KEY=tu_private_api_key_de_ghl
GHL_LOCATION_ID=tu_location_id_de_ghl
BLOB_READ_WRITE_TOKEN=tu_token_de_vercel_blob
```

`GHL_PRIVATE_KEY` y `GHL_LOCATION_ID` son las mismas que ya usa el formulario de Academy. `BLOB_READ_WRITE_TOKEN` es nuevo y necesario para la subida de imágenes.

---

## Notas sobre imágenes de referencia

El campo `tattoo_img` está completamente integrado. El flujo es:

1. El cliente selecciona una imagen en el formulario (PNG/JPG/JPEG, máx. 3 MB).
2. Al enviar, el frontend convierte la imagen a base64 y la sube al endpoint `/api/upload-image`.
3. Ese endpoint almacena la imagen en **Vercel Blob** y devuelve una URL pública.
4. La URL se incluye en la llamada a `/api/ghl/booking` y se guarda en el campo `tattoo_img` del contacto de GHL.

### Variable de entorno adicional requerida

```
BLOB_READ_WRITE_TOKEN=tu_token_de_vercel_blob
```

Obtén este token en el dashboard de Vercel → Storage → Tu Blob store → Settings. Sin esta variable, la subida de imágenes fallará, pero el resto del formulario funcionará correctamente (el campo `tattoo_img` quedará vacío).

---

## Flujo de automatización sugerido en GHL

1. **Trigger**: Contacto creado/actualizado con tag `lead cita landing`
2. **Acción 1**: Enviar SMS/WhatsApp de confirmación al cliente
3. **Acción 2**: Notificar al equipo interno (email o Slack) con los datos del lead
4. **Acción 3**: Asignar a pipeline "Citas Pendientes" en el stage "Solicitud Recibida"
5. **Condición**: Si `ciudad_tatuaje = Zurich`, asignar a usuario/equipo de Zurich
