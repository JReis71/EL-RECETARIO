import React, { useState } from "react";
import { Volume2, VolumeX, Edit3 } from "lucide-react";
import { EbookItem } from "../types/ebook";
import { speechService } from "../utils/speech";

interface RecipeCardProps {
  recipe: EbookItem;
  onEdit?: (recipe: EbookItem) => void;
  language?: "es" | "pt" | "en";
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onEdit, language = "es" }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggleAudio = () => {
    if (isPlaying) {
      speechService.stop();
      setIsPlaying(false);
    } else {
      const langCode = language === "pt" ? "pt-BR" : language === "en" ? "en-US" : "es-ES";
      const fullText = `${recipe.title}. ${recipe.description}. Ingredientes: ${recipe.ingredients.join(
        ", "
      )}. Preparación: ${recipe.steps.join(". ")}. El Secreto de la Abuela: ${recipe.secret}`;

      speechService.speak(
        fullText,
        langCode,
        () => setIsPlaying(false),
        () => setIsPlaying(false)
      );
      setIsPlaying(true);
    }
  };

  return (
    <article className="bg-white border border-[#cbd8d0] border-t-4 border-t-[#2e5941] rounded-lg p-3.5 mb-3 shadow-[0_2px_6px_rgba(0,0,0,0.04)] break-inside-avoid">
      {/* Top Header Row */}
      <div className="flex justify-between items-center border-b border-dashed border-[#d4dfd8] pb-1.5 mb-2.5 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-[#1e3f2d] text-[#e0a94f] font-sans text-[11px] font-bold px-2 py-0.5 rounded tracking-wide whitespace-nowrap">
            RECETA #{recipe.num}
          </span>
          <h3 className="font-serif text-[15px] font-bold text-[#1e3f2d] leading-snug">
            {recipe.title}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-sans text-[10px] text-[#a86f1f] bg-[#fdf8f0] border border-[#e8d5b5] px-2 py-0.5 rounded font-semibold whitespace-nowrap hidden sm:inline-block">
            {recipe.meta}
          </span>

          {/* Interactive audio narration button */}
          <button
            onClick={handleToggleAudio}
            title={isPlaying ? "Parar leitura em áudio" : "Ouvir receita em áudio"}
            className={`p-1 rounded-md transition-colors cursor-pointer no-print ${
              isPlaying
                ? "bg-amber-100 text-amber-800"
                : "text-stone-500 hover:text-[#1e3f2d] hover:bg-stone-100"
            }`}
          >
            {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {onEdit && (
            <button
              onClick={() => onEdit(recipe)}
              title="Editar esta receita"
              className="p-1 rounded-md text-stone-400 hover:text-[#1e3f2d] hover:bg-stone-100 transition-colors cursor-pointer no-print"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Visual & Details Grid */}
      <div className="flex flex-col sm:flex-row gap-3 mb-2">
        {/* Photo with caption */}
        <div className="w-full sm:w-[34%] shrink-0">
          <div className="relative rounded-md overflow-hidden border border-[#e2ece5] bg-[#e9f0ec]">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-32 object-cover block"
              loading="lazy"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://placehold.co/400x280/1e3f2d/ffffff?text=Receta+Natural+%23${recipe.num}`;
              }}
            />
          </div>
          <p className="font-sans text-[9px] text-[#5c7065] text-center mt-1 italic">
            Fotografía ilustrativa • Receta #{recipe.num}
          </p>
        </div>

        {/* Content & Steps */}
        <div className="w-full sm:w-[66%] flex flex-col justify-between">
          <p className="text-[12px] text-[#3b4d43] italic bg-[#f4f7f4] p-1.5 rounded mb-2 leading-relaxed">
            {recipe.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="font-sans text-[10px] font-bold uppercase text-[#2e5941] block border-b border-[#e4ece7] pb-0.5 mb-1 tracking-wider">
                🌿 Ingredientes Exactos
              </span>
              <ul className="list-disc pl-3.5 space-y-0.5 text-[#26332b] leading-tight">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx}>{ing}</li>
                ))}
              </ul>
            </div>

            <div>
              <span className="font-sans text-[10px] font-bold uppercase text-[#2e5941] block border-b border-[#e4ece7] pb-0.5 mb-1 tracking-wider">
                🥣 Preparación Paso a Paso
              </span>
              <ol className="list-decimal pl-4 space-y-0.5 text-[#26332b] leading-tight">
                {recipe.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Abuela's Secret callout */}
      <div className="bg-[#fdf8f0] border-l-4 border-l-[#c88a32] p-2 rounded-r text-[11.5px] text-[#4a3b22] leading-snug">
        <strong className="font-semibold text-[#8a5716]">💡 El Secreto de la Abuela: </strong>
        <span>{recipe.secret}</span>
      </div>
    </article>
  );
};
