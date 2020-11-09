import { ModuleSensorService } from './../../../services/sensor/module-sensor.service';
import { ModuleOperationManagerService } from '../../../services/operation-manager/module-operation-manager.service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { FormHelper } from '@app/shared/utils/form.helper';
import { ABBDropdownSelectedElement, AbstractControlOrT } from '@app/shared/utils/types';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { Camera } from '@app/modules/cvs-modules/services/operation-manager/operation-manager.model';
import { Sensor } from '@app/modules/cvs-modules/services/sensor/sensor.model';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { OperationManagerPendingChangesService } from '@app/modules/cvs-modules/services/operation-manager/pending-changes.service';

interface FormGroupModel<T = unknown> {
  FPS: AbstractControlOrT<T, number>;
  exposureTime: AbstractControlOrT<T, number>;
  width: AbstractControlOrT<T, number>;
  height: AbstractControlOrT<T, number>;
  offsetX: AbstractControlOrT<T, number>;
  offsetY: AbstractControlOrT<T, number>;
}

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit, OnDestroy {
  @Input() operationId: string;

  // Pass instance name to decorator
  @BlockUI('operation-manager-camera') blockUI: NgBlockUI;

  _selectedSensor: Sensor;
  componentSelectedItem: ABBDropdownSelectedElement<string>;
  public get selectedSensor() {
    return this._selectedSensor;
  }
  public set selectedSensor(value: Sensor) {
    this._selectedSensor = value;
    this.componentSelectedItem = this._selectedSensor ? [{
      value: this._selectedSensor.id,
      label: this._selectedSensor.name,
    }] : [];

    this.forceSensorIdReset();
    this.loadSensorData(this._selectedSensor.id);
  }

  forceResetWhenChangedSensor = true;
  autoExposure: boolean;


  formGroup: FormGroup;
  private formHelper: FormHelper;

  sensors: Sensor[] = [];

  get formControls(): FormGroupModel<FormControl>  {
    return this.formGroup.controls as any;
  }


  constructor(
    private formBuilder: FormBuilder,
    private moduleOperationManagerService: ModuleOperationManagerService,
    private moduleSensorService: ModuleSensorService,
    private notificationService: NotificationService,
    private pendingChangesService: OperationManagerPendingChangesService,
  ) { }

  ngOnInit(): void {
    this.createFormGroup();

    this.loadData();
  }

  ngOnDestroy(): void {
    this.formHelper.destroy();
  }

  private createFormGroup() {
    this.formGroup = this.formBuilder.group(
      {
        FPS: new FormControl(''),
        exposureTime: new FormControl(''),
        width: new FormControl(''),
        height: new FormControl(''),
        offsetX: new FormControl(''),
        offsetY: new FormControl(''),
      } as FormGroupModel<FormControl>,
    );

    this.formHelper = new FormHelper({
      formGroup: this.formGroup,
      handlePendingChanges: (dirty) => {
        dirty ?
          this.pendingChangesService.notifyPendingChange('camera') :
          this.pendingChangesService.clearPendingChange('camera');
      },
    });
  }

  private async loadData() {
    // load sensors
    this.sensors = await this.moduleSensorService.getSensors();
    // select first sensor by default
    this.selectedSensor = this.sensors[0];
  }

  private async loadSensorData(sensorId: string) {
    const camera = await this.moduleOperationManagerService.getCamera(this.operationId, sensorId);
    this.mapData(camera);
  }

  private mapData(data: Camera) {
    if (!data) { return; }

    this.formControls.FPS.setValue(data.FPS);
    this.formControls.exposureTime.setValue(data.exposureTime);
    this.formControls.width.setValue(data.width);
    this.formControls.height.setValue(data.height);
    this.formControls.offsetX.setValue(data.offsetX);
    this.formControls.offsetY.setValue(data.offsetY);
    this.autoExposureAutoChange(data.autoExposure);
  }

  async sensorChanged(value: ABBDropdownSelectedElement<string>) {
    console.log('sensorChanged value', value);

    const selectedSensor = value[0];
    this.selectedSensor = this.sensors.find((x) => x.id === selectedSensor.value);
  }

  async onSubmit() {
    await this.formHelper.genericSubmitHandle({
      handleSubmit: () => this._onSubmit(),
      handleError: error => this.formHelper.setGeneralError(error),
    });
  }

  private async _onSubmit() {
    const data: FormGroupModel = this.formGroup.value;
    // console.log(data);

    await this.moduleOperationManagerService.saveCamera(this.operationId, this.selectedSensor.id, {
      FPS: data.FPS,
      exposureTime: data.exposureTime,
      autoExposure: this.autoExposure,
      width: data.width,
      height: data.height,
      offsetX: data.offsetX,
      offsetY: data.offsetY,
    });

    this.notificationService.defaultSuccess();

  }

  private forceSensorIdReset() {
    this.createFormGroup();
    this.forceResetWhenChangedSensor = false;
    setTimeout(() => {
      this.forceResetWhenChangedSensor = true;
    });
  }

  autoExposureAutoChange(value: boolean) {
    this.autoExposure = value;
    this.autoExposure ?
      this.formControls.exposureTime.disable() :
      this.formControls.exposureTime.enable();

    if (this.autoExposure) {
      this.formControls.exposureTime.setValue('');
    }
  }

}
