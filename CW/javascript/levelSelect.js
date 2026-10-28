"use strict";

// Storing the element id for level select and level screen.
const levelSelect = document.getElementById("levelSelect");
const levelScreen = document.getElementById("levelScreen");
const toLevelSelect = document.getElementById("backToLevelSelect");
const restartButton = document.getElementById("retryLevel");
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

/** Restarts the current level.
 */
function restartLevel() {
    if (level === 0) {
        return;
    }
    stopGame();
    startGame(level);
}

/** Hides the level screen and shows the level select screen. 
 *  Stops the current level loop. 
*/
function backToLevelSelect() {
    refreshUnlockedLevels();
    stopGame();
    levelScreen.hidden = true;
    levelSelect.hidden = false;
    level = 0;
}

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

/** Returns the username from local storage.
 */
function getCurrentUsername() {
    const username = sessionStorage.getItem("loggedInUser");
    if (username === null) {
        return null;
    }
    return JSON.parse(localStorage.getItem(username));
}

/** Returns the unlocked levels for current user.
 */
function getUnlockedLevel() {
    const username = getCurrentUsername();
    if (username === null || username.unlockedLevel === undefined) {
        return 1;
    }
    return username.unlockedLevel;
}

/** Updates the unlocked levels for current user.
 */
function refreshUnlockedLevels() {
    const unlockedLevel = getUnlockedLevel();

    for (let n = 2; n <= 5; n++) {
        const isLocked = n > unlockedLevel;
        document.getElementById("level" + n + "Lock").hidden = !isLocked;
    }
}

// Successfull form fill.

const formType = sessionStorage.getItem("successfullForm");

if (formType !== null) {
    successfullForm(formType);
    sessionStorage.removeItem("successfullForm");
}

// Event listeners and update unlocked levels.

restartButton.addEventListener("click", restartLevel);
toLevelSelect.addEventListener("click", backToLevelSelect);
refreshUnlockedLevels();