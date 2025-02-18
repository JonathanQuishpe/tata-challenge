import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ModalDeleteComponent } from "./modal-delete.component";
import { ProductService } from "../../service/product.service";
import { CommonModule } from "@angular/common";
import { of, throwError } from "rxjs";
import { Product } from "../../model/product.model";
import { By } from "@angular/platform-browser";

describe("ModalDeleteComponent", () => {
    let component: ModalDeleteComponent;
    let fixture: ComponentFixture<ModalDeleteComponent>;
    let productServiceMock: any;

    beforeEach(async () => {
        productServiceMock = {
            deleteProduct: jest.fn()
        };

        await TestBed.configureTestingModule({
            imports: [CommonModule, ModalDeleteComponent],
            providers: [{ provide: ProductService, useValue: productServiceMock }]
        }).compileComponents();

        fixture = TestBed.createComponent(ModalDeleteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should show modal when isVisible is true", () => {
        component.isVisible = true;
        fixture.detectChanges();

        const modal = fixture.debugElement.query(By.css(".modal"));
        expect(modal).toBeTruthy();
    });

    it("should not show modal when isVisible is false", () => {
        component.isVisible = false;
        fixture.detectChanges();

        const modal = fixture.debugElement.query(By.css(".modal"));
        expect(modal).toBeFalsy();
    });

    it("should emit closeModalEvent when close button is clicked", () => {
        jest.spyOn(component.closeModalEvent, "emit");

        component.isVisible = true;
        fixture.detectChanges();

        const closeButton = fixture.debugElement.query(By.css(".close"));
        closeButton.nativeElement.click();

        expect(component.closeModalEvent.emit).toHaveBeenCalled();
    });

    it("should emit closeModalEvent when clicking outside modal", () => {
        jest.spyOn(component.closeModalEvent, "emit");

        component.isVisible = true;
        fixture.detectChanges();

        const modal = fixture.debugElement.query(By.css(".modal"));
        modal.nativeElement.click();

        expect(component.closeModalEvent.emit).toHaveBeenCalled();
    });

    it("should call deleteProduct when confirm button is clicked", async () => {
        const mockProduct: Product = {
            id: "123",
            name: "Test Product",
            description: "Test Desc",
            logo: "test-logo.png",
            date_release: "2025-01-01",
            date_revision: "2025-01-01"
        };
        component.product = mockProduct;
        jest.spyOn(productServiceMock, "deleteProduct").mockReturnValue(of(null));
        jest.spyOn(component.refreshTable, "emit");

        component.isVisible = true;
        fixture.detectChanges();

        const confirmButton = fixture.debugElement.query(By.css(".btn-primary"));
        confirmButton.nativeElement.click();

        await fixture.whenStable();
        expect(productServiceMock.deleteProduct).toHaveBeenCalledWith("123");
        expect(component.refreshTable.emit).toHaveBeenCalled();
    });

    it("should set errorMessages when deleteProduct fails", async () => {
        const mockProduct: Product = { id: "123", name: "Test", description: "", logo: "", date_release: "", date_revision: "" };
        component.product = mockProduct;
        jest.spyOn(productServiceMock, "deleteProduct").mockReturnValue(throwError(() => ({ error: { message: "Error deleting" } })));

        component.isVisible = true;
        fixture.detectChanges();

        const confirmButton = fixture.debugElement.query(By.css(".btn-primary"));
        confirmButton.nativeElement.click();

        await fixture.whenStable();
        expect(component.errorMessages).toBe("Error deleting");
    });

    it("should disable buttons when loading", () => {
        component.loading = true;
        fixture.detectChanges();

        const buttons = fixture.debugElement.queryAll(By.css("button"));
        buttons.forEach(button => {
            expect(button.nativeElement.disabled).toBeTruthy();
        });
    });
});
