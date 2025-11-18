import { expect } from "@playwright/test";

// Define and export the ApiUtils class for handling API requests
export default class ApiUtils {
    
    // Constructor receives the API context and login credentials
    constructor(apiContext, loginPayload) {
        this.apiContext = apiContext;        // Playwright's APIRequestContext for making HTTP requests
        this.loginPayload = loginPayload;    // Login credentials payload (email & password)
    }

    // Method: Logs in via API and returns the authentication token
    async getToken() {
        // Send a POST request to the login endpoint with login credentials
        const loginResponseObject = await this.apiContext.post('/api/ecom/auth/login', {
            data: this.loginPayload
        });

        // Ensure the response was successful (HTTP 200 OK)
        expect(loginResponseObject.ok()).toBeTruthy();

        // Extract the response JSON body
        const loginResponseJson = await loginResponseObject.json();

        // Extract and return the authentication token
        const token = loginResponseJson.token;
        return token;
    }

    // Method: Creates an order via API and returns the order ID
    async createOrder(orderPayload) {
        // Send a POST request to the create-order endpoint
        const orderResponseObject = await this.apiContext.post('/api/ecom/order/create-order', {
            data: orderPayload,
            headers: {
                'Authorization': await this.getToken(),     // Add token to the Authorization header
                'Content-Type': 'application/json',         // Indicate JSON format
                'Accept': 'application/json'
            }
        });

        // Ensure the response was successful
        expect(orderResponseObject.ok()).toBeTruthy();

        // Extract the response JSON body
        const orderResponseJson = await orderResponseObject.json();

        // Return the first order ID from the response
        const orderId = orderResponseJson.orders[0];
        return orderId;
    }
}
