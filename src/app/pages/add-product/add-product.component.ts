import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Product } from '../../model/product.model';
import { ErrorResponse } from '../../model/error.model';
import { ProductService } from '../../service/product.service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { dateGreaterThanOrEqualValidator } from '../../validators/validators';

@Component({
  selector: 'app-add-product',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent {
  loading: boolean = false
  errorMessages: string = "";
  duplicateId: boolean = false;
  productForm = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
    name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]),
    logo: new FormControl('', [Validators.required]),
    date_release: new FormControl('', [Validators.required, dateGreaterThanOrEqualValidator()]),
    date_revision: new FormControl({ value: '', disabled: true }, Validators.required),
  });

  constructor(private productService: ProductService, private router: Router) {
    this.productForm.get('date_release')?.valueChanges.subscribe(value => {
      if (value) {
        const date = new Date(value);
        date.setFullYear(date.getFullYear() + 1);
        const dateFormated = date.toISOString().split('T')[0];
        this.productForm.get('date_revision')?.setValue(dateFormated);
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.productForm.valid) {
      try {
        this.errorMessages = "";
        this.loading = true;

        this.duplicateId = await firstValueFrom(this.productService.validateId(this.productForm.get('id')?.value || ''));

        if (this.duplicateId) {
          this.productForm.get('id')?.setErrors({ duplicateId: true });
          return;
        }

        const product: Product = {
          id: this.productForm.get('id')?.value || '',
          name: this.productForm.get('name')?.value || '',
          description: this.productForm.get('description')?.value || '',
          logo: this.productForm.get('logo')?.value || '',
          date_release: this.productForm.get('date_release')?.value || '',
          date_revision: this.productForm.get('date_revision')?.value || ''
        };

        await firstValueFrom(this.productService.postProduct(product));
        this.router.navigate(['/']);
      } catch (res: any) {
        const errorResponse: ErrorResponse = res.error;
        this.errorMessages = errorResponse.message;
      } finally {
        this.loading = false;
      }
    }
  }

  onReset() {
    this.errorMessages = "";
    this.duplicateId = false;
    this.productForm.reset();
  }
}

