import type { Control } from '../types';
import { CATEGORY_BADGE, CATEGORY_LABEL } from '../constants/category';

interface Props {
  control: Control;
  onClick: () => void;
  highlighted: boolean;
}

export default function ControlCard({ control, onClick, highlighted }: Props) {
  return (
    <button
      onClick={onClick}
      className={`glass-card p-4 text-left w-full group relative overflow-hidden ${highlighted ? 'ring-1 ring-cyber-400/50' : ''}`}
      id={`control-${control.id}`}
    >
      {/* NOTE: 情境高亮指示器 */}
      {highlighted && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyber-400 animate-pulse-slow" />
      )}

      {/* 控制項編號與分類標籤 */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="font-mono text-lg font-bold text-cyber-400 group-hover:text-cyber-300 transition-colors">
          {control.id}
        </span>
        <div className="flex items-center gap-1 flex-shrink-0">
          {control.isNew && (
            <span className="badge-new px-2 py-0.5 rounded-full text-xs">NEW</span>
          )}
          <span className={`${CATEGORY_BADGE[control.category]} text-xs px-2 py-0.5 rounded-full`}>
            {CATEGORY_LABEL[control.category]}
          </span>
        </div>
      </div>

      {/* 標題 */}
      <h3 className="font-semibold text-slate-200 text-sm mb-2 line-clamp-2 group-hover:text-white transition-colors">
        {control.title}
      </h3>

      {/* 控制目標摘要 */}
      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
        {control.purpose}
      </p>

      {/* 標籤 */}
      <div className="flex flex-wrap gap-1 mt-3">
        {control.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-xs text-slate-500 bg-navy-800 px-2 py-0.5 rounded-md">
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}
