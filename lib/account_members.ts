import { db } from "./firebase";
import { collection, doc, setDoc, getDocs, query, where, updateDoc, deleteDoc, Timestamp, getDoc } from "firebase/firestore";
import { AccountMember } from "./models";
import { getAccount } from "./accounts"; // Import getAccount to fetch account details

const accountMembersCollection = collection(db, "account_members");

export const addAccountMember = async (accountMemberId: string, accountMemberData: Omit<AccountMember, "created_at">) => {
  try {
    const accountMemberDoc = doc(accountMembersCollection, accountMemberId);
    const now = Timestamp.now();
    const accountMember: AccountMember = {
      ...accountMemberData,
      created_at: now.toDate(),
    };
    await setDoc(accountMemberDoc, accountMember);
    return accountMember;
  } catch (error: any) {
    console.error("Error adding account member: ", error);
    throw error;
  }
};

export const getAccountMembersByAccount = async (accountId: string) => {
  try {
    const q = query(accountMembersCollection, where("account_id", "==", accountId));
    const querySnapshot = await getDocs(q);
    const accountMembers: AccountMember[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      accountMembers.push({
        ...data,
        created_at: (data.created_at as Timestamp).toDate(),
      } as AccountMember);
    });
    return accountMembers;
  } catch (error: any) {
    console.error("Error getting account members: ", error);
    throw error;
  }
};

export const updateAccountMemberRole = async (accountMemberId: string, role: "owner" | "editor" | "viewer") => {
  try {
    const accountMemberDoc = doc(accountMembersCollection, accountMemberId);
    await updateDoc(accountMemberDoc, { role });
    // Fetch and return the updated account member (optional, for consistency)
    return getAccountMember(accountMemberId);
  } catch (error: any) {
    console.error("Error updating account member role: ", error);
    throw error;
  }
};

export const removeAccountMember = async (accountMemberId: string) => {
  try {
    const accountMemberDoc = doc(accountMembersCollection, accountMemberId);
    await deleteDoc(accountMemberDoc);
  } catch (error: any) {
    console.error("Error removing account member: ", error);
    throw error;
  }
};

export const getAccountMember = async (accountMemberId: string) => {
    try {
      const accountMemberDoc = doc(accountMembersCollection, accountMemberId);
      const docSnap = await getDoc(accountMemberDoc);
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Convert Firestore Timestamps to JavaScript Dates
        const accountMember: AccountMember = {
          ...data,
          created_at: (data.created_at as Timestamp).toDate(),
        } as AccountMember;
        return accountMember;
      } else {
        return null;
      }
    } catch (error: any) {
      console.error("Error getting account member: ", error);
      throw error;
    }
  };

export const getAccountsForUser = async (userId: string) => {
  try {
    const q = query(accountMembersCollection, where("user_id", "==", userId));
    const querySnapshot = await getDocs(q);
    const accounts = [];
    for (const docSnap of querySnapshot.docs) {
      const accountMember = docSnap.data() as AccountMember;
      const account = await getAccount(accountMember.account_id);
      if (account) {
        accounts.push(account);
      }
    }
    return accounts;
  } catch (error: any) {
    console.error("Error getting accounts for user: ", error);
    throw error;
  }
};