import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
// import * as modelViewer from '@google/model-viewer';
import '@google/model-viewer';
import { interval } from 'rxjs';
import { throttle } from 'rxjs/operators';

export interface ModelViewerCameraOrbit {
  phi: number;
  radius: number;
  theta: number;
}


/**
 * Initial Orbit:
 * {theta: 0, phi: 0, radius: 1}
 */
@Component({
  selector: 'app-model-viewer',
  templateUrl: './model-viewer.component.html',
  styleUrls: ['./model-viewer.component.scss'],
})
export class ModelViewerComponent implements OnInit {

  @Output() cameraChange$ = new EventEmitter<ModelViewerCameraOrbit>();
  @Output() cameraChangeThrottled$ = this.cameraChange$.pipe(
    throttle(ev => interval(this.throttleTime)),
  );

  @Input() throttleTime = 1000;

  constructor() {
    // this.loadScript();
  }

  ngOnInit(): void {
    const modelViewerElement = document.querySelector('#model-viewer-id');
    modelViewerElement.addEventListener('camera-change', (e: CustomEvent) => this.cameraChange(modelViewerElement, e));

    // emit initial orbit
    this.cameraChange$.next((modelViewerElement as any).getCameraOrbit());
  }

  private cameraChange(modelViewerElement: Element, e: CustomEvent) {
    // console.log('cameraChange', e);
    if (e.detail.source === 'user-interaction') {
      const cameraOrbit: ModelViewerCameraOrbit = (modelViewerElement as any).getCameraOrbit();
      this.cameraChange$.next(cameraOrbit);
    }
  }

  private loadScript() {
    const url = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    console.log('preparing to load...');
    const node = document.createElement('script');
    node.src = url;
    // node.type = 'text/javascript';
    node.type = 'module';
    node.async = true;
    // node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
}

}
