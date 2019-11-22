import {Raycaster, Vector2, MeshBasicMaterial} from 'three';

import {GameAsset} from './GameObject';
import {Renderer} from './Renderer';
import {Board, Cell, Surface} from './Board';

interface Controller {
  renderer: Renderer;
  board: Board;
  raycaster: Raycaster;
  mouse: Vector2;
}

export class BoardDesignerControllerAdapter {
  constructor(private controller: BoardDesignerController) {}

  setUp() {
    window.addEventListener('wheel', event => {
      this.controller.rotateScene(event.deltaX, event.deltaY);
    });

    const {controller} = this;
    const keys = {
      c: 'changeCamera',
      n: 'addSurface',
      Backspace: 'removeSurface',
      'ArrowUp+shiftKey': 'incrementSurfacexHeight',
      'ArrowDown+shiftKey': 'decrementSurfaceHeight',
      ArrowUp: 'moveSurfaceUp',
      ArrowDown: 'moveSurfaceDown',
      s: 'save',
      l: 'load',
    };

    window.addEventListener('keydown', event => {
      // TODO (kyle): this is a ridic amount of work to do on keypress
      const modifiers = ['shiftKey', 'ctrlKey', 'altKey', 'metaKey']
        .filter(modifier => event[modifier])
        .join('+');
      let key = event.key;
      if (modifiers !== '') {
        key += '+' + modifiers;
      }

      const handlerName = keys[key];
      if (handlerName) {
        event.preventDefault();
        this.controller[handlerName]();
      }
    });

    window.addEventListener('pointerdown', event => {
      this.controller.selectObject(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
      );
    });
  }
}

export class BoardDesignerController implements Controller {
  raycaster: Raycaster = new Raycaster();
  mouse: Vector2 = new Vector2();

  cellSelector: Selector<Cell> = new Selector();
  surfaceSelector: Selector<Surface> = new Selector();

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

  addSurface() {
    if (this.cellSelector.value) {
      this.surfaceSelector.select(this.cellSelector.value.newSurface());
    }
  }

  removeSurface() {
    const surface = this.surfaceSelector.value;
    if (surface) {
      this.cellSelector.value.removeSurface(surface);
    }
  }

  incrementSurfaceHeight() {
    const surface = this.surfaceSelector.value;
    if (surface) {
      surface.addHeight(1);
    }
  }

  decrementSurfaceHeight() {
    const surface = this.surfaceSelector.value;
    if (surface) {
      surface.addHeight(-1);
    }
  }

  moveSurfaceUp() {
    const surface = this.surfaceSelector.value;
    if (surface) {
      surface.move(1);
    }
  }

  moveSurfaceDown() {
    const surface = this.surfaceSelector.value;
    if (surface) {
      surface.move(-1);
    }
  }

  save() {
    localStorage.board = JSON.stringify(this.board, null, '  ');
  }

  load() {
    this.renderer.scene.remove(this.board.asset);
    this.board = Board.fromJSON(JSON.parse(localStorage.board));
    this.renderer.scene.add(this.board.asset);
  }

  selectObject(x: number, y: number) {
    this.mouse.set(x, y);
    this.raycaster.setFromCamera(this.mouse, this.renderer.camera);

    const cellsAndSurfaces = this.board.asset.children
      .map(cell => [cell].concat(cell.children))
      .flat();
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
