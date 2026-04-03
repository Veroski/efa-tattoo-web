# GoHighLevel — Plan de Visibilidad y Migración de Campos

Este documento deja por escrito el estado actual, la limitación real de GHL, la solución inmediata y un plan de migración conservador para no romper la automatización de seminarios.

Fecha de referencia: 3 de abril de 2026.

---

## Problema actual

Hoy existen dos flujos principales:

- `CITAS TATTOO`
- `SEMINARIO LINEA FINA`

Los dos funcionan a nivel de datos:

- Los leads/contactos de seminarios reciben sus campos de seminarios.
- Los leads/contactos de citas reciben sus campos de citas.

Pero la visualización en GHL no es limpia:

- En un lead/contacto de seminarios aparecen también visibles los campos de citas, vacíos.
- En un lead/contacto de citas aparecen también visibles los campos de seminarios, vacíos.
- En oportunidades ocurre el mismo patrón: se ven campos del otro flujo aunque no se usen.

El objetivo funcional es:

- Mantener los datos actuales.
- No perder información existente.
- Reducir el ruido visual de campos vacíos.
- Preparar una migración futura para ordenar bien el modelo de datos.

---

## Diagnóstico confirmado

### 1. El problema no es del código actual

La web está escribiendo correctamente en GHL:

- Seminarios: `/api/ghl/contact.js`
- Citas: `/api/ghl/booking.js`

Ambos envían `customFields` al contacto.

### 2. Los campos actuales relevantes están creados como `contact custom fields`

Se inspeccionó la location:

- `y4jXXIOIaPJOwTED9rVq`

Y los campos relevantes de ambos flujos devuelven `model: "contact"`.

Campos de citas detectados como `contact`:

- `contact.ciudad_tatuaje`
- `contact.idea_tatuaje`
- `contact.zona_cuerpo`
- `contact.disponibilidad`
- `contact.informacion_adicional`
- `contact.tattoo_img`

Campos de seminarios detectados como `contact`:

- `contact.tattoo_experience`
- `contact.main_difficulty`
- `contact.main_goal`
- `contact.can_attend_weekend`
- `contact.e_money_group`

### 3. En GHL, las automatizaciones no aíslan el esquema

Las secuencias/workflows:

- `CITAS TATTOO`
- `SEMINARIO LINEA FINA`

no crean una “vista ciega” de campos.

En GHL:

- Los `Contact custom fields` son globales para el objeto `Contact` dentro de la subcuenta.
- Los `Opportunity custom fields` son globales para el objeto `Opportunity` dentro de la subcuenta.
- Las carpetas (`Folders`) organizan, pero no aíslan.
- `Hide Empty Fields` limpia la vista, pero no cambia el modelo de datos.

### 4. El mismo problema puede existir también en oportunidades

Aunque ya existan `Opportunity custom fields` para ambos flujos, dentro de una misma subcuenta GHL los sigue considerando campos del objeto oportunidad.

Eso significa:

- Una oportunidad puede mostrar campos del otro flujo vacíos.
- Las sequences/workflows no resuelven esto por sí solas.

---

## Conclusión operativa

Hay dos horizontes:

### Corto plazo

No tocar el modelo de datos.

Objetivo:

- esconder visualmente los campos vacíos,
- sin arriesgar datos de seminarios ni romper automatizaciones.

### Largo plazo

Hacer una migración ordenada del modelo de datos para dejar solo los campos realmente necesarios en cada objeto y reducir ruido estructural.

---

## Solución inmediata

### Activar `Hide Empty Fields`

Es la solución correcta para ahora mismo.

Importante:

- No se pudo activar por API.
- Es una preferencia de interfaz de GHL.
- Debe activarse manualmente en la UI para cada usuario que trabaje en GHL.

### Dónde activarlo

#### En contactos

1. Abrir cualquier contacto.
2. Ir al panel donde se muestran los custom fields.
3. Activar `Hide Empty Fields`.

#### En oportunidades

1. Abrir cualquier oportunidad.
2. Ir al bloque de custom fields de la oportunidad.
3. Activar `Hide Empty Fields`.

### Qué efecto tiene

- Los campos vacíos dejan de mostrarse.
- Los campos con valor siguen visibles.
- No cambia la automatización.
- No cambia el almacenamiento.
- No rompe seminarios.

### Qué NO resuelve

- No separa el esquema de datos.
- No impide que ambos conjuntos de campos existan en la subcuenta.
- No convierte un flujo en “ciego” al otro a nivel estructural.

---

## Restricción importante

No conviene tocar ahora mismo la parte de seminarios sin auditoría previa, porque:

- ya hay leads creados,
- ya hay campos poblados,
- puede haber workflows, filtros, smart lists, formularios, plantillas o reporting usando esos campos,
- un cambio brusco puede ocultar o perder trazabilidad histórica.

Por eso la recomendación es:

- no borrar nada,
- no renombrar nada,
- no mover nada en producción todavía,
- y hacer primero una migración por fases.

---

## Inventario actual recomendado

### Contacto

Estado recomendado desde ahora:

Campos de seminarios:

- `tattoo_experience`
- `main_difficulty`
- `main_goal`
- `can_attend_weekend`
- `e_money_group`

Campos de citas:

- `ciudad_tatuaje`
- `idea_tatuaje`
- `zona_cuerpo`
- `disponibilidad`
- `informacion_adicional`
- `tattoo_img`

Campos estándar:

- `firstName`
- `lastName`
- `name`
- `email`
- `phone`
- `source`
- `tags`

### Oportunidad

Se asume que ya existen `Opportunity custom fields` para ambos flujos.

No se modifica nada todavía hasta revisar:

- pipeline,
- stage,
- workflows,
- reports,
- vistas de equipo.

---

## Plan de migración a largo plazo

Objetivo:

- reducir ruido visual,
- conservar histórico,
- no romper seminarios,
- y dejar el sistema listo para operar mejor a futuro.

### Fase 0 — Estado actual seguro

No tocar estructura.

Acciones:

- Activar `Hide Empty Fields` en contactos.
- Activar `Hide Empty Fields` en oportunidades.
- Mantener carpetas separadas para campos de citas y seminarios.

Resultado:

- mejora visual inmediata,
- cero riesgo funcional.

### Fase 1 — Auditoría completa antes de migrar

Revisar en GHL qué depende hoy de cada campo.

Checklist:

- workflows de seminarios que usen:
  - `tattoo_experience`
  - `main_difficulty`
  - `main_goal`
  - `can_attend_weekend`
  - `e_money_group`
- workflows de citas que usen:
  - `ciudad_tatuaje`
  - `idea_tatuaje`
  - `zona_cuerpo`
  - `disponibilidad`
  - `informacion_adicional`
  - `tattoo_img`
- smart lists y filtros
- oportunidades creadas por automatización
- plantillas de mensajes
- plantillas de email/SMS/WhatsApp
- formularios
- oportunidades/pipelines
- reporting
- automations por tags:
  - `lead seminario landing`
  - `lead cita landing`

Resultado esperado:

- mapa exacto de dependencias,
- cero cambios aún.

### Fase 2 — Definir modelo objetivo

Modelo recomendado a futuro:

#### Contacto

Dejar solo datos permanentes o reutilizables del lead:

- nombre
- email
- teléfono
- source
- tags
- quizá un campo simple de clasificación, por ejemplo:
  - `lead_origin_type`
  - valores:
    - `seminario`
    - `cita`

#### Oportunidad

Mover el detalle operativo específico del flujo:

Seminarios:

- experiencia
- dificultad principal
- objetivo
- fin de semana
- presupuesto

Citas:

- ciudad
- idea del tatuaje
- zona del cuerpo
- disponibilidad
- información adicional
- imagen

Objetivo:

- el contacto queda limpio,
- la información específica vive en la oportunidad correspondiente.

### Fase 3 — Migración conservadora

No mover de golpe.

Secuencia recomendada:

1. Crear o validar los `Opportunity custom fields` definitivos.
2. Duplicar la escritura:
   - seguir guardando en contacto temporalmente,
   - empezar a guardar también en oportunidad.
3. Verificar durante un periodo de transición.
4. Solo cuando todo esté estable:
   - dejar de depender de los campos de contacto específicos.

Resultado esperado:

- no se pierde histórico,
- no se rompe seminarios,
- se puede revertir si algo falla.

### Fase 4 — Limpieza final

Solo cuando la fase 3 esté validada.

Opciones:

- dejar los campos viejos de contacto pero fuera de uso,
- o archivarlos/retirarlos de vistas manuales si GHL lo permite sin romper histórico.

Recomendación:

- no borrar campos históricos salvo necesidad fuerte.
- mejor marcarlos como legacy y quitarles protagonismo.

---

## Riesgos a evitar

### Riesgo 1 — Romper seminarios

Puede ocurrir si:

- se deja de escribir en un campo que usa un workflow,
- se renombra un field key,
- se cambia un tipo de campo,
- se reutiliza un campo para otra cosa.

Mitigación:

- auditar antes,
- migración por duplicación temporal,
- no tocar field keys actuales sin revisión.

### Riesgo 2 — Perder histórico

Puede ocurrir si:

- se borran campos,
- se sobreescriben datos,
- se cambia la lógica de actualización sin validar leads antiguos.

Mitigación:

- no borrar,
- no limpiar datos existentes,
- mantener compatibilidad durante transición.

### Riesgo 3 — Mezclar contacto y oportunidad de forma inconsistente

Puede ocurrir si:

- una parte del flujo escribe en contacto,
- otra en oportunidad,
- y luego reporting/workflows leen solo uno de los dos lados.

Mitigación:

- definir primero el modelo objetivo,
- luego actualizar workflows,
- después cortar dependencias antiguas.

---

## Decisión recomendada

### Ahora

Hacer solo esto:

- activar `Hide Empty Fields` en contactos,
- activar `Hide Empty Fields` en oportunidades,
- no cambiar el modelo actual.

### Después

Preparar una migración conservadora con prioridad en no romper seminarios.

Orden recomendado:

1. auditoría,
2. modelo objetivo,
3. escritura duplicada temporal,
4. validación,
5. limpieza gradual.

---

## Estado final recomendado para esta tarea

Se da por buena la siguiente decisión:

- mantener los campos actuales tal como están,
- usar `Hide Empty Fields` para reducir ruido ahora,
- posponer la migración estructural,
- y no tocar seminarios sin auditoría previa.

---

## Siguiente documento recomendado

Cuando se quiera ejecutar la migración de verdad, crear un segundo documento con:

- inventario exacto de workflows afectados,
- campos actuales por objeto,
- campos destino por objeto,
- plan paso a paso de transición,
- checklist de validación antes de cortar el modelo anterior.
