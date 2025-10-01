import express from 'express';
import axios from 'axios';
const router = express.Router();

router.post('/', async (req, res) => {
  const { expenses, incomes, savingsGoals } = req.body;
  const userSummary = {
    expenses,
    incomes,
    savingsGoals
  };

  const prompt = `
Eres un asesor financiero inteligente. Analiza los siguientes datos y da exactamente 3 sugerencias personalizadas y concretas para mejorar las finanzas personales del usuario. Sé claro, directo y responde SOLO en español usando el siguiente formato:

1. [Sugerencia 1]
2. [Sugerencia 2]
3. [Sugerencia 3]

Responde únicamente con la lista numerada, sin texto adicional antes o después.

Datos del usuario:
${JSON.stringify(userSummary, null, 2)}
`;

  // LOG: Entrada recibida y prompt generado
  console.log('--- SUGERENCIAS IA (OLLAMA) ---');
  console.log('Body recibido:', req.body);
  console.log('Prompt enviado a Ollama:', prompt);

  try {
    // Llama a Ollama (modelo llama2 por defecto, puedes cambiarlo)
    const ollamaResponse = await axios.post(
      'http://localhost:11434/api/generate',
      {
        model: 'llama2',
        prompt: prompt,
        stream: false
      }
    );
  // LOG: Respuesta de Ollama (sin el campo context para no saturar la terminal)
  const { context, ...rest } = ollamaResponse.data;
  console.log('Respuesta de Ollama (sin context):', JSON.stringify(rest, null, 2));
  const suggestions = ollamaResponse.data.response;
  console.log('Sugerencias extraídas:', suggestions);
  res.json({ suggestions });
  } catch (error) {
    console.error('Error al obtener sugerencias de IA (Ollama):', error?.response?.data || error);
    res.status(500).json({ error: 'Error al obtener sugerencias de IA', details: error?.response?.data || String(error) });
  }
});

export default router;
