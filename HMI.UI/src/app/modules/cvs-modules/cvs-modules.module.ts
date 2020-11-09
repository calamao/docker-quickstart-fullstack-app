import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CVSModulesRoutingModule } from './cvs-modules-routing.module';
import { CvsModulesPagesModule } from './pages/cvs-modules-pages.module';
import { CvsModulesServicesModule } from './services/cvs-modules-services.module';

@NgModule({
  entryComponents: [],
  imports: [
    CommonModule,
    CVSModulesRoutingModule,
    CvsModulesPagesModule,
    CvsModulesServicesModule,
  ],
})
export class CVSModulesModule {}
