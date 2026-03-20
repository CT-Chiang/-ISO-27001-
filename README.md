# ISO 27001:2022 資訊安全控制項查詢系統 (SPA)

本專案為一個基於 **React + TypeScript + Vite** 開發的輕量級單頁應用程式 (Single Page Application)，旨在提供使用者互動式地查詢 ISO 27001:2022 附錄 A (Annex A) 的 93 項重點控制措施。

## 🌟 功能亮點
- **93 項完整控制項**：涵蓋組織、人員、實體、技術四大類別。
- **📋 SoA 編輯器**：逐項標記適用性、填寫理由與實施狀態，支援匯出 Excel 稽核範本（`SoA_ISO27001_日期.xlsx`），資料透過 `localStorage` 自動保存。
- **9 大情境引導**：針對雲端遷移、個資處理、DLP 等常見資安場景提供精準推薦。
- **行動版優化**：重構 Header 佈局與側選單，解決小螢幕遮蔽問題並強化導覽體驗。
- **現代介面**：採用暗色資安風格 (Cybersecurity Dark Theme) 與玻璃擬態設計。

> ⚠️ **資安提醒**：本工具僅供範本產出，請勿輸入任何公司敏感機密資訊於瀏覽器中。所有 SoA 資料僅儲存於您的瀏覽器 localStorage，不會傳輸至任何伺服器。

## 📚 技術文件

詳細的系統架構、元件設計與資料流邏輯，請參閱技術說明文件：
- [技術架構與目錄結構 (Architecture Overview)](docs/technical_architecture.md)

## 🚀 開發與部署

1. **安裝相依套件**：
   ```bash
   npm install
   ```

2. **啟動開發伺服器**：
   ```bash
   npm run dev
   ```

3. **建置正式版本**：
   ```bash
   npm run build
   ```
   *建立的靜態檔案將輸出至 `dist/` 目錄，可直接部署至任何靜態檔案伺服器 (如 Nginx, GitHub Pages, Vercel 等)。*
