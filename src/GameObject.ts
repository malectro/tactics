import {Object3D, Mesh, Group} from 'three';


export interface GameObject {
  asset: GameAsset;
}

export interface GameAsset extends Object3D {
  gameObject: GameObject;
}

export class GameMesh extends Mesh implements GameAsset {
  gameObject: GameObject;

  constructor(gameObject: GameObject, ...rest) {
    super(...rest);

    this.gameObject = gameObject;
  }
}

export class GameGroup extends Group implements GameAsset {
  gameObject: GameObject;

  constructor(gameObject: GameObject) {
    super();

    this.gameObject = gameObject;
  }
}
