import { tap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LogElement, LogsService } from '../../services/logs.service';
import { Subscription } from 'rxjs';
import { NotificationService } from '@app/core/services/notification/notification.service';

@Component({
  selector: 'app-logs-table',
  templateUrl: './logs-table.component.html',
  styleUrls: ['./logs-table.component.scss'],
})
export class LogsTableComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  elements: LogElement[] = [];
  totalElements: number;
  currentPage = 1;
  currentPageSize = 20;

  constructor(
    private logsService: LogsService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.queryParams
        .pipe(
          tap((params) => {
            this.currentPage = Number(params.page ?? 1);
            this.getLogs();
          })
        )
        .subscribe()
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  private async getLogs() {
    const page = await this.logsService.getLogs({
      page: this.currentPage,
      pageSize: this.currentPageSize,
      orderByDescendant: 'time',
    });

    this.elements = page.elements;
    this.totalElements = page.totalElements;
  }

  viewLog(id: string) {
    this.router.navigate(['/logs/view-log', id], {
      queryParams: { page: this.currentPage },
    });
  }

  currentPageChange(newPage: number) {
    this.currentPage = newPage;
    this.getLogs();
  }

  async acknowledgeAll() {
    await this.logsService.acknowledgeAll();
    this.elements.forEach(log => log.status = 'normal');
    this.notificationService.defaultSuccess();
  }
}
