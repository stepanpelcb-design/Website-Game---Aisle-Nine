// Storing the element id for level select and level screen.
const levelSelect = document.getElementById("level_select");
const levelScreen = document.getElementById("level_screen");
const toLevelSelect = document.getElementById("back_to_level_select");


/** Hides the level select screen and shows the game level, based on the "n" value.
 *  Calls the game starting function. */

function startLevel(n) {
    levelScreen.hidden = false;
    levelSelect.hidden = true;
    startGame(n);
}

/** Hides the level screen and shows the level select screen. 
 *  Stops the current level loop. */

function backToLevelSelect() {
    levelScreen.hidden = true;
    levelSelect.hidden = false;
    stopGame();
}

// Checking if the button is pressed for every level.

document.querySelectorAll(".level").forEach((levelButton) => {
    levelButton.addEventListener("click", () => {
        // Calling the "startLevel" function with respective "n" value.
        startLevel(Number(levelButton.dataset.level));
    });
});


toLevelSelect.addEventListener("click", backToLevelSelect);
