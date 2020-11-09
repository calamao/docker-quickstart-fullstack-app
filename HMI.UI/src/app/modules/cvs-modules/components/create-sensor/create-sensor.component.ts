import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { DialogComponent } from '@app/shared/component/dialog/dialog.component';
import { FormHelper } from '@app/shared/utils/form.helper';
import { AbstractControlOrT } from '@app/shared/utils/types';
import { ModuleSensorService } from '../../services/sensor/module-sensor.service';

interface FormGroupModel<T = unknown> {
  sensorName: AbstractControlOrT<T, string>;
}

@Component({
  selector: 'app-create-sensor',
  templateUrl: './create-sensor.component.html',
  styleUrls: ['./create-sensor.component.scss']
})
export class CreateSensorComponent implements OnInit {
  @Output() sensorCreated = new EventEmitter<string>();

  formGroup: FormGroup;
  private formHelper: FormHelper;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: DialogComponent,
    private moduleSensorService: ModuleSensorService,
    private notificationService: NotificationService,
    ) { }

  ngOnInit(): void {

    this.formGroup = this.formBuilder.group(
      {
        sensorName: new FormControl(''),
      } as FormGroupModel<FormControl>,
    );

    this.formHelper = new FormHelper({
      formGroup: this.formGroup,
    });

    this.dialog.closeDialog$.subscribe(async (response) => {
      if (response) {
        await this.formHelper.genericSubmitHandle({
          dialog: this.dialog,
          handleSubmit: () => this.onSubmit(),
          handleError: error => this.handleError(error),
        });
      }
    });
  }

  async onSubmit() {
    const data: FormGroupModel = this.formGroup.value;
    const sensorId = await this.moduleSensorService.addSensor(data.sensorName);
    this.sensorCreated.emit(sensorId);
  }

  private handleError(error: Error) {
    this.notificationService.addNotification({
      severity: 'error',
      text: error.message,
    });
  }

}
