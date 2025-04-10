import { db } from "./firebase";
import { collection, doc, setDoc, getDoc, getDocs, query, where, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { Invitation } from "./models";

const invitationsCollection = collection(db, "invitations");

export const createInvitation = async (invitationId: string, invitationData: Omit<Invitation, "created_at" | "expires_at"> & { expires_at: Date }) => {
  try {
    const invitationDoc = doc(invitationsCollection, invitationId);
    const now = Timestamp.now();
    const invitation: Invitation = {
      ...invitationData,
      created_at: now.toDate(),
      expires_at: invitationData.expires_at, // Assuming expires_at is already a Date object
    };
    // Convert expires_at to Firestore Timestamp
    await setDoc(invitationDoc, {
      ...invitation,
      expires_at: Timestamp.fromDate(invitation.expires_at),
    });
    return invitation;
  } catch (error: any) {
    console.error("Error creating invitation: ", error);
    throw error;
  }
};

export const getInvitation = async (invitationId: string) => {
  try {
    const invitationDoc = doc(invitationsCollection, invitationId);
    const docSnap = await getDoc(invitationDoc);
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Convert Firestore Timestamps to JavaScript Dates
      const invitation: Invitation = {
        ...data,
        created_at: (data.created_at as Timestamp).toDate(),
        expires_at: (data.expires_at as Timestamp).toDate(),
        accepted_at: data.accepted_at ? (data.accepted_at as Timestamp).toDate() : null,
      } as Invitation;
      return invitation;
    } else {
      return null;
    }
  } catch (error: any) {
    console.error("Error getting invitation: ", error);
    throw error;
  }
};

export const getInvitationsByAccount = async (accountId: string) => {
  try {
    const q = query(invitationsCollection, where("account_id", "==", accountId));
    const querySnapshot = await getDocs(q);
    const invitations: Invitation[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      invitations.push({
        ...data,
        created_at: (data.created_at as Timestamp).toDate(),
        expires_at: (data.expires_at as Timestamp).toDate(),
        accepted_at: data.accepted_at ? (data.accepted_at as Timestamp).toDate() : null,
      } as Invitation);
    });
    return invitations;
  } catch (error: any) {
    console.error("Error getting invitations for account: ", error);
    throw error;
  }
};

export const updateInvitation = async (invitationId: string, invitationData: Partial<Omit<Invitation, "created_at" | "expires_at"> & { expires_at?: Date }>) => {
  try {
    const invitationDoc = doc(invitationsCollection, invitationId);
    // Handle expires_at conversion if it's a Date object
    const updatedData: any = { ...invitationData };
    if (invitationData.expires_at instanceof Date) {
      updatedData.expires_at = Timestamp.fromDate(invitationData.expires_at);
    }
    if (invitationData.accepted_at instanceof Date) {
        updatedData.accepted_at = Timestamp.fromDate(invitationData.accepted_at);
    }
    await updateDoc(invitationDoc, updatedData);
    // Fetch and return the updated invitation
    return await getInvitation(invitationId);
  } catch (error: any) {
    console.error("Error updating invitation: ", error);
    throw error;
  }
};

export const deleteInvitation = async (invitationId: string) => {
  try {
    const invitationDoc = doc(invitationsCollection, invitationId);
    await deleteDoc(invitationDoc);
  } catch (error: any) {
    console.error("Error deleting invitation: ", error);
    throw error;
  }
};