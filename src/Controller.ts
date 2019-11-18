import {Raycaster, Vector2, MeshBasicMaterial} from 'three';

import {Renderer} from './Renderer';
import {Board, Cell, Surface} from './Board';


export class Controller {
  renderer: Renderer;
  board: Board;
  raycaster: Raycaster;
  mouse: Vector2;
  cellSelector: Selector<Cell> = new Selector();
  surfaceSelector: Selector<Surface> = new Selector();

  constructor(renderer: Renderer, board: Board) {
    this.renderer = renderer;
    this.board = board;
    this.raycaster = new Raycaster();
    this.mouse = new Vector2();

    window.addEventListener('wheel', event => {
      this.renderer.scene.rotation.z += event.deltaX * Math.PI / 1000;
      this.renderer.scene.rotation.x += event.deltaY * Math.PI / 1000;
    });

    window.addEventListener('keydown', event => {
      console.log('key', event.key);
      // change camera
      if (event.key === 'c') {
        const index = (renderer.cameras.indexOf(renderer.camera) + 1) % renderer.cameras.length;
        renderer.camera = renderer.cameras[index];

      // new surface
      } else if (event.key === 'n') {
        if (this.cellSelector.value) {
          this.surfaceSelector.select(this.cellSelector.value.newSurface());
        }
      } else if (event.key === 'ArrowUp') {
        if (this.surfaceSelector.value) {
          this.surfaceSelector.value.addHeight(1);
        }
      } else if (event.key === 'ArrowDown') {
        if (this.surfaceSelector.value) {
          this.surfaceSelector.value.addHeight(-1);
        }
      }
    });

    window.addEventListener('mousedown', event => {
      this.mouse.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
      );
      this.raycaster.setFromCamera(this.mouse, this.renderer.camera);

      const selectedCell = this.cellSelector.value;
      if (selectedCell) {
        const intersectedSurface = this.raycaster.intersectObjects(selectedCell.asset.children)[0];
        if (intersectedSurface) {
          this.surfaceSelector.select(selectedCell.surfaces.find(surface => surface.asset === intersectedSurface.object));
          return;
        }
      }

      const intersector1 = this.raycaster.intersectObjects(this.board.asset.children)[0];
      // TODO (kyle): maybe my GameObjects should have their assets reference themselves?
      const nextSelectedCell = intersector1 ? this.board.cells.find(cell => cell.asset === intersector1.object): null;
      this.cellSelector.select(nextSelectedCell);
    });
  }
}


interface Selectable {
  select();
  deselect();
}

class Selector<V extends Selectable> {
  value: V | null;

  select(value: V | null) {
    if (this.value) {
      this.value.deselect();
    }
    value.select();
    this.value = value;
  }
}
