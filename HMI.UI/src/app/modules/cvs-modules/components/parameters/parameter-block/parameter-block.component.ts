import { ParameterBlock } from './../../../pages/parameter-editor/parameter-editor.component.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-parameter-block',
  templateUrl: './parameter-block.component.html',
  styleUrls: ['./parameter-block.component.scss']
})
export class ParameterBlockComponent implements OnInit {

  @Input() parameterBlock: ParameterBlock;

  constructor() { }

  ngOnInit(): void {
  }

}
