import {Scene, OrthographicCamera, WebGLRenderer} from 'three';

import {Board} from './board';


const halfWidth = window.innerWidth / 2;
const halfHeight = window.innerHeight / 2;

const scene = new Scene();
const camera = new OrthographicCamera(
  -halfWidth,
  halfWidth,
  -halfHeight,
  halfHeight,
  1,
  1000,
);
const renderer = new WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const board = new Board({x: 10, y: 10});
scene.add(board.asset);
