# E-commerce Backend

This is the backend API for an E-commerce application built using Node.js, Express, MongoDB, and Stripe for payment integration. It supports user authentication, product management, cart functionality, order placement, delivery integration, and admin dashboard features.

## 🚀 Project Setup

1. Clone the Repository
```bash
    git clone https://github.com/username/e-commerce-backend.git
    cd e-commerce-backend
```
2. Install Dependencies
   Make sure you have Node.js and npm installed. Then, install project dependencies:
   ```bash
       npm install
   ```
3. Set Up Environment Variables
   Create a .env file in the root directory and add the following environment variables:
        PORT=5000
        MONGO_URI=mongodb://localhost:27017/ecommerce
        JWT_SECRET=your_jwt_secret
        STRIPE_SECRET_KEY=your_stripe_secret_key
        FIREBASE_ADMIN_SDK=your_firebase_admin_sdk
4. Start MongoDB
    Ensure MongoDB is running locally:
    ```bash
       mongod
    ```
5. Run the Project
    ```bash
       npm run dev
    ```
The API will run at http://localhost:5000.
