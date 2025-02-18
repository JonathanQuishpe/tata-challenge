import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddProductComponent } from './add-product.component';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from '../../service/product.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
const mockProductService = {
  validateId: jest.fn(),
  postProduct: jest.fn()
};

const mockRouter = {
  navigate: jest.fn()
};

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AddProductComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form group correctly', () => {
    expect(component.productForm instanceof FormGroup).toBe(true);
    expect(component.productForm.controls['id']).toBeDefined();
    expect(component.productForm.controls['name']).toBeDefined();
    expect(component.productForm.controls['description']).toBeDefined();
  });

  it('should set date_revision when date_release is changed', () => {
    const dateReleaseControl = component.productForm.get('date_release');
    const dateRevisionControl = component.productForm.get('date_revision');

    dateReleaseControl?.setValue('2025-02-18');
    expect(dateRevisionControl?.value).toBe('2026-02-18');
  });

  it('should handle error responses correctly', async () => {
    const validProduct = {
      id: 'validId',
      name: 'Product Name',
      description: 'Valid description',
      logo: 'logo.png',
      date_release: '2025-02-18',
      date_revision: '2026-02-18'
    };

    component.productForm.setValue(validProduct);

    mockProductService.validateId.mockReturnValueOnce(of(false)); // Simula que el ID no es duplicado
    mockProductService.postProduct.mockReturnValueOnce(throwError({ error: { message: 'Error saving product' } }));

    await component.onSubmit();

    expect(component.errorMessages).toBe('');
  });

});
