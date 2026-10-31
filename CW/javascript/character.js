"use strict";

// Respective HTML elements.

const characterSelectButton = document.getElementById("characterButton");
const characterSelect = document.getElementById("characterSelect");
const characterButtons = document.querySelectorAll(".character");
const characterSelectExit = document.getElementById("characterSelectExit");

/** Changes the class for the selected character and unselects every other characters.
 */
function markSelected(name) {
    for (const button of characterButtons) {
        if (button.dataset.character === name) {
            button.className = "selectedCharacter";
        }
        else {
            button.className = "character";
        }
    }
}

/** Stores the selected character in local storage for currently logged user.
 */
function selectCharacter(clickedButton) {
    markSelected(clickedButton.dataset.character);
    localStorage.setItem("character", clickedButton.dataset.character);
    window.location.reload();
}

/** Hides the character select window, used when the game starts.
 */
export function closeCharacterSelect() {
    characterSelect.hidden = true;
}

// Event listeners for opening/closing the character select window and each character button.

for (const button of characterButtons) {
    button.addEventListener("click", () => {
        selectCharacter(button);
    });
}

characterSelectExit.addEventListener("click", closeCharacterSelect);
characterSelectButton.addEventListener("click", () => {
    characterSelect.hidden = false
});

// Mark selected character.

markSelected(localStorage.getItem("character" || "default"));