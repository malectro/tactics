import {Scene, OrthographicCamera, WebGLRenderer, Vector3} from 'three';
import {BoxBufferGeometry, MeshBasicMaterial, Mesh, PerspectiveCamera} from 'three';

import {Board} from './board';
import {Controller} from './Controller';
import {Renderer} from './Renderer'


const renderer = new Renderer();
const controller = new Controller(renderer);


const board = new Board({x: 10, y: 10});
renderer.scene.add(board.asset);

/*
var geometry = new BoxBufferGeometry(100, 100, 100);
var material = new MeshBasicMaterial({color: 0xffff00});
var mesh = new Mesh(geometry, material);
renderer.scene.add(mesh);
 */

document.body.appendChild(renderer.webglRenderer.domElement);
renderer.animate();
