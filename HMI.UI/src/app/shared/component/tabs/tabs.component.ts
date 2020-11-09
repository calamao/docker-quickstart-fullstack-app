import { TabComponent } from '@abb/abb-common-ux-angular-9/lib/tabcontrol/tab/tab.component';
import { TabcontrolComponent } from '@abb/abb-common-ux-angular-9/lib/tabcontrol/tabcontrol.component';
import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export interface Tab {
  title: string;
  route: string;
}


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit, AfterViewInit {
  @ViewChild('tabControl') tabControl: TabcontrolComponent;

  @Input()
  tabs: Tab[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
  }

  tabClicked(event: {
    activeTab: TabComponent;
    activeTabIndex: number;
    allTabs: TabComponent[];
  }){
    this.router.navigate([this.tabs[event.activeTabIndex].route], {relativeTo: this.activatedRoute});
  }



}
