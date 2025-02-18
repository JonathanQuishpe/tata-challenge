import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/list-product/list-product.component').then(m => m.ListProductComponent)
    },
    {
        path: 'add-product',
        loadComponent: () => import('./pages/add-product/add-product.component').then(m => m.AddProductComponent)
    },
    {
        path: ':id/update-product',
        loadComponent: () => import('./pages/update-product/update-product.component').then(m => m.UpdateProductComponent)
    }
];
