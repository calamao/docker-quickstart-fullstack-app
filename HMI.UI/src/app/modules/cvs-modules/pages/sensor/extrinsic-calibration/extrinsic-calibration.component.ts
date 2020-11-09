import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { SensorPendingChangesService } from '@app/modules/cvs-modules/services/operation-manager/pending-changes.service';
import { ModuleSensorService } from '@app/modules/cvs-modules/services/sensor/module-sensor.service';
import { ExtrinsicCalibration } from '@app/modules/cvs-modules/services/sensor/sensor.model';
import { FormHelper } from '@app/shared/utils/form.helper';
import { AbstractControlOrT } from '@app/shared/utils/types';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { FieldConfiguration } from '../sensor.models';

interface FormGroupModel<T = unknown> {
  X: AbstractControlOrT<T, number>;
  Y: AbstractControlOrT<T, number>;
  Z: AbstractControlOrT<T, number>;
  Qw: AbstractControlOrT<T, number>;
  Qx: AbstractControlOrT<T, number>;
  Qy: AbstractControlOrT<T, number>;
  Qz: AbstractControlOrT<T, number>;
}

@Component({
  selector: 'app-extrinsic-calibration',
  templateUrl: './extrinsic-calibration.component.html',
  styleUrls: ['./extrinsic-calibration.component.scss'],
})
export class ExtrinsicCalibrationComponent implements OnInit {
  @Input() sensorId: string;

  formGroup: FormGroup;
  private formHelper: FormHelper;

  get formControls(): FormGroupModel<FormControl> {
    return this.formGroup.controls as any;
  }

  extrinsicCalibrationFieldConfiguration: FieldConfiguration[] = [
    {type: 'number', name: 'X', label: 'X', decimals: 3, min: 0},
    {type: 'number', name: 'Y', label: 'Y', decimals: 3, min: 0},
    {type: 'number', name: 'Z', label: 'Z', decimals: 3, min: 0},
    {type: 'number', name: 'Qw', label: 'Qw', decimals: 6, min: 0},
    {type: 'number', name: 'Qx', label: 'Qx', decimals: 6, min: 0},
    {type: 'number', name: 'Qy', label: 'Qy', decimals: 6, min: 0},
    {type: 'number', name: 'Qz', label: 'Qz', decimals: 6, min: 0},
  ];

  constructor(
    private formBuilder: FormBuilder,
    private moduleSensorService: ModuleSensorService,
    private notificationService: NotificationService,
    private pendingChangesService: SensorPendingChangesService,
    ) {}

  async ngOnInit() {
    this.formGroup = this.formBuilder.group({});

    for (const field of this.extrinsicCalibrationFieldConfiguration) {
      this.formGroup.addControl(field.name, new FormControl(''));
    }

    await this.loadData();

    this.formHelper = new FormHelper({
      formGroup: this.formGroup,
      handlePendingChanges: (dirty) => {
        dirty ?
          this.pendingChangesService.notifyPendingChange('extrinsiccalibration') :
          this.pendingChangesService.clearPendingChange('extrinsiccalibration');
      },
    });
  }

  private async loadData() {
    const config = await this.moduleSensorService.getExtrinsicCalibration(this.sensorId);
    this.mapConfiguration(config);
  }

  private mapConfiguration(config: ExtrinsicCalibration) {
    if (!config) { return; }

    this.formControls.X.setValue(config.X);
    this.formControls.Y.setValue(config.Y);
    this.formControls.Z.setValue(config.Z);
    this.formControls.Qw.setValue(config.Qw);
    this.formControls.Qx.setValue(config.Qx);
    this.formControls.Qy.setValue(config.Qy);
    this.formControls.Qz.setValue(config.Qz);
  }

  async onSubmit() {
    await this.formHelper.genericSubmitHandle({
      handleSubmit: () => this._onSubmit(),
      handleError: (error) => this.formHelper.setGeneralError(error),
    });
  }

  private async _onSubmit() {
    const data: FormGroupModel = this.formGroup.value;
    // console.log(data);

    await this.moduleSensorService.saveExtrinsicCalibration(this.sensorId, {
      X: data.X,
      Y: data.Y,
      Z: data.Z,
      Qw: data.Qw,
      Qx: data.Qx,
      Qy: data.Qy,
      Qz: data.Qz,
    });

    this.notificationService.defaultSuccess();
  }
}
