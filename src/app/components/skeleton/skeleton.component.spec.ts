import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonComponent } from './skeleton.component';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

describe('SkeletonComponent', () => {
    let component: SkeletonComponent;
    let fixture: ComponentFixture<SkeletonComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule, SkeletonComponent],
        });

        fixture = TestBed.createComponent(SkeletonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should render correct number of skeleton rows', () => {
        const rows = fixture.debugElement.queryAll(By.css('.skeleton-row'));
        expect(rows.length).toBe(component.rows);
    });

    it('should render correct number of skeleton columns per row', () => {
        const firstRow = fixture.debugElement.query(By.css('.skeleton-row'));
        const columns = firstRow.queryAll(By.css('.skeleton-cell'));
        expect(columns.length).toBe(component.columns);
    });

    it('should update the skeleton when rows and columns change', () => {
        component.rows = 3;
        component.columns = 2;
        fixture.detectChanges();

        const rows = fixture.debugElement.queryAll(By.css('.skeleton-row'));
        expect(rows.length).toBe(3);

        const firstRow = rows[0].queryAll(By.css('.skeleton-cell'));
        expect(firstRow.length).toBe(2);
    });

    it('should have skeleton-loader class in the root div', () => {
        const skeletonLoader = fixture.debugElement.query(By.css('.skeleton-loader'));
        expect(skeletonLoader).toBeTruthy();
    });
});
