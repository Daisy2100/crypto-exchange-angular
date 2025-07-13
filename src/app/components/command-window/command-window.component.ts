import { Component, Input, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../core/i18n/i18n.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-command-window',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './command-window.component.html',
    styleUrls: ['./command-window.component.scss']
})
export class CommandWindowComponent implements OnInit, OnDestroy {
    @Input() pushData: any = null;

    commandHistory: string[] = [
        'C:\\CryptoEx> dir',
        'Loading market data...',
        'Connection established to CryptoEx server.'
    ];

    currentCommand: string = '';
    cursorVisible: boolean = true;

    private cursorInterval?: number;
    private commandInterval?: number;
    private commandClearInterval?: number;

    private commands: string[] = [
        'status',
        'refresh',
        'monitor',
        'rm -rf *',
        'git push origin master -f',
        'X. X',
        '-. -',
        '#. #',
        'O. X',
    ];

    private commandIndex: number = 0;

    ngOnInit(): void {
        this.startCursorBlink();
        this.startAutoCommands();
    }

    ngOnDestroy(): void {
        if (this.cursorInterval) {
            clearInterval(this.cursorInterval);
        }
        if (this.commandInterval) {
            clearInterval(this.commandInterval);
        }
        if (this.commandClearInterval) {
            clearTimeout(this.commandClearInterval);
        }
    }

    ngOnChanges(): void {
        if (this.pushData) {
            this.addResult(this.pushData);
        }
    }

    private addResult(data: any): void {
        const timestamp = new Date().toLocaleTimeString();
        const formattedData = this.formatOutputData(data);
        this.commandHistory.push(`[${timestamp}] > load data: ${formattedData}`);
        this.trimHistory();
    }

    private addCommand(command: string): void {
        const timestamp = new Date().toLocaleTimeString();
        this.commandHistory.push(`[${timestamp}] C:\\CryptoEx> ${command}`);
        this.trimHistory();
    }

    private formatOutputData(data: any): string {
        try {
            if (typeof data === 'object') {
                // 美化 JSON 輸出
                return JSON.stringify(data, null, 2)
                    .replace(/"/g, '')  // 移除引號使輸出更清潔
                    .replace(/\n/g, ' ') // 單行顯示
                    .replace(/\s+/g, ' '); // 清理多餘空格
            }
            return String(data);
        } catch (error) {
            return 'Invalid data format';
        }
    }

    private trimHistory(): void {
        if (this.commandHistory.length > 10) {
            this.commandHistory.shift();
        }
    }

    // 公開方法：手動添加命令（供外部調用）
    public addCustomCommand(command: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = this.getTypePrefix(type);
        this.commandHistory.push(`[${timestamp}] ${prefix} ${command}`);
        this.trimHistory();
    }

    private getTypePrefix(type: string): string {
        switch (type) {
            case 'success': return '✓';
            case 'error': return '✗';
            case 'warning': return '⚠';
            default: return '>';
        }
    }

    private startCursorBlink(): void {
        this.cursorInterval = window.setInterval(() => {
            this.cursorVisible = !this.cursorVisible;
        }, 500);
    }

    private startAutoCommands(): void {
        this.commandInterval = window.setInterval(() => {
            this.addCommand(this.commands[this.commandIndex]);

            this.commandClearInterval = window.setTimeout(() => {
                this.currentCommand = '';
                this.commandIndex = (this.commandIndex + 1) % this.commands.length;
            }, 20000);
        }, 50000);
    }
}
