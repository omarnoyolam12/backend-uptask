import { Resend } from 'resend';
import { EmailSender, SendEmailOptions } from '../../domain/adapters/email-sender.adapter';

export interface ResendEmailSenderOptions {
    apiKey: string;
    from: string;
}

export class ResendEmailSender implements EmailSender {
    private readonly resend: Resend;
    private readonly from: string;

    constructor({ apiKey, from }: ResendEmailSenderOptions) {
        this.resend = new Resend(apiKey);
        this.from = from;
    }

    async send({ to, subject, html }: SendEmailOptions): Promise<void> {
        const { error } = await this.resend.emails.send({
            from: this.from,
            to,
            subject,
            html,
        });

        if (error) {
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
}

