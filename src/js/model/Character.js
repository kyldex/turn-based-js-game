import Weapon from './Weapon.js';

export default class Character {
    
    constructor(number) {
        
        this.number = number;
        this.health = 100;
        this.currentId = '';
        this.previousWeapon = {};
        this.currentWeapon = new Weapon('weapon-punch');
        this.defense = false;
    }

    updateWeapon(weaponName) {

        this.previousWeapon = this.currentWeapon;
        this.currentWeapon = new Weapon(weaponName);
    }

    /**
     * Returns next character new health
     * @param {Object} nextCharacter - instance of next character
     * @returns {number}
     */
    attack(nextCharacter) {

        const currentWeaponDamage = this.currentWeapon.damage;

        if (nextCharacter.defense) {
            nextCharacter.health -= currentWeaponDamage / 2;
            nextCharacter.defense = false;
        } else {
            nextCharacter.health -= currentWeaponDamage;
        }

        if (nextCharacter.health < 0) {
            nextCharacter.health = 0;
        }

        return nextCharacter.health;
    }
}
