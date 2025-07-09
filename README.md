# CryptoExchange - 加密貨幣交易所媒合平台

一個使用 Angular 19 和 PrimeNG 19 建構的現代化加密貨幣交易所媒合平台，提供安全、高效的數位資產交易體驗。

## 🚀 技術規格

- **Angular**: 19.2.0
- **PrimeNG**: 19.1.3
- **TypeScript**: 5.7.2
- **SCSS**: 支援現代化樣式架構
- **SSR**: 支援伺服器端渲染 (Angular Universal)

## 📋 功能特色

### 🔐 安全性設計
- ✅ 多層次安全防護機制
- ✅ 端對端加密數據傳輸
- ✅ 用戶身份驗證與授權系統
- ✅ 交易風險控制系統

### 💹 交易功能
- ✅ 實時價格數據顯示
- ✅ 多種數位貨幣支援
- ✅ 訂單簿與交易歷史
- ✅ 高頻交易引擎整合
- ✅ 買賣訂單媒合系統

### 🎨 現代化界面
- ✅ 響應式設計，支援桌面版和行動版
- ✅ 暗色/亮色主題切換
- ✅ 即時數據視覺化圖表
- ✅ 直觀的交易操作界面
- ✅ PrimeNG 專業元件庫

### � 數據分析
- ✅ 實時市場數據分析
- ✅ 價格走勢圖表
- ✅ 交易量統計
- ✅ 市場深度分析
- ✅ 技術指標支援

### 🏗️ 架構特點
- ✅ 微服務架構設計
- ✅ 高可用性與擴展性
- ✅ Angular 19 現代化框架
- ✅ TypeScript 嚴格模式
- ✅ 模組化元件系統

## 🛠️ 開發環境設置

### 系統需求
- Node.js 18.18.0 或更高版本
- npm 或 yarn 套件管理器
- Angular CLI 19.2.15

### 安裝專案

```bash
# 克隆專案
git clone <repository-url>
cd crypto-exchange-angular

# 安裝相依套件
npm install
```

## 🚦 開發指令

### 啟動開發伺服器

```bash
npm start
# 或
ng serve
```

專案將在 `http://localhost:4200/` 啟動，並支援熱重載功能。

### 建構專案

```bash
# 開發建構
npm run build

# 生產建構
ng build --configuration production
```

建構結果將輸出到 `dist/crypto-exchange` 目錄。

### 開發監視模式

```bash
npm run watch
```

在監視模式下，檔案變更時會自動重新建構。

### 執行測試

```bash
# 單元測試
npm test

# 程式碼覆蓋率測試
ng test --code-coverage
```

## 📁 專案結構

```
src/
├── app/
│   ├── components/           # 共用元件
│   │   ├── navigation/       # 導航元件
│   │   ├── footer/          # 頁尾元件
│   │   ├── trading-chart/   # 交易圖表元件
│   │   └── order-book/      # 訂單簿元件
│   ├── pages/               # 頁面元件
│   │   ├── home/            # 首頁 - 市場概覽
│   │   ├── trading/         # 交易頁面
│   │   ├── portfolio/       # 投資組合
│   │   ├── markets/         # 市場數據
│   │   └── about/           # 關於我們
│   ├── services/            # 核心服務
│   │   ├── api.service.ts   # API 服務
│   │   ├── websocket.service.ts  # WebSocket 服務
│   │   ├── auth.service.ts  # 身份驗證服務
│   │   └── trading.service.ts    # 交易服務
│   ├── models/              # 資料模型
│   │   ├── market.model.ts  # 市場數據模型
│   │   ├── order.model.ts   # 訂單模型
│   │   └── user.model.ts    # 用戶模型
│   ├── enums/               # 列舉定義
│   │   ├── order-type.enum.ts   # 訂單類型
│   │   └── market-status.enum.ts # 市場狀態
│   ├── app.component.*      # 根元件
│   ├── app.config.ts        # 應用程式配置
│   └── app.routes.ts        # 路由配置
├── assets/
│   ├── styles.scss          # 全域樣式
│   ├── images/              # 圖片資源
│   └── scss/
│       ├── _variables.scss  # SCSS 變數定義
│       ├── _mixins.scss     # SCSS 混入
│       └── _themes.scss     # 主題定義
└── environments/            # 環境配置
    ├── environment.ts       # 開發環境
    └── environment.prod.ts  # 生產環境
```

## 🎨 現代化樣式架構

### 色彩主題系統
專案使用完整的色彩主題系統，支援加密貨幣交易所的專業需求：

- **主色調**: 現代化藍色系統 (#3b82f6)
- **成功色**: 綠色系統，用於漲幅和買入操作
- **危險色**: 紅色系統，用於跌幅和賣出操作
- **中性色**: 灰色階層，用於背景和文字
- **暗色主題**: 專為長時間使用設計的護眼模式

### SCSS 現代化特性

```scss
@use 'scss/_variables' as *;
@use 'scss/_mixins' as *;

.trading-component {
  background: var(--surface-0);
  color: var(--text-color);
  
  .price-up {
    color: $color-success-500;
  }
  
  .price-down {
    color: $color-danger-500;
  }
}
```

### 響應式設計原則
- **行動優先**: 優先考慮手機端交易體驗
- **觸控友好**: 適配觸控螢幕操作
- **高密度顯示**: 支援專業交易員的多螢幕需求

## 🧩 核心元件

### 導航元件 (NavigationComponent)
- **位置**: `src/app/components/navigation/`
- **功能**: 響應式導航、側邊欄、載入狀態
- **自訂**: 支援 `logoText` 輸入屬性
- **服務**: `NavigationService` 管理選單項目

詳細使用說明請參考：`src/app/components/navigation/README.md`

## 🔧 配置檔案

- **angular.json**: Angular CLI 專案配置
- **tsconfig.json**: TypeScript 編譯器配置
- **package.json**: 專案相依性和腳本
- **postcss.config.js**: PostCSS 配置

## 📝 開發規範

### 元件開發
1. 使用 PrimeNG 作為基礎 UI 元件庫
2. 當樣式無法符合需求時，使用自訂 SCSS
3. 所有新元件使用 Standalone Components 架構

### 樣式開發
1. 使用 SCSS 變數化處理所有可配置參數
2. 使用現代的 `@use` 語法取代 `@import`
3. 遵循 BEM 命名規範

### TypeScript
- 啟用嚴格模式 (`strict: true`)
- 使用明確的型別定義
- 遵循 Angular 編碼風格指南

## 🚀 部署

### 生產建構
```bash
ng build --configuration production
```

### SSR 建構
```bash
ng build --configuration production
npm run serve:ssr:portfolio
```

## 📞 技術支援

如需技術支援或有任何問題，請參考：
- [Angular 官方文件](https://angular.dev/)
- [PrimeNG 文件](https://primeng.org/)
- [專案 Issues](repository-issues-url)

## 📄 授權條款

本專案使用 MIT 授權條款。詳情請參閱 LICENSE 檔案。

---

*本專案使用 Angular CLI 19.2.15 建立*
