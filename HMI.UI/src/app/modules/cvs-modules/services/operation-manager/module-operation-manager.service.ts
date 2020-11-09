import { generateDecimalNumbers, settimeoutPromise } from '@app/shared/utils/helper.functions';
import { Injectable } from '@angular/core';
import { Camera, MoveAction, NaturalFeature3DModel, NaturalFeatureTarget, Operation, OperationType, Step, StepType, TagTarget, TargetPose, TargetTool } from './operation-manager.model';
import { ModuleInfoService } from '../module-info/module-info.service';
import {image as harcodedBase64Image} from './fake-data';

const mockCamera: Camera = {
  FPS: 20,
  exposureTime: 2000,
  autoExposure: false,
  width: 1024,
  height: 800,
  offsetX: 0,
  offsetY: 300,
};

const getOperationId = (moduleId: string, id: string) => {
  return `${moduleId}-${id}`;
};

const getCameraId = (moduleId: string, operationId: string, cameraId: string) => {
  return `${moduleId}-${operationId}-${cameraId}`;
};

const getTargetId = (moduleId: string, id: string) => {
  return `${moduleId}-${id}`;
};

const getTargetPoseId = (moduleId: string, operationId: string) => {
  return `${moduleId}-${operationId}`;
};

const getTargetToolId = (moduleId: string, operationId: string) => {
  return `${moduleId}-${operationId}`;
};

const getStepId = (moduleId: string, operationId: string) => {
  return `${moduleId}-${operationId}`;
};

@Injectable()
export class ModuleOperationManagerService {

  private mockCamera: {[key: string]: Camera} = {
    'cvg-cvg-1-1': {
      ...mockCamera,
    },
    'cvg-cvg-1-3': {
      ...mockCamera,
    },
    'cvg-cvg-3-1': {
      ...mockCamera,
    },
  };

  private mockOperations: Operation[] = [
    {id: 'cvg-1', name: 'Operation 1', type: 'NaturalFeature'},
    {id: 'cvg-2', name: 'Operation 2', type: 'Tag'},
    {id: 'cvg-3', name: 'Operation 3', type: 'NaturalFeature'},
  ];

  private newOperationId = 4;

  private mockTarget: {[key: string]: TagTarget | NaturalFeatureTarget} = {};

  private mock3DModels: NaturalFeature3DModel[] = [
    {id: '1', name: '3D Model 1'},
    {id: '2', name: '3D Model 2'},
    {id: '3', name: '3D Model 3'},
  ];
  private mock3DModelId = 4;

  private mockTargetPoses: {[key: string]: TargetPose[]} = {};
  private mockTargetPoseId = 0;

  private mockSteps: {[key: string]: Step[]} = {};
  private mockStepTypes: StepType[] = [
    {id: '1', name: 'Approach 1'},
    {id: '2', name: 'Approach 2'},
    {id: '3', name: 'Approach 3'},
    {id: '4', name: 'Approach 4'},
    {id: '5', name: 'Approach 5'},
    {id: '6', name: 'Approach 6'},
    {id: '7', name: 'Approach 7'},
    {id: '8', name: 'Approach 8'},
    {id: '9', name: 'Approach 9'},
    {id: '10', name: 'Approach 10'},
  ];

  private mockTargetTool: {[key: string]: TargetTool} = {};

  constructor(
    private moduleInfoService: ModuleInfoService,
  ) {
    this.mockLoadTargetPoses();
    this.mockLoadSteps();
  }

  async getOperations(): Promise<Operation[]> {
    return this.mockOperations;
  }

  async deleteOperation(operationId: string): Promise<void> {
    this.mockOperations = this.mockOperations.filter(x => x.id !== operationId);
  }

  async addOperation(name: string, type: OperationType): Promise<string> {
    name = name.trim();
    if (this.mockOperations.find(x => x.name === name)) {
      throw Error('Sensor already exists');
    }
    const id = getOperationId(this.moduleInfoService.moduleId, (this.newOperationId++).toString());
    this.mockOperations.push({
      id,
      name,
      type,
    });

    return id;
  }

  async getCamera(operationId: string, sensorId: string): Promise<Camera> {
    return this.mockCamera[getCameraId(this.moduleInfoService.moduleId, operationId, sensorId)];
  }

  async saveCamera(operationId: string, sensorId: string, camera: Camera): Promise<void> {
    this.mockCamera[getCameraId(this.moduleInfoService.moduleId, operationId, sensorId)] = camera;
  }

  async autoExposure(operationId: string, sensorId: string): Promise<number> {
    return settimeoutPromise(() => 500, 4000);
  }

  async getTag(operationId: string): Promise<TagTarget> {
    return this.mockTarget[getTargetId(this.moduleInfoService.moduleId, operationId)] as TagTarget;
  }

  async saveTag(operationId: string, target: TagTarget): Promise<void> {
    this.mockTarget[getTargetId(this.moduleInfoService.moduleId, operationId)] = target;
  }

  async getNaturalFeature(operationId: string): Promise<NaturalFeatureTarget> {
    return this.mockTarget[getTargetId(this.moduleInfoService.moduleId, operationId)] as NaturalFeatureTarget;
  }

  async saveNaturalFeature(operationId: string, target: NaturalFeatureTarget): Promise<void> {
    this.mockTarget[getTargetId(this.moduleInfoService.moduleId, operationId)] = target;
  }

  async get3DModels(operationId: string): Promise<NaturalFeature3DModel[]> {
    return this.mock3DModels;
  }

  /** Returns the id string of the created model */
  async save3DModel(operationId: string, modelFile: File): Promise<string> {
    // mock model add
    return settimeoutPromise(() => {
      const modelId = (this.mock3DModelId++).toString();
      if (Number(modelId) % 2 === 1) {
        throw Error('generated error uploading file');
      }
      this.mock3DModels.push({
        id: modelId,
        name: `3D Model ${modelId}`,
      });
      return modelId;
    }, 4000);

  }

  private generateRandomPose() {
    const generateNumber = () => generateDecimalNumbers(2);
    const generatePose = (): TargetPose => {
      return {
        id: (this.mockTargetPoseId++).toString(),
        X: generateNumber(),
        Y: generateNumber(),
        Z: generateNumber(),
        Qw: generateNumber(),
        Qx: generateNumber(),
        Qy: generateNumber(),
        Qz: generateNumber(),
      };
    };
    return generatePose();
  }

  private mockLoadTargetPoses() {
    const poses: TargetPose[] = [];
    for (let index = 0; index < 10; index++) {
      poses.push(this.generateRandomPose());
    }

    this.mockTargetPoses[getTargetPoseId('cvg', '1')] = poses;
  }

  async getCurrentPose(): Promise<TargetPose> {
    return this.generateRandomPose();
  }

  async getTargetPoses(operationId: string): Promise<TargetPose[]> {
    return this.mockTargetPoses[getTargetPoseId(this.moduleInfoService.moduleId, operationId)];
  }

  async savePoses(operationId: string, poses: TargetPose[]): Promise<void> {
    this.mockTargetPoses[getTargetPoseId(this.moduleInfoService.moduleId, operationId)] = poses;
  }

  async getTargetTool(operationId: string): Promise<TargetTool> {
    return this.mockTargetTool[getTargetToolId(this.moduleInfoService.moduleId, operationId)];
  }

  async saveTargetTool(operationId: string): Promise<void> {
    // send command to save 'last changes' to the Module
  }

  async updateTargetTool(operationId: string, data: TargetTool): Promise<void> {
    this.mockTargetTool[getTargetToolId(this.moduleInfoService.moduleId, operationId)] = data;
  }

  async moveTarget(operationId: string, moveAction: MoveAction): Promise<void> {
    console.log('moveAction!', moveAction);
    // send to API!


  }

  private mockLoadSteps() {
    const steps: Step[] = [];
    let imageId = 0;
    const getStep = (stepData: Partial<Step>): Step => ({
      id: (imageId++).toString(),
      path: 'https://ivylab.space/assets/photo-1548625149-d37da68f9a7f.jpg',
      type: this.mockStepTypes[0].id,
      offsetX: 0,
      offsetY: 0,
      offsetZ: 0,
      ...stepData,
    });

    const images = [
      // { path: harcodedBase64Image},
      { path: 'https://ivylab.space/assets/photo-1548625149-d37da68f9a7f.jpg'},
      { path: 'https://ivylab.space/assets/photo-1489365091240-6a18fc761ec2.jpg'},
      { path: 'https://ivylab.space/assets/photo-1548625149-9129dad5eef7.jpg'},
      { path: 'https://ivylab.space/assets/photo-1534801022022-6e319a11f249.jpg'},
      { path: 'https://ivylab.space/assets/photo-1524324463413-57e3d8392df1.jpg'},

      { path: 'https://ivylab.space/assets/photo-1548625149-d37da68f9a7f.jpg'},
      { path: 'https://ivylab.space/assets/photo-1489365091240-6a18fc761ec2.jpg'},
      { path: 'https://ivylab.space/assets/photo-1548625149-9129dad5eef7.jpg'},
      { path: 'https://ivylab.space/assets/photo-1534801022022-6e319a11f249.jpg'},
      { path: 'https://ivylab.space/assets/photo-1524324463413-57e3d8392df1.jpg'},
    ];

    images.forEach(image => {
      steps.push(getStep({ path: image.path }));
    });

    this.mockSteps[getStepId('cvg', 'cvg-1')] = steps;
  }

  async getSteps(operationId: string): Promise<Step[]> {
    return settimeoutPromise(() => {
      const steps = this.mockSteps[getStepId(this.moduleInfoService.moduleId, operationId)] || [];
      // we return a copy of every step as we know the specific objects are being modified by the carousel component
      return steps.map(step => ({...step}));
    }, 100);
  }

  async getStepTypes(): Promise<StepType[]> {
    return this.mockStepTypes;
  }

  async saveSteps(operationId: string, steps: Step[]): Promise<void> {
    this.mockSteps[getStepId(this.moduleInfoService.moduleId, operationId)] = steps;
  }



}
