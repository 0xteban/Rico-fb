import { db } from "./firebase";
import { collection, doc, setDoc, getDocs, query, where, updateDoc, deleteDoc, getDoc, Timestamp } from "firebase/firestore";
import { Category } from "./models";

const categoriesCollection = collection(db, "categories");

export const createCategory = async (categoryId: string, categoryData: Omit<Category, "created_at">) => {
  try {
    const categoryDoc = doc(categoriesCollection, categoryId);
    const now = Timestamp.now();
    const category: Category = {
      ...categoryData,
      created_at: now.toDate(),
    };
    await setDoc(categoryDoc, category);
    return category;
  } catch (error: any) {
    console.error("Error creating category: ", error);
    throw error;
  }
};

export const getCategoriesByAccount = async (accountId: string) => {
  try {
    const q = query(categoriesCollection, where("account_id", "==", accountId));
    const querySnapshot = await getDocs(q);
    const categories: Category[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      categories.push({
        ...data,
        created_at: (data.created_at as Timestamp).toDate(),
      } as Category);
    });
    return categories;
  } catch (error: any) {
    console.error("Error getting categories: ", error);
    throw error;
  }
};

export const updateCategory = async (categoryId: string, categoryData: Partial<Omit<Category, "created_at">>) => {
  try {
    const categoryDoc = doc(categoriesCollection, categoryId);
    await updateDoc(categoryDoc, categoryData);
    // Fetch and return the updated category (optional, for consistency)
    return getCategory(categoryId);
  } catch (error: any) {
    console.error("Error updating category: ", error);
    throw error;
  }
};

export const deleteCategory = async (categoryId: string) => {
  try {
    const categoryDoc = doc(categoriesCollection, categoryId);
    await deleteDoc(categoryDoc);
  } catch (error: any) {
    console.error("Error deleting category: ", error);
    throw error;
  }
};

export const getCategory = async (categoryId: string) => {
    try {
      const categoryDoc = doc(categoriesCollection, categoryId);
      const docSnap = await getDoc(categoryDoc);
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Convert Firestore Timestamps to JavaScript Dates
        const category: Category = {
          ...data,
          created_at: (data.created_at as Timestamp).toDate(),
        } as Category;
        return category;
      } else {
        return null;
      }
    } catch (error: any) {
      console.error("Error getting category: ", error);
      throw error;
    }
  };