import {Raycaster, Vector2, MeshBasicMaterial} from 'three';

import {Controller, ControllerAdapter} from './Controller';
import {GameAsset} from '../GameObject';
import {Renderer} from '../Renderer';
import {Board, Cell, Surface} from '../Board';
import {Selector} from '../utils/Selector';


export class BoardDesignerControllerAdapter implements ControllerAdapter {
  constructor(private controller: BoardDesignerController) {}

  setUp() {
    const {controller} = this;
    const keys = {
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

  cleanUp() {
    // TODO (kyle): implement
  }
}

export class BoardDesignerController implements Controller {
  raycaster: Raycaster = new Raycaster();
  mouse: Vector2 = new Vector2();

  cellSelector: Selector<Cell> = new Selector();
  surfaceSelector: Selector<Surface> = new Selector();

  constructor(public renderer: Renderer, public board: Board) {}

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
