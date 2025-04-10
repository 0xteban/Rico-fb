import { db } from "./firebase";
import { collection, doc, setDoc, getDoc, getDocs, query, where, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { Conversation } from "./models";

const conversationsCollection = collection(db, "conversations");

export const createConversation = async (conversationId: string, conversationData: Omit<Conversation, "created_at" | "updated_at">) => {
  try {
    const conversationDoc = doc(conversationsCollection, conversationId);
    const now = Timestamp.now();
    const conversation: Conversation = {
      ...conversationData,
      created_at: now.toDate(),
      updated_at: now.toDate(),
    };
    await setDoc(conversationDoc, conversation);
    return conversation;
  } catch (error: any) {
    console.error("Error creating conversation: ", error);
    throw error;
  }
};

export const getConversation = async (conversationId: string) => {
  try {
    const conversationDoc = doc(conversationsCollection, conversationId);
    const docSnap = await getDoc(conversationDoc);
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Convert Firestore Timestamps to JavaScript Dates
      const conversation: Conversation = {
        ...data,
        created_at: (data.created_at as Timestamp).toDate(),
        updated_at: (data.updated_at as Timestamp).toDate(),
      } as Conversation;
      return conversation;
    } else {
      return null;
    }
  } catch (error: any) {
    console.error("Error getting conversation: ", error);
    throw error;
  }
};

export const getConversationsByAccount = async (accountId: string) => {
  try {
    const q = query(conversationsCollection, where("account_id", "==", accountId));
    const querySnapshot = await getDocs(q);
    const conversations: Conversation[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      conversations.push({
        ...data,
        created_at: (data.created_at as Timestamp).toDate(),
        updated_at: (data.updated_at as Timestamp).toDate(),
      } as Conversation);
    });
    return conversations;
  } catch (error: any) {
    console.error("Error getting conversations for account: ", error);
    throw error;
  }
};

export const updateConversation = async (conversationId: string, conversationData: Partial<Omit<Conversation, "created_at" | "updated_at">>) => {
  try {
    const conversationDoc = doc(conversationsCollection, conversationId);
    const now = Timestamp.now();
    await updateDoc(conversationDoc, {
      ...conversationData,
      updated_at: now,
    });
    // Fetch and return the updated conversation
    return await getConversation(conversationId);
  } catch (error: any) {
    console.error("Error updating conversation: ", error);
    throw error;
  }
};

export const deleteConversation = async (conversationId: string) => {
  try {
    const conversationDoc = doc(conversationsCollection, conversationId);
    await deleteDoc(conversationDoc);
  } catch (error: any) {
    console.error("Error deleting conversation: ", error);
    throw error;
  }
};