import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../model/product.model';
import { ProductService } from '../../service/product.service';
import { firstValueFrom } from 'rxjs';
import { ErrorResponse } from '../../model/error.model';
@Component({
  selector: 'app-modal-delete',
  imports: [CommonModule],
  templateUrl: './modal-delete.component.html',
  styleUrl: './modal-delete.component.scss'
})
export class ModalDeleteComponent {
  @Input() isVisible: boolean = false;
  @Input() product: Product | null = null;
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() refreshTable = new EventEmitter<void>();
  loading: boolean = false;
  errorMessages: string = "";
  constructor(private productService: ProductService) { }

  closeModal(): void {
    this.closeModalEvent.emit();
  }

  async deletePoroduct(): Promise<void> {
    this.loading = true;
    try {
      if (this.product) {
        await firstValueFrom(this.productService.deleteProduct(this.product.id));
        this.refreshTable.emit();
      }
    } catch (res: any) {
      const errorResponse: ErrorResponse = res.error;
      this.errorMessages = errorResponse.message;
    } finally {
      this.loading = false;
    }
  }
}
