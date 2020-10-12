/**
 * Returns a random boolean, 80% false
 * @returns {boolean}
 */
function getRandomBoolean() {

    const number = Math.random();
    
    if (number < 0.8) {
        return false;
    } else {
        return true;
    }
}

/**
 * Converts ids strings into x,y coordinates with array destructuring
 * @param {string}
 * @returns {Object} 
 */
function parseCellId(id) {

    const [y, x] = id.split('-');

    return {y, x};
}

/**
 * Returns a random id for character id
 * @param {Object} grid - an instance of Grid
 * @returns {string}
 */
function getRandomId(grid) {

    let randomX = Math.floor(Math.random() * grid.numberOfCellsX);
    let randomY = Math.floor(Math.random() * grid.numberOfCellsY);
    let randomId = randomY + '-' + randomX;

    while (grid.getCell(randomId).unreachable || grid.getCell(randomId).itemInsideType.length !== 0) {
        randomX = Math.floor(Math.random() * grid.numberOfCellsX);
        randomY = Math.floor(Math.random() * grid.numberOfCellsY);
        randomId = randomY + '-' + randomX;
    }

    return randomId;
}

/**
 * Returns new id after coordinates change. If the cell is not accessible, returns the information specifying why
 * @param {string} id
 * @param {number} countY
 * @param {number} countX
 * @returns {string}
 */
function getNewReachableId(grid, id, countY, countX) {

    const parsedId = parseCellId(id);
    
    const originalY = parseInt(parsedId.y, 10);
    const originalX = parseInt(parsedId.x, 10);
    let newY = originalY + countY;
    let newX = originalX + countX;

    if (newY < 0 || newY > grid.numberOfCellsY - 1 || newX < 0 || newX > grid.numberOfCellsX - 1) {

        return 'out-of-grid';

    } else {

        const newId = newY + '-' + newX;
        const newIdCell = grid.getCell(newId);
        const newIdHasCharacter = newIdCell.itemInsideType.filter(element => element.includes('character'));

        if (newIdCell.unreachable) {

            return 'unreachable-cell';

        } else if (newIdHasCharacter.length !== 0) {

            return 'has-character';
            
        } else {

            if (countY > 1 && countX === 0) {

                while (newY !== originalY + 1) {

                    const previousId = (newY - 1) + '-' + newX;
                    const previousCell = grid.getCell(previousId);0
                    const previousCellHasCharacter = previousCell.itemInsideType.filter(element => element.includes('character'));

                    if (previousCell.unreachable || previousCellHasCharacter.length !== 0) {

                        return 'blocked-by-previous-cell';
                    }

                    newY--;
                }

            } else if (countY < -1 && countX === 0) {

                while (newY !== originalY - 1) {

                    const previousId = (newY + 1) + '-' + newX;
                    const previousCell = grid.getCell(previousId);
                    const previousCellHasCharacter = previousCell.itemInsideType.filter(element => element.includes('character'));

                    if (previousCell.unreachable || previousCellHasCharacter.length !== 0) {

                        return 'blocked-by-previous-cell';
                    }

                    newY++;
                }

            } else if (countY === 0 && countX > 1) {

                while (newX !== originalX + 1) {

                    const previousId = newY + '-' + (newX - 1);
                    const previousCell = grid.getCell(previousId);
                    const previousCellHasCharacter = previousCell.itemInsideType.filter(element => element.includes('character'));

                    if (previousCell.unreachable || previousCellHasCharacter.length !== 0) {

                        return 'blocked-by-previous-cell';
                    }

                    newX--;
                }

            } else if (countY === 0 && countX < -1) {

                while (newX !== originalX - 1) {

                    const previousId = newY + '-' + (newX + 1);
                    const previousCell = grid.getCell(previousId);
                    const previousCellHasCharacter = previousCell.itemInsideType.filter(element => element.includes('character'));

                    if (previousCell.unreachable || previousCellHasCharacter.length !== 0) {

                        return 'blocked-by-previous-cell';
                    }

                    newX++;
                }
            }
     
            return newId;
        }
    }
}

/**
 * Check if there are duplicates in the array, and returns a new one without duplicates
 * @param {array}
 * @returns {array}
 */
function eraseDuplicates(array) {

    const seen = {};
    const arrayWithoutDuplicates = [];
    let j = 0;

    for (let i = 0; i < array.length; i++) {

         let item = array[i];

        if (seen[item] !== 1) {

            seen[item] = 1;
            arrayWithoutDuplicates[j++] = item;
        }
    }

    return arrayWithoutDuplicates;
}

/**
 * Removes selected items from array, modifies the original array
 * @param {array} array
 * @param {array} itemsToRemove
 */
function removeSelectedItems(array, itemsToRemove) {

    for (let i = 0; i < itemsToRemove.length; i++) {
    
    const classToRemove = itemsToRemove[i];
    
        for (let j = 0; j < array.length; j++) {
            
            if (array[j] === classToRemove) {
            
                array.splice(j, 1);
            }
        }
    }
}

export { getRandomBoolean, parseCellId, getRandomId, getNewReachableId, eraseDuplicates, removeSelectedItems };
