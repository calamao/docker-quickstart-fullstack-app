import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { ModuleOperationManagerService } from '@app/modules/cvs-modules/services/operation-manager/module-operation-manager.service';
import { TagTarget } from '@app/modules/cvs-modules/services/operation-manager/operation-manager.model';
import { OperationManagerPendingChangesService } from '@app/modules/cvs-modules/services/operation-manager/pending-changes.service';
import { FormHelper } from '@app/shared/utils/form.helper';
import { AbstractControlOrT } from '@app/shared/utils/types';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

interface FormGroupModel<T = unknown> {
  id: AbstractControlOrT<T, number>;
  tagSize: AbstractControlOrT<T, number>;
}

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {
  @Input() operationId: string;

  formGroup: FormGroup;
  private formHelper: FormHelper;

  get formControls(): FormGroupModel<FormControl>  {
    return this.formGroup.controls as any;
  }
  
  constructor(
    private formBuilder: FormBuilder,
    private cvgOperationManagerService: ModuleOperationManagerService,
    private notificationService: NotificationService,
    private pendingChangesService: OperationManagerPendingChangesService,
    ) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group(
      {
        id: new FormControl(''),
        tagSize: new FormControl(''),
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

    this.loadData();
  }

  private async loadData() {
    const tag = await this.cvgOperationManagerService.getTag(this.operationId);
    this.mapConfiguration(tag);
  }

  private mapConfiguration(config: TagTarget) {
    if (!config) { return; }

    this.formControls.id.setValue(config.id);
    this.formControls.tagSize.setValue(config.tagSize);
  }

  async onSubmit() {
    await this.formHelper.genericSubmitHandle({
      handleSubmit: () => this._onSubmit(),
      handleError: error => this.formHelper.setGeneralError(error),
    });
  }

  private async _onSubmit() {
    const data: FormGroupModel = this.formGroup.value;

    await this.cvgOperationManagerService.saveTag(this.operationId, {
      id: data.id,
      tagSize: data.tagSize,
    });

    this.notificationService.defaultSuccess();
  }

}
