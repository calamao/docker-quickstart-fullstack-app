import { ParameterInfo, ParameterInfoBlock, ParameterValues } from './../../services/parameters/parameters.model';
import { Parameter, ParameterBlock, ParameterBase } from './parameter-editor.component.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModuleParametersService } from '../../services/parameters/module-parameters.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FormHelper } from '@app/shared/utils/form.helper';
import { GlobalPendingChangesService } from '@app/core/services/pending-changes/global-pending-changes.service';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { getDropdownSelectedValue } from '@app/shared/utils/helper.functions';
import { Subscription } from 'rxjs';

const pendingChangesKeyName = 'parameters';

interface ModifiedField {
  name: string;
  value: any;
}

@Component({
  templateUrl: './parameter-editor.component.html',
  styleUrls: ['./parameter-editor.component.scss']
})
export class ParameterEditorComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  constructor(
    private moduleParametersService: ModuleParametersService,
    private formBuilder: FormBuilder,
    private pendingChangesService: GlobalPendingChangesService,
    private notificationService: NotificationService,
    ) { }

  modifiedFields: ModifiedField[] = [];

  parameterBlock: ParameterBlock;

  formGroup: FormGroup;
  private formHelper: FormHelper;

  private controlId = 0;

  async ngOnInit() {
    this.formGroup = this.formBuilder.group({});

    this.formHelper = new FormHelper({
      formGroup: this.formGroup,
      handlePendingChanges: (dirty) => {
        dirty ?
          this.pendingChangesService.notifyPendingChange({id: pendingChangesKeyName}) :
          this.pendingChangesService.clearPendingChange({id: pendingChangesKeyName});
      },
    });

    await this.loadParameters();
    this.subscribeModifiedFields();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  private subscribeModifiedFields() {
    this.subscriptions.push(
      this.formGroup.valueChanges.subscribe(() => this.updateModifiedFields())
    );
  }

  private updateModifiedFields() {
    const parameters = this.getParameterFlatList();
    const modifiedParameters = parameters.filter(param => param.formControl.dirty);

    this.modifiedFields = modifiedParameters.map(parameter => {
      return {
        name: parameter.name,
        value: parameter.getValue(),
      };
    });
  }

  private async loadParameters() {
    const parameters = await this.moduleParametersService.getParameters();

    this.parameterBlock = this.getParameterBlockFromAPI(parameters);
  }

  private getParameterFlatList(): Parameter[] {
    const parameters: Parameter[] = [];

    function isParameterGuard(parameter: ParameterBase): parameter is Parameter {
      return parameter.isParameter;
    }

    const iterateContainer = (parameterBlock: ParameterBlock) => {
      parameterBlock.children.forEach(parameter => {
        if (isParameterGuard(parameter)) {
          parameters.push(parameter);
        }
        if (parameter.isParameterBlock) {
          // continue iteration
          iterateContainer(parameter as ParameterBlock);
        }
      });
    };

    iterateContainer(this.parameterBlock);

    return parameters;
  }

  private getParameterBlockFromAPI(parameterInfo: ParameterInfoBlock): ParameterBlock {
    const parameterBlock = new ParameterBlock();
    parameterBlock.name = parameterInfo.name;
    parameterBlock.children = (parameterInfo.children ?? []).map(parameter => {
      if (parameter.nodeType === 'container') {
        return this.getParameterBlockFromAPI(parameter);
      }

      if (parameter.nodeType === 'parameter') {
        return this.getParameterFromAPI(parameter);
      }
    });

    return parameterBlock;
  }

  private getParameterFromAPI(parameterInfo: ParameterInfo): Parameter {
    const parameter = new Parameter();
    parameter.parameterId = parameterInfo.id;
    parameter.name = parameterInfo.name;
    parameter.type = parameterInfo.parameterType;
    parameter.options = parameterInfo.options;
    parameter.decimals = parameterInfo.decimals;
    parameter.required = parameterInfo.required;
    this.setFormControl(parameter, parameterInfo);

    return parameter;
  }

  private setFormControl(parameter: Parameter, parameterInfo: ParameterInfo) {
    let value = parameterInfo.value;
    if (parameter.type === 'dropdown') {
      value = getDropdownSelectedValue(value, parameterInfo.options);
    }

    parameter.formControl = new FormControl(value);

    this.formGroup.addControl((this.controlId++).toString(), parameter.formControl);
  }


  async onSubmit() {
    await this.formHelper.genericSubmitHandle({
      handleSubmit: () => this._onSubmit(),
      handleError: error => this.formHelper.setGeneralError(error),
    });
  }

  private async _onSubmit() {
    const parameterValues = this.getParameterValues();
    // console.log('data formGroup.value', this.formGroup.value);
    console.log('data getParameterValues', parameterValues);
    this.moduleParametersService.saveParameters(parameterValues);

    this.notificationService.defaultSuccess();
  }

  private getParameterValues(): ParameterValues {
    const parameters = this.getParameterFlatList();

    const parameterValues: ParameterValues = parameters.map(parameter => {
      // save parameter value
      const value = parameter.getValue();
      return {
        id: parameter.parameterId,
        value,
      };
    });

    return parameterValues;
  }

}
