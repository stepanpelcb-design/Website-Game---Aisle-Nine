"use strict";

// Game defining variables.

export const gameSize = 750;
export const elementSizes = {
    obstacles: 1,
    powerups: 0.9,
    groceries: 0.8
};
export const elementHitboxSizes = {
    obstacles: 0.7,
    powerups: 0.8,
    groceries: 0.8
};

export const slowSpeedMultiplier = 0.4;
export const scoreMultipliers = [1, 1.5, 2, 2.5, 3, 4];

export const obstaclesPowerups = {
    box: "ladder",
    bananaPeel: "energyDrink",
    angryOldLady: "water",
    spilledLiquid: "mop"
};
export const obstacleEffect = {
    box: "block",
    bananaPeel: "slow",
    angryOldLady: "block",
    spilledLiquid: "slow"
};