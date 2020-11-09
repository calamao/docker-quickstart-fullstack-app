import { ScrollableOverflowWrapperModule } from './../../../../shared/component/scrollable-overflow-wrapper/scrollable-overflow-wrapper.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { ParameterEditorComponent } from './parameter-editor.component';
import { CvsModulesComponentsModule } from '../../components/cvs-modules-components.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CvsModulesComponentsModule,
    ScrollableOverflowWrapperModule,
  ],
  entryComponents: [],
  declarations: [
    ParameterEditorComponent,
  ],
})
export class ParameterEditorModule {}
