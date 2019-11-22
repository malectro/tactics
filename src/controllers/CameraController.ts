import {Raycaster, Vector2, MeshBasicMaterial} from 'three';

import {Controller} from './Controller';
import {GameAsset} from '../GameObject';
import {Renderer} from '../Renderer';
import {Board, Cell, Surface} from '../Board';


export class CameraControllerAdapter {
  private cleaner: () => unknown | null = null;

  constructor(private controller: CameraController) {}

  setUp() {
    const handlers = {
      wheel: event => {
        this.controller.rotateScene(event.deltaX, event.deltaY);
      },
      keydown: event => {
        if (event.key === 'c') {
          this.controller.changeCamera();
        }
      },
    };

    for (const [event, handler] of Object.entries(handlers)) {
      window.addEventListener(event, handler);
    }

    this.cleaner = () => {
      for (const [event, handler] of Object.entries(handlers)) {
        window.removeEventListener(event, handler);
      }
    };
  }

  cleanUp() {
    if (this.cleaner) {
      this.cleaner();
      this.cleaner = null;
    }
  }
}

export class CameraController implements Controller {
  raycaster: Raycaster = new Raycaster();
  mouse: Vector2 = new Vector2();

  constructor(public renderer: Renderer, public board: Board) {}

  rotateScene(x: number, y: number) {
    this.renderer.scene.rotation.y += (x * Math.PI) / 1000;
    this.renderer.scene.rotation.x += (y * Math.PI) / 1000;
  }

  changeCamera() {
    const {renderer} = this;
    const index =
      (renderer.cameras.indexOf(renderer.camera) + 1) % renderer.cameras.length;
    renderer.camera = renderer.cameras[index];
  }
}
