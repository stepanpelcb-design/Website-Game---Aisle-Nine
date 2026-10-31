"use strict";

// =============
//    Imports
// =============

import { gameSize, elementSizes } from "./config.js";
import { randomItem } from "./helpers.js";


// ===========================
//       Paths and Files
// ===========================


// The file path for the game structural elements.

const structureFolder = "../../assets/game/game_structure/";
const structureFiles = {
    "#": ["wall1.png", "wall2.png"],
    ".": ["tiles.png"],
    "S": ["empty.png", "vegiesfruits.png", "bakery.png", "dairy.png", "meat.png", "spices.png", "cans.png", "fish.png"]
};

// Element image paths, and file names.

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

export class Renderer {
    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;

        canvas.width = gameSize * dpr;
        canvas.height = gameSize * dpr;

        canvas.style.width = gameSize + "px";
        canvas.style.height = gameSize + "px";
        this.ctx.scale(dpr, dpr);


        this.ctx.imageSmoothingQuality = "high";

        this.structureImages = {};
        this.mazeTiles = [];
        this.loadedElementImages = {
            obstacles: {},
            powerups: {},
            groceries: {}
        };
        this.startFinish = {};
    }

    // ---------------
    // Loading images.
    // ---------------

    /** Loads all the images, by calling loading functions.
     */
    loadImages(level, whenDone) {
        this.loadStructureImages(() => {
            this.loadElementImages(level, () => {
                this.loadStartFinishImages(whenDone);
            });
        });
    }

    /** Loads and stores the maze structural images into an object.
    */
    loadStructureImages(whenDone) {
        let total = Object.values(structureFiles).flat().length;
        let loaded = 0;

        Object.keys(structureFiles).forEach((symbol) =>{
            this.structureImages[symbol] = [];
            structureFiles[symbol].forEach((file) =>{
                const img = new Image();
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
                this.structureImages[symbol].push(img);
            });
        });
    }

    /** Loads the element images into an object.
     */
    loadElementImages(level, whenDone) {
        Object.keys(this.loadedElementImages).forEach((type) => {
            this.loadedElementImages[type] = {};
        });
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
                    this.loadedElementImages[category][name] = img;
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

    /** Loads the start and finish images into an object.
     */
    loadStartFinishImages(whenDone) {
        const total = Object.keys(startFinishPaths).length;
        let loaded = 0;

        for (const element in startFinishPaths) {
            let img = new Image();
            img.src = startFinishPaths[element];

            img.onload = () => {
                loaded++;
                this.startFinish[element] = img;
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

    /** Returns the element image based on the category and name.
     */
    getImage(category, name) {
        return this.loadedElementImages[category][name];
    }


    // ---------------
    // drawing images.
    // ---------------


    /** Generates the maze tile by tile and stores the image inside the "mazeTiles" array.
     */
    generateMaze(map) {
        this.mazeTiles = [];

        for (let row = 0; row < map.length; row++) {
            this.mazeTiles.push([]);

            for (let col = 0; col < map[row].length; col++) {
                let symbol = map[row][col];
                let element = randomItem(this.structureImages[symbol]);
                
                this.mazeTiles[row].push(element);
            }
        }
    }

    /** Goes through the whole "mazeTiles" array, and draws the maze into the canvas.
    */
    drawMaze(tileSize) {
        this.ctx.clearRect(0, 0, gameSize, gameSize);

        for (let row = 0; row < this.mazeTiles.length; row++) {
            for (let col = 0; col < this.mazeTiles[row].length; col++) {
                this.ctx.drawImage(
                    this.mazeTiles[row][col],
                    col * tileSize,
                    row * tileSize,
                    tileSize,
                    tileSize
                );
            }
        }
    }

    /** Drawing each element image onto the canvas, in respect to its position.
     */
    drawElements(elements, tileSize) {
        for (const category in elements) {
            for (const name in elements[category]) {
                if (!this.loadedElementImages[category][name]) {
                    continue;
                }
    
                const elementSize = tileSize * elementSizes[category];
                const img = this.loadedElementImages[category][name];
                const element = elements[category][name];
                
                for (let i = 0; i < element.row.length; i++) {
                    this.ctx.drawImage(
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
    
    /** Draws the start and finish onto the canvas for the respective level.
     */
    drawStartFinish(level, tileSize) {
        const elementSize = 0.9 * tileSize;
    
        for (const element in this.startFinish) {
            const img = this.startFinish[element];
            const type = level[element];
            
            this.ctx.drawImage(
            img,
            type.col * tileSize + (tileSize - elementSize) / 2, 
            type.row * tileSize + (tileSize - elementSize) / 2, 
            elementSize, 
            elementSize
            );  
        }  
    }
}