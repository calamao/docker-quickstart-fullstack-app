import { OperationManagerComponent } from './../../operation-manager.component';
import { blockUI } from '@app/shared/utils/helper.functions';
import { KeyValue } from '@angular/common';
import { Component, forwardRef, Inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { ModuleOperationManagerService } from '@app/modules/cvs-modules/services/operation-manager/module-operation-manager.service';
import { NaturalFeatureTarget, TagTarget } from '@app/modules/cvs-modules/services/operation-manager/operation-manager.model';
import { FormHelper } from '@app/shared/utils/form.helper';
import { ABBDropdownSelectedElement, AbstractControlOrT, KeyObject } from '@app/shared/utils/types';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { TargetVisualizerService } from '@app/modules/cvs-modules/services/target-visualizer/target-visualizer.service';
import { OperationManagerPendingChangesService } from '@app/modules/cvs-modules/services/operation-manager/pending-changes.service';

interface FormGroupModel<T = unknown> extends KeyObject<typeof modelKeysConst> {
  minInlierRatioInit: AbstractControlOrT<T, number>;
  minInlierRatioTraking: AbstractControlOrT<T, number>;
  lineSearchLenghtInitRelative: AbstractControlOrT<T, number>;
  threeDModelId: AbstractControlOrT<T, ABBDropdownSelectedElement<string>>;
}

const modelKeysConst = {
  minInlierRatioInit: 'minInlierRatioInit',
  minInlierRatioTraking: 'minInlierRatioTraking',
  lineSearchLenghtInitRelative: 'lineSearchLenghtInitRelative',
  threeDModelId: 'threeDModelId',
};

@Component({
  selector: 'app-natural-feature',
  templateUrl: './natural-feature.component.html',
  styleUrls: ['./natural-feature.component.scss']
})
export class NaturalFeatureComponent implements OnInit {
  @Input() operationId: string;

  // Pass instance name to decorator
  @BlockUI('operation-manager-target') blockUI: NgBlockUI;

  formGroup: FormGroup;
  private formHelper: FormHelper;
  modelKeys = modelKeysConst;

  threeDModels: KeyValue<string, string>[] = [];

  get formControls(): FormGroupModel<FormControl>  {
    return this.formGroup.controls as any;
  }

  constructor(
    private formBuilder: FormBuilder,
    private cvgOperationManagerService: ModuleOperationManagerService,
    private notificationService: NotificationService,
    private targetVisualizerService: TargetVisualizerService,
    private pendingChangesService: OperationManagerPendingChangesService,
    ) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group(
      {
        minInlierRatioInit: new FormControl(''),
        minInlierRatioTraking: new FormControl(''),
        lineSearchLenghtInitRelative: new FormControl(''),
        threeDModelId: new FormControl('', [Validators.required]),
      } as FormGroupModel<FormControl>,
    );

    this.formHelper = new FormHelper({
      formGroup: this.formGroup,
      handlePendingChanges: (dirty) => {
        dirty ?
          this.pendingChangesService.notifyPendingChange('target') :
          this.pendingChangesService.clearPendingChange('target');
      },
    });

    this.load3DModels();
    this.loadData();
  }

  private async loadData() {
    const target = await this.cvgOperationManagerService.getNaturalFeature(this.operationId);
    this.mapConfiguration(target);
  }

  private async load3DModels() {
    const models = await this.cvgOperationManagerService.get3DModels(this.operationId);
    this.threeDModels = models.map(x => ({
      key: x.id,
      value: x.name,
    }));
  }

  private mapConfiguration(config: NaturalFeatureTarget) {
    if (!config) { return; }

    this.formControls.minInlierRatioInit.setValue(config.minInlierRatioInit);
    this.formControls.minInlierRatioTraking.setValue(config.minInlierRatioTraking);
    this.formControls.lineSearchLenghtInitRelative.setValue(config.lineSearchLenghtInitRelative);
    this.formControls.threeDModelId.setValue(this.getDropDownSelectedElement(config.threeDModelId));
  }

  private getDropDownSelectedElement(key: string): ABBDropdownSelectedElement<string> {
    const model = this.threeDModels.find(x => x.key === key);
    return [{
      label: model.value,
      value: model.key,
      isNew: false,
    }];
  }

  async onSubmit() {
    await this.formHelper.genericSubmitHandle({
      handleSubmit: () => this._onSubmit(),
      handleError: error => this.formHelper.setGeneralError(error),
    });
  }

  private async _onSubmit() {
    const data: FormGroupModel = this.formGroup.value;
    console.log('natural feature submit', data);

    await this.cvgOperationManagerService.saveNaturalFeature(this.operationId, {
      minInlierRatioInit: data.minInlierRatioInit,
      minInlierRatioTraking: data.minInlierRatioTraking,
      lineSearchLenghtInitRelative: data.lineSearchLenghtInitRelative,
      threeDModelId: data.threeDModelId[0].value,
    });

    this.notificationService.defaultSuccess();
  }

  hintUpload3DModel() {

  }

  async droppedFile(files: File[]) {
    // this.blockUIMainConfiguration.start(); // Start blocking element only

    // setTimeout(() => {
    //   this.blockUIMainConfiguration.stop(); // Stop blocking
    // }, 4000);

    blockUI(this.blockUI, async () => {
      try {
        const modelId = await this.cvgOperationManagerService.save3DModel(this.operationId, files[0]);
        await this.load3DModels();
        this.formControls.threeDModelId.setValue(this.getDropDownSelectedElement(modelId));
      } catch (error) {
        this.notificationService.addNotification({
          severity: 'error',
          text: 'Error uploading model'
        });
      }
    });

  }

  initPoseMenu() {
    // show target pose menu
    this.targetVisualizerService.setTargetPoseMenu(this.operationId);
  }
  initTargetToolMenu() {
    // show target tool menu
    this.targetVisualizerService.setTargetToolMenu(this.operationId);
  }


}
