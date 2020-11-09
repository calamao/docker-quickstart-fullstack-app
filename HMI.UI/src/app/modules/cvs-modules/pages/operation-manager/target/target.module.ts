import { TargetToolMenuModule } from './target-tool-menu/target-tool-menu.module';
import { SharedModule } from './../../../../../shared/shared.module';
import { NaturalFeatureComponent } from './natural-feature/natural-feature.component';
import { TagComponent } from './tag/tag.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TargetComponent } from './target.component';
import { TargetPoseMenuModule } from './target-pose-menu/target-pose-menu.module';

@NgModule({
  declarations: [
    TargetComponent,
    TagComponent,
    NaturalFeatureComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    TargetComponent,
    TargetPoseMenuModule,
    TargetToolMenuModule,
  ],
})
export class TargetModule { }
