import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../model/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpClientMock: jest.Mocked<HttpClient>;

  const productMock: Product = {
    id: 'abc',
    name: 'Nombre producto',
    description: 'Descripción producto',
    logo: 'assets-1.png',
    date_release: '2025-01-01',
    date_revision: '2025-01-01'
  };

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<HttpClient>;

    TestBed.configureTestingModule({
      providers: [ProductService, { provide: HttpClient, useValue: httpClientMock }]
    });

    service = TestBed.inject(ProductService);
  });

  it('getProducts debería retornar una lista de productos', (done) => {
    httpClientMock.get.mockReturnValue(of({ data: [productMock] }));

    service.getProducts().subscribe((products) => {
      expect(products).toEqual([productMock]);
      expect(httpClientMock.get).toHaveBeenCalledWith(`${environment.apiBaseUrl}/products`);
      done();
    });
  });

  it('postProduct debería enviar un producto y recibir el mismo producto', (done) => {
    httpClientMock.post.mockReturnValue(of({ data: productMock }));

    service.postProduct(productMock).subscribe((product) => {
      expect(product).toEqual(productMock);
      expect(httpClientMock.post).toHaveBeenCalledWith(
        `${environment.apiBaseUrl}/products`,
        productMock
      );
      done();
    });
  });

  it('viewProduct debería retornar un producto por ID', (done) => {
    httpClientMock.get.mockReturnValue(of(productMock));

    service.viewProduct('abc').subscribe((product) => {
      expect(product).toEqual(productMock);
      expect(httpClientMock.get).toHaveBeenCalledWith(`${environment.apiBaseUrl}/products/abc`);
      done();
    });
  });

  it('validateId debería retornar true si el ID es válido', (done) => {
    httpClientMock.get.mockReturnValue(of(true));

    service.validateId('abc').subscribe((isValid) => {
      expect(isValid).toBe(true);
      expect(httpClientMock.get).toHaveBeenCalledWith(`${environment.apiBaseUrl}/products/verification/abc`);
      done();
    });
  });

  it('putProduct debería actualizar un producto y retornar el producto actualizado', (done) => {
    httpClientMock.put.mockReturnValue(of({ data: productMock }));

    service.putProduct(productMock).subscribe((product) => {
      expect(product).toEqual(productMock);
      expect(httpClientMock.put).toHaveBeenCalledWith(
        `${environment.apiBaseUrl}/products/${productMock.id}`,
        productMock
      );
      done();
    });
  });

  it('deleteProduct debería eliminar un producto y retornar el producto eliminado', (done) => {
    httpClientMock.delete.mockReturnValue(of(productMock));

    service.deleteProduct('abc').subscribe((product) => {
      expect(product).toEqual(productMock);
      expect(httpClientMock.delete).toHaveBeenCalledWith(`${environment.apiBaseUrl}/products/abc`);
      done();
    });
  });

  it('getProducts debería manejar errores', (done) => {
    httpClientMock.get.mockReturnValue(throwError(() => new Error('Error en la API')));

    service.getProducts().subscribe({
      next: () => fail('La solicitud debería haber fallado'),
      error: (error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Error en la API');
        done();
      },
    });
  });
});
