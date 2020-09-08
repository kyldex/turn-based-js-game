export default class Weapon {
    
    constructor(type) {
        
        this.type = type;
        
        if (type === 'weapon-bomb') {
            this.damage = 30;
        }
        if (type === 'weapon-gun') {
            this.damage = 25;
        }
        if (type === 'weapon-sword') {
            this.damage = 20;
        }
        if (type === 'weapon-big-punch') {
            this.damage = 15;
        }
        if (type === 'weapon-punch') {
            this.damage = 10;
        }
    }
}
