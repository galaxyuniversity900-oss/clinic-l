/* ============================================================
  ClinicFlow — app logic (vanilla JS, no build step)
  ------------------------------------------------------------
  ✏️  CUSTOMIZE HERE:
   - NAV ............ sidebar menu (labels + icons)
   - DATA ........... ALL text and demo data (patients, chats…)
   - VIEWS .......... each page's HTML in the `views` object
   Everything is plain strings — edit freely.
  ============================================================ */

"use strict";

/* ---------- 1. SIDEBAR MENU ---------- */
const NAV = [
  { id: "today",     label: "Today",      icon: "grid" },
  { id: "inbox",     label: "Inbox",      icon: "chat",  badge: 3 },
  { id: "patients",  label: "Patients",   icon: "users" },
  { id: "schedule",  label: "Schedule",   icon: "calendar" },
  { id: "reminders", label: "Reminders",  icon: "bell" },
  { id: "reports",   label: "Reports",    icon: "chart" },
  { id: "settings",  label: "Settings",   icon: "gear" },
];

/* ---------- 2. DEMO DATA (replace with your real content) ---------- */
const DATA = {
  clinic: { name: "ClinicFlow", doctor: "Dr. R. Adams" },

  stats: [
    { num: "12", label: "Appointments today" },
    { num: "3",  label: "New WhatsApp messages" },
    { num: "8",  label: "Patients waiting" },
    { num: "94%", label: "Reminder open rate" },
  ],

  board: [
    { col: "Waiting", dot: "wait", items: [
      { name: "Sofia Marin", why: "Check-up", when: "09:10" },
      { name: "Liam Chen",  why: "Follow-up", when: "09:30" },
    ]},
    { col: "In room", dot: "ok", items: [
      { name: "Ava Novak", why: "Consultation", when: "09:00" },
    ]},
    { col: "Done today", dot: "ok", items: [
      { name: "Noah Reed", why: "Vaccination", when: "08:40" },
    ]},
  ],

  patients: [
    { id: "p1", name: "Sofia Marin", age: 34, phone: "+1 555 0142", last: "Today, 09:10", note: "Annual check-up", consent: "ok" },
    { id: "p2", name: "Liam Chen",   age: 41, phone: "+1 555 0177", last: "Today, 09:30", note: "Blood pressure follow-up", consent: "ok" },
    { id: "p3", name: "Ava Novak",   age: 28, phone: "+1 555 0193", last: "Today, 09:00", note: "Skin consultation", consent: "pending" },
    { id: "p4", name: "Noah Reed",   age: 52, phone: "+1 555 0108", last: "Today, 08:40", note: "Flu vaccination", consent: "ok" },
  ],

  chats: [
    { id: "c1", name: "Sofia Marin", msgs: [
      { dir: "in",  text: "Hi! Can I move my appointment to tomorrow?", at: "09:02" },
      { dir: "out", text: "Of course — 10:30 or 15:00?", at: "09:05" },
      { dir: "in",  text: "10:30 works, thank you!", at: "09:06" },
    ]},
    { id: "c2", name: "Liam Chen", msgs: [
      { dir: "in", text: "Good morning, is Dr. Adams in today?", at: "08:41" },
      { dir: "out", text: "Yes, from 9 to 5. Shall I book you in?", at: "08:45" },
    ]},
    { id: "c3", name: "Ava Novak", msgs: [
      { dir: "in", text: "Received the reminder, see you at 9.", at: "08:12" },
    ]},
  ],

  schedule: {
    hours: ["09:00", "10:00", "11:00", "14:00", "15:00"],
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    booked: { "Mon 09:00": "Sofia M.", "Tue 10:00": "Liam C.", "Thu 14:00": "Ava N." },
  },

  templates: [
    { name: "Appointment reminder", text: "Hi {{name}}, reminder for your appointment tomorrow at {{time}}. Reply 1 to confirm." },
    { name: "Follow-up", text: "Hi {{name}}, how are you feeling after your visit on {{date}}?" },
  ],

  reports: [
    { label: "Appointments kept", pct: 92 },
    { label: "Messages answered < 5 min", pct: 78 },
    { label: "Reminders opened", pct: 94 },
    { label: "New patients this month", pct: 41 },
  ],
};

/* ---------- 3. ICONS (inline SVG, stroke style) ---------- */
const ICONS = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  chat: '<path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5z"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5"/><circle cx="17" cy="9" r="2.5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  bell: '<path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/>',
};
const ico = (n) => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[n] || ""}</svg>`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------- 4. VIEWS (each returns HTML) ---------- */
const views = {

  today: () => `
    <div class="page-head"><h1>Today</h1><span class="sub">${esc(DATA.clinic.name)} · ${new Date().toDateString()}</span></div>
    <div class="stats">${DATA.stats.map((s) => `<div class="stat"><div class="stat__num">${esc(s.num)}</div><div class="stat__label">${esc(s.label)}</div></div>`).join("")}</div>
    <div class="board">
      ${DATA.board.map((c) => `
        <div class="card">
          <div class="col__head"><span class="dot dot--${c.dot}"></span>${esc(c.col)} · ${c.items.length}</div>
          ${c.items.map((t) => `<div class="tile"><b>${esc(t.name)}</b><div class="meta"><span>${esc(t.why)}</span><span>${esc(t.when)}</span></div></div>`).join("")}
        </div>`).join("")}
    </div>`,

  inbox: (param) => {
    const chat = DATA.chats.find((c) => c.id === param) || null;
    return `
    <div class="page-head"><h1>Inbox</h1><span class="sub">WhatsApp-style conversations</span></div>
    <div class="split">
      <div class="card chat-list">
        ${DATA.chats.map((c) => `
          <a class="chat-item ${param === c.id ? "is-active" : ""}" href="#/inbox/${c.id}">
            <span class="chat-item__ava">${esc(c.name.split(" ").map((w) => w[0]).join(""))}</span>
            <span class="chat-item__body">
              <span class="chat-item__name">${esc(c.name)}<time>${esc(c.msgs[c.msgs.length - 1].at)}</time></span>
              <span class="chat-item__prev">${esc(c.msgs[c.msgs.length - 1].text)}</span>
            </span>
          </a>`).join("")}
      </div>
      ${chat ? `
      <div class="thread">
        <div class="thread__head">
          <span class="chat-item__ava">${esc(chat.name.split(" ").map((w) => w[0]).join(""))}</span>
          <div><b>${esc(chat.name)}</b><div class="card__sub">online · replies in ~2 min</div></div>
          <div class="card__tools"><button class="btn btn--sm btn--wa">Send WhatsApp</button></div>
        </div>
        <div class="bubbles">
          ${chat.msgs.map((m) => `<div class="bubble bubble--${m.dir}">${esc(m.text)}<time>${esc(m.at)} ${m.dir === "out" ? "✓✓" : ""}</time></div>`).join("")}
        </div>
        <div class="composer">
          <input id="msgInput" placeholder="Type a message… (demo only)" />
          <button class="btn btn--primary" onclick="alert('Demo only — wire this to your own backend.')">Send</button>
        </div>
      </div>` : `<div class="card empty">Select a conversation to open it here.</div>`}
    </div>`; },

  patients: (param) => {
    if (param) {
      const p = DATA.patients.find((x) => x.id === param);
      if (!p) return `<div class="empty">Patient not found. <a href="#/patients">Back</a></div>`;
      return `
      <div class="page-head"><h1>${esc(p.name)}</h1><span class="sub">Patient record</span></div>
      <div class="card">
        <div class="table-wrap"><table class="table">
          <tr><th>Age</th><td>${esc(p.age)}</td></tr>
          <tr><th>Phone</th><td>${esc(p.phone)}</td></tr>
          <tr><th>Last visit</th><td>${esc(p.last)}</td></tr>
          <tr><th>Note</th><td>${esc(p.note)}</td></tr>
          <tr><th>Consent</th><td><span class="badge badge--${p.consent === "ok" ? "ok" : "warn"}">${esc(p.consent)}</span></td></tr>
        </table></div>
        <div style="margin-top:14px"><a class="btn" href="#/patients">← All patients</a></div>
      </div>`;
    }
    return `
    <div class="page-head"><h1>Patients</h1><span class="sub">${DATA.patients.length} records</span></div>
    <div class="card"><table class="table">
      <tr><th>Name</th><th>Age</th><th>Phone</th><th>Last visit</th><th></th></tr>
      ${DATA.patients.map((p) => `<tr>
        <td><b>${esc(p.name)}</b></td><td>${esc(p.age)}</td><td>${esc(p.phone)}</td><td>${esc(p.last)}</td>
        <td><a class="btn btn--sm btn--ghost" href="#/patients/${p.id}">Open</a></td></tr>`).join("")}
    </table></div>`; },

  schedule: () => {
    const s = DATA.schedule;
    return `
    <div class="page-head"><h1>Schedule</h1><span class="sub">Weekly clinician calendar</span></div>
    <div class="card">
      <div class="sched">
        <div></div>${s.days.map((d) => `<div class="h" style="text-align:center;font-family:var(--font-sans);font-weight:650">${d}</div>`).join("")}
        ${s.hours.map((h) => `
          <div class="h">${h}</div>
          ${s.days.map((d) => {
            const b = s.booked[`${d} ${h}`];
            return `<div class="slot ${b ? "booked" : ""}" title="${esc(b || "free")}">${b ? esc(b) : ""}</div>`;
          }).join("")}`).join("")}
      </div>
      <p class="card__sub" style="margin-top:12px">Highlighted cells are booked (demo data in app.js → DATA.schedule).</p>
    </div>`; },

  reminders: () => `
    <div class="page-head"><h1>Reminders</h1><span class="sub">Templates &amp; broadcasts</span></div>
    ${DATA.templates.map((t) => `
      <div class="card">
        <div class="card__head"><div><div class="card__title">${esc(t.name)}</div><div class="card__sub">Template</div></div>
        <div class="card__tools"><button class="btn btn--sm btn--ghost" onclick="alert('Demo only')">Preview</button></div></div>
        <p style="margin:0;color:var(--text-soft)">${esc(t.text)}</p>
      </div>`).join("")}
    <div class="card"><button class="btn btn--primary">+ New broadcast</button></div>`,

  reports: () => `
    <div class="page-head"><h1>Reports</h1><span class="sub">Simple monthly metrics</span></div>
    <div class="card">
      ${DATA.reports.map((r) => `
        <div style="margin-bottom:16px">
          <div style="display:flex;justify-content:space-between;margin-bottom:5px"><b>${esc(r.label)}</b><span class="card__sub">${r.pct}%</span></div>
          <div class="bar"><i style="width:${r.pct}%"></i></div>
        </div>`).join("")}
    </div>`,

  settings: () => `
    <div class="page-head"><h1>Settings</h1><span class="sub">Clinic preferences</span></div>
    <div class="card"><div class="form">
      <div><label>Clinic name</label><input value="${esc(DATA.clinic.name)}" /></div>
      <div><label>Practitioner</label><input value="${esc(DATA.clinic.doctor)}" /></div>
      <div><label>WhatsApp number</label><input value="+1 555 0000" placeholder="+1 555 0000" /></div>
      <div class="switch"><input type="checkbox" checked id="autoRem" /><label for="autoRem" style="margin:0">Send automatic appointment reminders</label></div>
      <div><button class="btn btn--primary" onclick="alert('Demo only — connect your own storage here.')">Save changes</button></div>
    </div></div>`,
};

/* ---------- 5. HASH ROUTER ---------- */
function route() {
  const hash = location.hash.replace(/^#\/?/, "") || "today";
  const [page, param] = hash.split("/");
  const view = document.getElementById("view");
  view.innerHTML = (views[page] || views.today)(param);
  view.focus({ preventScroll: true });
  view.scrollTop = 0;
  // sidebar active state
  document.querySelectorAll(".nav__item").forEach((b) => b.classList.toggle("is-active", b.dataset.id === page));
  document.getElementById("sidebar").classList.remove("open");
}

/* ---------- 6. BOOT ---------- */
document.getElementById("nav").innerHTML = NAV.map((n) => `
  <button class="nav__item" data-id="${n.id}" onclick="location.hash='#/${n.id}'">
    ${ico(n.icon)}<span>${esc(n.label)}</span>${n.badge ? `<span class="nav__badge">${n.badge}</span>` : ""}
  </button>`).join("");

document.getElementById("themeToggle").onclick = () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem("cf:theme", next); } catch (e) {}
};
try {
  const saved = localStorage.getItem("cf:theme");
  if (saved) document.documentElement.dataset.theme = saved;
} catch (e) {}

document.getElementById("burger").onclick = () => document.getElementById("sidebar").classList.toggle("open");
window.addEventListener("hashchange", route);
route();
