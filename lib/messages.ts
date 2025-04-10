import { db } from "./firebase";
import { collection, doc, setDoc, getDocs, query, where, updateDoc, deleteDoc, Timestamp, getDoc, orderBy } from "firebase/firestore";
import { Message } from "./models";

const messagesCollection = collection(db, "messages");

export const createMessage = async (messageId: string, messageData: Omit<Message, "created_at">) => {
  try {
    const messageDoc = doc(messagesCollection, messageId);
    const now = Timestamp.now();
    const message: Message = {
      ...messageData,
      created_at: now.toDate(),
    };
    await setDoc(messageDoc, message);
    return message;
  } catch (error: any) {
    console.error("Error creating message: ", error);
    throw error;
  }
};

export const getMessagesByConversation = async (conversationId: string) => {
  try {
    const q = query(
      messagesCollection,
      where("conversation_id", "==", conversationId),
      orderBy("created_at", "asc") // Order messages by creation time
    );
    const querySnapshot = await getDocs(q);
    const messages: Message[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        ...data,
        created_at: (data.created_at as Timestamp).toDate(),
      } as Message);
    });
    return messages;
  } catch (error: any) {
    console.error("Error getting messages: ", error);
    throw error;
  }
};

export const getMessage = async (messageId: string) => {
  try {
    const messageDoc = doc(messagesCollection, messageId);
    const docSnap = await getDoc(messageDoc);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const message: Message = {
        ...data,
        created_at: (data.created_at as Timestamp).toDate(),
      } as Message;
      return message;
    } else {
      return null;
    }
  } catch (error: any) {
    console.error("Error getting message: ", error);
    throw error;
  }
};

export const updateMessage = async (messageId: string, messageData: Partial<Omit<Message, "created_at">>) => {
  try {
    const messageDoc = doc(messagesCollection, messageId);
    await updateDoc(messageDoc, messageData);
    // Fetch and return the updated message
    return getMessage(messageId);
  } catch (error: any) {
    console.error("Error updating message: ", error);
    throw error;
  }
};

export const deleteMessage = async (messageId: string) => {
  try {
    const messageDoc = doc(messagesCollection, messageId);
    await deleteDoc(messageDoc);
  } catch (error: any) {
    console.error("Error deleting message: ", error);
    throw error;
  }
};