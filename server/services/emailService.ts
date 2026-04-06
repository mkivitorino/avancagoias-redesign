import nodemailer from "nodemailer";

const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

export async function sendIdeaApprovedEmail(to: string, userName: string, ideaTitle: string) {
  if (!transporter) {
    console.warn("[Email] SMTP not configured, skipping email");
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Goiás Pode Mais" <${process.env.SMTP_USER}>`,
      to,
      subject: `Sua ideia "${ideaTitle}" foi aprovada!`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; background: #f3f6f8; padding: 20px;">
          <div style="background: #001F4D; padding: 24px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: #FFD700; margin: 0; font-size: 24px;">Goiás Pode Mais</h1>
          </div>
          <div style="background: #fff; padding: 32px; border-radius: 0 0 16px 16px;">
            <h2 style="color: #001F4D; margin-top: 0;">Parabéns, ${userName}!</h2>
            <p style="color: #4b5563; line-height: 1.6;">
              Sua ideia <strong>"${ideaTitle}"</strong> foi analisada pela nossa equipe e <span style="color: #16a34a; font-weight: bold;">aprovada</span>!
            </p>
            <p style="color: #4b5563; line-height: 1.6;">
              Ela agora está disponível no mural de ideias para que outros cidadãos possam votar e apoiar sua proposta.
            </p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="https://juventude.avancagoias.com.br/ideias" style="display: inline-block; background: linear-gradient(135deg, #FFD700, #FFC107); color: #001F4D; padding: 12px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px;">
                Ver no Mural de Ideias
              </a>
            </div>
            <p style="color: #9ca3af; font-size: 13px; margin-bottom: 0;">
              Obrigado por participar do Goiás Pode Mais!
            </p>
          </div>
        </div>
      `,
    });
    console.log(`[Email] Approval email sent to ${to}`);
  } catch (error) {
    console.error("[Email] Failed to send:", error);
  }
}
