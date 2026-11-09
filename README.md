# Empaquemos estas memorias · Alico × Softgic

Cierre del taller GEN IA. Cada colaborador conversa 5 minutos con **Memo** (robot de Softgic). Memo hace 5 preguntas pensadas para que Alico y Softgic sepan qué quieren los empleados en automatización e IA. Las respuestas se convierten en el **informe del evento** y en la **hoja de ruta**.

**En línea:** https://daniel-softgic.github.io/alico-memorias/

## Archivos
- `index.html`: muro para la TV y entrevista con Memo.
  - Voz con subtítulos y transcripción en vivo (no se graba audio).
  - Opciones rápidas para poder medir, idea empacada con IA y foto del grupo.
- `admin.html`: informe (PIN por defecto **1234**), con cuatro pestañas:
  - **Resumen**
  - **Informe por caso y hoja de ruta**
  - **Respuestas** (con la transcripción completa)
  - **Guardar y exportar**
- `shared/mem.js`: preguntas, casos, almacenamiento, estadísticas y puntaje.
- `shared/al.js`: núcleo común con el portal GEN IA (IA, nube, voz y ajustes).
- `apps-script/Code.gs`: nube en Google Sheets, Drive y correo. Es la misma que usa el portal GEN IA. Las respuestas van a la hoja **Respuestas**.

## Las 5 preguntas
| # | Pregunta | Qué mide |
|---|----------|----------|
| 1 | ¿Qué tarea te quita más tiempo o te frustra? | Dolor principal (8 categorías) |
| 2 | ¿Cuántas horas a la semana y a cuántas personas les pasa? | Horas que se pueden liberar (horas × personas) |
| 3 | ¿Cuál de los 5 casos quieres primero, y por qué? | Demanda por caso |
| 4 | ¿Qué te gustaría que la IA hiciera por ti? | Capacidades esperadas |
| 5 | ¿Qué necesitas para adoptarla? ¿Qué tan listo te sientes (1–5)? | Barreras y preparación |

## Puntaje de la hoja de ruta
El puntaje de cada caso pondera tres factores:
- **50 % interés:** votos más la mitad de quienes describen un problema que el caso resuelve.
- **30 % horas** en juego.
- **20 % facilidad** de implementar.

Con ese puntaje cada caso queda en una ola:
- **Ola 1** (meses 0–3): los 2 primeros.
- **Ola 2** (meses 3–6): los 2 siguientes.
- **Ola 3** (meses 6–12): el último.

## Durante el evento
- **Muro en la TV:** pantalla completa (F11). Se entra a la entrevista con el botón **Hablar con Memo** o con la tecla **N**.
- **Reiniciar contador** (pie de página, pide el PIN): el muro empieza de cero para el siguiente grupo, pero **no se borra nada** del informe.
- **Guardar todo:**
  - Con la nube configurada, cada respuesta va sola a Google Sheets.
  - Además, en el informe → *Guardar y exportar* se descarga el **CSV** (Excel), el **respaldo completo** (JSON con fotos) y el **PDF** del informe.
- **Ejemplos:** los datos de EJEMPLO se ocultan solos cuando llega la primera respuesta real. Se pueden quitar desde *Guardar y exportar*.

## Requisitos
- Chrome o Edge, porque el reconocimiento de voz no funciona en otros navegadores. Siempre se puede escribir.
- ⚙️ Ajustes: clave de IA (opcional, para redactar la idea y el resumen ejecutivo), URL de la nube y clave de la nube.
