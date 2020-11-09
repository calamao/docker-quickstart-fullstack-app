import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelViewerComponent } from './model-viewer.component';



@NgModule({
  declarations: [
    ModelViewerComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ModelViewerComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
})
export class ModelViewerModule { }
