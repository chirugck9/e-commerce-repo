// Firebase Configuration
function initializeApp(){
    const firebaseConfig = {
        // apiKey: process.env.FIREBASE_API_KEY,
        // authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        // projectId: process.env.FIREBASE_PROJECT_ID,
        apiKey: "AIzaSyDoksl1RczdKI5Hldx_JuExhqwPAX51PQc",
        authDomain: "e-commerce-backend-e45aa.firebaseapp.com",
        projectId: "e-commerce-backend-e45aa",
    };
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log(firebase)

// Backend URL
const backendURL = "http://localhost:8000";

// Signup Function
async function signup() {
    const fullName = document.getElementById("signupFullName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    try {
        // Create user in Firebase Auth
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const idToken = await userCredential.user.getIdToken();

        // Send data to backend
        const response = await fetch(`${backendURL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, full_name: fullName }),
        });

        const data = await response.json();
        console.log("Signup Successful:", data);
        alert("Signup successful!");
    } catch (error) {
        console.error("Signup Error:", error.message);
        alert(error.message);
    }
}

// Login Function
async function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        // Firebase Auth Login
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        const idToken = await userCredential.user.getIdToken();

        // Send ID Token to backend for verification
        const response = await fetch(`${backendURL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
        });

        const data = await response.json();
        console.log("Login Successful:", data);
        alert("Login successful!");
    } catch (error) {
        console.error("Login Error:", error.message);
        alert(error.message);
    }
}
