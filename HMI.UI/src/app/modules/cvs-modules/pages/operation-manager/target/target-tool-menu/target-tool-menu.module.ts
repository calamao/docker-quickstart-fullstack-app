import { TranslateModule } from '@ngx-translate/core';
import { ModelViewerModule } from './../../../../../../shared/component/model-viewer/model-viewer.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TargetToolMenuComponent } from './target-tool-menu.component';
import { AbbCommonUxButtonModule, AbbCommonUxSliderModule, AbbCommonUxToggleButtonGroupModule, AbbCommonUxToggleButtonModule, AbbCommonUxToggleSwitchModule } from '@abb/abb-common-ux-angular-9';
import { VideoModule } from '@app/shared/component/video/video.module';
import { ToolMovePanelComponent } from './tool-move-panel/tool-move-panel.component';

@NgModule({
  declarations: [
    TargetToolMenuComponent,
    ToolMovePanelComponent,
  ],
  imports: [
    CommonModule,
    ModelViewerModule,
    AbbCommonUxSliderModule,
    AbbCommonUxToggleSwitchModule,
    AbbCommonUxButtonModule,
    AbbCommonUxToggleButtonGroupModule,
    AbbCommonUxToggleButtonModule,
    TranslateModule,
    VideoModule,
  ],
  exports: [
    TargetToolMenuComponent,
  ],
})
export class TargetToolMenuModule { }
