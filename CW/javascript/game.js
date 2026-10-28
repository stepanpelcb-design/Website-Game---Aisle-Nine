"use strict";

// ======================================================================================
//                          Initializing the size and the scale
// ======================================================================================

// Game logic defining variables.

let tileSize = 0;
let currentLevel = 0;
let currentMap = [];

let currentBarriers = [];
let currentObstacles = [];
let currentPowerups = [];
let currentGroceries = [];

let currentGroceryList = [];
let pickedGroceries = [];
let inventory = [];

const inventorySize = 3;

const slowSpeedMultiplier = 0.4;

let timerState = "waiting";
let timerStartTime = 0;
let timeElapsed = 0;

let currentScoreMultiplier = 1;
const scoreMultipliers = [1, 1.5, 2, 2.5, 3];

const gameSize = 750;

// The canvas size.

const canvas = document.getElementById("game_canvas");
const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio || 1;

canvas.width = gameSize * dpr;
canvas.height = gameSize * dpr;

canvas.style.width = gameSize + "px";
canvas.style.height = gameSize + "px";
ctx.scale(dpr, dpr);


ctx.imageSmoothingQuality = "high";

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
//                                   Maze Structure
// ======================================================================================

// The file path for the game structure elements.

const structureFolder = "../../assets/game/game_structure/";
const structureFiles = {
    "#": ["wall1.png", "wall2.png"],
    ".": ["tiles.png"],
    "S": ["empty.png", "vegiesfruits.png", "bakery.png", "dairy.png", "meat.png", "spices.png", "cans.png", "fish.png"]
};

/** Returns a random element from a list. 
*/
function randomItem(list) {
    return list[Math.floor(Math.random() * list.length)];
}

/** Returns the tile size for the respective "n" level.
*/
function setTileSize(n) {
    return (gameSize / levels[n].map.length);
}

const structureImages = {};

/** Loads and stores the maze structural images into an object.
*/
function loadStructureImages(whenDone) {
    let total = Object.values(structureFiles).flat().length;
    let loaded = 0;

    Object.keys(structureFiles).forEach((symbol) =>{
        structureImages[symbol] = [];
        structureFiles[symbol].forEach((file) =>{
            let img = new Image();
            img.src = structureFolder + file;

            img.onload = () => {
                loaded++;
                if (loaded === total) {
                    whenDone();
                }
            };
            img.onerror = () => {
                alert("The image FAILED to load: ", img.src);
            };
            structureImages[symbol].push(img);
        });
    });
}

let mazeTiles = [];

/** Generates the maze tile by tile and stores the image inside the "mazeTiles" array.
 */
function generateMaze(map) {
    mazeTiles = [];

    for (let row = 0; row < map.length; row++) {
        mazeTiles.push([]);

        for (let col = 0; col < map[row].length; col++) {
            let symbol = map[row][col];
            let element = randomItem(structureImages[symbol]);
            
            mazeTiles[row].push(element);
        }
    }
}

/** Goes through the whole "mazeTiles" array, and draws the maze into the canvas.
*/
function drawMaze() {
    ctx.clearRect(0, 0, gameSize, gameSize);

    for (let row = 0; row < mazeTiles.length; row++) {
        for (let col = 0; col < mazeTiles[row].length; col++) {
            ctx.drawImage(
                mazeTiles[row][col],
                col * tileSize,
                row * tileSize,
                tileSize,
                tileSize
            );
        }
    }
}

// ======================================================================================
//                                     Character
// ======================================================================================

// Tiger sheet and frames, and their sizes.

const tigerSheet = new Image();
tigerSheet.src = "../../assets/characters/tiger_maze_sheet.png";

const sheetWidth = 1024;
const sheetHeight = 1024;

const frameWidth = 256;
const frameHeight = 256;

// The tiger object.

const tiger = {
    // Position and size.
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    hitboxWidth: 0,
    hitboxHeight: 0,

    // Movement speed and frame.
    speed: 0,
    frameX: 0,
    frameY: 1,

    // Animation frames and intervals.
    maxFrame: 4,
    frameTimer: 0,
    frameInterval: 10,
    idleFrameInterval: 30,

    // Movement and directions for animation.
    moving: false,
    direction: "idle"
};

/** Sets the tigers size and speed, based on the current "tileSize".
 */
function setTigerSize(tileSize) {
    const scaleX = tileSize / frameWidth;
    const scaleY = tileSize / frameHeight;

    tiger.width = frameWidth * scaleX * 0.9;
    tiger.height = frameHeight * scaleY * 0.9;

    tiger.hitboxWidth = tiger.width * 0.45;
    tiger.hitboxHeight = tiger.height * 0.7;

    tiger.speed = tileSize / 25;
}

// Tigers keypress movement.

const keys = {
    up: false,
    down: false,
    left: false,
    right: false
}

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

const animations = {
    walkDown: 0,
    idle: 1,
    walkUp: 2,
    walkRight: 3,
    walkLeft: 3
};

/** Returns tigers frame interval, based on its moving state.
*/
function getCurrentFrameInterval() {
    if (tiger.moving) {
        return(tiger.frameInterval)
    }
    return(tiger.idleFrameInterval)
}

/** Returns the direction of the next tiger move.
*/
function getTigerDirection(dx, dy) {
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
 *  based on the frame interval. */
function updateTiger() {
    const speed = tiger.speed * getSpeedMultiplier();

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
    const nextX = tiger.x + dx * speed;
    const nextY = tiger.y + dy * speed;

    // Tiger update.

    if (!isMoveBlocked(getTigerHitbox(nextX, tiger.y))) {
        tiger.x = nextX;
    }
    if (!isMoveBlocked(getTigerHitbox(tiger.x, nextY))) {
        tiger.y = nextY;
    }

    if (dx !== 0 || dy !== 0) {
        tiger.moving = true;
        tiger.direction = getTigerDirection(dx, dy);
        startTimer();
    }
    else {
        tiger.moving = false;
        tiger.direction = getTigerDirection(0, 0);
    }

    // Tiger animation.

    tiger.frameY = animations[tiger.direction];
    tiger.frameTimer++;
    const currentInterval = getCurrentFrameInterval();

    if (tiger.frameTimer >= currentInterval) {
        tiger.frameX = (tiger.frameX + 1) % tiger.maxFrame;
        tiger.frameTimer = 0;
    }
}

/** Draws the tiger onto the canvas, based on the current state.
 */
function drawTiger() {
    ctx.save();
    if (tiger.direction == "walkLeft") {
        ctx.scale(-1, 1);
        ctx.drawImage(
            tigerSheet,
            tiger.frameX * frameWidth,
            tiger.frameY * frameHeight,
            frameWidth,
            frameHeight,
            -(tiger.x + tiger.width),
            tiger.y,
            tiger.width,
            tiger.height
        );
    }
    else {
        ctx.drawImage(
            tigerSheet,
            tiger.frameX * frameWidth,
            tiger.frameY * frameHeight,
            frameWidth,
            frameHeight,
            tiger.x,
            tiger.y,
            tiger.width,
            tiger.height
        );
    }
    ctx.restore();
}

/** Sets the tigers starting position, based on the current level.
 */
function setTigerStartPosition(n) {
    const col = levels[n].start.col;
    const row = levels[n].start.row;

    tiger.x = tileSize * col + (tileSize - tiger.width) / 2;
    tiger.y = tileSize * row + (tileSize - tiger.height) / 2;
}



// ======================================================================================
//                                  Collision Detection
// ======================================================================================


// --------------------
// Game structure logic
// --------------------


/** Returns if there is a collision for two objects passed.
 */
function detectCollision(boundingBoxA, boundingBoxB) {
    const aIsToTheRightOfB = boundingBoxA.x >= boundingBoxB.x + boundingBoxB.width;
    const aIsToTheLeftOfB = boundingBoxA.x + boundingBoxA.width <= boundingBoxB.x;
    const aIsAboveB = boundingBoxA.y + boundingBoxA.height <= boundingBoxB.y;
    const aIsBelowB = boundingBoxA.y >= boundingBoxB.y + boundingBoxB.height;

    return !(
        aIsToTheRightOfB
        || aIsToTheLeftOfB
        || aIsAboveB
        || aIsBelowB
    );
}

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

/** Returns if an object collides with the game canvas or other uncrossable element.
 */
function collidesWithBoundary(boundingBox) {
    if (isOutsideCanvas(boundingBox)) {
        return true;
    }

    for (let row = 0; row < currentMap.length; row++) {
        for (let col = 0; col < currentMap[row].length; col++) {
            const tile = currentMap[row][col];
            if (currentBarriers.includes(tile)) {
                const barrier = {
                    x: tileSize * col,
                    y: tileSize * row,
                    width: tileSize,
                    height: tileSize
                }

                if (detectCollision(boundingBox, barrier)) {
                    return true;
                }
            }
        }
    }
    return false;
}

/** Returns current tiger hitbox.
 */
function getTigerHitbox(x, y) {
    const hitboxX = x + (tiger.width - tiger.hitboxWidth) / 2;
    const hitboxY = y + (tiger.height - tiger.hitboxHeight) / 2;
    const tigerCollisionBox = {
        x: hitboxX,
        y: hitboxY,
        width: tiger.hitboxWidth,
        height: tiger.hitboxHeight
    };

    return tigerCollisionBox;
}


// -------------------
// Game elements logic
// -------------------


/** Returns hitbox of a game element.
 */
function getElementHitbox(category, row, col) {
    const elementSize = tileSize * elementSizes[category];
    const elementHitboxSize = elementSize * elementHitboxSizes[category];
    const hitboxX = col * tileSize + (tileSize - elementHitboxSize) / 2;
    const hitboxY = row * tileSize + (tileSize - elementHitboxSize) / 2;
    const elementCollisionBox = {
        x: hitboxX,
        y: hitboxY,
        width: elementHitboxSize,
        height: elementHitboxSize
    };

    return elementCollisionBox;
}

/** Checks through all pickable elements, and updates the lists if picked up.
 */
function checkPickUps() {
    const tigerHitbox = getTigerHitbox(tiger.x, tiger.y);
    const currentPickUpItems = {
        powerups: currentPowerups,
        groceries: currentGroceries
    };

    // Element loops.

    for (const category in currentPickUpItems) {
        for (const name in currentPickUpItems[category]) {
            const element = currentPickUpItems[category][name];

            for (let i = element.row.length - 1; i >= 0; i--) {
                const elementHitbox = getElementHitbox(category, element.row[i], element.col[i]);

                // Checking pick up.

                if (detectCollision(tigerHitbox, elementHitbox)) {
                    if (category === "groceries") {
                        pickUpGroceryItem(name);
                        element.row.splice(i, 1);
                        element.col.splice(i, 1);
                    }
                    else if (pickUpPowerup(name)) {
                            element.row.splice(i, 1);
                            element.col.splice(i, 1);
                    }
                }
            }
        }
    }
}


// ---------------
// Obstacles logic
// ---------------


/** Loops through all obstacles and checks for a collision between tiger and the obstacle.
 *  Returns the obstacle name and index.
 */
function getObstacleCollision(tigerHitbox) {
    for (const element in currentObstacles) {
        const obstacle = currentObstacles[element];
        for (let i = 0; i < obstacle.row.length; i++) {
            if (obstacle.crossable[i]) {
                continue;
            }
            const obstacleHitbox = getElementHitbox("obstacles", obstacle.row[i], obstacle.col[i]);

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

/** Returns if the next tiger move is blocked, or not.
 */
function isMoveBlocked(tigerHitbox) {
    if (collidesWithBoundary(tigerHitbox)) {
        return true;
    }
    const collision = getObstacleCollision(tigerHitbox);
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
    currentObstacles[collision.name].crossable[collision.index] = true;

    const matchingPowerup = obstaclesPowerups[collision.name];
    const position = inventory.indexOf(matchingPowerup);
    inventory.splice(position, 1);
    powerupUsed.play();
    updateInventory();
}

/** Resets the walkable state, after the tiger hitbox stops colliding with the obstacle.
 */
function makeObstacleUnwalkable() {
    const tigerHitbox = getTigerHitbox(tiger.x, tiger.y);

    // The obstacles loop.

    for (const element in currentObstacles) {
        const obstacle = currentObstacles[element];
        for (let i = 0; i < currentObstacles[element].row.length; i++) {
            if (!obstacle.crossable[i]) {
                continue;
            }
            const elementHitboxes = getElementHitbox("obstacles", obstacle.row[i], obstacle.col[i]);

            if (!detectCollision(tigerHitbox, elementHitboxes)) {
                obstacle.crossable[i] = false;
            }
        }
    }   
}

/** Resets the crossable state of obstacles.
 */
function resetCrossable() {
    for (const element in currentObstacles) {
        const obstacle = currentObstacles[element];
        obstacle.crossable = obstacle.row.map(() => false);
    }
}

/** Returns the slow speed multiplier for slowing obstacles.
 *  Otherwise, returns 1.
 */
function getSpeedMultiplier() {
    const tigerHitbox = getTigerHitbox(tiger.x, tiger.y);
    const collision = getObstacleCollision(tigerHitbox);

    if (collision !== null && obstacleEffect[collision.name] === "slow") {
        return slowSpeedMultiplier;
    }
    return 1;
}


// ------------
// Finish logic
// ------------


/** Returns the finish hitbox for current level.
 */
function getFinishHitbox() {
    const elementSize = 0.2 * tileSize;
    const n = currentLevel;

    const finish = levels[n]["finish"];
    const finishX = finish.col * tileSize + (tileSize - elementSize) / 2;
    const finishY = finish.row * tileSize + (tileSize - elementSize) / 2;

    const finishCollisionBox = {
        x: finishX,
        y: finishY,
        width: elementSize,
        height: elementSize
    };

    return finishCollisionBox;
}

/** After checking if all listed groceries have been picked up,
 *  returns if the tiger hitbox collides with the finish hitbox.
 */
function isFinished() {
    if (pickedGroceries.length !== currentGroceryList.length) {
        return false;
    }
    const tigerHitbox = getTigerHitbox(tiger.x, tiger.y);
    return detectCollision(tigerHitbox, getFinishHitbox());
}


// ======================================================================================
//             Game Elements (Start, finish, Obstacles, power-ups and groceries)
// ======================================================================================


// ----------------
// Loading elements
// ----------------


// Element images paths, and file names.

const elementImagesPaths = {
    obstacles: "../../assets/game/game_elements/obstacles/",
    powerups: "../../assets/game/game_elements/power_ups/",
    groceries: "../../assets/game/game_elements/groceries/"
};
const elementImages = {
    obstacles: {
        box: "fallen_boxes.png",
        bananaPeel: "banana_peel.png",
        angryOldLady: "angry_old_lady.png",
        spilledLiquid: "spilled_liquid.png"
    },
    powerups: {
        ladder: "ladder.png",
        energyDrink: "energy_drink.png",
        water: "water.png",
        mop: "mop.png"
    },
    groceries: {
        apple: "apple.png",
        beans: "beans.png",
        bread: "bread.png",
        butter: "butter.png",
        carrot: "carrot.png",
        cereal: "cereal.png",
        cheese: "cheese.png",
        eggs: "eggs.png",
        grapes: "grapes.png",
        milk: "milk.png",
        onion: "onion.png",
        orange: "orange.png",
        pasta: "pasta.png",
        pepper: "pepper.png",
        tomatto: "tomatto.png",
        yoghurt: "yoghurt.png"
    }
};
const startFinishPaths = {
    start: "../../assets/game/game_elements/start.png",
    finish: "../../assets/game/game_elements/finish.png"
};

// Functional variables.

const elementSizes = {
    obstacles: 1,
    powerups: 0.9,
    groceries: 0.8
};
const elementHitboxSizes = {
    obstacles: 0.7,
    powerups: 0.8,
    groceries: 0.8
};
const obstaclesPowerups = {
    box: "ladder",
    bananaPeel: "energyDrink",
    angryOldLady: "water",
    spilledLiquid: "mop"
};
const obstacleEffect = {
    box: "block",
    bananaPeel: "slow",
    angryOldLady: "block",
    spilledLiquid: "slow"
};
let loadedElementImages = {
    obstacles: {},
    powerups: {},
    groceries: {}
};
const startFinish = {};

/** Loads the element images into an object.
 */
function loadElementImages(whenDone, n) {
    Object.keys(loadedElementImages).forEach((type) => {
        loadedElementImages[type] = {};
    });
    const level = levels[n];
    const elementTypes = ["obstacles", "powerups", "groceries"];
    let total = 0;
    let loaded = 0;

    for (let elementType = 0; elementType < elementTypes.length; elementType++) {
        total += Object.keys(level[elementTypes[elementType]]).length;
    }

    if (total === 0) {
        return whenDone();
    }

    for (let elementType = 0; elementType < elementTypes.length; elementType++) {
        const category = elementTypes[elementType];

        for (const name in level[category]) {
            let img = new Image();
            img.src = elementImagesPaths[category] + elementImages[category][name];

            img.onload = () => {
                loaded++;
                loadedElementImages[category][name] = img;
                if (loaded === total) {
                    whenDone();
                }
            };
            img.onerror = () => {
                loaded++;
                console.log("The element image FAILED to load: ", img.src);
                if (loaded === total) {
                    whenDone();
                }
            };
        }
    }
}

/** Drawing each element image onto the canvas, in respect to its position.
 */
function drawElementImages() {
    const currentElements = {
        obstacles: currentObstacles,
        powerups: currentPowerups,
        groceries: currentGroceries
    };
    for (const category in currentElements) {
        for (const name in currentElements[category]) {
            if (!loadedElementImages[category][name]) {
                continue;
            }

            const elementSize = tileSize * elementSizes[category];
            const img = loadedElementImages[category][name];
            const element = currentElements[category][name];

            for (let i = 0; i < element.row.length; i++) {
                ctx.drawImage(
                    img,
                    element.col[i] * tileSize + (tileSize - elementSize) / 2, 
                    element.row[i] * tileSize + (tileSize - elementSize) / 2, 
                    elementSize, 
                    elementSize
                );
            }
        }
    }
}

/** Loads the start and finish images into an object.
 */
function loadStartFinishImages(whenDone) {
    const total = Object.keys(startFinishPaths).length;
    let loaded = 0;

    for (const element in startFinishPaths) {
        let img = new Image();
        img.src = startFinishPaths[element];

        img.onload = () => {
            loaded++;
            startFinish[element] = img;
            if (loaded === total) {
                whenDone();
            }
        };
        img.onerror = () => {
            loaded++;
            console.log("The element image FAILED to load: ", img.src);
            if (loaded === total) {
                whenDone();
            }
        };
    }
}

/** Draws the start and finish onto the canvas for the respective level.
 */
function drawStartFinish(n) {
    const elementSize = 0.9 * tileSize;

    for (const element in startFinish) {
        const img = startFinish[element];
        const type = levels[n][element];
        
        ctx.drawImage(
        img,
        type.col * tileSize + (tileSize - elementSize) / 2, 
        type.row * tileSize + (tileSize - elementSize) / 2, 
        elementSize, 
        elementSize
        );  
    }  
}

// -------------------------------
// Functionalities of the elements
// -------------------------------

/** Pushes the powerup item into the inventory, if it is not full.
 */
function pickUpPowerup(name) {
    if (inventory.length < inventorySize) {
        inventory.push(name);
        updateInventory();
        powerupPickUp.play();
        return true;
    }
    return false;
}

/** Pushes the item inside the picked up groceries list.
 */
function pickUpGroceryItem(name) {
    if (currentGroceryList.includes(name) && !pickedGroceries.includes(name)) {
        pickedGroceries.push(name);
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
    const obstaclePowerup = obstaclesPowerups[obstacleName];

    return (inventory.includes(obstaclePowerup));
}


// ---------------------
// Timer and score logic
// ---------------------


/** Starts counting the elapsed time and background music.
 */
function startTimer() {
    if (!(timerState === "waiting")) {
        return;
    }

    backgroundMusic.play();
    timerStartTime = performance.now();
    timerState = "running";
}

/** Stops the time counting and background music.
 */
function endTimer() {
    if (!(timerState === "running")) {
        return;
    }

    backgroundMusic.pause();
    timeElapsed = performance.now() - timerStartTime;
    timerState = "stopped";
}

/** Returns the score, based on elapsed time and the level score multiplier.
 */
function countScore(elapsedTime) {
    const elapsedSec = Math.floor(elapsedTime / 1000);
    const score = 10000 * currentScoreMultiplier - 75 * elapsedSec;

    if (score < 0) {
        return 0;
    }
    return score;
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

    for (let i = 0; i < inventory.length; i++) {
        const img = loadedElementImages.powerups[inventory[i]];
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

    for (let i = 0; i < currentGroceryList.length; i++) {
        const grocery = capitalizeFirstLetter(currentGroceryList[i]);
        if (pickedGroceries.includes(currentGroceryList[i])) {
            userCurrentListedGroceries.innerHTML += "<span class='picked'>" + grocery + "</span><br>";
        }
        else {
        userCurrentListedGroceries.innerHTML += "<span>" + grocery + "</span><br>";
        }
    }
}

/** Updates the highest score, based on a comparison of the current user highest score with new score.
 */
function updateScore(level, newScore) {
    const user = getCurrentUsername();
    if (user === null) {
        return;
    }
    if (newScore > user.levelScore[level - 1]) {
        user.levelScore[level - 1] = newScore;
        localStorage.setItem(user.username, JSON.stringify(user));
    }
}

/** Displays the current elapsed time.
 */
function displayTimer() {
    if (timerState === "running") {
        timeElapsed = performance.now() - timerStartTime;
    }

    timerDisplay.innerHTML = convertTime(timeElapsed);
}

/** Resets all the timer variables.
 */
function resetTimer() {
    timerStartTime = 0;
    timeElapsed = 0;
    timerState = "waiting";
}

/** Returns converted ms time to mm:ss:ms format.
 */
function convertTime(ms) {
    const minutes = String(Math.floor(ms / 60000));
    const seconds = String(Math.floor((ms % 60000) / 1000));
    const msec = String(Math.floor((ms % 1000) / 100));

    return (minutes.padStart(2, "0") + ":" + seconds.padStart(2, "0") + ":" + msec);
}

/** Returns a string with capitalized first letter.
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}


// ======================================================================================
//                                   Game Controls
// ======================================================================================

// Respective HTML tags.

const finalTime = document.getElementById("finalTime");
const finalScore = document.getElementById("finalScore");
const levelFinished = document.getElementById("levelFinished");

/** Calls all functions for the maze generation, and starts the game loop function.
*/
function startGame(n) {
    // Ending running levels.
    stopGame();
    // Current level variables.
    currentMap = levels[n].map;
    currentBarriers = levels[n].barriers;
    currentObstacles = structuredClone(levels[n].obstacles);
    currentPowerups = structuredClone(levels[n].powerups);
    currentGroceries = structuredClone(levels[n].groceries);
    currentGroceryList = levels[n].listedGroceries;
    currentScoreMultiplier = scoreMultipliers[n - 1];
    currentLevel = n;
    tileSize = setTileSize(n);
    // Variables reset.
    pickedGroceries = [];
    inventory = [];
    updateInventory();
    updateListedGroceries();
    resetCrossable();
    resetTimer();
    // Game images loading.
    loadStructureImages(() => {
        loadElementImages(() => {
            loadStartFinishImages(() => {
                setTigerSize(tileSize);
                generateMaze(currentMap);
                setTigerStartPosition(n);
                // Animation loop.
                animate();
            });
        },
    n);
    });
}

/** Loops over all game logic functions, using the animation frame.
 */
function animate() {
    updateTiger();
    makeObstacleUnwalkable();
    drawMaze();
    checkPickUps();
    drawElementImages();
    drawStartFinish(currentLevel);
    drawTiger();
    // Is finished break of the loop.
    if (isFinished()) {
        levelFinish.play();
        endTimer();
        displayTimer();
        // Results show.
        finalTime.innerHTML = convertTime(timeElapsed);
        finalScore.innerHTML = countScore(timeElapsed);
        levelFinished.hidden = false;
        // User progress update.
        updateUnlockedLevels(currentLevel);
        updateScore(currentLevel, countScore(timeElapsed));
        return;
    }
    displayTimer();
    endGameFrame = requestAnimationFrame(animate);
}

let endGameFrame = null;

/** Breaks the animation frame (ends the game), and stops the background music.
 */
function stopGame() {
    backgroundMusic.pause();
    cancelAnimationFrame(endGameFrame);
}