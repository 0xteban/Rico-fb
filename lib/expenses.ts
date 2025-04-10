import { db } from "./firebase";
import { collection, doc, setDoc, getDocs, query, where, updateDoc, deleteDoc, Timestamp, getDoc } from "firebase/firestore";
import { Expense } from "./models";

const expensesCollection = collection(db, "expenses");

export const createExpense = async (expenseId: string, expenseData: Omit<Expense, "created_at" | "updated_at">) => {
  try {
    const expenseDoc = doc(expensesCollection, expenseId);
    const now = Timestamp.now();
    const expense: Expense = {
      ...expenseData,
      created_at: now.toDate(),
      updated_at: now.toDate(),
    };
    await setDoc(expenseDoc, expense);
    return expense;
  } catch (error: any) {
    console.error("Error creating expense: ", error);
    throw error;
  }
};

export const getExpensesByAccount = async (accountId: string) => {
  try {
    const q = query(expensesCollection, where("account_id", "==", accountId));
    const querySnapshot = await getDocs(q);
    const expenses: Expense[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      expenses.push({
        ...data,
        date: (data.date as Timestamp).toDate(),
        created_at: (data.created_at as Timestamp).toDate(),
        updated_at: (data.updated_at as Timestamp).toDate(),
      } as Expense);
    });
    return expenses;
  } catch (error: any) {
    console.error("Error getting expenses: ", error);
    throw error;
  }
};

export const getExpense = async (expenseId: string) => {
  try {
    const expenseDoc = doc(expensesCollection, expenseId);
    const docSnap = await getDoc(expenseDoc);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const expense: Expense = {
        ...data,
        date: (data.date as Timestamp).toDate(),
        created_at: (data.created_at as Timestamp).toDate(),
        updated_at: (data.updated_at as Timestamp).toDate(),
      } as Expense;
      return expense;
    } else {
      return null;
    }
  } catch (error: any) {
    console.error("Error getting expense: ", error);
    throw error;
  }
};

export const updateExpense = async (expenseId: string, expenseData: Partial<Omit<Expense, "created_at" | "updated_at">>) => {
  try {
    const expenseDoc = doc(expensesCollection, expenseId);
    const now = Timestamp.now();
    // Ensure date is converted to Timestamp if it's a Date object
    const updatedData = {
      ...expenseData,
      updated_at: now,
    };
    if (expenseData.date instanceof Date) {
      updatedData.date = Timestamp.fromDate(expenseData.date);
    }
    await updateDoc(expenseDoc, updatedData);
    // Fetch and return the updated expense
    return getExpense(expenseId);
  } catch (error: any) {
    console.error("Error updating expense: ", error);
    throw error;
  }
};

export const deleteExpense = async (expenseId: string) => {
  try {
    const expenseDoc = doc(expensesCollection, expenseId);
    await deleteDoc(expenseDoc);
  } catch (error: any) {
    console.error("Error deleting expense: ", error);
    throw error;
  }
};