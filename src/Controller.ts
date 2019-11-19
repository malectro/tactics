import {Raycaster, Vector2, MeshBasicMaterial} from 'three';

import {GameAsset} from './GameObject';
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
      this.renderer.scene.rotation.y += event.deltaX * Math.PI / 1000;
      this.renderer.scene.rotation.x += event.deltaY * Math.PI / 1000;
    });

    window.addEventListener('keydown', event => {
      // change camera
      if (event.key === 'c') {
        const index = (renderer.cameras.indexOf(renderer.camera) + 1) % renderer.cameras.length;
        renderer.camera = renderer.cameras[index];

      // new surface
      } else if (event.key === 'n') {
        if (this.cellSelector.value) {
          this.surfaceSelector.select(this.cellSelector.value.newSurface());
        }

      } else if (event.key === 'Backspace') {
        event.preventDefault();
        const surface = this.surfaceSelector.value;
        if (surface) {
          this.cellSelector.value.removeSurface(surface);
        }

      // adjust surface position or size
      } else if (event.key === 'ArrowUp') {
        const surface = this.surfaceSelector.value;
        if (surface) {
          if (event.shiftKey) {
            surface.addHeight(1);
          } else {
            surface.move(1);
          }
        }
      } else if (event.key === 'ArrowDown') {
        const surface = this.surfaceSelector.value;
        if (surface) {
          if (event.shiftKey) {
            surface.addHeight(-1);
          } else {
            surface.move(-1);
          }
        }

      // save
      } else if (event.key === 's') {
        localStorage.board = JSON.stringify(this.board, null, '  ');
        console.log('board', localStorage.board);

      // load
      } else if (event.key === 'l') {
        this.renderer.scene.remove(this.board.asset);
        this.board = Board.fromJSON(JSON.parse(localStorage.board));
        this.renderer.scene.add(this.board.asset);
      }
    });

    window.addEventListener('pointerdown', event => {
      this.mouse.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
      );
      this.raycaster.setFromCamera(this.mouse, this.renderer.camera);

      const cellsAndSurfaces = this.board.asset.children.map(cell => [cell].concat(cell.children)).flat();
      const intersectors = this.raycaster.intersectObjects(cellsAndSurfaces);
      if (intersectors.length > 0) {
        const intersector1 = intersectors[0];
        const gameObject = (intersector1.object as GameAsset).gameObject;
        if (gameObject instanceof Surface) {
          this.surfaceSelector.select(gameObject);
          this.cellSelector.select(gameObject.parent);
        } else if (gameObject instanceof Cell) {
          this.surfaceSelector.select(null);
          this.cellSelector.select(gameObject);
        }
      }
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
    if (value !== null) {
      value.select();
    }
    this.value = value;
  }
}
