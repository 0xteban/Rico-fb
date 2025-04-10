import { db } from "./firebase";
import { collection, doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { User } from "./models";

const usersCollection = collection(db, "users");

export const createUser = async (userId: string, userData: Omit<User, "created_at" | "updated_at">) => {
  try {
    const userDoc = doc(usersCollection, userId);
    const now = Timestamp.now();
    const user: User = {
      ...userData,
      created_at: now.toDate(),
      updated_at: now.toDate(),
    };
    await setDoc(userDoc, user);
    return user;
  } catch (error: any) {
    console.error("Error creating user: ", error);
    throw error;
  }
};

export const getUser = async (userId: string) => {
  try {
    const userDoc = doc(usersCollection, userId);
    const docSnap = await getDoc(userDoc);
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Convert Firestore Timestamps to JavaScript Dates
      const user: User = {
        ...data,
        created_at: (data.created_at as Timestamp).toDate(),
        updated_at: (data.updated_at as Timestamp).toDate(),
      } as User;
      return user;
    } else {
      return null;
    }
  } catch (error: any) {
    console.error("Error getting user: ", error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: Partial<Omit<User, "created_at" | "updated_at" >>) => {
  try {
    const userDoc = doc(usersCollection, userId);
    const now = Timestamp.now();
    await updateDoc(userDoc, {
      ...userData,
      updated_at: now,
    });
    // Fetch and return the updated user
    return await getUser(userId);
  } catch (error: any) {
    console.error("Error updating user: ", error);
    throw error;
  }
};