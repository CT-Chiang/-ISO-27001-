// NOTE: 共用分類常數，避免各元件重複定義
import type { ControlCategory } from '../types';

export const CATEGORY_LABEL: Record<ControlCategory, string> = {
  organizational: '組織',
  people: '人員',
  physical: '實體',
  technological: '技術',
};

export const CATEGORY_LABEL_FULL: Record<ControlCategory, string> = {
  organizational: '🏢 組織控制',
  people: '👥 人員控制',
  physical: '🏛️ 實體控制',
  technological: '💻 技術控制',
};

export const CATEGORY_BADGE: Record<ControlCategory, string> = {
  organizational: 'badge-org',
  people: 'badge-people',
  physical: 'badge-physical',
  technological: 'badge-tech',
};

export const CATEGORY_COLOR: Record<ControlCategory, string> = {
  organizational: 'text-cyber-400 border-cyber-500/30 bg-cyber-500/10',
  people: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  physical: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  technological: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
};
