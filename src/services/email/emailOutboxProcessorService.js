const { transporter } = require("../../configs/emailClient");
const {
  claimPendingEmailOutboxBatch,
  markEmailOutboxAsFailed,
  markEmailOutboxAsSent,
} = require("../../models/emailOutboxModel");
const { renderEmailTemplate } = require("./emailTemplateService");

const sendEmail = async ({ to, subject, html, text }) => {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
    text,
  });
};

const processPendingEmailOutbox = async () => {
  const batchSize = Number(process.env.EMAIL_WORKER_BATCH_SIZE || 20);
  const rows = await claimPendingEmailOutboxBatch(batchSize);

  if (!rows.length) {
    return;
  }

  console.log(`[email-worker] Correos pendientes tomados: ${rows.length}`);

  for (const row of rows) {
    try {
      const payload =
        typeof row.payload === "string" ? JSON.parse(row.payload) : row.payload;

      const rendered = renderEmailTemplate(row.template, payload);

      await sendEmail({
        to: row.to_email,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
      });

      await markEmailOutboxAsSent(row.id);

      console.log(
        `[email-worker] Correo enviado correctamente. outboxId=${row.id} to=${row.to_email}`
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown email error";

      await markEmailOutboxAsFailed(row.id, errorMessage);

      console.error(
        `[email-worker] Error al enviar correo. outboxId=${row.id} to=${row.to_email} error=${errorMessage}`
      );
    }
  }
};

let emailWorkerInterval = null;

const verifyEmailTransporter = async () => {
  try {
    await transporter.verify();
    console.log("[email-worker] SMTP verificado correctamente.");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "SMTP verify failed";

    console.error(`[email-worker] Error verificando SMTP: ${errorMessage}`);
  }
};

const startEmailOutboxWorker = () => {
  const enabled = String(process.env.EMAIL_WORKER_ENABLED || "false") === "true";

  if (!enabled) {
    console.warn("[email-worker] Worker deshabilitado por configuración.");
    return;
  }

  const intervalMs = Number(process.env.EMAIL_WORKER_INTERVAL_MS || 15000);

  if (emailWorkerInterval) {
    return;
  }

  void verifyEmailTransporter();

  void processPendingEmailOutbox().catch((error) => {
    console.error("[email-worker] Error en ejecución inicial:", error);
  });

  emailWorkerInterval = setInterval(async () => {
    try {
      await processPendingEmailOutbox();
    } catch (error) {
      console.error("[email-worker] Error procesando cola:", error);
    }
  }, intervalMs);

  console.log(`[email-worker] Worker iniciado. Intervalo: ${intervalMs}ms`);
};

module.exports = {
  processPendingEmailOutbox,
  startEmailOutboxWorker,
};