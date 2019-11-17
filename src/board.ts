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
          x * Cell.size - size.x / 2,
          y * Cell.size - size.y / 2,
          0,
        );
      }
    }
  }
}

class Cell implements GameObject {
  static size = 1;
  surfaces: Surface[] = [];
  asset: Object3D = new Mesh(boxGeometry, grayMaterial);
}

class Surface implements GameObject {
  height: number = 0;
  asset: Mesh = new Mesh(boxGeometry, grayMaterial);
}

const boxGeometry = new BoxBufferGeometry(Cell.size, Cell.size, Cell.size);
const grayMaterial = new MeshBasicMaterial({color: 0x555555});
