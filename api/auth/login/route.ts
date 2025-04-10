--- a/api/auth/login/route.ts
+++ b/api/auth/login/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { signIn } from "../../../lib/firebase-auth"; // Import Firebase signIn
import { getUser } from "../../../lib/users"; // Import Firestore getUser

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Sign in with Firebase Authentication
    const userCredential = await signIn(email, password);
    const firebaseUser = userCredential.user;

    if (!firebaseUser) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Get the corresponding user document from Firestore
    const userId = firebaseUser.uid;
    const user = await getUser(userId);

    if (!user) {
      // This should ideally not happen if signup process is correct
      return NextResponse.json({ error: "User not found in Firestore" }, { status: 404 });
    }

    // Return user data from Firestore
    return NextResponse.json({ user: { id: userId, ...user } });
  } catch (error: any) {
    console.error("Login error:", error);
    let errorMessage = "An error occurred during login";
    // Handle specific Firebase errors
    if (error.code === "auth/invalid-credential") {
      errorMessage = "Invalid credentials";
    } else if (error.code === "auth/user-not-found") {
      errorMessage = "User not found";
    } else if (error.code === "auth/wrong-password") {
      errorMessage = "Invalid credentials"; // For security reasons, don't specify wrong password
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

