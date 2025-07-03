import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDyuBlBPqGEu1-6BEF_xvYSKUtUEJavWLs",
  authDomain: "auth-with-98c81.firebaseapp.com",
  projectId: "auth-with-98c81",
  storageBucket: "auth-with-98c81.firebasestorage.app",
  messagingSenderId: "108760664216",
  appId: "1:108760664216:web:862a0ec8be564dbcab68ed",
  measurementId: "G-XR29NP49EZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: 'select_account' // 🟢 shartli account tanlash popup chiqadi
});

const signInWithGoogle = () => {
    return  signInWithPopup(auth, provider)
}

export {signInWithGoogle}
