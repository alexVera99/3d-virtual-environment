export class LoginForm {
    constructor() {
        this.containerHTML = document.querySelector(".log-container");
        this.usernameHTML = this.containerHTML.querySelector("#username-login");
        this.passwordHTML = this.containerHTML.querySelector("#password-login");
        this.credentialsErrorHTML =this.containerHTML.querySelector(".login-error");

        this.formElem = document.querySelector("#user_data_form");
    }

    _getCredentials() {
        const username = this.usernameHTML.value;
        const password = this.passwordHTML.value;

        return {
            username: username,
            password: password
        }
    }

    showCredentialsError() {
        this.credentialsErrorHTML.style.display = "block";

        // Hide error after N milliseconds
        const N = 5000;
        setTimeout(() => {
            this.credentialsErrorHTML.style.display = "none";
        }, 5000);
    }

    hideForm() {
        this.formElem.style.display = "none";
        document.querySelector(".container").style.display = "";
    }
}
