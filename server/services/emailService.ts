import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getEmailTransporter() {
  if (!transporter && process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: parseInt(process.env.SMTP_PORT || "465") === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

export async function sendIdeaApprovedEmail(
  userEmail: string,
  userName: string,
  ideaTitle: string,
  ideaId: number
) {
  const t = getEmailTransporter();
  if (!t) {
    console.warn("[Email] SMTP not configured, skipping email");
    return;
  }

  const baseUrl = "https://juventude.avancagoias.com.br";
  const ideaUrl = `${baseUrl}/ideias`;
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || "";

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #00379e;">Sua ideia está no ar! 🟢</h2>

      <p>Olá <strong>${userName}</strong>,</p>

      <p>Sua ideia foi analisada pela nossa equipe e acaba de ser publicada no <strong>Goiás Pode Mais</strong>.</p>

      <p>Isso significa que ela já está disponível para outras pessoas conhecerem, votarem e ajudarem a transformar em parte do plano de governo para Goiás.</p>

      <p style="margin: 30px 0;">
        <a href="${ideaUrl}" style="background-color: #008a4d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
          👉 Confira sua ideia publicada
        </a>
      </p>

      <p><strong>Agora, um pedido:</strong> compartilhe com quem você acha que se importa com esse tema.</p>

      <p>Pode ser um amigo, um familiar, alguém do trabalho. Quanto mais gente votar e participar, mais forte a ideia fica.</p>

      <p>E se alguém da sua rede também tiver uma proposta, o caminho é o mesmo: é só acessar o site e enviar.</p>

      <p><strong>Goiás se constrói com quem vive aqui.</strong></p>

      <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px;">
        <strong>Goiás Pode Mais</strong><br>
        <a href="https://avancagoias.com.br" style="color: #008a4d; text-decoration: none;">avancagoias.com.br</a>
      </p>
    </div>
  `;

  const textContent = `Sua ideia está no ar! 🟢

Olá ${userName},

Sua ideia foi analisada pela nossa equipe e acaba de ser publicada no Goiás Pode Mais.

Isso significa que ela já está disponível para outras pessoas conhecerem, votarem e ajudarem a transformar em parte do plano de governo para Goiás.

👉 Confira sua ideia publicada: ${ideaUrl}

Agora, um pedido: compartilhe com quem você acha que se importa com esse tema.

Pode ser um amigo, um familiar, alguém do trabalho. Quanto mais gente votar e participar, mais forte a ideia fica.

E se alguém da sua rede também tiver uma proposta, o caminho é o mesmo: é só acessar o site e enviar.

Goiás se constrói com quem vive aqui.

Goiás Pode Mais.
avancagoias.com.br`;

  try {
    await t.sendMail({
      from: fromEmail,
      to: userEmail,
      subject: "Sua ideia está no ar! 🟢",
      html: htmlContent,
      text: textContent,
    });
    console.log(`[Email] Approval email sent to ${userEmail}`);
  } catch (error) {
    console.error("[Email] Failed to send:", error);
  }
}
