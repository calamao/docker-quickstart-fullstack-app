import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { OperationManagerComponent } from './operation-manager.component';
import { CameraComponent } from './camera/camera.component';
import { TargetModule } from './target/target.module';
import { StepsModule } from './steps/steps.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TargetModule,
    StepsModule,
  ],
  entryComponents: [],
  declarations: [
    OperationManagerComponent,
    CameraComponent,
  ],
})
export class OperationManagerComponentModule {}
