"use strict";

export class ShoppingList {
    constructor(items) {
        this.items = items;
        this.picked = [];
    }

    /** Returns if the item was successfully picked, 
     *  after checking the arrays.
     */
    pick(name) {
        if (!this.items.includes(name) || this.picked.includes(name)) {
            return false;
        }
        this.picked.push(name);
        return true;
    }

    /** Returns if the grocery is already picked up.
     */
    isPicked(name) {
        return this.picked.includes(name);
    }

    /** Returns if all the items from the list have been picked up.
     */
    isCompleted() {
        return this.picked.length === this.items.length;
    }
}