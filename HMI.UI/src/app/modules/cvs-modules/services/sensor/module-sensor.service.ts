import { settimeoutPromise } from '@app/shared/utils/helper.functions';
import { Injectable } from '@angular/core';
import { ExtrinsicCalibration, MainConfiguration, Sensor, SensorCalibration } from './sensor.model';
import { ModuleInfoService } from '../module-info/module-info.service';

const mockMainConfiguration: MainConfiguration = {
  label: 'MainConfiguration',
  IP: '10.0.0.1',
  ABBSerialNumber: '123456',
  serialNumber: '',
  fx: 0.001,
  fy: 0.001,
  Cx: 0.001,
  Cy: 0.001,
  K1: 0.001,
  K2: 0.001,
  K3: 0.001,
  K4: 0.001,
  K5: 0.001,
  width: 1024,
  height: 800,
};

const getSensorId = (moduleId: string, id: string) => {
  return `${moduleId}-${id}`;
};

const getMainConfigId = (moduleId: string, sensorId: string) => {
  return `${moduleId}-${sensorId}`;
};

const getExtrinsicCalibrationId = (moduleId: string, sensorId: string) => {
  return `${moduleId}-${sensorId}`;
};

const getCalibrationId = (moduleId: string, sensorId: string) => {
  return `${moduleId}-${sensorId}`;
};

@Injectable()
export class ModuleSensorService {
  private mockMainConfiguration: {[key: string]: MainConfiguration} = {
    'cvg-cvg-1': {
      ...mockMainConfiguration,
      label: 'Camera 1',
    },
    'cvg-cvg-3': {
      ...mockMainConfiguration,
      label: 'Camera 3',
    },
  };
  private newSensorId = 4;


  private mockSensors: Sensor[] = [
    {id: 'cvg-1', name: 'Camera 1', state: 'normal'},
    {id: 'cvg-2', name: 'Camera 2', state: 'disabled'},
    {id: 'cvg-3', name: 'Camera 3', state: 'error'},
  ];

  private mockExtrinsicCalibration: {[key: string]: ExtrinsicCalibration} = {};
  private mockCheckCalibration: {[key: string]: SensorCalibration} = {};


  constructor(
    private moduleInfoService: ModuleInfoService,
  ) {}

  async getMainConfiguration(sensorId: string): Promise<MainConfiguration> {
    return this.mockMainConfiguration[getMainConfigId(this.moduleInfoService.moduleId, sensorId)];
  }

  async saveMainConfiguration(sensorId: string, config: MainConfiguration): Promise<void> {
    this.mockMainConfiguration[getMainConfigId(this.moduleInfoService.moduleId, sensorId)] = config;
  }

  async getExtrinsicCalibration(sensorId: string): Promise<ExtrinsicCalibration> {
    return this.mockExtrinsicCalibration[getExtrinsicCalibrationId(this.moduleInfoService.moduleId, sensorId)];
  }

  async saveExtrinsicCalibration(sensorId: string, config: ExtrinsicCalibration): Promise<void> {
    this.mockExtrinsicCalibration[getExtrinsicCalibrationId(this.moduleInfoService.moduleId, sensorId)] = config;
  }

  async getSensors(): Promise<Sensor[]> {
    return this.mockSensors.filter(sensor => sensor.id.startsWith(this.moduleInfoService.moduleId));
  }

  async deleteSensor(sensorId: string): Promise<void> {
    this.mockSensors = this.mockSensors.filter(x => x.id !== sensorId);
  }

  async addSensor(name: string): Promise<string> {
    name = name.trim();
    if (this.mockSensors.find(x => x.name === name)) {
      throw Error('Sensor already exists');
    }
    const id = getSensorId(this.moduleInfoService.moduleId, (this.newSensorId++).toString());
    this.mockSensors.push({
      id,
      name,
      state: 'normal',
    });

    return id;
  }

  async getReference(sensorId: string): Promise<SensorCalibration> {
    return this.mockCheckCalibration[getCalibrationId(this.moduleInfoService.moduleId, sensorId)];
  }

  async clearReference(sensorId: string): Promise<void> {
    // the reference should be cleared in the API
    this.mockCheckCalibration[getCalibrationId(this.moduleInfoService.moduleId, sensorId)] = undefined;
  }

  async recalculateReference(sensorId: string): Promise<void> {
    // the reference should be cleared in the API
  }

  private mockSetReferenceFailure = true;
  async setReference(sensorId: string, calibration: SensorCalibration): Promise<void> {

    return settimeoutPromise(() => {
      this.mockSetReferenceFailure = !this.mockSetReferenceFailure;
      if (this.mockSetReferenceFailure) {
        throw Error('No reference get');
      }

      this.mockCheckCalibration[getCalibrationId(this.moduleInfoService.moduleId, sensorId)] = calibration;

      // return {
      //   chessboardHeight: 7,
      //   chessboardWidth: 10,
      //   exposureTime: 2000,
      //   squareSize: 0.02,
      // };
    }, 2000);
  }

  private mockRecalculation = false;
  private mockCheckCalibrationFailure = -1;
  async checkCalibration(sensorId: string, calibration: SensorCalibration): Promise<{recalculateNeeded: boolean}> {

    return settimeoutPromise(() => {
      this.mockCheckCalibrationFailure = (this.mockCheckCalibrationFailure + 1) % 3;
      if (this.mockCheckCalibrationFailure === 1) {
        throw {type: 'error', message: 'No detecting calibration tool'};
      }
      if (this.mockCheckCalibrationFailure === 2) {
        throw {type: 'warn', message: 'Not good enough calibration'};
      }

      this.mockRecalculation = !this.mockRecalculation;
      return {
        recalculateNeeded: this.mockRecalculation,
      };

    }, 2000);
  }

}
