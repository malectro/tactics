import {GameAsset} from './GameObject';
import {Board, Surface} from './Board';
import {Soldier} from './Character';

export class Battle {
  soldiers: Set<Soldier> = new Set();

  constructor(public board: Board) {}

  placeSoldier(soldier: Soldier, surface: Surface) {
    this.soldiers.add(soldier);
    surface.soldier = soldier;
    soldier.surface = surface;
    soldier.alignToSurface(surface);
    this.board.asset.add(soldier.asset);
  }

  moveSoldier(soldier: Soldier, surface: Surface) {
    soldier.surface.soldier = null;
    soldier.surface = surface;
    surface.soldier = soldier;
    soldier.alignToSurface(surface);
  }

  *getSelectableAssets(): IterableIterator<GameAsset> {
    for (const surface of this.board.getSurfaces()) {
      yield surface.asset;
    }
    for (const soldier of this.soldiers) {
      yield soldier.asset;
    }
  }
}
