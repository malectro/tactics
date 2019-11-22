import {Raycaster, Vector2} from 'three';

import {Renderer} from '../Renderer';
import {Board} from '../Board';


export interface Controller {
  renderer: Renderer;
  board: Board;
  raycaster: Raycaster;
  mouse: Vector2;
}

export interface ControllerAdapter {
  setUp: () => unknown;
  cleanUp: () => unknown;
}

export class ControllerManager {
  controllers: Set<ControllerAdapter> = new Set()

  add(adapter: ControllerAdapter) {
    this.controllers.add(adapter);
    adapter.setUp();
  }

  remove(adapter: ControllerAdapter) {
    this.controllers.delete(adapter);
    adapter.cleanUp();
  }

  removeAll() {
    for (const adapter of this.controllers) {
      this.remove(adapter);
    }
  }
}
