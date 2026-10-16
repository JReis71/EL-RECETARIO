import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface ProgressCallback {
  (currentPage: number, totalPages: number, percentage: number): void;
}

export async function exportToPdf(
  pageSelector = ".a4-page",
  filename = "El_Recetario_Prohibido_de_la_Abuela_56_Paginas.pdf",
  onProgress?: ProgressCallback
): Promise<void> {
  const pages = document.querySelectorAll<HTMLElement>(pageSelector);
  const total = pages.length;

  if (total === 0) {
    throw new Error("Nenhuma página encontrada para gerar PDF.");
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  for (let i = 0; i < total; i++) {
    const page = pages[i];
    const pageNum = i + 1;
    const pct = Math.round((pageNum / total) * 100);

    if (onProgress) {
      onProgress(pageNum, total, pct);
    }

    // Small delay for UI repaint
    await new Promise((r) => setTimeout(r, 30));

    const canvas = await html2canvas(page, {
      scale: 1.5,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#f4f7f4",
      logging: false,
      imageTimeout: 10000,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.88);
    if (i > 0) {
      pdf.addPage();
    }
    // A4 dimensions: 210mm x 297mm
    pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, undefined, "FAST");
  }

  pdf.save(filename);
}

export function printDirectly() {
  window.print();
}

export function downloadHtmlFile(
  content: string,
  filename = "El_Recetario_Prohibido_de_la_Abuela_56_Paginas.html"
) {
  const blob = new Blob([content], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadJsonFile(
  data: any,
  filename = "meu-ebook-projeto.json"
) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
