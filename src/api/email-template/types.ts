export interface SendMailOptions {
  mailId?: string;
  from?: string;
  fromName?: string;
  replyTo?: string;
  replyToName?: string;
  cc?: string;
  bcc?: string;
  contentType?: string;
  data?: any;
  template?: any;
  settings?: any;
}

export interface SendMailMultipleDataType {
  to: string | { email: string; name: string };
  data: any;
}
