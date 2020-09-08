import Grid from './model/Grid.js';
import Character from './model/Character.js';
import GameView from './GameView.js';
import * as utils from './utils.js';

export default class GameController {

    constructor(numberOfCellsX, numberOfCellsY) {

        this.grid = new Grid(numberOfCellsX, numberOfCellsY);
        this.character1 = new Character(1);
        this.character2 = new Character(2);
        this.gameView = new GameView(numberOfCellsX, numberOfCellsY);
    }

    run() {

        this.grid.init();
        this.gameView.init(this.grid);

        let character1Id = utils.getRandomId(this.grid);
        this.character1.currentId = character1Id;
        this.grid.updateCell(character1Id, ['character-1'], true);
        this.gameView.updateCell(character1Id, ['character-1'], true);

        let character2Id = utils.getRandomId(this.grid);
        let character1IdUp = utils.getNewReachableId(this.grid, character1Id, -1, 0);
        let character1IdDown = utils.getNewReachableId(this.grid, character1Id, 1, 0);
        let character1IdLeft = utils.getNewReachableId(this.grid, character1Id, 0, -1);
        let character1IdRight = utils.getNewReachableId(this.grid, character1Id, 0, 1);

        // Check if characters don't appear next to each other
        while (character2Id === character1IdUp || character2Id === character1IdDown || character2Id === character1IdLeft || character2Id === character1IdRight) {
            character2Id = utils.getRandomId(this.grid);
            character1IdUp = utils.getNewReachableId(this.grid, character1Id, -1, 0);
            character1IdDown = utils.getNewReachableId(this.grid, character1Id, 1, 0);
            character1IdLeft = utils.getNewReachableId(this.grid, character1Id, 0, -1);
            character1IdRight = utils.getNewReachableId(this.grid, character1Id, 0, 1);
        }

        this.character2.currentId = character2Id;
        this.grid.updateCell(character2Id, ['character-2'], true);
        this.gameView.updateCell(character2Id, ['character-2'], true);

        let weaponBombId = utils.getRandomId(this.grid);
        this.grid.updateCell(weaponBombId, ['weapon-bomb'], true);
        this.gameView.updateCell(weaponBombId, ['weapon-bomb'], true);

        let weaponGunId = utils.getRandomId(this.grid);
        this.grid.updateCell(weaponGunId, ['weapon-gun'], true);
        this.gameView.updateCell(weaponGunId, ['weapon-gun'], true);

        let weaponSwordId = utils.getRandomId(this.grid);
        this.grid.updateCell(weaponSwordId, ['weapon-sword'], true);
        this.gameView.updateCell(weaponSwordId, ['weapon-sword'], true);

        let weaponBigPunchId = utils.getRandomId(this.grid);
        this.grid.updateCell(weaponBigPunchId, ['weapon-big-punch'], true);
        this.gameView.updateCell(weaponBigPunchId, ['weapon-big-punch'], true);

        this.gameView.startPlayerTurn(1, this);
    }

    // Creates reachable cells for character whose number is function parameter
    createReachableCells(characterNumber) {

        let currentCharacterId;

        if (characterNumber === 1) {
            currentCharacterId = this.character1.currentId;
        } else {
            currentCharacterId = this.character2.currentId;
        }

        // Change this array to get more or less reachable cells
        const newIdCounts = [
            { y: -1, x: 0 },
            { y: -2, x: 0 },
            { y: -3, x: 0 },
            { y: 1, x: 0 },
            { y: 2, x: 0 },
            { y: 3, x: 0 },
            { y: 0, x: -1 },
            { y: 0, x: -2 },
            { y: 0, x: -3 },
            { y: 0, x: 1 },
            { y: 0, x: 2 },
            { y: 0, x: 3 }
        ];

        newIdCounts.forEach(newCounts => {

            const newCharacterId = utils.getNewReachableId(this.grid, currentCharacterId, newCounts.y, newCounts.x);
                
            // reachable-for-move if cell is empty or if cell has weapon
            if (newCharacterId !== 'out-of-grid' && newCharacterId !== 'unreachable-cell' && newCharacterId !== 'has-character' && newCharacterId !== 'blocked-by-previous-cell') {

                this.grid.updateCell(newCharacterId, ['reachable-for-move'], true);
                this.gameView.updateCell(newCharacterId, ['reachable-for-move'], true);
            }
        })
    }

    getCharacter(number) {

        if (number === 1) {
            return this.character1;
        } else if (number === 2) {
            return this.character2;
        }
    }

    // Returns true if one the four adjacent cells of next turn character contains has-character in properties
    fightModeOn(nextCharacterNumber) {

        let nextCharacterId = this.getCharacter(nextCharacterNumber).currentId;
        let nextCharacterIdUp = utils.getNewReachableId(this.grid, nextCharacterId, -1, 0);
        let nextCharacterIdDown = utils.getNewReachableId(this.grid, nextCharacterId, 1, 0);
        let nextCharacterIdLeft = utils.getNewReachableId(this.grid, nextCharacterId, 0, -1);
        let nextCharacterIdRight = utils.getNewReachableId(this.grid, nextCharacterId, 0, 1);

        if (nextCharacterIdUp === 'has-character' || nextCharacterIdDown === 'has-character' || nextCharacterIdLeft === 'has-character' || nextCharacterIdRight === 'has-character') {
            return true;
        } else {
            return false;
        }
    }
}
