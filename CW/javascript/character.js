"use strict";

// Respective HTML elements.

const characterSelectButton = document.getElementById("characterButton");
const characterSelect = document.getElementById("characterSelect");
const characterButtons = document.querySelectorAll(".character");
const characterSelectExit = document.getElementById("characterSelectExit");

/** Stores the selected character in local storage for currently logged user
 *  and changes the class of the other characters.
 */
function selectCharacter(clickedButton) {
    for (const button of characterButtons) {
        button.className = "character";
    }
    clickedButton.className = "selectedCharacter";
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
