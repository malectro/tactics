import {Board} from './Board';
import {BoardDesignerController, BoardDesignerControllerAdapter} from './controllers/BoardDesignerController';
import {Renderer} from './Renderer'
import {Character, Soldier} from './Character';
import {Battle} from './Battle';


async function run() {
  const renderer = new Renderer();

  const response = await fetch('../data/boards/test1.json');
  const boardData = await response.json();

  const board = Board.fromJSON(boardData);

  const controller = new BoardDesignerControllerAdapter(new BoardDesignerController(renderer, board));
  controller.setUp();

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


  renderer.scene.add(board.asset);

  document.body.appendChild(renderer.webglRenderer.domElement);
  renderer.animate();
}
run();
