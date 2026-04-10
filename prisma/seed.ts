import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import path from "path";

import * as dotenv from "dotenv";
dotenv.config();

function getLibsqlUrl(dbUrl: string): string {
  if (dbUrl.startsWith("file:./") || (dbUrl.startsWith("file:") && !dbUrl.startsWith("file:/"))) {
    const relative = dbUrl.replace("file:", "");
    return "file:" + path.resolve(process.cwd(), relative);
  }
  return dbUrl;
}

const rawUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const url = getLibsqlUrl(rawUrl);
const adapter = new PrismaLibSql({ url });
const prisma = new PrismaClient({ adapter });

const lessonContents: Record<string, string> = {
  "intro-ia": `<h2>¿Qué es el Emprendimiento con IA?</h2>
<p>El emprendimiento con inteligencia artificial representa una nueva frontera donde la tecnología y los negocios se fusionan para crear oportunidades sin precedentes. En esta lección, exploraremos cómo la IA está transformando el ecosistema emprendedor y por qué es el momento ideal para aprovechar estas herramientas.</p>
<p>La inteligencia artificial ya no es exclusiva de grandes corporaciones. Hoy en día, emprendedores individuales pueden acceder a herramientas de IA que antes requerían equipos completos de ingenieros y millones de dólares en inversión.</p>
<h3>¿Por qué emprender con IA ahora?</h3>
<ul>
  <li><strong>Democratización del acceso:</strong> Herramientas como ChatGPT, Claude, Gemini y Copilot están disponibles para todos</li>
  <li><strong>Reducción de costos:</strong> La IA puede reemplazar o amplificar el trabajo de múltiples empleados</li>
  <li><strong>Velocidad de iteración:</strong> Puedes crear prototipos y probar ideas en horas, no semanas</li>
  <li><strong>Ventaja competitiva:</strong> Los early adopters tienen una enorme ventaja sobre quienes adoptan tarde</li>
</ul>
<h3>El Nuevo Ecosistema Emprendedor</h3>
<p>El emprendedor moderno que integra IA en su negocio puede operar con la eficiencia de una empresa 10 veces más grande. Esto crea lo que llamamos "solopreneur de alto impacto": una persona con capacidad de construir y escalar negocios que antes requerían equipos enteros.</p>
<pre><code class="language-javascript">// Ejemplo: Un emprendedor usando IA para generar contenido
const openai = require('openai');

async function generarContenidoMarketing(producto, audiencia) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: "Crea marketing para " + producto }]
  });
  return response.choices[0].message.content;
}
</code></pre>
<blockquote><p>"La IA no va a reemplazar a los emprendedores, pero los emprendedores que usen IA van a reemplazar a los que no la usen."</p></blockquote>`,

  "mindset": `<h2>Mindset Emprendedor en la Era Digital</h2>
<p>El éxito en el emprendimiento no depende únicamente de tener la mejor tecnología o la idea más innovadora. El factor diferenciador más importante es el mindset: la forma en que piensas sobre los desafíos, los fracasos y las oportunidades.</p>
<p>En la era digital con IA, el mindset emprendedor requiere una nueva dimensión: la capacidad de colaborar con la inteligencia artificial como un socio de trabajo, no como una amenaza.</p>
<h3>Los 5 Pilares del Mindset Emprendedor Digital</h3>
<ol>
  <li><strong>Aprendizaje continuo:</strong> La tecnología evoluciona rápidamente. Los mejores emprendedores son aprendices perpetuos.</li>
  <li><strong>Tolerancia a la ambigüedad:</strong> No siempre tendrás toda la información que necesitas.</li>
  <li><strong>Experimentación rápida:</strong> Lanza antes de estar listo. El mercado es el mejor maestro.</li>
  <li><strong>Resiliencia ante el fracaso:</strong> Los fracasos son datos valiosos, no el fin del camino.</li>
  <li><strong>Pensamiento en sistemas:</strong> Ve más allá de los problemas individuales.</li>
</ol>
<h3>Superando el Síndrome del Impostor</h3>
<p>Uno de los mayores obstáculos para los emprendedores es el síndrome del impostor: la sensación de que no eres suficientemente bueno o que no mereces el éxito.</p>
<ul>
  <li>Documenta tus logros y revisítalos regularmente</li>
  <li>Busca mentores y comunidades de apoyo</li>
  <li>Recuerda que todos empiezan desde cero</li>
  <li>Celebra los pequeños progresos</li>
</ul>
<blockquote><p>"No tienes que ser perfecto para empezar, pero tienes que empezar para poder ser perfecto."</p></blockquote>`,

  "rol-ia": `<h2>El Rol de la IA en los Negocios Modernos</h2>
<p>La inteligencia artificial está redefiniendo cómo operan los negocios en todos los sectores. Desde startups hasta grandes corporaciones, la IA está siendo adoptada para mejorar eficiencia, reducir costos y crear nuevas propuestas de valor.</p>
<h3>Áreas de Aplicación de IA en Negocios</h3>
<ul>
  <li><strong>Marketing y Ventas:</strong> Personalización de mensajes, análisis predictivo, chatbots de ventas</li>
  <li><strong>Operaciones:</strong> Automatización de procesos repetitivos, optimización de inventario</li>
  <li><strong>Atención al Cliente:</strong> Chatbots 24/7, análisis de sentimientos, resolución automática</li>
  <li><strong>Finanzas:</strong> Detección de fraude, análisis de riesgo, automatización contable</li>
  <li><strong>RRHH:</strong> Screening de candidatos, análisis de retención, personalización de onboarding</li>
</ul>
<h3>Herramientas de IA Esenciales para Emprendedores</h3>
<table>
  <thead><tr><th>Herramienta</th><th>Uso</th><th>Precio</th></tr></thead>
  <tbody>
    <tr><td>ChatGPT</td><td>Escritura, código, análisis</td><td>Gratis / $20/mes</td></tr>
    <tr><td>Claude</td><td>Análisis largo, escritura</td><td>Gratis / $20/mes</td></tr>
    <tr><td>Midjourney</td><td>Generación de imágenes</td><td>$10/mes</td></tr>
    <tr><td>Cursor</td><td>Programación con IA</td><td>$20/mes</td></tr>
    <tr><td>Make.com</td><td>Automatizaciones</td><td>Gratis / $9/mes</td></tr>
  </tbody>
</table>
<p>La clave no es usar IA por usar IA, sino identificar dónde puede crear el mayor valor en tu negocio específico. Empieza por mapear tus procesos actuales e identificar los cuellos de botella y tareas repetitivas.</p>`,

  "ideacion": `<h2>Generación de Ideas con IA</h2>
<p>La generación de ideas de negocio es uno de los primeros y más emocionantes pasos del emprendimiento. Con la IA, este proceso se vuelve más sistemático, rápido y basado en datos reales del mercado.</p>
<h3>Framework de Ideación SCAMPER con IA</h3>
<ul>
  <li><strong>S - Sustituir:</strong> ¿Qué componentes del negocio existente puedo reemplazar con IA?</li>
  <li><strong>C - Combinar:</strong> ¿Qué dos industrias puedo fusionar con la ayuda de IA?</li>
  <li><strong>A - Adaptar:</strong> ¿Cómo puedo adaptar un modelo exitoso de otra industria al mío?</li>
  <li><strong>M - Modificar:</strong> ¿Qué puedo hacer 10x mejor con IA?</li>
  <li><strong>P - Poner en otros usos:</strong> ¿Para qué otros mercados sirve mi solución?</li>
  <li><strong>E - Eliminar:</strong> ¿Qué pasos del proceso actual puedo eliminar con automatización?</li>
  <li><strong>R - Reordenar:</strong> ¿Qué pasaría si cambio el orden del proceso tradicional?</li>
</ul>
<h3>Prompt para Generar Ideas de Negocio con ChatGPT</h3>
<pre><code class="language-markdown">Actúa como un experto en emprendimiento. Genera 10 ideas de negocio que:
1. Puedan lanzarse en menos de 30 días
2. Requieran inversión mínima
3. Se puedan potenciar con IA
4. Tengan demanda comprobada en el mercado

Para cada idea incluye: problema que resuelve, cliente objetivo,
modelo de monetización y cómo la IA puede potenciarla.
</code></pre>`,

  "validacion": `<h2>Validación de Mercado Acelerada</h2>
<p>La validación es el proceso de confirmar que existe un mercado real para tu idea antes de invertir tiempo y dinero en desarrollarla completamente. Con IA, puedes validar ideas en días en lugar de meses.</p>
<h3>El Proceso de Validación en 5 Días</h3>
<ol>
  <li><strong>Día 1 - Investigación:</strong> Usa IA para analizar competidores, tendencias y tamaño de mercado</li>
  <li><strong>Día 2 - Landing Page:</strong> Crea una página de captura con herramientas no-code</li>
  <li><strong>Día 3 - Tráfico:</strong> Lanza una pequeña campaña de anuncios ($50-100)</li>
  <li><strong>Día 4 - Entrevistas:</strong> Habla con 5-10 potenciales clientes</li>
  <li><strong>Día 5 - Decisión:</strong> Analiza los datos y decide si continuar</li>
</ol>
<h3>Métricas de Validación</h3>
<ul>
  <li><strong>CTR mayor a 2%:</strong> La gente hace clic en tus anuncios (hay interés)</li>
  <li><strong>Conversión mayor a 10%:</strong> La gente deja su email (hay intención)</li>
  <li><strong>3+ pre-ventas:</strong> La gente paga antes de que el producto exista</li>
  <li><strong>NPS mayor a 50:</strong> Los usuarios encuestados recomendarían el producto</li>
</ul>
<blockquote><p>"Cobra antes de construir. Si nadie paga, nadie quiere tu producto." — Rob Walling</p></blockquote>`,

  "propuesta": `<h2>Propuesta de Valor Única</h2>
<p>Una propuesta de valor única (PVU) es la razón fundamental por la que un cliente debería elegirte sobre la competencia. Es la promesa que haces a tus clientes sobre el valor que van a recibir.</p>
<h3>Framework de Propuesta de Valor</h3>
<p>Una buena PVU responde tres preguntas: ¿Qué problema resuelves? ¿Cómo lo resuelves mejor que la competencia? ¿Para quién específicamente?</p>
<h3>Estructura de una PVU Efectiva</h3>
<pre><code>Para [CLIENTE ESPECÍFICO]
que tiene [PROBLEMA O NECESIDAD],
[NOMBRE DE TU PRODUCTO/SERVICIO]
es un [CATEGORÍA DE PRODUCTO]
que [BENEFICIO PRINCIPAL].
A diferencia de [ALTERNATIVA PRINCIPAL],
nosotros [DIFERENCIADOR CLAVE].
</code></pre>
<h3>Ejemplos de PVU con IA</h3>
<table>
  <thead><tr><th>Empresa</th><th>PVU</th></tr></thead>
  <tbody>
    <tr><td>Jasper AI</td><td>"Crea contenido de marketing 10x más rápido con IA"</td></tr>
    <tr><td>Copy.ai</td><td>"Escribe mejor y más rápido con IA generativa"</td></tr>
    <tr><td>Notion AI</td><td>"Tu espacio de trabajo con IA integrada"</td></tr>
  </tbody>
</table>`,

  "mvp": `<h2>Metodología MVP</h2>
<p>El Producto Mínimo Viable (MVP) es la versión más simple de tu producto que te permite validar tus hipótesis de negocio con el menor esfuerzo y tiempo posible.</p>
<h3>Tipos de MVP</h3>
<ol>
  <li><strong>Landing Page MVP:</strong> Solo una página que describe el producto y captura emails</li>
  <li><strong>Concierge MVP:</strong> Haces el trabajo manualmente como si fuera automático</li>
  <li><strong>Wizard of Oz MVP:</strong> Parece automatizado pero hay humanos detrás</li>
  <li><strong>Explainer Video MVP:</strong> Un video explicando el producto que aún no existe</li>
  <li><strong>Prototipo Clickeable:</strong> Una maqueta interactiva sin funcionalidad real</li>
</ol>
<h3>El Proceso de Construcción del MVP con IA</h3>
<pre><code class="language-bash"># Stack recomendado para MVP rápido
npx create-next-app@latest mi-mvp

# Con IA puedes generar el código base en horas:
# 1. Describe tu app a Claude o ChatGPT
# 2. Pide que genere la estructura de archivos
# 3. Itera sobre cada componente
# 4. Usa Cursor para codear más rápido
</code></pre>
<h3>Principios del MVP</h3>
<ul>
  <li><strong>Menos es más:</strong> Enfócate en una sola característica core</li>
  <li><strong>Velocidad mayor a Perfección:</strong> Mejor lanzar imperfecto que no lanzar</li>
  <li><strong>Aprende rápido:</strong> El objetivo es aprender, no construir</li>
</ul>`,

  "herramientas-ia": `<h2>Herramientas IA para Desarrollo</h2>
<p>En 2024, el stack de herramientas de IA disponible para desarrolladores y emprendedores es extraordinariamente poderoso. Aquí te presentamos las herramientas más importantes y cómo usarlas efectivamente.</p>
<h3>Herramientas de Desarrollo con IA</h3>
<ul>
  <li><strong>Cursor:</strong> El editor de código con IA más avanzado. Permite describir funcionalidades en lenguaje natural y genera el código.</li>
  <li><strong>GitHub Copilot:</strong> IA integrada en tu editor que sugiere código mientras escribes</li>
  <li><strong>v0.dev:</strong> Genera componentes de UI completos desde una descripción</li>
  <li><strong>Bolt.new:</strong> Crea aplicaciones completas desde texto</li>
</ul>
<h3>Automatización sin Código con IA</h3>
<table>
  <thead><tr><th>Herramienta</th><th>Mejor Para</th><th>Precio</th></tr></thead>
  <tbody>
    <tr><td>Make.com</td><td>Automatizaciones complejas</td><td>Gratis / 9$/mes</td></tr>
    <tr><td>Zapier</td><td>Integraciones simples</td><td>Gratis / 20$/mes</td></tr>
    <tr><td>n8n</td><td>Self-hosted, privado</td><td>Gratis (open source)</td></tr>
    <tr><td>Bubble</td><td>Apps completas sin código</td><td>Gratis / 29$/mes</td></tr>
  </tbody>
</table>`,

  "testing": `<h2>Testing e Iteración</h2>
<p>El testing y la iteración son los procesos que convierten una idea inicial en un producto exitoso. Sin un sistema de feedback continuo, estás construyendo a ciegas.</p>
<h3>El Ciclo Build-Measure-Learn</h3>
<ol>
  <li><strong>Build:</strong> Construye la función mínima para probar tu hipótesis</li>
  <li><strong>Measure:</strong> Mide el comportamiento real de los usuarios</li>
  <li><strong>Learn:</strong> Aprende de los datos y ajusta tu dirección</li>
</ol>
<h3>Métricas Clave para MVP</h3>
<ul>
  <li><strong>Activation Rate:</strong> % de usuarios que completan la acción clave</li>
  <li><strong>Retention Rate:</strong> % de usuarios que vuelven después de 7/30 días</li>
  <li><strong>NPS:</strong> ¿Qué tan probable es que recomienden tu producto?</li>
  <li><strong>CAC:</strong> ¿Cuánto cuesta conseguir un cliente?</li>
  <li><strong>LTV:</strong> ¿Cuánto vale un cliente a lo largo del tiempo?</li>
</ul>
<h3>Herramientas de Analytics con IA</h3>
<ul>
  <li><strong>PostHog:</strong> Analytics + feature flags open source</li>
  <li><strong>Hotjar:</strong> Grabaciones de sesiones y heatmaps</li>
  <li><strong>Mixpanel:</strong> Analytics de eventos avanzado</li>
</ul>`,

  "marketing-ia": `<h2>Marketing Digital con IA</h2>
<p>El marketing con IA ha transformado completamente cómo las empresas llegan a sus clientes. Desde la creación de contenido hasta la segmentación ultra-precisa, la IA permite hacer más con menos.</p>
<h3>Los Pilares del Marketing con IA</h3>
<ol>
  <li><strong>Creación de Contenido:</strong> Usa IA para crear posts, emails, videos y anuncios en minutos</li>
  <li><strong>Personalización:</strong> Adapta el mensaje a cada segmento de tu audiencia automáticamente</li>
  <li><strong>Optimización:</strong> A/B testing automatizado con IA para mejorar resultados continuamente</li>
  <li><strong>Análisis:</strong> Interpreta datos de marketing con IA para tomar mejores decisiones</li>
</ol>
<h3>Stack de Marketing con IA</h3>
<ul>
  <li><strong>Contenido:</strong> ChatGPT, Claude, Jasper, Copy.ai</li>
  <li><strong>Imágenes:</strong> Midjourney, DALL-E, Adobe Firefly</li>
  <li><strong>Video:</strong> HeyGen, Synthesia, Runway ML</li>
  <li><strong>Email:</strong> Klaviyo con IA, Mailchimp AI</li>
  <li><strong>SEO:</strong> Surfer SEO, Semrush con IA</li>
</ul>`,

  "growth": `<h2>Growth Hacking Moderno</h2>
<p>El growth hacking es una metodología de crecimiento acelerado que combina marketing, producto y datos para encontrar las estrategias de crecimiento más efectivas a bajo costo.</p>
<h3>Los Motores de Crecimiento</h3>
<ul>
  <li><strong>Viral Loop:</strong> Cada usuario trae más usuarios (referidos, compartir, invitaciones)</li>
  <li><strong>Paid Growth:</strong> Inversión en anuncios con ROI positivo</li>
  <li><strong>Content/SEO:</strong> Contenido que atrae tráfico orgánico escalable</li>
  <li><strong>Product-Led:</strong> El producto mismo impulsa el crecimiento (freemium)</li>
</ul>
<h3>Tácticas de Growth con IA</h3>
<ol>
  <li><strong>Personalización a escala:</strong> Genera emails personalizados para 1000 prospectos usando IA</li>
  <li><strong>SEO programático:</strong> Crea miles de páginas optimizadas automáticamente</li>
  <li><strong>Chatbot de ventas:</strong> Un bot IA que califica leads 24/7</li>
  <li><strong>Content recycling:</strong> Convierte un blog post en 10 formatos diferentes</li>
  <li><strong>Predicción de churn:</strong> Identifica usuarios que van a cancelar antes de que lo hagan</li>
</ol>`,

  "audiencias": `<h2>Construcción de Audiencias</h2>
<p>Construir una audiencia fiel es uno de los activos más valiosos que puede tener un emprendedor. Una audiencia propia te libera de los algoritmos y te da acceso directo a tu mercado potencial.</p>
<h3>Los Canales de Construcción de Audiencia</h3>
<ul>
  <li><strong>Newsletter:</strong> El canal más personal y con mayor ROI promedio</li>
  <li><strong>YouTube:</strong> El segundo buscador más grande del mundo</li>
  <li><strong>LinkedIn:</strong> Ideal para B2B y posicionamiento profesional</li>
  <li><strong>Twitter/X:</strong> Comunidad tech y emprendedora muy activa</li>
  <li><strong>TikTok/Instagram Reels:</strong> Máximo alcance orgánico actual</li>
  <li><strong>Podcast:</strong> Audiencia muy comprometida y nicho</li>
</ul>
<h3>Sistema de Contenido con IA (The Content Machine)</h3>
<ol>
  <li>Crea <strong>1 pieza larga</strong> por semana (blog, video YouTube, podcast)</li>
  <li>Usa IA para <strong>convertirla en 10 posts</strong> para redes sociales</li>
  <li>Convierte los mejores momentos en <strong>Reels o TikToks</strong></li>
  <li>Compila en <strong>newsletter semanal</strong></li>
</ol>
<blockquote><p>"Tu audiencia es tu verdadero activo. Los productos pueden cambiar, los negocios pueden pivotar, pero si tienes la atención y confianza de personas, siempre tendrás oportunidades."</p></blockquote>`,

  "monetizacion": `<h2>Modelos de Negocio y Monetización</h2>
<p>Tener un gran producto o servicio no es suficiente si no tienes una estrategia clara de monetización. La elección del modelo de negocio correcto puede ser la diferencia entre el éxito y el fracaso.</p>
<h3>Los 8 Modelos de Monetización más Efectivos con IA</h3>
<ol>
  <li><strong>SaaS:</strong> Suscripción mensual por acceso a software</li>
  <li><strong>Infoproductos:</strong> Cursos, ebooks, templates</li>
  <li><strong>Membresía:</strong> Comunidad + contenido exclusivo</li>
  <li><strong>Agencia con IA:</strong> Servicios potenciados por IA</li>
  <li><strong>Marketplace:</strong> Plataforma con comisión</li>
  <li><strong>Freemium:</strong> Producto gratis con características premium</li>
  <li><strong>API as a Service:</strong> Cobra por uso de tu API</li>
  <li><strong>Licenciamiento:</strong> Vende el derecho de uso de tu tecnología</li>
</ol>
<h3>Calculadora de Modelo de Negocio SaaS</h3>
<pre><code class="language-javascript">function calcularProyeccion(precioMensual, tasaCrecimiento, churn, clientesInicio) {
  let clientes = clientesInicio;
  let proyeccion = [];
  for (let mes = 1; mes <= 12; mes++) {
    const mrr = clientes * precioMensual;
    const nuevos = Math.round(clientes * tasaCrecimiento);
    const churned = Math.round(clientes * churn);
    clientes = clientes + nuevos - churned;
    proyeccion.push({ mes, mrr, clientes });
  }
  return proyeccion;
}
</code></pre>`,

  "financiamiento": `<h2>Estrategias de Financiamiento</h2>
<p>El financiamiento es el combustible que permite a los negocios crecer más rápido. Conocer las diferentes opciones disponibles y cuándo usar cada una es fundamental para todo emprendedor.</p>
<h3>Opciones de Financiamiento por Etapa</h3>
<table>
  <thead><tr><th>Etapa</th><th>Fuente</th><th>Monto Típico</th><th>A cambio de</th></tr></thead>
  <tbody>
    <tr><td>Pre-seed</td><td>Bootstrapping/FFF</td><td>$0-$50K</td><td>Nada / Equity mínimo</td></tr>
    <tr><td>Seed</td><td>Angels / Aceleradoras</td><td>$50K-$500K</td><td>5-15% equity</td></tr>
    <tr><td>Series A</td><td>VCs</td><td>$1M-$10M</td><td>20-30% equity</td></tr>
    <tr><td>Series B+</td><td>VCs institucionales</td><td>$10M+</td><td>Equity adicional</td></tr>
  </tbody>
</table>
<h3>El Poder del Bootstrapping con IA</h3>
<p>Con las herramientas de IA disponibles hoy, muchos negocios que antes necesitaban financiamiento externo pueden bootstrapearse. La IA reduce dramáticamente los costos de creación de contenido, desarrollo de software, atención al cliente y análisis de datos.</p>`,

  "escalado": `<h2>Escalado y Crecimiento Sostenible</h2>
<p>Escalar un negocio es el proceso de aumentar los ingresos más rápido que los costos. Con IA, es posible escalar operaciones sin necesariamente escalar el equipo de forma proporcional.</p>
<h3>Los 4 Motores de Escalado</h3>
<ol>
  <li><strong>Automatización:</strong> Reemplaza tareas manuales con sistemas automáticos potenciados por IA</li>
  <li><strong>Delegación:</strong> Construye un equipo y sistemas para que el negocio funcione sin ti</li>
  <li><strong>Multiplicación:</strong> Replica lo que funciona en nuevos mercados o segmentos</li>
  <li><strong>Leverage:</strong> Usa el capital, tecnología o red de otros para crecer más rápido</li>
</ol>
<h3>Indicadores de que Estás Listo para Escalar</h3>
<ul>
  <li>Tienes un proceso de ventas predecible y replicable</li>
  <li>Tu unit economics son positivos (LTV mayor a 3x CAC)</li>
  <li>Tienes suficiente caja para sobrevivir la inversión en crecimiento</li>
  <li>Tu infraestructura técnica puede manejar 10x el volumen actual</li>
  <li>Tienes sistemas documentados y un equipo capaz de ejecutarlos</li>
</ul>
<blockquote><p>"Primero haz que funcione, luego haz que funcione bien, luego haz que escale." — Kent Beck</p></blockquote>`
};

async function main() {
  console.log("🌱 Starting seed...");

  const hashedPassword = await bcrypt.hash("Admin1234!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@entrepreneuria.com" },
    update: {},
    create: {
      name: "Admin Entrepreneuria",
      email: "admin@entrepreneuria.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  const course = await prisma.course.upsert({
    where: { slug: "emprendimiento-ia" },
    update: { published: true },
    create: {
      slug: "emprendimiento-ia",
      title: "Emprendimiento con IA",
      description: "Aprende a construir y escalar negocios exitosos utilizando las últimas herramientas de inteligencia artificial. Desde la ideación hasta el escalado, dominá cada etapa del proceso emprendedor con IA.",
      published: true,
      instructorId: admin.id,
    },
  });
  console.log("✅ Course created:", course.title);

  const modulesData = [
    {
      title: "Fundamentos del Emprendimiento con IA",
      icon: "🚀",
      color: "blue",
      lessons: [
        { title: "Introducción al Emprendimiento con IA", content: lessonContents["intro-ia"], durationMinutes: 15 },
        { title: "Mindset Emprendedor en la Era Digital", content: lessonContents["mindset"], durationMinutes: 12 },
        { title: "El Rol de la IA en los Negocios Modernos", content: lessonContents["rol-ia"], durationMinutes: 18 },
      ],
    },
    {
      title: "Ideación y Validación",
      icon: "💡",
      color: "yellow",
      lessons: [
        { title: "Generación de Ideas con IA", content: lessonContents["ideacion"], durationMinutes: 20 },
        { title: "Validación de Mercado Acelerada", content: lessonContents["validacion"], durationMinutes: 15 },
        { title: "Propuesta de Valor Única", content: lessonContents["propuesta"], durationMinutes: 12 },
      ],
    },
    {
      title: "Construyendo tu MVP",
      icon: "🏗️",
      color: "green",
      lessons: [
        { title: "Metodología MVP", content: lessonContents["mvp"], durationMinutes: 18 },
        { title: "Herramientas IA para Desarrollo", content: lessonContents["herramientas-ia"], durationMinutes: 22 },
        { title: "Testing y Iteración", content: lessonContents["testing"], durationMinutes: 15 },
      ],
    },
    {
      title: "Marketing y Growth",
      icon: "📈",
      color: "purple",
      lessons: [
        { title: "Marketing Digital con IA", content: lessonContents["marketing-ia"], durationMinutes: 20 },
        { title: "Growth Hacking Moderno", content: lessonContents["growth"], durationMinutes: 18 },
        { title: "Construcción de Audiencias", content: lessonContents["audiencias"], durationMinutes: 15 },
      ],
    },
    {
      title: "Financiamiento y Escalado",
      icon: "💰",
      color: "orange",
      lessons: [
        { title: "Modelos de Negocio y Monetización", content: lessonContents["monetizacion"], durationMinutes: 22 },
        { title: "Estrategias de Financiamiento", content: lessonContents["financiamiento"], durationMinutes: 18 },
        { title: "Escalado y Crecimiento Sostenible", content: lessonContents["escalado"], durationMinutes: 20 },
      ],
    },
  ];

  await prisma.module.deleteMany({ where: { courseId: course.id } });

  for (let i = 0; i < modulesData.length; i++) {
    const modData = modulesData[i];
    const mod = await prisma.module.create({
      data: {
        courseId: course.id,
        title: modData.title,
        icon: modData.icon,
        color: modData.color,
        orderIndex: i,
      },
    });

    for (let j = 0; j < modData.lessons.length; j++) {
      const lessonData = modData.lessons[j];
      await prisma.lesson.create({
        data: {
          moduleId: mod.id,
          title: lessonData.title,
          content: lessonData.content,
          orderIndex: j,
          durationMinutes: lessonData.durationMinutes,
        },
      });
    }

    console.log(`✅ Module ${i + 1}: ${modData.title} (${modData.lessons.length} lessons)`);
  }

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: admin.id, courseId: course.id } },
    create: { userId: admin.id, courseId: course.id, status: "ACTIVE" },
    update: {},
  });

  console.log("✅ Admin enrolled in course");
  console.log("\n🎉 Seed completed successfully!");
  console.log("\nAdmin credentials:");
  console.log("  Email: admin@entrepreneuria.com");
  console.log("  Password: Admin1234!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

