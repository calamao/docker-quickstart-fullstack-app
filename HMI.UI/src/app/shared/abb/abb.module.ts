import {
  AbbCommonUxBarModule,
  AbbCommonUxButtonModule,
  AbbCommonUxCollapsibleModule,
  AbbCommonUxDialogModule,
  AbbCommonUxDropdownModule,
  AbbCommonUxIconModule,
  AbbCommonUxInputModule,
  AbbCommonUxLayoutModule,
  AbbCommonUxLeftPaneModule,
  AbbCommonUxMenuModule,
  AbbCommonUxNotificationModule,
  AbbCommonUxPaginationModule,
  AbbCommonUxSidebarNaviModule,
  AbbCommonUxTabcontrolModule,
  AbbCommonUxTableModule,
  AbbCommonUxToggleSwitchModule,
  AbbCommonUxTopNavigationModule,
} from '@abb/abb-common-ux-angular';
import { NgModule } from '@angular/core';

@NgModule({
  exports: [
    AbbCommonUxBarModule,
    AbbCommonUxLayoutModule,
    AbbCommonUxLeftPaneModule,
    AbbCommonUxTopNavigationModule,
    AbbCommonUxMenuModule,
    AbbCommonUxNotificationModule,
    AbbCommonUxSidebarNaviModule,
    AbbCommonUxIconModule,
    AbbCommonUxDropdownModule,
    AbbCommonUxDialogModule,
    AbbCommonUxButtonModule,
    AbbCommonUxInputModule,
    AbbCommonUxTabcontrolModule,
    AbbCommonUxTableModule,
    AbbCommonUxCollapsibleModule,
    AbbCommonUxPaginationModule,
    AbbCommonUxToggleSwitchModule,
  ]
})
export class ABBModule {}
