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

// NOTE: SoA（適用性聲明）編輯器所需型別

/** 控制項實施狀態 */
export type SoaStatus = 'not_started' | 'in_progress' | 'implemented' | 'not_applicable';

/** 單一控制項的 SoA 紀錄 */
export interface SoaRecord {
  controlId: string;
  applicable: boolean;
  justification: string;
  status: SoaStatus;
}

/** SoA 狀態下拉選單標籤對應 */
export const SOA_STATUS_LABELS: Record<SoaStatus, string> = {
  not_started: '尚未開始',
  in_progress: '實施中',
  implemented: '已實施',
  not_applicable: '不適用',
};
