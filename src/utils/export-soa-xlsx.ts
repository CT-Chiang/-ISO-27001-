import * as XLSX from 'xlsx';
import type { SoaStatus } from '../types';
import { SOA_STATUS_LABELS } from '../types';

/** 控制項類別中文標籤 */
const CATEGORY_LABELS: Record<string, string> = {
  organizational: '組織控制措施',
  people: '人員控制措施',
  physical: '實體控制措施',
  technological: '技術控制措施',
};

interface ExportRow {
  controlId: string;
  title: string;
  category: string;
  purpose: string;
  isNew: boolean;
  applicable: boolean;
  justification: string;
  status: SoaStatus;
}

/**
 * 將 SoA 資料匯出為 Excel (.xlsx) 檔案。
 * 檔名格式：SoA_ISO27001_YYYY-MM-DD.xlsx
 *
 * NOTE: 直接使用 SheetJS (xlsx) 核心 API，手動建立 <a> 元素觸發瀏覽器下載，
 *       避免 json-as-xlsx 封裝層造成的 Blob UUID 檔名問題。
 */
export function exportSoaToXlsx(rows: ExportRow[]): void {
  // NOTE: 建立表頭與資料列
  const header = [
    '控制項編號', '控制項名稱', '類別', '適用 (Y/N)',
    '排除/適用理由', '實施狀態', '控制目標', '2022 新增',
  ];

  const sheetData = [
    header,
    ...rows.map(r => [
      `A.${r.controlId}`,
      r.title,
      CATEGORY_LABELS[r.category] ?? r.category,
      r.applicable ? 'Y' : 'N',
      r.justification,
      SOA_STATUS_LABELS[r.status],
      r.purpose,
      r.isNew ? '是' : '否',
    ]),
  ];

  // NOTE: 建立 SheetJS 工作簿
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  // NOTE: 設定欄寬以提升 Excel 開啟後的可讀性
  worksheet['!cols'] = [
    { wch: 14 },  // 控制項編號
    { wch: 28 },  // 控制項名稱
    { wch: 16 },  // 類別
    { wch: 10 },  // 適用
    { wch: 30 },  // 理由
    { wch: 12 },  // 實施狀態
    { wch: 50 },  // 控制目標
    { wch: 10 },  // 2022 新增
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, 'SoA');

  // NOTE: writeFile 是 SheetJS 官方的瀏覽器下載方法，會自動處理 Blob 與檔名
  const today = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `SoA_ISO27001_${today}.xlsx`);
}
