import {Raycaster, Vector2, MeshBasicMaterial} from 'three';

import {Controller} from './Controller';
import {GameAsset} from '../GameObject';
import {Renderer} from '../Renderer';
import {Board, Cell, Surface} from '../Board';
import {Battle} from '../Battle';
import {Soldier} from '../Character';
import {Selector} from '../utils/Selector';


export class BattleControllerAdapter {
  constructor(private controller: BattleController) {}

  setUp() {
    window.addEventListener('pointerdown', event => {
      this.controller.selectObject(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
      );
    });
  }

  cleanUp() {}
}

export class BattleController implements Controller {
  raycaster: Raycaster = new Raycaster();
  mouse: Vector2 = new Vector2();

  soldierSelector: Selector<Soldier> = new Selector();
  surfaceSelector: Selector<Surface> = new Selector();

  constructor(public renderer: Renderer, public battle: Battle) {}

  selectObject(x: number, y: number) {
    this.mouse.set(x, y);
    this.raycaster.setFromCamera(this.mouse, this.renderer.camera);

    const soldiersAndSurfaces = Array.from(this.battle.getSelectableAssets());
    const intersectors = this.raycaster.intersectObjects(soldiersAndSurfaces);

    if (intersectors.length > 0) {
      const intersector1 = intersectors[0];
      const gameObject = (intersector1.object as GameAsset).gameObject;
      if (gameObject instanceof Surface) {
        this.surfaceSelector.select(gameObject);
      } else if (gameObject instanceof Soldier) {
        this.soldierSelector.select(gameObject);
      }
    }
  }
}
