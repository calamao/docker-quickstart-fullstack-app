import { AbbCommonUxButtonModule } from '@abb/abb-common-ux-angular-9';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { ImageCarouselComponent } from './image-carousel.component';
import { CarouselActionsComponent } from './carousel-actions/carousel-actions.component';


@NgModule({
  declarations: [ImageCarouselComponent, CarouselActionsComponent],
  imports: [
    CommonModule,
    IvyCarouselModule,
    AbbCommonUxButtonModule,
  ],
  exports: [
    ImageCarouselComponent,
    CarouselActionsComponent,
  ]
})
export class ImageCarouselModule { }

