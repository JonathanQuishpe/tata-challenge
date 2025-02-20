import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../service/product.service';
import { Product } from '../../model/product.model';
import { firstValueFrom } from 'rxjs';
import { ErrorResponse } from '../../model/error.model';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { dateGreaterThanOrEqualValidator } from '../../validators/validators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.scss'
})
export class UpdateProductComponent implements OnInit {
  productId: string = "";
  loading: boolean = false;
  errorMessages: string = "";

  productForm = new FormGroup({
    id: new FormControl({ value: '', disabled: true }, [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]),
    logo: new FormControl('', [Validators.required]),
    date_release: new FormControl('', [Validators.required, dateGreaterThanOrEqualValidator()]),
    date_revision: new FormControl({ value: '', disabled: true }, Validators.required),
  });

  constructor(private route: ActivatedRoute, private productService: ProductService, private router: Router) {

    this.productForm.get('date_release')?.valueChanges.subscribe(value => {
      if (value) {
        const date = new Date(value);
        date.setFullYear(date.getFullYear() + 1);
        const dateFormated = date.toISOString().split('T')[0];
        this.productForm.get('date_revision')?.setValue(dateFormated);
      }
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.productId = params['id'];
      }
      if (this.productId) {
        this.loadProduct();
      }
    });
  }

  async loadProduct(): Promise<void> {
    this.loading = true;
    try {
      const product: Product = await firstValueFrom(this.productService.viewProduct(this.productId));
      this.productForm.patchValue({
        id: product.id,
        name: product.name,
        description: product.description,
        logo: product.logo,
        date_release: product.date_release,
        date_revision: product.date_revision,
      });
    } catch (res: any) {
      const errorResponse: ErrorResponse = res.error;
      this.errorMessages = errorResponse.message
        ? errorResponse.message
        : 'Problemas al conectar al servidor. Intente más tarde !!!!';
    } finally {
      this.loading = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.productForm.valid) {
      try {
        this.errorMessages = "";
        this.loading = true;


        const product: Product = {
          id: this.productForm.get('id')?.value || '',
          name: this.productForm.get('name')?.value || '',
          description: this.productForm.get('description')?.value || '',
          logo: this.productForm.get('logo')?.value || '',
          date_release: this.productForm.get('date_release')?.value || '',
          date_revision: this.productForm.get('date_revision')?.value || ''
        };

        await firstValueFrom(this.productService.putProduct(product));
        this.router.navigate(['/']);
      } catch (res: any) {
        const errorResponse: ErrorResponse = res.error;
        this.errorMessages = errorResponse.message
        ? errorResponse.message
        : 'Problemas al conectar al servidor. Intente más tarde !!!!';
      } finally {
        this.loading = false;
      }
    }
  }
}
