"use strict";

/** Returns the username from local storage.
 */
export function getCurrentUsername() {
    const username = sessionStorage.getItem("loggedInUser");
    if (username === null) {
        return null;
    }
    return JSON.parse(localStorage.getItem(username));
}

/** Returns the current highest score of the user.
 */
export function getCurrentScore() {
    const username = getCurrentUsername();
    let score = 0;

    for (let n = 0; n < username.levelScore.length; n++) {
        score += username.levelScore[n];
    }
    return score;
}

/** Returns age calculated from the date of birth.
 */
export function calculateAge(dateOfBirth) {
    const birth = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();

    if (monthDifference < 0) {
        age--;
    }
    else if (monthDifference === 0 && today.getDate() < birth.getDate()) {
        age--;
    }
    return age;
}

/** Returns if the user is logged in, or not.
 */
export function isLoggedIn() {
    return sessionStorage.getItem("loggedInUser") !== null;
}

/** Removes the user from session storage.
 */
export function logoutUser() {
    sessionStorage.removeItem("loggedInUser");
    window.location.reload();
}

/** Returns the unlocked levels for current user.
 */
export function getUnlockedLevel() {
    const username = getCurrentUsername();
    if (username === null || username.unlockedLevel === undefined) {
        return 1;
    }
    return username.unlockedLevel;
}

/** updates the unlocked levels inside local storage for current user.
 */
export function updateUnlockedLevels(finishedLevel) {
    const username = getCurrentUsername();
    if (username === null) {
        return;
    }
    const current = username.unlockedLevel;
    const next = finishedLevel + 1;

    if (next > 6 || next <= current) {
        return;
    }
    username.unlockedLevel = next;
    localStorage.setItem(username.username, JSON.stringify(username));
}

/** Updates the unlocked levels for current user.
 */
export function refreshUnlockedLevels() {
    const unlockedLevel = getUnlockedLevel();

    for (let n = 2; n <= 6; n++) {
        const isLocked = n > unlockedLevel;
        document.getElementById("level" + n + "Lock").hidden = !isLocked;
    }
}

/** Updates the highest score, based on a comparison of the current user highest score with new score.
 */
export function updateScore(level, newScore) {
    const user = getCurrentUsername();
    if (user === null) {
        return;
    }
    if (newScore > user.levelScore[level - 1]) {
        user.levelScore[level - 1] = newScore;
        localStorage.setItem(user.username, JSON.stringify(user));
    }
}

/** Returns a string with capitalized first letter.
 */
export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}