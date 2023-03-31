export class SignUpForm {
    constructor() {
        this.modalHTML = document.querySelector("#signUp");
        this.containerHTML = document.querySelector("#signUp .log-container");
        this.usernameHTML = this.containerHTML.querySelector("#username");
        this.passwordHTML = this.containerHTML.querySelector("#password");
        this.passwordRepeatHTML = this.containerHTML.querySelector("#repeat-password");
        this.artistCheckboxHTML = this.containerHTML.querySelector("#checkbox-artist");
        this.userCreateError = this.containerHTML.querySelector(".login-error#user-create-error");
        this.passwordNotMatchError = this.containerHTML.querySelector(".login-error#password-match-error");

        this.userCreatedHTML = document.querySelector("#sign-up-modal-success");
        // DEFAULT AVATAR AND ROOM
        this.scene_node_id = 1;
        this.room_id = 1;
    }

    _getCredentials() {
        const username = this.usernameHTML.value;
        const password = this.passwordHTML.value;
        const passowrdRepeat = this.passwordRepeatHTML.value;
        const isArtist = this.artistCheckboxHTML.checked;

        if(password != passowrdRepeat) {
            this.showPasswordsAreNotEqual();
            return;
        }

        return {
            username: username,
            password: password,
            room_id: this.room_id,
            scene_node_id: this.scene_node_id,
            is_streamer: isArtist
        }
    }

    showPasswordsAreNotEqual() {
        this.passwordNotMatchError.style.display = "block";

       // Hide error after N milliseconds
       const N = 5000;
       setTimeout(() => {
           this.passwordNotMatchError.style.display = "none";
       }, 5000); 
    }

    showUserNotCreatedError() {
        this.userCreateError.style.display = "block";

        // Hide error after N milliseconds
        const N = 5000;
        setTimeout(() => {
            this.userCreateError.style.display = "none";
        }, 5000);  
    }

    hideForm() {
        this.modalHTML.style.display = "none";
    }

    showUserCreated() {
        this.hideForm();
        this.userCreatedHTML.style.display = "block";
    }
}
