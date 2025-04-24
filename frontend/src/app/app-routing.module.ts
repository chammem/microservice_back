import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { HomeComponent } from './home/home.component';
import { AuthSigninComponent } from './demo/pages/authentication/auth-signin/auth-signin.component';  // Chemin relatif correct
import AuthSignupComponent from './demo/pages/authentication/auth-signup/auth-signup.component';
import { PanierComponent } from './panier/panier.component';
import { CommandeComponent } from './commande/commande.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { authGuard } from './core/guards/auth.guard';  // Importer le guard
// import { PaymentComponent } from './payment/payment.component';
import { EmployeeListComponent } from './employee-list/employee-list.component'; // Importer le composant de la liste des employés
import { EmployeeFormComponent } from './employee-form/employee-form.component'; // Importer le composant de formulaire d'employé
import { ShiftListComponent } from './shift-list/shift-list.component'; // Importer le composant de liste des shifts
const routes: Routes = [
  {
    path: '',component: HomeComponent // Route racine pour HomeComponent
  }
  ,
  { path: 'auth/signin', component: AuthSigninComponent },
  { path: 'auth/signup', component: AuthSignupComponent },
  { path: 'panier', component: PanierComponent , canActivate: [authGuard]},
  { path: 'commande', component: CommandeComponent , canActivate: [authGuard]},
  { path: 'confirmation/:orderId', component: ConfirmationComponent , canActivate: [authGuard]},
  // { path: 'paiement/:orderId', component: PaymentComponent },
  { path: 'employee', component: EmployeeListComponent, canActivate: [authGuard] },
  {
    path: 'employee-form',
    component: EmployeeFormComponent,
    canActivate: [authGuard]  // Add this
  },{
    path: 'shifts',
    component: ShiftListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'employee-form/:id',
    component: EmployeeFormComponent,
    canActivate: [authGuard]  // Add this
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/dashboard/dashboard.component').then((c) => c.DashboardComponent)
      },
      {
        path: 'basic',
        loadChildren: () => import('./demo/ui-elements/ui-basic/ui-basic.module').then((m) => m.UiBasicModule)
      },
      {
        path: 'forms',
        loadChildren: () => import('./demo/pages/form-elements/form-elements.module').then((m) => m.FormElementsModule)
      },
      {
        path: 'tables',
        loadChildren: () => import('./demo/pages/tables/tables.module').then((m) => m.TablesModule)
      },
      {
        path: 'apexchart',
        loadComponent: () => import('./demo/pages/core-chart/apex-chart/apex-chart.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/extra/sample-page/sample-page.component')
      }
    ]
  },
  {
    path: '**', 
    redirectTo: ''
  }

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
