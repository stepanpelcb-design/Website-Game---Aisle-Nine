"use strict";

const userDisplay = document.getElementById("usernameIcon");
const userDisplayLogged = document.getElementById("usernameIconLogged");
const loggedInUser = sessionStorage.getItem("loggedInUser");

/** Updates the username tag inside the header, based on the log in/out state.
 */
function updateUsername() {
    if (userDisplay === null) {
        return;
    }
    if (loggedInUser === null) {
        userDisplay.hidden = false;
        userDisplayLogged.hidden = true;
    }
    else {
        userDisplayLogged.innerHTML = loggedInUser + " ⍈";
        userDisplay.hidden = true;
        userDisplayLogged.hidden = false;
    }
}

/** Removes the user from session state.
 */
function logoutUser() {
    sessionStorage.removeItem("loggedInUser");
    window.location.reload();
}

updateUsername();

/** updates the unlocked levels inside local storage for current user.
 */
function updateUnlockedLevels(finishedLevel) {
    const username = getCurrentUsername();
    if (username === null) {
        return;
    }
    const current = username.unlockedLevel;
    const next = finishedLevel + 1;

    if (next > 5 || next <= current) {
        return;
    }
    username.unlockedLevel = next;
    localStorage.setItem(username.username, JSON.stringify(username));
}