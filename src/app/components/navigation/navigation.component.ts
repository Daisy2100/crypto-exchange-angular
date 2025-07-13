import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { NavigationService, NavigationItem } from './navigation.service';
import { TranslatePipe } from '@core/i18n/translate.pipe';
import { I18nService } from '@core/i18n/i18n.service';

@Component({
    selector: 'app-navigation',
    standalone: true,
    imports: [RouterModule, MenubarModule, BadgeModule, InputTextModule, AvatarModule, RippleModule, SidebarModule, ButtonModule, CommonModule, TranslatePipe],
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.scss'
})

export class NavigationComponent implements OnInit, OnDestroy {
    isMobile: boolean = false;
    private resizeListener: (() => void) | null = null;
    @Input() logoText: string = 'CryptoExchange'; // 可自定義的 Logo 文字

    menuItems: MenuItem[] = [];
    navigationItems: NavigationItem[] = [];
    isLoading: boolean = true;
    sidebarVisible: boolean = false;

    // 賽博龐克動畫相關
    currentCharIndex: number = 0;
    animationInterval: any = null;

    constructor(
        private navigationService: NavigationService,
        private i18nService: I18nService
    ) { }

    ngOnInit() {
        this.loadNavigationItems();
        this.startCyberpunkAnimation();

        // 監聽語言變化
        this.i18nService.currentLanguage$.subscribe(() => {
            this.loadNavigationItems();
        });

        // 初始化 isMobile 狀態
        this.updateIsMobile();
        this.resizeListener = () => this.updateIsMobile();
        window.addEventListener('resize', this.resizeListener);
    }

    ngOnDestroy() {
        // 清理動畫定時器
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }

        // 移除 resize 監聽
        if (this.resizeListener) {
            window.removeEventListener('resize', this.resizeListener);
            this.resizeListener = null;
        }
    }

    /**
     * 根據螢幕寬度更新 isMobile 狀態
     */
    updateIsMobile() {
        this.isMobile = window.innerWidth < 960;
    }

    /**
     * 載入導航選單項目
     */
    loadNavigationItems() {
        this.isLoading = true;
        this.navigationService.getNavigationItems().subscribe({
            next: (items) => {
                this.navigationItems = this.navigationService.sortNavigationItems(items);
                this.menuItems = this.convertToMenuItems(this.navigationItems);
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Failed to load navigation items:', error);
                // 發生錯誤時使用預設項目
                this.navigationItems = this.navigationService.sortNavigationItems(
                    this.navigationService.getDefaultNavigationItems()
                );
                this.menuItems = this.convertToMenuItems(this.navigationItems);
                this.isLoading = false;
            }
        });
    }

    /**
     * 將 NavigationItem 轉換為 PrimeNG MenuItem
     */
    private convertToMenuItems(items: NavigationItem[]): MenuItem[] {
        return items.map(item => {
            const menuItem: MenuItem = {
                id: item.id,
                label: item.displayName,
                routerLink: item.path,
                styleClass: item.isActive ? 'p-menuitem-link-active' : '',
                items: item.children ? this.convertToMenuItems(item.children) : undefined
            };

            // 如果有子項目，移除 routerLink，讓它作為下拉選單
            if (item.children && item.children.length > 0) {
                delete menuItem.routerLink;
            }

            return menuItem;
        });
    }

    /**
     * 重新載入導航選單項目
     */
    reloadNavigationItems() {
        this.loadNavigationItems();
    }

    /**
     * 切換側邊欄顯示狀態
     */
    toggleSidebar() {
        this.sidebarVisible = !this.sidebarVisible;
    }

    /**
     * 關閉側邊欄
     */
    closeSidebar() {
        this.sidebarVisible = false;
    }

    /**
     * 追蹤函數，用於 *ngFor 優化
     */
    trackByNavItem(index: number, item: NavigationItem): string {
        return item.id;
    }

    /**
     * 檢查導航項目是否有子項目
     */
    hasChildren(item: NavigationItem): boolean {
        return this.navigationService.hasChildren(item);
    }

    /**
     * 啟動賽博龐克動畫效果
     */
    startCyberpunkAnimation() {
        // 每 1.5 秒切換到下一個字符位置
        this.animationInterval = setInterval(() => {
            this.currentCharIndex = (this.currentCharIndex + 1) % this.logoText.length;
        }, 1500);
    }

    /**
     * 獲取帶有動畫效果的 Logo HTML
     */
    getAnimatedLogoHTML(): string {
        if (!this.logoText) return '';

        return this.logoText
            .split('')
            .map((char, index) => {
                const isActive = index === this.currentCharIndex;
                const className = isActive ? 'animate-char active' : 'animate-char';
                return `<span class="${className}">${char}</span>`;
            })
            .join('');
    }
}
