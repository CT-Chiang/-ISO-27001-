

/**
 * 場景化範本的控制項覆寫設定。
 * NOTE: 僅列出需要「刻意覆寫」的控制項，未列出者保持原狀。
 */
interface ControlOverride {
  applicable: boolean;
  justification: string;
}

/** 單一場景範本定義 */
export interface SoaTemplate {
  id: string;
  name: string;
  description: string;
  controlsOverride: Record<string, ControlOverride>;
}

/** 各類別的預設適用理由（套用範本時自動填入空白理由欄位） */
export const DEFAULT_REASONS: Record<string, string> = {
  '5': '依據組織 ISMS 政策與風險評估結果，建立對應之管理規範與標準流程。',
  '6': '確保員工於聘僱生命週期中皆具備資安意識，並簽署相關法律協議。',
  '7': '落實辦公區域與設備之實體防護，防止非授權存取與環境損害。',
  '8': '導入技術控管措施（如端點防護、加密、備份），確保系統完整性與可用性。',
};

/**
 * 預定義的認證範圍範本。
 *
 * 為什麼只覆寫部分項目？
 * 每個範本只調整與該場景高度相關的「重點控制項」，
 * 其餘項目維持使用者的現有設定，避免大範圍覆蓋造成資料遺失。
 */
export const SOA_TEMPLATES: SoaTemplate[] = [
  {
    id: 'physical_dc',
    name: '🏢 資訊機房 (On-Premise DC)',
    description: '適用於擁有實體機房與伺服器設施的組織，強調實體安全與環境監控。',
    controlsOverride: {
      '5.7':  { applicable: true, justification: '主動收集與分析外部威脅情資，強化機房邊界防禦與事件應變能力。' },
      '7.1':  { applicable: true, justification: '針對實體機房邊界設置明確防護，防止未經授權進入。' },
      '7.2':  { applicable: true, justification: '建立機房出入管制機制，含門禁卡、生物辨識與訪客登記制度。' },
      '7.3':  { applicable: true, justification: '確保辦公室、房間及設施具備適當之實體安全防護。' },
      '7.4':  { applicable: true, justification: '實施 24/7 實體安全監控，包含 CCTV 與巡邏制度。' },
      '7.5':  { applicable: true, justification: '評估並落實火災、水災、地震等自然災害之防護措施。' },
      '7.6':  { applicable: true, justification: '管制機房安全區域之人員進出，建立分級授權機制。' },
      '7.7':  { applicable: true, justification: '維持機房桌面與螢幕之清潔策略，降低資訊洩漏風險。' },
      '7.8':  { applicable: true, justification: '確保伺服器、網路設備之安裝位置與防護符合安全規範。' },
      '7.9':  { applicable: true, justification: '針對離站資產（如備份磁帶）建立安全保管與追蹤機制。' },
      '7.10': { applicable: true, justification: '機房內部與周邊設有 24/7 監控設備，落實實體入侵偵測。' },
      '7.11': { applicable: true, justification: '保障不斷電系統、空調等機房關鍵支援設施之運作與冗餘。' },
      '7.12': { applicable: true, justification: '確保機房電力與通訊佈線符合安全標準，防止實體破壞與干擾。' },
      '7.13': { applicable: true, justification: '建立設備定期保養維護計畫，確保持續可用性。' },
      '7.14': { applicable: true, justification: '報廢或重新使用之設備須徹底清除資料，防止未授權復原。' },
      '8.9':  { applicable: true, justification: '落實伺服器與網路設備之組態基準管理，降低因錯誤配置導致之風險。' },
    },
  },
  {
    id: 'cloud_dc',
    name: '☁️ 雲端機房 (Cloud Native)',
    description: '適用於全雲端架構 (AWS/Azure/GCP)，側重於供應商管理與責任分界。',
    controlsOverride: {
      '5.7':  { applicable: true,  justification: '利用雲端服務商提供之情資服務，即時阻斷針對雲端資源之攻擊。' },
      '5.23': { applicable: true,  justification: '依據責任分界模型，定期評估雲端服務商之安全性與合規報告。' },
      '7.1':  { applicable: false, justification: '實體安全由雲端服務商 (CSP) 負責，組織僅負責邏輯存取控管。' },
      '7.2':  { applicable: false, justification: '由 CSP (AWS/Azure/GCP) 負責實體安全，組織負責邏輯存取控管。' },
      '7.3':  { applicable: false, justification: '由 CSP (AWS/Azure/GCP) 負責實體安全，組織負責邏輯存取控管。' },
      '7.4':  { applicable: false, justification: '由 CSP (AWS/Azure/GCP) 負責實體安全監控。' },
      '7.5':  { applicable: false, justification: '自然災害防護由 CSP 負責，組織透過多區域部署實現災難復原。' },
      '7.6':  { applicable: false, justification: '由 CSP (AWS/Azure/GCP) 負責安全區域管制。' },
      '7.8':  { applicable: false, justification: '設備安裝與防護由 CSP 負責，組織無實體設備。' },
      '7.9':  { applicable: false, justification: '無離站實體資產，備份資料儲存於雲端加密儲存服務。' },
      '7.10': { applicable: false, justification: '由 CSP (AWS/Azure/GCP) 負責實體儲存媒體管理。' },
      '7.11': { applicable: false, justification: '公用事業服務（電力、冷卻）由 CSP 負責。' },
      '7.12': { applicable: false, justification: '佈線安全由 CSP 負責。' },
      '7.13': { applicable: false, justification: '設備維護由 CSP 負責。' },
      '7.14': { applicable: false, justification: '設備報廢與資料清除由 CSP 負責，需確認其合規證明。' },
      '8.15': { applicable: true,  justification: '利用 CloudTrail/Log Analytics 等工具落實系統日誌記錄與稽核。' },
    },
  },
  {
    id: 'core_system',
    name: '⚙️ 核心系統 (如 ERP/CRM)',
    description: '適用於特定應用系統驗證範圍，強調資料保護與軟體開發安全 (SSDLC)。',
    controlsOverride: {
      '5.7':  { applicable: true, justification: '監控針對應用程式漏洞 (CVE) 之威脅情資，確保系統即時修補。' },
      '8.2':  { applicable: true, justification: '根據系統資料分級結果，實施對應權限管理與存取控制。' },
      '8.3':  { applicable: true, justification: '依最小權限原則限制系統功能與資料存取，定期覆核權限。' },
      '8.11': { applicable: true, justification: '針對系統內之機敏個人資料或財務資料執行遮罩處理，降低外洩風險。' },
      '8.25': { applicable: true, justification: '建立安全軟體開發生命週期 (SSDLC)，確保開發階段即導入安全設計。' },
      '8.26': { applicable: true, justification: '明確定義應用系統安全需求，納入系統設計與驗收標準。' },
      '8.28': { applicable: true, justification: '落實安全程式碼開發規範，包含代碼審查與靜態掃描。' },
      '8.29': { applicable: true, justification: '在開發與驗收階段進行安全測試（含弱點掃描與滲透測試）。' },
      '8.31': { applicable: true, justification: '嚴格區隔開發、測試與正式環境，防止未驗證程式碼進入生產。' },
      '8.32': { applicable: true, justification: '嚴格執行系統變更管理程序，避免非預期之改動影響系統穩定性。' },
      '8.33': { applicable: true, justification: '保護測試資料，確保不使用正式環境之真實機敏資料。' },
    },
  },
];
