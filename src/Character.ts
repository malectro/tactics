import {MeshNormalMaterial, BoxBufferGeometry} from 'three';

import {Vector2d} from './vector2d';
import {GameObject, GameMesh} from './GameObject';
import {Surface} from './Board';


interface CharacterData {
  id?: string;
  name: string;
  experience: number;
  strength: number;
  speed: number;
  wisdom: number;
}

export class Character implements CharacterData {
  id: string;
  name: string;

  // stats
  experience: number;
  strength: number;
  speed: number;
  wisdom: number;

  constructor(props: CharacterData) {
    return Object.assign(this, props);
  }

  getLevel() {
    // TODO (kyle): could go logarithmic here
    return 1 + Math.floor(this.experience / 100);
  }

  getMaxHp() {
    return this.strength * 50 + this.experience / 10;
  }
}

export class Soldier implements GameObject {
  static selectedMaterial = new MeshNormalMaterial({wireframe: true});
  static material = new MeshNormalMaterial();
  static geometry = new BoxBufferGeometry(2, 2, 2);

  asset: GameMesh = new GameMesh(this, Soldier.geometry, Soldier.material);
  character: Character;

  hp: number;
  mp: number;
  stamina: number;

  surface: Surface;

  constructor(character: Character) {
    this.character = character;
    this.hp = character.getMaxHp();
  }

  select() {
    this.asset.material = Soldier.selectedMaterial;
  }

  deselect() {
    this.asset.material = Soldier.material;
  }
}
