import { TargetTool } from './../../../../services/operation-manager/operation-manager.model';
import { interval, Subject } from 'rxjs';
import { MoveAction } from './tool-move-panel/tool-move-panel.component';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { ModuleOperationManagerService } from '@app/modules/cvs-modules/services/operation-manager/module-operation-manager.service';
import { OperationManagerPendingChangesService } from '@app/modules/cvs-modules/services/operation-manager/pending-changes.service';
import { TargetVisualizerService } from '@app/modules/cvs-modules/services/target-visualizer/target-visualizer.service';
import { ModelViewerCameraOrbit } from '@app/shared/component/model-viewer/model-viewer.component';
import { OperationManagerComponent } from '../../operation-manager.component';
import { HttpErrorResponse } from '@angular/common/http';
import { throttle } from 'rxjs/operators';

@Component({
  selector: 'app-target-tool-menu',
  templateUrl: './target-tool-menu.component.html',
  styleUrls: ['./target-tool-menu.component.scss']
})
export class TargetToolMenuComponent implements OnInit {
  operationId: string;

  cameraOrbit: ModelViewerCameraOrbit;
  minInlierRatio = 0;
  lineSearchLength = 0;
  tryMatching = false;

  get cameraOrbitFormatted() {
    if (this.cameraOrbit) {
      return `Theta: ${this.cameraOrbit.theta} - Phi: ${this.cameraOrbit.phi} - Radius: ${this.cameraOrbit.radius}`;
    }
  }

  private changes$ = new Subject<void>();
  private throttleTime = 500;
  private throttleChanges$ = this.changes$.pipe(
    throttle(ev => interval(this.throttleTime), {trailing: true}),
  );

  constructor(
    private moduleOperationManagerService: ModuleOperationManagerService,
    private targetVisualizerService: TargetVisualizerService,
    private pendingChangesService: OperationManagerPendingChangesService,
    private notificationService: NotificationService,
    ) { }

  ngOnInit(): void {
    this.operationId = this.targetVisualizerService.operationId;
    this.loadData();
    this.subscribeTochanges();
  }

  private async loadData() {
    const targetTool = await this.moduleOperationManagerService.getTargetTool(this.operationId);
    this.minInlierRatio = targetTool?.minInlierRatio || 0;
    this.lineSearchLength = targetTool?.lineSearchLength || 0;
    this.tryMatching = targetTool?.tryMatching || false;
  }

  private subscribeTochanges() {
    this.throttleChanges$.subscribe(changes => {
      console.log('changes', {
        minInlierRatio: this.minInlierRatio,
        lineSearchLength: this.lineSearchLength,
        tryMatching: this.tryMatching,
      });
      this.sendChanges();
    });
  }

  async onSubmit() {
    // console.table([this.cameraOrbit, this.minInlierRatio, this.lineSearchLength, this.tryMatching]);
    try {
      await this.moduleOperationManagerService.saveTargetTool(this.operationId);
      this.notificationService.defaultSuccess();
      this.exit();
    } catch (error) {
      const terror: HttpErrorResponse = error;
      this.notificationService.addNotification({
        severity: 'error',
        text: terror.error.message,
      });
    }

  }

  move(moveAction: MoveAction) {
    this.moduleOperationManagerService.moveTarget(this.operationId, moveAction);
  }

  exit() {
    this.pendingChangesService.clearPendingChange('toolMenu');
    this.targetVisualizerService.backToOperationManager();
  }

  // cameraChange(cameraOrbit: ModelViewerCameraOrbit) {
  //   // console.log('cameraOrbit', cameraOrbit);
  //   this.cameraOrbit = cameraOrbit;
  // }

  minInlierRatioChange(value: number) {
    this.minInlierRatio = value;
    this.changes$.next();
    this.pendingChangesService.notifyPendingChange('toolMenu');
  }

  lineSearchLengthChange(value: number) {
    this.lineSearchLength = value;
    this.changes$.next();
    this.pendingChangesService.notifyPendingChange('toolMenu');
  }

  tryMatchingChange(value: boolean) {
    this.tryMatching = value;
    this.changes$.next();
    this.pendingChangesService.notifyPendingChange('toolMenu');
  }

  private async sendChanges() {
    try {
      await this.moduleOperationManagerService.updateTargetTool(this.operationId, {
        minInlierRatio: this.minInlierRatio,
        lineSearchLength: this.lineSearchLength,
        tryMatching: this.tryMatching,
      });
    } catch (error) {
      const terror: HttpErrorResponse = error;
      this.notificationService.addNotification({
        severity: 'error',
        text: terror.error.message,
      });
    }
  }
}
