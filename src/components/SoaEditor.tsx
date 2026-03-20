import { useState, useMemo } from 'react';
import type { SoaRecord, SoaStatus, ControlCategory } from '../types';
import { SOA_STATUS_LABELS } from '../types';
import { CONTROLS, CATEGORIES } from '../data/controls-data';
import { SOA_TEMPLATES } from '../data/soa-templates';
import type { SoaTemplate } from '../data/soa-templates';
import { exportSoaToXlsx } from '../utils/export-soa-xlsx';

interface Props {
  records: SoaRecord[];
  onUpdate: (controlId: string, partial: Partial<Omit<SoaRecord, 'controlId'>>) => void;
  onReset: () => void;
  onApplyTemplate: (template: SoaTemplate) => void;
  onSetAllApplicable: () => void;
  getExportData: () => Array<{
    controlId: string;
    title: string;
    category: string;
    purpose: string;
    isNew: boolean;
    applicable: boolean;
    justification: string;
    status: SoaStatus;
  }>;
}

/** SoA 狀態徽章顏色對應 */
const STATUS_COLORS: Record<SoaStatus, string> = {
  not_started: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  in_progress: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  implemented: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  not_applicable: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
};

export default function SoaEditor({
  records, onUpdate, onReset, onApplyTemplate, onSetAllApplicable, getExportData,
}: Props) {
  const [filterCategory, setFilterCategory] = useState<ControlCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmTemplate, setConfirmTemplate] = useState<string | null>(null);

  // NOTE: 統計摘要
  const stats = useMemo(() => {
    const applicable = records.filter(r => r.applicable).length;
    const implemented = records.filter(r => r.status === 'implemented').length;
    const inProgress = records.filter(r => r.status === 'in_progress').length;
    const notStarted = records.filter(r => r.status === 'not_started' && r.applicable).length;
    return { applicable, implemented, inProgress, notStarted };
  }, [records]);

  // NOTE: 篩選後的紀錄列表
  const filteredRecords = useMemo(() => {
    let result = records.map(r => ({
      ...r,
      control: CONTROLS.find(c => c.id === r.controlId),
    }));

    if (filterCategory !== 'all') {
      result = result.filter(r => r.control?.category === filterCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(r =>
        r.controlId.toLowerCase().includes(q) ||
        r.control?.title.toLowerCase().includes(q) ||
        r.justification.toLowerCase().includes(q)
      );
    }

    return result;
  }, [records, filterCategory, searchQuery]);

  /** 觸發 Excel 匯出 */
  const handleExport = () => {
    const data = getExportData();
    exportSoaToXlsx(data);
  };

  /** 重設確認流程 */
  const handleReset = () => {
    if (confirmReset) {
      onReset();
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 5000);
    }
  };

  /** 範本套用確認流程（防止誤觸） */
  const handleTemplateSelect = (templateId: string) => {
    if (confirmTemplate === templateId) {
      const template = SOA_TEMPLATES.find(t => t.id === templateId);
      if (template) onApplyTemplate(template);
      setConfirmTemplate(null);
    } else {
      setConfirmTemplate(templateId);
      setTimeout(() => setConfirmTemplate(null), 5000);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* ─── 資安警告橫幅 ─── */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
        <span className="text-amber-400 text-lg flex-shrink-0 mt-0.5">⚠️</span>
        <div>
          <p className="text-sm font-semibold text-amber-300">資安提醒</p>
          <p className="text-xs text-amber-400/80 mt-0.5">
            本工具僅供範本產出，請勿輸入任何公司敏感機密資訊於瀏覽器中。所有資料僅儲存於您的瀏覽器 localStorage，不會傳輸至任何伺服器。
          </p>
        </div>
      </div>

      {/* ─── 場景化範本選單 ─── */}
      <div className="glass-card p-4 border border-navy-700">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">📑</span>
          <h3 className="text-sm font-semibold text-slate-200">選擇認證範圍範本</h3>
          <span className="text-xs text-slate-500">（套用後僅覆寫範本指定項目，其餘保持不變）</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SOA_TEMPLATES.map(t => {
            const isConfirming = confirmTemplate === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleTemplateSelect(t.id)}
                className={`
                  text-left p-3 rounded-xl border transition-all duration-200
                  ${isConfirming
                    ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/30 animate-pulse'
                    : 'border-navy-700 bg-navy-800/40 hover:border-cyber-500/50 hover:bg-navy-800/60'}
                `}
              >
                <p className={`text-sm font-medium ${isConfirming ? 'text-amber-300' : 'text-slate-200'}`}>
                  {isConfirming ? '⚡ 確認套用？再按一次' : t.name}
                </p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{t.description}</p>
                <p className="text-xs text-cyber-400/60 mt-1.5">
                  覆寫 {Object.keys(t.controlsOverride).length} 項控制項
                </p>
              </button>
            );
          })}
        </div>

        {/* 快速操作按鈕 */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-navy-700/50">
          <button
            onClick={onSetAllApplicable}
            className="text-xs px-3 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all"
          >
            ✅ 全部適用 (Yes)
          </button>
          <button
            onClick={handleReset}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${confirmReset ? 'border-rose-500 text-rose-400 bg-rose-500/10 animate-pulse' : 'border-navy-700 text-slate-500 hover:text-slate-300 hover:border-slate-600'}`}
          >
            {confirmReset ? '確認？再按一次' : '🔄 全部重置'}
          </button>
        </div>
      </div>

      {/* ─── 統計摘要 ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card p-3 text-center">
          <p className="text-2xl font-bold text-cyber-400">{stats.applicable}</p>
          <p className="text-xs text-slate-500 mt-0.5">適用項目</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-2xl font-bold text-emerald-400">{stats.implemented}</p>
          <p className="text-xs text-slate-500 mt-0.5">已實施</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-2xl font-bold text-amber-400">{stats.inProgress}</p>
          <p className="text-xs text-slate-500 mt-0.5">實施中</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-2xl font-bold text-slate-400">{stats.notStarted}</p>
          <p className="text-xs text-slate-500 mt-0.5">尚未開始</p>
        </div>
      </div>

      {/* ─── 篩選與功能列 ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* 類別快篩 */}
        <div className="flex items-center gap-2 flex-wrap flex-1">
          <button
            onClick={() => setFilterCategory('all')}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${filterCategory === 'all' ? 'border-cyber-500 text-cyber-400 bg-cyber-500/10' : 'border-navy-700 text-slate-500 hover:text-slate-300'}`}
          >
            全部
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${filterCategory === cat.id ? 'border-cyber-500 text-cyber-400 bg-cyber-500/10' : 'border-navy-700 text-slate-500 hover:text-slate-300'}`}
            >
              {cat.icon} {cat.label.replace('控制措施', '')}
            </button>
          ))}
        </div>

        {/* 搜尋框 */}
        <input
          type="text"
          placeholder="搜尋編號或名稱..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="search-input text-xs !py-2 !rounded-lg sm:max-w-[200px]"
          autoComplete="off"
          spellCheck="false"
        />
      </div>

      {/* ─── SoA 表格 ─── */}
      <div className="glass-card overflow-hidden border border-navy-700">
        {/* 桌面版表頭 */}
        <div className="hidden lg:grid lg:grid-cols-[80px_1fr_80px_1fr_160px] gap-3 px-4 py-3 bg-navy-800/60 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-navy-700">
          <span>編號</span>
          <span>控制項名稱</span>
          <span className="text-center">適用</span>
          <span>排除/適用理由</span>
          <span>實施狀態</span>
        </div>

        {/* 表格列 */}
        <div className="divide-y divide-navy-800 max-h-[60vh] overflow-y-auto">
          {filteredRecords.map(r => (
            <div key={r.controlId}>
              <div
                className={`
                  grid grid-cols-1 lg:grid-cols-[80px_1fr_80px_1fr_160px] gap-2 lg:gap-3
                  px-4 py-3 transition-colors hover:bg-navy-800/40
                  ${!r.applicable ? 'opacity-50' : ''}
                `}
              >
                {/* 編號 */}
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-cyber-400">{r.controlId}</span>
                  {r.control?.isNew && (
                    <span className="badge-new px-1.5 py-0.5 rounded text-[10px] lg:hidden">NEW</span>
                  )}
                </div>

                {/* 名稱 */}
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm text-slate-300 truncate">{r.control?.title}</span>
                  {r.control?.isNew && (
                    <span className="badge-new px-1.5 py-0.5 rounded text-[10px] hidden lg:inline-block flex-shrink-0">NEW</span>
                  )}
                </div>

                {/* 適用性開關 */}
                <div className="flex items-center justify-start lg:justify-center">
                  <label className="lg:hidden text-xs text-slate-500 mr-2">適用：</label>
                  <button
                    onClick={() => onUpdate(r.controlId, {
                      applicable: !r.applicable,
                      ...(!r.applicable ? {} : { status: 'not_applicable' as SoaStatus }),
                      ...(r.applicable ? {} : { status: 'not_started' as SoaStatus }),
                    })}
                    className={`
                      w-10 h-5 rounded-full relative transition-colors duration-200 flex-shrink-0
                      ${r.applicable ? 'bg-cyber-500' : 'bg-navy-600'}
                    `}
                    aria-label={r.applicable ? '標記為不適用' : '標記為適用'}
                  >
                    <span className={`
                      absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200
                      ${r.applicable ? 'translate-x-5' : 'translate-x-0.5'}
                    `} />
                  </button>
                </div>

                {/* 理由 */}
                <div className="flex items-center">
                  <label className="lg:hidden text-xs text-slate-500 mr-2 flex-shrink-0">理由：</label>
                  <input
                    type="text"
                    value={r.justification}
                    onChange={e => onUpdate(r.controlId, { justification: e.target.value })}
                    placeholder={r.applicable ? '適用理由（選填）' : '排除理由（必填）'}
                    className={`w-full bg-navy-800/60 border rounded-lg px-2.5 py-1.5 text-xs text-slate-300 placeholder-slate-600 outline-none transition-colors ${!r.applicable && !r.justification ? 'border-rose-500/50 focus:border-rose-500' : 'border-navy-700 focus:border-cyber-500/50'}`}
                    autoComplete="off"
                    spellCheck="false"
                  />
                </div>

                {/* 狀態 */}
                <div className="flex items-center">
                  <label className="lg:hidden text-xs text-slate-500 mr-2 flex-shrink-0">狀態：</label>
                  <select
                    value={r.status}
                    onChange={e => onUpdate(r.controlId, { status: e.target.value as SoaStatus })}
                    className={`
                      w-full text-xs px-2.5 py-1.5 rounded-lg border outline-none transition-colors cursor-pointer
                      bg-navy-800/60 ${STATUS_COLORS[r.status]}
                      focus:ring-1 focus:ring-cyber-500/30
                    `}
                  >
                    {(Object.entries(SOA_STATUS_LABELS) as [SoaStatus, string][]).map(([value, label]) => (
                      <option key={value} value={value} className="bg-navy-900 text-slate-300">
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* NOTE: 防錯警語 — 當設為「不適用」且理由為空時顯示稽核提示 */}
              {!r.applicable && !r.justification && (
                <div className="mx-4 mb-3 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-start gap-2">
                  <span className="flex-shrink-0">⚠️</span>
                  <span>稽核提示：排除此項需在上方理由欄位詳細說明補償性控制措施，否則可能導致 NC 缺失。</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-sm">
            找不到符合條件的控制項
          </div>
        )}
      </div>

      {/* ─── 底部功能列 ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <p className="text-xs text-slate-500">
          共 {filteredRecords.length} / {records.length} 項 · 自動儲存至瀏覽器
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="text-xs px-4 py-2 rounded-lg border border-cyber-500 text-cyber-400 bg-cyber-500/10 hover:bg-cyber-500/20 transition-all font-medium"
          >
            📥 匯出 Excel 範本
          </button>
        </div>
      </div>
    </div>
  );
}
