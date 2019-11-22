import {Raycaster, Vector2} from 'three';

import {Renderer} from '../Renderer';
import {Board} from '../Board';


export interface Controller {
  renderer: Renderer;
  board: Board;
  raycaster: Raycaster;
  mouse: Vector2;
}
