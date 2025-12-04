// Simple type definitions - nothing complex

export type UserRole = 'advocate' | 'client';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
}

export interface Case {
  id: string;
  advocate_id: string;
  client_id?: string;
  title: string;
  case_number?: string;
  court?: string;
  stage: string;
  parties: { petitioners: string[]; respondents: string[] };
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  case_id: string;
  name: string;
  file_path: string;
  file_type: string;
  created_at: string;
}

export interface Hearing {
  id: string;
  case_id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  notes?: string;
  reminder: boolean;
}

export interface Message {
  id: string;
  case_id?: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface Template {
  id: string;
  advocate_id: string;
  name: string;
  file_path: string;
  variables: string[];
  created_at: string;
}
