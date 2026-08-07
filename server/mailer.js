const { Resend } = require("resend");

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function row(label, value) {
  if (!value) return "";
  return `<tr><td style="padding:4px 12px 4px 0;color:#888;font-size:13px;white-space:nowrap;vertical-align:top;">${escapeHtml(
    label
  )}</td><td style="padding:4px 0;font-size:14px;">${escapeHtml(value)}</td></tr>`;
}

// Envía un correo al admin cuando llega una nueva solicitud de reserva.
// Si no hay RESEND_API_KEY o ADMIN_NOTIFICATION_EMAIL configurados, no hace
// nada (silenciosamente) — la reserva ya quedó guardada en la base de datos
// de cualquier forma, así que esto nunca debe bloquear ni fallar esa parte.
async function sendLeadNotification(lead) {
  const to = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!resend || !to) {
    console.warn(
      "[mailer] RESEND_API_KEY o ADMIN_NOTIFICATION_EMAIL no configurados — no se envió notificación por correo."
    );
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL || "Pastrana Events <onboarding@resend.dev>";

  const html = `
    <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="margin:0 0 4px;">Nueva solicitud de reserva</h2>
      <p style="color:#888; margin:0 0 20px; font-size:13px;">Pastrana Events</p>
      <table style="width:100%; border-collapse: collapse;">
        ${row("Nombre", lead.name)}
        ${row("Teléfono", lead.phone)}
        ${row("Correo", lead.email)}
        ${row("Tipo de evento", lead.eventType)}
        ${row("Fecha del evento", lead.eventDate)}
        ${row("Lugar", lead.location)}
        ${row("Invitados", lead.guests)}
        ${row("Paquete de interés", lead.packageInterest)}
        ${row("Detalles", lead.details)}
      </table>
      <p style="margin-top:24px; font-size:12px; color:#888;">
        Recibida el ${new Date(lead.createdAt).toLocaleString()}. Entra al panel de administrador
        (/admin → Solicitudes) para ver todos los detalles.
      </p>
    </div>
  `;

  try {
    await resend.emails.send({
      from,
      to,
      subject: `Nueva reserva: ${lead.name} — ${lead.eventType}`,
      html,
    });
  } catch (err) {
    console.error("[mailer] Error enviando notificación por correo:", err);
  }
}

module.exports = { sendLeadNotification };
