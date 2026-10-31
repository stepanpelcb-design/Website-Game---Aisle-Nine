"use strict";

// =============
//    Imports
// =============

import { getCurrentUsername, getCurrentScore, logoutUser } from "../javascript/users.js";


// HTML tags.

const userDetailBox = document.getElementById("userDetails");
const userDetailsName = document.getElementById("loggedUser");
const userDetailsStats = document.getElementById("loggedUserStats");
const userIconButton = document.getElementById("userIcon");
const logoutButton = document.getElementById("logoutUser");
const userIconText = document.getElementById("userIconText");
const userNotLoggedIn = document.getElementById("notLoggedInText");

userIconButton.addEventListener("click", toggleUserDetails);
logoutButton.addEventListener("click", logoutUser);

isLoggedIn();

/** Updates the username tag inside the header, based on the log in/out state.
 */
function isLoggedIn() {
    const user = getCurrentUsername();
    if (user === null) {
        return;
    }
    userIconText.innerHTML = user.username;
}

/** Shows/hides the character select window, if the user is logged in.
 *  Otherwise, tells the user to log in.
 */
function toggleUserDetails() {
    const user = getCurrentUsername();

    // User not logged in.
    if (user === null) {
        userNotLoggedIn.hidden = false;
        setTimeout(() => {
        userNotLoggedIn.hidden = true;
        }, 3000);
        return;
    }

    // Hide character select window.
    if (!userDetailBox.hidden) {
        userIconButton.style.top = "50%";
        userDetailBox.hidden = true;
        userIconText.hidden = false;
        return;
    }

    // Show character select window.
    userIconButton.style.top = "40%";
    userDetailsName.innerHTML = user.username
    userDetailsStats.innerHTML = "Score: " + getCurrentScore() + "<br>" + "Level: " + user.unlockedLevel;
    userDetailBox.hidden = false;
    userIconText.hidden = true;
}