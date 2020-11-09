import { Injectable, OnDestroy } from '@angular/core';
import { KNOWN_MODULES } from '@app/core/constants/constants';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModuleInfoService implements OnDestroy {

  private subscriptions: Subscription[] = [];
  private _moduleId: string;
  public get moduleId(): string {
    return this._moduleId;
  }

  showNaturalFeature: boolean;

  constructor(

  ) {}

  setModuleId(moduleId: string) {
    this._moduleId = moduleId;
    /** Only activate Natural Feature for CVG module */
    this.showNaturalFeature = this._moduleId === KNOWN_MODULES.CVG;
  }

  ngOnDestroy() {
    console.log('service destroy')
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
