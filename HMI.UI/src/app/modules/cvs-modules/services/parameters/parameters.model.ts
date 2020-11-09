import { KeyValue } from '@app/shared/utils/types';


/** expected Serialized JSON info */
export interface ParameterInfoBlock {
  name: string;
  nodeType: 'container';
  children: (ParameterInfo | ParameterInfoBlock)[];
}

export type ParameterType = 'number' | 'text' | 'dropdown' | 'boolean';
export class ParameterInfo {
  id: string;
  name: string;
  nodeType: 'parameter';
  parameterType: ParameterType;
  required?: boolean;

  /** Used for dropdowns */
  options?: KeyValue[];

  /** Only for numbers */
  decimals?: number;

  value: any;
}

export type ParameterValues = ParameterValue[];

export interface ParameterValue {
  id: string;
  value: any;
}

