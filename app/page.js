"use client";
import { useState, useRef } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const fileRef = useRef();

  // Validación de PDF cargado
  function handleFile(f) {
    if (!f || f.type !== "application/pdf") {
      setError("Por favor selecciona un archivo PDF.");
      return;
    }
    setFile(f);
    setError("");
  }

  // Solicitud y envío de info a route.js (server)
  async function analyze() {
    if (!file) { setError("Selecciona un CV en PDF primero."); return; }

    setLoading(true);
    setResult(null);
    setError("");

    // Convertir PDF a base64
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Carga info el server para petición
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfBase64: base64, jobDescription: jobDesc }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error desconocido");
      setResult(data);
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function scoreColor(s) {
    if (s >= 70) return "#56c9a0";
    if (s >= 45) return "#e8a44a";
    return "#e05c6b";
  }

  if (result) return <Results result={result} onReset={() => setResult(null)} scoreColor={scoreColor} />;

  return (
    <main style={{ minHeight: "100vh", background: "#fdfdfd", color: "#e8eaf0", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <nav style={{ width: "100%", padding: "18px 40px", borderBottom: "1px solid #2a2f3d", background: "#161920", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 19, fontWeight: 700 }}>Evaluador<span style={{ color: "#7c6ef5" }}>.</span> CV</span>
        <span style={{ fontSize: 14, background: "#7c6ef520", color: "#7c6ef5", border: "1px solid #ffffff", borderRadius: 10, padding: "3px 10px" }}>Junior Mora - Claude AI</span>
      </nav>

      <div style={{ textAlign: "center", padding: "56px 24px 32px", maxWidth: 580 }}>
        <h1 style={{ fontSize: 40, fontWeight: 700, marginBottom: 14, lineHeight: 1.1, color: "#7a7f94" }}>
          Evalúa CVs con <span style={{ color: "#7c6ef5" }}>Inteligencia Artificial</span>
        </h1>
        <p style={{ color: "#7a7f94", lineHeight: 1.7, fontSize: 20 }}>
          Sube un CV en PDF y obtén un análisis detallado con puntajes, fortalezas y recomendaciones.
        </p>
      </div>

      <div style={{ background: "#161920", border: "1px solid #2a2f3d", borderRadius: 12, padding: 28, width: "100%", maxWidth: 680, margin: "0 24px 32px" }}>

        {/* Drop zone */}
        <p style={{ fontSize: 13, fontWeight: 600, color: "#7a7f94", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>📄 CV del candidato (PDF)</p>
        <div
          onClick={() => fileRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          style={{ border: `2px dashed ${file ? "#56c9a0" : "#2a2f3d"}`, borderRadius: 12, padding: 36, textAlign: "center", cursor: "pointer", marginBottom: 20, transition: "border-color 0.2s" }}
        >
          <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
          <div style={{ fontSize: 55, marginBottom: 8 }}>📎</div>
          {file
            ? <p style={{ color: "#56c9a0", fontWeight: 600 }}>✓ {file.name}</p>
            : <p style={{ color: "#7a7f94", fontSize: 14 }}><strong style={{ color: "#e8eaf0" }}>Arrastra tu PDF aquí</strong><br />o haz clic para seleccionar</p>
          }
        </div>

        {/* Descripción del puesto */}
        <p style={{ fontSize: 13, fontWeight: 600, color: "#7a7f94", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>💼 Descripción del puesto (opcional)</p>
        <textarea
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          placeholder="Ej: Buscamos desarrollador Full Stack con 3+ años en React y Node.js..."
          style={{ width: "100%", background: "#1e2230", border: "1px solid #2a2f3d", borderRadius: 8, color: "#e8eaf0", fontFamily: "sans-serif", fontSize: 14, padding: 14, resize: "vertical", minHeight: 100, outline: "none", lineHeight: 1.6 }}
        />

        {error && <p style={{ color: "#e05c6b", fontSize: 13, marginTop: 10 }}>{error}</p>}

        {/* Llamado de función */}
        <button
          onClick={analyze}
          disabled={loading || !file}
          style={{ width: "100%", padding: 16, background: loading || !file ? "#3a3560" : "#7c6ef5", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: loading || !file ? "not-allowed" : "pointer", marginTop: 20, transition: "background 0.2s" }}
        >
          {loading ? "Analizando con IA..." : "Analizar CV con IA →"}
        </button>
      </div>
    </main>
  );
}

function Results({ result, onReset, scoreColor }) {
  return (
    <main style={{ minHeight: "100vh", background: "#fdfdfd", color: "#e8eaf0", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <nav style={{ width: "100%", padding: "18px 40px", borderBottom: "1px solid #2a2f3d", background: "#161920", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 20, fontWeight: 700 }}>Evaluador<span style={{ color: "#7c6ef5" }}>.</span> CV</span>
        <span style={{ fontSize: 11, background: "#7c6ef520", color: "#7c6ef5", border: "1px solid #ffffff", borderRadius: 20, padding: "3px 10px" }}>Junior Mora - Claude AI</span>
      </nav>

      <div style={{ width: "100%", maxWidth: 680, margin: "32px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Score general */}
        <div style={{ background: "#0d0f14 linear-gradient(135deg, #7c6ef515, #56c9a010)", border: "1px solid #7c6ef5", borderRadius: 12, padding: 28, textAlign: "center" }}>
          <div style={{ fontSize: 72, fontWeight: 800, color: "#7c6ef5", lineHeight: 1 }}>{result.overall_score}</div>
          <div style={{ color: "#7a7f94", fontSize: 13, marginTop: 4 }}>puntuación general / 100</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 10 }}>{result.verdict}</div>
        </div>

        {/* Score categorías */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {result.categories.map((c) => (
            <div key={c.name} style={{ background: "#161920", border: "1px solid #2a2f3d", borderRadius: 10, padding: 18, textAlign: "center" }}>
              <div style={{ fontSize: 12, color: "#7a7f94", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{c.name}</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: scoreColor(c.score) }}>{c.score}</div>
              <div style={{ height: 4, background: "#2a2f3d", borderRadius: 2, marginTop: 10 }}>
                <div style={{ height: "100%", width: c.score + "%", background: scoreColor(c.score), borderRadius: 2, transition: "width 1s ease" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Sección fortalezas */}
        <Section title="✅ Fortalezas">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {result.strengths.map((s) => <Tag key={s} text={"✓ " + s} color="#56c9a0" bg="#56c9a018" />)}
          </div>
        </Section>

        {/* Sección debilidades */}
        <Section title="⚠️ Áreas de mejora">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {result.weaknesses.map((w) => <Tag key={w} text={"✗ " + w} color="#e05c6b" bg="#e05c6b18" />)}
          </div>
        </Section>

        {/* Sección habilidades */}
        <Section title="💡 Habilidades detectadas">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {result.skills_found.map((s) => <Tag key={s} text={s} color="#e8a44a" bg="#e8a44a18" />)}
          </div>
        </Section>

        {/* Feedback */}
        <Section title="📝 Feedback detallado">
          {result.feedback.map((f, i) => (
            <div key={i} style={{ borderLeft: `3px solid ${f.type === "positive" ? "#56c9a0" : f.type === "negative" ? "#e05c6b" : "#e8a44a"}`, background: "#1e2230", borderRadius: "0 8px 8px 0", padding: "12px 14px", marginBottom: 10, fontSize: 14, color: "#7a7f94", lineHeight: 1.6 }}>
              {f.text}
            </div>
          ))}
        </Section>

        {/* Recomendación */}
        <Section title="🎯 Recomendación final">
          <div style={{ background: "#1e2230", border: "1px solid #2a2f3d", borderRadius: 10, padding: 20, fontSize: 14, color: "#7a7f94", lineHeight: 1.8 }}>
            {result.summary}
          </div>
        </Section>

        <button onClick={onReset} style={{ background: "#0d0f14", border: "1px solid #2a2f3d", color: "#7a7f94", borderRadius: 8, padding: "10px 20px", fontSize: 13, cursor: "pointer", alignSelf: "flex-start" }}>
          ← Evaluar otro CV
        </button>
      </div>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ background: "#161920", border: "1px solid #2a2f3d", borderRadius: 12, padding: 20 }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: "#7a7f94", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14, paddingBottom: 8, borderBottom: "1px solid #2a2f3d" }}>{title}</p>
      {children}
    </div>
  );
}

function Tag({ text, color, bg }) {
  return (
    <span style={{ fontSize: 13, padding: "5px 12px", borderRadius: 20, fontWeight: 500, color, background: bg, border: `1px solid ${color}30` }}>
      {text}
    </span>
  );
}