# 系統架構與技術細節 (Technical Architecture)

## 🏛️ 架構設計說明 (Architecture Overview)

本專案完全不依賴後端 APIs 即可運行，核心資料作為靜態 JSON 層嵌入於前端：

1. **資料流與狀態管理 (State Management)**
   - **Centralized State**：以 `App.tsx` 作為「聰明元件 (Smart Component)」，集中管理 `searchQuery`（搜尋）、`activeCategory`（分類）、`scenarioIds`（情境）等全域狀態。
   - **Derived State**：在 `App.tsx` 中大量使用 `useMemo`，根據目前的狀態動態組合出 `filteredControls`，再將過濾後的結果作為 props 往下層遞給展示型元件 (Dumb Components)。
   - **單向資料流**：確保各 `components/` 互相獨立，提升元件的可重用性與測試便利性。

2. **效能優化 (Performance)**
   - 使用 `useMemo` 快取過濾條件（例如將陣列轉為 `Set` 物件），將 O(n) 的反覆陣列搜尋降為 O(1)，即使未來資料量擴大仍能維持介面流暢。

3. **視覺與體驗 (UX/UI)**
   - **Tailwind 驅動**：全局套用自訂的暗色網路安全（Cybersecurity）風格，無外部大型 UI 函式庫依賴，打包體積小。
   - **無障礙存取 (A11y)**：浮動抽屜支援「Escape 鍵」快速關閉，符合基本的介面可用性原則。
   - **動態回饋**：提供微動畫 (Micro-animations) 如卡片 Hover、玻璃擬態光澤、新項目呼吸燈，以及情境模式的專屬高亮指示器。

---

## 📂 專案目錄結構摘要 (Project Structure)

```text
D:\SynologyDrive\ISO27001-Web
├── 📄 index.html                # 應用程式進入點與基礎 HTML 骨架（含 Meta SEO 與暗色模式樣式）
├── 📄 tailwind.config.js        # Tailwind 樣式設定（自訂資安主題色調、字體與 Glassmorphism 擴充）
├── 📄 package.json              # 專案套件相依性與指令 (React, Vite, TailwindCSS)
├── 📄 tsconfig.json             # TypeScript 編譯設定檔
│
├── public/                      # 靜態資源目錄
│   └── 🖼️ vite.svg                # Vite Logo
│
└── src/                         # 🌟 原始碼核心目錄
    ├── 📄 main.tsx              # React 應用的掛載點 (Mounting Point)
    ├── 📄 App.tsx               # 應用的根元件，負責全域狀態管理與佈局組合
    ├── 📄 index.css             # 全域 CSS 樣式、自訂動畫與捲軸樣式 (Cybersecurity Theme)
    ├── 📄 App.css               # 元件特定樣式
    │
    ├── assets/                  
    │   └── 🖼️ react.svg         # React Logo (預設靜態圖片)
    │
    ├── types/                   # TypeScript 型別定義
    │   └── 📄 index.ts          # 定義 Control (控制項)、CategoryInfo 等核心資料型別
    │
    ├── data/                    # 本地端靜態資料層
    │   └── 📄 controls-data.ts  # ISO 27001:2022 完整 93 項控制措施資料集與情境設定
    │
    ├── constants/               # 共用常數設定
    │   └── 📄 category.ts       # 四大控制類別 (組織/人員/實體/技術) 的標籤、字串與樣式映射常數
    │
    └── components/              # UI 視圖元件 (純粹負責渲染與內部狀態)
        ├── 📄 CategoryNav.tsx   # 左側邊欄：四大類別導覽選單與數量統計
        ├── 📄 SearchBar.tsx     # 頂部：關鍵字與編號搜尋輸入框 (已停用 autoComplete 提升安全性)
        ├── 📄 StatsBar.tsx      # 頂部：所有過濾結果與總計數據儀表板
        ├── 📄 ScenarioAdvisor.tsx # 情境引導面板：依使用者情境推薦特定 ISO 控制項
        ├── 📄 ControlGrid.tsx     # 網格容器：負責動態排版控制項卡片
        ├── 📄 ControlCard.tsx     # 單一控制項卡片摘要 (含 Glassmorphism 樣式與標籤)
        └── 📄 ControlDetail.tsx   # 互動式抽屜 (Drawer)：顯示控制項目標、要求與技術實務細節
```
