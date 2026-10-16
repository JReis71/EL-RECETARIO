import React from "react";
import { BookOpen, Sparkles, Download, Layers, Compass, FileText } from "lucide-react";

interface HeaderProps {
  activeTab: "a4-reader" | "book-reader" | "studio" | "export";
  setActiveTab: (tab: "a4-reader" | "book-reader" | "studio" | "export") => void;
  onOpenAiModal: () => void;
  onExportPdf: () => void;
  recipeCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAiModal,
  onExportPdf,
  recipeCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#16291e] border-b border-[#2d4d3a] shadow-md no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-inner">
            <BookOpen className="w-5 h-5" />
          </div>
          <button
            onClick={() => setActiveTab("a4-reader")}
            className="text-left font-serif text-lg font-bold tracking-tight text-amber-100 hover:text-white transition-colors cursor-pointer"
          >
            <span>Criar Meu eBook</span>
            <span className="block text-[10px] tracking-widest uppercase font-sans text-amber-400 font-semibold">
              Studio &amp; Leitor 56 Páginas
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Clean single-line text links) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab("a4-reader")}
            className={`flex items-center gap-2 py-1.5 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "a4-reader"
                ? "border-amber-400 text-amber-300 font-semibold"
                : "border-transparent text-emerald-100/70 hover:text-white hover:border-emerald-600"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Páginas A4 (56)</span>
          </button>

          <button
            onClick={() => setActiveTab("book-reader")}
            className={`flex items-center gap-2 py-1.5 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "book-reader"
                ? "border-amber-400 text-amber-300 font-semibold"
                : "border-transparent text-emerald-100/70 hover:text-white hover:border-emerald-600"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Modo Livro &amp; Áudio</span>
          </button>

          <button
            onClick={() => setActiveTab("studio")}
            className={`flex items-center gap-2 py-1.5 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "studio"
                ? "border-amber-400 text-amber-300 font-semibold"
                : "border-transparent text-emerald-100/70 hover:text-white hover:border-emerald-600"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Editor &amp; Capa ({recipeCount})</span>
          </button>

          <button
            onClick={onOpenAiModal}
            className="flex items-center gap-1.5 text-amber-300/90 hover:text-amber-200 transition-colors py-1.5 whitespace-nowrap cursor-pointer font-medium"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Gerar com IA</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onExportPdf}
            className="px-4 py-2 text-xs md:text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Baixar PDF (56 Págs)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
