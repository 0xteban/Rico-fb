export interface User {
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Account {
  name: string;
  description: string | null;
  is_personal: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AccountMember {
  user_id: string;
  account_id: string;
  role: "owner" | "editor" | "viewer";
  created_at: Date;
}

export interface Category {
  account_id: string;
  name: string;
  icon: string | null;
  color: string | null;
  created_at: Date;
  created_by: string | null;
}

export interface Expense {
  account_id: string;
  amount: number;
  description: string | null;
  vendor: string | null;
  date: Date;
  created_by: string | null;
  created_at: Date;
  updated_at: Date;
  receipt_url: string | null;
  metadata: Record<string, any> | null;
}

export interface ExpenseCategory {
  expense_id: string;
  category_id: string;
  created_at: Date;
}

export interface Conversation {
  account_id: string;  // Assuming conversations are linked to accounts
  title: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Message {
  conversation_id: string;
  user_id: string | null;
  is_from_ai: boolean;
  content: string | null;
  created_at: Date;
  metadata: Record<string, any> | null;
}

export interface Attachment {
  message_id: string;
  file_url: string;
  file_type: string;
  created_at: Date;
}

export interface Invitation {
  account_id: string;
  email: string;
  role: "editor" | "viewer";
  token: string;
  invited_by: string | null;
  created_at: Date;
  expires_at: Date;
  accepted_at: Date | null;
}