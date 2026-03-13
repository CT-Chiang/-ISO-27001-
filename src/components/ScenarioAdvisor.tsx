import { useMemo } from 'react';
import type { ScenarioOption } from '../types';

interface Props {
  scenarios: ScenarioOption[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onClear: () => void;
}

export default function ScenarioAdvisor({ scenarios, selectedIds, onToggle, onClear }: Props) {
  // NOTE: 使用 Set 將 O(n) 查找降至 O(1)，情境選項增多時仍保持效能
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  return (
    <div className="glass-card p-5 border border-cyber-500/20 animate-slide-in-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <span>🎯</span> 情境引導
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">選擇符合您組織情況的場景，系統將推薦對應的控制項</p>
        </div>
        {selectedIds.length > 0 && (
          <button onClick={onClear} className="text-xs text-slate-500 hover:text-rose-400 transition-colors px-2 py-1 rounded-lg hover:bg-rose-500/10">
            清除全部
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {scenarios.map(s => (
          <button
            key={s.id}
            onClick={() => onToggle(s.id)}
            className={`scenario-tag ${selectedSet.has(s.id) ? 'selected' : ''}`}
          >
            {s.label}
          </button>
        ))}
      </div>
      {selectedIds.length > 0 && (
        <p className="text-xs text-cyber-400 mt-3 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-cyber-400 rounded-full inline-block animate-pulse-slow"/>
          已選 {selectedIds.length} 個情境，僅顯示推薦控制項
        </p>
      )}
    </div>
  );
}
