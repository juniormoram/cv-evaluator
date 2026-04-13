
// Request a AI, prompt
export async function POST(request) {
  try {
    const { pdfBase64, jobDescription } = await request.json();

    if (!pdfBase64) {
      return Response.json({ error: "No se recibió ningún PDF" }, { status: 400 });
    }

    const prompt = `Eres un experto evaluador de recursos humanos. Analiza el CV adjunto${
      jobDescription
        ? ` en relación a esta descripción del puesto:\n\n"${jobDescription}"`
        : ""
    }.

AI Devuelve ÚNICAMENTE un JSON válido con esta estructura exacta, según el siguiente detalle:
{
  "overall_score": <número 0-100>,
  "verdict": "<Candidato Excelente | Candidato Sólido | Candidato Promisorio | No Recomendado>",
  "categories": [
    {"name": "Experiencia", "score": <0-100>},
    {"name": "Habilidades Técnicas", "score": <0-100>},
    {"name": "Educación", "score": <0-100>},
    {"name": "Match con Puesto", "score": <0-100>}
  ],
  "strengths": ["fortaleza 1", "fortaleza 2", "fortaleza 3"],
  "weaknesses": ["debilidad 1", "debilidad 2"],
  "skills_found": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "feedback": [
    {"type": "positive", "text": "..."},
    {"type": "negative", "text": "..."},
    {"type": "neutral", "text": "..."}
  ],
  "summary": "Párrafo de 2-3 oraciones con recomendación final clara."
}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,  // Clave segura en el server
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "document",
                source: {
                  type: "base64",
                  media_type: "application/pdf",
                  data: pdfBase64,
                },
              },
              { type: "text", text: prompt },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return Response.json(
        { error: err.error?.message || "Error en Claude API" },
        { status: response.status }
      );
    }

    const data = await response.json();
    let raw = data.content[0].text.trim();
    raw = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(raw);

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}