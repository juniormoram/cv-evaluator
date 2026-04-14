# CV Evaluator — AI-Powered Resume Analyzer

Aplicación web que analiza CVs en PDF usando Inteligencia Artificial y los evalúa en relación a una descripción de puesto, entregando puntajes, fortalezas, debilidades y recomendaciones en segundos.

🔗 **[Ver demo en vivo](https://cv-evaluator-nine.vercel.app/)**

---

## Vista previa

> Sube un CV → ingresa el puesto → obtén un análisis completo con IA

---

## Funcionalidades

- 📄 Carga de CV en formato PDF con drag & drop
- 💼 Evaluación contra una descripción de puesto específica
- 🧠 Análisis con Claude AI (Anthropic) — modelo Sonnet 4.6
- 📊 Puntaje general y por categorías (Experiencia, Habilidades, Educación, Match)
- ✅ Fortalezas, áreas de mejora y habilidades detectadas
- 💡 Feedback detallado y recomendación final
- 🔐 API Key segura en el servidor (nunca expuesta al cliente)

---

## Stack tecnológico

| Tecnología | Uso |
|---|---|
| Next.js 15 (App Router) | Framework frontend + backend |
| Tailwind CSS | Estilos |
| Claude API (Anthropic) | Motor de análisis con IA |
| Vercel | Deploy y hosting |

---

## Cómo correrlo localmente

### 1. Clona el repositorio

```bash
git clone https://github.com/juniormoram/cv-evaluator.git
cd cv-evaluator
```

### 2. Instala dependencias

```bash
npm install
```

### 3. Configura las variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
ANTHROPIC_API_KEY=sk-ant-api03-tu-clave-aqui
```

Obtén tu API Key en [console.anthropic.com](https://console.anthropic.com)

### 4. Inicia el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Arquitectura

```
Usuario sube PDF
      ↓
Frontend (Next.js) — convierte PDF a base64
      ↓
API Route /api/evaluate — recibe el PDF de forma segura
      ↓
Claude API — analiza el CV con el prompt de evaluación
      ↓
JSON estructurado con puntajes y feedback
      ↓
UI renderiza el reporte
```

La API Key nunca sale del servidor — el frontend solo se comunica con la API Route interna de Next.js.

---

## Variables de entorno

| Variable | Descripción |
|---|---|
| `ANTHROPIC_API_KEY` | Clave de la API de Anthropic |

---

## Autor

**Junior Mora** — [github.com/juniormoram](https://github.com/juniormoram)
