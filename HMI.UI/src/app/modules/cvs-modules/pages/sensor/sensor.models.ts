export interface FieldConfiguration {
  type: 'number' | 'text';
  name: string;
  label: string;
  value?: number;
  decimals?: number;
  min?: number;
  max?: number;
}
