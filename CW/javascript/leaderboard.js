"use strict";

// =============
//    Imports
// =============

import { isLoggedIn } from "../javascript/users.js";


// HTML tags.

const leaderboardBody = document.getElementById("tableBody");
const leaderboardBlur = document.getElementById("notLoggedInLeaderboard");

leaderboardBlur.hidden = isLoggedIn();

/** Writes the leaderboard line, based on the input values.
 */
function writeLeaderboardLine(position, username, completedLevel, score) {
    const row = leaderboardBody.insertRow(-1);

    row.insertCell(-1).innerHTML = position;
    row.insertCell(-1).innerHTML = username;
    row.insertCell(-1).innerHTML = completedLevel;
    row.insertCell(-1).innerHTML = score;
}

/** Updates the leaderboard with session storage data and keeps the first 10 records.
 */
function updateLeaderboard() {
    let entries = [];

    // Loop users.
    for (let i = 0; i < localStorage.length; i++) {
        let user;
        try {
            user = JSON.parse(localStorage.getItem(localStorage.key(i)));
        }
        catch (error) {
            continue;
        }

        if (user === null || !Array.isArray(user.levelScore)) {
            continue;
        }
        
        // Score and completed levels calculation.
        let score = 0;
        let completedLevels = 0;
        const scores = user.levelScore

        for (let n = 0; n < scores.length; n++) {
            score += scores[n];
            if (scores[n] > 0) {
                completedLevels++;
            }
        }

        if (score > 0) {
            entries.push({
                username: user.username,
                completedLevels: completedLevels,
                score: score
            });
        }
    }

    // Sorting the top 10 highest scores.
    entries.sort((a, b) => b.score - a.score);
    entries = entries.slice(0, 10);

    // Drawing the leaderboard.
    for (let i = 0; i < entries.length; i++) {
        let suffix = "th";
        if (i === 0) {
            suffix = "st";
        }
        else if (i === 1) {
            suffix = "nd";
        }
        else if (i === 2) {
            suffix = "rd";
        }

        writeLeaderboardLine((i + 1) + suffix, entries[i].username, entries[i].completedLevels, entries[i].score);
    }   
}

updateLeaderboard();