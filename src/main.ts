import {Board} from './Board';
import {ControllerManager} from './controllers/Controller';
import {BoardDesignerController, BoardDesignerControllerAdapter} from './controllers/BoardDesignerController';
import {BattleController, BattleControllerAdapter} from './controllers/BattleController';
import {CameraController, CameraControllerAdapter} from './controllers/CameraController';
import {Renderer} from './Renderer'
import {Character, Soldier} from './Character';
import {Battle} from './Battle';


async function run() {
  const renderer = new Renderer();

  const response = await fetch('../data/boards/test1.json');
  const boardData = await response.json();

  const board = Board.fromJSON(boardData);

  const character = new Character({
    name: 'Kyle',
    experience: 0,
    strength: 1,
    speed: 1,
    wisdom: 1,
  });
  const soldier = new Soldier(character);

  const battle = new Battle(board);
  battle.placeSoldier(soldier, board.getRandomEmptySurface());

  const controllerManager = new ControllerManager();
  //const designerController = new BoardDesignerControllerAdapter(new BoardDesignerController(renderer, board));
  const battleController = new BattleControllerAdapter(new BattleController(renderer, battle));
  const cameraController = new CameraControllerAdapter(new CameraController(renderer, board));

  controllerManager.add(battleController);
  controllerManager.add(cameraController);


  renderer.scene.add(board.asset);

  document.body.appendChild(renderer.webglRenderer.domElement);
  renderer.animate();
}
run();
