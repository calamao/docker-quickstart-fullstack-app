import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { settimeoutPromise } from '@app/shared/utils/helper.functions';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { ModuleSensorService } from '@app/modules/cvs-modules/services/sensor/module-sensor.service';
import { FormHelper } from '@app/shared/utils/form.helper';
import { AbstractControlOrT } from '@app/shared/utils/types';
import { SensorCalibration } from '@app/modules/cvs-modules/services/sensor/sensor.model';

interface FormGroupModel<T = unknown> {
  exposureTime: AbstractControlOrT<T, number>;
  chessboardWidth: AbstractControlOrT<T, number>;
  chessboardHeight: AbstractControlOrT<T, number>;
  squareSize: AbstractControlOrT<T, number>;
}

@Component({
  selector: 'app-calibration',
  templateUrl: './calibration.component.html',
  styleUrls: ['./calibration.component.scss'],
})
export class CalibrationComponent implements OnInit {
  @Input() sensorId: string;

  formGroup: FormGroup;
  private formHelper: FormHelper;

  get formControls(): FormGroupModel<FormControl> {
    return this.formGroup.controls as any;
  }

  disableSetReference = false;
  disableClearReference = true;
  disableRecalculate = true;
  disableCheckCalibration = true;
  checkCalibrationInProcess = false;
  disableFields = false;
  setReferenceInProcess = false;
  disableAll = false;

  // fieldConfiguration: FieldConfiguration[] = [
  //   {type: 'number', name: 'X', label: 'X', decimals: 3, min: 0},
  //   {type: 'number', name: 'Y', label: 'Y', decimals: 3, min: 0},
  //   {type: 'number', name: 'Z', label: 'Z', decimals: 3, min: 0},
  //   {type: 'number', name: 'Qw', label: 'Qw', decimals: 3, min: 0},
  //   {type: 'number', name: 'Qx', label: 'Qx', decimals: 3, min: 0},
  //   {type: 'number', name: 'Qy', label: 'Qy', decimals: 3, min: 0},
  //   {type: 'number', name: 'Qz', label: 'Qz', decimals: 3, min: 0},
  // ];

  constructor(
    private formBuilder: FormBuilder,
    private moduleSensorService: ModuleSensorService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      exposureTime: new FormControl('', [Validators.required]),
      chessboardHeight: new FormControl('', [Validators.required]),
      chessboardWidth: new FormControl('', [Validators.required]),
      squareSize: new FormControl('', [Validators.required]),
    } as FormGroupModel<FormControl>);

    this.updateDisabledState();

    this.formHelper = new FormHelper({
      formGroup: this.formGroup,
    });

    this.loadData();
  }

  private async loadData() {
    const calibration = await this.moduleSensorService.getReference(this.sensorId);
    this.mapConfiguration(calibration);

    if (calibration) {
      this.referenceIsSet();
    }
  }

  private referenceIsSet() {
    this.disableFields = true;
    this.disableCheckCalibration = false;
    this.disableClearReference = false;
    this.disableRecalculate = true;
    this.disableSetReference = true;
    this.updateDisabledState();
  }

  private referenceIsCleared() {
    this.disableFields = false;
    this.disableCheckCalibration = true;
    this.disableClearReference = true;
    this.disableRecalculate = true;
    this.disableSetReference = false;
    this.updateDisabledState();
  }

  private mapConfiguration(data: SensorCalibration) {
    if (!data) { return; }

    this.formControls.chessboardHeight.setValue(data.chessboardHeight);
    this.formControls.chessboardWidth.setValue(data.chessboardWidth);
    this.formControls.exposureTime.setValue(data.exposureTime);
    this.formControls.squareSize.setValue(data.squareSize);
  }

  async onSubmit() {
    await this.formHelper.genericSubmitHandle({
      handleSubmit: () => this._onSubmit(),
      handleError: (error) => this.formHelper.setGeneralError(error),
    });
  }

  private async _onSubmit() {
    await this.setReference();
  }

  private async setReference() {
    const data: FormGroupModel = this.formGroup.value;
    this.setReferenceInProcess = true;
    this.disableFields = true;
    this.disableAll = true;
    this.updateDisabledState();


    try {
      await this.moduleSensorService.setReference(this.sensorId, this.getFieldsCalibration());
      // this.writeFields(calibration);
      this.referenceIsSet();
    } catch (error) {
      this.notificationService.addNotification({
        severity: 'warn',
        text: 'No reference found',
      });
      this.disableFields = false;
    }

    this.setReferenceInProcess = false;
    this.disableAll = false;
    this.updateDisabledState();
  }

  private getFieldsCalibration(): SensorCalibration {
    const data: FormGroupModel = this.formGroup.value;
    return {
      ...data,
    };
  }

  // private writeFields(calibration: SensorCalibration) {
  //   this.formControls.chessboardHeight.setValue(calibration.chessboardHeight);
  //   this.formControls.chessboardWidth.setValue(calibration.chessboardWidth);
  //   this.formControls.exposureTime.setValue(calibration.exposureTime);
  //   this.formControls.squareSize.setValue(calibration.squareSize);
  // }

  async checkCalibration() {
    this.disableAll = true;
    try {
      this.checkCalibrationInProcess = true;
      const response = await this.moduleSensorService.checkCalibration(this.sensorId, this.getFieldsCalibration());

      if (response.recalculateNeeded) {
        /** Recalculation comes from the "checkCalibration" response */

        this.disableRecalculate = false;
        this.notificationService.addNotification({
          severity: 'warn',
          resourceId: marker('cvs-modules.sensor.calibration.recalculation-needed'),
        });
      } else {
        this.notificationService.addNotification({
          severity: 'success',
          text: 'cvs-modules.sensor.calibration.calibration-correct',
        });
      }
    } catch (error) {
      const errorType = error.type === 'warn' ? 'warn' : 'error';
      this.notificationService.addNotification({
        severity: errorType,
        text: error.message,
      });
    }

    this.checkCalibrationInProcess = false;
    this.disableAll = false;
  }

  async clearReference() {
    try {
      await this.moduleSensorService.clearReference(this.sensorId);
      this.referenceIsCleared();
    } catch (error) {
      this.notificationService.addNotification({
        severity: 'error',
        text: error.message,
      });
    }
  }

  async recalculate() {
    try {
      await this.moduleSensorService.recalculateReference(this.sensorId);
    } catch (error) {
      this.notificationService.addNotification({
        severity: 'error',
        text: error.message,
      });
    }
  }

  private updateDisabledState() {
    const disabledStatuses = [
      {disabled: this.disableAll || this.disableFields, control: this.formControls.exposureTime},
      {disabled: this.disableAll || this.disableFields, control: this.formControls.chessboardWidth},
      {disabled: this.disableAll || this.disableFields, control: this.formControls.chessboardHeight},
      {disabled: this.disableAll || this.disableFields, control: this.formControls.squareSize},
    ];

    disabledStatuses.forEach(state => {
      state.disabled ? state.control.disable() : state.control.enable();
    });
  }
}
