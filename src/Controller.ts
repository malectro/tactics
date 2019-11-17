import {Raycaster, Vector2, MeshBasicMaterial} from 'three';

import {Renderer} from './Renderer';
import {Board, Cell} from './Board';


export class Controller {
  renderer: Renderer;
  board: Board;
  raycaster: Raycaster;
  mouse: Vector2;
  selectedCell: Cell | null;

  constructor(renderer: Renderer, board: Board) {
    this.renderer = renderer;
    this.board = board;
    this.raycaster = new Raycaster();
    this.mouse = new Vector2();
    this.selectedCell = null;

    window.addEventListener('wheel', event => {
      this.renderer.scene.rotation.z += event.deltaX * Math.PI / 1000;
      this.renderer.scene.rotation.x += event.deltaY * Math.PI / 1000;
    });

    window.addEventListener('keydown', event => {
      if (event.key === 'c') {
        const index = (renderer.cameras.indexOf(renderer.camera) + 1) % renderer.cameras.length;
        renderer.camera = renderer.cameras[index];
      }
    });

    window.addEventListener('mousedown', event => {
      this.mouse.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
      );
      this.raycaster.setFromCamera(this.mouse, this.renderer.camera);
      const intersector1 = this.raycaster.intersectObjects(this.board.asset.children)[0];
      // TODO (kyle): maybe my GameObjects should have their assets reference themselves?
      const selectedCell = intersector1 ? this.board.cells.find(cell => cell.asset === intersector1.object): null;
      if (selectedCell) {
        if (this.selectedCell) {
          this.selectedCell.deselect();
        }
        if (selectedCell === this.selectedCell) {
          this.selectedCell = null;
        } else {
          selectedCell.select();
          this.selectedCell = selectedCell;
        }
      }
      console.log('cell', this.selectedCell);

    });
  }
}

const selectedMaterial = new MeshBasicMaterial({color: 0x999999});
