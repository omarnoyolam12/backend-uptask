export interface ConfirmationCodeTemplateOptions {
    name: string;
    code: string;
    confirmUrl?: string;
}

const escapeHtml = (value: string): string =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

export const confirmationCodeTemplate = ({
    name,
    code,
    confirmUrl,
}: ConfirmationCodeTemplateOptions): string => {
    const safeName = escapeHtml(name);
    const safeCode = escapeHtml(code);

    const ctaSection = confirmUrl
        ? `
            <tr>
                <td align="center" style="padding-top: 20px;">
                    <a href="${escapeHtml(confirmUrl)}" style="display: inline-block; background-color: #b60f44; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 9999px;">
                        Confirmar cuenta automáticamente &rarr;
                    </a>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding-top: 10px; font-size: 11px; line-height: 16px; font-weight: 600; color: #5a5b67;">
                    ¿Prefieres ingresar el código manualmente? Vuelve a la pestaña de registro.
                </td>
            </tr>
        `
        : `
            <tr>
                <td align="center" style="padding-top: 14px; font-size: 12px; line-height: 18px; font-weight: 500; color: #5a5b67;">
                    Ingresa este código en la pestaña de registro para confirmar tu cuenta.
                </td>
            </tr>
        `;

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verifica tu correo electrónico - UpTask</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f0f7; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #191a2a; -webkit-font-smoothing: antialiased;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f0f7; padding: 32px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(25, 26, 42, 0.06);">
                    <!-- Brand Top Header -->
                    <tr>
                        <td style="padding: 28px 32px 16px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="left" valign="middle">
                                        <table role="presentation" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center" valign="middle" width="40" height="40" style="width: 40px; height: 40px; background-color: #b60f44; border-radius: 12px; color: #ffffff; font-size: 20px; font-weight: 700;">
                                                    &#10003;
                                                </td>
                                                <td style="padding-left: 10px; font-size: 20px; font-weight: 700; color: #191a2a; letter-spacing: -0.02em;">
                                                    UpTask<span style="color: #b60f44; font-weight: 900;">.</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td align="right" valign="middle">
                                        <span style="display: inline-block; padding: 5px 12px; border-radius: 9999px; background-color: #f4f2ff; color: #5d5d6e; font-size: 11px; font-weight: 600;">
                                            <span style="color: #b60f44;">&#9679;</span>&nbsp; Verificación segura
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Accent Top Hairline Gradient -->
                    <tr>
                        <td style="height: 4px; background: linear-gradient(90deg, #b60f44 0%, #d9315b 55%, #e3e0f5 100%); background-color: #b60f44; font-size: 0; line-height: 0;">&nbsp;</td>
                    </tr>

                    <!-- Card Inner Content Area -->
                    <tr>
                        <td style="padding: 32px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <!-- Title & Salutation -->
                                <tr>
                                    <td style="padding-bottom: 12px;">
                                        <h1 style="margin: 0; font-size: 26px; line-height: 34px; font-weight: 700; color: #191a2a; letter-spacing: -0.02em;">
                                            Verifica tu correo electrónico
                                        </h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 10px; font-size: 16px; line-height: 24px; font-weight: 600; color: #191a2a;">
                                        Hola, ${safeName} 👋
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 24px; font-size: 14px; line-height: 22px; color: #5d5d6e;">
                                        Gracias por registrarte en <strong style="color: #191a2a; font-weight: 600;">UpTask</strong>. Para activar tu espacio de trabajo y proteger la privacidad de tus proyectos, ingresa el siguiente código de 6 dígitos en la aplicación:
                                    </td>
                                </tr>

                                <!-- 6-Digit OTP Box -->
                                <tr>
                                    <td style="background-color: #f4f2ff; border-radius: 16px; padding: 24px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center" style="font-size: 11px; line-height: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #5a5b67; padding-bottom: 14px;">
                                                    Código de un solo uso (OTP)
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center" style="padding: 8px 0;">
                                                    <span style="font-size: 38px; line-height: 44px; font-weight: 700; letter-spacing: 0.14em; color: #191a2a;">${safeCode}</span>
                                                </td>
                                            </tr>
                                            ${ctaSection}
                                            <tr>
                                                <td style="padding-top: 20px; border-top: 1px solid #edecff;">
                                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td align="left" style="padding-top: 12px; font-size: 12px; line-height: 18px; font-weight: 500; color: #5d5d6e;">
                                                                &#9200; Válido durante <strong style="color: #191a2a;">15 minutos</strong>
                                                            </td>
                                                            <td align="right" style="padding-top: 12px; font-size: 12px; line-height: 18px; font-weight: 500; color: #5d5d6e;">
                                                                <span style="color: #b60f44;">&#128737;</span> Nunca compartas este código
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Security Notice Box -->
                                <tr>
                                    <td style="padding-top: 24px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #edecff; border-radius: 12px;">
                                            <tr>
                                                <td style="padding: 16px; font-size: 13px; line-height: 20px; color: #5d5d6e;">
                                                    Si no has intentado registrarte en <strong style="color: #191a2a; font-weight: 600;">UpTask</strong> o no reconoces esta solicitud, no te preocupes: puedes desestimar este mensaje de forma segura. Tu correo no será vinculado a ninguna cuenta sin este código.
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Team Signature -->
                                <tr>
                                    <td style="padding-top: 24px;">
                                        <p style="margin: 0 0 4px; font-size: 14px; line-height: 20px; color: #5d5d6e;">
                                            Con entusiasmo,
                                        </p>
                                        <p style="margin: 0; font-size: 15px; line-height: 22px; font-weight: 600; color: #191a2a;">
                                            El equipo de seguridad de UpTask
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};
