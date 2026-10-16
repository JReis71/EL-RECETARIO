import React, { useState } from "react";
import { Header } from "./components/Header";
import { A4PageView } from "./components/A4PageView";
import { BookReaderView } from "./components/BookReaderView";
import { EbookStudio } from "./components/EbookStudio";
import { ExportModal } from "./components/ExportModal";
import { AiGenerateModal } from "./components/AiGenerateModal";
import { initialEbook } from "./data/defaultEbook";
import { EbookData, EbookItem } from "./types/ebook";
import {
  Download,
  Printer,
  Search,
  Sparkles,
  Layers,
  Compass,
  FileEdit,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { printDirectly } from "./utils/pdfExport";

export default function App() {
  const [ebook, setEbook] = useState<EbookData>(initialEbook);
  const [activeTab, setActiveTab] = useState<"a4-reader" | "book-reader" | "studio" | "export">("a4-reader");
  const [filterQuery, setFilterQuery] = useState("");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const handleEditRecipe = (_recipe: EbookItem) => {
    setActiveTab("studio");
  };

  const jumpToPage = (pageNum: number) => {
    const el = document.getElementById(`page-${pageNum}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#cbd5cf] flex flex-col font-serif text-[#26332b]">
      {/* Top Bar (Follows Top Bar Contract) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onExportPdf={() => setIsExportModalOpen(true)}
        recipeCount={ebook.items.length}
      />

      {/* Floating Action Strip for Readers (Hidden on Print) */}
      <div className="bg-[#122319] text-white border-b-2 border-[#c88a32] px-4 py-2.5 shadow-md sticky top-16 z-30 no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Buscar por planta, queixa ou receita..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#1b3325] border border-[#2d553e] rounded-md text-white placeholder-stone-400 text-xs focus:outline-hidden focus:border-amber-400"
            />
            {filterQuery && (
              <button
                onClick={() => setFilterQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Jump Buttons for A4 Pages */}
          {activeTab === "a4-reader" && (
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-[#e0a94f]">
              <span className="font-semibold text-white">Ir para:</span>
              <button
                onClick={() => jumpToPage(1)}
                className="px-2 py-0.5 rounded bg-[#1f3b2b] hover:bg-[#2b523c] text-white cursor-pointer"
              >
                Capa
              </button>
              <button
                onClick={() => jumpToPage(2)}
                className="px-2 py-0.5 rounded bg-[#1f3b2b] hover:bg-[#2b523c] text-white cursor-pointer"
              >
                Regras
              </button>
              <button
                onClick={() => jumpToPage(3)}
                className="px-2 py-0.5 rounded bg-[#1f3b2b] hover:bg-[#2b523c] text-white cursor-pointer"
              >
                Índice
              </button>
              <button
                onClick={() => jumpToPage(4)}
                className="px-2 py-0.5 rounded bg-[#1f3b2b] hover:bg-[#2b523c] text-white cursor-pointer"
              >
                Mód 1 (Sono)
              </button>
              <button
                onClick={() => jumpToPage(14)}
                className="px-2 py-0.5 rounded bg-[#1f3b2b] hover:bg-[#2b523c] text-white cursor-pointer"
              >
                Mód 2 (Articulação)
              </button>
              <button
                onClick={() => jumpToPage(24)}
                className="px-2 py-0.5 rounded bg-[#1f3b2b] hover:bg-[#2b523c] text-white cursor-pointer"
              >
                Mód 3 (Digestão)
              </button>
              <button
                onClick={() => jumpToPage(34)}
                className="px-2 py-0.5 rounded bg-[#1f3b2b] hover:bg-[#2b523c] text-white cursor-pointer"
              >
                Mód 4 (Circulação)
              </button>
              <button
                onClick={() => jumpToPage(44)}
                className="px-2 py-0.5 rounded bg-[#1f3b2b] hover:bg-[#2b523c] text-white cursor-pointer"
              >
                Mód 5 (Imunidade)
              </button>
              <button
                onClick={() => jumpToPage(54)}
                className="px-2 py-0.5 rounded bg-[#1f3b2b] hover:bg-[#2b523c] text-amber-300 font-bold cursor-pointer"
              >
                Bonos 1 &amp; 2
              </button>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => printDirectly()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#244231] hover:bg-[#2d553e] text-white font-medium cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Imprimir A4</span>
            </button>

            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#c88a32] hover:bg-[#b07727] text-white font-bold cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar PDF Completo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full" id="ebook-content">
        {activeTab === "a4-reader" && (
          <A4PageView
            ebook={ebook}
            onEditRecipe={handleEditRecipe}
            filterQuery={filterQuery}
          />
        )}

        {activeTab === "book-reader" && (
          <BookReaderView
            ebook={ebook}
            onOpenStudio={() => setActiveTab("studio")}
          />
        )}

        {activeTab === "studio" && (
          <EbookStudio
            ebook={ebook}
            onUpdateEbook={setEbook}
            onOpenAiModal={() => setIsAiModalOpen(true)}
            onExportPdf={() => setIsExportModalOpen(true)}
          />
        )}
      </main>

      {/* Modals */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        ebook={ebook}
      />

      <AiGenerateModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplyEbook={(newBook) => {
          setEbook(newBook);
          setActiveTab("a4-reader");
        }}
      />
    </div>
  );
}
