import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === "production";

app.use(express.json({ limit: "15mb" }));

// Server-side Google GenAI initialization
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Health
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", hasAiKey: Boolean(apiKey) });
});

// API endpoint: Generate Complete eBook with Gemini
app.post("/api/gemini/generate-ebook", async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured on the server. Please check the Secrets panel in AI Studio.",
      });
    }

    const {
      topic,
      targetAudience = "Geral",
      category = "Saúde e Bem-estar",
      language = "Português",
      numberOfItems = 6,
      bookType = "recipes_or_remedies", // 'recipes_or_remedies' | 'chapters'
    } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "O tema do eBook é obrigatório." });
    }

    const prompt = `Você é um autor best-seller e editor de livros e eBooks de alta qualidade.
Crie um eBook completo e aprofundado sobre o tema: "${topic}".
Categoria: ${category}.
Público-alvo: ${targetAudience}.
Idioma: ${language}.
Tipo de conteúdo: ${bookType}.
Gere exatamente ${Math.min(Math.max(Number(numberOfItems) || 6, 2), 12)} receitas ou capítulos detalhados.

IMPORTANTE: Forneça conteúdo prático, com linguagem empática, rica em detalhes e explicações reais dos ingredientes e benefícios.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Título impactante do eBook" },
            subtitle: { type: Type.STRING, description: "Subtítulo explicativo e cativante" },
            author: { type: Type.STRING, description: "Nome do autor ou especialista" },
            category: { type: Type.STRING },
            introduction: { type: Type.STRING, description: "Texto de introdução inspirador (2 a 3 parágrafos)" },
            rulesOrTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 a 5 regras de ouro ou dicas fundamentais de preparação",
            },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Nome da receita ou do capítulo" },
                  subtitleOrMeta: { type: Type.STRING, description: "Ex: Tempo: 10 min | Uso: Diário" },
                  description: { type: Type.STRING, description: "Benefício principal ou sinopse" },
                  ingredientsOrPoints: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Lista de 3 a 5 ingredientes ou pontos-chave",
                  },
                  instructionsOrSteps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "3 a 4 passos práticos e detalhados de preparo ou aplicação",
                  },
                  secretOrTip: { type: Type.STRING, description: "O segredo ou dica de ouro do especialista" },
                  recommendedTime: { type: Type.STRING, description: "Ex: Em jejum, antes de dormir, após o almoço" },
                },
                required: [
                  "title",
                  "subtitleOrMeta",
                  "description",
                  "ingredientsOrPoints",
                  "instructionsOrSteps",
                  "secretOrTip",
                ],
              },
            },
            conclusion: { type: Type.STRING, description: "Mensagem final ou plano semanal sugerido" },
          },
          required: ["title", "subtitle", "author", "introduction", "rulesOrTips", "items", "conclusion"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Erro ao gerar eBook com Gemini:", error);
    return res.status(500).json({ error: error.message || "Falha ao gerar eBook com IA." });
  }
});

// API endpoint: Generate single chapter or recipe
app.post("/api/gemini/generate-chapter", async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured.",
      });
    }

    const { bookTitle, itemPrompt, language = "Português" } = req.body;

    const prompt = `No contexto do livro/eBook "${bookTitle || "Guia Prático"}", gere um novo item completo (receita ou capítulo) sobre: "${itemPrompt}".
Idioma: ${language}.
Forneça título, subtítulo, descrição dos benefícios, ingredientes/pontos, passos práticos e um segredo ou conselho valioso.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subtitleOrMeta: { type: Type.STRING },
            description: { type: Type.STRING },
            ingredientsOrPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            instructionsOrSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            secretOrTip: { type: Type.STRING },
          },
          required: ["title", "subtitleOrMeta", "description", "ingredientsOrPoints", "instructionsOrSteps", "secretOrTip"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Erro ao gerar capítulo:", error);
    return res.status(500).json({ error: error.message || "Falha ao gerar capítulo." });
  }
});

// API endpoint: AI Polish / Rewrite text
app.post("/api/gemini/improve-text", async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured." });
    }

    const { text, tone = "editorial e persuasivo" } = req.body;
    if (!text) return res.status(400).json({ error: "Texto não informado." });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Reescreva e aprimore o seguinte texto para um eBook profissional no tom ${tone}. Mantenha a clareza e riqueza de vocabulário, eliminando clichês. Retorne apenas o texto aprimorado:\n\n${text}`,
    });

    return res.json({ success: true, text: response.text?.trim() });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Falha ao aprimorar texto." });
  }
});

// Setup Vite or static serving
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`> Servidor do eBook Studio ativo na porta ${PORT}`);
  });
}

startServer();
