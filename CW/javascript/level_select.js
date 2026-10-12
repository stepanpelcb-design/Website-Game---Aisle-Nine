// Getting elements by id and storing them

const levelSelect = document.getElementById("level_select");
const levelScreen = document.getElementById("level_screen");


// Function for starting the level

function startLevel(n) {
    levelScreen.hidden = false;
    levelSelect.hidden = true;
    startGame(n);
}

// Function for returning to the level select

function backToLevelSelect() {
    levelScreen.hidden = true;
    levelSelect.hidden = false;
    stopGame();
}

// Making the level buttons pressable

document.querySelectorAll(".level").forEach((button) => {
    button.addEventListener("click", () => {
        startLevel(Number(button.dataset.level));
    });
});


document.getElementById("back_to_level_select").addEventListener("click", backToLevelSelect)