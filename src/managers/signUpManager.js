import { SignUpForm } from "../formHelpers/signUpForm.js";

export class SignUpManager {
    constructor(base_url) {
        this.loginEndpoint = base_url + "/signup";

        this.signupForm = new SignUpForm();
    }
    async signup() {
        const credentials = this.signupForm._getCredentials();

        const body = JSON.stringify(credentials);

        if(!body) {
            return;
        }

        const isUserCreated = await new Promise((resolve) => {
            fetch(this.loginEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body,
            })
                .then((response) => response.status)
                .then((status) => {
                    const isUserCreated = status == 201;
                    resolve(isUserCreated);
                })
                .catch((error) => {
                    console.log(error);
                    const isUserCreated = false;
                    resolve(isUserCreated);
                });   
        });

        if(!isUserCreated) {
            this.signupForm.showUserNotCreatedError();
            throw new Error("User couldn't be created");
        }

        this.signupForm.showUserCreated();
    }
}
