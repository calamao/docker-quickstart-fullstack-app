import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TargetVisualizerService {
  operationId: string = '1';  /// mock test!!!!!!!!!!!

  get showMainOperationManager() {
    return !this.showTargetToolMenu && !this.showTargetPoseMenu;
  }

  _showTargetToolMenu = false;
  get showTargetToolMenu() {
    return this._showTargetToolMenu;
  }

  _showTargetPoseMenu = false;
  get showTargetPoseMenu() {
    return this._showTargetPoseMenu;
  }

  constructor() { }

  setTargetToolMenu(operationId: string) {
    this.operationId = operationId;
    this._showTargetToolMenu = true;
  }

  setTargetPoseMenu(operationId: string) {
    this.operationId = operationId;
    this._showTargetPoseMenu = true;
  }

  backToOperationManager() {
    this._showTargetToolMenu = false;
    this._showTargetPoseMenu = false;
  }
}
