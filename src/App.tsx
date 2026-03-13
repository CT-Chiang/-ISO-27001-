import { useState, useMemo } from 'react';
import type { ControlCategory } from './types';
import { CONTROLS, CATEGORIES, SCENARIOS } from './data/controls-data';
import SearchBar from './components/SearchBar';
import CategoryNav from './components/CategoryNav';
import ControlGrid from './components/ControlGrid';
import ControlDetail from './components/ControlDetail';
import ScenarioAdvisor from './components/ScenarioAdvisor';
import StatsBar from './components/StatsBar';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ControlCategory | 'all'>('all');
  const [selectedControlId, setSelectedControlId] = useState<string | null>(null);
  const [scenarioIds, setScenarioIds] = useState<string[]>([]);
  const [showScenario, setShowScenario] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // NOTE: 情境推薦的控制項 ID 集合
  const scenarioControlIds = useMemo(() => {
    if (scenarioIds.length === 0) return new Set<string>();
    const ids = scenarioIds.flatMap(sid => SCENARIOS.find(s => s.id === sid)?.recommendedControls ?? []);
    return new Set(ids);
  }, [scenarioIds]);

  // NOTE: 篩選邏輯：依類別、搜尋詞、情境篩選
  const filteredControls = useMemo(() => {
    let result = CONTROLS;
    if (activeCategory !== 'all') {
      result = result.filter(c => c.category === activeCategory);
    }
    if (scenarioIds.length > 0) {
      result = result.filter(c => scenarioControlIds.has(c.id));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(c =>
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.purpose.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [activeCategory, searchQuery, scenarioControlIds]);

  // NOTE: 用 useMemo 包裝，避免每次渲染進行 O(n) 遍歷
  const selectedControl = useMemo(
    () => selectedControlId ? CONTROLS.find(c => c.id === selectedControlId) ?? null : null,
    [selectedControlId]
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* ─── 頂部標題列 ─── */}
      <header className="sticky top-0 z-30 border-b border-navy-800 bg-navy-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            {/* NOTE: 行動裝置側欄開關 */}
            <button
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-navy-800 transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="切換導覽選單"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyber-500/20 border border-cyber-500/40 flex items-center justify-center flex-shrink-0">
                <span className="text-cyber-400 text-sm">🔒</span>
              </div>
              <div>
                <h1 className="text-sm font-bold text-gradient-cyber leading-none">ISO 27001:2022</h1>
                <p className="text-xs text-slate-500 leading-none mt-0.5">資訊安全控制項查詢系統</p>
              </div>
            </div>
          </div>
          <div className="flex-1 max-w-xl">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <button
            onClick={() => setShowScenario(!showScenario)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${showScenario ? 'border-cyber-500 text-cyber-400 bg-cyber-500/10' : 'border-navy-700 text-slate-400 hover:border-cyber-500/50 hover:text-cyber-400'}`}
          >
            <span>🎯</span>
            <span className="hidden sm:inline">情境引導</span>
          </button>
        </div>

        {/* NOTE: 統計列 */}
        <StatsBar total={CONTROLS.length} filtered={filteredControls.length} categories={CATEGORIES} />
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 py-6 gap-6">
        {/* ─── 側邊導覽 ─── */}
        <>
          {sidebarOpen && (
            <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}
          <aside className={`
            fixed lg:static inset-y-0 left-0 z-20 w-64 shrink-0
            bg-navy-950 lg:bg-transparent
            transform transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            pt-20 lg:pt-0 px-4 lg:px-0 border-r lg:border-0 border-navy-800
          `}>
            <CategoryNav
              categories={CATEGORIES}
              active={activeCategory}
              onSelect={(cat) => { setActiveCategory(cat); setSidebarOpen(false); }}
              scenarioCount={scenarioControlIds.size}
            />
          </aside>
        </>

        {/* ─── 主內容區 ─── */}
        <main className="flex-1 min-w-0">
          {showScenario && (
            <div className="mb-6">
              <ScenarioAdvisor
                scenarios={SCENARIOS}
                selectedIds={scenarioIds}
                onToggle={(id) => setScenarioIds(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])}
                onClear={() => setScenarioIds([])}
              />
            </div>
          )}
          <ControlGrid
            controls={filteredControls}
            onSelect={setSelectedControlId}
            highlightIds={scenarioControlIds}
          />
        </main>
      </div>

      {/* ─── 控制項詳情抽屜 ─── */}
      {selectedControl && (
        <>
          <div className="overlay" onClick={() => setSelectedControlId(null)} />
          <ControlDetail control={selectedControl} onClose={() => setSelectedControlId(null)} />
        </>
      )}
    </div>
  );
}
