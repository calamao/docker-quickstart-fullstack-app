import { ReactiveFormsModule } from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';
import { ABBModule } from './abb/abb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from './material/material.module';
import { InputModule } from './component/input/input.module';
import { TabsModule } from './component/tabs/tabs.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedComponentsModule } from './component/shared-components.module';
import { SharedDirectivesModule } from './directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    ABBModule,
    TranslateModule,
    InputModule,
    FlexLayoutModule,
    SharedDirectivesModule,
    BlockUIModule,
  ],
  exports: [
    ReactiveFormsModule,
    TranslateModule,
    MaterialModule,
    ABBModule,
    InputModule,
    TabsModule,
    FlexLayoutModule,
    SharedComponentsModule,
    SharedDirectivesModule,
    BlockUIModule,
  ],
})
export class SharedModule { }
