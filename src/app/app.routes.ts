import { Routes } from '@angular/router';
import { authGuard } from './e-commerce/guard/auth.guard'; 
export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
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
        path: 'register',
        pathMatch: 'full',
        loadComponent: () => import('./e-commerce/pages/register/register.component').then( m => m.RegisterComponent)
    },
    {
        path: 'cart',
        pathMatch: 'full',
        loadComponent: () => import('./e-commerce/pages/cart/cart.component').then( m => m.CartComponent)
    },
    {
        path: 'view-products-admin',
        pathMatch: 'full',
        loadComponent: () => import('./e-commerce/pages/view-products-admin/view-products-admin.component').then( m => m.ViewProductsAdminComponent),
        canActivate: [authGuard]
    },
    {
        path: 'editProfile',
        pathMatch: 'full',
        loadComponent: () => import('./e-commerce/pages/edit-profile/edit-profile.component').then( m => m.EditProfileComponent),
        canActivate: [authGuard]
    },
    {
        path: 'viewReceipts',
        pathMatch: 'full',
        loadComponent: () => import('./e-commerce/pages/view-receipts/view-receipts.component').then( m => m.ViewReceiptsComponent),
        canActivate: [authGuard]
    },
    {
        path: 'viewClients',
        pathMatch: 'full',
        loadComponent: () => import('./e-commerce/pages/view-clients/view-clients.component').then( m => m.ViewClientsComponent),
        canActivate: [authGuard]
    },

    {
        path:'**',
        pathMatch: 'full',
        redirectTo: 'home'
    }
];
