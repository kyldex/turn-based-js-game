import '../css/main.css';
import GameController from './GameController.js';

// Game init
// Mobile & tablet - grid with 6 cells width and 10 cells height
if (window.matchMedia("(max-width: 1023px)").matches) {

    const app = new GameController(6, 10);
    app.run();

// Desktop - grid with 10 cells width and 10 cells height
} else if (window.matchMedia("(max-width: 1199px)").matches){

    const app = new GameController(10, 10);
    app.run();

// Desktop large - grid with 15 cells width and 10 cells height
} else if (window.matchMedia("(min-width: 1200px)").matches){

    const app = new GameController(15, 10);
    app.run();
}
