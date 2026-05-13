import React, { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://52.65.171.135:5002/api";

const s = {
  header: { background: "#6c3483", color: "#fff", padding: "20px 40px" },
  subtitle: { color: "#d7bde2", fontSize: 14, marginTop: 4 },
  container: { maxWidth: 960, margin: "0 auto", padding: "30px 20px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20, marginBottom: 40 },
  card: { background: "#fff", borderRadius: 8, padding: 20, borderLeft: "4px solid #6c3483", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" },
  registerBtn: { background: "#6c3483", color: "#fff", border: "none", padding: "8px 18px", borderRadius: 4, width: "100%", marginTop: 12, fontWeight: "bold" },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 100 },
  modal: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "#fff", padding: 30, borderRadius: 8, width: 440, zIndex: 101 },
  input: { width: "100%", padding: "9px 12px", marginBottom: 12, border: "1px solid #ccc", borderRadius: 4, fontSize: 14 },
  submitBtn: { background: "#6c3483", color: "#fff", border: "none", padding: "10px 0", width: "100%", borderRadius: 4, fontSize: 15, fontWeight: "bold" },
  badge: { display: "inline-block", background: "#f0e6ff", color: "#6c3483", padding: "2px 10px", borderRadius: 12, fontSize: 12, marginBottom: 8 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#6c3483", marginBottom: 16 },
  regRow: { background: "#fff", padding: "12px 16px", borderRadius: 6, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
};

export default function App() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", college: "" });
  const [registrations, setRegistrations] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState("events");

  useEffect(() => {
    axios.get(`${API}/events`).then(r => setEvents(r.data)).catch(console.error);
    axios.get(`${API}/registrations`).then(r => setRegistrations(r.data)).catch(console.error);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(`${API}/registrations`, { ...form, eventId: selectedEvent._id });
      setSuccess(`Successfully registered for "${selectedEvent.title}"!`);
      setSelectedEvent(null);
      setForm({ name: "", email: "", phone: "", college: "" });
      const r = await axios.get(`${API}/registrations`);
      setRegistrations(r.data);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div>
      <div style={s.header}>
        <h1 style={{ fontSize: 26 }}>🎟️ EventHub</h1>
        <p style={s.subtitle}>Register for upcoming events</p>
      </div>

      <div style={s.container}>
        {success && (
          <div style={{ background: "#d5f5e3", border: "1px solid #27ae60", borderRadius: 8, padding: 14, marginBottom: 20, color: "#1e8449" }}>
            ✅ {success}
            <button style={{ marginLeft: 12, background: "none", border: "none", color: "#1e8449", cursor: "pointer" }} onClick={() => setSuccess("")}>✕</button>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <button style={{ padding: "8px 22px", border: "none", borderRadius: 4, background: tab === "events" ? "#6c3483" : "#e0e0e0", color: tab === "events" ? "#fff" : "#333", fontWeight: "bold" }} onClick={() => setTab("events")}>
            Events
          </button>
          <button style={{ padding: "8px 22px", border: "none", borderRadius: 4, background: tab === "registrations" ? "#6c3483" : "#e0e0e0", color: tab === "registrations" ? "#fff" : "#333", fontWeight: "bold" }} onClick={() => setTab("registrations")}>
            All Registrations ({registrations.length})
          </button>
        </div>

        {tab === "events" && (
          <>
            <p style={s.sectionTitle}>Upcoming Events</p>
            <div style={s.grid}>
              {events.map(ev => (
                <div key={ev._id} style={s.card}>
                  <span style={s.badge}>📅 {ev.date}</span>
                  <h3 style={{ fontSize: 17, marginBottom: 6 }}>{ev.title}</h3>
                  <p style={{ fontSize: 13, color: "#777", marginBottom: 8 }}>{ev.description}</p>
                  <p style={{ fontSize: 13 }}>📍 {ev.location} &nbsp;|&nbsp; 👥 {ev.seats} seats</p>
                  <button style={s.registerBtn} onClick={() => { setSelectedEvent(ev); setError(""); }}>Register Now</button>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "registrations" && (
          <>
            <p style={s.sectionTitle}>Registered Participants</p>
            {registrations.length === 0 ? <p style={{ color: "#888" }}>No registrations yet.</p> : registrations.map(r => (
              <div key={r._id} style={s.regRow}>
                <div>
                  <strong>{r.name}</strong>
                  <p style={{ fontSize: 13, color: "#777" }}>{r.email} · {r.phone}</p>
                  {r.college && <p style={{ fontSize: 12, color: "#999" }}>{r.college}</p>}
                </div>
                <span style={s.badge}>{r.eventTitle}</span>
              </div>
            ))}
          </>
        )}
      </div>

      {selectedEvent && (
        <>
          <div style={s.overlay} onClick={() => setSelectedEvent(null)} />
          <div style={s.modal}>
            <h2 style={{ marginBottom: 4 }}>Register</h2>
            <p style={{ color: "#6c3483", marginBottom: 16, fontSize: 14 }}>{selectedEvent.title}</p>
            {error && <div style={{ background: "#fde8e8", color: "#c0392b", padding: "8px 12px", borderRadius: 4, marginBottom: 12, fontSize: 14 }}>{error}</div>}
            <form onSubmit={handleRegister}>
              <input style={s.input} placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input style={s.input} type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              <input style={s.input} placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
              <input style={s.input} placeholder="College / Organization (optional)" value={form.college} onChange={e => setForm({ ...form, college: e.target.value })} />
              <button style={s.submitBtn} type="submit">Confirm Registration</button>
            </form>
            <button style={{ marginTop: 10, width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 4, background: "#fff" }} onClick={() => setSelectedEvent(null)}>Cancel</button>
          </div>
        </>
      )}
    </div>
  );
}
