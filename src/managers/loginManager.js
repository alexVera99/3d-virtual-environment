import { LoginForm } from "../formHelpers/loginForm.js";

export class LoginManager {
    constructor(base_url) {
        this.token = undefined;

        this.loginEndpoint = base_url + "/login";

        this.loginForm = new LoginForm();
    }
    async login() {
        const credentials = this.loginForm._getCredentials();

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
            this.loginForm.showCredentialsError();
            throw new Error("Couldn't be log in");
        }

        this.token = token;

        this.loginForm.hideForm();
    }

    getToken() {
        return this.token;
    }
}
