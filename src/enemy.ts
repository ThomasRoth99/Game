interface IEnemy{ 
    makeSound(): void;
    eatPerson(food: string): void;
}

function testEnemy(Enemy: IEnemy): void {
    Enemy.makeSound();
    Enemy.eatPerson('Person');
}

abstract class Enemy implements IEnemy {
    abstract makeSound(): void;

    eatPerson(food: string): void {
        console.log('Jummie Jummie' + food);
    }
}

class Ghost extends Enemy {
    makeSound(): void {
        console.log('Booooh');
    }
    
    eatPerson(food: string): void{
        if (food !== 'Person') {
            console.log('This is bad meat');
            return;
        }

        super.eatPerson(food);
    }
}

testEnemy(new Ghost());