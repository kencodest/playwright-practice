import LoginPage from "./LoginPage";
import DashboardPage from "./DashboardPage";
import CheckoutPage from "./CheckoutPage";


export default class PageObjectManager {

    constructor(page){
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.dashboardPage = new DashboardPage(this.page);
        this.checkoutPage = new CheckoutPage(this.page);
    }

    getLoginPage(){
        return this.loginPage;
    };

    getDashboardPage(){
        return this.dashboardPage;
    };

    getCheckoutPage(){
        return this.checkoutPage;
    };
}