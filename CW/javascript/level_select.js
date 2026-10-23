// Storing the element id for level select and level screen.
const levelSelect = document.getElementById("levelSelect");
const levelScreen = document.getElementById("levelScreen");
const toLevelSelect = document.getElementById("backToLevelSelect");
const restartButton = document.getElementById("retryLevel");
let level = 0;


/** Hides the level select screen and shows the game level, based on the "n" value.
 *  Calls the game starting function. */

function startLevel(n) {
    level = n
    startGame(n);
    levelScreen.hidden = false;
    levelSelect.hidden = true;
}

function restartLevel() {
    if (level === 0) {
        return;
    }
    stopGame();
    startGame(level);
}

/** Hides the level screen and shows the level select screen. 
 *  Stops the current level loop. */

function backToLevelSelect() {
    levelScreen.hidden = true;
    levelSelect.hidden = false;
    level = 0;
    stopGame();
}

restartButton.addEventListener("click", restartLevel);

// Checking if the button is pressed for every level.

document.querySelectorAll(".level").forEach((levelButton) => {
    levelButton.addEventListener("click", () => {
        startLevel(Number(levelButton.dataset.level));
    });
});


toLevelSelect.addEventListener("click", backToLevelSelect);


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

const formType = sessionStorage.getItem("successfullForm");

if (formType !== null) {
    successfullForm(formType);
    sessionStorage.removeItem("successfullForm");
}
