import {
  Group,
  Mesh,
  Object3D,
  Geometry,
  BoxGeometry,
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
          0,
          (y - size.y / 2) * Cell.size,
        );
      }
    }
  }
}

export class Cell implements GameObject {
  static size = 10;
  static zeroMaterial = new MeshBasicMaterial({color: 0x000000, opacity: 0.5, transparent: true});
  static selectedMaterial = new MeshBasicMaterial({color: 0x333333, opacity: 0.5, transparent: true});

  surfaces: Surface[] = [];
  asset: Mesh = new Mesh(boxGeometry, Cell.zeroMaterial);

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
    if (!this.hasSurfaces()) {
      this.asset.material = Cell.selectedMaterial;
    }
  }

  deselect() {
    if (!this.hasSurfaces()) {
      this.asset.material = Cell.zeroMaterial;
    }
  }

  newSurface(): Surface {
    const newSurface = new Surface();
    this.surfaces.push(
      newSurface,
    );
    this.asset.add(newSurface.asset);
    this.asset.material = clearMaterial;
    return newSurface;
  }

  hasSurfaces(): boolean {
    return this.surfaces.length > 0;
  }
}

interface SurfaceJSON {
  top: number;
  bottom: number;
}

export class Surface implements GameObject {
  static heightUnit = 1;

  top: number = 0;
  bottom: number = -Cell.size;
  asset: Mesh = new Mesh(new BoxGeometry(
    Cell.size, Cell.size, Cell.size,
  ), grayMaterial);

  static fromJSON(json: SurfaceJSON) {
    const surface = new Surface();
  }

  toJSON(): SurfaceJSON {
    return {
      top: this.top,
      bottom: this.bottom,
    };
  }

  select() {
    this.asset.material = selectedMaterial;
  }

  deselect() {
    this.asset.material = grayMaterial;
  }

  setTop(top: number) {
    this.top = top;
    const geometry = (this.asset.geometry as Geometry);
    const vertices = geometry.vertices;
    for (const index of [0, 1, 4, 5]) {
      vertices[index].y = Cell.size / 2 + top * Surface.heightUnit;
    }
    geometry.verticesNeedUpdate = true;
  }

  addHeight(height: number) {
    this.setTop(this.top + height);
  }

  setPosition(y: number) {
    const delta = y - this.bottom;
    this.bottom = y;
    this.asset.position.y += delta * Surface.heightUnit;
  }

  move(y: number) {
    this.setPosition(this.bottom + y);
  }
}

const boxGeometry = new BoxBufferGeometry(
  Cell.size - 1,
  Cell.size - 1,
  Cell.size - 1,
);
const blackMaterial = new MeshBasicMaterial({color: 0x000000});
const grayMaterial = new MeshBasicMaterial({color: 0x555555});
const clearMaterial = new MeshBasicMaterial({color: 0x000000, visible: false});
const selectedMaterial = new MeshBasicMaterial({color: 0x999999});
