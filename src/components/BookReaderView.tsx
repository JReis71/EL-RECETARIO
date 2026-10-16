import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Volume2,
  VolumeX,
  Type,
  List,
  Sparkles,
} from "lucide-react";
import { EbookData, EbookItem } from "../types/ebook";
import { speechService } from "../utils/speech";

interface BookReaderViewProps {
  ebook: EbookData;
  onOpenStudio?: () => void;
}

export const BookReaderView: React.FC<BookReaderViewProps> = ({
  ebook,
  onOpenStudio,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");
  const [theme, setTheme] = useState<"parchment" | "white" | "dark">("parchment");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("ebook_bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showToc, setShowToc] = useState(false);

  const currentItem: EbookItem | undefined = ebook.items[currentIndex];

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id];
      try {
        localStorage.setItem("ebook_bookmarks", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleNext = () => {
    if (currentIndex < ebook.items.length - 1) {
      speechService.stop();
      setIsSpeaking(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      speechService.stop();
      setIsSpeaking(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleToggleSpeech = () => {
    if (!currentItem) return;

    if (isSpeaking) {
      speechService.stop();
      setIsSpeaking(false);
    } else {
      const langCode = ebook.language === "pt" ? "pt-BR" : ebook.language === "en" ? "en-US" : "es-ES";
      const narration = `${currentItem.title}. ${currentItem.description}. Ingredientes requeridos: ${currentItem.ingredients.join(
        ", "
      )}. Preparación paso a paso: ${currentItem.steps.join(". ")}. El Secreto de la Abuela: ${currentItem.secret}`;

      speechService.speak(
        narration,
        langCode,
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
      setIsSpeaking(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      speechService.stop();
    };
  }, [currentIndex, ebook.items.length]);

  if (!currentItem) {
    return (
      <div className="p-8 text-center text-stone-600">
        Nenhuma receita encontrada para leitura.
      </div>
    );
  }

  const isBookmarked = bookmarks.includes(currentItem.id);

  // Theme styles
  const themeBg =
    theme === "dark"
      ? "bg-[#141b17] text-stone-200"
      : theme === "white"
      ? "bg-white text-stone-900"
      : "bg-[#f9f6ee] text-[#242b26]";

  const cardBorder =
    theme === "dark"
      ? "border-emerald-950/60 bg-[#1a231e]"
      : theme === "white"
      ? "border-stone-200 bg-stone-50"
      : "border-[#e0d9ca] bg-[#fbf9f4]";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Control Utility Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-stone-200 p-3 rounded-xl shadow-xs mb-6 no-print">
        {/* Navigation & TOC */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowToc(!showToc)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            <List className="w-4 h-4" />
            <span>Índice ({currentIndex + 1}/{ebook.items.length})</span>
          </button>

          <button
            onClick={() => toggleBookmark(currentItem.id)}
            title="Marcar como favorito"
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isBookmarked
                ? "bg-amber-100 border-amber-300 text-amber-800"
                : "border-stone-200 text-stone-500 hover:bg-stone-100"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-amber-700" : ""}`} />
          </button>
        </div>

        {/* Audio narration */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSpeech}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              isSpeaking
                ? "bg-amber-600 text-white animate-pulse"
                : "bg-emerald-800 text-white hover:bg-emerald-700"
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isSpeaking ? "Pausar Áudio" : "Ouvir Receita"}</span>
          </button>
        </div>

        {/* Font size & Theme selectors */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-stone-200 rounded-lg p-0.5 bg-stone-50 text-xs">
            <button
              onClick={() => setFontSize("sm")}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                fontSize === "sm" ? "bg-white font-bold shadow-xs text-stone-900" : "text-stone-500"
              }`}
            >
              A-
            </button>
            <button
              onClick={() => setFontSize("base")}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                fontSize === "base" ? "bg-white font-bold shadow-xs text-stone-900" : "text-stone-500"
              }`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize("lg")}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                fontSize === "lg" ? "bg-white font-bold shadow-xs text-stone-900" : "text-stone-500"
              }`}
            >
              A+
            </button>
          </div>

          <div className="flex items-center border border-stone-200 rounded-lg p-0.5 bg-stone-50 text-xs">
            <button
              onClick={() => setTheme("parchment")}
              title="Tema Pergaminho"
              className={`w-6 h-6 rounded-md border transition-all cursor-pointer ${
                theme === "parchment" ? "ring-2 ring-amber-600 border-transparent bg-[#f9f6ee]" : "border-stone-300 bg-[#f9f6ee]"
              }`}
            />
            <button
              onClick={() => setTheme("white")}
              title="Tema Branco Puro"
              className={`w-6 h-6 rounded-md border transition-all ml-1 cursor-pointer ${
                theme === "white" ? "ring-2 ring-stone-900 border-transparent bg-white" : "border-stone-300 bg-white"
              }`}
            />
            <button
              onClick={() => setTheme("dark")}
              title="Tema Noturno"
              className={`w-6 h-6 rounded-md border transition-all ml-1 cursor-pointer ${
                theme === "dark" ? "ring-2 ring-emerald-400 border-transparent bg-[#141b17]" : "border-stone-300 bg-[#141b17]"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Table of Contents Drawer */}
      {showToc && (
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-lg mb-6 max-h-72 overflow-y-auto no-print">
          <div className="flex justify-between items-center mb-3 border-b pb-2">
            <h4 className="font-serif font-bold text-sm text-[#1e3f2d]">
              Índice das 100 Receitas
            </h4>
            <span className="text-xs text-stone-500">Clique para pular para a receita</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
            {ebook.items.map((it, idx) => (
              <button
                key={it.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setShowToc(false);
                }}
                className={`text-left p-1.5 rounded transition-colors truncate flex items-center justify-between cursor-pointer ${
                  currentIndex === idx
                    ? "bg-[#1e3f2d] text-white font-semibold"
                    : "hover:bg-stone-100 text-stone-700"
                }`}
              >
                <span className="truncate">
                  #{it.num} {it.title}
                </span>
                <span className="text-[10px] opacity-70 ml-1">Mód {it.moduleIndex}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Book Stage Canvas */}
      <div
        className={`${themeBg} border border-stone-300/80 rounded-2xl p-6 sm:p-10 shadow-xl transition-all duration-300 relative`}
      >
        {/* Module Sub-Header */}
        <div className="flex items-center justify-between border-b border-stone-300/60 pb-3 mb-6">
          <div className="text-xs font-sans tracking-widest uppercase font-semibold text-[#8a5716]">
            {currentItem.moduleTitle} • Receita #{currentItem.num} de {ebook.items.length}
          </div>
          <span className="text-xs opacity-75 font-serif italic">{currentItem.meta}</span>
        </div>

        {/* Hero Section of the Recipe */}
        <div className="flex flex-col md:flex-row gap-6 items-start mb-6">
          <div className="w-full md:w-5/12 shrink-0">
            <div className="rounded-xl overflow-hidden border-2 border-[#c88a32]/60 shadow-md">
              <img
                src={currentItem.imageUrl}
                alt={currentItem.title}
                className="w-full h-56 object-cover"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-[11px] text-center opacity-75 mt-1.5 italic font-serif">
              Fotografía botânica da preparação #{currentItem.num}
            </p>
          </div>

          <div className="w-full md:w-7/12">
            <h2
              className={`font-serif font-extrabold text-[#1e3f2d] dark:text-emerald-300 mb-3 leading-tight ${
                fontSize === "sm"
                  ? "text-xl sm:text-2xl"
                  : fontSize === "lg"
                  ? "text-2xl sm:text-3xl"
                  : "text-2xl sm:text-3xl"
              }`}
            >
              {currentItem.title}
            </h2>

            <p
              className={`italic leading-relaxed p-3 rounded-lg border mb-4 font-serif ${cardBorder} ${
                fontSize === "sm" ? "text-xs" : fontSize === "lg" ? "text-sm" : "text-[13px]"
              }`}
            >
              "{currentItem.description}"
            </p>

            {/* Ingredients block */}
            <div className="mb-4">
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#2e5941] dark:text-emerald-400 border-b border-stone-300/50 pb-1 mb-2">
                🌿 Ingredientes Necessários
              </h3>
              <ul
                className={`list-disc pl-5 space-y-1 ${
                  fontSize === "sm" ? "text-xs" : fontSize === "lg" ? "text-base" : "text-sm"
                }`}
              >
                {currentItem.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="mb-6">
          <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#2e5941] dark:text-emerald-400 border-b border-stone-300/50 pb-1 mb-3">
            🥣 Modo de Preparo Passo a Passo
          </h3>
          <ol
            className={`list-decimal pl-6 space-y-2 leading-relaxed ${
              fontSize === "sm" ? "text-xs" : fontSize === "lg" ? "text-base" : "text-sm"
            }`}
          >
            {currentItem.steps.map((st, i) => (
              <li key={i} className="pl-1">
                {st}
              </li>
            ))}
          </ol>
        </div>

        {/* Abuela's Secret callout */}
        <div className="bg-[#fef9ee] dark:bg-[#252f28] border-l-4 border-l-[#c88a32] p-4 rounded-r-lg shadow-xs">
          <h4 className="font-serif font-bold text-sm text-[#8a5716] dark:text-amber-300 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            O Segredo Ancestral da Vovó:
          </h4>
          <p
            className={`italic leading-relaxed ${
              fontSize === "sm" ? "text-xs" : fontSize === "lg" ? "text-sm" : "text-xs"
            }`}
          >
            {currentItem.secret}
          </p>
        </div>

        {/* Page Turner Bar */}
        <div className="flex items-center justify-between border-t border-stone-300/60 pt-4 mt-8">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-xs transition-colors cursor-pointer ${
              currentIndex === 0
                ? "opacity-30 cursor-not-allowed"
                : "bg-[#1e3f2d] text-white hover:bg-[#2a553e]"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Receita Anterior</span>
          </button>

          <span className="text-xs font-sans text-stone-500">
            {currentIndex + 1} de {ebook.items.length}
          </span>

          <button
            onClick={handleNext}
            disabled={currentIndex === ebook.items.length - 1}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-xs transition-colors cursor-pointer ${
              currentIndex === ebook.items.length - 1
                ? "opacity-30 cursor-not-allowed"
                : "bg-[#1e3f2d] text-white hover:bg-[#2a553e]"
            }`}
          >
            <span>Próxima Receita</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
