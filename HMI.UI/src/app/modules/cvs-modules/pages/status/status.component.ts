import { Component, OnInit } from '@angular/core';
import { States } from '@app/shared/component/operation-status/operation-status.component';
import { ModuleStatusService } from '@app/shared/services/module-status.service';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {

  CVGOperationTitle: string = marker('overview.CVG-operation');
  CVGOperationName: string;
  CVGOperationStates: Observable<States>;

  constructor(
    private moduleStatusService: ModuleStatusService,
  ) { }

  ngOnInit(): void {
    this.CVGOperationStates = this.moduleStatusService.cvgStatus$;
  }

}
