# EduPlay · Plataforma educativa

Prototipo educativo local para El Salvador, desarrollado con HTML5, CSS3, JavaScript y Python estándar. Incluye rutas por grado, acceso por roles, lecciones, clases, tareas, entregas, calificaciones y seguimiento.

## Estructura

```text
EduPlay-educativa/
├── index.html             Interfaz y vistas de acceso, inicio, aprendizaje, clases y perfil
├── styles.css             Identidad visual azul y diseño adaptable a móvil y escritorio
├── app.js                 Catálogo base, navegación, clases y comunicación con el servidor
├── activity-engine.js     Materias científicas/sociales, ejercicios, laboratorios y quizzes
├── server.py              Servidor HTTP local y API de autenticación/clases/progreso
├── Iniciar-EduPlay.bat    Inicio guiado en Windows
├── README.md              Guía de instalación y demostración
└── eduplay.db             Se crea al ejecutar la aplicación y guarda sus datos
```

La información curricular es una base de apoyo para el docente; debe contrastarse con los programas vigentes del MINEDUCYT y con la planificación del centro.

## Iniciar en Windows

1. Descomprime la carpeta completa en una ubicación de tu computadora.
2. Instala Python 3 si todavía no está instalado. Durante la instalación, activa la opción para agregar Python al PATH.
3. Abre la carpeta `EduPlay-educativa`.
4. Haz doble clic en `Iniciar-EduPlay.bat` y permite que se abra el navegador.
5. Deja abierta la ventana minimizada del servidor mientras usas la aplicación.
6. No abras `index.html` directamente: el login necesita que el servidor esté activo.

Si el navegador ya está abierto, visita [http://127.0.0.1:8000](http://127.0.0.1:8000). También puedes iniciar el servidor desde esa carpeta con `python server.py` y luego abrir esa dirección.

## Crear cuentas y acceder

1. En la pantalla de entrada, selecciona **Crear cuenta**.
2. Completa nombre, grado, usuario y contraseña de al menos 8 caracteres.
3. La primera cuenta de esa instalación obtiene el rol de administración. Anota su usuario y contraseña: esos mismos datos se usan después en **Iniciar sesión**.
4. Desde esa cuenta, crea cuentas separadas para estudiantes y docentes. Una cuenta docente nueva queda pendiente de autorización.
5. Entra a **Perfil → Cuentas y roles** y cambia la cuenta docente a **Profesor/a**.
6. Cierra sesión; el docente entra con el usuario y contraseña que registró y ya puede crear una clase.
7. El estudiante crea su cuenta aparte, inicia sesión y se une a la clase con el código compartido por el profesor.

El login no trae cuentas universales ni contraseñas de demostración. Cada instalación guarda sus cuentas localmente en `eduplay.db`; una contraseña olvidada no se puede recuperar desde este prototipo. Conserva esa base de datos para mantener usuarios, clases y resultados.

## Flujo de uso para una demostración

1. Administración autoriza la cuenta docente.
2. El profesor abre **Mis clases**, crea un grupo con nombre, grado y sección, y comparte el código.
3. El profesor publica una actividad con instrucciones y fecha de entrega.
4. El estudiante se une al grupo, entrega su respuesta y consulta su estado.
5. El profesor revisa la entrega, registra nota de 0 a 100 y agrega retroalimentación.
6. El estudiante revisa **Perfil** para consultar sus prácticas, intentos, notas y temas dominados.

## Alcance funcional actual

- Roles separados: estudiante, profesor pendiente, profesor autorizado y administración.
- Contenidos para 1.º a 9.º grado, bachillerato general (1.º y 2.º año) y bachillerato técnico (1.º a 3.º año).
- Rutas de Matemáticas, Lenguaje, Ciencias Naturales, Estudios Sociales, Programación y desarrollo de software, y Robótica; los temas cambian según el grado/modalidad. Ciencias y Estudios Sociales incluyen progresiones propias por grado y modalidad.
- Cada tema incluye propósito, requisitos previos, explicación, ejemplo guiado, materiales, actividad y pregunta para reflexionar. Programación tiene un reto interactivo y Robótica un simulador de recorrido.
- Las lecciones agregan quizzes de cuatro formatos (opción múltiple, verdadero/falso, completar y respuesta corta), retroalimentación inmediata, cuenta regresiva, XP y racha. Incluyen secuenciación por arrastrar/soltar o controles accesibles, editor guiado de pseudocódigo, mini laboratorio de fricción, comparador de fuentes y simulador conceptual de circuito.
- Los resultados de quizzes se guardan en SQLite con puntuación, respuestas, XP, duración y mejor racha. El estudiante ve su historial en Perfil; el docente consulta promedio del grupo, intentos y temas con resultados menores a 70% en Mis clases.
- El estudiante guarda prácticas, autoevaluación y entregas; el docente crea grupos, asigna tareas, revisa respuestas y califica.
- Diseño adaptable a pantallas pequeñas y grandes.

## Si no funciona el acceso

- Comprueba que abriste `Iniciar-EduPlay.bat`, no el archivo HTML.
- Si aparece el mensaje sobre Python, instala Python 3 y vuelve a iniciar.
- Si el puerto 8000 está ocupado, cierra la otra aplicación que lo usa y vuelve a abrir el iniciador.
- Si ya creaste tu cuenta, usa **Iniciar sesión** con el mismo usuario y contraseña; no vuelvas a registrarte con otro nombre para intentar entrar.
- Si acabas de descomprimir una nueva copia, abre la misma carpeta desde la que creaste la cuenta: cada carpeta guarda su propio `eduplay.db`.

## Añadir contenidos y preguntas

`activity-engine.js` mantiene las colecciones `content` (temas por grado y materia) y `banks` (preguntas con tipo, opciones, respuesta y explicación). Para agregar preguntas, conserva los campos `type`, `prompt`, `answer` y `explain`; las preguntas cortas usan `keywords`. Los resultados se reciben en `/api/quiz-attempt` y se almacenan en la tabla `quiz_attempts` de SQLite. El servidor comprueba rol, materia, grado y rangos numéricos; el navegador nunca ejecuta el texto libre del editor.

Las actividades de laboratorio son modelos didácticos conceptuales. Sus salidas no representan mediciones científicas certificadas ni sustituyen el trabajo experimental supervisado.

## Uso institucional

Esta entrega funciona como demostración en una sola computadora y escucha solo en `127.0.0.1`. Para uso simultáneo por una institución se necesita desplegarla en un servidor administrado con HTTPS, copias de seguridad, controles de privacidad y revisión de seguridad. No compartas la base de datos ni uses datos personales reales en la feria.\n## Importante sobre Vercel\n\nEste ZIP incluye `server.py`, que es un servidor HTTP local basado en Python estándar y SQLite. Vercel no lo ejecuta automáticamente al publicar los archivos estáticos. Por eso, la interfaz puede cargarse, pero las rutas `/api/login`, `/api/register`, `/api/state` y las demás pueden responder 404 si no se despliega un backend compatible.\n\nEl frontend ahora valida `Content-Type`, estado HTTP y JSON antes de procesar la respuesta, para mostrar un diagnóstico legible en lugar de `Unexpected token ... is not valid JSON`. Esto mejora el manejo del error, pero no crea el backend que falta. Para habilitar el inicio de sesión en Vercel hay que portar las rutas API a funciones compatibles y usar una base de datos persistente compatible con despliegues serverless; el SQLite local no debe asumirse como base de datos persistente en Vercel.\n