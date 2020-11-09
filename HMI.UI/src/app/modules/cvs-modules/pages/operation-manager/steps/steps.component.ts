import { TranslateService } from '@ngx-translate/core';
import { Component, Input, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ModuleOperationManagerService } from '@app/modules/cvs-modules/services/operation-manager/module-operation-manager.service';
import { StepsService } from '@app/modules/cvs-modules/services/operation-manager/steps.service';
import { CarouselImage, ImageCarouselComponent } from '@app/shared/component/image-carousel/image-carousel.component';
import { Step, StepType } from '@app/modules/cvs-modules/services/operation-manager/operation-manager.model';
import { ABBDropdownSelectedElement, AbstractControlOrT } from '@app/shared/utils/types';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { HttpErrorResponse } from '@angular/common/http';
import { OperationManagerPendingChangesService } from '@app/modules/cvs-modules/services/operation-manager/pending-changes.service';
import { isUndefined } from 'util';

type CaraouselImageStep = CarouselImage & Step;

interface FormGroupModel<T = unknown> {
  offsetX: AbstractControlOrT<T, number>;
  offsetY: AbstractControlOrT<T, number>;
  offsetZ: AbstractControlOrT<T, number>;
}

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss']
})
export class StepsComponent implements OnInit, AfterViewInit {
  @Input() operationId: string;
  
  images: CaraouselImageStep[] = [];
  stepTypes: StepType[] = [];
  selectedImageStepType: ABBDropdownSelectedElement<string>;

  @ViewChild('carousel') carousel: ImageCarouselComponent;

  selectedImage: CaraouselImageStep;

  disableCarouselMove = false;
  disableMoveLeft = false;
  disableMoveRight = false;

  get disableSave() {
    return !this.pendingChangesService.hasPendingChanges('target');
  }

  /** This 'hack' is needed to control pending changes */
  private selectedImageChanging = false;

  formGroup: FormGroup;
  get formControls(): FormGroupModel<FormControl>  {
    return this.formGroup.controls as any;
  }

  constructor(
    public stepsService: StepsService,
    private moduleOperationManagerService: ModuleOperationManagerService,
    private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private pendingChangesService: OperationManagerPendingChangesService,
    private cd: ChangeDetectorRef,
    ) { }

  ngAfterViewInit(): void {
    this.stepsService.injectCarouselComponent(this);
  }

  async ngOnInit() {
    this.loadImages();
    this.loadStepTypes();
    this.createFormGroup();
  }

  private async loadImages() {
    this.images = await this.moduleOperationManagerService.getSteps(this.operationId) || [];
    if (this.images?.length === 0) {
      // notify to hide 'update button' when there are no images
      this.stepsService.selectImage(undefined);
    }
    this.updateStepNames();
  }

  private async loadStepTypes() {
    this.stepTypes = await this.moduleOperationManagerService.getStepTypes();
  }

  private createFormGroup() {
    this.formGroup = this.formBuilder.group({
      offsetX: new FormControl(0),
      offsetY: new FormControl(0),
      offsetZ: new FormControl(0),
    } as FormGroupModel<FormControl>);

    this.formGroup.valueChanges.subscribe(value => {
      /** control that the change is not coming from a image selection change.
       * We only want a change when is a real change of the input coming from the user
       */
      if (!this.selectedImageChanging) {
        this.notifyPendingChange();
      }
    });

    this.formControls.offsetX.valueChanges.subscribe(value => this.selectedImage.offsetX = value);
    this.formControls.offsetY.valueChanges.subscribe(value => this.selectedImage.offsetY = value);
    this.formControls.offsetZ.valueChanges.subscribe(value => this.selectedImage.offsetZ = value);
  }

  async onSubmit() {
    const data: FormGroupModel = this.formGroup.value;
    try {
      await this.moduleOperationManagerService.saveSteps(this.operationId, this.getStepsToSave());
      this.pendingChangesService.clearPendingChange('target');
    } catch (error) {
      const terror: HttpErrorResponse = error;
      this.notificationService.addNotification({
        severity: 'error',
        resourceId: terror.error.message,
      });
    }

    this.notificationService.defaultSuccess();
  }

  private getStepsToSave(): Step[] {
    return this.images
      .filter(image => !image.deleted)
      .map(image => {
        return {
          id: image.id,
          isNew: !image.id,
          offsetX: image.offsetX,
          offsetY: image.offsetY,
          offsetZ: image.offsetZ,
          type: image.type,
          path: image.path,
          data: image.data,
        };
      });
  }

  private updateButtonsState() {
    this.disableCarouselMove = !this.selectedImage;
    this.disableMoveLeft = !!this.selectedImage?.isFirst;
    this.disableMoveRight = !!this.selectedImage?.isLast;
  }

  selectImage(image: CaraouselImageStep) {
    this.selectedImage = image;
    this.updateButtonsState();
    this.stepsService.selectImage(image);
    this.updateSelectedImageFields();

    // avoid 'ExpressionChangedAfterItHasBeenCheckedError'
    this.cd.detectChanges();
  }

  deletedImage(image: CaraouselImageStep) {
    this.commoReorderUpdateActions();
  }
  moveNext() {
    this.carousel.moveSelectedImage('next');
    this.commoReorderUpdateActions();
  }
  movePrevious() {
    this.carousel.moveSelectedImage('previous');
    this.commoReorderUpdateActions();
  }
  moveFirst() {
    this.carousel.moveSelectedImage('first');
    this.commoReorderUpdateActions();
  }
  moveLast() {
    this.carousel.moveSelectedImage('last');
    this.commoReorderUpdateActions();
  }

  private commoReorderUpdateActions() {
    this.updateStepNames();
    this.updateButtonsState();
    this.notifyPendingChange();
  }

  getSelectedImageName() {
    // if (this.selectedImage) {
    //   const position = this.images.findIndex(image => image === this.selectedImage);
    //   const text = `${this.translateService.instant('base.step')} ${position + 1}`;
    //   return text;
    // }

    return this.selectedImage.name;
  }

  private updateSelectedImageFields() {
    if (this.selectedImage) {
      this.setSelectedImageStepType(this.selectedImage.type);

      this.selectedImageChanging = true;
      this.formControls.offsetX.setValue(this.selectedImage.offsetX);
      this.formControls.offsetY.setValue(this.selectedImage.offsetY);
      this.formControls.offsetZ.setValue(this.selectedImage.offsetZ);
      this.selectedImageChanging = false;
    }

  }

  async stepTypeChanged(value: ABBDropdownSelectedElement<string>) {
    const selectedType = value[0];
    this.setSelectedImageStepType(selectedType.value);
    this.notifyPendingChange();
  }

  private setSelectedImageStepType(stepTypeId: string) {
    if (stepTypeId) {
      const stepType = this.stepTypes.find((x) => x.id === stepTypeId);
      this.selectedImage.type = stepType.id;
      this.selectedImageStepType = [{
        label: stepType.name,
        value: stepType.id,
      }];
    } else {
      this.selectedImageStepType = [];
    }
  }

  addImage(data: string) {
    const newImage = {
      type: this.stepTypes[0].id,
      offsetX: 0,
      offsetY: 0,
      offsetZ: 0,
      path: data,
      isNew: true,
    };

    this.images = [
      ...this.images,
      newImage,
    ];
    // if it is the first image carousel will be "undefined"
    this.carousel?.refreshArray();
    this.carousel?.selectImage(newImage);
    this.updateStepNames();
    this.notifyPendingChange();
  }

  updateImage(data: string) {
    this.selectedImage.path = data;
    this.notifyPendingChange();
  }

  private updateStepNames() {
    // deleted image 'no name'
    this.images.filter(image => image.deleted).forEach(image => image.name = '');
    const stepText = this.translateService.instant('base.step');
    this.images
      .filter(image => !image.deleted)
      .forEach((image, index) => image.name = `${stepText} ${index + 1}`);
  }

  private notifyPendingChange() {
    this.pendingChangesService.notifyPendingChange('target');
  }

}
