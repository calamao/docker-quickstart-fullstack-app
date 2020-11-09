export interface Operation {
  id: string;
  name: string;
  type: OperationType;
}

export type OperationType = 'NaturalFeature' | 'Tag';

export interface Camera {
  FPS: number;
  exposureTime: number;
  autoExposure: boolean;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
}

export interface TagTarget {
  id: number;
  tagSize: number;
}

export interface NaturalFeatureTarget {
  threeDModelId: string;
  minInlierRatioInit: number;
  minInlierRatioTraking: number;
  lineSearchLenghtInitRelative: number;
}

export interface NaturalFeature3DModel {
  id: string;
  name: string;
}

export interface TargetPose {
  id: string;
  X: number;
  Y: number;
  Z: number;
  Qw: number;
  Qx: number;
  Qy: number;
  Qz: number;
}

export interface TargetTool {
  minInlierRatio: number;
  lineSearchLength: number;
  tryMatching: boolean;
}

export type MovementType = 'translate' | 'rotate';
export type Direction = 'increment' | 'decrement';
export type Axis = 'X' | 'Y' | 'Z';
export interface MoveAction {
  axis: Axis;
  moveType: MovementType;
  direction: Direction;
}

export interface Step {
  id?: string;
  path: string;
  data?: string;
  isNew?: boolean;
  type: string;
  offsetX: number;
  offsetY: number;
  offsetZ: number;
}

export interface StepType {
  id: string;
  name: string;
}


