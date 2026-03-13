import { useEffect } from 'react';
import type { Control } from '../types';
import { CATEGORY_COLOR, CATEGORY_LABEL_FULL } from '../constants/category';

interface Props {
  control: Control;
  onClose: () => void;
}

export default function ControlDetail({ control, onClose }: Props) {
  // NOTE: 無障礙規範 — dialog 元素需支援 Escape 鍵關閉
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="detail-drawer" role="dialog" aria-modal="true" aria-label={`控制項 ${control.id} 詳情`}>
      {/* 頂部標題列 */}
      <div className="sticky top-0 bg-navy-900/95 backdrop-blur-sm border-b border-navy-700 px-6 py-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-2xl font-bold text-cyber-400">{control.id}</span>
            {control.isNew && <span className="badge-new px-2 py-0.5 rounded-full text-xs">2022 新增</span>}
            <span className={`text-xs px-2 py-0.5 rounded-full border ${CATEGORY_COLOR[control.category]}`}>
              {CATEGORY_LABEL_FULL[control.category]}
            </span>
          </div>
          <h2 className="text-lg font-semibold text-white">{control.title}</h2>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors flex-shrink-0" aria-label="關閉">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div className="p-6 space-y-6 animate-fade-in">
        {/* 控制目標 */}
        <section>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
            <span className="w-1 h-4 bg-cyber-400 rounded-full inline-block"/>
            控制目標
          </h3>
          <p className="text-slate-300 leading-relaxed text-sm bg-navy-800/50 rounded-xl p-4 border border-navy-700">
            {control.purpose}
          </p>
        </section>

        {/* 實施要求 */}
        <section>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
            <span className="w-1 h-4 bg-emerald-400 rounded-full inline-block"/>
            實施要求
          </h3>
          <p className="text-slate-300 leading-relaxed text-sm bg-navy-800/50 rounded-xl p-4 border border-navy-700">
            {control.requirements}
          </p>
        </section>

        {/* 實務技術建議 */}
        <section>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
            <span className="w-1 h-4 bg-violet-400 rounded-full inline-block"/>
            實務技術建議
          </h3>
          <ul className="space-y-2">
            {control.techTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 bg-navy-800/50 rounded-xl px-4 py-3 border border-navy-700 text-sm text-slate-300">
                {/* FIXME: padStart(2,'0') 修正序號格式，避免超過 9 項時出現 "010" */}
                <span className="text-violet-400 font-mono text-xs mt-0.5 flex-shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </section>

        {/* 關鍵字標籤 */}
        <section>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">關鍵字</h3>
          <div className="flex flex-wrap gap-2">
            {control.tags.map(tag => (
              <span key={tag} className="text-xs text-slate-400 bg-navy-800 border border-navy-700 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
