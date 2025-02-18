import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { Product } from '../../model/product.model';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ModalDeleteComponent } from "../../components/modal-delete/modal-delete.component";
import { SkeletonComponent } from "../../components/skeleton/skeleton.component";

@Component({
  selector: 'app-list-product',
  imports: [CommonModule, FormsModule, ModalDeleteComponent, SkeletonComponent],
  templateUrl: './list-product.component.html',
  styleUrl: './list-product.component.scss'
})
export class ListProductComponent implements OnInit {

  searchTerm: string = '';
  products: Product[] = [];
  selectedProduct: Product | null = null;
  filtered: Product[] = [];
  loading: boolean = false;
  perPage: number = 5;
  isModalVisible: boolean = false;

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  async loadProducts(): Promise<void> {
    this.loading = true;
    try {
      const data = await firstValueFrom(this.productService.getProducts());
      this.products = data;
      this.filtered = this.products.slice(0, this.perPage);
    } catch (error) {
    } finally {
      this.loading = false;
    }
  }
  goToCreate() {
    this.router.navigate(['/add-product']);
  }

  onActionSelected(event: any, product: Product): void {
    const action = event.target.value;

    if (action === 'update') {
      this.router.navigate([`/${product.id}/update-product`]);
    } else if (action === 'delete') {
      this.selectedProduct = product;
      this.openModal();
    }
  }

  onActionPagination(event: any): void {
    const value = event.target.value;
    this.perPage = value;
    this.filtered = this.products.slice(0, this.perPage);
  }

  filterProducts(): void {
    if (this.searchTerm.trim() === '') {
      this.filtered = [...this.products];
    } else {
      this.filtered = this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  openModal(): void {
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
  }

  refresh(): void {
    this.closeModal();
    this.loadProducts();
  }
}
