export default class LoginPage {

    constructor(page){
        this.page = page;
        this.signInButton = this.page.locator("#login");
        this.username = this.page.locator("#userEmail");
        this.password = this.page.locator("#userPassword");
    }

    async goToLoginPage(){
        await this.page.goto('https://rahulshettyacademy.com/client');
    }


    async validLogin(username, password){
        await this.username.fill(username);
        await this.password.fill(password);
        await this.signInButton.click();
        
    }
}