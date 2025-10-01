import express from 'express';
import axios from 'axios';
const router = express.Router();

router.post('/', async (req, res) => {
  const { expenses, incomes } = req.body;

  // Calcular totales para el prompt
  const totalIngresos = incomes.reduce((sum, i) => sum + (i.amount || 0), 0);
  const totalGastos = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const balance = totalIngresos - totalGastos;
  
  // Agrupar gastos por categoría
  const gastosPorCategoria = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
  
  // (Se puede usar si se quiere mostrar en el frontend, ahora se pasa el JSON de categorías directamente)
  // const categoriasMayorGasto = Object.entries(gastosPorCategoria)
  //   .sort((a, b) => b[1] - a[1])
  //   .slice(0, 3)
  //   .map(([cat, monto]) => `${cat}: $${monto.toLocaleString()}`);

  // --- Generar candidatos determinísticos ---
  function numberFmt(n){return Number.isFinite(n)? n.toLocaleString('es-CO'): '0';}
  const categoriasOrdenadas = Object.entries(gastosPorCategoria).sort((a,b)=> b[1]-a[1]);
  const share = (m)=> totalGastos>0? (m/totalGastos*100):0;
  const topCats = categoriasOrdenadas.slice(0,4).map(([cat,val])=>({cat,val,percent:share(val)}));

  function generateDeterministicCandidates(){
    const out = [];
    if(totalIngresos>0){
      const targetSaving = Math.min(0.2, Math.max(0.1, (balance/totalIngresos<0.05?0.12:0.15)));
      out.push(`Destina ${(targetSaving*100).toFixed(0)}% de tus ingresos (≈$${numberFmt(Math.round(totalIngresos*targetSaving))}) a ahorro`);
    }
    if(topCats[0]){ const c=topCats[0]; if(c.percent>35){ const reducePct=c.percent>50?15:12; out.push(`Reduce ${c.cat} ${reducePct}% (≈$${numberFmt(Math.round(c.val*reducePct/100))}) para equilibrar`); } else if(c.percent>25){ out.push(`Limita ${c.cat} al 25% (actual ${c.percent.toFixed(1)}%)`);} else { out.push(`Monitorea ${c.cat} y evita superar 25% (actual ${c.percent.toFixed(1)}%)`);} }
    if(topCats[1]){ const c=topCats[1]; if(c.percent>18){ out.push(`Optimiza ${c.cat} bajando 10% (≈$${numberFmt(Math.round(c.val*0.10))})`);} }
    if(balance>0){ const investPct = balance> totalIngresos*0.3? 0.2:0.15; out.push(`Invierte ${(investPct*100).toFixed(0)}% del balance (≈$${numberFmt(Math.round(balance*investPct))}) en conservador`);} else if(balance<0 && topCats[0]) { out.push(`Ajusta presupuesto para eliminar déficit (−$${numberFmt(Math.abs(balance))})`);}    
    out.push('Registra gastos diarios para detectar fugas y mejorar control');
    const seen=new Set();
    return out.filter(s=>{const k=s.toLowerCase(); if(seen.has(k)) return false; seen.add(k); return true;});
  }
  const deterministicCandidates = generateDeterministicCandidates();

  const prompt = `Refina y selecciona SOLO 3 recomendaciones financieras específicas basadas en los datos. \n\nDatos: Ingresos $${numberFmt(totalIngresos)}, Gastos $${numberFmt(totalGastos)}, Balance $${numberFmt(balance)}. Categorías: ${topCats.map(c=>`${c.cat} ${c.percent.toFixed(1)}%`).join(', ')||'sin datos'}.\n\nCandidatas:\n${deterministicCandidates.map((c,i)=>`${i+1}. ${c}`).join('\n')}\n\nReglas estrictas:\n- Devuelve SOLO 3 líneas enumeradas 1.,2.,3.\n- Máx 18 palabras por línea.\n- Empieza con verbo (Destina, Reduce, Limita, Invierte, Optimiza, Registra, Ajusta, Monitorea).\n- No inventes nuevas cifras.\n- Prohibido: texto, categoría, placeholder, recomendación, libro, viaje.\n\nSalida:`;


  try {
    // Llama a Ollama con modelo phi (más rápido que llama2)
  const ollamaResponse = await axios.post(
      'http://localhost:11434/api/generate',
      {
        model: 'phi',
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.25,
          top_p: 0.4,
          top_k: 30,
          num_predict: 170,
          repeat_penalty: 1.25,
          stop: ['\n\n', 'User:', 'Assistant:', 'usuario:', 'asistente:']
        }
      }
    );
    const raw = (ollamaResponse.data.response || '').trim();
    console.log('🤖 RAW modelo:', raw);

    // Parse enumerated lines del modelo
    const enumerated = [...raw.matchAll(/^(?:\s*)([1-3])\.\s*(.+)$/gm)]
      .sort((a,b)=> a[1].localeCompare(b[1]))
      .map(m=> m[2].trim())
      .filter(Boolean);

    const invalid = /(texto|categor|placeholder|recomendaci[oó]n|libro|viaje|pel[ií]cula|turismo)/i;
    let cleaned = enumerated
      .map(s=> s.replace(/"/g,'').trim())
      .filter(s=> s.split(/\s+/).length <= 18 && !invalid.test(s));

    if(cleaned.length < 3){
      cleaned = deterministicCandidates.slice(0,3);
    }

    // Asegurar presencia de ahorro y control
    const hasSaving = cleaned.some(s=> /ahorro|fondo/i.test(s));
    const hasControl = cleaned.some(s=> /reduce|limita|optimiza|controla|ajusta/i.test(s));
    if(!hasSaving){
      const saving = deterministicCandidates.find(s=> /ahorro/i.test(s));
      if(saving) cleaned[0]= saving;
    }
    if(!hasControl){
      const control = deterministicCandidates.find(s=> /(Reduce|Limita|Optimiza)/.test(s));
      if(control) cleaned[1]= control;
    }

    // Eliminar duplicados y rellenar
    const final = [];
    const seen = new Set();
    for(const s of cleaned){
      const k=s.toLowerCase();
      if(!seen.has(k)){ final.push(s); seen.add(k);} if(final.length===3) break;
    }
    while(final.length<3){
      const next = deterministicCandidates.find(c=> !seen.has(c.toLowerCase()));
      final.push(next || 'Registra gastos diarios para detectar fugas');
    }
    const formatted = final.slice(0,3).map((t,i)=> `${i+1}. ${t}`).join('\n');
    console.log('✅ Sugerencias finales:\n' + formatted);
    res.json({ suggestions: formatted });
  } catch (error) {
    console.error('Error al obtener sugerencias de IA (Ollama):', error?.response?.data || error);
    res.status(500).json({ error: 'Error al obtener sugerencias de IA', details: error?.response?.data || String(error) });
  }
});

export default router;
