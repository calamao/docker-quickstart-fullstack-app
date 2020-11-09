import { VideoComponent } from './../../../../shared/component/video/video.component';
import { CameraComponent } from './camera/camera.component';
import { ChangeDetectorRef, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IDeactivateComponent } from '@app/core/services/guards/can-deactivate-guard.service';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { ConfirmationService } from '@app/shared/component/dialog/confirmation/confirmation.service';
import { createDialogComponent } from '@app/shared/component/dialog/dialog.component';
import { ABBDropdownSelectedElement } from '@app/shared/utils/types';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { CreateOperationComponent } from '../../components/create-operation/create-operation.component';
import { ModuleOperationManagerService } from '../../services/operation-manager/module-operation-manager.service';
import { Operation } from '../../services/operation-manager/operation-manager.model';
import { TargetVisualizerService } from '../../services/target-visualizer/target-visualizer.service';
import { OperationManagerPendingChangesService } from '../../services/operation-manager/pending-changes.service';
import { StepsService } from '../../services/operation-manager/steps.service';
import { ModuleInfoService } from '../../services/module-info/module-info.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './operation-manager.component.html',
  styleUrls: ['./operation-manager.component.scss'],
  // we make sure there is a single instance every time (we don't need to worry about the state)
  providers: [
    OperationManagerPendingChangesService,
    TargetVisualizerService,
    StepsService,
  ],
})
export class OperationManagerComponent implements OnInit, OnDestroy, IDeactivateComponent {

  @ViewChild('video') private videoComponent: VideoComponent;

  _selectedOperation: Operation;
  public get selectedOperation() {
    return this._selectedOperation;
  }
  public set selectedOperation(value: Operation) {
    this._selectedOperation = value;
    this.componentSelectedItem = this._selectedOperation ? [{
      value: this._selectedOperation.name,
      label: this._selectedOperation.name,
    }] : [];

    this.forceOperationIdReset();
  }

  componentSelectedItem: ABBDropdownSelectedElement<string>;
  forceResetWhenChangedOperation = true;
  targetToolMenu = true;

  operations: Operation[] = [];

  collapsibleIds = {
    cam: 'cam',
    target: 'target',
    steps: 'steps',
  };

  private subscriptions: Subscription[] = [];

  constructor(
    private cvgOperationManagerService: ModuleOperationManagerService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService,
    private matDialog: MatDialog,
    public targetVisualizerService: TargetVisualizerService,
    private pendingChangesService: OperationManagerPendingChangesService,
    public stepsService: StepsService,
    private cd: ChangeDetectorRef,
  ) { }

  pendingChanges = false;
  hasPendingChanges(): boolean {
    const pendingChanges = this.pendingChanges ||
      this.pendingChangesService.hasPendingChanges();
    return pendingChanges;
  }

  async ngOnInit() {
    this.operations = await this.cvgOperationManagerService.getOperations();

    // select first sensor by default
    this.selectedOperation = this.operations[0];

    this.subscriptions.push(
      // to avoid 'ExpressionChangedAfterItHasBeenCheckedError'
      this.stepsService.selectedImage$.subscribe(image => this.cd.detectChanges())
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  createNewOperation() {
    createDialogComponent({
      matDialog: this.matDialog,
      dialogData: {
        innerComponentType: CreateOperationComponent,
        title: marker('cvs-modules.operation-manager.create-operation'),
      },
      onOpened: component => {
        component.operationCreated.subscribe(async operationId => {
          this.operations = await this.cvgOperationManagerService.getOperations();
          this.selectedOperation = this.operations.find((x) => x.id === operationId);

          this.notificationService.defaultSuccess();
        });
      }
    });
  }

  async operationChanged(value: ABBDropdownSelectedElement<string>) {
    const changeSelectedOperation = () => {
      const selectedOperation = value[0];
      this.selectedOperation = this.operations.find((x) => x.id === selectedOperation.value);
    };

    if (this.pendingChangesService.hasPendingChanges()) {
      this.confirmationService.openConfirmation({
        message: marker('base.messages.pending-changes-confirmation'),
        onConfirm: () => {
          changeSelectedOperation();
          this.pendingChangesService.clearAllPendingChanges();
        },
        onCancel: () => {
          // change back the sensor selected item
          this.componentSelectedItem = this._selectedOperation ? [{
            value: this._selectedOperation.id,
            label: this._selectedOperation.name,
          }] : [];
        }
      });
    } else {
      changeSelectedOperation();
    }
  }

  async deleteOperation() {

    this.confirmationService.openConfirmation({
      message: marker('cvs-modules.operation-manager.messages.confirm-delete-operation'),
      onConfirm: async () => {
        await this.cvgOperationManagerService.deleteOperation(this.selectedOperation.id);
        this.operations = await this.cvgOperationManagerService.getOperations();
        this.selectedOperation = this.operations[0];

        this.notificationService.defaultSuccess();
      },
    });

  }

  collapsibleSelectedChange(itemIds: string[]) {
    // console.log('collapsibleSelectedChange', itemIds);
    if (itemIds[0] === this.collapsibleIds.steps) {
      // steps are visible now
      this.stepsService.showSteps = true;
    } else {
      // hide steps are visible now
      this.stepsService.showSteps = false;
    }
  }

  takePicture() {
    const data = this.videoComponent.takePicture();
    this.stepsService.addImage(data);
  }

  updatePicture() {
    const data = this.videoComponent.takePicture();
    this.stepsService.updatePicture(data);
  }

  private forceOperationIdReset() {
    this.forceResetWhenChangedOperation = false;
    setTimeout(() => {
      this.forceResetWhenChangedOperation = true;
    });
  }

}
