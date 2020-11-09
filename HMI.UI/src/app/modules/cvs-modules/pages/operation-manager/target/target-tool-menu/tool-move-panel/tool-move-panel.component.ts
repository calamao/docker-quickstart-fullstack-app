import { Component, EventEmitter, OnInit, Output } from '@angular/core';

export type MovementType = 'translate' | 'rotate';
export type Direction = 'increment' | 'decrement';
export type Axis = 'X' | 'Y' | 'Z';

export interface MoveAction {
  axis: Axis;
  moveType: MovementType;
  direction: Direction;
}

@Component({
  selector: 'app-tool-move-panel',
  templateUrl: './tool-move-panel.component.html',
  styleUrls: ['./tool-move-panel.component.scss']
})
export class ToolMovePanelComponent implements OnInit {
  // axis: Axis = 'X';
  moveType: MovementType = 'translate';

  @Output() moveAction = new EventEmitter<MoveAction>();

  constructor() { }

  ngOnInit(): void {
  }

  setMoveType(moveType: MovementType) {
    this.moveType = moveType;
  }

  move(direction: Direction, axis: Axis) {
    this.moveAction.next({
      axis,
      direction,
      moveType: this.moveType,
    });
  }

}
