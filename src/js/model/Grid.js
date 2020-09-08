import * as utils from '../utils.js';

export default class Grid {

    constructor(numberOfCellsX, numberOfCellsY) {

        this.numberOfCellsX = numberOfCellsX;
        this.numberOfCellsY = numberOfCellsY;
        this.cells = [];
    }

    // Initialize grid object with ids, reachable and unreachable cells
    init() {

        for (let i = 0; i < this.numberOfCellsY; i++) {

            this.cells[i] = [];

            for (let j = 0; j < this.numberOfCellsX; j++) {
                
                this.cells[i][j] = {
                    id: i + '-' + j,
                    unreachable: utils.getRandomBoolean(),
                    itemInsideType: []
                };
            }
        }
    }

    getCell(id) {
        
        const coordinates = utils.parseCellId(id);
        return this.cells[coordinates.y][coordinates.x];
    }

    updateCell(id, cssClasses, add) {

        const coordinates = utils.parseCellId(id);
        const gridCell = this.cells[coordinates.y][coordinates.x];

        let arrayCssClasses;

        if (!Array.isArray(cssClasses)) {
            
            // If no space in string, creates an array with one element
            arrayCssClasses = cssClasses.split(' ');
            
        } else {

            arrayCssClasses = cssClasses;
        }

        if (add === true) {

            gridCell.itemInsideType.push(...arrayCssClasses);
            gridCell.itemInsideType = utils.eraseDuplicates(gridCell.itemInsideType);

        } else {

            utils.removeSelectedItems(gridCell.itemInsideType, arrayCssClasses);
        }
    }
}
