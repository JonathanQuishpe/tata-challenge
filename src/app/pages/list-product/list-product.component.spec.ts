import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListProductComponent } from './list-product.component';
import { ProductService } from '../../service/product.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ModalDeleteComponent } from '../../components/modal-delete/modal-delete.component';
import { SkeletonComponent } from '../../components/skeleton/skeleton.component';

describe('ListProductComponent', () => {
  let component: ListProductComponent;
  let fixture: ComponentFixture<ListProductComponent>;
  let productServiceMock: any;
  let routerMock: any;

  const mockProducts = [
    {
      id: '1',
      name: 'Producto 1',
      description: 'Descripción 1',
      logo: 'logo1.png',
      date_release: '2025-01-01',
      date_revision: '2025-06-01'
    },
    {
      id: '2',
      name: 'Producto 2',
      description: 'Descripción 2',
      logo: 'logo2.png',
      date_release: '2025-02-01',
      date_revision: '2025-07-01'
    }
  ];

  beforeEach(async () => {
    productServiceMock = {
      getProducts: jest.fn().mockReturnValue(of(mockProducts))
    };

    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, ModalDeleteComponent, SkeletonComponent, ListProductComponent], // Aquí agregamos ListProductComponent en imports
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', async () => {
    await component.loadProducts();
    expect(component.products.length).toBe(2);
    expect(component.filtered.length).toBe(2);
  });

  it('should navigate to create product page', () => {
    component.goToCreate();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/add-product']);
  });

  it('should filter products by search term', () => {
    component.searchTerm = 'Producto 1';
    component.filterProducts();
    expect(component.filtered.length).toBe(1);
    expect(component.filtered[0].name).toBe('Producto 1');
  });

  it('should filter products by description', () => {
    component.searchTerm = 'Descripción 2';
    component.filterProducts();
    expect(component.filtered.length).toBe(1);
    expect(component.filtered[0].description).toBe('Descripción 2');
  });

  it('should reset filter when search term is empty', () => {
    component.searchTerm = '';
    component.filterProducts();
    expect(component.filtered.length).toBe(2);
  });

  it('should update perPage value and slice products accordingly', () => {
    const event = { target: { value: '1' } };
    component.onActionPagination(event);
    expect(component.perPage).toBe('1');
    expect(component.filtered.length).toBe(1);
  });

  it('should open modal when delete action is selected', () => {
    const event = { target: { value: 'delete' } };
    component.onActionSelected(event, mockProducts[0]);
    expect(component.selectedProduct).toEqual(mockProducts[0]);
    expect(component.isModalVisible).toBeTruthy();
  });

  it('should navigate to update page when edit action is selected', () => {
    const event = { target: { value: 'update' } };
    component.onActionSelected(event, mockProducts[1]);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/2/update-product']);
  });

  it('should close modal', () => {
    component.closeModal();
    expect(component.isModalVisible).toBeFalsy();
  });

  it('should refresh products after deletion', async () => {
    jest.spyOn(component, 'loadProducts');
    component.refresh();
    expect(component.isModalVisible).toBeFalsy();
    expect(component.loadProducts).toHaveBeenCalled();
  });
});