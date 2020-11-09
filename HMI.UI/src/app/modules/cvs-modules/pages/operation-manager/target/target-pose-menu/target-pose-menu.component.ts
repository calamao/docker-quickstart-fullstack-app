import { Component, Input, OnInit } from '@angular/core';
import { ModuleOperationManagerService } from '@app/modules/cvs-modules/services/operation-manager/module-operation-manager.service';
import { TargetPose } from '@app/modules/cvs-modules/services/operation-manager/operation-manager.model';
import { TargetVisualizerService } from '@app/modules/cvs-modules/services/target-visualizer/target-visualizer.service';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { OperationManagerPendingChangesService } from '@app/modules/cvs-modules/services/operation-manager/pending-changes.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-target-pose-menu',
  templateUrl: './target-pose-menu.component.html',
  styleUrls: ['./target-pose-menu.component.scss']
})
export class TargetPoseMenuComponent implements OnInit {
  operationId: string;

  poses: TargetPose[] = [];

  constructor(
    private moduleOperationManagerService: ModuleOperationManagerService,
    private targetVisualizerService: TargetVisualizerService,
    private notificationService: NotificationService,
    private pendingChangesService: OperationManagerPendingChangesService,
    ) { }

  ngOnInit(): void {
    this.operationId = this.targetVisualizerService.operationId;
    this.loadData();
  }

  async loadData() {
    this.poses = await this.moduleOperationManagerService.getTargetPoses(this.operationId) || [];
  }

  async onSubmit() {

    try {
      await this.moduleOperationManagerService.savePoses(this.operationId, this.poses);
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

  deleteItem(target: TargetPose) {
    console.log('delete', target.id);
    this.poses = this.poses.filter(x => x.id !== target.id);
    this.pendingChangesService.notifyPendingChange('poseMenu');
  }

  exit() {
    this.pendingChangesService.clearPendingChange('poseMenu');
    this.targetVisualizerService.backToOperationManager();
  }

  async getCurrentPose() {
    const currentPose = await this.moduleOperationManagerService.getCurrentPose();
    this.poses.push(currentPose);
    this.pendingChangesService.notifyPendingChange('poseMenu');
  }

}
