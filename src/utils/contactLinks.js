export function onlyDigits(value = "") {
  return value.replace(/[^\d]/g, "");
}

export function buildLeadMessage(lead, fieldsLabels) {
  const lines = [
    `${fieldsLabels.name}: ${lead.name || "-"}`,
    `${fieldsLabels.phone}: ${lead.phone || "-"}`,
    lead.email ? `${fieldsLabels.email}: ${lead.email}` : null,
    `${fieldsLabels.eventType}: ${lead.eventType || "-"}`,
    `${fieldsLabels.eventDate}: ${lead.eventDate || "-"}`,
    `${fieldsLabels.location}: ${lead.location || "-"}`,
    lead.guests ? `${fieldsLabels.guests}: ${lead.guests}` : null,
    lead.packageInterest ? `${fieldsLabels.packageInterest}: ${lead.packageInterest}` : null,
    lead.details ? `${fieldsLabels.details}: ${lead.details}` : null,
  ].filter(Boolean);
  return lines.join("\n");
}

export function buildWhatsappLink(whatsappNumber, message) {
  const digits = onlyDigits(whatsappNumber);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildSmsLink(smsNumber, message) {
  const number = smsNumber.trim();
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const separator = isIOS ? "&" : "?";
  return `sms:${number}${separator}body=${encodeURIComponent(message)}`;
}

export function buildEmailLink(email, subject, message) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}
