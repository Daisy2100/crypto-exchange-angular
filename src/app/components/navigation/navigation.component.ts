import { Component, OnInit, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { NavigationService, NavigationItem } from './navigation.service';

@Component({
    selector: 'app-navigation',
    standalone: true,
    imports: [RouterModule, MenubarModule, BadgeModule, InputTextModule, AvatarModule, RippleModule, SidebarModule, CommonModule],
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit {
    @Input() logoText: string = 'CryptoExchange'; // 可自定義的 Logo 文字

    menuItems: MenuItem[] = [];
    navigationItems: NavigationItem[] = [];
    isLoading: boolean = true;
    sidebarVisible: boolean = false;

    constructor(private navigationService: NavigationService) { }

    ngOnInit() {
        this.loadNavigationItems();
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
        return items.map(item => ({
            id: item.id,
            label: item.displayName,
            routerLink: item.path,
            items: item.children ? this.convertToMenuItems(item.children) : undefined,
            styleClass: item.isActive ? 'active' : ''
        }));
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
}
