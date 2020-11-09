import { SharedModule } from './../../../../../shared/shared.module';
import { InputModule } from './../../../../../shared/component/input/input.module';
import { ImageCarouselModule } from './../../../../../shared/component/image-carousel/image-carousel.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StepsComponent } from './steps.component';
import { AbbCommonUxDropdownModule } from '@abb/abb-common-ux-angular-9';

@NgModule({
  declarations: [StepsComponent],
  imports: [
    CommonModule,
    ImageCarouselModule,
    SharedModule,
  ],
  exports: [
    StepsComponent,
  ]
})
export class StepsModule { }

