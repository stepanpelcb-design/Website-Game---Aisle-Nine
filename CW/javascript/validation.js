// ====================================================
//          REGISTER AND LOGIN VALIDATION
// ====================================================

const { useReducer } = require("react");


// ====================================================
//                     Register
// ====================================================


let feedbackRegisterPara = document.getElementById("registerFeedback");
let registerForm = document.getElementById("registerForm");

let registerUsername = document.getElementById("registerUsername");
let registerEmail = document.getElementById("registerEmail");
let registerAge = document.getElementById("registerAge");
let registerPhoneNumber = document.getElementById("registerPhoneNumber");
let registerPassword = document.getElementById("registerPassword");
let registerConfirmPassword = document.getElementById("registerConfirmPassword");

const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})");
const phoneRegex = new RegExp("^[+]?[0-9]+$");


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

        if (localStorage.getItem(registerUsername.value) !== null) {
            registerUsername.setCustomValidity('The username "' + registerUsername.value + '" already exists.');
            registerUsername.reportValidity();
            return;
        }

        if (localStorage.getItem(registerEmail.value) !== null) {
            registerEmail.setCustomValidity('The email "' + registerEmail + '" already exists.');
            registerEmail.reportValidity();
            return;
        }

        sessionStorage.setItem("successfullForm", "register");
        window.location="game.html";
        storeUser();
    });
}


function storeUser() {
    let userObj = {};
    userObj.username = registerUsername.value;
    userObj.age = calculateAge(registerDateOfBirth.value);
    userObj.email = registerEmail.value;
    userObj.phoneNumber = registerPhoneNumber;
    userObj.password = registerPassword;

    localStorage[userObj.username] = JSON.stringify(userObj);
}


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


let feedbackLoginPara = document.getElementById("loginFeedback");
let loginForm = document.getElementById("loginForm");

let loginUsername = document.getElementById("loginUsername");
let loginPassword = document.getElementById("loginPassword");


if (loginForm !== null) {
    loginForm.addEventListener("input", () => {
        loginUsername.setCustomValidity("");
        loginPassword.setCustomValidity("");
    })

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (loginUsername.value !== localStorage.getItem(loginUsername.value)) {
            loginUsername.setCustomValidity("The username does not exist.");
            loginUsername.reportValidity();
            return;
        }

        if (loginPassword.value !== localStorage.getItem(loginUsername.value.password)) {
            loginPassword.setCustomValidity("Incorrect password");
            loginPassword.reportValidity();
            return;
        }

        sessionStorage.setItem("successfullForm", "login");
        window.location="game.html";
    });
}
