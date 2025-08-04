import { Json } from './supabase';

// External database types for project_snaps table
export interface ProjectSnapRow {
  id: number;
  created_at: string;
  project_id: number;
  items: Json;
  name: string | null;
  categories: string[] | null;
}

export interface ProjectSnapInsert {
  id?: number;
  created_at?: string;
  project_id: number;
  items: Json;
  name?: string | null;
  categories?: string[] | null;
}

export interface ProjectSnapUpdate {
  id?: number;
  created_at?: string;
  project_id?: number;
  items?: Json;
  name?: string | null;
  categories?: string[] | null;
}

// Types for the items JSON structure
export interface DAppItemField {
  key: string;
  value: any;
}

export interface ParsedDAppData {
  appUrl?: string;
  categories?: string[];
  codeRepo?: string;
  dappSmartContracts?: string;
  dateFounded?: string;
  dateLaunch?: string;
  devStatus?: string;
  founders?: Array<{
    name: string;
    title: string;
  }>;
  fundingStatus?: string;
  logoUrl?: string;
  mainDescription?: string;
  name?: string;
  openSource?: boolean;
  orgStructure?: string;
  publicGoods?: boolean;
  tagline?: string;
  tags?: string[];
  tokenContract?: string;
  websites?: Array<{
    url: string;
    title: string;
  }>;
  whitePaper?: string;
}

// External database definition
export interface ExternalDatabase {
  public: {
    Tables: {
      project_snaps: {
        Row: ProjectSnapRow;
        Insert: ProjectSnapInsert;
        Update: ProjectSnapUpdate;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
