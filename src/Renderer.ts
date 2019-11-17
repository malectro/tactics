import {Scene, OrthographicCamera, WebGLRenderer, Vector3, Camera} from 'three';
import {BoxBufferGeometry, MeshBasicMaterial, Mesh, PerspectiveCamera} from 'three';


export class Renderer {
  scene: Scene;
  orthographicCamera: OrthographicCamera;
  perspectiveCamera: PerspectiveCamera;
  cameras: Camera[];
  camera: Camera;
  webglRenderer: WebGLRenderer;

  constructor() {
    const halfWidth = window.innerWidth / 2;
    const halfHeight = window.innerHeight / 2;
    const aspectRatio = window.innerWidth / window.innerHeight;
    const sceneHeight = 50;

    this.scene = new Scene();
    this.orthographicCamera = new OrthographicCamera(
      -sceneHeight * aspectRatio,
      sceneHeight * aspectRatio,
      sceneHeight,
      -sceneHeight,
      1,
      1000,
    );
    this.orthographicCamera.position.set(0, 0, 500);

    this.perspectiveCamera = new PerspectiveCamera(
      70,
      aspectRatio,
      1,
      10000,
    );
    this.perspectiveCamera.position.set(0, 0, 500);

    this.cameras = [
      this.orthographicCamera,
      this.perspectiveCamera,
    ];
    this.camera = this.cameras[0];

    this.webglRenderer = new WebGLRenderer();
    this.webglRenderer.setPixelRatio( window.devicePixelRatio );
    this.webglRenderer.setSize(window.innerWidth, window.innerHeight);

    this.scene.rotation.set(Math.PI / 2 - Math.PI / 8, 0, Math.PI / 4);

    //const controller = new Controller(scene);

    this.animate = this.animate.bind(this);
  }

  render() {
    this.webglRenderer.render(this.scene, this.camera);
  }

  animate() {
    this.render();
    requestAnimationFrame(this.animate);
  }
}
