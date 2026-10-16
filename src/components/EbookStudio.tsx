import React, { useState } from "react";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit,
  Save,
  Sparkles,
  Image as ImageIcon,
  Book,
  Download,
  Upload,
} from "lucide-react";
import { EbookData, EbookItem } from "../types/ebook";

interface EbookStudioProps {
  ebook: EbookData;
  onUpdateEbook: (updated: EbookData) => void;
  onOpenAiModal: () => void;
  onExportPdf: () => void;
}

export const EbookStudio: React.FC<EbookStudioProps> = ({
  ebook,
  onUpdateEbook,
  onOpenAiModal,
  onExportPdf,
}) => {
  const [activeSection, setActiveSection] = useState<"items" | "cover" | "intro">("items");
  const [editingItem, setEditingItem] = useState<EbookItem | null>(null);
  const [isNewItemModal, setIsNewItemModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  // Metadata state
  const [title, setTitle] = useState(ebook.title);
  const [subtitle, setSubtitle] = useState(ebook.subtitle);
  const [author, setAuthor] = useState(ebook.author);
  const [editionBadge, setEditionBadge] = useState(ebook.editionBadge);
  const [coverImage, setCoverImage] = useState(ebook.coverImage);

  // New/Edit Item form states
  const [formNum, setFormNum] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formMeta, setFormMeta] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formImg, setFormImg] = useState("");
  const [formIngredients, setFormIngredients] = useState("");
  const [formSteps, setFormSteps] = useState("");
  const [formSecret, setFormSecret] = useState("");
  const [formModuleIndex, setFormModuleIndex] = useState(1);

  const handleSaveMetadata = () => {
    onUpdateEbook({
      ...ebook,
      title,
      subtitle,
      author,
      editionBadge,
      coverImage,
    });
    alert("Dados da capa e livro atualizados com sucesso!");
  };

  const openEditModal = (item: EbookItem) => {
    setEditingItem(item);
    setFormNum(item.num);
    setFormTitle(item.title);
    setFormMeta(item.meta);
    setFormDesc(item.description);
    setFormImg(item.imageUrl);
    setFormIngredients(item.ingredients.join("\n"));
    setFormSteps(item.steps.join("\n"));
    setFormSecret(item.secret);
    setFormModuleIndex(item.moduleIndex);
    setIsNewItemModal(true);
  };

  const openNewModal = () => {
    const nextNum = String(ebook.items.length + 1).padStart(2, "0");
    setEditingItem(null);
    setFormNum(nextNum);
    setFormTitle("");
    setFormMeta("Tiempo: 10 min | Uso: Diário");
    setFormDesc("");
    setFormImg("https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80");
    setFormIngredients("Ingrediente 1\nIngrediente 2\nIngrediente 3");
    setFormSteps("Paso 1: Preparar los ingredientes.\nPaso 2: Hervir o infusionar.\nPaso 3: Servir tibio.");
    setFormSecret("Consejo o secreto de preparación de la abuela.");
    setFormModuleIndex(1);
    setIsNewItemModal(true);
  };

  const handleSaveItem = () => {
    if (!formTitle.trim()) {
      alert("Por favor, preencha o título da receita/capítulo.");
      return;
    }

    const ingredientsArr = formIngredients
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const stepsArr = formSteps
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const modTitle = ebook.modules[formModuleIndex - 1]?.title || `Módulo ${formModuleIndex}`;

    if (editingItem) {
      // Update
      const updatedItems = ebook.items.map((it) =>
        it.id === editingItem.id
          ? {
              ...it,
              num: formNum,
              title: formTitle,
              meta: formMeta,
              description: formDesc,
              imageUrl: formImg,
              ingredients: ingredientsArr,
              steps: stepsArr,
              secret: formSecret,
              moduleIndex: formModuleIndex,
              moduleTitle: modTitle,
            }
          : it
      );
      onUpdateEbook({ ...ebook, items: updatedItems });
    } else {
      // Create new
      const newItem: EbookItem = {
        id: `custom-item-${Date.now()}`,
        num: formNum,
        title: formTitle,
        meta: formMeta,
        description: formDesc,
        imageUrl: formImg,
        ingredients: ingredientsArr,
        steps: stepsArr,
        secret: formSecret,
        moduleIndex: formModuleIndex,
        moduleTitle: modTitle,
      };
      onUpdateEbook({ ...ebook, items: [...ebook.items, newItem] });
    }

    setIsNewItemModal(false);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta receita/capítulo do eBook?")) {
      const filtered = ebook.items.filter((it) => it.id !== id);
      onUpdateEbook({ ...ebook, items: filtered });
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const items = [...ebook.items];
    const temp = items[index];
    items[index] = items[index - 1];
    items[index - 1] = temp;
    onUpdateEbook({ ...ebook, items });
  };

  const handleMoveDown = (index: number) => {
    if (index >= ebook.items.length - 1) return;
    const items = [...ebook.items];
    const temp = items[index];
    items[index] = items[index + 1];
    items[index + 1] = temp;
    onUpdateEbook({ ...ebook, items });
  };

  const filteredItems = ebook.items.filter((it) => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      it.title.toLowerCase().includes(q) ||
      it.description.toLowerCase().includes(q) ||
      it.ingredients.some((ing) => ing.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Studio Header Ribbon */}
      <div className="bg-[#1e3f2d] text-white p-6 rounded-2xl shadow-lg border border-[#37664c] mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-1">
            Estúdio Criativo
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
            Criador &amp; Editor do Meu eBook
          </h2>
          <p className="text-sm text-emerald-100/80 mt-1 max-w-xl">
            Edite os 100 remédios ilustrados, altere capas, crie novos capítulos ou utilize a IA para gerar novos livros temáticos instantaneamente.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={onOpenAiModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-stone-950" />
            <span>Gerar Livro com IA</span>
          </button>

          <button
            onClick={openNewModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2e5941] hover:bg-[#396d4f] border border-[#c88a32] text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Adicionar Receita</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 mb-6 gap-6">
        <button
          onClick={() => setActiveSection("items")}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
            activeSection === "items"
              ? "border-[#1e3f2d] text-[#1e3f2d]"
              : "border-transparent text-stone-500 hover:text-stone-900"
          }`}
        >
          Receitas &amp; Capítulos ({ebook.items.length})
        </button>

        <button
          onClick={() => setActiveSection("cover")}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
            activeSection === "cover"
              ? "border-[#1e3f2d] text-[#1e3f2d]"
              : "border-transparent text-stone-500 hover:text-stone-900"
          }`}
        >
          Design da Capa &amp; Título
        </button>

        <button
          onClick={() => setActiveSection("intro")}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
            activeSection === "intro"
              ? "border-[#1e3f2d] text-[#1e3f2d]"
              : "border-transparent text-stone-500 hover:text-stone-900"
          }`}
        >
          Introdução &amp; Regras
        </button>
      </div>

      {/* SECTION: ITEMS LIST */}
      {activeSection === "items" && (
        <div>
          {/* Search bar */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <input
              type="text"
              placeholder="Buscar receitas por ingrediente, nome ou queixa..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full max-w-md px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-700 bg-white"
            />

            <span className="text-xs text-stone-500 whitespace-nowrap">
              Mostrando {filteredItems.length} de {ebook.items.length} itens
            </span>
          </div>

          <div className="space-y-3">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-emerald-700/40 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-16 h-16 rounded-lg object-cover border border-stone-200 shrink-0"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-[#1e3f2d] text-[#e0a94f] text-[10px] font-bold px-2 py-0.5 rounded">
                        #{item.num}
                      </span>
                      <span className="text-xs text-stone-500 font-sans">{item.moduleTitle}</span>
                    </div>
                    <h4 className="font-serif font-bold text-stone-900 text-sm">
                      {item.title}
                    </h4>
                    <p className="text-xs text-stone-600 line-clamp-1 italic max-w-xl">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleMoveUp(idx)}
                    disabled={idx === 0}
                    title="Subir posição"
                    className="p-1.5 rounded-md border border-stone-200 text-stone-500 hover:bg-stone-100 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleMoveDown(idx)}
                    disabled={idx === ebook.items.length - 1}
                    title="Descer posição"
                    className="p-1.5 rounded-md border border-stone-200 text-stone-500 hover:bg-stone-100 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => openEditModal(item)}
                    title="Editar"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    title="Excluir"
                    className="p-1.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: COVER DESIGN */}
      {activeSection === "cover" && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs max-w-3xl">
          <h3 className="font-serif font-bold text-lg text-stone-900 mb-4">
            Personalizar Capa &amp; Informações da Obra
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Título Principal do eBook</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-700 font-serif font-bold text-base"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Subtítulo / Promessa de Transformação</label>
              <textarea
                rows={3}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Selo de Destaque / Edição</label>
                <input
                  type="text"
                  value={editionBadge}
                  onChange={(e) => setEditionBadge(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Autor / Crédito Editorial</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">URL da Imagem de Destaque da Capa</label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-700"
              />
              {coverImage && (
                <div className="mt-2 max-w-sm rounded-lg overflow-hidden border">
                  <img src={coverImage} alt="Preview" className="w-full h-36 object-cover" />
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <button
                onClick={handleSaveMetadata}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1e3f2d] hover:bg-[#2d5941] text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Alterações da Capa</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: INTRO & RULES */}
      {activeSection === "intro" && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs max-w-3xl">
          <h3 className="font-serif font-bold text-lg text-stone-900 mb-4">
            Introdução e Orientações Iniciais
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Título da Seção de Boas-vindas</label>
              <input
                type="text"
                value={ebook.introTitle}
                onChange={(e) => onUpdateEbook({ ...ebook, introTitle: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Texto Introdutório</label>
              <textarea
                rows={4}
                value={ebook.introText.join("\n\n")}
                onChange={(e) =>
                  onUpdateEbook({
                    ...ebook,
                    introText: e.target.value.split("\n\n").filter(Boolean),
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Aviso Legal &amp; Disclaimer</label>
              <textarea
                rows={3}
                value={ebook.disclaimer}
                onChange={(e) => onUpdateEbook({ ...ebook, disclaimer: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-stone-600 italic"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT RECIPE */}
      {isNewItemModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="font-serif font-bold text-lg text-[#1e3f2d]">
                {editingItem ? `Editar Receita #${formNum}` : "Nova Receita / Capítulo"}
              </h3>
              <button
                onClick={() => setIsNewItemModal(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer font-bold text-base"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Número (#)</label>
                  <input
                    type="text"
                    value={formNum}
                    onChange={(e) => setFormNum(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Módulo (1 a 5)</label>
                  <select
                    value={formModuleIndex}
                    onChange={(e) => setFormModuleIndex(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value={1}>1. Sueño y Calma</option>
                    <option value={2}>2. Desinflamación</option>
                    <option value={3}>3. Digestión</option>
                    <option value={4}>4. Energía y Glucosa</option>
                    <option value={5}>5. Respiratorio</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Meta / Duração</label>
                  <input
                    type="text"
                    value={formMeta}
                    onChange={(e) => setFormMeta(e.target.value)}
                    placeholder="Tiempo: 8 min | Uso: Diário"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nome da Receita</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg font-serif font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Descrição / Benefício Principal</label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">URL da Imagem da Receita</label>
                <input
                  type="text"
                  value={formImg}
                  onChange={(e) => setFormImg(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Ingredientes (1 por linha)</label>
                  <textarea
                    rows={4}
                    value={formIngredients}
                    onChange={(e) => setFormIngredients(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Passos de Preparo (1 por linha)</label>
                  <textarea
                    rows={4}
                    value={formSteps}
                    onChange={(e) => setFormSteps(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">💡 O Segredo da Vovó</label>
                <textarea
                  rows={2}
                  value={formSecret}
                  onChange={(e) => setFormSecret(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-amber-50/50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 mt-5 border-t pt-4">
              <button
                onClick={() => setIsNewItemModal(false)}
                className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveItem}
                className="px-5 py-2 bg-[#1e3f2d] hover:bg-[#2b553e] rounded-lg text-xs font-bold text-white cursor-pointer shadow-sm"
              >
                {editingItem ? "Salvar Alterações" : "Adicionar Receita"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
