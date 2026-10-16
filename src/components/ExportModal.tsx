import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Download, Printer, FileCode, CheckCircle, Loader2, Sparkles, FolderArchive } from "lucide-react";
import { exportToPdf, printDirectly, downloadHtmlFile, downloadJsonFile } from "../utils/pdfExport";
import { EbookData } from "../types/ebook";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  ebook: EbookData;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, ebook }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  if (!isOpen) return null;

  const handleStartPdfExport = async () => {
    setIsExporting(true);
    setIsComplete(false);
    setProgressPercent(0);
    setStatusMessage("Preparando as 56 páginas do livro...");

    try {
      await exportToPdf(
        ".a4-page",
        `${ebook.title.replace(/[^a-zA-Z0-9]/g, "_")}_56_Paginas.pdf`,
        (current, total, pct) => {
          setProgressPercent(pct);
          setStatusMessage(`Processando página ${current} de ${total} (${pct}%)...`);
        }
      );

      setIsComplete(true);
      setStatusMessage("✅ PDF gerado com sucesso! O download foi iniciado.");
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      alert(`Ocorreu um erro ao gerar o PDF: ${err.message || err}. Você pode usar o botão de Impressão Direta como alternativa rápida.`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadHtml = () => {
    const fullHtml = `<!DOCTYPE html>
<html lang="${ebook.language}">
<head>
  <meta charset="UTF-8">
  <title>${ebook.title}</title>
  <style>
    @page { size: A4 portrait; margin: 10mm; }
    body { font-family: Georgia, serif; background: #cbd5cf; margin: 0; padding: 20px 0; }
    .a4-page { max-width: 210mm; min-height: 276mm; margin: 0 auto 20px auto; background: #f4f7f4; padding: 12mm; box-shadow: 0 4px 15px rgba(0,0,0,0.1); page-break-after: always; }
    @media print { body { background: none; } .a4-page { margin: 0; box-shadow: none; } }
  </style>
</head>
<body>
  ${document.getElementById("ebook-content")?.innerHTML || document.getElementById("root")?.innerHTML || ""}
</body>
</html>`;
    downloadHtmlFile(fullHtml, `${ebook.title.replace(/[^a-zA-Z0-9]/g, "_")}.html`);
  };

  const handleDownloadJson = () => {
    downloadJsonFile(ebook, `${ebook.title.replace(/[^a-zA-Z0-9]/g, "_")}_projeto.json`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
        <div className="flex justify-between items-center border-b pb-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
              <Download className="w-5 h-5" />
            </span>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Exportar Livro Digital
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="text-stone-400 hover:text-stone-700 cursor-pointer font-bold text-lg disabled:opacity-30"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar (Visible while generating) */}
        {isExporting && (
          <div className="bg-[#fdfbf7] border border-[#e8d5b5] rounded-xl p-4 mb-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Loader2 className="w-5 h-5 animate-spin text-amber-700" />
              <span className="font-serif font-bold text-sm text-stone-900">
                Gerando PDF em Alta Resolução...
              </span>
            </div>
            <p className="text-xs text-stone-600 mb-3">{statusMessage}</p>
            <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-700 to-amber-600 h-full transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-stone-500 mt-2">
              Aguarde alguns segundos sem fechar a aba. O download iniciará sozinho!
            </p>
          </div>
        )}

        {isComplete && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-5 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
            <div className="text-xs text-emerald-900">
              <strong className="block font-semibold">Sucesso!</strong>
              O arquivo PDF de 56 páginas foi processado e salvo no seu computador.
            </div>
          </div>
        )}

        {/* Action Options */}
        <div className="space-y-3">
          <button
            onClick={handleStartPdfExport}
            disabled={isExporting}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-amber-300 bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 transition-all text-left group cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 bg-amber-600 text-white rounded-lg shadow-xs">
                <Download className="w-5 h-5" />
              </span>
              <div>
                <strong className="block text-sm text-amber-950 font-serif">
                  Baixar PDF Completo (56 Páginas)
                </strong>
                <span className="text-xs text-amber-800/80">
                  Documento pronto para impressão ou leitura off-line com todas as 100 receitas
                </span>
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              onClose();
              printDirectly();
            }}
            disabled={isExporting}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-stone-200 hover:border-emerald-600 hover:bg-stone-50 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 bg-stone-100 text-stone-700 rounded-lg group-hover:bg-emerald-100 group-hover:text-emerald-800">
                <Printer className="w-5 h-5" />
              </span>
              <div>
                <strong className="block text-sm text-stone-900 font-serif">
                  Imprimir / Salvar via Navegador
                </strong>
                <span className="text-xs text-stone-500">
                  Abre a janela nativa de impressão com formatação A4 preservada
                </span>
              </div>
            </div>
          </button>

          <button
            onClick={handleDownloadHtml}
            disabled={isExporting}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-stone-200 hover:bg-stone-50 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 bg-stone-100 text-stone-700 rounded-lg">
                <FileCode className="w-4 h-4" />
              </span>
              <div>
                <strong className="block text-xs text-stone-900 font-sans">
                  Baixar Código do Livro (.HTML)
                </strong>
                <span className="text-[11px] text-stone-500">
                  Arquivo web autônomo que pode ser aberto em qualquer navegador sem internet
                </span>
              </div>
            </div>
          </button>

          <button
            onClick={handleDownloadJson}
            disabled={isExporting}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-stone-200 hover:bg-stone-50 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 bg-stone-100 text-stone-700 rounded-lg">
                <FolderArchive className="w-4 h-4" />
              </span>
              <div>
                <strong className="block text-xs text-stone-900 font-sans">
                  Exportar Backup do Projeto (.JSON)
                </strong>
                <span className="text-[11px] text-stone-500">
                  Guarda os dados do seu livro para reabrir e editar no estúdio a qualquer momento
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
