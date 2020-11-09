import { ScrollableOverflowWrapperModule } from './../scrollable-overflow-wrapper/scrollable-overflow-wrapper.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './tabs.component';

@NgModule({
  declarations: [TabsComponent],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    ScrollableOverflowWrapperModule,
  ],
  exports: [
    TabsComponent,
  ]
})
export class TabsModule { }
