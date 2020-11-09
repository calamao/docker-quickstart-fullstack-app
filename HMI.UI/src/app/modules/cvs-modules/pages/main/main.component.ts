import { User } from './../../../../core/services/user/user.model';
import { map, filter, tap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Tab } from '@app/shared/component/tabs/tabs.component';
import { UserService } from '@app/core/services/user/user.service';
import { Role } from '@app/core/services/user/user.model';
import { ModuleInfoService } from '../../services/module-info/module-info.service';
import { ActivatedRoute } from '@angular/router';
import { APPRoutes } from '@app/core/constants/constants';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  /** Important: if we inject a new instance of ModuleInfoService we are going to get that same instance in components like
   * '@class CreateOperationComponent' which is created in a popUp and does not really belongs to this component hierarchy.
   * The solution would be to pass parameters on creation.
   */
  // providers: [
  //   ModuleInfoService,
  // ]
})
export class MainComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  forceResetComponent = false;

  tabs$: Observable<Tab[]> = this.userService.currentUser$.pipe(
    map(user => this.loadTabs(user)),
    tap(x => this.forceResetTabs()),
  );

  constructor(
    private userService: UserService,
    private moduleInfoService: ModuleInfoService,
    private route: ActivatedRoute,
  ) {
    this.subscriptions.push(
      this.route.paramMap
        .pipe(
          map(params => params.get(APPRoutes.CVSMODULES.moduleIdParameterName)),
          filter(moduleId => !!moduleId),
          tap(moduleId => {
            this.moduleInfoService.setModuleId(moduleId);
            this.forceResetTabs();
          }),
        )
        .subscribe()
    );
  }

  ngOnInit(): void {
    // this.loadTabs();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  private loadTabs(currentUser: User): Tab[] {
    const hasPermission = (minRole: Role) => this.userService.hasPermission({
      minimumRole: minRole,
    });

    const tabs: Tab[] = [];
    tabs.push({title: marker('base.tabs.module-overview'), route: './status'});
    if (hasPermission(Role.Maintenance)) {
      tabs.push({title: marker('base.tabs.sensor'), route: './sensor'});
    }
    if (hasPermission(Role.Maintenance)) {
      tabs.push({title: marker('base.tabs.operation-manager'), route: './operation-manager'});
    }
    if (hasPermission(Role.Maintenance)) {
      tabs.push({title: marker('base.tabs.parameter-editor'), route: './parameter-editor'});
    }

    // this.forceResetTabs();

    return tabs;
  }

  private forceResetTabs() {
    this.forceResetComponent = false;
    setTimeout(() => {
      this.forceResetComponent = true;
    });
  }


}
