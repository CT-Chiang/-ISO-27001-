import type { CategoryInfo, ControlCategory } from '../types';

interface Props {
  categories: CategoryInfo[];
  active: ControlCategory | 'all';
  onSelect: (cat: ControlCategory | 'all') => void;
  onClose?: () => void;
  scenarioCount: number;
}

const colorMap: Record<string, string> = {
  cyber: 'text-cyber-400 bg-cyber-500/20 border-cyber-500/40',
  emerald: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40',
  amber: 'text-amber-400 bg-amber-500/20 border-amber-500/40',
  violet: 'text-violet-400 bg-violet-500/20 border-violet-500/40',
};

export default function CategoryNav({ categories, active, onSelect, onClose, scenarioCount }: Props) {
  return (
    <nav className="flex flex-col gap-1">
      <div className="flex items-center justify-between lg:hidden mb-4 px-2">
        <span className="text-sm font-bold text-slate-200">選單導覽</span>
        <button 
          onClick={onClose}
          className="p-2 rounded-lg text-slate-400 hover:bg-navy-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4">Annex A 分類</p>

      <button
        onClick={() => onSelect('all')}
        className={`nav-btn ${active === 'all' ? 'active border-glow' : ''}`}
      >
        <span>📋</span>
        <span className="flex-1 text-left">全部控制項</span>
        <span className="text-xs text-slate-500 bg-navy-700 px-2 py-0.5 rounded-full">93</span>
      </button>

      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`nav-btn ${active === cat.id ? 'active' : ''}`}
        >
          <span>{cat.icon}</span>
          <span className="flex-1 text-left text-xs leading-tight">
            <span className="block font-medium">{cat.label}</span>
            <span className="text-slate-500">A.{cat.prefix} 系列</span>
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full border ${colorMap[cat.color]}`}>
            {cat.count}
          </span>
        </button>
      ))}

      {scenarioCount > 0 && (
        <>
          <div className="my-2 border-t border-navy-800" />
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-500/10 border border-cyber-500/20">
            <span>🎯</span>
            <div>
              <p className="text-xs font-medium text-cyber-400">情境篩選中</p>
              <p className="text-xs text-slate-500">推薦 {scenarioCount} 項控制措施</p>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
