import { OperationType } from './../../services/operation-manager/operation-manager.model';
import { DialogComponent } from '@app/shared/component/dialog/dialog.component';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { FormHelper } from '@app/shared/utils/form.helper';
import { ABBDropdownSelectedElement, AbstractControlOrT } from '@app/shared/utils/types';
import { ModuleOperationManagerService } from '../../services/operation-manager/module-operation-manager.service';
import { ModuleInfoService } from '../../services/module-info/module-info.service';

interface FormGroupModel<T = unknown> {
  operationName: AbstractControlOrT<T, string>;
  operationType: AbstractControlOrT<T, ABBDropdownSelectedElement<OperationType>>;
}


@Component({
  selector: 'app-create-operation',
  templateUrl: './create-operation.component.html',
  styleUrls: ['./create-operation.component.scss']
})
export class CreateOperationComponent implements OnInit {

  @Output() operationCreated = new EventEmitter<string>();

  formGroup: FormGroup;
  private formHelper: FormHelper;

  readonly operationTypeTag: OperationType = 'Tag';
  readonly operationTypeNaturaFeature: OperationType = 'NaturalFeature';

  constructor(
    private formBuilder: FormBuilder,
    private dialog: DialogComponent,
    private moduleOperationService: ModuleOperationManagerService,
    private notificationService: NotificationService,
    private moduleInfoService: ModuleInfoService,
  ) { }

  ngOnInit(): void {

    this.formGroup = this.formBuilder.group(
      {
        operationName: new FormControl(''),
        operationType: new FormControl(
          this.enableNaturalFeature() ? '' : this.getOperationTypeSelectedValue(this.operationTypeTag),
          [Validators.required]
        ),
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

  private getOperationTypeSelectedValue(value: OperationType): ABBDropdownSelectedElement<OperationType> {
    return [{
      label: '',
      value,
    }];
  }

  enableNaturalFeature() {
    return this.moduleInfoService.showNaturalFeature;
  }

  async onSubmit() {
    const data: FormGroupModel = this.formGroup.value;

    const operationId = await this.moduleOperationService.addOperation(data.operationName, data.operationType[0].value);
    this.operationCreated.emit(operationId);
  }

  private handleError(error: Error) {
    this.notificationService.addNotification({
      severity: 'error',
      text: error.message,
    });
  }

}
