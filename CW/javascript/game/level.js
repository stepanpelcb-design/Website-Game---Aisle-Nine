"use strict";

// =============
//    Imports
// =============

import { gameSize, elementSizes, elementHitboxSizes, scoreMultipliers } from "./config.js";
import { detectCollision } from "./helpers.js";


/** Returns if the object is outside the game canvas.
 */
function isOutsideCanvas(boundingBox) {
    const isPastRightEdge = boundingBox.x + boundingBox.width >= gameSize;
    const isPastLeftEdge = boundingBox.x <= 0;
    const isPastTop = boundingBox.y <= 0;
    const isPassedBottom = boundingBox.y + boundingBox.height >= gameSize;

    return (
        isPastRightEdge
        || isPastLeftEdge
        || isPastTop
        || isPassedBottom
    );
}


export class Level {
    constructor(n, data) {
        this.number = n;
        this.tileSize = gameSize / data.map.length;
        this.scoreMultiplier = scoreMultipliers[n - 1];

        this.map = data.map;
        this.barriers = data.barriers;
        this.start = data.start;
        this.finish = data.finish;
        this.listedGroceries = data.listedGroceries;

        this.obstacles = structuredClone(data.obstacles);
        this.powerups = structuredClone(data.powerups);
        this.groceries = structuredClone(data.groceries);

        for (const name in this.obstacles) {
            const obstacle = this.obstacles[name];
            obstacle.crossable = obstacle.row.map(() => false);
        }
    }

    /** Returns current level elements.
     */
    getElements() {
        return {
            obstacles: this.obstacles,
            powerups: this.powerups,
            groceries: this.groceries
        };
    }

    /** Returns hitbox of a game element.
     */
    getElementHitbox(category, row, col) {
        const elementSize = this.tileSize * elementSizes[category];
        const elementHitboxSize = elementSize * elementHitboxSizes[category];
        const hitboxX = col * this.tileSize + (this.tileSize - elementHitboxSize) / 2;
        const hitboxY = row * this.tileSize + (this.tileSize - elementHitboxSize) / 2;
        const elementCollisionBox = {
            x: hitboxX,
            y: hitboxY,
            width: elementHitboxSize,
            height: elementHitboxSize
        };
    
        return elementCollisionBox;
    }

    /** Returns if an object collides with the game canvas or other uncrossable element.
     */
    collidesWithBoundary(boundingBox) {
        if (isOutsideCanvas(boundingBox)) {
            return true;
        }
    
        for (let row = 0; row < this.map.length; row++) {
            for (let col = 0; col < this.map[row].length; col++) {
                const tile = this.map[row][col];
                if (this.barriers.includes(tile)) {
                    const barrier = {
                        x: this.tileSize * col,
                        y: this.tileSize * row,
                        width: this.tileSize,
                        height: this.tileSize
                    }
    
                    if (detectCollision(boundingBox, barrier)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }


    // ---------------
    // Obstacles logic
    // ---------------
    
    
    /** Loops through all obstacles and checks for a collision between tiger and the obstacle.
     *  Returns the obstacle name and index.
     */
    getObstacleCollision(tigerHitbox) {
        for (const element in this.obstacles) {
            const obstacle = this.obstacles[element];
            for (let i = 0; i < obstacle.row.length; i++) {
                if (obstacle.crossable[i]) {
                    continue;
                }
                const obstacleHitbox = this.getElementHitbox("obstacles", obstacle.row[i], obstacle.col[i]);
    
                if (detectCollision(tigerHitbox, obstacleHitbox)) {
                    return {
                        name: element,
                        index: i
                    };  
                }
            }
        }
        return null;
    }

    /** Makes the obstacle crossable.
     */ 
    setCrossable(collision) {
        this.obstacles[collision.name].crossable[collision.index] = true;
    }

    /** Resets the walkable state, after the tiger hitbox stops colliding with the obstacle.
     */
    makeObstacleUnwalkable(tigerHitbox) {
        // The obstacles loop.
    
        for (const name in this.obstacles) {
            const obstacle = this.obstacles[name];
            for (let i = 0; i < obstacle.row.length; i++) {
                if (!obstacle.crossable[i]) {
                    continue;
                }
                const obstacleHitbox = this.getElementHitbox("obstacles", obstacle.row[i], obstacle.col[i]);
    
                if (!detectCollision(tigerHitbox, obstacleHitbox)) {
                    obstacle.crossable[i] = false;
                }
            }
        }   
    }

    /** Returns the finish hitbox for current level.
     */
    getFinishHitbox() {
        const elementSize = 0.2 * this.tileSize;
        const finishX = this.finish.col * this.tileSize + (this.tileSize - elementSize) / 2;
        const finishY = this.finish.row * this.tileSize + (this.tileSize - elementSize) / 2;

        const finishCollisionBox = {
            x: finishX,
            y: finishY,
            width: elementSize,
            height: elementSize
        };

        return finishCollisionBox;
    }

    /** Removes specific element from the current level.
     */
    removeElement(category, name, i) {
        const element = this.getElements()[category][name];

        element.row.splice(i, 1);
        element.col.splice(i, 1);
    }
}