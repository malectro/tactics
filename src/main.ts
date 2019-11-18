import {Board} from './Board';
import {Controller} from './Controller';
import {Renderer} from './Renderer'


const renderer = new Renderer();
const board = new Board({x: 10, y: 10});

const controller = new Controller(renderer, board);


renderer.scene.add(board.asset);

document.body.appendChild(renderer.webglRenderer.domElement);
renderer.animate();
