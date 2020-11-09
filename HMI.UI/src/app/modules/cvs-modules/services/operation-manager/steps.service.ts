import { StepsComponent } from './../../pages/operation-manager/steps/steps.component';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ImageCarouselComponent, NewImage, CarouselImage } from '@app/shared/component/image-carousel/image-carousel.component';

@Injectable({
  providedIn: 'root'
})
export class StepsService {
  private stepsComponent: StepsComponent;
  private _selectedImage$ = new Subject<CarouselImage>();
  selectedImage$ = this._selectedImage$.asObservable();

  showSteps = false;

  constructor() { }

  injectCarouselComponent(stepsComponent: StepsComponent) {
    this.stepsComponent = stepsComponent;
  }

  addImage(data: string) {
    this.stepsComponent.addImage(data);
  }

  updatePicture(data: string) {
    this.stepsComponent.updateImage(data);
  }

  selectImage(image: CarouselImage) {
    this._selectedImage$.next(image);
  }
}
