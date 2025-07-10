import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Language {
  code: string;
  name: string;
  flag: string;
  rtl?: boolean;
}

export interface TranslationData {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private readonly STORAGE_KEY = 'crypto-exchange-language';
  private readonly DEFAULT_LANGUAGE = 'zh-TW';

  private currentLanguageSubject = new BehaviorSubject<string>(this.DEFAULT_LANGUAGE);
  private translationsSubject = new BehaviorSubject<TranslationData>({});

  public currentLanguage$ = this.currentLanguageSubject.asObservable();
  public translations$ = this.translationsSubject.asObservable();

  // 支援的語言列表
  public readonly supportedLanguages: Language[] = [
    {
      code: 'zh-TW',
      name: '繁體中文',
      flag: '🇹🇼'
    },
    {
      code: 'en',
      name: 'English',
      flag: '🇺🇸'
    }
  ];

  constructor(private http: HttpClient) {
    this.initializeLanguage();
  }

  /**
   * 初始化語言設定
   */
  private initializeLanguage(): void {
    const savedLanguage = localStorage.getItem(this.STORAGE_KEY);
    const language = savedLanguage || this.DEFAULT_LANGUAGE;

    this.setLanguage(language);
  }

  /**
   * 設定當前語言
   * @param languageCode 語言代碼
   */
  public setLanguage(languageCode: string): void {
    if (!this.isLanguageSupported(languageCode)) {
      console.warn(`Language ${languageCode} is not supported. Using default language.`);
      languageCode = this.DEFAULT_LANGUAGE;
    }

    this.currentLanguageSubject.next(languageCode);
    localStorage.setItem(this.STORAGE_KEY, languageCode);

    this.loadTranslations(languageCode);
  }

  /**
   * 獲取當前語言
   */
  public getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  /**
   * 載入翻譯文件
   * @param languageCode 語言代碼
   */
  private loadTranslations(languageCode: string): void {
    this.http.get<TranslationData>(`assets/i18n/${languageCode}.json`)
      .subscribe({
        next: (translations) => {
          this.translationsSubject.next(translations);
        },
        error: (error) => {
          console.error(`Error loading translations for ${languageCode}:`, error);
          // 如果載入失敗，嘗試載入預設語言
          if (languageCode !== this.DEFAULT_LANGUAGE) {
            this.loadTranslations(this.DEFAULT_LANGUAGE);
          }
        }
      });
  }

  /**
   * 檢查語言是否被支援
   * @param languageCode 語言代碼
   */
  private isLanguageSupported(languageCode: string): boolean {
    return this.supportedLanguages.some(lang => lang.code === languageCode);
  }

  /**
   * 獲取翻譯文字
   * @param key 翻譯鍵值
   * @param params 參數
   */
  public translate(key: string, params?: any): Observable<string> {
    return this.translations$.pipe(
      map(translations => {
        const translation = this.getNestedValue(translations, key);

        if (translation === undefined) {
          console.warn(`Translation key "${key}" not found`);
          return key;
        }

        return this.interpolate(translation, params);
      })
    );
  }

  /**
   * 同步獲取翻譯文字
   * @param key 翻譯鍵值
   * @param params 參數
   */
  public instant(key: string, params?: any): string {
    const translations = this.translationsSubject.value;
    const translation = this.getNestedValue(translations, key);

    if (translation === undefined) {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }

    return this.interpolate(translation, params);
  }

  /**
   * 獲取嵌套物件的值
   * @param obj 物件
   * @param path 路徑
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  /**
   * 插值處理
   * @param text 文字
   * @param params 參數
   */
  private interpolate(text: string, params?: any): string {
    if (!params) {
      return text;
    }

    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  /**
   * 獲取語言資訊
   * @param languageCode 語言代碼
   */
  public getLanguageInfo(languageCode: string): Language | undefined {
    return this.supportedLanguages.find(lang => lang.code === languageCode);
  }

  /**
   * 獲取所有支援的語言
   */
  public getSupportedLanguages(): Language[] {
    return this.supportedLanguages;
  }

  /**
   * 切換語言
   */
  public toggleLanguage(): void {
    const currentLang = this.getCurrentLanguage();
    const nextLang = currentLang === 'zh-TW' ? 'en' : 'zh-TW';
    this.setLanguage(nextLang);
  }

  /**
   * 獲取瀏覽器語言
   */
  public getBrowserLanguage(): string {
    const browserLang = navigator.language || (navigator as any).userLanguage;

    // 檢查瀏覽器語言是否在支援列表中
    const supportedLang = this.supportedLanguages.find(lang =>
      browserLang.startsWith(lang.code) || lang.code.startsWith(browserLang)
    );

    return supportedLang ? supportedLang.code : this.DEFAULT_LANGUAGE;
  }
}
