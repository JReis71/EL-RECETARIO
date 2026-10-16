import React from "react";
import { EbookData, EbookItem } from "../types/ebook";
import { RecipeCard } from "./RecipeCard";

interface A4PageViewProps {
  ebook: EbookData;
  onEditRecipe?: (recipe: EbookItem) => void;
  filterQuery?: string;
}

export const A4PageView: React.FC<A4PageViewProps> = ({
  ebook,
  onEditRecipe,
  filterQuery = "",
}) => {
  const totalExpectedPages = 56;
  const filteredItems = ebook.items.filter((item) => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.ingredients.some((ing) => ing.toLowerCase().includes(q)) ||
      item.secret.toLowerCase().includes(q) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  // Calculate pairs of 2 recipes per page
  const recipePairs: [EbookItem, EbookItem | undefined][] = [];
  for (let i = 0; i < filteredItems.length; i += 2) {
    recipePairs.push([filteredItems[i], filteredItems[i + 1]]);
  }

  return (
    <div className="w-full flex flex-col items-center py-6 px-2 sm:px-4">
      {/* ================= PÁGINA 1: CAPA ILUSTRADA ================= */}
      {(!filterQuery || "portada capa inicio".includes(filterQuery.toLowerCase())) && (
        <section className="a4-page p-6 sm:p-10" id="page-1">
          <div className="bg-[#1e3f2d] text-white text-center p-8 sm:p-12 border-4 sm:border-8 border-double border-[#c88a32] rounded-xl h-full flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <span className="inline-block bg-[#c88a32] text-white font-sans text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded mb-4 shadow">
                {ebook.editionBadge}
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-wide text-white mt-2 leading-tight">
                {ebook.title}
              </h1>
              <p className="text-sm sm:text-base text-[#dce5df] italic max-w-xl mx-auto mt-4 leading-relaxed font-serif">
                {ebook.subtitle}
              </p>
            </div>

            <div className="my-6 relative z-10">
              <img
                src={ebook.coverImage}
                alt="Portada Ilustrada"
                className="w-full max-h-72 object-cover rounded-lg border-2 sm:border-4 border-[#c88a32] shadow-xl mx-auto"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="relative z-10">
              <div className="bg-white/10 backdrop-blur-xs border border-[#c88a32]/60 rounded-lg p-3 sm:p-4 mb-4">
                <p className="text-center text-xs sm:text-sm text-white font-sans font-medium leading-relaxed">
                  <strong>CONTENIDO INTEGRAL DE ESTA EDICIÓN:</strong>
                  <br />
                  {ebook.coverHeroText}
                </p>
              </div>

              <div className="text-[11px] uppercase tracking-widest text-[#e0a94f] font-sans font-semibold">
                {ebook.author} • Página 1 de {totalExpectedPages}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= PÁGINA 2: INTRODUCCIÓN Y REGLAS DE ORO ================= */}
      {(!filterQuery || "reglas introduccion preparacion".includes(filterQuery.toLowerCase())) && (
        <section className="a4-page" id="page-2">
          <div>
            <div className="bg-[#1e3f2d] text-white p-4 border-l-4 border-l-[#c88a32] rounded-md mb-4 shadow-sm">
              <h2 className="font-sans text-base font-bold text-[#e0a94f] uppercase tracking-wide">
                {ebook.introTitle}
              </h2>
              <p className="text-xs text-[#dce5df] mt-1">{ebook.introSubtitle}</p>
            </div>

            <div className="bg-white border border-[#d4dfd8] rounded-lg p-4 mb-3.5 shadow-xs">
              <h3 className="font-serif text-base font-bold text-[#1e3f2d] mb-2">
                El Secreto Mejor Guardado de Nuestras Raíces
              </h3>
              {ebook.introText.map((p, idx) => (
                <p key={idx} className="text-xs text-[#26332b] leading-relaxed mb-2 last:mb-0">
                  {p}
                </p>
              ))}
            </div>

            <div className="bg-white border border-[#d4dfd8] rounded-lg p-4 mb-3.5 shadow-xs">
              <h3 className="font-serif text-base font-bold text-[#1e3f2d] mb-2">
                {ebook.rulesTitle}
              </h3>
              <ul className="space-y-2 text-xs text-[#26332b]">
                {ebook.rules.map((rule, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <strong className="text-[#1e3f2d] font-semibold">{rule.title}: </strong>
                    <span>{rule.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#e9f0ec] border-l-4 border-l-[#2e5941] p-3 rounded text-[11px] text-[#485950] italic leading-snug">
              {ebook.disclaimer}
            </div>
          </div>

          <footer className="border-t border-[#d4dfd8] pt-2 mt-4 flex justify-between text-[11px] text-[#5c7065] font-sans">
            <span>El Recetario Prohibido de la Abuela • Introducción &amp; Reglas</span>
            <span>
              <strong>Página 2 de {totalExpectedPages}</strong>
            </span>
          </footer>
        </section>
      )}

      {/* ================= PÁGINA 3: ÍNDICE GENERAL DOS 5 MÓDULOS ================= */}
      {(!filterQuery || "indice modulos catalogo".includes(filterQuery.toLowerCase())) && (
        <section className="a4-page" id="page-3">
          <div>
            <div className="bg-[#1e3f2d] text-white p-4 border-l-4 border-l-[#c88a32] rounded-md mb-4 shadow-sm">
              <h2 className="font-sans text-base font-bold text-[#e0a94f] uppercase tracking-wide">
                Índice General de las 100 Recetas por Módulo Terapéutico
              </h2>
              <p className="text-xs text-[#dce5df] mt-1">
                Localiza rápidamente la página exacta del remedio que necesitas según tu objetivo de salud.
              </p>
            </div>

            <div className="overflow-x-auto bg-white border border-[#dce5df] rounded-lg shadow-xs mb-4">
              <table className="w-full border-collapse text-[11.5px] font-sans">
                <thead>
                  <tr className="bg-[#1e3f2d] text-white text-left">
                    <th className="p-2.5 border-b border-[#2d4d3a] w-[20%]">Páginas</th>
                    <th className="p-2.5 border-b border-[#2d4d3a] w-[30%]">Módulo Terapéutico</th>
                    <th className="p-2.5 border-b border-[#2d4d3a] w-[50%]">Recetas Ilustradas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8ece9]">
                  <tr>
                    <td className="p-2.5 font-semibold text-[#1e3f2d] align-top">
                      Páginas 4 a 13
                      <span className="block text-[10px] text-[#a86f1f]">#01 a #20</span>
                    </td>
                    <td className="p-2.5 font-semibold text-[#1e3f2d] align-top">
                      MÓDULO 1:
                      <br />
                      Sueño Profundo y Calma
                    </td>
                    <td className="p-2.5 text-stone-600 align-top leading-snug">
                      Laurel, Lechuga Silvestre, Leche Dorada, Pasiflora, Mandarina, Toronjil, Valeriana, Baño de Epsom, Tila, Lúpulo, Naranjo Agrio, Avena, Cedrón, Cereza Ácida, Mejorana, Pétalos de Rosa, Albahaca Morada, Semillas de Amapola, Triple Calma, Plátano con Cáscara, Bruma de Azahar.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-[#1e3f2d] align-top">
                      Páginas 14 a 23
                      <span className="block text-[10px] text-[#a86f1f]">#21 a #40</span>
                    </td>
                    <td className="p-2.5 font-semibold text-[#1e3f2d] align-top">
                      MÓDULO 2:
                      <br />
                      Desinflamación y Articulaciones
                    </td>
                    <td className="p-2.5 text-stone-600 align-top leading-snug">
                      Cúrcuma Activada, Cáscara de Piña, Romero y Clavo, Jengibre con Epsom, Cola de Caballo y Ortiga, Ajo y Orégano, Semillas de Apio, Pepino y Perejil, Hojas de Repollo, Sauce Blanco, Gel de Sábila, Barbas de Maíz, Papaya y Chía, Uña de Gato, Ungüento de Cayena, Ajo Negro, Trío Mediterráneo, Baño de Vinagre, Diente de León, Caldo Mineralizante de Huesos.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-[#1e3f2d] align-top">
                      Páginas 24 a 33
                      <span className="block text-[10px] text-[#a86f1f]">#41 a #60</span>
                    </td>
                    <td className="p-2.5 font-semibold text-[#1e3f2d] align-top">
                      MÓDULO 3:
                      <br />
                      Digestión Ligera y Vientre Plano
                    </td>
                    <td className="p-2.5 text-stone-600 align-top leading-snug">
                      Hinojo y Anís, Sábila y Papaya, Papa Cruda, Alcachofa, Tridosha Comino/Cilantro, Linaza y Ciruela, Vinagre de Manzana, Boldo, Jengibre con Sal Marina, Higuera, Agua de Coco con Chía, Cáscara de Granada, Manzana Asada Prebiótica, Orégano y Tomillo, Arroz Tostado, Hierbabuena con Laurel, Llantén, Clavo e Hinojo, Semillas de Cilantro, Aceite de Ricino.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-[#1e3f2d] align-top">
                      Páginas 34 a 43
                      <span className="block text-[10px] text-[#a86f1f]">#61 a #80</span>
                    </td>
                    <td className="p-2.5 font-semibold text-[#1e3f2d] align-top">
                      MÓDULO 4:
                      <br />
                      Energía, Glucosa y Circulación
                    </td>
                    <td className="p-2.5 text-stone-600 align-top leading-snug">
                      Hoja de Guayaba, Flor de Jamaica, Sal Celta con Limón, Moringa y Menta, Hojas de Arándano, Betabel/Remolacha, Romero para Memoria, Fenogreco en Ayunas, Compresa Venotónica, Cacao Puro, Hojas de Olivo, Nopal/Pepino, Salvia y Romero, Masaje de Piernas, Canela Ceilán, Clorofila de Espinaca, Té Verde, Ortiga con Limón, Polen de Abeja, Baño de Contraste.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-[#1e3f2d] align-top">
                      Páginas 44 a 53
                      <span className="block text-[10px] text-[#a86f1f]">#81 a #100</span>
                    </td>
                    <td className="p-2.5 font-semibold text-[#1e3f2d] align-top">
                      MÓDULO 5:
                      <br />
                      Escudo Respiratorio e Inmunidad
                    </td>
                    <td className="p-2.5 text-stone-600 align-top leading-snug">
                      Cebolla Morada con Miel, Vapor de Eucalipto, Gárgaras de Salvia, Miel Fermentada con Ajo, Flor de Saúco, Jarabe de Rábano, Gordolobo Pulmonar, Cubos Dorados, Equinácea, Ungüento Pectoral de Coco, Bugambilia Morada, Ortiga Antialérgica, Sopa de Ajo Asado, Lavado Nasal, Guaco, Miel de Invierno, Hoja de Guayaba y Clavo, Propóleo con Naranja, Compresa de Lino, Ponche Inmunológico #100.
                    </td>
                  </tr>
                  <tr className="bg-[#fcfaf5]">
                    <td className="p-2.5 font-semibold text-[#8a5716] align-top">Páginas 54 a 56</td>
                    <td className="p-2.5 font-semibold text-[#8a5716] align-top">BONOS EXCLUSIVOS #1 Y #2</td>
                    <td className="p-2.5 text-stone-600 align-top leading-snug">
                      Botiquín de las 10 Plantas Maestras + Tabla del Reloj Biológico de las Infusiones + Plan Semanal de 7 Días.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <footer className="border-t border-[#d4dfd8] pt-2 mt-4 flex justify-between text-[11px] text-[#5c7065] font-sans">
            <span>El Recetario Prohibido de la Abuela • Índice de Contenidos</span>
            <span>
              <strong>Página 3 de {totalExpectedPages}</strong>
            </span>
          </footer>
        </section>
      )}

      {/* ================= PÁGINAS 4 A 53: AS 100 RECEITAS (2 POR PÁGINA) ================= */}
      {recipePairs.map(([recipe1, recipe2], pairIdx) => {
        const pageNumber = 4 + pairIdx;
        const currentModule = ebook.modules[recipe1.moduleIndex - 1];
        // First page of each module has a full module banner
        const isModuleHeaderPage = recipe1.num === "01" || recipe1.num === "21" || recipe1.num === "41" || recipe1.num === "61" || recipe1.num === "81";

        return (
          <section className="a4-page" id={`page-${pageNumber}`} key={recipe1.id}>
            <div>
              {isModuleHeaderPage && currentModule ? (
                <div className="bg-[#1e3f2d] text-white p-3.5 border-l-4 border-l-[#c88a32] rounded-md mb-3 shadow-sm">
                  <h2 className="font-sans text-sm font-bold text-[#e0a94f] uppercase tracking-wide">
                    {currentModule.title} ({currentModule.range})
                  </h2>
                  <p className="text-[11.5px] text-[#dce5df] mt-0.5">{currentModule.description}</p>
                </div>
              ) : (
                <div className="flex justify-between items-center border-b-2 border-[#2e5941] pb-1 mb-2.5 text-[11px] font-sans font-bold text-[#1e3f2d]">
                  <span>🌿 {currentModule?.title || "Recetario Natural"}</span>
                  <span className="text-[#c88a32]">
                    Recetas #{recipe1.num} {recipe2 ? `y #${recipe2.num}` : ""}
                  </span>
                </div>
              )}

              {/* Recipe 1 */}
              <RecipeCard recipe={recipe1} onEdit={onEditRecipe} language={ebook.language} />

              {/* Recipe 2 (if present) */}
              {recipe2 && (
                <RecipeCard recipe={recipe2} onEdit={onEditRecipe} language={ebook.language} />
              )}
            </div>

            <footer className="border-t border-[#d4dfd8] pt-2 mt-2 flex justify-between text-[11px] text-[#5c7065] font-sans">
              <span>El Recetario Prohibido de la Abuela • {currentModule?.title || "Herbolaria"}</span>
              <span>
                <strong>
                  Página {pageNumber} de {totalExpectedPages}
                </strong>
              </span>
            </footer>
          </section>
        );
      })}

      {/* ================= PÁGINA 54: BONO EXCLUSIVO #1 ================= */}
      {(!filterQuery || "bono plantas botiquin".includes(filterQuery.toLowerCase())) && (
        <section className="a4-page" id="page-54">
          <div>
            <div className="bg-[#1e3f2d] text-white p-3.5 border-l-4 border-l-[#c88a32] rounded-md mb-3 shadow-sm">
              <h2 className="font-sans text-sm font-bold text-[#e0a94f] uppercase tracking-wide">
                🎁 {ebook.bonus1.title}
              </h2>
              <p className="text-[11.5px] text-[#dce5df] mt-0.5">{ebook.bonus1.subtitle}</p>
            </div>

            <div className="bg-white border border-[#d4dfd8] rounded-lg p-3 mb-3 text-xs text-[#26332b] leading-relaxed">
              <p>{ebook.bonus1.description}</p>
            </div>

            <div className="overflow-x-auto bg-white border border-[#dce5df] rounded-lg shadow-xs">
              <table className="w-full border-collapse text-[11px] font-sans">
                <thead>
                  <tr className="bg-[#1e3f2d] text-white text-left">
                    <th className="p-2 border-b border-[#2d4d3a] w-[20%]">Planta / Raíz</th>
                    <th className="p-2 border-b border-[#2d4d3a] w-[28%]">Compuesto Bioactivo</th>
                    <th className="p-2 border-b border-[#2d4d3a] w-[32%]">Uso de Emergencia</th>
                    <th className="p-2 border-b border-[#2d4d3a] w-[20%]">Recetas Clave</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8ece9]">
                  {ebook.bonus1.plants.map((p, idx) => (
                    <tr key={idx} className="hover:bg-[#f9fbf9]">
                      <td className="p-2 font-bold text-[#1e3f2d]">{p.name}</td>
                      <td className="p-2 text-stone-600">{p.compound}</td>
                      <td className="p-2 text-[#26332b]">{p.usage}</td>
                      <td className="p-2 font-mono text-[#a86f1f] font-semibold">{p.recipes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <footer className="border-t border-[#d4dfd8] pt-2 mt-4 flex justify-between text-[11px] text-[#5c7065] font-sans">
            <span>El Recetario Prohibido de la Abuela • Bono Exclusivo #1</span>
            <span>
              <strong>Página 54 de {totalExpectedPages}</strong>
            </span>
          </footer>
        </section>
      )}

      {/* ================= PÁGINA 55: BONO EXCLUSIVO #2 ================= */}
      {(!filterQuery || "bono reloj circadiano horario".includes(filterQuery.toLowerCase())) && (
        <section className="a4-page" id="page-55">
          <div>
            <div className="bg-[#1e3f2d] text-white p-3.5 border-l-4 border-l-[#c88a32] rounded-md mb-3 shadow-sm">
              <h2 className="font-sans text-sm font-bold text-[#e0a94f] uppercase tracking-wide">
                ⏰ {ebook.bonus2.title}
              </h2>
              <p className="text-[11.5px] text-[#dce5df] mt-0.5">{ebook.bonus2.subtitle}</p>
            </div>

            <div className="bg-white border border-[#d4dfd8] rounded-lg p-3 mb-3 text-xs text-[#26332b] leading-relaxed">
              <p>{ebook.bonus2.description}</p>
            </div>

            <div className="overflow-x-auto bg-white border border-[#dce5df] rounded-lg shadow-xs">
              <table className="w-full border-collapse text-[11px] font-sans">
                <thead>
                  <tr className="bg-[#1e3f2d] text-white text-left">
                    <th className="p-2 border-b border-[#2d4d3a] w-[24%]">Ventana Horaria</th>
                    <th className="p-2 border-b border-[#2d4d3a] w-[28%]">Estado Fisiológico</th>
                    <th className="p-2 border-b border-[#2d4d3a] w-[48%]">Fórmulas Recomendadas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8ece9]">
                  {ebook.bonus2.clock.map((c, idx) => (
                    <tr key={idx} className="hover:bg-[#f9fbf9]">
                      <td className="p-2 font-bold text-[#1e3f2d]">{c.time}</td>
                      <td className="p-2 text-stone-600">{c.state}</td>
                      <td className="p-2 text-[#26332b] leading-relaxed">{c.formulas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <footer className="border-t border-[#d4dfd8] pt-2 mt-4 flex justify-between text-[11px] text-[#5c7065] font-sans">
            <span>El Recetario Prohibido de la Abuela • Bono Exclusivo #2</span>
            <span>
              <strong>Página 55 de {totalExpectedPages}</strong>
            </span>
          </footer>
        </section>
      )}

      {/* ================= PÁGINA 56: PLAN SEMANAL Y CIERRE ================= */}
      {(!filterQuery || "plan semanal cierre agradecimiento".includes(filterQuery.toLowerCase())) && (
        <section className="a4-page" id="page-56">
          <div>
            <div className="bg-[#1e3f2d] text-white p-3.5 border-l-4 border-l-[#c88a32] rounded-md mb-3 shadow-sm">
              <h2 className="font-sans text-sm font-bold text-[#e0a94f] uppercase tracking-wide">
                🗓️ {ebook.weeklyPlan.title}
              </h2>
              <p className="text-[11.5px] text-[#dce5df] mt-0.5">{ebook.weeklyPlan.subtitle}</p>
            </div>

            <div className="bg-white border border-[#d4dfd8] rounded-lg p-3.5 mb-3 shadow-xs">
              <h3 className="font-serif text-sm font-bold text-[#1e3f2d] mb-1">
                {ebook.weeklyPlan.principleTitle}
              </h3>
              <p className="text-xs text-[#26332b] leading-relaxed">
                {ebook.weeklyPlan.principleText}
              </p>
            </div>

            <div className="overflow-x-auto bg-white border border-[#dce5df] rounded-lg shadow-xs mb-4">
              <table className="w-full border-collapse text-[11px] font-sans">
                <thead>
                  <tr className="bg-[#1e3f2d] text-white text-left">
                    <th className="p-2 border-b border-[#2d4d3a] w-[25%]">Objetivo</th>
                    <th className="p-2 border-b border-[#2d4d3a] w-[25%]">Mañana (En Ayunas)</th>
                    <th className="p-2 border-b border-[#2d4d3a] w-[25%]">Mediodía</th>
                    <th className="p-2 border-b border-[#2d4d3a] w-[25%]">Noche (Dormir)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8ece9]">
                  {ebook.weeklyPlan.plans.map((p, idx) => (
                    <tr key={idx} className="hover:bg-[#f9fbf9]">
                      <td className="p-2 font-bold text-[#1e3f2d]">{p.objective}</td>
                      <td className="p-2 text-stone-600">{p.morning}</td>
                      <td className="p-2 text-stone-600">{p.noon}</td>
                      <td className="p-2 text-stone-600">{p.night}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-center bg-[#1e3f2d] text-white border-2 border-double border-[#c88a32] p-5 rounded-lg shadow-inner">
              <div className="text-2xl mb-1">🌿</div>
              <h4 className="font-serif text-base font-bold text-[#e0a94f] mb-1">
                ¡Gracias por Mantener Viva la Sabiduría de Nuestras Abuelas!
              </h4>
              <p className="text-xs text-[#dce5df] max-w-lg mx-auto leading-relaxed">
                {ebook.weeklyPlan.closingMessage}
              </p>
            </div>
          </div>

          <footer className="border-t border-[#d4dfd8] pt-2 mt-4 flex justify-between text-[11px] text-[#5c7065] font-sans">
            <span>El Recetario Prohibido de la Abuela • Plan de 7 Días &amp; Cierre</span>
            <span>
              <strong>Página 56 de {totalExpectedPages}</strong>
            </span>
          </footer>
        </section>
      )}
    </div>
  );
};
