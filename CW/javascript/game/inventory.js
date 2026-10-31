"use strict";

export class Inventory {
    constructor(size) {
        this.size = size;
        this.items = [];
    }

    /** Returns if the item was successfully pushed into the inventory,
     * after checking for an empty space.
     */
    add(name) {
        if (this.items.length >= this.size) {
            return false;
        }
        this.items.push(name);
        return true;
    }

    /** Returns if the item is inside the inventory.
     */
    has(name) {
        return this.items.includes(name);
    }

    /** Returns if the item was successfully removed from the inventory,
     * after checking if the item was inside the inventory.
     */
    remove(name) {
        const position = this.items.indexOf(name);
        if (position === -1) {
            return false;
        }
        this.items.splice(position, 1);
        return true;
    }
}