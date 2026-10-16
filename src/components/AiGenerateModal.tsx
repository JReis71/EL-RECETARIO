import React, { useState } from "react";
import { Sparkles, Loader2, BookOpen, CheckCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { EbookData, EbookItem } from "../types/ebook";

interface AiGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyEbook: (newEbook: EbookData) => void;
}

export const AiGenerateModal: React.FC<AiGenerateModalProps> = ({
  isOpen,
  onClose,
  onApplyEbook,
}) => {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("Saúde e Bem-estar");
  const [targetAudience, setTargetAudience] = useState("Adultos buscando qualidade de vida");
  const [language, setLanguage] = useState<"pt" | "es" | "en">("pt");
  const [numberOfItems, setNumberOfItems] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  if (!isOpen) return null;

  const presets = [
    {
      title: "Chás e Segredos da Herbolaria Brasileira",
      desc: "Guia completo de infusões medicinais com plantas nativas do Brasil para desinflamar e dormir bem.",
    },
    {
      title: "Sucos Vivos e Elixires Anti-inflamatórios",
      desc: "Receitas diárias para desintoxicação do fígado, alívio de dores articulares e renovação celular.",
    },
    {
      title: "Protocolo do Sono Profundo e Ansiedade Zero",
      desc: "Fórmulas noturnas, banhos aromáticos e rituais da vovó para restaurar o ciclo circadiano.",
    },
    {
      title: "Manual da Longevidade e Controle Natural da Glicose",
      desc: "Remédios e tônicos da sabedoria ancestral para controlar o açúcar e proteger o coração.",
    },
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert("Por favor, digite o tema desejado para o seu novo eBook.");
      return;
    }

    setIsLoading(true);
    setLoadingMessage("Conectando ao modelo Gemini para formular a estrutura...");

    try {
      setLoadingMessage("Criando capítulos, ingredientes, preparos e segredos da vovó...");

      const response = await fetch("/api/gemini/generate-ebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          category,
          targetAudience,
          language: language === "pt" ? "Português" : language === "es" ? "Español" : "English",
          numberOfItems,
          bookType: "recipes_or_remedies",
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Falha na resposta do servidor.");
      }

      const generated = json.data;

      // Transform into EbookData format
      const defaultPhotoBank = [
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80",
      ];

      const newItems: EbookItem[] = (generated.items || []).map((it: any, index: number) => ({
        id: `ai-item-${Date.now()}-${index}`,
        num: String(index + 1).padStart(2, "0"),
        moduleIndex: Math.min(Math.floor(index / 4) + 1, 5),
        moduleTitle: `Módulo ${Math.min(Math.floor(index / 4) + 1, 5)}: ${category}`,
        title: it.title,
        meta: it.subtitleOrMeta || "Tempo: 10 min | Uso: Diário",
        description: it.description,
        imageUrl: defaultPhotoBank[index % defaultPhotoBank.length],
        ingredients: it.ingredientsOrPoints || [],
        steps: it.instructionsOrSteps || [],
        secret: it.secretOrTip || "Prepare sempre com ingredientes frescos.",
        tags: [category.toLowerCase()],
      }));

      const newEbook: EbookData = {
        id: `ai-book-${Date.now()}`,
        title: generated.title || topic.toUpperCase(),
        subtitle: generated.subtitle || "Guia Prático e Ilustrado",
        editionBadge: `Edição Exclusiva • ${newItems.length} Fórmulas • ${category}`,
        author: generated.author || "Equipe Editorial de Bem-estar",
        language: language,
        coverImage: defaultPhotoBank[0],
        coverHeroText: `Conteúdo Completo: ${newItems.length} Receitas Práticas com Ingredientes Acessíveis`,
        introTitle: "Apresentação e Regras de Ouro",
        introSubtitle: "Como aplicar este guia no seu dia a dia para obter resultados reais e duradouros.",
        introText: [generated.introduction || "Bem-vindo ao seu novo guia prático."],
        rulesTitle: "Instruções Fundamentais",
        rules: (generated.rulesOrTips || []).map((tip: string, i: number) => ({
          title: `Regra ${i + 1}`,
          text: tip,
        })),
        disclaimer:
          "Aviso Legal: O conteúdo deste guia destina-se a fins educativos e de bem-estar. Não substitui orientação de profissionais de saúde.",
        modules: [
          {
            id: 1,
            title: `Módulo 1: Fundamentos de ${category}`,
            range: `Capítulos #01 a #${newItems.length}`,
            description: "Aprenda passo a passo a transformar sua rotina com ingredientes naturais.",
          },
        ],
        items: newItems,
        bonus1: {
          title: "BÔNUS: Tabela de Ingredientes Principais",
          subtitle: "O que ter sempre na sua despensa",
          description: "Mantenha estes itens à mão para preparar as receitas com facilidade.",
          plants: [
            {
              name: "Ingrediente Chave",
              compound: "Princípio Ativo",
              usage: "Uso diário para vitalidade",
              recipes: "#01, #02",
            },
          ],
        },
        bonus2: {
          title: "BÔNUS: Cronograma Diário Sugerido",
          subtitle: "Os melhores horários para cada fórmula",
          description: "Potencialize seus resultados com o ritmo do seu metabolismo.",
          clock: [
            {
              time: "Manhã",
              state: "Despertar celular",
              formulas: "Fórmula de Jejum",
            },
          ],
        },
        weeklyPlan: {
          title: "Seu Plano Semanal de Ação",
          subtitle: "Como distribuir ao longo de 7 dias",
          principleTitle: "Constância e Simplicidade",
          principleText: generated.conclusion || "Mantenha o foco em 1 a 2 receitas por dia.",
          plans: [
            {
              objective: "Semana de Iniciação",
              morning: "Fórmula Matinal",
              noon: "Fórmula do Almoço",
              night: "Fórmula Noturna",
            },
          ],
          closingMessage: "Parabéns por cuidar da sua saúde com carinho e sabedoria!",
        },
      };

      onApplyEbook(newEbook);
      onClose();

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      alert(`Erro ao gerar eBook: ${err.message || err}. Verifique se o servidor está ativo.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-stone-200">
        <div className="flex justify-between items-center border-b pb-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
              <Sparkles className="w-5 h-5 text-amber-700" />
            </span>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Criar Novo eBook com Inteligência Artificial
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-stone-400 hover:text-stone-700 cursor-pointer font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="py-12 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-[#1e3f2d] mx-auto mb-4" />
            <h4 className="font-serif font-bold text-base text-stone-900 mb-1">
              Escrevendo e Formatando o seu Livro...
            </h4>
            <p className="text-xs text-stone-600 max-w-sm mx-auto">{loadingMessage}</p>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Qual é o tema ou título do seu novo eBook? *
              </label>
              <input
                type="text"
                placeholder="Ex: 50 Receitas de Chás e Sucos Medicinais para Dormir Bem..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            {/* Quick Presets */}
            <div>
              <span className="block font-semibold text-stone-600 mb-1.5">Ou escolha uma ideia pronta:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTopic(p.title);
                      setCategory("Herbolaria e Saúde Natural");
                    }}
                    className="p-2 border border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 rounded-lg text-left transition-colors cursor-pointer group"
                  >
                    <strong className="block text-stone-900 font-serif text-[11px] group-hover:text-amber-900">
                      {p.title}
                    </strong>
                    <span className="text-[10px] text-stone-500 line-clamp-1">{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="Saúde e Bem-estar">Saúde &amp; Bem-estar</option>
                  <option value="Herbolaria e Chás">Herbolaria &amp; Chás</option>
                  <option value="Culinária Saudável">Culinária Saudável</option>
                  <option value="Longevidade">Longevidade</option>
                  <option value="Guia Prático">Guia Prático</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Idioma</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="pt">Português (Brasil)</option>
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nº de Receitas</label>
                <select
                  value={numberOfItems}
                  onChange={(e) => setNumberOfItems(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value={4}>4 Receitas Iniciais</option>
                  <option value={6}>6 Receitas Completas</option>
                  <option value={8}>8 Receitas Selecionadas</option>
                  <option value={10}>10 Receitas de Ouro</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-stone-300 rounded-lg font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Gerar Meu eBook Agora</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
