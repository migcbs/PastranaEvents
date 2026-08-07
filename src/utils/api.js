const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
const TOKEN_KEY = "jp_admin_token";

class ApiUnavailableError extends Error {}

function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

async function request(path, { method = "GET", body, admin = false } = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(admin ? { Authorization: `Bearer ${getToken() || ""}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    throw new ApiUnavailableError("No se pudo conectar con el servidor");
  }

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload.error || `Error ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  isApiUnavailableError: (err) => err instanceof ApiUnavailableError,

  // Auth
  login: (username, password) => request("/api/auth/login", { method: "POST", body: { username, password } }),
  logout: () => request("/api/auth/logout", { method: "POST", admin: true }),
  me: () => request("/api/auth/me", { admin: true }),

  // Leads
  createLead: (data) => request("/api/leads", { method: "POST", body: data }),
  listLeads: () => request("/api/leads", { admin: true }),
  deleteLead: (id) => request(`/api/leads/${id}`, { method: "DELETE", admin: true }),

  // Testimonials
  submitTestimonial: (data) => request("/api/testimonials", { method: "POST", body: data }),
  listApprovedTestimonials: () => request("/api/testimonials/approved"),
  listAllTestimonials: () => request("/api/testimonials", { admin: true }),
  updateTestimonial: (id, patch) =>
    request(`/api/testimonials/${id}`, { method: "PATCH", body: patch, admin: true }),
  deleteTestimonial: (id) => request(`/api/testimonials/${id}`, { method: "DELETE", admin: true }),

  // Translation
  translateBatch: (texts, source, target) =>
    request("/api/translate", { method: "POST", body: { texts, source, target } }),
};
