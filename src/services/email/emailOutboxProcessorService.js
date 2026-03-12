const { transporter } = require('../../configs/emailClient');
const {
  claimPendingEmailOutboxBatch,
  markEmailOutboxAsFailed,
  markEmailOutboxAsSent,
} = require('../../models/emailOutboxModel');
const { renderEmailTemplate } = require('./emailTemplateService');

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

  for (const row of rows) {
    try {
      const payload =
        typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload;

      const rendered = renderEmailTemplate(row.template, payload);

      await sendEmail({
        to: row.to_email,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
      });

      await markEmailOutboxAsSent(row.id);
    } catch (error) {
      await markEmailOutboxAsFailed(
        row.id,
        error instanceof Error ? error.message : 'Unknown email error'
      );
    }
  }
};

let emailWorkerInterval = null;

const startEmailOutboxWorker = () => {
  const enabled = String(process.env.EMAIL_WORKER_ENABLED || 'false') === 'true';
  if (!enabled) return;

  const intervalMs = Number(process.env.EMAIL_WORKER_INTERVAL_MS || 15000);

  if (emailWorkerInterval) return;

  emailWorkerInterval = setInterval(async () => {
    try {
      await processPendingEmailOutbox();
    } catch (error) {
      console.error('Email worker error:', error);
    }
  }, intervalMs);

  console.log(`Email worker started. Interval: ${intervalMs}ms`);
};

module.exports = {
  processPendingEmailOutbox,
  startEmailOutboxWorker,
};