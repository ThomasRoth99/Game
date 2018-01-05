class LockedDoor extends Error {
    constructor(m: string) {
        super(m);

        (<any>this).__proto__ = LockedDoor.prototype;
    }
}