import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService, Language } from '../i18n/i18n.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss']
})
export class LanguageSwitcherComponent implements OnInit, OnDestroy {
  currentLanguage: string = '';
  supportedLanguages: Language[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private i18nService: I18nService) { }

  ngOnInit(): void {
    this.supportedLanguages = this.i18nService.getSupportedLanguages();

    this.subscription.add(
      this.i18nService.currentLanguage$.subscribe(lang => {
        this.currentLanguage = lang;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * 切換語言
   * @param languageCode 語言代碼
   */
  switchLanguage(languageCode: string): void {
    console.log('語言切換按鈕被點擊，目標語言：', languageCode);
    console.log('當前語言：', this.currentLanguage);
    this.i18nService.setLanguage(languageCode);
    console.log('語言切換完成，新語言：', languageCode);
  }

  /**
   * 獲取語言顯示代碼
   * @param languageCode 語言代碼
   */
  getLanguageDisplayCode(languageCode: string): string {
    switch (languageCode) {
      case 'zh-TW':
        return 'TW';
      case 'en':
        return 'EN';
      default:
        return languageCode.toUpperCase();
    }
  }

  /**
   * 檢查是否為當前語言
   * @param languageCode 語言代碼
   */
  isCurrentLanguage(languageCode: string): boolean {
    return this.currentLanguage === languageCode;
  }

  /**
   * 獲取語言名稱
   * @param languageCode 語言代碼
   */
  getLanguageName(languageCode: string): string {
    const language = this.supportedLanguages.find(lang => lang.code === languageCode);
    return language ? language.name : languageCode;
  }

  /**
   * 獲取語言旗幟
   * @param languageCode 語言代碼
   */
  getLanguageFlag(languageCode: string): string {
    const language = this.supportedLanguages.find(lang => lang.code === languageCode);
    return language ? language.flag : '🌐';
  }

  /**
   * 處理鍵盤事件
   * @param event 鍵盤事件
   * @param languageCode 語言代碼
   */
  onKeyDown(event: KeyboardEvent, languageCode: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.switchLanguage(languageCode);
    }
  }

  /**
   * TrackBy 函數用於 ngFor 效能優化
   * @param index 索引
   * @param language 語言物件
   */
  trackByLanguage(index: number, language: Language): string {
    return language.code;
  }
}
