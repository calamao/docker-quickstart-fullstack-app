import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './core/layout/layout/layout.component';
import { APPRoutes } from '@app/core/constants/constants';
import { AuthenticatedGuard } from './core/services/guards/authenticated.guard';

const routes: Routes = [

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthenticatedGuard],
    children: [
      {
        path: APPRoutes.ROBOT.BASE,
        loadChildren: () => import('./modules/robot/robot.module').then(m => m.RobotModule)
      },
      {
        path: `${APPRoutes.CVSMODULES.BASE}/:${APPRoutes.CVSMODULES.moduleIdParameterName}`,
        loadChildren: () => import('./modules/cvs-modules/cvs-modules.module').then(m => m.CVSModulesModule)
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
