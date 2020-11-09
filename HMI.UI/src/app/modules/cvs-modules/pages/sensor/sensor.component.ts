import { CreateSensorComponent } from './../../components/create-sensor/create-sensor.component';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { ModuleSensorService } from '../../services/sensor/module-sensor.service';
import { Sensor } from '../../services/sensor/sensor.model';
import { ConfirmationService } from '@app/shared/component/dialog/confirmation/confirmation.service';
import { createDialogComponent } from '@app/shared/component/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ABBDropdownSelectedElement } from '@app/shared/utils/types';
import { IDeactivateComponent } from '@app/core/services/guards/can-deactivate-guard.service';
import { SensorPendingChangesService } from '../../services/operation-manager/pending-changes.service';

@Component({
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.scss'],
  // we make sure there is a single instance every time (we don't need to worry about the state)
  providers: [
    SensorPendingChangesService,
  ],
})
export class SensorComponent implements OnInit, IDeactivateComponent {
  _selectedSensor: Sensor;
  componentSelectedItem: ABBDropdownSelectedElement<string>;

  forceResetWhenChangedSensor = true;

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
  }

  sensors: Sensor[] = [];

  constructor(
    private moduleSensorService: ModuleSensorService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService,
    private matDialog: MatDialog,
    private pendingChangesService: SensorPendingChangesService,
    ) {}

  pendingChanges = false;
  hasPendingChanges(): boolean {
    const pendingChanges = this.pendingChanges ||
      this.pendingChangesService.hasPendingChanges();
    return pendingChanges;
  }

  async ngOnInit() {
    this.sensors = await this.moduleSensorService.getSensors();

    // select first sensor by default
    this.selectedSensor = this.sensors[0];
  }

  async sensorChanged(value: ABBDropdownSelectedElement<string>) {
    const changeSelectedSensor = () => {
      const selectedSensor = value[0];
      this.selectedSensor = this.sensors.find((x) => x.id === selectedSensor.value);
    };

    if (this.pendingChangesService.hasPendingChanges()) {
      this.confirmationService.openConfirmation({
        message: marker('base.messages.pending-changes-confirmation'),
        onConfirm: () => {
          changeSelectedSensor();
          this.pendingChangesService.clearAllPendingChanges();
        },
        onCancel: () => {
          // change back the sensor selected item
          this.componentSelectedItem = this._selectedSensor ? [{
            value: this._selectedSensor.id,
            label: this._selectedSensor.name,
          }] : [];
        }
      });
    } else {
      changeSelectedSensor();
    }
  }

  async deleteSensor() {

    this.confirmationService.openConfirmation({
      message: marker('cvs-modules.sensor.messages.confirm-delete-sensor'),
      onConfirm: async () => {
        await this.moduleSensorService.deleteSensor(this.selectedSensor.id);
        this.sensors = await this.moduleSensorService.getSensors();
        this.selectedSensor = this.sensors[0];

        this.notificationService.defaultSuccess();
      },
    });

  }

  createNewSensor() {
    createDialogComponent({
      matDialog: this.matDialog,
      dialogData: {
        innerComponentType: CreateSensorComponent,
        title: marker('cvs-modules.sensor.create-sensor'),
      },
      onOpened: component => {
        component.sensorCreated.subscribe(async sensorId => {
          this.sensors = await this.moduleSensorService.getSensors();
          this.selectedSensor = this.sensors.find((x) => x.id === sensorId);

          this.notificationService.defaultSuccess();
        });
      }
    });
  }

  private forceSensorIdReset() {
    this.forceResetWhenChangedSensor = false;
    setTimeout(() => {
      this.forceResetWhenChangedSensor = true;
    });
  }

}
