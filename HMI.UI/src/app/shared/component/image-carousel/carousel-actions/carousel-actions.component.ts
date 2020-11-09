import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-carousel-actions',
  templateUrl: './carousel-actions.component.html',
  styleUrls: ['./carousel-actions.component.scss']
})
export class CarouselActionsComponent implements OnInit {
  @Output() moveTotalLeft = new EventEmitter();
  @Output() moveLeft = new EventEmitter();
  @Output() moveRight = new EventEmitter();
  @Output() moveTotalRight = new EventEmitter();

  @Input() disableButtons = false;
  @Input() disableLeft = false;
  @Input() disableRight = false;

  constructor() { }

  ngOnInit(): void {
  }

}
