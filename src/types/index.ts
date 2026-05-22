export type DocumentStatus = 'uploaded' | 'extracted' | 'analyzed' | 'reviewed' | 'exported';

export type DocumentType = 'invoice' | 'credit_note' | 'receipt' | 'statement' | null;

export interface DocumentSummary {
  id: string;
  filename: string;
  status: DocumentStatus;
  doc_type: DocumentType;
  created_at: string;
}

export interface DocumentPage {
  page_no: number;
  text?: string;
  engine?: string;
  confidence?: number;
}

export interface DocumentDetail extends DocumentSummary {
  pages: DocumentPage[];
  supplier_name?: string;
  vat_number?: string;
  invoice_number?: string;
  invoice_date?: string;
  due_date?: string;
  subtotal?: number;
  vat_amount?: number;
  total_amount?: number;
  currency?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  organisation_id: string;
  role: string;
}

export type ExportType = 'csv' | 'excel' | 'xero' | 'sage' | 'quickbooks';

export interface ExportRun {
  id: string;
  export_type: ExportType;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  period?: string | null;
  download_url?: string;
}

export interface ReviewAction {
  id: string;
  action_type: 'approve' | 'reject' | 'correct_field';
  field_name?: string | null;
  corrected_value?: string | null;
  created_at: string;
}
