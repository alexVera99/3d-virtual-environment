export class LoginForm {
    constructor(base_url) {
        this.token = undefined;
        this.containerHTML = document.querySelector(".log-container");
        this.usernameHTML = this.containerHTML.querySelector("#username-login");
        this.passwordHTML = this.containerHTML.querySelector("#password-login");
        this.credentialsErrorHTML =this.containerHTML.querySelector(".login-error");

        this.loginEndpoint = "http://" + base_url + "/login";

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

    async login() {
        const credentials = this._getCredentials();

        const body = JSON.stringify(credentials);

        const token = await new Promise((resolve) => {
            fetch(this.loginEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body,
            })
                .then((response) => response.json())
                .then((data) => {
                    const token = data["token"];
                    resolve(token);
                })
                .catch((error) => {
                    //console.error('Error:', error);
                    
                    const token = undefined;
                    resolve(token);
                });   
        });

        const notToken = !token;
        if(notToken) {
            this.showCredentialsError();
            throw new Error("Couldn't be log in");
        }

        this.token = token;

        this.hideForm();
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

    getToken() {
        return this.token;
    }
}
