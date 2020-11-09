import { ParameterEditorComponent } from './pages/parameter-editor/parameter-editor.component';
import { OperationManagerComponent } from './pages/operation-manager/operation-manager.component';
import { SensorComponent } from './pages/sensor/sensor.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatusComponent } from './pages/status/status.component';
import { MainComponent } from './pages/main/main.component';
import { DeactivateGuard } from '@app/core/services/guards/can-deactivate-guard.service';
import { APPRoutes } from '@app/core/constants/constants';
import { Role } from '@app/core/services/user/user.model';
import { RoutesExtendedWithTypedData } from '@app/shared/utils/types';
import { RolesGuard } from '@app/core/services/guards/roles.guard';

const routes: RoutesExtendedWithTypedData = [
  // { path: '', redirectTo: 'cvg', pathMatch: 'full' },
  // { path: 'status', component: StatusComponent },
  {
    path: '',
    component: MainComponent,
    // canActivate: [PermissionGuard],
    // data: {
    //   permissions: [ApiPermission.JLS.READ, ApiPermission.SLS.READ],
    // },
    children: [
      { path: '', redirectTo: APPRoutes.CVSMODULES.STATUS, pathMatch: 'full' },
      {
        path: APPRoutes.CVSMODULES.STATUS,
        component: StatusComponent,
      },
      {
        path: APPRoutes.CVSMODULES.SENSOR,
        component: SensorComponent,
        canDeactivate: [DeactivateGuard],
        canActivate: [RolesGuard],
        data: {
          minRole: Role.Maintenance,
        }
      },
      {
        path: APPRoutes.CVSMODULES.OPERATIONMANAGER,
        component: OperationManagerComponent,
        canDeactivate: [DeactivateGuard],
        canActivate: [RolesGuard],
        data: {
          minRole: Role.Maintenance,
        }
      },
      {
        path: APPRoutes.CVSMODULES.PARAMETEREDITOR,
        component: ParameterEditorComponent,
        canActivate: [RolesGuard],
        data: {
          minRole: Role.Maintenance,
        }
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CVSModulesRoutingModule {}
