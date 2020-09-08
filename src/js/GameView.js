export default class GameView {

    constructor(numberOfCellsX, numberOfCellsY) {

        this.numberOfCellsX = numberOfCellsX;
        this.numberOfCellsY = numberOfCellsY;
        // Turns counter
        this.cellTimesClicked = 0;
    }

    /** 
     * Initialize grid view with ids, reachable and unreachable cells
     * @param {Object} grid - an instance of Grid
    */
    init(grid) {

        for (let i = 0; i < grid.numberOfCellsY; i++) {

            let newRowElement = document.createElement('div');
            newRowElement.classList.add('row');
            document.getElementById('grid-inner').appendChild(newRowElement);
        
            for (let j = 0; j < grid.numberOfCellsX; j++) {
        
                let newCellElement = document.createElement('div');
                newCellElement.id = grid.cells[i][j].id;
                newCellElement.classList.add('cell');
        
                if (grid.cells[i][j].unreachable) {
                    newCellElement.classList.add('unreachable');
                }

                newRowElement.appendChild(newCellElement);
            }
        }
    }

    getWeaponName(cellId) {

        const cellClasses = document.getElementById(cellId).classList;
        let weaponName;

        cellClasses.forEach(element => {
            if (element.includes('weapon-')) {
                weaponName = element;
            }
        })

        return weaponName;
    }

    // Used to update the view from outside
    updateCell(id, cssClasses, add) {

        const elementWithId = document.getElementById(id);
        let arrayCssClasses;

        if (!Array.isArray(cssClasses)) {
            
            // If no space in string, creates an array with one element
            arrayCssClasses = cssClasses.split(' ');
            
        } else {
            arrayCssClasses = cssClasses;
        }

        if (add === true) {
            elementWithId.classList.add(...cssClasses);
        } else {
            elementWithId.classList.remove(...cssClasses);
        }
    }

    updateTurnInfo(nextCharacterNumber) {

        document.getElementById('turn-info').innerText = 'Player ' + nextCharacterNumber;
        document.getElementById('turn-info-mobile').innerText = 'Player ' + nextCharacterNumber;
        document.getElementById('turn-info-fight').innerText = 'Player ' + nextCharacterNumber;
    }

    updateHealthInfo(nextCharacterNumber, nextCharacterNewHealth) {

        if (nextCharacterNumber === 1) {

            const HealthInfoElement = document.getElementById('char-1-health');

            if (nextCharacterNewHealth > 0) {
                HealthInfoElement.innerText = nextCharacterNewHealth;
            } else {
                HealthInfoElement.innerText = 0;
            }

        } else if (nextCharacterNumber === 2) {

            const HealthInfoElement = document.getElementById('char-2-health');

            if (nextCharacterNewHealth > 0) {
                HealthInfoElement.innerText = nextCharacterNewHealth;
            } else {
                HealthInfoElement.innerText = 0;
            }
        }
    }

    updateHealthBar(nextCharacterNumber, nextCharacterNewHealth) {

        if (nextCharacterNumber === 1) {

            const HealthBarElement = document.getElementById('char-1-life-bar');

            if (nextCharacterNewHealth > 0) {
                HealthBarElement.style.width = nextCharacterNewHealth + '%';
            } else {
                HealthBarElement.style.width = 0;
            }

        } else if (nextCharacterNumber === 2) {

            const HealthBarElement = document.getElementById('char-2-life-bar');

            if (nextCharacterNewHealth > 0) {
                HealthBarElement.style.width = nextCharacterNewHealth + '%';
            } else {
                HealthBarElement.style.width = 0;
            }
        }
    }

    updateWeaponInfo(weaponName) {

        if (this.cellTimesClicked % 2 === 0) {

            const weaponInfoElement1 = document.getElementById('character-1-weapon');
            const weaponInfoElement2 = document.getElementById('char-1-weapon-fight');
            const weaponInfoElement3 = document.getElementById('character-1-weapon-mobile');

            weaponInfoElement1.innerText = weaponName.substring(7);
            weaponInfoElement2.innerText = weaponName.substring(7);
            weaponInfoElement3.innerText = weaponName.substring(7);

        } else {
            const weaponInfoElement1 = document.getElementById('character-2-weapon');
            const weaponInfoElement2 = document.getElementById('char-2-weapon-fight');
            const weaponInfoElement3 = document.getElementById('character-2-weapon-mobile');

            weaponInfoElement1.innerText = weaponName.substring(7);
            weaponInfoElement2.innerText = weaponName.substring(7);
            weaponInfoElement3.innerText = weaponName.substring(7);
        }
    }

    displayFightInfo() {

        const fightInfoElement = document.getElementById('fight');
        fightInfoElement.classList.remove('hidden');
    }

    fight(characterNumber, nextCharacterNumber, controller) {

        // Desktop keys
        const fightCallbackAction = (e) => {this.fightDesktopAction(e, fightCallbackAction, controller, this, characterNumber, nextCharacterNumber)};

        document.addEventListener('keydown', fightCallbackAction);

        // Mobile & tablet buttons
        const fightCallbackAttack = () => {this.fightMobileAttack(fightCallbackAttack, fightCallbackDefend, controller, this, characterNumber, nextCharacterNumber)};
        const fightCallbackDefend = () => {this.fightMobileDefend(fightCallbackDefend, fightCallbackAttack, controller, this, characterNumber, nextCharacterNumber)};

        document.querySelector('.btn-fight-attack').addEventListener('click', fightCallbackAttack);
        document.querySelector('.btn-fight-defend').addEventListener('click', fightCallbackDefend);
    }

    // Called from fight() event callback - desktop
    fightDesktopAction(e, callback, controller, that, characterNumber, nextCharacterNumber) {

        // If A key is pressed, attack mode
        if (e.keyCode === 65) {
            
            const nextCharacterNewHealth = controller
            .getCharacter(characterNumber)
            .attack(controller.getCharacter(nextCharacterNumber));

            that.updateHealthInfo(nextCharacterNumber, nextCharacterNewHealth);
            that.updateHealthBar(nextCharacterNumber, nextCharacterNewHealth);

            document.removeEventListener('keydown', callback);

            // Game is over
            if (nextCharacterNewHealth === 0) {

                document.querySelector('.turn-info-fight-class').classList.add('hidden');
                document.querySelector('#winner-name').classList.remove('hidden');
                document.querySelector('#winner-name').innerText = 'Player ' + characterNumber + ' wins!';

                if (characterNumber === 1) {
                    document.querySelector('#winner-illustration-1').classList.remove('hidden');
                } else {
                    document.querySelector('#winner-illustration-2').classList.remove('hidden');
                }

            } else {

                if (characterNumber === 1) {
                    characterNumber = 2;
                    nextCharacterNumber = 1;
                } else if (characterNumber === 2) {
                    characterNumber = 1;
                    nextCharacterNumber = 2;
                }

                that.cellTimesClicked++;
                that.updateTurnInfo(characterNumber);
                that.fight(characterNumber, nextCharacterNumber, controller);
            }

        // If D key is pressed, defense mode
        } else if (e.keyCode === 68) {

            controller.getCharacter(characterNumber).defense = true;

            if (characterNumber === 1) {
                characterNumber = 2;
                nextCharacterNumber = 1;
            } else if (characterNumber === 2) {
                characterNumber = 1;
                nextCharacterNumber = 2;
            }

            document.removeEventListener('keydown', callback);
            that.cellTimesClicked++;
            that.updateTurnInfo(characterNumber);
            that.fight(characterNumber, nextCharacterNumber, controller);
        }
    }

    // Called from fight() event callback - mobile & tablet
    fightMobileAttack(callback, callbackDefend, controller, that, characterNumber, nextCharacterNumber) {

        const nextCharacterNewHealth = controller
        .getCharacter(characterNumber)
        .attack(controller.getCharacter(nextCharacterNumber));

        that.updateHealthInfo(nextCharacterNumber, nextCharacterNewHealth);
        that.updateHealthBar(nextCharacterNumber, nextCharacterNewHealth);

        document.querySelector('.btn-fight-attack').removeEventListener('click', callback);
        document.querySelector('.btn-fight-defend').removeEventListener('click', callbackDefend);

        // Game is over
        if (nextCharacterNewHealth === 0) {

            document.querySelector('.turn-info-fight-class').classList.add('hidden');
            document.querySelector('#winner-name').classList.remove('hidden');
            document.querySelector('#winner-name').innerText = 'Player ' + characterNumber + ' wins!';

        } else {

            if (characterNumber === 1) {
                characterNumber = 2;
                nextCharacterNumber = 1;
            } else if (characterNumber === 2) {
                characterNumber = 1;
                nextCharacterNumber = 2;
            }

            that.cellTimesClicked++;
            that.updateTurnInfo(characterNumber);
            that.fight(characterNumber, nextCharacterNumber, controller);
        }
    }

    // Called from fight() event callback - mobile & tablet
    fightMobileDefend(callback, callbackAttack, controller, that, characterNumber, nextCharacterNumber) {

        controller.getCharacter(characterNumber).defense = true;

        if (characterNumber === 1) {
            characterNumber = 2;
            nextCharacterNumber = 1;
        } else if (characterNumber === 2) {
            characterNumber = 1;
            nextCharacterNumber = 2;
        }

        document.querySelector('.btn-fight-defend').removeEventListener('click', callback);
        document.querySelector('.btn-fight-attack').removeEventListener('click', callbackAttack);
        that.cellTimesClicked++;
        that.updateTurnInfo(characterNumber);
        that.fight(characterNumber, nextCharacterNumber, controller);
    }

    startPlayerTurn(playerNumber, controller) {
    
        controller.createReachableCells(playerNumber);
    
        const reachableElements = document.querySelectorAll('.reachable-for-move');
        
        const turnCallback = (e) => {this.reachableElementOnClick(e, turnCallback, controller, this, reachableElements)};
    
        for (let i = 0; i < reachableElements.length; i++) {
            reachableElements[i].addEventListener('click', turnCallback);
        }
    }
    
    // Called from startPlayerTurn() event callback
    reachableElementOnClick(e, callback, controller, that, reachableElements) {

        const newCharacterCellElement = e.target;
        const newCharacterCellId = newCharacterCellElement.getAttribute('id');
        const newCharacterCellHasWeapon = newCharacterCellElement.className.includes('weapon-');

        let characterNumber;
        let characterClassName;
        let nextCharacterNumber;

        if (that.cellTimesClicked % 2 === 0) {

            characterNumber = 1;
            characterClassName = 'character-1';
            nextCharacterNumber = 2;

        } else {

            characterNumber = 2;
            characterClassName = 'character-2';
            nextCharacterNumber = 1;
        }

        const currentCharacterCellId = controller.getCharacter(characterNumber).currentId;
        const currentCharacterCellElement = document.getElementById(currentCharacterCellId);
        const currentCharacterCellWasWeapon = currentCharacterCellElement.className.includes('was-weapon');

        // If current character cell was a weapon before
        if (currentCharacterCellWasWeapon) {

            const previousWeapon = controller.getCharacter(characterNumber).previousWeapon.type;
            controller.grid.updateCell(currentCharacterCellId, [previousWeapon], true);
            controller.grid.updateCell(currentCharacterCellId, ['was-weapon'], false);

            currentCharacterCellElement.classList.add(previousWeapon);
            currentCharacterCellElement.classList.remove('was-weapon');
        }

        // If weapon and reachable-for-move classes are found for next character cell
        if (newCharacterCellHasWeapon) {

            const weaponName = that.getWeaponName(newCharacterCellId);
                
            controller.getCharacter(characterNumber).updateWeapon(weaponName);
            controller.grid.updateCell(newCharacterCellId, ['was-weapon'], true);
            controller.grid.updateCell(newCharacterCellId, [weaponName], false);

            newCharacterCellElement.classList.add('was-weapon');
            newCharacterCellElement.classList.remove(weaponName);
            that.updateWeaponInfo(weaponName);
        }

        controller.grid.updateCell(currentCharacterCellId, [characterClassName], false);
        currentCharacterCellElement.classList.remove(characterClassName);

        // Remove reachable-for-move class
        for (let j = 0; j < reachableElements.length; j++) {

            const currentReachableElementId = reachableElements[j].getAttribute('id');
            controller.grid.updateCell(currentReachableElementId, ['reachable-for-move'], false);

            reachableElements[j].classList.remove('reachable-for-move');
            reachableElements[j].removeEventListener('click', callback);
        }

        controller.getCharacter(characterNumber).currentId = newCharacterCellId;
        controller.grid.updateCell(newCharacterCellId, [characterClassName], true);

        newCharacterCellElement.classList.add(characterClassName);

        // Verify if fight mode starts once character class has been added to next character cell
        if (controller.fightModeOn(nextCharacterNumber)) {

            that.displayFightInfo();
            that.fight(characterNumber, nextCharacterNumber, controller);

        } else {

            that.cellTimesClicked++;
            that.updateTurnInfo(nextCharacterNumber);
            that.startPlayerTurn(nextCharacterNumber, controller);
        }
    }
}