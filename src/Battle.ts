import {Board, Surface} from './Board';
import {Soldier} from './Character';


export class Battle {
  soldiers: Set<Soldier> = new Set();

  constructor(public board: Board) {}

  placeSoldier(soldier: Soldier, surface: Surface) {
    this.soldiers.add(soldier);
    surface.soldier = soldier;
    soldier.surface = surface;
    soldier.asset.position.set(
      surface.parent.asset.position.x,
      surface.asset.position.y + 10,
      surface.parent.asset.position.z,
    );
    this.board.asset.add(soldier.asset);
  }
}