import { createContext, useCallback, useContext, useState } from "react";
import { api } from "../utils/api";

const FALLBACK_KEY = "jp_testimonials_fallback";
const TestimonialsDataContext = createContext(null);

function readFallback() {
  try {
    return JSON.parse(localStorage.getItem(FALLBACK_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeFallback(items) {
  localStorage.setItem(FALLBACK_KEY, JSON.stringify(items));
}

export function TestimonialsDataProvider({ children }) {
  const [approved, setApproved] = useState([]);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);

  const fetchApproved = useCallback(async () => {
    try {
      const remote = await api.listApprovedTestimonials();
      setApproved(remote);
      setOffline(false);
    } catch {
      setApproved(readFallback().filter((t) => t.status === "APPROVED"));
      setOffline(true);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const remote = await api.listAllTestimonials();
      setAll(remote);
      setOffline(false);
    } catch {
      setAll(readFallback());
      setOffline(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitTestimonial = useCallback(async (data) => {
    try {
      const testimonial = await api.submitTestimonial(data);
      return { testimonial, offline: false };
    } catch {
      const fallbackItem = {
        ...data,
        id: `local-${Date.now()}`,
        status: "PENDING",
        createdAt: new Date().toISOString(),
      };
      const current = readFallback();
      writeFallback([fallbackItem, ...current]);
      return { testimonial: fallbackItem, offline: true };
    }
  }, []);

  const moderateTestimonial = useCallback(async (id, patch) => {
    if (id.startsWith("local-")) {
      const current = readFallback().map((t) => (t.id === id ? { ...t, ...patch } : t));
      writeFallback(current);
      setAll(current);
      return;
    }
    const updated = await api.updateTestimonial(id, patch);
    setAll((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }, []);

  const removeTestimonial = useCallback(async (id) => {
    if (id.startsWith("local-")) {
      const current = readFallback().filter((t) => t.id !== id);
      writeFallback(current);
      setAll((prev) => prev.filter((t) => t.id !== id));
      return;
    }
    await api.deleteTestimonial(id);
    setAll((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <TestimonialsDataContext.Provider
      value={{ approved, all, loading, offline, fetchApproved, fetchAll, submitTestimonial, moderateTestimonial, removeTestimonial }}
    >
      {children}
    </TestimonialsDataContext.Provider>
  );
}

export function useTestimonialsData() {
  const ctx = useContext(TestimonialsDataContext);
  if (!ctx) throw new Error("useTestimonialsData must be used within TestimonialsDataProvider");
  return ctx;
}
