# CommandWindow 元件

模擬終端機命令視窗的 Angular 元件，提供復古風格的命令行介面顯示。

## 功能特色

- 🖥️ 復古終端機樣式設計
- 📜 命令歷史記錄顯示
- ⚡ 實時數據推送支援
- 🔄 自動命令執行動畫
- 💫 閃爍游標效果
- 📱 響應式設計

## 使用方式

### 基本用法

```html
<app-command-window></app-command-window>
```

### 傳入數據

```html
<app-command-window [pushData]="apiResponse"></app-command-window>
```

## 屬性 (Props)

| 屬性名 | 類型 | 默認值 | 說明 |
|--------|------|--------|------|
| `pushData` | `any` | `null` | 推送到命令視窗的數據，會自動轉換為 JSON 字串顯示 |

## 樣式特色

本元件採用了符合加密貨幣交易平台的未來科技風格：

- 🌈 **漸變邊框**：Cyan 到 Pink 的科技感漸變
- ✨ **霓虹發光**：動態的發光效果和脈衝動畫
- 🎯 **智能配色**：根據內容類型自動高亮（成功/錯誤/警告）
- 🌙 **主題適應**：自動適應亮色/暗色主題
- 📱 **響應式**：完美適配各種螢幕尺寸

### 配色方案

- **主要色彩**：Cyan (#06b6d4) 和 Fuchsia (#ec4899)
- **背景漸變**：深灰到黑色的漸變背景
- **文字高亮**：
  - 成功訊息：Emerald (#10b981)
  - 錯誤訊息：Red (#ef4444)  
  - 警告訊息：Amber (#f59e0b)
  - 一般訊息：Gray (#a1a1aa)

## 技術實現

- **框架**：Angular 19
- **樣式**：Tailwind CSS + SCSS
- **類型**：Standalone Component
- **依賴**：CommonModule

## 範例整合

```typescript
// 在父元件中
export class ParentComponent {
  apiResponse = {
    status: 'success',
    data: { price: 65234.56, volume: 1234.56 }
  };
}
```

```html
<!-- 在父元件模板中 -->
<app-command-window [pushData]="apiResponse"></app-command-window>
```

## 注意事項

1. 命令歷史最多保留 10 筆記錄，超過會自動清除最舊的記錄
2. 自動命令執行間隔為 50 秒
3. 游標閃爍間隔為 0.5 秒
4. 元件會在 `ngOnDestroy` 時自動清理所有定時器
5. `pushData` 變更時會觸發 `ngOnChanges` 自動更新顯示

## 相容性

- Angular 19+
- 現代瀏覽器 (支援 CSS Grid 和 Flexbox)
- 行動裝置友善
