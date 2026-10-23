// ======================================================================================
//                          Initializing the size and the scale
// ======================================================================================

// Getting the canvas element.

const canvas = document.getElementById("game_canvas");

const ctx = canvas.getContext("2d");

const gameSize = 750;

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

// Defining device pixel ratio.

const dpr = window.devicePixelRatio || 1;

// Resizing the canvas size according to the DPR to increase the resolution.

canvas.width = gameSize * dpr;
canvas.height = gameSize * dpr;

// Changing the display size for CSS.

canvas.style.width = gameSize + "px";
canvas.style.height = gameSize + "px";

// Setting the scale of content, based on the DPR.

ctx.scale(dpr, dpr);

// Increasing the image quality.

ctx.imageSmoothingQuality = "high";


// ======================================================================================
//                                   Maze Structure
// ======================================================================================

// Defining the file path for the game structure elements.

const structureFolder = "../../assets/game/game_structure/";

// Defining the file names for the game structural elements.

const structureFiles = {
    "#": ["wall1.png", "wall2.png"],
    ".": ["tiles.png"],
    "S": ["empty.png", "vegiesfruits.png", "bakery.png", "dairy.png", "meat.png", "spices.png", "cans.png", "fish.png"]
};

/** Returns a random element from a list. */

function randomItem(list) {
    return list[Math.floor(Math.random() * list.length)];
}

/** Returns the tile size for the respective "n" level. */

function setTileSize(n) {
    return (gameSize / levels[n].map.length)
}

// creating an empty object for storing structural images.

const structureImages = {};

/** Loads and stores the maze structural images into an object. */

function loadStructureImages(whenDone) {
    // Defining variables for tracking the loop progress.
    let total = Object.values(structureFiles).flat().length;
    let loaded = 0;

    // Loop through each symbol of the structure files.
    Object.keys(structureFiles).forEach((symbol) =>{
        // Creating an empty array inside the object for each symbol.
        structureImages[symbol] = [];

        // Loop through each file of the symbol.
        structureFiles[symbol].forEach((file) =>{
            // Creating an image object and its source.
            let img = new Image();
            img.src = structureFolder + file;

            /** On load, increment the "loaded" variable, and check if all the images are loaded.*/
            img.onload = () => {
                loaded++;

                // When all images are loaded, execute the next function.
                if (loaded === total) {
                    whenDone();
                }
            };

            /** On error, print which image failed to load in the console. */
            img.onerror = () => {
                alert("The image FAILED to load: ", img.src);
            };

            // Storing the image inside the object to the respective symbol array.
            structureImages[symbol].push(img);
        });
    });
}

// Define an array for storing the maze tiles.

let mazeTiles = [];

/** Generates the maze tile by tile and stores the image inside the "mazeTiles" array. */

function generateMaze(map) {
    // Reset the array to empty for each generation.
    mazeTiles = [];

    // Loop through each row.
    for (let row = 0; row < map.length; row++) {
        // create an empty array for each row.
        mazeTiles.push([]);

        // Loop through each column.
        for (let col = 0; col < map[row].length; col++) {
            let symbol = map[row][col];
            // Generate random image for each element.
            let element = randomItem(structureImages[symbol]);
            
            // Add the image to the maze row.
            mazeTiles[row].push(element);
        }
    }
}

/** Goes through the whole "mazeTiles" array, and draws the maze into the canvas using context. */

function drawMaze() {
    // Clearing the whole canvas frame (Setting it to transparent).
    ctx.clearRect(0, 0, gameSize, gameSize);

    // Loop through each tile image.
    for (let row = 0; row < mazeTiles.length; row++) {
        for (let col = 0; col < mazeTiles[row].length; col++) {
            // Drawing the image in the respective position.
            ctx.drawImage(mazeTiles[row][col], col * tileSize, row * tileSize, tileSize, tileSize);
        }
    }
}

// ======================================================================================
//                                     Character
// ======================================================================================

// Creating an image object and its source for the tiger character.

const tigerSheet = new Image();
tigerSheet.src = "../../assets/characters/tiger_maze_sheet.png";

// Defining the dimensions of the tiger sheet.

const sheetWidth = 1024;
const sheetHeight = 1024;

// Defining the dimensions of each frame.

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

    // Movement speed and frame (which frame "image" are we choosing).
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

function setTigerSize(tileSize) {

    // Computing scales for the maze.

    const scaleX = tileSize / frameWidth;
    const scaleY = tileSize / frameHeight;

    // Defining the tiger size with scaling.

    tiger.width = frameWidth * scaleX * 0.9;
    tiger.height = frameHeight * scaleY * 0.9;

    // Defining the tiger hitboxes.

    tiger.hitboxWidth = tiger.width * 0.45;
    tiger.hitboxHeight = tiger.height * 0.7;

    // Defining the tiger speed.

    tiger.speed = tileSize / 25

}

// Defining an object for storing each animation state.

const animations = {
    walkDown: 0,
    idle: 1,
    walkUp: 2,
    walkRight: 3,
    walkLeft: 3
};

// Defining an object for player movement with keys.

const keys = {
    up: false,
    down: false,
    left: false,
    right: false
}

// Tracking the pressed movement keys and assigning the keys value to true.
// Also preventing default functions of those keys, when pressed.

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

// Setting the keys value to false, when not pressed.

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

/** Returns tigers movement "shorter" frame interval if the tiger is moving.
 *  Returns the idle "shorter" tiger time interval, if the tiger is still. */

function getCurrentFrameInterval() {
    if (tiger.moving) {
        return(tiger.frameInterval)
    }
    return(tiger.idleFrameInterval)
}

/** Takes "dx", and "dy" coordinates and after comparing the coordinates,
 *  it returns the direction for the tiger animation. */

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

    // Defining variables for checking positional changes.
    let dx = 0;
    let dy = 0;

    // Checking each key, if being pressed.
    // Storing the movement in directional variables "dx", "dy".

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

    // Storing length of the movement.

    const length =  Math.hypot(dx, dy);

    // Checking if the movement is diagonal.

    if (length > 0) {
        // Decreasing the values, so the diagonal movement is the same speed as horizontal, or vertical.
        dx = dx / length;
        dy = dy / length;
    }

        // Creating variables and checking for collisions of the next move.
    const nextX = tiger.x + dx * speed;
    if (!isMoveBlocked(getTigerHitbox(nextX, tiger.y))) {
        tiger.x = nextX;
    }

    const nextY = tiger.y + dy * speed;
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

    tiger.frameY = animations[tiger.direction]

    tiger.frameTimer++;

    const currentInterval = getCurrentFrameInterval();

    if (tiger.frameTimer >= currentInterval) {
        tiger.frameX = (tiger.frameX + 1) % tiger.maxFrame;
        tiger.frameTimer = 0;
    }

}

function drawTiger() {
    ctx.save();
    if (tiger.direction == "walkLeft") {
        ctx.scale(-1, 1)
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

function setTigerStartPosition(n) {
    const col = levels[n].start.col;
    const row = levels[n].start.row;

    tiger.x = tileSize * col + (tileSize - tiger.width) / 2;
    tiger.y = tileSize * row + (tileSize - tiger.height) / 2;
}



// ======================================================================================
//                                  Collision Detection
// ======================================================================================

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

function checkPickUps() {
    const tigerHitbox = getTigerHitbox(tiger.x, tiger.y);

    const currentPickUpItems = {
        powerups: currentPowerups,
        groceries: currentGroceries
    };

    for (const category in currentPickUpItems) {
        for (const name in currentPickUpItems[category]) {
            const element = currentPickUpItems[category][name];

            for (let i = element.row.length - 1; i >= 0; i--) {
                const elementHitbox = getElementHitbox(category, element.row[i], element.col[i]);

                if (detectCollision(tigerHitbox, elementHitbox)) {
                    if (category === "groceries") {
                        pickUpGroceryItem(name);
                        element.row.splice(i, 1);
                        element.col.splice(i, 1);
                    }
                    else {
                        if (pickUpPowerup(name)) {
                            element.row.splice(i, 1);
                            element.col.splice(i, 1);
                        }
                    }
                }
                else {
                    continue;
                }
            }
        }
    }
}

function resetCrossable() {
    for (const element in currentObstacles) {
        const obstacle = currentObstacles[element];
        obstacle.crossable = obstacle.row.map(() => false);
    }
}

function getObstacleCollision(tigerHitbox) {
    for (const element in currentObstacles) {
        const obstacle = currentObstacles[element];
        for (let i = 0; i < currentObstacles[element].row.length; i++) {
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

function isMoveBlocked(tigerHitbox) {
    if (collidesWithBoundary(tigerHitbox)) {
        return true;
    }

    const collision =   getObstacleCollision(tigerHitbox);

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

function makeObstacleUnwalkable() {
    const tigerHitbox = getTigerHitbox(tiger.x, tiger.y);

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

function getSpeedMultiplier() {
    const tigerHitbox = getTigerHitbox(tiger.x, tiger.y);
    const collision = getObstacleCollision(tigerHitbox)

    if (collision !== null && obstacleEffect[collision.name] === "slow") {
        return slowSpeedMultiplier;
    }
    return 1
}

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


function isInFinish(tigerHitbox) {
    const finishHitbox = getFinishHitbox();

    if (pickedGroceries.length === currentGroceryList.length) {
        if (detectCollision(tigerHitbox, finishHitbox)) {
            return true;
        }
    }
    return false;
}



// ======================================================================================
//             Game Elements (Start, finish, Obstacles, power-ups and groceries)
// ======================================================================================


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


let loadedElementImages = {
    obstacles: {},
    powerups: {},
    groceries: {}
};

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


function pickUpPowerup(name) {
    if (inventory.length < inventorySize) {
        inventory.push(name);
        updateInventory();
        return true;
    }
    return false;
}

function pickUpGroceryItem(name) {
    if (currentGroceryList.includes(name) && !pickedGroceries.includes(name)) {
        pickedGroceries.push(name);
        updateListedGroceries();
        return true;
    }
    return false;
}


function hasPowerupInInventoryFor(obstacleName) {
    const obstaclePowerup = obstaclesPowerups[obstacleName];

    return (inventory.includes(obstaclePowerup));
}

function makeObstacleWalkable(collision) {
    currentObstacles[collision.name].crossable[collision.index] = true;

    const matchingPowerup = obstaclesPowerups[collision.name];
    const position = inventory.indexOf(matchingPowerup);
    inventory.splice(position, 1);
    updateInventory();
}



const startFinishPaths = {
    start: "../../assets/game/game_elements/start.png",
    finish: "../../assets/game/game_elements/finish.png"
};

const startFinish = {};


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

function drawStartFinish(n) {
    const elementSize = 0.9 * tileSize;

    for (const element in startFinish) {
        const img = startFinish[element];
        const type = levels[n][element]
        
        ctx.drawImage(
        img,
        type.col * tileSize + (tileSize - elementSize) / 2, 
        type.row * tileSize + (tileSize - elementSize) / 2, 
        elementSize, 
        elementSize
        );  
    }  
}

function startTimer() {
    if (!(timerState === "waiting")) {
        return;
    }

    timerStartTime = performance.now();
    timerState = "running";
}


function endTimer() {
    if (!(timerState === "running")) {
        return;
    }

    timeElapsed = performance.now() - timerStartTime;
    timerState = "stopped";
}

// ======================================================================================
//                                   HTML Connection
// ======================================================================================

const userInventory = document.getElementById("inventoryItems");

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

const userCurrentListedGroceries = document.getElementById("currentListedGroceries");

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


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

const timerDisplay = document.getElementById("time");

function displayTimer() {
    if (timerState === "running") {
        timeElapsed = performance.now() - timerStartTime;
    }

    timerDisplay.innerHTML = convertTime(timeElapsed);
}

function convertTime(ms) {
    const minutes = String(Math.floor(ms / 60000));
    const seconds = String(Math.floor((ms % 60000) / 1000));
    const msec = String(Math.floor((ms % 1000) / 100));

    return (minutes.padStart(2, "0") + ":" + seconds.padStart(2, "0") + ":" + msec);
}

function resetTimer() {
    timerStartTime = 0;
    timeElapsed = 0;
    timerState = "waiting";
}

// ======================================================================================
//                                   Game Controls
// ======================================================================================

/** Calls all functions for the maze generation, and starts the game loop function.*/

function startGame(n) {
    stopGame();
    currentMap = levels[n].map;
    currentBarriers = levels[n].barriers;
    currentObstacles = structuredClone(levels[n].obstacles);
    currentPowerups = structuredClone(levels[n].powerups);
    currentGroceries = structuredClone(levels[n].groceries);
    currentGroceryList = levels[n].listedGroceries;
    pickedGroceries = [];
    inventory = [];
    updateInventory();
    updateListedGroceries();
    tileSize = setTileSize(n);
    currentLevel = n;
    resetCrossable();
    resetTimer();
    loadStructureImages(() => {
        loadElementImages(() => {
            loadStartFinishImages(() => {
                setTigerSize(tileSize);
                generateMaze(currentMap);
                setTigerStartPosition(n);
                animate();
            });
        },
    n);
    });
}

let endGameFrame = null;

function stopGame() {
    cancelAnimationFrame(endGameFrame);
}

function animate() {
    updateTiger();
    makeObstacleUnwalkable();
    drawMaze();
    checkPickUps();
    drawElementImages();
    drawStartFinish(currentLevel);
    drawTiger();
    if (isFinished()) {
        endTimer();
        displayTimer();
        return;
    }
    displayTimer();
    endGameFrame = requestAnimationFrame(animate);
}

function isFinished() {
    return isInFinish(getTigerHitbox(tiger.x, tiger.y));
}