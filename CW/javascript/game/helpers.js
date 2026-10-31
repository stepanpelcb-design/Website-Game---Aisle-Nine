"use strict";

/** Returns a random element from a list. 
*/
export function randomItem(list) {
    return list[Math.floor(Math.random() * list.length)];
}

/** Returns converted ms time to mm:ss:ms format.
 */
export function convertTime(ms) {
    const minutes = String(Math.floor(ms / 60000));
    const seconds = String(Math.floor((ms % 60000) / 1000));
    const msec = String(Math.floor((ms % 1000) / 100));

    return (minutes.padStart(2, "0") + ":" + seconds.padStart(2, "0") + ":" + msec);
}

/** Returns the score, based on elapsed time and the level score multiplier.
 */
export function countScore(elapsedTime, currentScoreMultiplier) {
    const elapsedSec = Math.floor(elapsedTime / 1000);
    const score = 10000 * currentScoreMultiplier - 75 * elapsedSec;

    if (score < 0) {
        return 0;
    }
    return score;
}

/** Returns if there is a collision for two objects passed.
 */
export function detectCollision(boundingBoxA, boundingBoxB) {
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