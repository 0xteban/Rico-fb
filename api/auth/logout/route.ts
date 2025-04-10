import { NextResponse } from "next/server";
import { signOutUser } from "../../../lib/firebase-auth"; // Import Firebase signOutUser

export async function POST() {
  try {
    // Sign out with Firebase Authentication
    await signOutUser();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "An error occurred during logout" }, { status: 500 });
  }
}


