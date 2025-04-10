"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChangedHelper } from "../firebase-auth"; // Import onAuthStateChangedHelper
import { getUser } from "../lib/users"; // Import getUser
import { getAccountsForUser } from "../lib/account_members"; // Import getAccountsForUser
import { signIn, signUp, signOutUser } from "../lib/firebase-auth"; // Import auth functions
import { User as UserModel, Account as AccountModel } from "../lib/models"; // Import User and Account interfaces

interface User extends Omit<UserModel, "created_at" | "updated_at"> {
  id: string;
}

interface Account extends Omit<AccountModel, "created_at" | "updated_at"> {
  id: string;
}

interface AuthContextType {
  user: User | null;
  accounts: Account[];
  selectedAccount: Account | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  selectAccount: (account: Account) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Use onAuthStateChangedHelper to listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper(async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        try {
          // Fetch user data from Firestore
          const userData = await getUser(firebaseUser.uid);
          if (userData) {
            setUser({ id: firebaseUser.uid, ...userData });

            // Fetch user accounts
            const userAccounts = await getAccountsForUser(firebaseUser.uid);
            setAccounts(userAccounts);

            // Set selected account to first account if available
            if (userAccounts.length > 0) {
              setSelectedAccount(userAccounts[0]);
            } else {
              setSelectedAccount(null);
            }
          } else {
            setUser(null);
            setAccounts([]);
            setSelectedAccount(null);
          }
        } catch (err: any) {
          console.error("Error fetching user data:", err);
          setError(err.message || "Error fetching user data");
          setUser(null);
          setAccounts([]);
          setSelectedAccount(null);
        }
      } else {
        // User is signed out
        setUser(null);
        setAccounts([]);
        setSelectedAccount(null);
      }
      setIsLoading(false);
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn(email, password);
      // The onAuthStateChangedHelper listener will handle updating the user state
      router.push("/chat");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await signUp(email, password);
      // After successful signup, create user document in firestore
      // The onAuthStateChangedHelper listener will handle updating the user state
      router.push("/chat");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      await signOutUser();
      // The onAuthStateChangedHelper listener will handle updating the user state
      router.push("/");
    } catch (err: any) {
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Select account function
  const selectAccount = (account: Account) => {
    setSelectedAccount(account);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accounts,
        selectedAccount,
        isLoading,
        error,
        login,
        signup,
        logout,
        selectAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

