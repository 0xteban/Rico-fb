import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";

export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Signed up 
    const user = userCredential.user;
    return user;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
    console.error("Error signing up: ", errorCode, errorMessage);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Signed in 
    const user = userCredential.user;
    return user;  
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error signing in: ", errorCode, errorMessage);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    // Signed out
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error signing out: ", errorCode, errorMessage);
    throw error;
  }
};

export const getCurrentUser = () => {
  return auth.currentUser; // This returns the currently authenticated user or null.
};

export const onAuthStateChangedHelper = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Example usage in a component:
// const unsubscribe = onAuthStateChangedHelper((user) => {
//   if (user) {
//     // User is signed in, see docs for a list of available properties
//     // https://firebase.google.com/docs/reference/js/auth.user.md
//     const uid = user.uid;
//     console.log("User signed in: ", uid);
//   } else {
//     // User is signed out
//     console.log("User signed out");
//   }
// });

// To stop listening for auth state changes:
// unsubscribe();