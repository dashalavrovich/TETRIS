import Game from "./src/game.js";
import View from "./src/view.js";
import Controller from "./src/controller.js";

const root = document.querySelector("#root");

const game = new Game();
const view = new View(root, 480, 640, 20, 10);
const controller = new Controller(game, view);

window.game = game;
window.view = view;
window.controller = controller;

document.addEventListener("keydown", (event) => {
  switch (event.keyCode) {
    case 37: // left arrow
      game.movePieceLeft();
      view.render(game.getState());
      break;
    case 38: // up arrow
      game.rotatePiece();
      view.render(game.getState());
      break;
    case 39: // right arrow
      game.movePieceRight();
      view.render(game.getState());
      break;
    case 40: // down arrow
      game.movePieceDown();
      view.render(game.getState());
      break;
  }
});

// view.render(game.getState());
// view.renderEndScreen(game.getState())
