const { buildEmailLayout, escapeHtml } = require("../../utils/emailHtml");

const formatDateTime = (dateValue, timeValue) => {
  const safeDate = escapeHtml(dateValue || "");
  const safeTime = escapeHtml(timeValue || "");
  return `${safeDate} ${safeTime}`.trim();
};

const buildCtaButton = (label, href) => {
  return `
    <div style="margin-top:24px;">
      <a
        href="${escapeHtml(href)}"
        style="display:inline-block;padding:12px 20px;border-radius:999px;background:#0f172a;color:#ffffff;text-decoration:none;font-weight:700;"
      >
        ${escapeHtml(label)}
      </a>
    </div>
  `;
};

const renderGuestAppointmentConfirmation = (payload) => {
  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:15px;line-height:1.8;">
      Hola <strong>${escapeHtml(payload.contactName)}</strong>, tu reserva fue registrada correctamente.
    </p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0 10px;">
      <tr>
        <td style="padding:14px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;">
          <strong>Mascota:</strong> ${escapeHtml(payload.petName)}
        </td>
      </tr>
      <tr>
        <td style="padding:14px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;">
          <strong>Atención:</strong> ${escapeHtml(payload.appointmentTypeName)}
        </td>
      </tr>
      <tr>
        <td style="padding:14px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;">
          <strong>Veterinario:</strong> ${escapeHtml(payload.veterinarianName)}
        </td>
      </tr>
      <tr>
        <td style="padding:14px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;">
          <strong>Fecha y hora:</strong> ${formatDateTime(payload.appointmentDate, payload.appointmentTime)}
        </td>
      </tr>
      <tr>
        <td style="padding:14px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;">
          <strong>Motivo:</strong> ${escapeHtml(payload.reason)}
        </td>
      </tr>
    </table>

    <p style="margin:20px 0 0;font-size:15px;line-height:1.8;color:#475569;">
      Si necesitas modificar tu reserva, comunícate con PETNOVA.
    </p>
  `;

  return {
    subject: "Confirmación de reserva - PETNOVA",
    html: buildEmailLayout({
      title: "Confirmación de reserva",
      previewText: "Tu cita en PETNOVA fue registrada correctamente.",
      bodyHtml,
    }),
    text: `Hola ${payload.contactName}. Tu reserva para ${payload.petName} fue registrada para ${payload.appointmentDate} ${payload.appointmentTime}.`,
  };
};

const renderAccountCreated = (payload) => {
  const loginUrl = `${process.env.APP_BASE_URL}/login`;

  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:15px;line-height:1.8;">
      Hola <strong>${escapeHtml(payload.fullName)}</strong>, tu cuenta en PETNOVA fue creada correctamente.
    </p>
    <p style="margin:0;font-size:15px;line-height:1.8;color:#475569;">
      Ya puedes acceder al portal del cliente usando tu correo:
      <strong>${escapeHtml(payload.email)}</strong>.
    </p>
    ${buildCtaButton("Ir al portal", loginUrl)}
  `;

  return {
    subject: "Tu cuenta PETNOVA fue creada",
    html: buildEmailLayout({
      title: "Cuenta creada correctamente",
      previewText: "Tu cuenta PETNOVA ya está activa.",
      bodyHtml,
    }),
    text: `Hola ${payload.fullName}. Tu cuenta PETNOVA fue creada correctamente.`,
  };
};

const renderPasswordReset = (payload) => {
  const resetUrl = `${process.env.APP_BASE_URL}/reset-password?token=${encodeURIComponent(payload.token)}`;

  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:15px;line-height:1.8;">
      Hemos recibido una solicitud para restablecer tu contraseña.
    </p>
    <p style="margin:0;font-size:15px;line-height:1.8;color:#475569;">
      Este enlace expirará según la configuración de seguridad del sistema.
    </p>
    ${buildCtaButton("Restablecer contraseña", resetUrl)}
  `;

  return {
    subject: "Restablece tu contraseña - PETNOVA",
    html: buildEmailLayout({
      title: "Restablece tu contraseña",
      previewText: "Usa este enlace para definir una nueva contraseña.",
      bodyHtml,
    }),
    text: `Restablece tu contraseña desde este enlace: ${resetUrl}`,
  };
};

const renderPetCreated = (payload) => {
  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:15px;line-height:1.8;">
      Se registró correctamente una nueva mascota en tu cuenta.
    </p>
    <p style="margin:0;font-size:15px;line-height:1.8;color:#475569;">
      <strong>Mascota:</strong> ${escapeHtml(payload.petName)}<br/>
      <strong>Especie:</strong> ${escapeHtml(payload.species)}<br/>
      <strong>Raza:</strong> ${escapeHtml(payload.breed)}
    </p>
  `;

  return {
    subject: "Nueva mascota registrada - PETNOVA",
    html: buildEmailLayout({
      title: "Mascota registrada",
      previewText: "Se agregó una nueva mascota a tu cuenta.",
      bodyHtml,
    }),
    text: `Se registró la mascota ${payload.petName} en tu cuenta.`,
  };
};

const renderUserProfileUpdated = (payload) => {
  const bodyHtml = `
    <p style="margin:0;font-size:15px;line-height:1.8;">
      Hola <strong>${escapeHtml(payload.fullName)}</strong>, tus datos de perfil fueron actualizados correctamente en PETNOVA.
    </p>
  `;

  return {
    subject: "Tus datos fueron actualizados - PETNOVA",
    html: buildEmailLayout({
      title: "Perfil actualizado",
      previewText: "Tus datos de usuario fueron actualizados.",
      bodyHtml,
    }),
    text: `Tus datos fueron actualizados correctamente en PETNOVA.`,
  };
};

const renderAppointmentCreated = (payload) => {
  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:15px;line-height:1.8;">
      Tu cita fue registrada correctamente.
    </p>
    <p style="margin:0;font-size:15px;line-height:1.8;color:#475569;">
      <strong>Mascota:</strong> ${escapeHtml(payload.petName)}<br/>
      <strong>Fecha y hora:</strong> ${formatDateTime(payload.appointmentDate, payload.appointmentTime)}<br/>
      <strong>Veterinario:</strong> ${escapeHtml(payload.veterinarianName)}
    </p>
  `;

  return {
    subject: "Cita registrada - PETNOVA",
    html: buildEmailLayout({
      title: "Cita registrada",
      previewText: "Tu cita médica fue registrada correctamente.",
      bodyHtml,
    }),
    text: `Tu cita para ${payload.petName} fue registrada para ${payload.appointmentDate} ${payload.appointmentTime}.`,
  };
};

const renderAppointmentRescheduled = (payload) => {
  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:15px;line-height:1.8;">
      Tu cita fue reagendada correctamente.
    </p>
    <p style="margin:0;font-size:15px;line-height:1.8;color:#475569;">
      <strong>Nueva fecha y hora:</strong> ${formatDateTime(payload.appointmentDate, payload.appointmentTime)}
    </p>
  `;

  return {
    subject: "Cita reagendada - PETNOVA",
    html: buildEmailLayout({
      title: "Cita reagendada",
      previewText: "Tu cita fue reagendada correctamente.",
      bodyHtml,
    }),
    text: `Tu cita fue reagendada para ${payload.appointmentDate} ${payload.appointmentTime}.`,
  };
};

const renderAppointmentCancelled = (payload) => {
  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:15px;line-height:1.8;">
      Tu cita fue cancelada.
    </p>
    <p style="margin:0;font-size:15px;line-height:1.8;color:#475569;">
      <strong>Motivo:</strong> ${escapeHtml(payload.cancelReason || "No informado")}
    </p>
  `;

  return {
    subject: "Cita cancelada - PETNOVA",
    html: buildEmailLayout({
      title: "Cita cancelada",
      previewText: "Tu cita fue cancelada.",
      bodyHtml,
    }),
    text: `Tu cita fue cancelada. Motivo: ${payload.cancelReason || "No informado"}.`,
  };
};

const renderAppointmentReminder = (payload) => {
  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:15px;line-height:1.8;">
      Te recordamos tu próxima cita en PETNOVA.
    </p>
    <p style="margin:0;font-size:15px;line-height:1.8;color:#475569;">
      <strong>Mascota:</strong> ${escapeHtml(payload.petName)}<br/>
      <strong>Fecha y hora:</strong> ${formatDateTime(payload.appointmentDate, payload.appointmentTime)}
    </p>
  `;

  return {
    subject: "Recordatorio de cita - PETNOVA",
    html: buildEmailLayout({
      title: "Recordatorio de cita",
      previewText: "Tu cita en PETNOVA está próxima.",
      bodyHtml,
    }),
    text: `Recordatorio: tu cita para ${payload.petName} es el ${payload.appointmentDate} a las ${payload.appointmentTime}.`,
  };
};

const renderEmailTemplate = (template, payload) => {
  switch (template) {
    case "guest_appointment_confirmation":
      return renderGuestAppointmentConfirmation(payload);
    case "account_created":
      return renderAccountCreated(payload);
    case "password_reset":
      return renderPasswordReset(payload);
    case "pet_created":
      return renderPetCreated(payload);
    case "user_profile_updated":
      return renderUserProfileUpdated(payload);
    case "appointment_created":
      return renderAppointmentCreated(payload);
    case "appointment_rescheduled":
      return renderAppointmentRescheduled(payload);
    case "appointment_cancelled":
      return renderAppointmentCancelled(payload);
    case "appointment_reminder":
      return renderAppointmentReminder(payload);
    case "password_changed":
      return renderPasswordChanged(payload);
    default:
      throw new Error(`Plantilla de correo no soportada: ${template}`);
  }
};

const renderPasswordChanged = (payload) => {
  const bodyHtml = `
    <p style="margin:0;font-size:15px;line-height:1.8;">
      Hola <strong>${escapeHtml(payload.fullName)}</strong>, tu contraseña fue actualizada correctamente en PETNOVA.
    </p>
    <p style="margin:16px 0 0;font-size:15px;line-height:1.8;color:#475569;">
      Si no realizaste este cambio, te recomendamos contactarte inmediatamente con soporte.
    </p>
  `;

  return {
    subject: "Tu contraseña fue actualizada - PETNOVA",
    html: buildEmailLayout({
      title: "Contraseña actualizada",
      previewText: "Tu contraseña fue cambiada correctamente.",
      bodyHtml,
    }),
    text: `Hola ${payload.fullName}. Tu contraseña fue actualizada correctamente en PETNOVA.`,
  };
};

module.exports = {
  renderEmailTemplate,
};
