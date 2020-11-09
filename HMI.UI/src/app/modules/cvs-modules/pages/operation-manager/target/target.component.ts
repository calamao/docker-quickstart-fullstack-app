import { OperationType } from './../../../services/operation-manager/operation-manager.model';
import { Component, Input, OnInit } from '@angular/core';
import { ModuleOperationManagerService } from '@app/modules/cvs-modules/services/operation-manager/module-operation-manager.service';

@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.scss']
})
export class TargetComponent implements OnInit {
  @Input() operationId: string;
  operationType: OperationType;

  get isNaturalFeature() {
    return this.operationType === 'NaturalFeature';
  }
  get isTag() {
    return this.operationType === 'Tag';
  }

  constructor(
    private cvgOperationManagerService: ModuleOperationManagerService,
  ) { }

  ngOnInit(): void {
    this.getOperationMode();
  }

  private async getOperationMode() {
    const operations = await this.cvgOperationManagerService.getOperations();
    this.operationType = operations.find(x => x.id === this.operationId).type;
  }

}
