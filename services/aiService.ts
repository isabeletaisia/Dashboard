
import { GoogleGenAI } from "@google/genai";
import { AdData } from "../types";
import { formatCurrency, formatPercent } from "../utils/formatters";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePerformanceInsight = async (data: AdData[]): Promise<string> => {
  if (!data.length) return "Nenhum dado para analisar.";

  // Resumir os top 5 criativos por gasto para o contexto
  const summary = data.slice(0, 5).map(ad => 
    `- ${ad.adName}: Gasto ${formatCurrency(ad.spend)}, Vendas: ${ad.purchases}, CTR: ${formatPercent(ad.ctrNormalized)}`
  ).join('\n');

  const totalSpend = data.reduce((acc, curr) => acc + curr.spend, 0);
  const totalSales = data.reduce((acc, curr) => acc + curr.purchases, 0);
  const avgCpa = totalSales > 0 ? totalSpend / totalSales : 0;

  const prompt = `Analise os seguintes dados de Meta Ads e gere um resumo executivo extremamente curto e profissional para compartilhar via WhatsApp com o cliente.
  Métricas Totais: Gasto ${formatCurrency(totalSpend)}, Vendas ${totalSales}, CPA Médio ${formatCurrency(avgCpa)}.
  Top Criativos:
  ${summary}
  
  O resumo deve incluir:
  1. Performance geral em uma frase.
  2. Destaque do melhor criativo.
  3. Uma recomendação técnica curta (ex: escalar o criativo X ou pausar o Y).
  
  Use emojis discretos. Mantenha o tom profissional "Apple-like".`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Erro ao gerar insight.";
  } catch (error) {
    console.error("Erro Gemini:", error);
    return "Falha ao consultar a IA para insights.";
  }
};
