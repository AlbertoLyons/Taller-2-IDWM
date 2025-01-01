import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        pathMatch: 'full',
        loadComponent: () => import('./e-commerce/pages/view-products/view-products.component').then( m => m.ViewProductsComponent)
    },
    {
        path:'**',
        pathMatch: 'full',
        redirectTo: 'home'
    }
];
