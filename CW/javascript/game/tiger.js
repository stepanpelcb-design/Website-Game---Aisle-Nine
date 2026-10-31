"use strict";

// Tigers image paths.

const tigers = {
    default: "../../assets/characters/tiger_default_sheet.png",
    snow: "../../assets/characters/tiger_snow_sheet.png",
    pink: "../../assets/characters/tiger_pink_sheet.png",
    zombie: "../../assets/characters/tiger_zombie_sheet.png",
    insane: "../../assets/characters/tiger_insane_sheet.png"
}

/** Returns the selected tiger if user logged in.
 *  Otherwise, returns default.
 */
function getCurrentTiger() {
    const tiger = localStorage.getItem("character");

    if (tiger === null) {
        return tigers["default"];
    }
    return tigers[tiger];
}

// Tiger sheet and frames, and their sizes.

const tigerSheet = new Image();
tigerSheet.src = getCurrentTiger();

const frameWidth = 256;
const frameHeight = 256;

// Animation states.

const animations = {
    walkDown: 0,
    idle: 1,
    walkUp: 2,
    walkRight: 3,
    walkLeft: 3
};

export class Tiger {
    constructor(tileSize, start) {
        // Size and hitbox.
        this.width = tileSize * 0.9;
        this.height = tileSize * 0.9;
        this.hitboxWidth = this.width * 0.45;
        this.hitboxHeight = this.height * 0.7;

        // Position.
        this.x = tileSize * start.col + (tileSize - this.width) / 2;
        this.y = tileSize * start.row + (tileSize - this.height) / 2;

        // Movement speed and frame.
        this.speed = tileSize / 25;
        this.frameX = 0;
        this.frameY = 1;

        // Animation frames and intervals.
        this.maxFrame = 4;
        this.frameTimer = 0;
        this.frameInterval = 10;
        this.idleFrameInterval = 30;

        // Movement and directions for animation.
        this.moving = false;
        this.direction = "idle";
    }

    /** Returns current tiger hitbox.
     */
    getHitbox(x = this.x, y = this.y) {
        const hitboxX = x + (this.width - this.hitboxWidth) / 2;
        const hitboxY = y + (this.height - this.hitboxHeight) / 2;
        const tigerCollisionBox = {
            x: hitboxX,
            y: hitboxY,
            width: this.hitboxWidth,
            height: this.hitboxHeight
        };

        return tigerCollisionBox;
    }

    /** Returns tigers frame interval, based on its moving state.
    */
    getCurrentFrameInterval() {
        if (this.moving) {
            return(this.frameInterval)
        }
        return(this.idleFrameInterval)
    }

    /** Returns the direction of the next tiger move.
    */
    getDirection(dx, dy) {
        if (dx === 0) {
            if (dy === 0) {
                return "idle";
            }
            else if (dy < 0) {
                return "walkUp";
            }
            else return "walkDown"
        }
        else {
            if (dx < 0) {
                return "walkLeft";
            }
            else return "walkRight";
        }
    }

    /** Checks if there is a tiger movement. If there is, it check for collisions with shelves and walls.
     *  Based on this, it updates the tiger object properties. It also changes the animations,
     *  based on the frame interval. 
    */
    update(dx, dy, speedMultiplier, isMoveBlocked) {
        const speed = this.speed * speedMultiplier;
        const nextX = this.x + dx * speed;
        const nextY = this.y + dy * speed;

        // Tiger update.

        if (!isMoveBlocked(this.getHitbox(nextX, this.y))) {
            this.x = nextX;
        }
        if (!isMoveBlocked(this.getHitbox(this.x, nextY))) {
            this.y = nextY;
        }

        if (dx !== 0 || dy !== 0) {
            this.moving = true;
            this.direction = this.getDirection(dx, dy);
        }
        else {
            this.moving = false;
            this.direction = this.getDirection(0, 0);
        }

        // Tiger animation.

        this.frameY = animations[this.direction];
        this.frameTimer++;
        const currentInterval = this.getCurrentFrameInterval();

        if (this.frameTimer >= currentInterval) {
            this.frameX = (this.frameX + 1) % this.maxFrame;
            this.frameTimer = 0;
        }
    }

    /** Draws the tiger onto the canvas, based on the current state.
     */
    draw(ctx) {
        ctx.save();
        if (this.direction == "walkLeft") {
            ctx.scale(-1, 1);
            ctx.drawImage(
                tigerSheet,
                this.frameX * frameWidth,
                this.frameY * frameHeight,
                frameWidth,
                frameHeight,
                -(this.x + this.width),
                this.y,
                this.width,
                this.height
            );
        }
        else {
            ctx.drawImage(
                tigerSheet,
                this.frameX * frameWidth,
                this.frameY * frameHeight,
                frameWidth,
                frameHeight,
                this.x,
                this.y,
                this.width,
                this.height
            );
        }
        ctx.restore();
    }
}