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
        path: 'view-products-admin',
        pathMatch: 'full',
        loadComponent: () => import('./e-commerce/pages/view-products-admin/view-products-admin.component').then( m => m.ViewProductsAdminComponent)
    },
    {
        path: 'editProfile',
        pathMatch: 'full',
        loadComponent: () => import('./e-commerce/pages/edit-profile/edit-profile.component').then( m => m.EditProfileComponent)
    },
    {
        path:'**',
        pathMatch: 'full',
        redirectTo: 'home'
    }
];
