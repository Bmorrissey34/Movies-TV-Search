var nameInput = document.querySelector("#icon_prefix");
var passwordInput = document.querySelector("#icon_mail");
var signUpButton = document.querySelector("#submit");
var userNameSpan = document.querySelector("#userName")

renderUser();
//added event listener to the submit button to store users names and emails
signUpButton.addEventListener("click", function (event) {
    event.preventDefault();
    console.log(event)
    var name = document.querySelector("#icon_prefix").value;
    var email = document.querySelector("#icon_mail").value;
//stored locally
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    renderUser();
});
//rendered users name on the homepage
function renderUser() {
    var name = localStorage.getItem("name");
    userNameSpan.textContent = name;
  }