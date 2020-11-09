import { Injectable } from '@angular/core';
import { GlobalPendingChangesService, PendingChange as GlobalPendingChange } from '@app/core/services/pending-changes/global-pending-changes.service';

type CVGComponents =
  SensorPendingChangesComponent |
  OperationManagerPendingChangesComponent;

export type SensorPendingChangesComponent = 'mainconfig' | 'extrinsiccalibration';
export type OperationManagerPendingChangesComponent = 'camera' | 'target' | 'steps' | 'poseMenu' | 'toolMenu';

export interface PendingChange<TComponent extends CVGComponents> {
  component: TComponent;
  // pendingChange: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PendingChangesService<TComponent extends CVGComponents> {

  // private _pendingChanges: PendingChange<TComponent>[] = [];

  constructor(
    private globalPendingChanges: GlobalPendingChangesService,
  ) { }

  // notifyPendingChange(component: TComponent) {
  //   const existingPendingChange = this._pendingChanges.find(x => x.component === component);
  //   if (!existingPendingChange) {
  //     this._pendingChanges.push({
  //       component,
  //     });

  //   }
  // }

  notifyPendingChange(component: TComponent) {
    const existingPendingChange = this.globalPendingChanges.pendingChanges.find(x => x.id === component);
    if (!existingPendingChange) {
      this.globalPendingChanges.notifyPendingChange({
        id: component,
      });
    }
  }

  // clearPendingChange(component: TComponent) {
  //   // remove item
  //   this._pendingChanges = this._pendingChanges.filter(x => x.component !== component);
  // }

  clearPendingChange(component: TComponent) {
    // remove item
    this.globalPendingChanges.clearPendingChange({
      id: component,
    });
  }

  // hasPendingChanges(): boolean {
  //   return this._pendingChanges.length > 0;
  // }

  hasPendingChanges(component?: TComponent): boolean {
    let pendingChange: GlobalPendingChange;
    if (component) {
      pendingChange = {
        id: component,
      };
    }
    return this.globalPendingChanges.hasPendingChanges(pendingChange);
  }

  // clearAllPendingChanges(): void {
  //   this._pendingChanges = [];
  // }

  clearAllPendingChanges(): void {
    this.globalPendingChanges.clearAllPendingChanges();
  }
}

@Injectable({
  providedIn: 'root'
})
export class OperationManagerPendingChangesService extends PendingChangesService<OperationManagerPendingChangesComponent> {

}

@Injectable({
  providedIn: 'root'
})
export class SensorPendingChangesService extends PendingChangesService<SensorPendingChangesComponent> {

}


