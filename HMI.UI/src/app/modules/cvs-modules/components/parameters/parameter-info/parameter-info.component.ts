import { Component, Input, OnInit } from '@angular/core';
import { Parameter } from '@app/modules/cvs-modules/pages/parameter-editor/parameter-editor.component.model';
import { InputDataType } from '@app/shared/component/input/input/input.component';

@Component({
  selector: 'app-parameter-info',
  templateUrl: './parameter-info.component.html',
  styleUrls: ['./parameter-info.component.scss']
})
export class ParameterInfoComponent implements OnInit {

  @Input() parameter: Parameter;

  constructor() { }

  ngOnInit(): void {
  }

  isInput() {
    return this.parameter.type === 'number' ||
      this.parameter.type === 'text';
  }

  isDropdown() {
    return this.parameter.type === 'dropdown';
  }

  isSwitch() {
    return this.parameter.type === 'boolean';
  }

  isDirty() {
    return this.parameter.formControl.dirty;
  }

  getInputDataType(): InputDataType {
    if (this.parameter.type === 'number') {
      return 'number';
    }
    if (this.parameter.type === 'text') {
      return 'text';
    }
  }

  changeSwitchValue(value: boolean) {
    this.parameter.formControl.setValue(value);
  }

}
