import { TranslateService } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { NotificationData } from '@abb/abb-common-ux-angular';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

interface NotificationOptions {
  resourceId?: string;
  text?: string;
  severity: 'success' | 'info' | 'warn' | 'error';
}

const defaultNotificationData: NotificationData = {
  type: 'banner',
  discreet: false,
  timeout: 3000,
} as NotificationData;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _notifications$ = new ReplaySubject<NotificationData>(1);
  public get notifications$() {
    return this._notifications$.asObservable();
  }
  private counter = 0;

  constructor(
    private translateService: TranslateService,
  ) {}

  addNotification(options: NotificationOptions): void {
    this.counter++;
    const newNotification: NotificationData = {
      ...defaultNotificationData,
      id: `id-${this.counter}`,
      severity: options.severity === 'error' ? 'alarm' : options.severity,
      text: options.resourceId ? this.translateService.instant(options.resourceId) : options.text,
    };

    this._notifications$.next(newNotification);
  }

  defaultSuccess() {
    this.addNotification({
      severity: 'success',
      resourceId: marker('base.messages.executed-successful'),
    });
  }


}
