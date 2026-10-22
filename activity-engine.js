/* Motor de contenidos y actividades. Se carga después de app.js para extender el catálogo existente. */
(() => {
  const subjectData = {
    'Ciencias Naturales': {
      icon: '✦', color: 'science', blocks: ['Indagación y pensamiento científico', 'Seres vivos y ambiente', 'Materia, energía y movimiento', 'Tierra y universo', 'Ciencia aplicada'],
      desc: 'Observación, experimentación y explicación de fenómenos del entorno.'
    },
    'Estudios Sociales': {
      icon: '⌖', color: 'social', blocks: ['Identidad y convivencia', 'Territorio y ambiente', 'Historia y memoria', 'Economía y ciudadanía', 'Investigación social'],
      desc: 'Comprensión crítica de la comunidad, la historia, el territorio y la ciudadanía.'
    }
  };
  const content = {
    '1': { 'Ciencias Naturales': 'Los sentidos y la observación|Seres vivos y elementos sin vida|Necesidades de plantas y animales|Hábitos de higiene|Agua y sus usos|Cambios del clima|Materiales del entorno|Luz, sombra y sonido|Cuidado de la naturaleza|Registro de observaciones', 'Estudios Sociales': 'Mi identidad y mi familia|Acuerdos para convivir|La escuela y sus espacios|Personas que ayudan a la comunidad|Mi localidad|Orientación y puntos de referencia|Celebraciones y tradiciones|Normas y responsabilidades|Servicios de la comunidad|Relato de una historia familiar' },
    '2': { 'Ciencias Naturales': 'Clasificación de plantas y animales|Partes de una planta|Ciclos de vida observables|Alimentación y salud|Estados del agua|Mezclas cotidianas|Fuerza y movimiento|Sonido y vibración|Tiempo atmosférico|Acciones para cuidar el entorno', 'Estudios Sociales': 'Familia y comunidad|Derechos y responsabilidades|Normas y participación escolar|Mapas sencillos de la localidad|Paisajes naturales y construidos|Oficios y servicios|Cambios de la comunidad|Símbolos y celebraciones|Uso responsable de recursos|Entrevista a una persona de la comunidad' },
    '3': { 'Ciencias Naturales': 'Clasificación y hábitats|Adaptaciones de los seres vivos|Cadenas alimentarias simples|Cuerpo y prevención|Agua: ciclo y cuidado|Sólidos, líquidos y gases|Fuerzas y máquinas simples|Luz, sonido y materiales|Suelo y clima|Planificación de una observación', 'Estudios Sociales': 'Identidad cultural local|Convivencia y resolución de conflictos|Organización del municipio|Mapas, escala gráfica y símbolos|Relieve e hidrografía local|Historia oral y fuentes|Actividades económicas|Derechos de niñas y niños|Riesgos y prevención comunitaria|Presentación de un problema local' },
    '4': { 'Ciencias Naturales': 'Pregunta científica y variables observables|Ecosistemas y relaciones alimentarias|Adaptaciones y clasificación de seres vivos|Sistema digestivo y nutrición|Mezclas y métodos de separación|Masa, volumen y densidad cualitativa|Fuerzas, fricción y movimiento|Circuitos: fuente, conductor y carga|Tiempo atmosférico y ciclo del agua|Diseño de un experimento justo', 'Estudios Sociales': 'Identidad salvadoreña y diversidad cultural|Normas, derechos y participación|Municipio: autoridades y servicios|Lectura de mapas y puntos cardinales|Relieve, ríos y paisajes de El Salvador|Fuentes para conocer el pasado|Intercambio, producción y consumo|Patrimonio cultural y natural|Prevención ante amenazas locales|Investigación de una necesidad comunitaria' },
    '5': { 'Ciencias Naturales': 'Hipótesis, evidencia y registro|Biodiversidad y redes tróficas|Cambios en los ecosistemas|Sistemas respiratorio y circulatorio|Cambios físicos y mezclas|Temperatura y transferencia de calor|Electricidad estática y circuitos|Máquinas simples y trabajo|Fases de la Luna y sombras|Informe experimental con datos', 'Estudios Sociales': 'Población y diversidad de El Salvador|Organización del Estado y servicios|Regiones, departamentos y municipios|Clima, cuencas y uso del suelo|Pueblos originarios y memoria histórica|Línea del tiempo y fuentes primarias|Agricultura, industria y comercio|Migración y cambios sociales|Gestión de riesgos y protección civil|Propuesta para mejorar la comunidad' },
    '6': { 'Ciencias Naturales': 'Diseño experimental y control de variables|Células, tejidos y sistemas|Relaciones ecológicas y conservación|Reproducción y cambios del cuerpo|Átomos, moléculas y propiedades|Reacciones y conservación de materia|Energía, calor y transformaciones|Circuitos en serie y paralelo|Sistema solar y escalas|Análisis de tablas y conclusiones', 'Estudios Sociales': 'Territorio, población y movilidad|Gobierno local y participación ciudadana|Regiones naturales y recursos|Cambio climático y vulnerabilidad|Civilizaciones antiguas y legado|Causalidad y continuidad histórica|Presupuesto familiar y necesidades|Desigualdad y oportunidades|Instituciones y cultura de paz|Proyecto de investigación social con fuentes' },
    '7': { 'Ciencias Naturales': 'Observación, hipótesis y evidencia|Niveles de organización biológica|Ecosistemas y flujo de energía|Nutrición, salud y sistemas del cuerpo|Estructura de la materia|Mezclas, soluciones y concentración|Movimiento, fuerza y gráficas|Energía y circuitos básicos|Tierra, clima y ciclos|Bitácora y comunicación de resultados', 'Estudios Sociales': 'Fuentes, tiempo histórico y perspectiva|Primeras sociedades y sedentarismo|Civilizaciones y organización política|Geografía física y población|Territorio salvadoreño y regiones|Producción, intercambio y recursos|Derechos, deberes e instituciones|Diversidad cultural e identidad|Riesgo social y resiliencia|Análisis de un caso comunitario' },
    '8': { 'Ciencias Naturales': 'Variables, medición e incertidumbre|Célula y transporte de sustancias|Evolución, adaptación y biodiversidad|Sistemas del cuerpo y homeostasis|Tabla periódica y enlaces introductorios|Disoluciones y cambios químicos|Leyes cualitativas del movimiento|Trabajo, potencia y energía|Clima, atmósfera y ciclos terrestres|Gráficas, datos y argumentación científica', 'Estudios Sociales': 'Civilizaciones clásicas y organización|Edad Media: poder, economía y cultura|Expansión, encuentro y colonización|Cartografía, escala y coordenadas|Población, urbanización y territorio|Sectores productivos y cadenas de valor|Constitución, ciudadanía y participación|Identidad, patrimonio y memoria|Conflicto, negociación y cultura de paz|Comparación crítica de fuentes' },
    '9': { 'Ciencias Naturales': 'Diseño experimental y reproducibilidad|Genética básica y herencia|Evolución y selección natural|Salud, prevención y sistemas integrados|Mol, fórmulas y reacciones|Ácidos, bases y pH|Electricidad, voltaje y resistencia|Ondas, frecuencia y aplicaciones|Cambio climático y sostenibilidad|Evaluación de evidencia y fuentes', 'Estudios Sociales': 'Estado, nación y ciudadanía|Independencias y formación republicana|Transformaciones políticas de Centroamérica|Desarrollo urbano y migración|Recursos, ambiente y conflicto|Economía, empleo y desigualdad|Democracia, derechos y participación|Memoria histórica y patrimonio|Globalización y medios de comunicación|Ensayo social basado en evidencias' },
    'bg1': { 'Ciencias Naturales': 'Método científico y revisión de fuentes|Biomoléculas y organización celular|Genética, herencia y variación|Ecología de poblaciones y ecosistemas|Estequiometría y reacciones|Soluciones, concentración y pH|Cinemática y análisis vectorial|Leyes de Newton y energía|Electricidad y magnetismo conceptual|Proyecto de laboratorio con datos', 'Estudios Sociales': 'Métodos de investigación social|Pueblos originarios y sociedades antiguas|Conquista, colonia y resistencias|Formación del Estado salvadoreño|Población, territorio y urbanización|Economía, trabajo y sectores productivos|Derechos humanos y marco constitucional|Desigualdad, género y oportunidades|Integración centroamericana|Estudio de caso con fuentes contrastadas' },
    'bg2': { 'Ciencias Naturales': 'Bioética y comunicación científica|Expresión genética y biotecnología|Fisiología y salud pública|Evolución y biodiversidad regional|Equilibrio químico y cinética|Química orgánica y aplicaciones|Ondas, óptica y modelos|Conservación de energía y potencia|Clima, datos y modelos ambientales|Informe científico reproducible', 'Estudios Sociales': 'Teorías sociales y análisis de fuentes|Historia política contemporánea|Conflicto, memoria y reconciliación|Geopolítica y relaciones internacionales|Economía nacional y globalización|Instituciones, políticas públicas y evaluación|Migración y dinámicas demográficas|Medios, desinformación y ciudadanía digital|Sostenibilidad y desarrollo territorial|Investigación social y defensa oral' },
    'bt1': { 'Ciencias Naturales': 'Medición, seguridad y registro técnico|Materiales: propiedades y selección|Masa, volumen y tolerancias|Energía y eficiencia de sistemas|Electricidad: magnitudes y medición segura|Circuitos de baja tensión|Calor y transferencia en equipos|Impacto ambiental de materiales|Lectura de fichas técnicas|Informe de práctica y datos', 'Estudios Sociales': 'Ética y seguridad en ambientes de trabajo|Historia de la tecnología y oficios|Organización de sectores productivos|Normas de convivencia y derechos laborales|Territorio y recursos para la especialidad|Impacto social de soluciones técnicas|Trabajo en equipo y comunicación|Consumo responsable y sostenibilidad|Emprendimiento y necesidades del entorno|Diagnóstico de una necesidad local' },
    'bt2': { 'Ciencias Naturales': 'Incertidumbre y control de calidad|Materiales conductores, aislantes y semiconductores|Propiedades mecánicas y pruebas|Potencia, consumo y rendimiento|Sensores y adquisición de datos|Circuitos y diagnóstico de fallas|Transferencia térmica en procesos|Residuos y gestión ambiental|Variables de proceso y gráficas|Protocolo de ensayo técnico', 'Estudios Sociales': 'Regulación y ética de la especialidad|Cadenas de suministro y producción|Derechos laborales y prevención|Tecnología y transformación del empleo|Territorio, infraestructura y servicios|Evaluación de impacto social|Comunicación con usuarios y clientes|Economía circular y responsabilidad|Gestión de proyectos colaborativos|Estudio de caso profesional' },
    'bt3': { 'Ciencias Naturales': 'Validación de mediciones y trazabilidad|Selección de materiales por especificación|Fallas, fatiga y vida útil|Eficiencia energética de prototipos|Instrumentación y registro de señales|Diagnóstico y mantenimiento preventivo|Balance térmico de un sistema|Evaluación de impacto ambiental|Estadística de procesos y calidad|Proyecto técnico con memoria de resultados', 'Estudios Sociales': 'Ética profesional y responsabilidad técnica|Normativa, derechos y seguridad ocupacional|Innovación y desarrollo local|Análisis de costos y sostenibilidad|Impacto social de automatización|Protección de datos y propiedad intelectual|Comunicación técnica para públicos diversos|Emprendimiento y formalización|Evaluación de soluciones con actores locales|Portafolio y defensa de proyecto' }
  };
  const gradeIds = ['1','2','3','4','5','6','7','8','9','bg1','bg2','bt1','bt2','bt3'];
  Object.assign(subjects, subjectData);
  for (const id of gradeIds) {
    gradeTopics[id]['Ciencias Naturales'] = content[id]['Ciencias Naturales'].split('|');
    gradeTopics[id]['Estudios Sociales'] = content[id]['Estudios Sociales'].split('|');
  }

  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const banks = {
    'Matemáticas': [
      {type:'choice', prompt:'Un equipo organiza 4 filas con 6 materiales en cada una. ¿Cuántos materiales hay?', options:['10','20','24','46'], answer:'24', explain:'Multiplicamos filas por elementos de cada fila: 4 × 6 = 24.'},
      {type:'boolean', prompt:'En una proporción equivalente, si una cantidad se duplica, la otra también se duplica.', answer:'verdadero', explain:'En una relación directamente proporcional, ambas cantidades cambian por el mismo factor.'},
      {type:'fill', prompt:'Completa: 3/4 es equivalente a __/8.', answer:['6'], explain:'Multiplica numerador y denominador por 2: 3/4 = 6/8.'},
      {type:'short', prompt:'Menciona una forma de comprobar una operación matemática.', keywords:['estim','operación','sustitu','inversa','aproxim'], explain:'Comprobar puede hacerse con la operación inversa, estimación, sustitución o una segunda estrategia.'}
    ],
    'Lenguaje': [
      {type:'choice', prompt:'¿Cuál evidencia apoya mejor una conclusión de un texto?', options:['Una opinión sin ejemplo','Una cita o dato relacionado','El título únicamente','Una idea que no aparece'], answer:'Una cita o dato relacionado', explain:'Una evidencia procede del texto y se conecta directamente con la conclusión.'},
      {type:'boolean', prompt:'Una idea principal resume de qué trata principalmente un texto.', answer:'verdadero', explain:'La idea principal reúne el mensaje central; los detalles la desarrollan.'},
      {type:'fill', prompt:'La persona a quien se dirige un mensaje es su ____.', answer:['audiencia','destinatario','receptor'], explain:'La audiencia, destinatario o receptor es quien recibe el mensaje.'},
      {type:'short', prompt:'Escribe qué debe tener una afirmación para que sea clara y verificable.', keywords:['idea','evidencia','clara','fuente','dato'], explain:'Una afirmación clara expresa una idea precisa y puede apoyarse con evidencia o fuentes.'}
    ],
    'Ciencias Naturales': [
      {type:'choice', prompt:'Para comprobar si la luz afecta el crecimiento de una planta, ¿qué conviene mantener igual?', options:['La cantidad de agua y el tipo de planta','Cambiar agua y luz a la vez','Usar plantas distintas','No registrar el tiempo'], answer:'La cantidad de agua y el tipo de planta', explain:'Controlar las demás condiciones permite estudiar el efecto de una variable: la luz.'},
      {type:'boolean', prompt:'Una conclusión científica debe relacionarse con los datos observados.', answer:'verdadero', explain:'La conclusión explica los resultados y debe distinguir datos de opiniones.'},
      {type:'fill', prompt:'La variable que se mide como resultado se llama variable ____.', answer:['dependiente'], explain:'La variable dependiente cambia en respuesta a la variable que se modifica.'},
      {type:'short', prompt:'¿Por qué se cambia una sola variable a la vez en una prueba?', keywords:['aislar','efecto','causa','compar','identificar'], explain:'Así se puede atribuir con más confianza el cambio observado a la variable manipulada.'}
    ],
    'Estudios Sociales': [
      {type:'choice', prompt:'¿Cuál es una fuente primaria para investigar una historia local?', options:['Una entrevista a un testigo','Un resumen sin referencias','Una opinión anónima','Una lista inventada'], answer:'Una entrevista a un testigo', explain:'Una fuente primaria ofrece evidencia directa de la época o experiencia investigada.'},
      {type:'boolean', prompt:'Comparar fuentes con perspectivas distintas ayuda a analizar un hecho social.', answer:'verdadero', explain:'La comparación ayuda a reconocer contexto, coincidencias, diferencias y posibles sesgos.'},
      {type:'fill', prompt:'Un mapa usa una ____ para representar distancias reducidas.', answer:['escala'], explain:'La escala relaciona la distancia en el mapa con la distancia real.'},
      {type:'short', prompt:'Nombra un criterio para valorar si una fuente es confiable.', keywords:['autor','fecha','evidencia','referencia','procedencia','contexto'], explain:'Se puede revisar autoría, fecha, procedencia, evidencia y propósito de la fuente.'}
    ],
    'Programación': [
      {type:'choice', prompt:'¿Qué valor imprime este pseudocódigo? total = 0; repetir n de 1 a 3: total = total + n', options:['3','5','6','9'], answer:'6', explain:'Las sumas son 0 + 1 + 2 + 3 = 6.'},
      {type:'boolean', prompt:'Probar un programa con casos límite ayuda a detectar errores.', answer:'verdadero', explain:'Los valores extremos, vacíos o inusuales revelan fallas que un caso típico puede ocultar.'},
      {type:'fill', prompt:'Una secuencia finita y ordenada para resolver un problema es un ____.', answer:['algoritmo'], explain:'Un algoritmo describe pasos definidos para alcanzar un resultado.'},
      {type:'short', prompt:'¿Qué información registrarías para reproducir un error de software?', keywords:['paso','entrada','resultado','esperado','reproduc','error'], explain:'Registra pasos, datos de entrada, resultado observado y resultado esperado.'}
    ],
    'Robótica': [
      {type:'choice', prompt:'¿Qué componente puede detectar que un robot se acerca a un obstáculo?', options:['Sensor de distancia','Rueda','Batería únicamente','Chasis'], answer:'Sensor de distancia', explain:'El sensor mide o detecta proximidad y ofrece una entrada al controlador.'},
      {type:'boolean', prompt:'Una prueba útil cambia una condición y registra el resultado.', answer:'verdadero', explain:'Cambiar una variable por vez hace más claro qué causó la diferencia.'},
      {type:'fill', prompt:'En un sistema robótico, el motor es un ejemplo de ____.', answer:['actuador'], explain:'El actuador convierte una señal de control en una acción física.'},
      {type:'short', prompt:'¿Qué medirías para saber si un robot sigue bien una ruta?', keywords:['distancia','tiempo','desviación','error','ruta','precisión'], explain:'Se pueden medir desviación de la ruta, distancia recorrida, tiempo y repetibilidad.'}
    ]
  };
  const token = () => localStorage.getItem('eduplayToken') || '';
  async function saveAttempt(payload) {
    const response = await fetch(`/api/quiz-attempt?token=${encodeURIComponent(token())}`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...payload,token:token()})
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'No se pudo guardar el resultado.');
    return data;
  }
  const pickBank = (subject,gradeId) => {
    const base=banks[subject]||banks['Matemáticas'];
    const advanced=subject==='Matemáticas'?{type:'choice',prompt:'Resuelve 2x + 3 = 11. ¿Cuál es x?',options:['3','4','5','7'],answer:'4',explain:'Resta 3 a ambos lados: 2x = 8. Divide entre 2: x = 4.'}:
      subject==='Lenguaje'?{type:'choice',prompt:'¿Qué fortalece una tesis en un ensayo académico?',options:['Una afirmación específica respaldada por fuentes','Una frase general sin evidencia','Repetir el título','Usar una fuente sin identificar'],answer:'Una afirmación específica respaldada por fuentes',explain:'Una tesis defendible expresa una postura precisa y se sostiene con evidencias pertinentes.'}:
      subject==='Ciencias Naturales'?{type:'choice',prompt:'En una prueba de fricción, ¿cuál es la variable dependiente si cambias la superficie?',options:['La distancia recorrida','La superficie','El objeto usado','El impulso aplicado'],answer:'La distancia recorrida',explain:'La distancia es el resultado que se mide; la superficie es la variable independiente.'}:
      subject==='Estudios Sociales'?{type:'choice',prompt:'Dos fuentes describen un mismo hecho de forma distinta. ¿Qué paso es más riguroso?',options:['Comparar autoría, fecha, propósito y evidencias','Elegir la fuente que coincide con mi opinión','Descartar ambas sin analizarlas','Tomar una frase fuera de contexto'],answer:'Comparar autoría, fecha, propósito y evidencias',explain:'La evaluación contextual y el contraste permiten valorar confiabilidad y perspectiva.'}:
      subject==='Programación'?{type:'choice',prompt:'Un ciclo suma los enteros del 1 al 5, incluyendo ambos extremos. ¿Qué total produce?',options:['10','12','15','20'],answer:'15',explain:'1 + 2 + 3 + 4 + 5 = 15. Es importante verificar el límite inclusivo del ciclo.'}:
      {type:'choice',prompt:'Un sensor registra lecturas inestables. ¿Qué estrategia mejora una decisión basada en ellas?',options:['Tomar varias lecturas y definir un umbral','Usar una lectura aislada','Desconectar el actuador sin evaluar','Cambiar varias condiciones simultáneamente'],answer:'Tomar varias lecturas y definir un umbral',explain:'Varias mediciones y un umbral definido reducen decisiones por ruido o una lectura atípica.'};
    const isAdvanced=gradeId==='bg1'||gradeId==='bg2'||gradeId.startsWith('bt')||Number(gradeId)>=7;
    return isAdvanced?[advanced,...base.slice(1)]:base;
  };
  function activityMarkup(subject, topic) {
    const code = subject === 'Programación' ? `<section class="lesson-section live-editor"><h3>Editor de pseudocódigo</h3><p>Escribe asignaciones, operaciones aritméticas, ciclos “para … desde … hasta …” de una línea y mostrar(...). El intérprete solo admite esas instrucciones acotadas.</p><textarea id="liveCode" rows="7" spellcheck="false">total = 0\npara n desde 1 hasta 3:\n  total = total + n\nmostrar(total)</textarea><div class="editor-actions"><button class="primary-button" id="runCode" type="button">Ejecutar pseudocódigo</button><button class="secondary-button" id="checkCode" type="button">Revisar estructura</button></div><pre id="codeOutput" class="code-output" aria-live="polite">Salida: pendiente de ejecutar</pre><div id="codeFeedback" class="lab-result" aria-live="polite">Prueba el ciclo y explica cómo cambia total.</div></section>` : '';
    const circuit = subject === 'Robótica' ? `<section class="lesson-section circuit-lab"><h3>Simulador de circuito de baja tensión</h3><p>Activa fuente, cableado y control para observar cuándo enciende el indicador. Es un modelo conceptual.</p><div class="circuit-controls"><label><input type="checkbox" id="circuitPower"> Fuente</label><label><input type="checkbox" id="circuitWire"> Cableado</label><label><input type="checkbox" id="circuitSwitch"> Interruptor</label><span id="circuitBulb" class="circuit-bulb">●</span></div><div id="circuitFeedback" class="lab-result">El indicador está apagado.</div></section>` : '';
    const science = subject === 'Ciencias Naturales' ? `<section class="lesson-section science-lab"><h3>Mini laboratorio: fricción y movimiento</h3><p>Modelo cualitativo: cambia la superficie y observa cómo afecta la distancia estimada de un objeto con el mismo impulso.</p><label>Superficie <select id="surfaceSelect"><option value="1">Lisa</option><option value="0.7">Cartón</option><option value="0.4">Rugosa</option></select></label><button class="secondary-button" id="runExperiment">Realizar prueba</button><div id="scienceFeedback" class="lab-result">Controla el impulso y cambia la superficie para comparar.</div></section>` : '';
    const social = subject === 'Estudios Sociales' ? `<section class="lesson-section source-lab"><h3>Laboratorio de fuentes</h3><p>Una alcaldía informa que el parque se remodeló en 2022. Una entrevista vecinal dice que el acceso mejoró después de la obra. ¿Qué evidencia sirve para investigar el cambio de acceso?</p><div class="lab-options"><button type="button" data-source-choice="primary">Entrevista fechada con una persona usuaria</button><button type="button" data-source-choice="weak">Un comentario anónimo sin fecha</button><button type="button" data-source-choice="context">Comparar ambas fuentes y buscar registros del proyecto</button></div><div id="sourceFeedback" class="lab-result" aria-live="polite">Valora fecha, autoría, perspectiva y contraste.</div></section>` : '';
    const items = {
      'Matemáticas':['Lee el problema','Identifica datos y pregunta','Elige una estrategia','Calcula','Comprueba el resultado'],
      'Lenguaje':['Lee el texto','Identifica propósito e idea','Localiza evidencia','Explica con tus palabras','Revisa claridad'],
      'Ciencias Naturales':['Formula una pregunta','Propón una hipótesis','Controla variables','Registra datos','Relaciona evidencia y conclusión'],
      'Estudios Sociales':['Plantea una pregunta social','Ubica época y lugar','Contrasta fuentes','Identifica perspectivas','Sustenta una conclusión'],
      'Programación':['Comprende la necesidad','Diseña el algoritmo','Escribe la solución','Prueba casos','Documenta mejoras'],
      'Robótica':['Define necesidad y criterios','Diseña el prototipo','Integra entradas y salidas','Programa una secuencia','Prueba y mejora']
    }[subject] || [];
    const shuffled = [...items].sort((a,b)=>((a.length*7+b.length*3)%11)-5);
    return `<div class="lesson-section"><h3>Actividad de ordenar y relacionar</h3><p>Ordena los pasos para trabajar <b>${escapeHTML(topic)}</b>. Usa las flechas, arrastra los elementos o ambas opciones.</p><ol id="sortActivity" class="sort-activity">${shuffled.map((item,index)=>`<li draggable="true" data-step="${escapeHTML(item)}"><span>${escapeHTML(item)}</span><button type="button" data-shift="-1" aria-label="Subir">↑</button><button type="button" data-shift="1" aria-label="Bajar">↓</button></li>`).join('')}</ol><button class="secondary-button" id="checkOrder">Comprobar orden</button><div id="sortFeedback" class="lab-result" aria-live="polite">Cada disciplina organiza la investigación y solución en pasos verificables.</div></div>${code}${circuit}${science}${social}<section class="lesson-section quiz-card"><div class="quiz-head"><div><span class="eyebrow">PRÁCTICA ADAPTATIVA</span><h3>Comprueba lo aprendido</h3></div><div class="quiz-clock"><b id="quizTimer">25</b><small>seg / pregunta</small></div></div><div class="quiz-metrics"><span>⭐ <b id="quizXP">0</b> XP</span><span>🔥 Racha <b id="quizStreak">0</b></span><span>Pregunta <b id="quizProgress">1 / 4</b></span></div><div id="quizQuestion" class="quiz-question"></div><div id="quizFeedback" class="quiz-feedback" aria-live="polite"></div><button id="quizAction" class="primary-button" type="button">Revisar respuesta</button></section>`;
  }
  function mountQuiz(section, subject, topic, gradeId) {
    const bank = pickBank(subject,gradeId);
    let index=0, correct=0, streak=0, bestStreak=0, xp=0, started=Date.now(), remaining=25, timer=null, locked=false;
    const answers=[];
    const qNode=section.querySelector('#quizQuestion'), feedback=section.querySelector('#quizFeedback'), action=section.querySelector('#quizAction');
    const timerNode=section.querySelector('#quizTimer');
    const render=()=>{
      locked=false; remaining=25; feedback.className='quiz-feedback';feedback.textContent='';
      section.querySelector('#quizProgress').textContent=`${Math.min(index+1,bank.length)} / ${bank.length}`;
      if(index>=bank.length){finish();return}
      const q=bank[index];
      const answerUI=q.type==='choice'?`<div class="quiz-options">${q.options.map((o,i)=>`<label><input type="radio" name="quizAnswer" value="${escapeHTML(o)}"><span>${escapeHTML(o)}</span></label>`).join('')}</div>`:q.type==='boolean'?`<div class="quiz-options"><label><input type="radio" name="quizAnswer" value="verdadero"><span>Verdadero</span></label><label><input type="radio" name="quizAnswer" value="falso"><span>Falso</span></label></div>`:`<label class="quiz-short">${q.type==='fill'?'Completa la idea':'Escribe tu respuesta'}<input id="quizText" type="text" autocomplete="off" placeholder="Tu respuesta"></label>`;
      qNode.innerHTML=`<div class="quiz-type">${({choice:'OPCIÓN MÚLTIPLE',boolean:'VERDADERO O FALSO',fill:'COMPLETAR',short:'RESPUESTA CORTA'})[q.type]}</div><h4>${escapeHTML(q.prompt)}</h4>${answerUI}`;
      section.querySelector('#quizXP').textContent=xp; section.querySelector('#quizStreak').textContent=streak;
      action.textContent='Revisar respuesta';action.disabled=false;
      clearInterval(timer);timer=setInterval(()=>{remaining--;timerNode.textContent=remaining;if(remaining<=0){clearInterval(timer);answerQuestion(true)}},1000);timerNode.textContent=remaining;
    };
    const readAnswer=()=>{const checked=qNode.querySelector('[name="quizAnswer"]:checked');return checked?.value ?? qNode.querySelector('#quizText')?.value.trim() ?? ''};
    const gradeAnswer=(q,answer)=>{
      if(!answer)return false;
      if(q.type==='short')return q.keywords.some(k=>answer.toLocaleLowerCase('es').includes(k));
      const acceptable=Array.isArray(q.answer)?q.answer:q.answer.split('|');
      return acceptable.some(v=>String(v).trim().toLocaleLowerCase('es')===String(answer).trim().toLocaleLowerCase('es'));
    };
    const answerQuestion=(timeout=false)=>{
      if(locked||index>=bank.length)return;
      const q=bank[index], answer=timeout?'':readAnswer();
      if(!timeout&&!answer){feedback.className='quiz-feedback try-again';feedback.textContent='Selecciona o escribe una respuesta antes de continuar.';return}
      locked=true;const ok=gradeAnswer(q,answer);answers.push({question:q.prompt,answer,correct:ok,seconds:25-remaining});
      if(ok){correct++;streak++;bestStreak=Math.max(bestStreak,streak);xp+=20+(remaining>=15?5:0)}else{streak=0}
      section.querySelector('#quizXP').textContent=xp;section.querySelector('#quizStreak').textContent=streak;
      feedback.className=`quiz-feedback ${ok?'success':'try-again'}`;feedback.innerHTML=`<b>${timeout?'Tiempo agotado.':ok?'¡Correcto!':'Aún puedes aprender de este intento.'}</b><p>${escapeHTML(q.explain)}</p>`;
      action.textContent=index===bank.length-1?'Ver resultado':'Siguiente pregunta';action.disabled=false;clearInterval(timer);
      action.onclick=()=>{index++;render()};
    };
    const finish=async()=>{
      clearInterval(timer);const score=Math.round(correct/bank.length*100);const totalXP=xp+(score===100?30:0);
      section.querySelector('#quizProgress').textContent=`${bank.length} / ${bank.length}`;
      qNode.innerHTML=`<div class="quiz-finish"><span>${score===100?'🏆':score>=60?'🌟':'🧭'}</span><h4>${score>=60?'¡Buen trabajo!':'Sigue practicando'}</h4><p>Resultado: <b>${correct} de ${bank.length}</b> (${score}%).</p><p>Ganaste <b>${totalXP} XP</b> y tu mejor racha fue <b>${bestStreak}</b>.</p><small>La puntuación es formativa. Revisa las explicaciones y vuelve a intentar.</small></div>`;
      section.querySelector('#quizXP').textContent=totalXP;section.querySelector('#quizStreak').textContent=bestStreak;timerNode.textContent='✓';feedback.className='quiz-feedback';feedback.textContent='';action.hidden=true;
      try{const saved=await saveAttempt({gradeId,subject:subject==='Programación'?'Programación y desarrollo de software':subject,topicTitle:topic,score,correctCount:correct,questionCount:bank.length,xp:totalXP,bestStreak,durationSeconds:Math.round((Date.now()-started)/1000),answers});feedback.className='quiz-feedback success';feedback.textContent=`Resultado guardado · ${saved.xpTotal} XP acumulados${saved.newBadges?.length?` · Insignia: ${saved.newBadges.join(', ')}`:''}.`;document.dispatchEvent(new CustomEvent('eduplay:quiz-saved'))}
      catch(error){feedback.className='quiz-feedback try-again';feedback.textContent=`Resultado calculado, pero no se pudo guardar: ${error.message}`}
    };
    action.onclick=()=>locked?null:answerQuestion(false);
    render();
  }
  function mountSort(section) {
    const list=section.querySelector('#sortActivity'), feedback=section.querySelector('#sortFeedback');let dragged=null;
    list.querySelectorAll('li').forEach(item=>{
      item.addEventListener('dragstart',()=>{dragged=item;item.classList.add('dragging')});
      item.addEventListener('dragend',()=>item.classList.remove('dragging'));
      item.addEventListener('dragover',event=>event.preventDefault());
      item.addEventListener('drop',event=>{event.preventDefault();if(dragged&&dragged!==item)list.insertBefore(dragged,item);});
      item.querySelectorAll('[data-shift]').forEach(button=>button.onclick=()=>{const next=button.dataset.shift==='-1'?item.previousElementSibling:item.nextElementSibling;if(!next)return;if(button.dataset.shift==='-1')list.insertBefore(item,next);else list.insertBefore(next,item)});
    });
    section.querySelector('#checkOrder').onclick=()=>{const actual=[...list.children].map(x=>x.dataset.step),expected=[...actual].sort((a,b)=>{
      const source={
        'Matemáticas':['Lee el problema','Identifica datos y pregunta','Elige una estrategia','Calcula','Comprueba el resultado'],
        'Lenguaje':['Lee el texto','Identifica propósito e idea','Localiza evidencia','Explica con tus palabras','Revisa claridad'],
        'Ciencias Naturales':['Formula una pregunta','Propón una hipótesis','Controla variables','Registra datos','Relaciona evidencia y conclusión'],
        'Estudios Sociales':['Plantea una pregunta social','Ubica época y lugar','Contrasta fuentes','Identifica perspectivas','Sustenta una conclusión'],
        'Programación':['Comprende la necesidad','Diseña el algoritmo','Escribe la solución','Prueba casos','Documenta mejoras'],
        'Robótica':['Define necesidad y criterios','Diseña el prototipo','Integra entradas y salidas','Programa una secuencia','Prueba y mejora']
      }[section.dataset.subject]||[];return source.indexOf(a)-source.indexOf(b)});
      const ok=actual.every((v,i)=>v===expected[i]);feedback.className=`lab-result ${ok?'success':'try-again'}`;feedback.textContent=ok?'¡Secuencia correcta! Explica por qué el orden ayuda a obtener evidencia confiable.':'Revisa la secuencia. Usa las flechas o arrastra cada paso y vuelve a comprobar.';
    };
  }
  function mountTools(section) {
    section.querySelector('#checkCode')?.addEventListener('click',()=>{const code=section.querySelector('#liveCode').value.toLocaleLowerCase('es'),hasAssignment=/\w+\s*=/.test(code),hasOutput=/mostrar\s*\(|print\s*\(/.test(code),fb=section.querySelector('#codeFeedback');const ok=hasAssignment&&hasOutput;fb.className=`lab-result ${ok?'success':'try-again'}`;fb.textContent=ok?'La práctica tiene asignación y salida. Prueba valores distintos y documenta qué esperas que ocurra.':'Incluye una asignación como total = 0 y una salida como mostrar(total).'});
    section.querySelector('#runCode')?.addEventListener('click',()=>{const output=section.querySelector('#codeOutput'),fb=section.querySelector('#codeFeedback');try{const result=runPseudocode(section.querySelector('#liveCode').value);output.textContent=`Salida: ${result.output.join(', ')||'(sin salida)'}\nVariables: ${Object.entries(result.vars).map(([k,v])=>`${k}=${v}`).join(', ')}`;fb.className='lab-result success';fb.textContent='Ejecución completada con las instrucciones permitidas. Analiza el resultado y prueba otros datos.'}catch(error){output.textContent='Ejecución detenida';fb.className='lab-result try-again';fb.textContent=error.message}});
    const updateCircuit=()=>{const on=['circuitPower','circuitWire','circuitSwitch'].every(id=>section.querySelector(`#${id}`).checked);section.querySelector('#circuitBulb').classList.toggle('on',on);section.querySelector('#circuitFeedback').className=`lab-result ${on?'success':''}`;section.querySelector('#circuitFeedback').textContent=on?'Circuito cerrado: el indicador se enciende. Si falta un componente, el circuito queda abierto.':'Circuito abierto: revisa fuente, cableado e interruptor.'};section.querySelectorAll('.circuit-controls input').forEach(input=>input.addEventListener('change',updateCircuit));
    section.querySelector('#runExperiment')?.addEventListener('click',()=>{const friction=Number(section.querySelector('#surfaceSelect').value),distance=(10*friction).toFixed(1),fb=section.querySelector('#scienceFeedback');fb.className='lab-result success';fb.textContent=`Modelo cualitativo: distancia estimada ${distance} unidades. Mantén el impulso constante y repite cada prueba para comparar.`});
  }
  function runPseudocode(source) {
    if(source.length>4000)throw new Error('Límite: el texto no puede superar 4,000 caracteres.');
    const lines=source.split(/\r?\n/);if(lines.length>60)throw new Error('Límite: usa hasta 60 líneas.');
    const vars=Object.create(null),output=[];
    const expression=(text)=>{
      const tokens=text.match(/[A-Za-z_]\w*|\d+(?:\.\d+)?|[()+\-*/%]/g)||[];
      if(tokens.join('')!==text.replace(/\s+/g,''))throw new Error('Expresión no permitida. Usa números, variables y + - * / % con paréntesis.');
      let pos=0;
      const factor=()=>{const t=tokens[pos++];if(t==='-')return -factor();if(t==='+')return factor();if(t==='('){const v=sum();if(tokens[pos++]!==')')throw new Error('Falta cerrar un paréntesis.');return v}if(/^\d/.test(t||''))return Number(t);if(t&&/^[A-Za-z_]/.test(t)){if(!(t in vars))throw new Error(`La variable “${t}” no tiene valor.`);return vars[t]}throw new Error('Expresión incompleta.')};
      const product=()=>{let v=factor();while(['*','/','%'].includes(tokens[pos])){const op=tokens[pos++],r=factor();if((op==='/'||op==='%')&&r===0)throw new Error('No se puede dividir entre cero.');v=op==='*'?v*r:op==='/'?v/r:v%r}return v};
      const sum=()=>{let v=product();while(tokens[pos]==='+'||tokens[pos]==='-'){const op=tokens[pos++],r=product();v=op==='+'?v+r:v-r}return v};
      const value=sum();if(pos!==tokens.length||!Number.isFinite(value))throw new Error('La expresión tiene un operador o resultado inválido.');return value;
    };
    const execute=(line)=>{let m=line.trim().match(/^(?:mostrar|print)\s*\((.*)\)$/i);if(m){output.push(String(expression(m[1])));return}m=line.trim().match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/);if(m){vars[m[1]]=expression(m[2]);return}if(/^(inicio|fin|#.*)?$/i.test(line.trim()))return;throw new Error(`Instrucción no admitida: “${line.trim()}”. Usa asignación, mostrar(...) o un ciclo permitido.`)};
    let iterations=0;
    for(let i=0;i<lines.length;i++){
      const line=lines[i],loop=line.trim().match(/^para\s+([A-Za-z_]\w*)\s+desde\s+(-?\d+)\s+hasta\s+(-?\d+)\s*:?$/i);
      if(loop){const body=lines[++i];if(!body||!body.trim())throw new Error('El ciclo necesita una instrucción indentada en la línea siguiente.');const start=Number(loop[2]),end=Number(loop[3]),step=start<=end?1:-1;if(Math.abs(end-start)>49)throw new Error('Límite: el ciclo puede repetir hasta 50 veces.');for(let n=start;step>0?n<=end:n>=end;n+=step){if(++iterations>200)throw new Error('Se alcanzó el límite de pasos.');vars[loop[1]]=n;execute(body)}continue}
      if(!line.trim())continue;if(++iterations>200)throw new Error('Se alcanzó el límite de pasos.');execute(line);
    }
    return{vars,output};
  }
  function mountLesson(contentNode) {
    if(!contentNode||contentNode.dataset.activityMounted==='true')return;
    const eyebrow=contentNode.querySelector('.eyebrow'),topic=contentNode.querySelector('h2')?.textContent?.trim();
    if(!eyebrow||!topic||!contentNode.querySelector('.record-form,.teacher-tip'))return;
    const labels=eyebrow.textContent.split('·').map(x=>x.trim());const subjectLabel=labels[0];
    const subjectMap={'MATEMÁTICAS':'Matemáticas','LENGUAJE':'Lenguaje','CIENCIAS NATURALES':'Ciencias Naturales','ESTUDIOS SOCIALES':'Estudios Sociales','PROGRAMACIÓN Y DESARROLLO DE SOFTWARE':'Programación','ROBÓTICA':'Robótica'};
    const subject=subjectMap[subjectLabel.toLocaleUpperCase('es')];if(!subject)return;
    const grade=gradeIds.find(id=>{const label=typeof level==='function'?level(id).label:'';return label&&labels[1]?.toLocaleUpperCase('es')===label.toLocaleUpperCase('es')});
    const gradeId=grade||'4';
    contentNode.dataset.activityMounted='true';contentNode.dataset.subject=subject;
    if(subject==='Ciencias Naturales'||subject==='Estudios Sociales'){
      const basic=['4','5','6'].includes(gradeId);
      const text=subject==='Ciencias Naturales'?{
        prereq:basic?'Observación, comparación y registro sencillo de lo que ocurre en el entorno.':'Lectura de datos, control de variables y explicación de relaciones entre evidencia y modelo.',
        explanation:basic?`Piensa como detective del entorno: observa ${topic}, plantea qué podría ocurrir y cambia una sola condición. Dibuja o registra el resultado antes de explicar qué aprendiste.`:`Analiza ${topic} como un sistema de variables. Define una pregunta, formula una hipótesis verificable, controla condiciones, registra observaciones y evalúa si los datos apoyan la explicación. Distingue correlación, causalidad y limitaciones del modelo.`,
        example:basic?'Ejemplo guiado: coloca dos objetos iguales sobre superficies distintas. Mantén el mismo impulso, mide cuánto avanzan y compara. La superficie es la variable que investigas; el recorrido es el resultado.':'Caso guiado: plantea una hipótesis, define variable independiente, dependiente y controles, registra unidades y repeticiones, representa los resultados y señala fuentes de error antes de concluir.',
        activity:'Completa el mini laboratorio, anota una predicción y compara resultados. En el cuaderno registra pregunta, materiales, procedimiento, evidencia y conclusión; evita presentar el modelo como una medición real.',
        materials:'Cuaderno o bitácora, regla o cronómetro si se realiza presencialmente; el simulador es un modelo cualitativo y no sustituye datos experimentales reales.',
        question:'¿Qué variable cambiaste, cuáles mantuviste constantes y qué evidencia respalda tu explicación?'
      }:{
        prereq:basic?'Identificar comunidad, territorio, normas y diferentes experiencias de las personas.':'Contextualizar fuentes, reconocer perspectiva y contrastar evidencia histórica o social.',
        explanation:basic?`Investiga ${topic} como una historia del lugar donde vivimos. Ubica personas, espacio y tiempo; compara testimonios, mapas o datos y observa que una misma situación puede vivirse desde perspectivas diferentes.`:`Analiza ${topic} mediante fuentes situadas en su contexto. Compara autoría, fecha, propósito y evidencia; identifica continuidades, cambios, actores e intereses, y sustenta una interpretación que reconozca límites y perspectivas.`,
        example:basic?'Ejemplo guiado: compara un mapa antiguo con uno actual de la comunidad. Registra qué cambió, qué permaneció y qué fuente permite sostener cada observación.':'Caso guiado: contrasta dos fuentes sobre un proceso salvadoreño, registra coincidencias y discrepancias, identifica perspectiva e integra evidencia con una conclusión razonada.',
        activity:'Organiza una investigación breve: formula una pregunta, selecciona dos fuentes, ubica su contexto, registra evidencias y prepara una conclusión para compartir con el grupo.',
        materials:'Mapas, testimonios, fotografías, textos o datos de fuentes identificables; ficha para autoría, fecha, procedencia, propósito y evidencia.',
        question:'¿Qué perspectiva representa cada fuente y qué evidencia permite comparar sus afirmaciones?'
      };
      const purpose=contentNode.querySelector('.view-subtitle');
      if(purpose)purpose.innerHTML=`<b>Propósito:</b> ${escapeHTML(subject==='Ciencias Naturales'?`Investigar ${topic} mediante observación, evidencia y explicación.`:`Analizar ${topic} en su contexto y sustentar interpretaciones con fuentes.`)}`;
      for(const [heading,value] of Object.entries(text)){
        const section=[...contentNode.querySelectorAll('.lesson-section')].find(node=>node.querySelector('h3')?.textContent.toLocaleLowerCase('es').includes(({prereq:'antes de comenzar',explanation:'explicación para la clase',example:'ejemplo guiado',activity:'actividad de aprendizaje',materials:'materiales',question:'pregunta para pensar'})[heading]));
        const target=section?.querySelector('p');if(target)target.textContent=value;
      }
    }
    contentNode.insertAdjacentHTML('beforeend',activityMarkup(subject,topic));
    const module=contentNode.querySelector('.quiz-card');module.dataset.subject=subject;
    const sortSection=contentNode.querySelector('#sortActivity')?.closest('.lesson-section');if(sortSection)sortSection.dataset.subject=subject;
    mountSort(sortSection);
    if(subject==='Ciencias Naturales'||subject==='Estudios Sociales')contentNode.querySelector('.interactive-lab')?.remove();
    contentNode.querySelectorAll('[data-source-choice]').forEach(button=>button.addEventListener('click',()=>{const good=button.dataset.sourceChoice==='context';const target=contentNode.querySelector('#sourceFeedback');target.className=`lab-result ${good?'success':'try-again'}`;target.textContent=good?'Buen criterio: contrastar testimonios y registros, revisando fecha y contexto, permite construir una explicación más sólida.':'Esa evidencia aislada tiene límites. Revisa autoría, fecha y si puedes contrastarla con otra fuente.'}));
    mountTools(contentNode);
    if(currentUser?.role==='student')mountQuiz(module,subject,topic,gradeId);
    else {module.innerHTML='<h3>Vista docente</h3><p>Asigna una evaluación desde Mis clases y usa estos criterios para retroalimentar: comprensión, evidencia, procedimiento y explicación.</p>';}
  }

  const lessonNode=document.getElementById('lessonContent');
  if(lessonNode)new MutationObserver(()=>mountLesson(lessonNode)).observe(lessonNode,{childList:true,subtree:true});

  function mountStudentHistory(panel) {
    if(panel.dataset.quizHistory==='true'&&panel.querySelector('.quiz-history'))return;panel.dataset.quizHistory='true';
    fetch(`/api/progress?token=${encodeURIComponent(token())}`).then(r=>r.ok?r.json():null).then(data=>{
      if(!data||!data.quizzes?.length)return;
      const rows=data.quizzes.map(q=>`<div class="progress-row"><b>${escapeHTML(q.topic_title)} · ${q.score}%</b><small>${escapeHTML(q.subject)} · ${q.correct_count}/${q.question_count} correctas · ${q.xp} XP · racha ${q.best_streak} · ${escapeHTML(q.created)}</small></div>`).join('');
      const badges=(data.badges||[]).map(b=>`<span class="reward-badge">🏅 ${escapeHTML(b.label)}</span>`).join('');
      panel.insertAdjacentHTML('beforeend',`<section class="quiz-history"><h3>Historial de evaluaciones</h3><p class="data-note"><b>${data.xpTotal||0} XP</b> acumulados · ${data.badges?.length||0} insignias</p><div class="reward-badges">${badges}</div><div class="progress-list">${rows}</div></section>`);
    }).catch(()=>{panel.dataset.quizHistory='false'});
  }
  const progressNode=document.getElementById('progressPanel');
  if(progressNode)new MutationObserver(()=>{if(localStorage.getItem('eduplayToken'))mountStudentHistory(progressNode)}).observe(progressNode,{childList:true,subtree:true});

  async function mountTeacherInsights(panel) {
    if(!panel||panel.dataset.quizInsights==='loading'||(panel.dataset.quizInsights==='loaded'&&panel.querySelector('.quiz-insights'))||!selectedClassId)return;
    panel.dataset.quizInsights='loading';
    try{
      const response=await fetch(`/api/class?id=${encodeURIComponent(selectedClassId)}&token=${encodeURIComponent(token())}`);if(!response.ok){panel.dataset.quizInsights='';return}
      const data=await response.json();if(!data.teacher){panel.dataset.quizInsights='loaded';return}
      const attempts=data.quizAttempts||[];const avg=attempts.length?Math.round(attempts.reduce((sum,x)=>sum+Number(x.score),0)/attempts.length):0;
      const weak=[...new Set(attempts.filter(x=>Number(x.score)<70).map(x=>x.topic_title))];
      panel.insertAdjacentHTML('beforeend',`<section class="quiz-insights"><div class="eyebrow">SEGUIMIENTO FORMATIVO</div><h3>Resultados de quizzes del grupo</h3><div class="quiz-insight-metrics"><span><b>${attempts.length}</b> intentos</span><span><b>${attempts.length?`${avg}%`:'—'}</b> promedio</span><span><b>${weak.length}</b> temas para reforzar</span></div>${attempts.length?`<div class="records-table-wrap"><table class="records-table"><thead><tr><th>ESTUDIANTE</th><th>EVALUACIÓN</th><th>RESULTADO</th><th>XP / RACHA</th><th>FECHA</th></tr></thead><tbody>${attempts.map(q=>`<tr><td>${escapeHTML(q.student_name)}</td><td>${escapeHTML(q.topic_title)}<small>${escapeHTML(q.subject)}</small></td><td><span class="grade-value">${q.score}% (${q.correct_count}/${q.question_count})</span></td><td>${q.xp} XP · ${q.best_streak}</td><td>${escapeHTML(q.created)}</td></tr>`).join('')}</tbody></table></div>`:'<p class="empty-state">Aún no hay resultados de quizzes de los estudiantes de este grupo.</p>'}${weak.length?`<p class="data-note"><b>Temas con resultado menor a 70%:</b> ${weak.map(escapeHTML).join(' · ')}</p>`:''}</section>`);panel.dataset.quizInsights='loaded';
    }catch{panel.dataset.quizInsights=''}
  }
  const classNode=document.getElementById('classDetail');
  if(classNode)new MutationObserver(()=>{if(classNode.querySelector('.class-detail-heading'))mountTeacherInsights(classNode)}).observe(classNode,{childList:true,subtree:true});
})();
