import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './theme/layout/admin/admin.component';
import { HomeComponent } from './home/home.component';
import { AuthSigninComponent } from './demo/pages/authentication/auth-signin/auth-signin.component';
import { AuthSignupComponent } from './demo/pages/authentication/auth-signup/auth-signup.component';
import { PanierComponent } from './panier/panier.component';
import { CommandeComponent } from './commande/commande.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { PaymentComponent } from './payment/payment.component';
import { authGuard } from './core/guards/auth.guard';

// Composants de menu (selon structure IA)
import { MenuListComponent } from './menu/components/menu-list/menu-list.component';
import { MenuFormComponent } from './menu/components/menu-form/menu-form.component';
import { MenuDetailComponent } from './menu/components/menu-detail/menu-detail.component';

// Déclaration des routes de l'application
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth/signin', component: AuthSigninComponent },
  { path: 'auth/signup', component: AuthSignupComponent },
  { path: 'panier', component: PanierComponent, canActivate: [authGuard] },
  { path: 'commande', component: CommandeComponent, canActivate: [authGuard] },
  { path: 'confirmation/:orderId', component: ConfirmationComponent, canActivate: [authGuard] },
  { path: 'paiement/:orderId', component: PaymentComponent },

  // Routes du menu
  { path: 'menu', component: MenuListComponent },
  { path: 'menu/new', component: MenuFormComponent, canActivate: [authGuard] },
  { path: 'menu/:id', component: MenuDetailComponent },
  { path: 'menu/:id/edit', component: MenuFormComponent, canActivate: [authGuard] },

  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'basic',
        loadChildren: () => import('./demo/ui-elements/ui-basic/ui-basic.module').then(m => m.UiBasicModule)
      },
      {
        path: 'forms',
        loadChildren: () => import('./demo/pages/form-elements/form-elements.module').then(m => m.FormElementsModule)
      },
      {
        path: 'tables',
        loadChildren: () => import('./demo/pages/tables/tables.module').then(m => m.TablesModule)
      },
      {
        path: 'apexchart',
        loadComponent: () => import('./demo/pages/core-chart/apex-chart/apex-chart.component').then(m => m.ApexChartComponent)
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/extra/sample-page/sample-page.component').then(m => m.default)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Import des routes
  exports: [RouterModule] // Exporte le RouterModule pour l'utiliser dans toute l'application
})
export class AppRoutingModule {}
