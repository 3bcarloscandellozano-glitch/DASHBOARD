# El dialecto tesalio en Dodona — Dashboard de datos

Aplicación monográfica de visualización de datos lingüísticos elaborada como
material complementario de una tesis sobre el **dialecto tesalio** en el corpus
oracular de Dodona (ss. V–II a.C.).

---

## Contexto académico y conexión con la tesis

La tesis estudia las inscripciones en dialecto tesalio conservadas en el
**santuario oracular de Dodona** (Epiro, Grecia), uno de los centros religiosos
más importantes del mundo griego antiguo. Los consultantes depositaban sus
preguntas escritas en laminillas de plomo (*chrēstēria*); el conjunto de estas
laminillas constituye el mayor archivo epigráfico oracular conservado de la
antigüedad.

El dialecto tesalio pertenece al griego septentrional (rama eolia) y presenta
rasgos fonológicos y morfológicos propios que lo distinguen del ático, el dórico
y los demás dialectos griegos. El hallazgo de inscripciones tesalias en Dodona
plantea preguntas de interés dialectológico y cultural: ¿qué comunidades de
Tesalia consultaban el oráculo?, ¿en qué periodos?, ¿qué rasgos dialectales se
conservan cuando el tesalio entra en contacto con el entorno epirota y la
koiné emergente?

Este dashboard **traduce en visualizaciones interactivas** los resultados del
vaciado y análisis del corpus que fundamenta la tesis.

---

## Origen de los datos

### Fuente primaria: corpus DVC

> Dakaris, S.; Vokotopoulou, I.; Christidis, A.-Ph. (2013).
> *Τα χρηστήρια ελάσματα της Δωδώνης των ανασκαφών Κ. Καραπάνου (1875) και
> Δ. Ευαγγελίδη (1929-1959)*, 2 vols. Atenas: Ταμείο Αρχαιολογικών Πόρων.

El DVC («Dakaris–Vokotopoulou–Christidis») edita **4.438 laminillas** del
santuario. Es la edición de referencia para el corpus de Dodona. Cada pieza
se cita como *I. Dodone* DVC *NNN* (p. ej., *I. Dodone* DVC 31A).

### Fuente secundaria: Lhôte

> Lhôte, É. (2006). *Les lamelles oraculaires de Dodone*. Ginebra: Droz.

Édición independiente de una selección del mismo corpus, con diferentes
criterios de lectura y numeración. Se cita como *I. Dodone* Lhôte *NNN*
(p. ej., *I. Dodone* Lhôte 8B).

### Elaboración propia

La **clasificación dialectal de las 4.438 inscripciones** y la selección de
las 81 (75 únicas) adscribibles al tesalio son resultado del análisis propio
de la autora/autor de la tesis. Los criterios de clasificación se detallan en
el cuerpo de la tesis.

### Referencia para el sistema vocálico

> Scarborough, M. (2014). «The Thessalian dialect in the light of comparative
> linguistics». En *Encyclopedia of Ancient Greek Language and Linguistics*,
> vol. III, págs. 1535–1541. Leiden: Brill.

La tabla de notación vocálica (alfabeto arcaico / reformado / ático post-403)
y la categorización de las tres teorías interpretativas siguen directamente
este trabajo.

---

## Qué visualiza el dashboard

El dashboard se divide en tres pestañas que cubren los tres ejes analíticos
principales de la tesis:

### 1 · Mapa y regiones (`Mapa / Regiones`)

Muestra la distribución geográfica de las inscripciones tesalias sobre un
mapa SVG esquemático de Tesalia dividido en sus cuatro **tétradas** históricas
(Pelasgiótide, Histiótide, Tesaliótide, Ftiótide).

| Visualización | Qué responde |
|---|---|
| Mapa interactivo | ¿De qué región procede cada grupo de consultantes? |
| Gráfico de sectores (regiones) | Distribución proporcional de las 81 inscripciones |
| Gráfico de barras (dialectos) | Peso relativo del tesalio frente a los demás dialectos del corpus (dórico, jónico-ático, koiné, beocio, etc.) |

La mayor parte de los consultantes tesalios (57/81) no puede adscribirse a
una región concreta; los datos regionales identificados apuntan al predominio
de la Pelasgiótide (cuenca de Larisa) y la Histiótide (Trikala).

### 2 · Perfil dialectal (`Perfil dialectal`)

Recoge los datos cuantitativos que perfilan el grupo de inscripciones tesalias
como conjunto:

| Visualización | Qué responde |
|---|---|
| Grado de certeza (gráfico de sectores) | ¿Con qué seguridad se atribuye cada inscripción al tesalio? (seguro 54 / dudoso 25 / solo nombre 2) |
| Distribución cronológica (barras) | ¿En qué periodos se concentran las visitas al oráculo? (pico en el s. V, continuidad en el IV, presencia residual en el III–II) |
| Temática de las consultas (barras + radar) | ¿Sobre qué consultaban los tesalios? (religión, familia/amor, dinero, salud, comercio, viaje) |
| Alfabeto | Proporción de inscripciones en alfabeto reformado/milesio frente a escritura epicórica local |

La concentración temporal en los ss. V–IV conecta con la etapa de mayor
actividad del santuario y con el periodo previo a la extensión de la koiné,
lo que hace especialmente relevante el análisis dialectal de este corpus.

### 3 · Vocalismo (`Vocalismo`)

Es la pestaña de análisis lingüístico central. El rasgo más diagnóstico del
dialecto tesalio —y el más debatido en la bibliografía— es la notación de las
**vocales medias largas** heredadas (*ē*, *ō*) en el alfabeto reformado
(adoptado ca. 400 a.C.).

El dialecto tesalio usa los dígrafos ⟨ΕΙ⟩ y ⟨ΟΥ⟩ donde el ático emplea ⟨Η⟩
y ⟨Ω⟩. El corpus de Dodona permite examinar si esta norma se mantiene cuando
los consultantes tesalios escriben fuera de su región y en un contexto de
contacto dialectal intenso.

| Visualización | Qué responde |
|---|---|
| Estadísticos + gráfico de sectores | ¿Qué proporción de inscripciones sigue la notación tesalia canónica? ¿Cuántas muestran vacilación o norma ática? |
| Tabla de 19 inscripciones | Catálogo detallado con referencia, fecha, región de procedencia y forma(s) destacadas |
| Tabla de notación vocálica | Sistema de correspondencias entre fuente etimológica y grafía en cada alfabeto (según Scarborough 2014) |
| Teorías | Presentación y evaluación de las tres hipótesis principales sobre el vocalismo tesalio (Bechtel/Buck, Bartoněk, Scarborough) |
| Conclusiones | Síntesis de los resultados del corpus de Dodona en relación con la epigrafía tesalia continental |

**Resultado principal**: de las 19 inscripciones con grafías vocálicas
identificables, 6 respetan la norma tesalia (⟨ΕΙ⟩/⟨ΟΥ⟩ exclusivamente),
9 mezclan las dos convenciones (vacilación ortográfica tras la reforma
alfabética), y solo 4 emplean exclusivamente la norma ática/koiné — y de
estas, únicamente *I. Dodone* DVC 992A lo hace de forma consistente, y con
reservas. El corpus de Dodona **no introduce anomalías** respecto a la
epigrafía tesalia conocida y confirma la norma canónica del dialecto.

---

## Notas para evaluadores

- **Los datos son el análisis.** No existe una base de datos ni un API: todos
  los valores incrustados en el código (`App.jsx`) son el resultado directo del
  vaciado y clasificación manual del corpus DVC.
- **La referencia bibliográfica de cada inscripción** sigue el formato
  epigráfico estándar: *I. Dodone* [fuente] [número] (con el prefijo
  *I. Dodone* conforme a la convención de *Inscriptiones Graecae*).
- **La aplicación no requiere instalación**: está diseñada para integrarse en
  cualquier entorno React. No se distribuyen datos adicionales externos al
  propio archivo `App.jsx`.
- **El idioma principal es el español**. Los rótulos ingleses que aparecen en
  algunos tooltips y en los datos de región son campos auxiliares para
  compatibilidad técnica (`en`).

---

## Estructura del repositorio

```
App.jsx     Aplicación completa (React, Recharts, estilos en línea)
README.md   Este archivo
CLAUDE.md   Guía técnica para asistentes de IA (no relevante para la evaluación)
```
