import { type NextRequest, NextResponse } from "next/server";
import { signUp } from "../../../firebase-auth"; // Import Firebase signUp
import { createUser } from "../../../users"; // Import Firestore createUser
import { User } from "../../../models"; // Import the User interface

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 });
    }

    // Sign up with Firebase Authentication
    const userCredential = await signUp(email, password);
    const firebaseUser = userCredential.user;

    if (!firebaseUser) {
      return NextResponse.json({ error: "Failed to register user with Firebase" }, { status: 500 });
    }

    // Create a corresponding user document in Firestore
    // Use the UID from Firebase Auth as the document ID
    const userId = firebaseUser.uid;
    
    const newUser: Omit<User, "created_at" | "updated_at"> = {
      email,
      name,
      avatar_url: null, // You might want to set a default avatar or handle this differently
    };

    await createUser(userId, newUser);

    // Return user data (excluding sensitive information like password)
    return NextResponse.json({
      user: {
        id: userId,
        email: newUser.email,
        name: newUser.name,
        avatar_url: newUser.avatar_url,
      },
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    // Handle specific Firebase errors if needed
    let errorMessage = "An error occurred during signup";
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "Email already in use";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Weak password";
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

