import {
  Group,
  Mesh,
  Object3D,
  Geometry,
  BoxGeometry,
  BoxBufferGeometry,
  MeshBasicMaterial,
  MeshNormalMaterial,
  MeshDepthMaterial,
} from 'three';

import {Sized, Size} from './vector2d';
import {GameObject, GameMesh, GameGroup} from './GameObject';
import {range} from './utils/iterators';
import {Soldier} from './Character';

interface BoardJSON {
  cells: CellJSON[][];
}

export class Board implements Sized, GameObject {
  size: Size = {x: 0, y: 0};
  cells: Cell[] = [];
  asset: GameGroup = new GameGroup(this);

  static createBlank(size: Size): Board {
    const board = new Board();

    board.size = {x: size.x, y: size.y};
    board.cells = Array(size.x * size.y)
      .fill(0)
      .map(() => new Cell());
    board.positionCells();

    return board;
  }

  static fromJSON(json: BoardJSON): Board {
    const size = {
      x: json.cells.length,
      y: json.cells[0].length,
    };

    const board = new Board();
    board.size = size;

    console.log('json', json);

    for (const row of json.cells) {
      for (const cell of row) {
        board.cells.push(Cell.fromJSON(cell));
      }
    }

    board.positionCells();

    return board;
  }

  toJSON(): BoardJSON {
    const cells = [];
    for (const x of range(this.size.x)) {
      cells.push(this.cells.slice(x * this.size.y, (x + 1) * this.size.y));
    }
    return {
      cells,
    };
  }

  positionCells() {
    const size = this.size;
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

  *getSurfaces(): IterableIterator<Surface> {
    for (const cell of this.cells) {
      yield* cell.surfaces;
    }
  }

  getRandomEmptySurface() {
    const randomCells = this.cells.slice().sort(() => Math.random() - 0.5);
    for (const cell of randomCells) {
      const randomSurfaces = cell.surfaces
        .slice()
        .sort(() => Math.random() - 0.5);
      for (const surface of randomSurfaces) {
        if (!surface.soldier) {
          return surface;
        }
      }
    }
  }
}

interface CellJSON {
  surfaces: SurfaceJSON[];
}

export class Cell implements GameObject {
  static size = 10;
  static zeroMaterial = new MeshBasicMaterial({
    color: 0x000000,
    opacity: 0.5,
    transparent: true,
  });
  static selectedMaterial = new MeshBasicMaterial({
    color: 0x333333,
    opacity: 0.5,
    transparent: true,
  });

  surfaces: Surface[] = [];
  asset: GameMesh = new GameMesh(this, boxGeometry, Cell.zeroMaterial);

  static fromJSON(json: CellJSON): Cell {
    const cell = new Cell();
    for (const surface of json.surfaces) {
      cell.addSurface(Surface.fromJSON(surface));
    }
    return cell;
  }

  toJSON(): CellJSON {
    return {
      surfaces: this.surfaces,
    };
  }

  clear() {
    this.surfaces = [];
    const parent = this.asset.parent;
    parent.remove(this.asset);
    const newMesh = new GameMesh(this, boxGeometry, Cell.zeroMaterial);
    newMesh.position = this.asset.position;
    this.asset = newMesh;
    parent.add(newMesh);
  }

  select() {
    this.asset.material = Cell.selectedMaterial;
  }

  deselect() {
    this.asset.material = Cell.zeroMaterial;
  }

  addSurface(surface: Surface) {
    if (surface.parent) {
      throw new Error('Cannot add a surface that has a parent.');
    }

    surface.parent = this;
    this.surfaces.push(surface);
    this.asset.add(surface.asset);
    //this.asset.material = clearMaterial;
  }

  newSurface(): Surface {
    const newSurface = new Surface();
    this.addSurface(newSurface);
    return newSurface;
  }

  removeSurface(surface: Surface): Surface {
    this.surfaces = this.surfaces.filter(s => s !== surface);
    this.asset.remove(surface.asset);
    return surface;
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
  static defaultMaterial = new MeshNormalMaterial();
  static selectedMaterial = new MeshNormalMaterial({wireframe: true});

  parent: Cell;
  top: number = 0; // TODO (kyle): make this accurate or make it `height`
  bottom: number = -Cell.size / 2 / Surface.heightUnit;
  asset: GameMesh = new GameMesh(
    this,
    new BoxGeometry(Cell.size, Cell.size, Cell.size),
    Surface.defaultMaterial,
  );

  soldier: Soldier;

  static fromJSON(json: SurfaceJSON): Surface {
    const surface = new Surface();
    surface.setTop(json.top);
    surface.setPosition(json.bottom);
    return surface;
  }

  toJSON(): SurfaceJSON {
    return {
      top: this.top,
      bottom: this.bottom,
    };
  }

  select() {
    this.asset.material = Surface.selectedMaterial;
  }

  deselect() {
    this.asset.material = Surface.defaultMaterial;
  }

  setTop(top: number) {
    this.top = top;
    const geometry = this.asset.geometry as Geometry;
    const vertices = geometry.vertices;
    for (const index of [0, 1, 4, 5]) {
      vertices[index].y = (top - this.bottom) * Surface.heightUnit - Cell.size / 2;
    }
    geometry.verticesNeedUpdate = true;
  }

  getHeight(): number {
    return this.top - this.bottom;
  }

  addHeight(height: number) {
    this.setTop(this.top + height);
  }

  setPosition(y: number) {
    const delta = y - this.bottom;
    this.bottom = y;
    this.asset.position.y = this.bottom * Surface.heightUnit + Cell.size / 2;
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
