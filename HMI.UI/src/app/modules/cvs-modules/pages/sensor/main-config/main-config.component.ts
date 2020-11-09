import { MainConfiguration } from './../../../services/sensor/sensor.model';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AbstractControlOrT } from '@app/shared/utils/types';
import { FormHelper } from '@app/shared/utils/form.helper';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ModuleSensorService } from '@app/modules/cvs-modules/services/sensor/module-sensor.service';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { FieldConfiguration } from '../sensor.models';
import { OperationManagerPendingChangesService, SensorPendingChangesService } from '@app/modules/cvs-modules/services/operation-manager/pending-changes.service';

interface FormGroupModel<T = unknown> {
  label: AbstractControlOrT<T, string>;
  IP: AbstractControlOrT<T, string>;
  ABBSerialNumber: AbstractControlOrT<T, string>;
  serialNumber: AbstractControlOrT<T, string>;

  fx: AbstractControlOrT<T, number>;
  fy: AbstractControlOrT<T, number>;
  Cx: AbstractControlOrT<T, number>;
  Cy: AbstractControlOrT<T, number>;
  K1: AbstractControlOrT<T, number>;
  K2: AbstractControlOrT<T, number>;
  K3: AbstractControlOrT<T, number>;
  K4: AbstractControlOrT<T, number>;
  K5: AbstractControlOrT<T, number>;
  width: AbstractControlOrT<T, number>;
  height: AbstractControlOrT<T, number>;
}

const emptyMainConfig: MainConfiguration = {
  label: undefined,
  IP: undefined,
  ABBSerialNumber: undefined,
  serialNumber: undefined,
  fx: undefined,
  fy: undefined,
  Cx: undefined,
  Cy: undefined,
  K1: undefined,
  K2: undefined,
  K3: undefined,
  K4: undefined,
  K5: undefined,
  width: undefined,
  height: undefined,
};

@Component({
  selector: 'app-main-config',
  templateUrl: './main-config.component.html',
  styleUrls: ['./main-config.component.scss']
})
export class MainConfigComponent implements OnInit {
  @Input() sensorId: string;

  formGroup: FormGroup;
  private formHelper: FormHelper;

  get formControls(): FormGroupModel<FormControl>  {
    return this.formGroup.controls as any;
  }

  // Pass instance name to decorator
  @BlockUI('main-config') blockUIMainConfiguration: NgBlockUI;


  intrinsicCalibrationFieldConfiguration: FieldConfiguration[] = [
    {type: 'number', name: 'fx', label: 'fx', decimals: 3, min: 0},
    {type: 'number', name: 'fy', label: 'fy', decimals: 3, min: 0},
    {type: 'number', name: 'Cx', label: 'Cx', decimals: 3},
    {type: 'number', name: 'Cy', label: 'Cy', decimals: 3},
    {type: 'number', name: 'K1', label: 'K1', decimals: 3},
    {type: 'number', name: 'K2', label: 'K2', decimals: 3},
    {type: 'number', name: 'K3', label: 'K3', decimals: 3},
    {type: 'number', name: 'K4', label: 'K4', decimals: 3},
    {type: 'number', name: 'K5', label: 'K5', decimals: 3},
    {type: 'number', name: 'width', label: marker('base.width')},
    {type: 'number', name: 'height', label: marker('base.height')},
  ];

  constructor(
    private formBuilder: FormBuilder,
    private moduleSensorService: ModuleSensorService,
    private notificationService: NotificationService,
    private pendingChangesService: SensorPendingChangesService,
    ) {
  }

  async ngOnInit() {
    this.formGroup = this.formBuilder.group(
      {
        label: new FormControl(''),
        IP: new FormControl(''),
        ABBSerialNumber: new FormControl(''),
        serialNumber: new FormControl(''),
      } as FormGroupModel<FormControl>,
    );

    for (const field of this.intrinsicCalibrationFieldConfiguration) {
      this.formGroup.addControl(field.name, new FormControl(field.value));
    }

    await this.loadData();

    this.formHelper = new FormHelper({
      formGroup: this.formGroup,
      handlePendingChanges: (dirty) => {
        dirty ?
          this.pendingChangesService.notifyPendingChange('mainconfig') :
          this.pendingChangesService.clearPendingChange('mainconfig');
      },
    });
  }

  private async loadData() {
    const mainConfig = await this.moduleSensorService.getMainConfiguration(this.sensorId);
    this.mapConfiguration(mainConfig);
  }

  private getFormGroupObjectFromMainConfiguration(mainConfig: MainConfiguration): FormGroupModel<FormControl> {
    // !mainConfig: new sensor
    const obj = Object.getOwnPropertyNames(mainConfig || emptyMainConfig).reduce((prev, cur) => {
      prev[cur] = mainConfig ? new FormControl(mainConfig[cur]) : new FormControl('');
      return prev;
    }, {} as FormGroupModel<FormControl>);
    return obj;
  }

  // private getFormGroupObjectFromFieldConfiguration(config: FieldConfiguration[]): FormGroupModel<FormControl> {
  //   const obj = config.reduce((prev, cur) => {
  //     prev[cur.name] = new FormControl(cur.value);
  //     return prev;
  //   }, {} as FormGroupModel<FormControl>);
  //   return obj;
  // }

  private mapConfiguration(config: MainConfiguration) {
    if (!config) { return; }

    this.formControls.label.setValue(config.label);
    this.formControls.IP.setValue(config.IP);
    this.formControls.ABBSerialNumber.setValue(config.ABBSerialNumber);
    this.formControls.serialNumber.setValue(config.serialNumber);
    this.formControls.fx.setValue(config.fx);
    this.formControls.fy.setValue(config.fy);
    this.formControls.Cx.setValue(config.Cx);
    this.formControls.Cy.setValue(config.Cy);
    this.formControls.K1.setValue(config.K1);
    this.formControls.K2.setValue(config.K2);
    this.formControls.K3.setValue(config.K3);
    this.formControls.K4.setValue(config.K4);
    this.formControls.K5.setValue(config.K5);
    this.formControls.width.setValue(config.width);
    this.formControls.height.setValue(config.height);
  }

  async onSubmit() {
    await this.formHelper.genericSubmitHandle({
      handleSubmit: () => this._onSubmit(),
      handleError: error => this.formHelper.setGeneralError(error),
    });
  }

  private async _onSubmit() {
    const data: FormGroupModel = this.formGroup.value;

    await this.moduleSensorService.saveMainConfiguration(this.sensorId, {
      label: data.label,
      IP: data.IP,
      ABBSerialNumber: data.ABBSerialNumber,
      serialNumber: data.serialNumber,
      fx: data.fx,
      fy: data.fy,
      Cx: data.Cx,
      Cy: data.Cy,
      K1: data.K1,
      K2: data.K2,
      K3: data.K3,
      K4: data.K4,
      K5: data.K5,
      width: data.width,
      height: data.height,
    });

    this.notificationService.defaultSuccess();
  }

  async droppedFile(files: File[]) {
    // this.blockUIMainConfiguration.start(); // Start blocking element only

    // setTimeout(() => {
    //   this.blockUIMainConfiguration.stop(); // Stop blocking
    // }, 4000);

    // console.log('Text file', await files[0].text());

    const jsonConfig = await files[0].text();
    let mainConfig: MainConfiguration;
    try {
      mainConfig = JSON.parse(jsonConfig);
      this.mapConfiguration(mainConfig);
    } catch (error) {
      this.notificationService.addNotification({
        severity: 'error',
        text: 'Error parsing the file'
      });
    }

  }

}
