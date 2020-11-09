import { FormControl } from '@angular/forms';
import { KeyValue, ABBDropdownSelectedElement } from '@app/shared/utils/types';


export class ParameterBase {

  get isParameter(): boolean {
    return this instanceof Parameter;
  }

  get isParameterBlock(): boolean {
    return (this instanceof ParameterBlock);
  }

}

export class ParameterBlock extends ParameterBase {
  name: string;
  children: (Parameter | ParameterBlock)[];
}


export type ParameterType = 'number' | 'text' | 'dropdown' | 'boolean';
export class Parameter extends ParameterBase {
  parameterId: string;
  name: string;
  type: ParameterType;
  required?: boolean;

  /** Used for dropdowns */
  options?: KeyValue[];
  decimals?: number;

  formControl: FormControl;

  getDropdownSelectedValue(): string {
    const value: ABBDropdownSelectedElement<string> = this.formControl.value;
    if (value) {
      return value[0]?.value;
    }
  }

  getValue(): any {
    let value = this.formControl.value;
    if (this.type === 'dropdown') {
      value = this.getDropdownSelectedValue();
    }
    return value;
  }
}

