import { CONTROLS } from '../data/controls-data';
import type { CategoryInfo } from '../types';

interface Props {
  total: number;
  filtered: number;
  categories: CategoryInfo[];
}

export default function StatsBar({ total, filtered, categories }: Props) {
  // NOTE: 從 CONTROLS 資料動態計算，避免未來資料更新時忘記同步
  const newCount = CONTROLS.filter(c => c.isNew).length;

  return (
    <div className="border-t border-navy-800/50 px-4 py-2 flex items-center gap-4 overflow-x-auto text-xs text-slate-500">
      <span className="flex items-center gap-1.5 flex-shrink-0">
        <span className="w-1.5 h-1.5 bg-cyber-400 rounded-full"/>
        <span>顯示 <span className="text-slate-300 font-semibold">{filtered}</span> / {total} 項</span>
      </span>
      <span className="text-navy-700">|</span>
      {categories.map(cat => (
        <span key={cat.id} className="flex-shrink-0">
          {cat.icon} {cat.count}
        </span>
      ))}
      <span className="text-navy-700">|</span>
      <span className="flex items-center gap-1 flex-shrink-0">
        <span className="badge-new px-1.5 py-0.5 rounded text-xs">NEW</span>
        <span>2022 新增 {newCount} 項</span>
      </span>
    </div>
  );
}
