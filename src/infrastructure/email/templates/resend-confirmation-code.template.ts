import { buildOtpEmailLayout } from './otp-email.layout';

export interface ResendConfirmationCodeTemplateOptions {
    name: string;
    code: string;
    confirmUrl?: string;
}

export const resendConfirmationCodeTemplate = ({
    name,
    code,
    confirmUrl,
}: ResendConfirmationCodeTemplateOptions): string =>
    buildOtpEmailLayout({
        pageTitle: 'Nuevo código de confirmación - UpTask',
        heading: 'Tu nuevo código de verificación',
        name,
        code,
        confirmUrl,
        introHtml:
            'Solicitaste un nuevo código para confirmar tu cuenta en <strong style="color: #191a2a; font-weight: 600;">UpTask</strong>. Cualquier código anterior ha quedado invalidado; usa este nuevo código de 6 dígitos en la aplicación:',
        noticeHtml:
            'Si no solicitaste reenviar este código en <strong style="color: #191a2a; font-weight: 600;">UpTask</strong>, puedes ignorar este correo de forma segura. Tu cuenta permanecerá protegida.',
    });
