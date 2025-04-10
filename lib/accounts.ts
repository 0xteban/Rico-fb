import { db } from "./firebase";
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { Account } from "./models";

const accountsCollection = collection(db, "accounts");

export const createAccount = async (accountId: string, accountData: Omit<Account, "created_at" | "updated_at">) => {
  try {
    const accountDoc = doc(accountsCollection, accountId);
    const now = Timestamp.now();
    const account: Account = {
      ...accountData,
      created_at: now.toDate(),
      updated_at: now.toDate(),
    };
    await setDoc(accountDoc, account);
    return account;
  } catch (error: any) {
    console.error("Error creating account: ", error);
    throw error;
  }
};

export const getAccount = async (accountId: string) => {
  try {
    const accountDoc = doc(accountsCollection, accountId);
    const docSnap = await getDoc(accountDoc);
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Convert Firestore Timestamps to JavaScript Dates
      const account: Account = {
        ...data,
        created_at: (data.created_at as Timestamp).toDate(),
        updated_at: (data.updated_at as Timestamp).toDate(),
      } as Account;
      return account;
    } else {
      return null;
    }
  } catch (error: any) {
    console.error("Error getting account: ", error);
    throw error;
  }
};

export const updateAccount = async (accountId: string, accountData: Partial<Omit<Account, "created_at" | "updated_at">>) => {
  try {
    const accountDoc = doc(accountsCollection, accountId);
    const now = Timestamp.now();
    await updateDoc(accountDoc, {
      ...accountData,
      updated_at: now,
    });
    // Fetch and return the updated account
    return await getAccount(accountId);
  } catch (error: any) {
    console.error("Error updating account: ", error);
    throw error;
  }
};

export const deleteAccount = async (accountId: string) => {
  try {
    const accountDoc = doc(accountsCollection, accountId);
    await deleteDoc(accountDoc);
  } catch (error: any) {
    console.error("Error deleting account: ", error);
    throw error;
  }
};