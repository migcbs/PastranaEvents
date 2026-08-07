import { createContext, useCallback, useContext, useState } from "react";
import { api } from "../utils/api";

const FALLBACK_KEY = "jp_leads_fallback";
const LeadsContext = createContext(null);

function readFallback() {
  try {
    return JSON.parse(localStorage.getItem(FALLBACK_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeFallback(leads) {
  localStorage.setItem(FALLBACK_KEY, JSON.stringify(leads));
}

export function LeadsProvider({ children }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const remote = await api.listLeads();
      setLeads(remote);
      setOffline(false);
    } catch (err) {
      setLeads(readFallback());
      setOffline(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const createLead = useCallback(async (data) => {
    try {
      const lead = await api.createLead(data);
      return { lead, offline: false };
    } catch (err) {
      const fallbackLead = { ...data, id: `local-${Date.now()}`, createdAt: new Date().toISOString() };
      const current = readFallback();
      writeFallback([fallbackLead, ...current]);
      return { lead: fallbackLead, offline: true };
    }
  }, []);

  const removeLead = useCallback(async (id) => {
    if (id.startsWith("local-")) {
      const current = readFallback().filter((l) => l.id !== id);
      writeFallback(current);
      setLeads((prev) => prev.filter((l) => l.id !== id));
      return;
    }
    await api.deleteLead(id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
  }, []);

  return (
    <LeadsContext.Provider value={{ leads, loading, offline, fetchLeads, createLead, removeLead }}>
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads() {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error("useLeads must be used within LeadsProvider");
  return ctx;
}
