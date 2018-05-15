interface IEnemy{ 
    makeSound(): string;
    eatPerson(food: string): string;
}

function testEnemy(Enemy: IEnemy): void {
    Enemy.makeSound();
    Enemy.eatPerson('Person');
}

abstract class Enemy implements IEnemy {
    abstract makeSound(): string;

    eatPerson(food: string): string {
        return('Jummie Jummie' + food);
    }
}

class Ghost extends Enemy {
    makeSound(): string {
        return(' Ghost says Booooh!!!');
    }
    
    eatPerson(food: string): string{
        if (food !== 'Person') {
            return('This is bad meat');
        }

        this.eatPerson(food);
    }
}

