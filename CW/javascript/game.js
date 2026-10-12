// Getting the canvas element

const canvas = document.getElementById("game_canvas");

// Specifying the 2D drawing tool

const ctx = canvas.getContext("2d");

// Defining the game window size (width and height) based on the device pixel ratio

const gameSize = 750
const dpr = window.devicePixelRatio || 1;

canvas.width = gameSize * dpr;
canvas.height = gameSize * dpr;
canvas.style.width = gameSize + "px";
canvas.style.height = gameSize + "px";

// Scaling the size and increasing the image quality

ctx.scale(dpr, dpr);
ctx.imageSmoothingQuality = "high";

// ===================
// Structural Elements
// ===================

// Defining the file path for the game structure elements

const structureFolder = "../../assets/game/game_structure/"

// Defining the file names for the game structure elements

const structureFiles = {
    "#": ["wall1.png", "wall2.png"],
    ".": ["tiles.png"],
    "S": ["empty.png", "vegiesfruits.png", "bakery.png", "dairy.png", "meat.png", "spices.png", "cans.png", "fish.png"]
};

const structureImages = {};

function loadStructureImages(whenDone) {
    const total = Object.values(structureFiles).flat().length;
    let loaded = 0;

    Object.keys(structureFiles).forEach((symbol) => {
        structureImages[symbol] = [];

        structureFiles[symbol].forEach((file) => {
            const img = new Image();

            img.onload = () => {
                loaded++;
                if (loaded === total) { 
                    whenDone();
                }
            };

            img.onerror = () => {
                console.log("picture FAILED to load:", img.src);
            };

            img.src = structureFolder + file;
            structureImages[symbol].push(img);
        });
    });
};

function randomFrom(list) {
    return list[Math.floor(Math.random() * list.length)];
};


const squareSize = 75;

let mazeSquares = [];

function buildMaze(map) {
    mazeSquares = [];

    for (let row = 0; row < map.length; row++) {
        mazeSquares.push([]);

        for (let col = 0; col < map[row].length; col++) {
            const symbol = map[row][col];
            const image = randomFrom(structureImages[symbol]);
            mazeSquares[row].push(image);
        }
    }
}


function drawMaze() {
    ctx.clearRect(0, 0, gameSize, gameSize);

    for (let row = 0; row < mazeSquares.length; row++) {
        for (let col = 0; col < mazeSquares[row].length; col++) {
            ctx.drawImage(mazeSquares[row][col], col * squareSize, row * squareSize, squareSize, squareSize);
        }
    }
}

// ===============
// Tiger Character
// ===============

const tigerMazeChar = "../../assets/characters/maze_character.png";

let tigerImage;

const tiger = {
    x: 0,
    y: 0,
    size: squareSize,
    angle: Math.PI / 2
};

const tigerSpeed = 200;



function loadTigerImage(whenDone) {
    tigerImage = new Image();

    tigerImage.onload = whenDone;

    tigerImage.onerror = () => {
        console.log("Picture FAILED to load the tiger maze character.", tigerImage.src);
    };

    tigerImage.src = tigerMazeChar
}

function placeTiger(start) {
    tiger.x = start.col * squareSize
    tiger.y = start.row * squareSize
}

const tigerFacing = Math.PI / 2;

function drawTiger() {
    ctx.save();

    ctx.translate(tiger.x +tiger.size / 2, tiger.y + tiger.size / 2);
    ctx.rotate(tiger.angle - tigerFacing);
    ctx.drawImage(tigerImage, -tiger.size / 2, -tiger.size / 2, tiger.size, tiger.size);

    ctx.restore();
}

// =================
// Keyboard Movement
// =================

const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

const keyToDirection = {
    "ArrowUp": "up",
    "KeyW": "up",
    "ArrowDown": "down",
    "KeyS": "down",
    "ArrowLeft": "left",
    "KeyA": "left",
    "ArrowRight": "right",
    "KeyD": "right"
};


document.addEventListener("keydown", (event) => {
    const direction = keyToDirection[event.code];

    if (direction) {
        keys[direction] = true;
        event.preventDefault();
    }
});

document.addEventListener("keyup", (event) => {
    const direction = keyToDirection[event.code];

    if (direction) {
        keys[direction] = false;
    }
});

window.addEventListener("blur", () => {
    keys.up = false;
    keys.down = false;
    keys.left = false;
    keys.right = false
});


let animationId = null;
let lastTime = 0;

function updateTiger(dt) {
    let dx = 0;
    let dy = 0;

    if (keys.up) {dy -= 1};
    if (keys.down) {dy += 1};
    if (keys.left) {dx -= 1};
    if (keys.right) {dx += 1};

    const length = Math.hypot(dx, dy);

    if (length > 0) {
        dx = dx / length;
        dy = dy / length;
    }

    tiger.angle = getFacingAngle(dx, dy);

    tiger.x += dx * tigerSpeed * dt;
    tiger.y += dy * tigerSpeed * dt;

}

function getFacingAngle(dx, dy) {
    return Math.atan2(dy, dx);
}

function gameLoop(time) {
    let dt = 0;

    if (lastTime !== 0) {
        dt = (time - lastTime) / 1000;
    }

    lastTime = time;

    if (dt > 0.05) {
        dt = 0.05;
    }

    updateTiger(dt);

    drawMaze();
    drawTiger();

    animationId = requestAnimationFrame(gameLoop);
}

function startLoop() {
    cancelAnimationFrame(animationId);
    lastTime = 0;
    animationId = requestAnimationFrame(gameLoop);
}

function stopGame() {
    cancelAnimationFrame(animationId);
}


// ================
// Running the game
// ================

function startGame(n) {
    loadStructureImages(() => {
        loadTigerImage(() => {
            buildMaze(levels[n].map);
            placeTiger(levels[n].start);
            startLoop();
        });
    });
}


