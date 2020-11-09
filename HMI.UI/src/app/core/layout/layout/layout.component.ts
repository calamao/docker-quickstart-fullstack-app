import { LogsService } from './../../../modules/logs/services/logs.service';
import { NotificationData } from '@abb/abb-common-ux-angular';
import { AfterContentInit, Component, ContentChildren, OnInit, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { APPRoutes } from '@app/core/constants/constants';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  title = 'Dynamic Assembly Pack';
  routes = APPRoutes;

  notifications: NotificationData[] = [];
  private counter = 0;
  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private logsService: LogsService,
  ) {}

  ngOnInit(): void {
    this.notificationService.notifications$.subscribe(notification => {
      this.notifications.push(notification);
    });
  }

  addNotification(): void {
    this.notificationService.addNotification({
      severity: 'warn',
      text: `Random notification #${this.counter}`,
    });
  }

  /** This method is necessary as "routerLink" does not work for 'abb-app-top-navi-item' (there must be some "preventDefault" inside) */
  goToLogs(): void {
    const log = this.logsService.getLastActiveLog();
    if (log) {
      this.router.navigate(['/logs/view-log', log.id]);
      return;
    }

    this.router.navigate(['/logs']);
  }

  getLastActiveLog() {
    const log = this.logsService.getLastActiveLog();
    const logCount = this.logsService.getActiveLogCount() || '';
    if (log) {
      return `${logCount} - ${log?.message}`;
    }
  }

  /** This is a workaround for some kind of issue with the sideBar component
   * Without it the "canDeactivate" event of a route is triggered twice the sencond time we try to leave from a route.
   * Reproduce:
   *  1. Enter in a route with canDeactivate = false
   *  2. Click in a sideBar element: popUp confirmation should open.
   *  3. Click cancel to stay in the same page and not leaving the route.
   *  4. Click again in the same sideBar element.
   *  5. ERROR: This time 2 popups of confirmation are opened. (because the "canDeactivate" has been triggered twice)
   */
  sideBarItemStopPropagation(event: Event) {
    event.stopPropagation();
  }
}
