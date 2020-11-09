import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './core/layout/layout/layout.component';
import { APPRoutes } from '@app/core/constants/constants';
import { AuthenticatedGuard } from './core/services/guards/authenticated.guard';
import { Layout2Component } from './core/layout/layout2/layout2.component';

const routes: Routes = [

  {
    path: '',
    component: Layout2Component,
    canActivate: [AuthenticatedGuard],
    children: [
      {
        path: APPRoutes.ROBOT.BASE,
        loadChildren: () => import('./modules/robot/robot.module').then(m => m.RobotModule)
      },
      {
        path: 'control',
        loadChildren: () => import('./modules/control/control.module').then(m => m.ControlModule)
      },
      {
        path: APPRoutes.LOGS.BASE,
        loadChildren: () => import('./modules/logs/logs.module').then(m => m.LogsModule)
      },
    ]
  },
  { path: '**', pathMatch: 'full', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
