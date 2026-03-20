import { useState, useCallback, useEffect } from 'react';
import type { SoaRecord, SoaStatus } from '../types';
import { CONTROLS } from '../data/controls-data';
import type { SoaTemplate } from '../data/soa-templates';
import { DEFAULT_REASONS } from '../data/soa-templates';

const STORAGE_KEY = 'soa-data';

/**
 * 為所有控制項建立預設的 SoA Record。
 * 預設全部標記為「適用」且狀態為「尚未開始」。
 */
function createDefaultRecords(): SoaRecord[] {
  return CONTROLS.map(c => ({
    controlId: c.id,
    applicable: true,
    justification: '',
    status: 'not_started' as SoaStatus,
  }));
}

/**
 * 從 localStorage 讀取 SoA 資料，若無或格式錯誤則回傳預設值。
 * NOTE: 同時處理版本升級場景 — 當控制項清單有新增時自動補齊。
 */
function loadFromStorage(): SoaRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultRecords();

    const parsed: SoaRecord[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return createDefaultRecords();

    // NOTE: 確保已涵蓋所有控制項（若日後有新增則自動補齊）
    const existingIds = new Set(parsed.map(r => r.controlId));
    const missing = CONTROLS
      .filter(c => !existingIds.has(c.id))
      .map(c => ({
        controlId: c.id,
        applicable: true,
        justification: '',
        status: 'not_started' as SoaStatus,
      }));

    return [...parsed, ...missing];
  } catch {
    return createDefaultRecords();
  }
}

/**
 * 依控制項編號取得其所屬類別前綴（如 "5.1" → "5"）。
 * 用於套用範本時填入對應類別的預設理由。
 */
function getCategoryPrefix(controlId: string): string {
  return controlId.split('.')[0];
}

/**
 * SoA 狀態管理 Hook — 負責讀寫與 localStorage 持久化。
 */
export function useSoaStore() {
  const [records, setRecords] = useState<SoaRecord[]>(loadFromStorage);

  // NOTE: 每當 records 更新時自動同步至 localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  /**
   * 更新單一控制項的 SoA 紀錄（支援局部更新）。
   * @param controlId 控制項編號（如 "5.1"）
   * @param partial 要更新的欄位子集
   */
  const updateRecord = useCallback(
    (controlId: string, partial: Partial<Omit<SoaRecord, 'controlId'>>) => {
      setRecords(prev =>
        prev.map(r =>
          r.controlId === controlId ? { ...r, ...partial } : r
        )
      );
    },
    []
  );

  /** 重設所有 SoA 紀錄為預設值 */
  const resetAll = useCallback(() => {
    const defaults = createDefaultRecords();
    setRecords(defaults);
  }, []);

  /**
   * 套用場景化範本。
   * NOTE: 僅覆寫範本中明確定義的控制項，未列出者維持現狀。
   *       若理由欄位為空則填入對應類別的預設理由。
   */
  const applyTemplate = useCallback((template: SoaTemplate) => {
    setRecords(prev =>
      prev.map(r => {
        const override = template.controlsOverride[r.controlId];
        if (override) {
          // NOTE: 範本明確指定的項目 — 覆寫適用性與理由
          return {
            ...r,
            applicable: override.applicable,
            justification: override.justification,
            status: override.applicable ? r.status : 'not_applicable' as SoaStatus,
          };
        }
        // NOTE: 未被範本覆寫的項目 — 若理由為空則填入類別預設理由
        if (!r.justification) {
          const prefix = getCategoryPrefix(r.controlId);
          const defaultReason = DEFAULT_REASONS[prefix];
          if (defaultReason) {
            return { ...r, justification: defaultReason };
          }
        }
        return r;
      })
    );
  }, []);

  /** 將所有控制項設為適用 */
  const setAllApplicable = useCallback(() => {
    setRecords(prev =>
      prev.map(r => ({
        ...r,
        applicable: true,
        status: r.status === 'not_applicable' ? 'not_started' as SoaStatus : r.status,
      }))
    );
  }, []);

  /** 取得用於匯出的合併資料（SoA record + 控制項元資料） */
  const getExportData = useCallback(() => {
    return records.map(r => {
      const control = CONTROLS.find(c => c.id === r.controlId);
      return {
        controlId: r.controlId,
        title: control?.title ?? '',
        category: control?.category ?? '',
        purpose: control?.purpose ?? '',
        isNew: control?.isNew ?? false,
        applicable: r.applicable,
        justification: r.justification,
        status: r.status,
      };
    });
  }, [records]);

  return { records, updateRecord, resetAll, applyTemplate, setAllApplicable, getExportData };
}

