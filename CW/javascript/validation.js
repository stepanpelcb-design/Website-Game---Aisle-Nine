"use strict";

// ====================================================
//                     Register
// ====================================================

// Register html tags.

let feedbackRegisterPara = document.getElementById("registerFeedback");
let registerForm = document.getElementById("registerForm");

let registerUsername = document.getElementById("registerUsername");
let registerEmail = document.getElementById("registerEmail");
let registerDateOfBirth = document.getElementById("registerDateOfBirth");
let registerPhoneNumber = document.getElementById("registerPhoneNumber");
let registerPassword = document.getElementById("registerPassword");
let registerConfirmPassword = document.getElementById("registerConfirmPassword");

// Regex for password and phone.

const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})");
const phoneRegex = new RegExp("^[+]?[0-9]+$");

// Register form inputs.

if (registerForm !== null) {
    registerForm.addEventListener("input", () => {
        registerUsername.setCustomValidity("");
        registerEmail.setCustomValidity("");
        registerPhoneNumber.setCustomValidity("");
        registerPassword.setCustomValidity("");
    })

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (registerUsername.value.length < 4) {
            registerUsername.setCustomValidity("The username has to be at least 4 characters.");
            registerUsername.reportValidity();
            return;
        }

        if (!phoneRegex.test(registerPhoneNumber.value)) {
            registerPhoneNumber.setCustomValidity("The phone number must be numbers only (no spaces).");
            registerPhoneNumber.reportValidity();
            return;
        }

        if (registerPhoneNumber.value.length < 7) {
            registerPhoneNumber.setCustomValidity("The phone number length must be at least 7.");
            registerPhoneNumber.reportValidity();
            return;
        }

        if (registerPhoneNumber.value.length > 12) {
            registerPhoneNumber.setCustomValidity("The phone number length must be no more than 12.");
            registerPhoneNumber.reportValidity();
            return;
        }

        if (registerPassword.value !== registerConfirmPassword.value) {
            registerPassword.setCustomValidity("Your passwords do not match.");
            registerPassword.reportValidity();
            return;
        }

        if (!passwordRegex.test(registerPassword.value)) {
            registerPassword.setCustomValidity("Weak password. Please check password requirements.");
            registerPassword.reportValidity();
            return;
        }

        if (localStorage.getItem(registerUsername.value.toLowerCase()) !== null) {
            registerUsername.setCustomValidity('The username "' + registerUsername.value + '" already exists.');
            registerUsername.reportValidity();
            return;
        }

        // Successfull fill.

        storeUser();
        sessionStorage.setItem("successfullForm", "register");
        window.location="game.html";
    });
}

/** Creates a user object from input values, stores the oject in the local storage,
 * and stores the username in session storage.
 */
function storeUser() {
    let userObj = {};
    userObj.username = registerUsername.value.toLowerCase();
    userObj.age = calculateAge(registerDateOfBirth.value);
    userObj.email = registerEmail.value;
    userObj.phoneNumber = registerPhoneNumber.value;
    userObj.password = registerPassword.value;
    userObj.unlockedLevel = 1;
    userObj.levelScore = [0, 0, 0, 0, 0];

    localStorage[userObj.username] = JSON.stringify(userObj);
    sessionStorage.setItem("loggedInUser", userObj.username);
}

/** Returns age calculated from the date of birth.
 */
function calculateAge(dateOfBirth) {
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





// ====================================================
//                     Login
// ====================================================

// Login html tags.

let feedbackLoginPara = document.getElementById("loginFeedback");
let loginForm = document.getElementById("loginForm");

let loginUsername = document.getElementById("loginUsername");
let loginPassword = document.getElementById("loginPassword");

// Login form inputs.

if (loginForm !== null) {
    loginForm.addEventListener("input", () => {
        loginUsername.setCustomValidity("");
        loginPassword.setCustomValidity("");
    })

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem(loginUsername.value.toLowerCase()));

        if (user === null) {
            loginUsername.setCustomValidity("The username does not exist.");
            loginUsername.reportValidity();
            return;
        }

        if (loginPassword.value !== user.password) {
            loginPassword.setCustomValidity("Incorrect password");
            loginPassword.reportValidity();
            return;
        }

        // Successfull login.

        sessionStorage.setItem("loggedInUser", user.username);
        sessionStorage.setItem("successfullForm", "login");
        window.location="game.html";
    });
}
