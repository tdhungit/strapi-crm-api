export interface MailHistoryType {
  id?: number;
  documentId?: string;
  title: string;
  body: string;
  from_email?: string;
  to_email: string;
  mail_status: string;
  metadata?: any;
  assigned_user?: any;
  source?: string;
  source_id?: number;
  model?: string;
  record_id?: number;
  service_sid?: string;
}

export interface MailAttachmentType {
  filename: string;
  content?: any;
  contentType?: string;
  path?: string;
  href?: string;
}

export interface MailSendType {
  to: string;
  from?: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
  cc?: string; // Comma separated list or an array of recipients
  bcc?: string; // Comma separated list or an array of recipients
  attachments?: MailAttachmentType[];
}

export interface MailSendOptions {
  templateId?: number;
  userId?: number;
  source?: string;
  sourceId?: number;
}
