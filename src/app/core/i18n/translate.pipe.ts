import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { I18nService } from './i18n.service';

@Pipe({
  name: 'translate',
  pure: false,
  standalone: true
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private lastKey: string = '';
  private lastParams: any[] = [];
  private translationSubscription?: Subscription;
  private cachedResult: string = '';

  constructor(private i18nService: I18nService) {}

  transform(key: string, ...params: any[]): string {
    if (!key) {
      return '';
    }

    // 檢查輸入是否有變化
    const hasChanged =
      key !== this.lastKey ||
      JSON.stringify(params) !== JSON.stringify(this.lastParams);

    if (hasChanged) {
      this.lastKey = key;
      this.lastParams = params;

      // 取消之前的訂閱
      if (this.translationSubscription) {
        this.translationSubscription.unsubscribe();
      }

      // 建立新的訂閱
      this.translationSubscription = this.i18nService.translate(key, params[0])
        .subscribe(translation => {
          this.cachedResult = translation;
        });
    }

    return this.cachedResult || key;
  }

  ngOnDestroy(): void {
    if (this.translationSubscription) {
      this.translationSubscription.unsubscribe();
    }
  }
}
