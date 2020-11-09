import { Component, OnInit } from '@angular/core';
import { APPRoutes } from '@app/core/constants/constants';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  routes = APPRoutes;
  constructor() { }

  ngOnInit(): void {
  }

}
