import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateProductComponent } from './update-product.component';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../service/product.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ErrorResponse } from '../../model/error.model';
import { Product } from '../../model/product.model';

jest.mock('../../service/product.service');
jest.mock('@angular/router');
class MockHttpClient {
  get = jest.fn();
  post = jest.fn();
  put = jest.fn();
  delete = jest.fn();
}

describe('UpdateProductComponent', () => {
  let component: UpdateProductComponent;
  let fixture: ComponentFixture<UpdateProductComponent>;
  let mockProductService: ProductService;
  let mockRouter: Router;
  let mockActivatedRoute: ActivatedRoute;
  let mockHttpClient: MockHttpClient;

  beforeEach(async () => {
    mockHttpClient = new MockHttpClient();
    mockProductService = new ProductService(mockHttpClient as any);
    mockRouter = { navigate: jest.fn() } as any;
    mockActivatedRoute = { params: of({ id: '123' }) } as any;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, UpdateProductComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the product form', () => {
    const formGroup = component.productForm;
    expect(formGroup).toBeDefined();
    expect(formGroup.controls['id']).toBeDefined();
    expect(formGroup.controls['name']).toBeDefined();
    expect(formGroup.controls['description']).toBeDefined();
    expect(formGroup.controls['logo']).toBeDefined();
    expect(formGroup.controls['date_release']).toBeDefined();
    expect(formGroup.controls['date_revision']).toBeDefined();
  });

  it('should load product data when the component initializes', async () => {
    const mockProduct: Product = {
      id: '123',
      name: 'Product Name',
      description: 'Product Description',
      logo: 'logo.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01'
    };

    mockProductService.viewProduct = jest.fn().mockResolvedValue(mockProduct);

    await component.loadProduct();
    fixture.detectChanges();

    expect(mockProductService.viewProduct).toHaveBeenCalledWith('123');
    expect(component.productForm.get('id')?.value).toBe('123');
    expect(component.productForm.get('name')?.value).toBe('Product Name');
    expect(component.productForm.get('description')?.value).toBe('Product Description');
    expect(component.productForm.get('logo')?.value).toBe('logo.png');
    expect(component.productForm.get('date_release')?.value).toBe('2025-01-01');
    expect(component.productForm.get('date_revision')?.value).toBe('2026-01-01');
  });

  it('should handle error when loading product data', async () => {
    const mockErrorResponse: ErrorResponse = { message: 'Product not found' };
    mockProductService.viewProduct = jest.fn().mockRejectedValue({ error: mockErrorResponse });

    await component.loadProduct();
    fixture.detectChanges();

    expect(component.errorMessages).toBe('Product not found');
  });

  it('should submit the form successfully', async () => {
    const mockProduct: Product = {
      id: '123',
      name: 'Updated Product Name',
      description: 'Updated Product Description',
      logo: 'updated_logo.png',
      date_release: '2025-02-01',
      date_revision: '2026-02-01'
    };

    mockProductService.putProduct = jest.fn().mockResolvedValue({});

    component.productForm.patchValue(mockProduct);
    await component.onSubmit();
    fixture.detectChanges();

    expect(mockProductService.putProduct).toHaveBeenCalledWith(mockProduct);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle error when submitting the form', async () => {
    const mockErrorResponse: ErrorResponse = { message: 'Error updating product' };
    mockProductService.putProduct = jest.fn().mockRejectedValue({ error: mockErrorResponse });

    const mockProduct: Product = {
      id: '123',
      name: 'Updated Product Name',
      description: 'Updated Product Description',
      logo: 'updated_logo.png',
      date_release: '2025-02-01',
      date_revision: '2026-02-01'
    };

    component.productForm.patchValue(mockProduct);
    await component.onSubmit();
    fixture.detectChanges();

    expect(component.errorMessages).toBe('Error updating product');
  });

  it('should disable the submit button if the form is invalid', () => {
    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBeTruthy();

    component.productForm.patchValue({ name: 'Valid Product' });
    fixture.detectChanges();
    expect(submitButton.disabled).toBeFalsy();
  });
});
