"use strict";

// =============
//    Imports
// =============

import { refreshUnlockedLevels } from "../javascript/users.js";
import { startGame, stopGame } from "../javascript/game.js";
import { closeCharacterSelect } from "../javascript/character.js";

// HTML tags.

const levelSelect = document.getElementById("levelSelect");
const levelScreen = document.getElementById("levelScreen");
const toLevelSelect = document.getElementById("backToLevelSelect");
const levelFinished = document.getElementById("levelFinished");
const characterSelectButton = document.getElementById("characterButton");
let level = 0;


/** Hides the level select screen and shows the game level, based on the "n" value.
 *  Calls the game starting function. 
*/
function startLevel(n) {
    level = n
    startGame(n);
    levelScreen.hidden = false;
    levelSelect.hidden = true;
}

/** Hides the level screen and shows the level select screen. 
 *  Stops the current level loop. 
*/
function backToLevelSelect() {
    refreshUnlockedLevels();
    stopGame();
    levelScreen.hidden = true;
    levelSelect.hidden = false;
    showCharacterButton();
    level = 0;
}

document.getElementById("levelFinishedContinueButton").addEventListener("click", continueBackToLevelSelect);

/** Returns the user to the level select, after completing a level.
 */
function continueBackToLevelSelect() {
    levelFinished.hidden = true;
    backToLevelSelect();
}

// Event listener for each level button.

document.querySelectorAll(".buttonLevels").forEach((levelButton) => {
    levelButton.addEventListener("click", () => {
        startLevel(Number(levelButton.dataset.level));
        showCharacterButton();
        closeCharacterSelect();
    });
});

/** Shows the successfull form fill message.
 */
function successfullForm(form) {
    const message = document.getElementById("successfullForm");

    if (form === "register") {
        message.innerHTML = "Successfully Registered!";
    }
    else {
        message.innerHTML = "Successfully Logged In!";
    }

    message.hidden = false;

    setTimeout(() => {
        message.hidden = true;
    }, 5000);
}

// Successfull form fill.

const formType = sessionStorage.getItem("successfullForm");

if (formType !== null) {
    successfullForm(formType);
    sessionStorage.removeItem("successfullForm");
}

toLevelSelect.addEventListener("click", backToLevelSelect);
refreshUnlockedLevels();

/** Shows/hides the charater select button, based on if the game is running.
 */
function showCharacterButton() {
    characterSelectButton.hidden = !levelScreen.hidden;
}