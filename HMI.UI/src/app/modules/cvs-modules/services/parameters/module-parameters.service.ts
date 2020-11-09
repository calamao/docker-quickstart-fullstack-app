import { Injectable } from '@angular/core';
import { parameters as parametersMock } from './parameter.mock.info';
import { ParameterInfoBlock, ParameterValues } from './parameters.model';

@Injectable({
  providedIn: 'root'
})
export class ModuleParametersService {

  private parametersMock: ParameterInfoBlock;

  constructor() {
    this.parametersMock = parametersMock;
  }

  async getParameters(): Promise<ParameterInfoBlock> {
    return this.parametersMock;
  }

  async saveParameters(parameters: ParameterValues): Promise<void> {
    this.saveParameterValuesToMock(parameters);
  }

  private saveParameterValuesToMock(parameters: ParameterValues) {

    const iterateContainer = (parameterInfoBlock: ParameterInfoBlock) => {
      parameterInfoBlock.children.forEach(parameter => {
        if (parameter.nodeType === 'parameter') {
          // save parameter value
          parameter.value = parameters.find(param => param.id === parameter.id).value;
        }
        if (parameter.nodeType === 'container') {
          // continue iteration
          iterateContainer(parameter);
        }
      });
    };

    iterateContainer(this.parametersMock);

  }
}
