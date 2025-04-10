import { db } from "./firebase";
import { collection, doc, setDoc, getDocs, query, where, updateDoc, deleteDoc, Timestamp, getDoc } from "firebase/firestore";
import { Attachment } from "./models";

const attachmentsCollection = collection(db, "attachments");

export const createAttachment = async (attachmentId: string, attachmentData: Omit<Attachment, "created_at">) => {
  try {
    const attachmentDoc = doc(attachmentsCollection, attachmentId);
    const now = Timestamp.now();
    const attachment: Attachment = {
      ...attachmentData,
      created_at: now.toDate(),
    };
    await setDoc(attachmentDoc, attachment);
    return attachment;
  } catch (error: any) {
    console.error("Error creating attachment: ", error);
    throw error;
  }
};

export const getAttachmentsByMessage = async (messageId: string) => {
  try {
    const q = query(attachmentsCollection, where("message_id", "==", messageId));
    const querySnapshot = await getDocs(q);
    const attachments: Attachment[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      attachments.push({
        ...data,
        created_at: (data.created_at as Timestamp).toDate(),
      } as Attachment);
    });
    return attachments;
  } catch (error: any) {
    console.error("Error getting attachments: ", error);
    throw error;
  }
};

export const getAttachment = async (attachmentId: string) => {
  try {
    const attachmentDoc = doc(attachmentsCollection, attachmentId);
    const docSnap = await getDoc(attachmentDoc);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const attachment: Attachment = {
        ...data,
        created_at: (data.created_at as Timestamp).toDate(),
      } as Attachment;
      return attachment;
    } else {
      return null;
    }
  } catch (error: any) {
    console.error("Error getting attachment: ", error);
    throw error;
  }
};

export const updateAttachment = async (attachmentId: string, attachmentData: Partial<Omit<Attachment, "created_at">>) => {
  try {
    const attachmentDoc = doc(attachmentsCollection, attachmentId);
    await updateDoc(attachmentDoc, attachmentData);
    // Fetch and return the updated attachment
    return getAttachment(attachmentId);
  } catch (error: any) {
    console.error("Error updating attachment: ", error);
    throw error;
  }
};

export const deleteAttachment = async (attachmentId: string) => {
  try {
    const attachmentDoc = doc(attachmentsCollection, attachmentId);
    await deleteDoc(attachmentDoc);
  } catch (error: any) {
    console.error("Error deleting attachment: ", error);
    throw error;
  }
};