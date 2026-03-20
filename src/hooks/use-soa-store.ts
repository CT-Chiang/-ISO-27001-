import { useState, useCallback, useEffect } from 'react';
import type { SoaRecord, SoaStatus } from '../types';
import { CONTROLS } from '../data/controls-data';

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
 * SoA 狀態管理 Hook — 負責讀寫與 localStorage 持久化。
 *
 * 為什麼不使用 useReducer？
 * 目前狀態更新模式單純（單筆局部更新），useState + callback 足以應付，
 * 符合單人專案「避免過度設計」的原則。
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

  return { records, updateRecord, resetAll, getExportData };
}
