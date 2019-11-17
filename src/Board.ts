import {
  Group,
  Mesh,
  Object3D,
  BoxBufferGeometry,
  MeshBasicMaterial,
} from 'three';

import {Sized, Size} from './vector2d';
import {GameObject} from './GameObject';
import {range} from './utils/iterators';

export class Board implements Sized, GameObject {
  size: Size;
  cells: Cell[];
  asset: Group;

  constructor(size: Size) {
    this.asset = new Group();
    this.size = {x: size.x, y: size.y};
    this.cells = Array(size.x * size.y)
      .fill(0)
      .map(() => new Cell());

    for (const x of range(size.x)) {
      for (const y of range(size.y)) {
        const cell = this.cells[x * size.y + y];

        this.asset.add(cell.asset);
        cell.asset.position.set(
          (x - size.x / 2) * Cell.size,
          (y - size.y / 2) * Cell.size,
          0,
        );
      }
    }
  }
}

export class Cell implements GameObject {
  static size = 10;
  surfaces: Surface[] = [];
  asset: Mesh = new Mesh(boxGeometry, grayMaterial);

  clear() {
    this.surfaces = [];
    const parent = this.asset.parent;
    parent.remove(this.asset);
    const newMesh = new Mesh(boxGeometry, grayMaterial);
    newMesh.position = this.asset.position;
    this.asset = newMesh;
    parent.add(newMesh);
  }

  select() {
    this.asset.material = selectedMaterial;
  }

  deselect() {
    this.asset.material = grayMaterial;
  }
}

class Surface implements GameObject {
  height: number = 0;
  asset: Mesh = new Mesh(boxGeometry, grayMaterial);
}

const boxGeometry = new BoxBufferGeometry(
  Cell.size - 1,
  Cell.size - 1,
  Cell.size - 1,
);
const grayMaterial = new MeshBasicMaterial({color: 0x555555});
const clearMaterial = new MeshBasicMaterial({color: 0x000000, opacity: 0.0});
const selectedMaterial = new MeshBasicMaterial({color: 0x999999});
