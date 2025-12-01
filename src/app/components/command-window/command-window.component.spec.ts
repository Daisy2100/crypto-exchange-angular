import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommandWindowComponent } from './command-window.component';

describe('CommandWindowComponent', () => {
    let component: CommandWindowComponent;
    let fixture: ComponentFixture<CommandWindowComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CommandWindowComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CommandWindowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('應該成功創建', () => {
        expect(component).toBeTruthy();
    });

    it('應該顯示初始命令歷史', () => {
        expect(component.commandHistory.length).toBeGreaterThan(0);
        expect(component.commandHistory[0]).toBe('C:\\CryptoEx> dir');
    });

    it('應該處理推送數據', () => {
        const testData = { test: 'data', value: 123 };
        component.pushData = testData;
        component.ngOnChanges();

        const lastCommand = component.commandHistory[component.commandHistory.length - 1];
        expect(lastCommand).toContain('load data:');
        // The data is formatted without quotes
        expect(lastCommand).toContain('test:');
        expect(lastCommand).toContain('data');
        expect(lastCommand).toContain('value:');
        expect(lastCommand).toContain('123');
    });

    it('應該限制命令歷史最大數量', () => {
        // 添加超過 10 條記錄
        for (let i = 0; i < 15; i++) {
            component['addCommand'](`test command ${i}`);
        }

        expect(component.commandHistory.length).toBeLessThanOrEqual(10);
    });

    it('應該在組件銷毀時清理定時器', () => {
        // Start the component properly so intervals exist
        component.ngOnInit();
        
        spyOn(window, 'clearInterval');
        spyOn(window, 'clearTimeout');

        component.ngOnDestroy();

        expect(window.clearInterval).toHaveBeenCalled();
    });
});
