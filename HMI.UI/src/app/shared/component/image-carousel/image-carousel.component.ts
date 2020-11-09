import { buffer, debounceTime, delay, filter, mergeMap, throttleTime, map, tap } from 'rxjs/operators';
import { concat, fromEvent, merge, Observable, Subject, Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, OnDestroy, Output, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CarouselComponent } from 'angular-responsive-carousel';
import { toDataURL } from '@app/shared/utils/helper.functions';

export interface CarouselImage {
  id?: string;
  path: string;
  name?: string;
  deleted?: boolean;
  selected?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

export type NewImage = CarouselImage;

type MoveImage = 'next' | 'previous' | 'first' | 'last';

const test = () => {
  // streams
  const clicks$ = fromEvent(document, 'click');
  /*
  Collect clicks that occur, after 250ms emit array of clicks
  */
  clicks$
    .pipe(
      buffer(clicks$.pipe(delay(250))),
      // if array is greater than 1, double click occured
      filter((clickArray) => clickArray.length > 1)
    )
    .subscribe(() => console.log('Double Click!'));
};
  

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.scss']
})
export class ImageCarouselComponent implements OnInit, OnDestroy, OnChanges {
  private subscriptions: Subscription[] = [];

  @Input() images: CarouselImage[];
  @Input() showImageTitle = false;
  @Output() selectedImage = new EventEmitter<CarouselImage>();
  @Output() deletedImage = new EventEmitter<CarouselImage>();

  forceCarouselReset = true;

  private imageMouseDown$ = new Subject<CarouselImage>();
  private imageMouseUp$ = new Subject<CarouselImage>();

  private mouseUpDownEvents$ = merge(
    this.imageMouseDown$,
    this.imageMouseUp$,
  );

  private $imageClick = this.mouseUpDownEvents$.pipe(
    buffer(this.mouseUpDownEvents$.pipe(delay(150))),
    // if array is greater than 1, double click occured
    filter((clickArray) => clickArray.length > 1),
    map(images => images[0]),
  );




  @ViewChild('carousel') carousel: CarouselComponent;

  constructor() {
    // test();
    this.subscriptions.push(
      this.$imageClick.pipe(
        tap(image => {
          if (!image.deleted) {
            this.selectImage(image);
          }
        }),
      ).subscribe()
    );
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.images && !changes.images.firstChange) {
      this.imageArrayUpdated();
      this.executeForceCarouselReset();
    }
  }

  ngOnInit(): void {
    this.imageArrayUpdated();
  }

  private imageArrayUpdated() {
    if (this.images) {
      const firstImage = this.images[0];
      this.updateFirstLast();
      if (firstImage) {
        this.selectImage(firstImage);
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  deleteImage(image: CarouselImage) {
    /** Deleting image from array does not behave well: scroll width is not recalculated and last image cannot be accessed any more */
    // this.images = this.images.filter(x => x !== image);
    image.deleted = true;

    if (image.selected) {
      image.selected = false;

      // select first "not deleted" image. If there is no image; still emit to notify "nothing selected"
      const firstImage = this.images.find(x => !x.deleted);
      this.selectImage(firstImage);
    }
    this.updateFirstLast();

    this.deletedImage.next(image);
  }

  refreshArray() {
    this.imageArrayUpdated();
    this.executeForceCarouselReset();
  }

  selectImage(image: CarouselImage) {
    this.images.forEach(x => x.selected = false);
    if (image) {
      image.selected = true;
    }
    this.selectedImage.next(image);
  }


  /** We have to simulate a 'click' (selection) by mouseUp-mouseDown event.
   * The reason is that 'click' event is also triggered when user is "dragging" images (scrolling horizontally)
   * and when it finishes dragging the 'click' event selects the image used to scroll. Which is not
   * the intention of the user.
   * Note: drag events are not triggered so they cannot be used.
   */
  mouseUp(image: CarouselImage) {
    this.imageMouseUp$.next(image);
  }

  mouseDown(image: CarouselImage) {
    this.imageMouseDown$.next(image);
  }


  private executeForceCarouselReset() {
    this.forceCarouselReset = false;
    setTimeout(() => {
      this.forceCarouselReset = true;
    });
  }

  moveSelectedImage(moveAction: MoveImage) {
    const selectedImageIndex = this.images.findIndex(x => x.selected);

    if (moveAction === 'first' || moveAction === 'last') {
      this.moveFirstLast(moveAction, selectedImageIndex);
    } else {
      const destinationImageIndex = this.getDestinationImage(moveAction, selectedImageIndex);

      if (destinationImageIndex !== undefined) {
        /** we cannot really move elements in the array due to the Carousel component, which do not update positions.
         * We cannot even "create new objects", which are being tracked by the inner component, we can just change the properties.
         * What we do is "copy" properties.
         */
        const destinationImage = this.images[destinationImageIndex];
        const copyDestinationImage = {...this.images[destinationImageIndex]};
        const selectedImage = this.images[selectedImageIndex];

        this.copyImageProperties(selectedImage, destinationImage);
        this.copyImageProperties(copyDestinationImage, selectedImage);

        // this.move(this.images, selectedImageIndex, nextImageIndex);
        this.selectImage(destinationImage);
      }
    }

    this.updateFirstLast();
  }

  private copyImageProperties = (origin: CarouselImage, destination: CarouselImage) => {
    Object.getOwnPropertyNames(origin).forEach(prop => destination[prop] = origin[prop]);
    // destination.id = origin.id;
    // destination.path = origin.path;
    // destination.selected = origin.selected;
  }

  private moveFirstLast(moveAction: 'first' | 'last', originalTargetImageIndex: number) {
    const imageIndexes = this.getNotDeletedImagesIndexes();
    // const filteredTargetImageIndex = imageIndexes.find(x => x === originalTargetImageIndex);
    const copyImage = {...this.images[originalTargetImageIndex]};

    const imageIndexesOrdered = moveAction === 'first' ?
      [...imageIndexes].reverse() : // reverse changes original array!
      imageIndexes;

    const indexesToFilter = (index: number, targetImageIndex: number) =>
      moveAction === 'first' ?
        index <= targetImageIndex :
        index >= targetImageIndex;

    const imagesToShift = imageIndexesOrdered
      .filter(index => indexesToFilter(index, originalTargetImageIndex))
      .map(index => this.images[index]);

    // shift all until target
    for (let index = 0; index < imagesToShift.length; index++) {
      const currentImage = imagesToShift[index];
      const nextImage = imagesToShift[index + 1];
      if (nextImage) {
        this.copyImageProperties(nextImage, currentImage);
      }
    }

    // copy to first position
    const lastImageIndexShifted = imageIndexesOrdered[imageIndexesOrdered.length - 1];
    const firstLastImage = this.images[lastImageIndexShifted];
    this.copyImageProperties(copyImage, firstLastImage);
    this.selectImage(firstLastImage);
  }

  private getNotDeletedImagesIndexes() {
    const imageIndexes = this.images
      .map((image, index) => [image, index])
      .filter(x => !(x[0] as CarouselImage).deleted)
      .map(x => x[1] as number);

    return imageIndexes;
  }

  private getDestinationImage(position: MoveImage, selectedImageIndex: number) {
    const imageIndexes = this.getNotDeletedImagesIndexes();

    if (position === 'first') {
      return imageIndexes[0];
    }
    if (position === 'last') {
      return imageIndexes[imageIndexes.length - 1];
    }

    const destinationImageIndex = position === 'next' ?
      imageIndexes.find(index => index > selectedImageIndex) :
      // we have to reverse the array to find the 'closest' one to the left
      imageIndexes.reverse().find(index => index < selectedImageIndex);

    /** when arriving at the end go to the start, or viceversa. */
    // if (destinationImageIndex === undefined) {
    //   destinationImageIndex = position === 'next' ?
    //     imageIndexes[0] : imageIndexes[imageIndexes.length - 1];
    // }
    return destinationImageIndex;
  }

  private updateFirstLast() {
    this.images.forEach(x => {
      x.isFirst = x.isLast = false;
    });
    const imageIndexes = this.getNotDeletedImagesIndexes();
    const firstImage = this.images[imageIndexes[0]];
    const lastImage = this.images[imageIndexes[imageIndexes.length - 1]];
    if (firstImage) {
      firstImage.isFirst = true;
    }
    if (lastImage) {
      lastImage.isLast = true;
    }
  }

  private move(array: any[], from: number, to: number) {
    array.splice(to, 0, array.splice(from, 1)[0]);
  }



}
