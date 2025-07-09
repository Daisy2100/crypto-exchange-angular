# CryptoExchange 開發規範

開發時，請嚴格遵循以下規範進行開發。

## 技術棧

1. **Angular 19** - 主要框架
2. **PrimeNG 19** - UI 元件庫 
3. **Tailwind CSS 3.4** - 主要樣式框架
4. **SCSS** - 輔助樣式和變數管理

## 樣式開發優先級

### 第一優先：Tailwind CSS 3.4

1. **優先使用 Tailwind CSS 類別**來實現所有樣式需求
2. **響應式設計**使用 Tailwind 的斷點系統：`sm:`, `md:`, `lg:`, `xl:`, `2xl:`
3. **顏色系統**使用 Tailwind 的顏色調色盤或自定義顏色
4. **間距系統**使用 Tailwind 的 spacing scale（`p-4`, `m-6`, `space-x-2` 等）
5. **佈局系統**使用 Tailwind 的 Flexbox 和 Grid 工具類別

### 第二優先：PrimeNG 元件

1. 使用 **PrimeNG 元件**作為基礎 UI 元件
2. 通過 Tailwind 類別來**覆蓋和擴展** PrimeNG 樣式
3. 使用 PrimeNG 的 `styleClass` 屬性應用 Tailwind 類別

### 第三優先：自定義 SCSS

1. **僅在 Tailwind CSS 無法滿足需求時**才使用自定義 SCSS
2. 主要用於：
   - 複雜動畫和過渡效果
   - 特殊的偽元素效果
   - PrimeNG 元件的深度樣式覆蓋
   - 全域樣式定義

## Tailwind CSS 3.4 使用規範

### 基本原則

```html
<!-- ✅ 正確：優先使用 Tailwind 類別 -->
<div class="flex items-center justify-between p-6 bg-white rounded-lg shadow-md">
  <h2 class="text-2xl font-bold text-gray-900">標題</h2>
  <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
    按鈕
  </button>
</div>

<!-- ❌ 錯誤：不必要的自定義樣式 -->
<div class="custom-container">
  <h2 class="custom-title">標題</h2>
  <button class="custom-button">按鈕</button>
</div>
```

### 響應式設計

```html
<!-- ✅ 使用 Tailwind 響應式前綴 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div class="p-4 bg-white rounded-lg">卡片內容</div>
</div>

<!-- ✅ 行動裝置優先設計 -->
<nav class="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
  <a href="#" class="text-lg md:text-base font-medium">導航項目</a>
</nav>
```

### 顏色和主題

```html
<!-- ✅ 使用語義化顏色類別 -->
<div class="bg-green-50 border border-green-200 text-green-800 rounded-md p-4">
  成功訊息
</div>

<!-- ✅ 加密貨幣主題顏色 -->
<span class="text-green-600 font-semibold">+2.45%</span>
<span class="text-red-600 font-semibold">-1.23%</span>
<span class="text-yellow-600 font-bold">₿</span>
```

### 狀態和互動

```html
<!-- ✅ 使用 Tailwind 狀態修飾符 -->
<button class="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
  互動按鈕
</button>

<!-- ✅ 表單元素狀態 -->
<input class="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md px-3 py-2 w-full">
```

## PrimeNG + Tailwind 整合

### 元件樣式覆蓋

```html
<!-- ✅ 使用 styleClass 屬性 -->
<p-button 
  label="主要按鈕" 
  styleClass="!bg-blue-600 !border-blue-600 hover:!bg-blue-700">
</p-button>

<!-- ✅ 使用 Tailwind 類別包裝 PrimeNG 元件 -->
<div class="w-full max-w-md">
  <p-dropdown 
    [options]="options" 
    styleClass="w-full">
  </p-dropdown>
</div>
```

### 佈局包裝

```html
<!-- ✅ Tailwind 佈局 + PrimeNG 元件 -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div class="lg:col-span-2">
    <p-table [value]="data" styleClass="shadow-lg rounded-lg overflow-hidden">
    </p-table>
  </div>
  <div class="space-y-6">
    <p-card styleClass="shadow-md">
      <div class="space-y-4">
        <!-- 卡片內容 -->
      </div>
    </p-card>
  </div>
</div>
```

## 自定義 SCSS 使用規範

### 何時使用 SCSS

```scss
// ✅ 複雜動畫效果
@keyframes crypto-pulse {
  0%, 100% { 
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); 
  }
  50% { 
    box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); 
  }
}

// ✅ PrimeNG 深度樣式覆蓋
:host ::ng-deep .p-datatable {
  @apply rounded-lg overflow-hidden shadow-lg;
  
  .p-datatable-header {
    @apply bg-gray-50 border-b border-gray-200;
  }
}

// ✅ 特殊偽元素效果
.gradient-text {
  @apply bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent;
}
```

### SCSS 與 Tailwind 結合

```scss
// ✅ 使用 @apply 指令
.btn-crypto {
  @apply px-6 py-3 rounded-lg font-semibold transition-all duration-200;
  @apply bg-gradient-to-r from-blue-600 to-blue-700;
  @apply hover:from-blue-700 hover:to-blue-800;
  @apply focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
  
  // 自定義效果
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.25);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px 0 rgba(59, 130, 246, 0.35);
  }
}
```

## 專案特定規範

### 加密貨幣交易所樣式

```html
<!-- 價格顯示 -->
<div class="font-mono text-lg font-semibold">
  <span class="text-green-600">$65,234.56</span>
  <span class="text-green-500 text-sm ml-2">+2.45%</span>
</div>

<!-- 交易卡片 -->
<div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
  <!-- 內容 -->
</div>

<!-- 狀態徽章 -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
  已完成
</span>
```

### 響應式斷點

```html
<!-- 行動裝置優先 -->
<div class="px-4 sm:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      <!-- 網格內容 -->
    </div>
  </div>
</div>
```

### 暗色主題支援

```html
<!-- 使用 dark: 前綴 -->
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">標題</h2>
  <p class="text-gray-600 dark:text-gray-300">內容</p>
</div>
```

## 避免的做法

### ❌ 不要做的事情

```html
<!-- ❌ 避免：過度使用自定義 CSS -->
<div class="custom-crypto-card">
  <h2 class="custom-title">標題</h2>
</div>

<!-- ❌ 避免：內聯樣式 -->
<div style="padding: 20px; background: #f0f0f0;">內容</div>

<!-- ❌ 避免：不必要的包裝類別 -->
<div class="wrapper">
  <div class="container">
    <div class="content">內容</div>
  </div>
</div>
```

```scss
// ❌ 避免：重複 Tailwind 已有的樣式
.custom-button {
  padding: 1rem 1.5rem;
  background: #3b82f6;
  border-radius: 0.5rem;
  // 這些都可以用 Tailwind 類別替代
}
```

## 性能和最佳實踐

1. **使用 Tailwind 的 JIT 模式**（預設啟用）
2. **避免不必要的自定義 CSS**
3. **善用 Tailwind 的組合類別**
4. **使用 @apply 指令**組合重複的樣式模式
5. **配置 purge/content**確保最小化的 CSS 檔案大小

## 開發流程

1. **設計階段**：確認設計可以用 Tailwind 類別實現
2. **開發階段**：優先選擇 Tailwind 類別
3. **客製化階段**：僅在必要時加入自定義 SCSS
4. **最佳化階段**：檢查並移除不必要的自定義樣式

這些規範確保程式碼的一致性、可維護性和性能最佳化。
