import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        pathMatch: 'full',
        loadComponent: () => import('./e-commerce/pages/view-products/view-products.component').then( m => m.ViewProductsComponent)
    },
    {
        path: 'iniciarSesion',
        pathMatch: 'full',
        loadComponent: () => import('./e-commerce/pages/loggin/loggin.component').then( m => m.LogginComponent)
    },
    {
        path: 'cart',
        pathMatch: 'full',
        loadComponent: () => import('./e-commerce/pages/cart/cart.component').then( m => m.CartComponent)
    },
    {
        path:'**',
        pathMatch: 'full',
        redirectTo: 'home'
    }
];
