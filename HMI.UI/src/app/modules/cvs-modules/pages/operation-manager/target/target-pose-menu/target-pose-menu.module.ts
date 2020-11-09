import { TargetPoseMenuComponent } from './target-pose-menu.component';
import { SharedModule } from './../../../../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    TargetPoseMenuComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    TargetPoseMenuComponent,
  ],
})
export class TargetPoseMenuModule { }
