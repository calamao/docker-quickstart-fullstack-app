import { Component, OnInit } from '@angular/core';
import { APPRoutes } from '@app/core/constants/constants';

@Component({
  selector: 'app-layout2',
  templateUrl: './layout2.component.html',
  styleUrls: ['./layout2.component.scss']
})
export class Layout2Component implements OnInit {
  routes = APPRoutes;
  constructor() { }

  ngOnInit(): void {
  }

}
