import {Renderer} from './Renderer';

export class Controller {
  renderer: Renderer;

  constructor(renderer: Renderer) {
    this.renderer = renderer;

    window.addEventListener('wheel', event => {
      this.renderer.scene.rotation.y += event.deltaX * Math.PI / 1000;
      this.renderer.scene.rotation.x += event.deltaY * Math.PI / 1000;
    });

    window.addEventListener('keydown', event => {
      if (event.key === 'c') {
        const index = (renderer.cameras.indexOf(renderer.camera) + 1) % renderer.cameras.length;
        renderer.camera = renderer.cameras[index];
      }
    });
  }
}
