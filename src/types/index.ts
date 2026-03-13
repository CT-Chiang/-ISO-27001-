// NOTE: ISO 27001:2022 核心型別定義

export type ControlCategory = 'organizational' | 'people' | 'physical' | 'technological';

export interface Control {
  id: string;           // e.g. "5.1"
  title: string;        // 控制措施標題
  purpose: string;      // 控制目標
  requirements: string; // 實施要求
  techTips: string[];   // 實務技術建議
  category: ControlCategory;
  isNew: boolean;       // 2022 版新增
  tags: string[];       // 關鍵字標籤
}

export interface CategoryInfo {
  id: ControlCategory;
  label: string;
  prefix: string;       // "5" | "6" | "7" | "8"
  icon: string;
  color: string;
  count: number;
}

export interface ScenarioOption {
  id: string;
  label: string;
  recommendedControls: string[]; // control id list
}
