function loadSignIn(){
    var myInput = document.getElementById("psw");
    var confirmMyInput = document.getElementById("cpsw");
    var letter = document.getElementById("letter");
    var capital = document.getElementById("capital");
    var number = document.getElementById("number");
    var length = document.getElementById("length");
    var match = document.getElementById("match");

    myInput.onkeyup = function (){
        var lowerCaseLetters = new RegExp("[a-z]"); // : Fill in the regular experssion for lowerCaseLetters
        var upperCaseLetters = new RegExp("[A-Z]"); // : Fill in the regular experssion for upperCaseLetters
        var numbers = new RegExp("[0-9]"); // : Fill in the regular experssion for digits
        var minLength = 8; // : Change the minimum length to what what it needs to be in the question

        if(myInput.value.match(lowerCaseLetters)) {
            letter.classList.remove("invalid");
            letter.classList.add("valid");
        }
        else{
            letter.classList.remove("valid");
            letter.classList.add("invalid");
        }
        // Validate capital letters
        if(myInput.value.match(upperCaseLetters)){
            capital.classList.remove("invalid");
            capital.classList.add("valid");
        }
        else{
            capital.classList.remove("valid");
            capital.classList.add("invalid");
        }
        // Validate numbers
        if(myInput.value.match(numbers)){
            number.classList.remove("invalid");
            number.classList.add("valid");
        }
        else{
            number.classList.remove("valid");
            number.classList.add("invalid");
        }
        // Validate length
        if(myInput.value.length >= minLength) {
            length.classList.remove("invalid");
            length.classList.add("valid");
        }
        else {
            length.classList.remove("valid");
            length.classList.add("invalid");
        }
    };
    confirmMyInput.onkeyup = function (){
        var confPass = myInput.value == confirmMyInput.value;
        if(confPass){
            match.classList.remove("invalid");
            match.classList.add("valid");
            enableButton(letter, capital, number, length, match);
        }
        else{
            match.classList.remove("valid");
            match.classList.add("invalid");
        }
    };
}

function enableButton(letter, capital, number, length, match) {
    var button = document.getElementById("submit_button");
    var condition = match;
    if (condition) {
        button.disabled = false;
    }
}