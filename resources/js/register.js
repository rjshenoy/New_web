function runPasswordCheck(){
    var myInput = document.getElementById("psw");
    var confirmMyInput = document.getElementById("cpsw");
    var letter = document.getElementById("letter");
    var capital = document.getElementById("capital");
    var number = document.getElementById("number");
    var length = document.getElementById("length");
    var match = document.getElementById("match");
    myInput.onkeyup = function (){
        console.log("typing...");
        var lowerCaseLetters = new RegExp("[a-z]");
        var upperCaseLetters = new RegExp("[A-Z]");
        var numbers = new RegExp("[0-9]");
        var minLength = 8;
        console.log("log");
        console.log(letter.classList);     
        // Validate lowercase letters
        if(myInput.value.match(lowerCaseLetters)) {
        console.log(myInput.value.match(lowerCaseLetters));
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
        }
        else{
        match.classList.remove("valid");
        match.classList.add("invalid");
        }
        enableButton(match);
    };
}

function enableButton(match){
  var button = document.getElementById("my_submit_button");
  var condition = match;
  if (condition) {
    button.disabled = false;
  }
}