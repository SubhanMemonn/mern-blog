import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAcv3yrvvjlSoljMdQ3iTz5YJE_8-gFyn8",
    authDomain: "mern-blog-bca0b.firebaseapp.com",
    projectId: "mern-blog-bca0b",
    storageBucket: "mern-blog-bca0b.appspot.com",
    messagingSenderId: "6482969157",
    appId: "1:6482969157:web:0970d7d47bce9664df592c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)