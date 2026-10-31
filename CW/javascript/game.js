"use strict";

// =============
//    Imports
// =============

import {updateScore, updateUnlockedLevels, capitalizeFirstLetter} from "../javascript/users.js";
import { Tiger } from "../javascript/game/tiger.js";
import { Timer } from "../javascript/game/timer.js";
import { Inventory } from "../javascript/game/inventory.js";
import { ShoppingList } from "../javascript/game/shoppingList.js";
import { slowSpeedMultiplier, obstacleEffect, obstaclesPowerups } from "../javascript/game/config.js";
import { Renderer } from "../javascript/game/renderer.js";
import { detectCollision, convertTime, countScore } from "../javascript/game/helpers.js";
import { Level } from "../javascript/game/level.js";
import { levels } from "../javascript/levels.js";

// ======================================================================================
//                                       Audio
// ======================================================================================

// Audio effects.

const groceryPickUp = new Audio("../../assets/sound_effects/grocery_pick_up.mp3");
const ListedgroceryPickUp = new Audio("../../assets/sound_effects/listed_grocery_pick_up.mp3");
const powerupPickUp = new Audio("../../assets/sound_effects/powerup_pick_up.mp3");
const powerupUsed = new Audio("../../assets/sound_effects/powerup_used.mp3");
const levelFinish = new Audio("../../assets/sound_effects/level_finish.mp3");
const backgroundMusic = new Audio("../../assets/sound_effects/background_music.mp3");

backgroundMusic.loop = true;
backgroundMusic.volume = 0.6;
groceryPickUp.volume = 1;
ListedgroceryPickUp.volume = 0.8;
powerupPickUp.volume = 1;
powerupUsed.volume = 1;
levelFinish.volume = 0.9;

/** Disables the default actions of the sound control buttons and keys.
 */
function disableMediaKeys() {
    if (!("mediaSession" in navigator)) {
        return;
    }
    const actions = ["play", "stop", "pause", "previoustrack", "nexttrack", "seekbackward", "seekforward", "seekto"];

    for (let i = 0; i < actions.length; i++) {
        try {
            navigator.mediaSession.setActionHandler(actions[i], function() {});
        }
        catch (error) {
            continue;
        }
    }
}

disableMediaKeys();


// ======================================================================================
//                                     Movement
// ======================================================================================


// Tiger movement directions.

const keys = {
    up: false,
    down: false,
    left: false,
    right: false
}

// Event listeners.

addEventListener("keydown", e => {
    switch(e.key) {
        // Movement Up
        case "w":
        case "ArrowUp":
            keys.up = true;
            e.preventDefault();
            break;
        // Movement Down
        case "s":
        case "ArrowDown":
            keys.down = true;
            e.preventDefault();
            break;
        // Movement Left
        case "a":
        case "ArrowLeft":
            keys.left = true;
            e.preventDefault();
            break;
        // Movement Right
        case "d":
        case "ArrowRight":
            keys.right = true;
            e.preventDefault();
            break;
        
    }
});

addEventListener("keyup", e => {
    switch(e.key) {
        // Movement Up
        case "w":
        case "ArrowUp":
            keys.up = false;
            break;
        // Movement Down
        case "s":
        case "ArrowDown":
            keys.down = false;
            break;
        // Movement Left
        case "a":
        case "ArrowLeft":
            keys.left = false;
            break;
        // Movement Right
        case "d":
        case "ArrowRight":
            keys.right = false;
            break;
    }
});

/** Returns the input movement values.
 *  Smaller movements for diagonal movement.
 */
function getMovementInput() {
    // Movement checks.
    let dx = 0;
    let dy = 0;

    if (keys.up) {
        dy -= 1;
    }
    if (keys.down) {
        dy += 1;
    }
    if (keys.left) {
        dx -= 1;
    }
    if (keys.right) {
        dx += 1;
    }   

    const length =  Math.hypot(dx, dy);

    // Diagonal movement speed.

    if (length > 0) {
        dx = dx / length;
        dy = dy / length;
    }
    return {dx, dy};
}


// ======================================================================================
//                                  Collision Detection
// ======================================================================================


/** Checks through all pickable elements, and updates the lists if picked up.
 */
function checkPickUps() {
    const tigerHitbox = tiger.getHitbox();
    const elements = level.getElements();
    const currentPickUpItems = {
        powerups: elements.powerups,
        groceries: elements.groceries
    };

    // Element loops.

    for (const category in currentPickUpItems) {
        for (const name in currentPickUpItems[category]) {
            const element = currentPickUpItems[category][name];

            for (let i = element.row.length - 1; i >= 0; i--) {
                const elementHitbox = level.getElementHitbox(category, element.row[i], element.col[i]);

                // Checking pick up.

                if (detectCollision(tigerHitbox, elementHitbox)) {
                    if (category === "groceries") {
                        pickUpGroceryItem(name);
                        level.removeElement("groceries", name, i);
                    }
                    else if (pickUpPowerup(name)) {
                            level.removeElement("powerups", name, i);
                    }
                }
            }
        }
    }
}

/** Returns if the next tiger move is blocked, or not.
 */
function isMoveBlocked(tigerHitbox) {
    if (level.collidesWithBoundary(tigerHitbox)) {
        return true;
    }
    const collision = level.getObstacleCollision(tigerHitbox);
    if (collision === null) {
        return false;
    }
    if (hasPowerupInInventoryFor(collision.name)) {
        makeObstacleWalkable(collision);
        return false;
    }
    if (obstacleEffect[collision.name] === "slow") {
        return false;
    }

    return true;
}

/** Makes the obstacle crossable.
 *  Removes the matching powerup from the inventory.
 */
function makeObstacleWalkable(collision) {
    level.setCrossable(collision);

    const matchingPowerup = obstaclesPowerups[collision.name];
    inventory.remove(matchingPowerup);
    powerupUsed.play();
    updateInventory();
}

/** Returns the slow speed multiplier for slowing obstacles.
 *  Otherwise, returns 1.
 */
function getSpeedMultiplier() {
    const tigerHitbox = tiger.getHitbox();
    const collision = level.getObstacleCollision(tigerHitbox);

    if (collision !== null && obstacleEffect[collision.name] === "slow") {
        return slowSpeedMultiplier;
    }
    return 1;
}

/** After checking if all listed groceries have been picked up,
 *  returns if the tiger hitbox collides with the finish hitbox.
 */
function isFinished() {
    if (!shoppingList.isCompleted()) {
        return false;
    }
    const tigerHitbox = tiger.getHitbox();
    return detectCollision(tigerHitbox, level.getFinishHitbox());
}


// ======================================================================================
//             Game Elements (Start, finish, Obstacles, power-ups and groceries)
// ======================================================================================


/** Pushes the powerup item into the inventory, if it is not full.
 */
function pickUpPowerup(name) {
    if (inventory.add(name)) {
        updateInventory();
        powerupPickUp.play();
        return true;
    }
    return false;
}

/** Pushes the item inside the picked up groceries list.
 */
function pickUpGroceryItem(name) {
    if (shoppingList.pick(name)) {
        updateListedGroceries();
        ListedgroceryPickUp.play();
        return true;
    }
    groceryPickUp.play();
    return false;
}

/** Returns if the matching powerup is inside the inventory.
 */
function hasPowerupInInventoryFor(obstacleName) {
    return (inventory.has(obstaclesPowerups[obstacleName]));
}

// ======================================================================================
//                                   HTML Connection
// ======================================================================================

// Respective HTML tags.

const userInventory = document.getElementById("inventoryItems");
const userCurrentListedGroceries = document.getElementById("currentListedGroceries");
const timerDisplay = document.getElementById("time");

/** Updates the inventory powerup images.
 */
function updateInventory() {
    userInventory.innerHTML = "";

    for (let i = 0; i < inventory.items.length; i++) {
        const img = renderer.getImage("powerups", inventory.items[i]);
        if (!img) {
            continue;
        }
        const copy = img.cloneNode();
        userInventory.appendChild(copy);
    }
}

/** Updates the listed groceries, based on if they got picked up.
 */
function updateListedGroceries() {
    userCurrentListedGroceries.innerHTML = "";

    for (let i = 0; i < shoppingList.items.length; i++) {
        const grocery = capitalizeFirstLetter(shoppingList.items[i]);
        if (shoppingList.isPicked(shoppingList.items[i])) {
            userCurrentListedGroceries.innerHTML += "<span class='picked'>" + grocery + "</span><br>";
        }
        else {
        userCurrentListedGroceries.innerHTML += "<span>" + grocery + "</span><br>";
        }
    }
}

/** Displays the current elapsed time.
 */
function displayTimer() {
    const displayTime = timer.getElapsed();

    timerDisplay.innerHTML = convertTime(displayTime);
}


// ======================================================================================
//                                   Game Controls
// ======================================================================================

// Respective HTML tags.

const finalTime = document.getElementById("finalTime");
const finalScore = document.getElementById("finalScore");
const levelFinished = document.getElementById("levelFinished");

// Predefined variables for game logic.

let tiger = null;
const timer = new Timer();
let inventory = null;
const inventorySize = 3;
let shoppingList = null;
const renderer = new Renderer(document.getElementById("game_canvas"));
let level = null;

/** Calls all functions for the maze generation, and starts the game loop function.
*/
export function startGame(n) {
    // Ending running levels.
    stopGame();

    // Current level variables.
    level = new Level(n, levels[n]);
    shoppingList = new ShoppingList(level.listedGroceries);

    // Variables reset.
    inventory = new Inventory(inventorySize);
    updateInventory();
    updateListedGroceries();
    timer.reset();

    // Game images loading.
    renderer.loadImages(level, () => {
        renderer.generateMaze(level.map);
        tiger = new Tiger(level.tileSize, level.start);

        // Animation loop.
        animate();
    });
}

/** Loops over all game logic functions, using the animation frame.
 */
function animate() {
    // Tiger updates.
    const {dx, dy} = getMovementInput();
    tiger.update(dx, dy, getSpeedMultiplier(), isMoveBlocked);
    if (tiger.moving && timer.start()) {
        backgroundMusic.play();
    }
    level.makeObstacleUnwalkable(tiger.getHitbox());

    // Drawing the tiger, maze and its elements.
    renderer.drawMaze(level.tileSize);
    checkPickUps();
    renderer.drawElements(level.getElements(), level.tileSize);
    renderer.drawStartFinish(level, level.tileSize);
    tiger.draw(renderer.ctx);

    // Is finished break of the loop.
    if (isFinished()) {
        levelFinish.play();
        timer.stop();
        backgroundMusic.pause();
        displayTimer();

        // Results show.
        const finalMS = timer.getElapsed();
        const score = countScore(finalMS, level.scoreMultiplier);
        finalTime.innerHTML = convertTime(finalMS);
        finalScore.innerHTML = score;
        levelFinished.hidden = false;

        // User progress update.
        updateUnlockedLevels(level.number);
        updateScore(level.number, score);
        return;
    }

    displayTimer();
    endGameFrame = requestAnimationFrame(animate);
}

const restartButton = document.getElementById("retryLevel");
restartButton.addEventListener("click", restartLevel);

/** Restarts the current level.
 */
function restartLevel() {
    if (level === null) {
        return;
    }
    stopGame();
    startGame(level.number);
}

let endGameFrame = null;

/** Breaks the animation frame (ends the game), and stops the background music.
 */
export function stopGame() {
    backgroundMusic.pause();
    cancelAnimationFrame(endGameFrame);
}