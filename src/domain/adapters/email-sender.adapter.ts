export interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
}

export abstract class EmailSender {
    abstract send(options: SendEmailOptions): Promise<void>;
    abstract sendConfirmationEmail(to: string, name: string, code: string): Promise<void>;
    abstract sendResendConfirmationEmail(to: string, name: string, code: string): Promise<void>;
}

