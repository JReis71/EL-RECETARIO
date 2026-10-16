export interface EbookItem {
  id: string;
  num: string;
  moduleIndex: number;
  moduleTitle: string;
  title: string;
  meta: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
  ingredients: string[];
  steps: string[];
  secret: string;
  tags?: string[];
}

export interface EbookModule {
  id: number;
  title: string;
  range: string;
  description: string;
}

export interface PlantGuideItem {
  name: string;
  compound: string;
  usage: string;
  recipes: string;
}

export interface BiologicalClockItem {
  time: string;
  state: string;
  formulas: string;
}

export interface WeeklyPlanItem {
  objective: string;
  morning: string;
  noon: string;
  night: string;
}

export interface EbookData {
  id: string;
  title: string;
  subtitle: string;
  editionBadge: string;
  author: string;
  language: "es" | "pt" | "en";
  coverImage: string;
  coverHeroText: string;
  introTitle: string;
  introSubtitle: string;
  introText: string[];
  rulesTitle: string;
  rules: { title: string; text: string }[];
  disclaimer: string;
  modules: EbookModule[];
  items: EbookItem[];
  bonus1: {
    title: string;
    subtitle: string;
    description: string;
    plants: PlantGuideItem[];
  };
  bonus2: {
    title: string;
    subtitle: string;
    description: string;
    clock: BiologicalClockItem[];
  };
  weeklyPlan: {
    title: string;
    subtitle: string;
    principleTitle: string;
    principleText: string;
    plans: WeeklyPlanItem[];
    closingMessage: string;
  };
}
