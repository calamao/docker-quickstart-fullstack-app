export interface MainConfiguration {
  label: string;
  IP: string;
  ABBSerialNumber: string;
  serialNumber: string;
  fx: number;
  fy: number;
  Cx: number;
  Cy: number;
  K1: number;
  K2: number;
  K3: number;
  K4: number;
  K5: number;
  width: number;
  height: number;
}

export interface ExtrinsicCalibration {
  X: number;
  Y: number;
  Z: number;
  Qw: number;
  Qx: number;
  Qy: number;
  Qz: number;
}

export interface Sensor {
  id: string;
  name: string;
  state: 'normal' | 'disabled' | 'error';
}

export interface SensorCalibration {
  exposureTime: number;
  chessboardWidth: number;
  chessboardHeight: number;
  squareSize: number;
}

