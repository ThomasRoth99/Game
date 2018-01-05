/**
 * This class is part of the "Zorld of Wuul" application. 
 * "Zorld of Wuul" is a very simple, text based adventure game.  
 * 
 * Users can walk around some scenery. That's all. It should really be 
 * extended to make it more interesting!
 * 
 * To play this game, create an instance of this class and call the "play"
 * method.
 * 
 * This main class creates and initialises all the others: it creates all
 * rooms, creates the parser and starts the game.  It also evaluates and
 * executes the commands that the parser returns.
 * 
 * @author  Michael Kölling, David J. Barnes and Bugslayer
 * @version 2017.03.30
 */
class Game {
    parser : Parser;
    out : Printer;

    currentRoom : Room;

    isOn : boolean;

    allItems : Array<String> = [];

    /**
     * Create the game and initialise its internal map.
     */
    constructor(output: HTMLElement, input: HTMLInputElement) {
        this.parser = new Parser(this, input);
        this.out = new Printer(output);
        this.isOn = true;
        this.createRooms();
        this.printWelcome();
    }

    /**
     * Create all the rooms and link their exits together.
     */
    createRooms() : void {
        // create the rooms
        let Dungeon = new Room("stuck in the dungeon of this castle, see if you can find a way out");
        let Staircase = new Room("You are at the staircase now");
        let MainHall = new Room("You are now in the main hall");
        let SecondFloor = new Room("You are at the second floor, at your right you see a kitchen");
        let Kitchen = new Room("You are at the kitchen but watchout for the cook, he is always wandering around in his kitchen");
        let BaronOffice = new Room("You used the steak to get the guards distracted! Now quickly grab the key before they come back");
        let Courtyard = new Room ("You are at the courtyard, a big open space. Watchout because guards may sneak up on you")
        let Smithy = new Room ("You are at the smithy. Their are always people guarding this place")
        let Stables = new Room ("You are now at the stables")
        let MainGate = new Room ("You are at the main gate, the best way of getting out of here is through this gate")
        let Freedom = new Room ("You escaped the castle! U are free now. Hit F5 to restart the game. Thanks for playing!")

        // initialise room exits
        Dungeon.addDoor("north", new Door(Staircase));
        Staircase.addDoor("east", new Door(MainHall));
        Staircase.addDoor("west", new Door(SecondFloor));
        MainHall.addDoor("east", new Door(Courtyard));
        MainHall.addDoor("south", new LockedDoorFood(BaronOffice));
        MainHall.addDoor("west", new Door(Staircase));
        SecondFloor.addDoor("north", new Door(Kitchen)); 
        SecondFloor.addDoor("east", new Door(Staircase));
        Kitchen.addDoor("south", new Door(SecondFloor));
        BaronOffice.addDoor("north", new Door(MainHall)); 
        Courtyard.addDoor("north", new Door(Smithy));
        Courtyard.addDoor("east", new Door(MainGate));
        Courtyard.addDoor("south", new LockedDoorKey(Stables));
        Courtyard.addDoor("west", new Door(MainHall)); 
        Smithy.addDoor("south", new Door(Courtyard));
        Stables.addDoor("north", new Door(Courtyard));
        MainGate.addDoor("west", new Door(Courtyard));
        MainGate.addDoor("east", new LockedDoorHorse(Freedom));

        //items
        Stables.inventory = new Items("horse");
        BaronOffice.inventory = new Items("key");
        Kitchen.inventory = new Items("steak");


        // spawn player outside
        this.currentRoom = Dungeon;
    }

    /**
     * Print out the opening message for the player.
     */
     printWelcome() : void {
        this.out.println();
        this.out.println("Welcome to Castle Escape!");
        this.out.println("Try to find your way out of this castle");
        this.out.println("Search items to help you in your escape")
        this.out.println("You are " + this.currentRoom.description);
        this.out.println("Exits: north");
        this.out.println();
        this.out.println("There is a " + this.currentRoom.inventory.description + " here");
        this.out.print("Actions: ");
        this.out.println(this.currentRoom.getDoors().join(" "));
        this.out.print(">");
    }

    gameOver() : void {
        this.isOn = false;
        this.out.println("Thank you for playing.  Good bye.");
        this.out.println("Hit F5 to restart the game");
    }

    /**
     * Print out error message when user enters unknown command.
     * Here we print some erro message and a list of the 
     * command words.
     * 
     * @param params array containing all parameters
     * @return true, if this command quits the game, false otherwise.
     */
    printError(params : string[]) : boolean {
        this.out.println("I don't know what you mean...");
        this.out.println();
        this.out.println("Your command words are:");
        this.out.println("   go quit help get look show");
        return false;
    }

    /**
     * Print out some help information.
     * Here we print some stupid, cryptic message and a list of the 
     * command words.
     * 
     * @param params array containing all parameters
     * @return true, if this command quits the game, false otherwise.
     */
    printHelp(params : string[]) : boolean {
        if(params.length > 0) {
            this.out.println("Help what?");
            return false;
        }
        this.out.println();
        this.out.println("Your command words are:");
        this.out.println("   go quit help get look show");
        return false;
    }

    /** 
     * Try to go in one direction. If there is an exit, enter
     * the new room, otherwise print an error message.
     * 
     * @param params array containing all parameters
     * @return true, if this command quits the game, false otherwise.
     */
   goRoom(params : string[]) : boolean {
        if(params.length == 0) {
            // if there is no second word, we don't know where to go...
            this.out.println("Go where?");
            return;
        }

        let direction = params[0];

        // Try to leave current room.
        let door = this.currentRoom.getDoor(direction);

        try {
            door.enter(this.allItems);
        }
        catch (e) {
            if(e instanceof LockedDoor) {
                this.out.println(e.message);
                return false;
            }
            throw e;
        }

        if (door == null) {
            this.out.println("There is no exit " + door + "!");
            return false;
        }

        this.currentRoom = door.exit;
        this.out.println("" + this.currentRoom.description);
        if (this.currentRoom.inventory == null) {
            this.out.println("There are no items in this room");
        }
        else {
            console.log(this.currentRoom);
            this.out.println("There is a " + this.currentRoom.inventory.description + " here");
        }
        this.out.print("Exits: ");
        this.out.println(this.currentRoom.getDoors().join(" "));


        return false;
    }


     getItem(params : string[]) : boolean {
        

        if(this.currentRoom.inventory == null){
            this.out.println("No items in this room, perhaps you find items in other room");
            return;
        }

        if(params.length == 0) {
            // if there is no second word, we don't know where to go...
            this.out.println("Get what?");
            return;
        }

        let yourItem = params[0];

        let nextItem = null;
        switch (yourItem) {
            case("horse") :
                this.allItems.push(this.currentRoom.inventory.description);
                this.currentRoom.inventory = null;
                break;
            case("key") :
                this.allItems.push(this.currentRoom.inventory.description);
                this.currentRoom.inventory = null;
                break;
            case("steak") :
                this.allItems.push(this.currentRoom.inventory.description);
                this.currentRoom.inventory = null;
                break;
        }
        this.out.print("You picked up a " + this.allItems);
        this.out.println();

        console.log(this.allItems);
        return false;
    }

    showItem(params : string[]) : boolean {

        let allItems = params[0];

        if(this.allItems != null){
            this.out.print("You're items: " + this.allItems);
            this.out.println();
        }
        else {
            this.out.print("You don't have items");
            this.out.println();
        }
        console.log(this.allItems);
        return false;
    }

    lookRoom(params : string[]) : boolean {
        this.out.print(this.currentRoom.description);
        this.out.println();
        if (this.currentRoom.inventory == null) {
            this.out.println("No items in this room, perhaps you find items in other room");
        }
        else {
            console.log(this.currentRoom);
            this.out.println("In this room there is a " + this.currentRoom.inventory.description);
        }
        this.out.print("Actions: ");
        this.out.println(this.currentRoom.getDoors().join(" "));
        return false;
    }


    
    /** 
     * "Quit" was entered. Check the rest of the command to see
     * whether we really quit the game.
     * 
     * @param params array containing all parameters
     * @return true, if this command quits the game, false otherwise.
     */
    quit(params : string[]) : boolean {
        if(params.length > 0) {
            this.out.println("Quit what?");
            return false;
        }
        else {
            return true;  // signal that we want to quit
        }
    }
}