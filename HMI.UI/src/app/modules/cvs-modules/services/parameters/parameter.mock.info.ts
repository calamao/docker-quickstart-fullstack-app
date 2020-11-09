import { uuidv4 } from '@app/shared/utils/helper.functions';
import { ParameterInfoBlock } from './parameters.model';


export const parameters: ParameterInfoBlock = {
  name: 'Root',
  nodeType: 'container',
  children: [
    {
      nodeType: 'container',
      name: 'block1',
      children: [
        {
          id: uuidv4(),
          nodeType: 'parameter',
          name: 'Param1',
          parameterType: 'text',
          value: 'AAAA',
          required: true,
        },
        {
          id: uuidv4(),
          nodeType: 'parameter',
          name: 'Param1',
          parameterType: 'text',
          value: 'BBBB',
        },
        {
          id: uuidv4(),
          nodeType: 'parameter',
          name: 'Param1',
          parameterType: 'number',
          decimals: 3,
          value: '0.1',
        },
        {
          id: uuidv4(),
          nodeType: 'parameter',
          name: 'Bool1',
          parameterType: 'boolean',
          value: true,
        },
      ]
    },
    {
      nodeType: 'container',
      name: 'block2',
      children: [
        {
          id: uuidv4(),
          nodeType: 'parameter',
          name: 'Dropdown 1',
          parameterType: 'dropdown',
          options: [
            {id: '1', name: 'Option 1'},
            {id: '2', name: 'Option 2'},
            {id: '3', name: 'Option 3'},
            {id: '4', name: 'Option 4'},
            {id: '5', name: 'Option 5'},
            {id: '6', name: 'Option 6'},
            {id: '7', name: 'Option 7'},
          ],
          value: '3',
        },
        {
          id: uuidv4(),
          nodeType: 'parameter',
          name: 'Param1',
          parameterType: 'text',
          value: 'Block 2 param',
        },
      ]
    }
  ],
};

