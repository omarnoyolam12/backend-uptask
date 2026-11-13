export interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
}

export abstract class EmailSender {
    abstract send(options: SendEmailOptions): Promise<void>;
}

