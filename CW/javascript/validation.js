// ====================================================
//          REGISTER AND LOGIN VALIDATION
// ====================================================





// ====================================================
//                     Register
// ====================================================
let feedbackRegisterPara = document.getElementById("registerFeedback");
let registerForm = document.getElementById("registerForm");

const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})");

registerForm.addEventListener("submit", (e) => {
    let registerUsername = document.getElementById("registerUsername").value;
    let registerEmail = document.getElementById("registerEmail").value;
    let registerAge = document.getElementById("registerAge").value;
    let registerPhoneNumber = document.getElementById("registerPhoneNumber").value;
    let registerPassword = document.getElementById("registerPassword").value;
    let registerConfirmPassword = document.getElementById("registerConfirmPassword").value;

    let registerMessages = [];

    feedbackRegisterPara.innerHTML = "Successfully registered.";

    if (registerUsername.length < 4) {
        registerMessages.push("The username has to be at least 4 characters.");
    }

    if (registerPassword !== registerConfirmPassword) {
        registerMessages.push("Your passwords do not match.");
    }

    if (!passwordRegex.test(registerPassword)) {
        registerMessages.push("Weak password. Password must be at least 8 characters <br>and include at least one uppercase letter, <br>one number, and one special character.");
    }

    if (registerMessages.length > 0) {
        e.preventDefault();
        feedbackRegisterPara.innerHTML = registerMessages.join("<br>");
    }

    else {
        feedbackRegisterPara.innerHTML = "Successfully registered."
        feedbackRegisterPara.style.color = "green";
        e.preventDefault();
    }


});









// ====================================================
//                     Login
// ====================================================

let feedbackLoginPara = document.getElementById("registerFeedback");
let loginForm = document.getElementById("registerForm");


registerForm.addEventListener("submit", (e) => {
    let loginUsername = document.getElementById("loginUsername").value;
    let loginPassword = document.getElementById("loginPassword").value;

    let loginMessages = [];


    if (loginMessages.length > 0) {
        e.preventDefault();
        feedbackLoginPara.innerHTML = loginMessages.join("<br>");
    }

    else {
        
    }
});