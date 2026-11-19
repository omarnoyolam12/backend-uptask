import { buildOtpEmailLayout } from './otp-email.layout';

export interface ConfirmationCodeTemplateOptions {
    name: string;
    code: string;
    confirmUrl?: string;
}

export const confirmationCodeTemplate = ({
    name,
    code,
    confirmUrl,
}: ConfirmationCodeTemplateOptions): string =>
    buildOtpEmailLayout({
        pageTitle: 'Verifica tu correo electrónico - UpTask',
        heading: 'Verifica tu correo electrónico',
        name,
        code,
        confirmUrl,
        introHtml:
            'Gracias por registrarte en <strong style="color: #191a2a; font-weight: 600;">UpTask</strong>. Para activar tu espacio de trabajo y proteger la privacidad de tus proyectos, ingresa el siguiente código de 6 dígitos en la aplicación:',
        noticeHtml:
            'Si no has intentado registrarte en <strong style="color: #191a2a; font-weight: 600;">UpTask</strong> o no reconoces esta solicitud, no te preocupes: puedes desestimar este mensaje de forma segura. Tu correo no será vinculado a ninguna cuenta sin este código.',
    });
