import { useState, useMemo } from "react";

const fmt = (n) => new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 }).format(n);
const fmtShort = (n) => n >= 1000000 ? `${(n/1000000).toFixed(2)} Mkr` : fmt(n);
const pct = (n) => `${Number(n).toFixed(2)} %`;
const pct1 = (n) => `${Number(n).toFixed(1)} %`;

const C = {
  bg: "#F4F6F9", surface: "#FFFFFF", surface2: "#F0F3F7", border: "#DDE3ED",
  navy: "#0F2847", gold: "#B8892A", goldLight: "#F5EDD8",
  text: "#0F2847", textMid: "#4A5E78", textLight: "#8A9BB0",
  green: "#1A7A4A", red: "#C0392B", blue: "#1A5296",
};

const InputRow = ({ label, value, onChange, suffix, step = 1000, min = 0, max, hint }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
      <label style={{ color: C.textMid, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>{label}</label>
      {hint && <span style={{ color: C.textLight, fontSize: 10 }}>{hint}</span>}
    </div>
    <div style={{ display: "flex", alignItems: "center", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
      <input type="number" value={value} min={min} max={max} step={step} onChange={e => onChange(Number(e.target.value))}
        style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 14, fontWeight: 600, padding: "10px 12px", fontFamily: "inherit", minWidth: 0 }} />
      <span style={{ color: C.textLight, padding: "10px 12px", fontSize: 12, borderLeft: `1px solid ${C.border}`, whiteSpace: "nowrap", flexShrink: 0 }}>{suffix}</span>
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "18px 20px", marginBottom: 12, boxShadow: "0 1px 4px rgba(15,40,71,0.06)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
      <h3 style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: 0 }}>{title}</h3>
    </div>
    {children}
  </div>
);

const InfoChip = ({ label, value }) => (
  <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 6, padding: "9px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span style={{ color: C.textMid, fontSize: 11 }}>{label}</span>
    <span style={{ color: C.navy, fontSize: 13, fontWeight: 700 }}>{value}</span>
  </div>
);

const WRow = ({ label, value, bold, separator }) => {
  if (separator) return <div style={{ borderTop: `1px solid ${C.border}`, margin: "6px 0" }} />;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid #F0F3F7` }}>
      <span style={{ color: bold ? C.text : C.textMid, fontSize: bold ? 13 : 12, fontWeight: bold ? 700 : 400 }}>{label}</span>
      <span style={{ color: bold ? C.text : value >= 0 ? C.green : C.red, fontSize: bold ? 13 : 12, fontWeight: bold ? 700 : 500, fontFamily: "monospace" }}>
        {value >= 0 ? "" : "−"}{fmt(Math.abs(value))}
      </span>
    </div>
  );
};

const KFRow = ({ label, value, highlight, large }) => (
  <div style={{ padding: "14px 16px", background: highlight ? C.navy : C.surface2, border: `1px solid ${highlight ? C.navy : C.border}`, borderRadius: 7, marginBottom: 10 }}>
    <div style={{ color: highlight ? "rgba(255,255,255,0.6)" : C.textLight, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
    <div style={{ color: highlight ? "#FFF" : C.text, fontSize: large ? 26 : 20, fontWeight: 700 }}>{fmt(value)}</div>
  </div>
);

const OvrigKostnad = ({ items, onChange }) => {
  const add = () => onChange([...items, { label: "", amount: 0 }]);
  const remove = i => onChange(items.filter((_, j) => j !== i));
  const update = (i, field, val) => onChange(items.map((item, j) => j === i ? { ...item, [field]: val } : item));
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input placeholder="Beskrivning" value={item.label} onChange={e => update(i, "label", e.target.value)}
            style={{ flex: 2, background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 6, color: C.text, padding: "9px 12px", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
          <input type="number" placeholder="0" value={item.amount} min={0} step={500} onChange={e => update(i, "amount", Number(e.target.value))}
            style={{ flex: 1, background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 6, color: C.text, padding: "9px 12px", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
          <button onClick={() => remove(i)} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 6, color: C.textLight, cursor: "pointer", padding: "8px 10px" }}>✕</button>
        </div>
      ))}
      <button onClick={add} style={{ background: C.goldLight, border: `1.5px dashed ${C.gold}`, borderRadius: 6, color: C.gold, cursor: "pointer", padding: "9px 20px", fontSize: 11, fontWeight: 700, width: "100%", fontFamily: "inherit" }}>
        + Lägg till kostnad
      </button>
    </div>
  );
};

// ── OFFERT DATA ───────────────────────────────────────────────────────────────
const COMPANIES_DEFAULT = [
  { id: "skandia", name: "Skandia", color: "#1A5296", premiebefrielse: 1.51, sparpremie: 10,
    employees: [
      { sjuk: 745, pbf: 83, tjp: 5500, lo: 62, sjukvard: 300 },
      { sjuk: 522, pbf: 83, tjp: 5500, lo: 62, sjukvard: 300 },
      { sjuk: 0, pbf: 0, tjp: 0, lo: 0, sjukvard: 0 },
      { sjuk: 0, pbf: 0, tjp: 0, lo: 0, sjukvard: 0 },
      { sjuk: 0, pbf: 0, tjp: 0, lo: 0, sjukvard: 0 },
      { sjuk: 0, pbf: 0, tjp: 0, lo: 0, sjukvard: 0 },
    ]},
  { id: "lf", name: "Länsförsäkringar", color: "#B8892A", premiebefrielse: 2.20, sparpremie: 10,
    employees: [
      { sjuk: 635, pbf: 121, tjp: 5500, lo: 78, sjukvard: 331 },
      { sjuk: 580, pbf: 121, tjp: 5500, lo: 78, sjukvard: 331 },
      { sjuk: 0, pbf: 0, tjp: 0, lo: 0, sjukvard: 0 },
      { sjuk: 0, pbf: 0, tjp: 0, lo: 0, sjukvard: 0 },
      { sjuk: 0, pbf: 0, tjp: 0, lo: 0, sjukvard: 0 },
      { sjuk: 0, pbf: 0, tjp: 0, lo: 0, sjukvard: 0 },
    ]},
  { id: "seb", name: "SEB", color: "#7B5EA7", premiebefrielse: 2.10, sparpremie: 10,
    employees: [
      { sjuk: 389, pbf: 116, tjp: 5500, lo: 78, sjukvard: 303 },
      { sjuk: 301, pbf: 116, tjp: 5500, lo: 78, sjukvard: 303 },
      { sjuk: 0, pbf: 0, tjp: 0, lo: 0, sjukvard: 0 },
      { sjuk: 0, pbf: 0, tjp: 0, lo: 0, sjukvard: 0 },
      { sjuk: 0, pbf: 0, tjp: 0, lo: 0, sjukvard: 0 },
      { sjuk: 0, pbf: 0, tjp: 0, lo: 0, sjukvard: 0 },
    ]},
  { id: "ea", name: "Euro Accident", color: "#E08A3C", premiebefrielse: 2.00, sparpremie: 10,
    employees: [
      { sjuk: 505, pbf: 110, tjp: 5500, lo: 108, sjukvard: 290 },
      { sjuk: 409, pbf: 110, tjp: 5500, lo: 108, sjukvard: 260 },
      { sjuk: 0, pbf: 0, tjp: 0, lo: 0, sjukvard: 0 },
      { sjuk: 0, pbf: 0, tjp: 0, lo: 0, sjukvard: 0 },
      { sjuk: 0, pbf: 0, tjp: 0, lo: 0, sjukvard: 0 },
      { sjuk: 0, pbf: 0, tjp: 0, lo: 0, sjukvard: 0 },
    ]},
  { id: "folksam", name: "Folksam", color: "#1A7A4A", premiebefrielse: 2.00, sparpremie: 10,
    employees: [
      { sjuk: 586, pbf: 110, tjp: 5500, lo: 81, sjukvard: 261 },
      { sjuk: 476, pbf: 110, tjp: 5500, lo: 81, sjukvard: 216 },
      { sjuk: 0, pbf: 0, tjp: 0, lo: 0, sjukvard: 0 },
      { sjuk: 0, pbf: 0, tjp: 0, lo: 0, sjukvard: 0 },
      { sjuk: 0, pbf: 0, tjp: 0, lo: 0, sjukvard: 0 },
      { sjuk: 0, pbf: 0, tjp: 0, lo: 0, sjukvard: 0 },
    ]},
];

const EMP_DEFAULT = [
  { persnr: "", namn: "Anställd 1", arslön: 660000 },
  { persnr: "", namn: "Anställd 2", arslön: 660000 },
  { persnr: "", namn: "", arslön: 0 },
  { persnr: "", namn: "", arslön: 0 },
  { persnr: "", namn: "", arslön: 0 },
  { persnr: "", namn: "", arslön: 0 },
];

const COLS = [
  { key: "sjuk", label: "Sjukförsäkring" },
  { key: "pbf", label: "PBF" },
  { key: "tjp", label: "TJP" },
  { key: "lo", label: "Liv & Olycksfall" },
  { key: "sjukvard", label: "Sjukvård" },
];

const cellInputStyle = {
  width: "100%", boxSizing: "border-box", background: "transparent",
  border: `1px solid ${C.border}`, borderRadius: 4, color: C.text,
  padding: "4px 6px", fontSize: 11, fontFamily: "inherit", outline: "none",
};

const OffertView = () => {
  const [employees, setEmployees] = useState(EMP_DEFAULT);
  const [companies, setCompanies] = useState(COMPANIES_DEFAULT);
  const [view, setView] = useState("jamforelse");
  const [selectedCompany, setSelectedCompany] = useState("skandia");

  const activeEmps = employees.filter(e => e.namn || e.arslön > 0);
  const nActive = Math.max(1, activeEmps.length);

  const updateEmp = (i, field, val) => setEmployees(prev => prev.map((e, j) => j === i ? { ...e, [field]: val } : e));
  const updatePremium = (companyId, empIdx, field, val) => {
    setCompanies(prev => prev.map(c => c.id !== companyId ? c : {
      ...c, employees: c.employees.map((e, i) => i !== empIdx ? e : { ...e, [field]: Number(val) })
    }));
  };
  const updateCompany = (companyId, field, val) => {
    setCompanies(prev => prev.map(c => c.id !== companyId ? c : { ...c, [field]: Number(val) }));
  };

  const calcTotals = (company) => {
    const empTotals = company.employees.slice(0, nActive).map(e => e.sjuk + e.pbf + e.tjp + e.lo + e.sjukvard);
    const groupTotal = empTotals.reduce((s, v) => s + v, 0);
    const colSums = COLS.reduce((acc, col) => {
      acc[col.key] = company.employees.slice(0, nActive).reduce((s, e) => s + (e[col.key] || 0), 0);
      return acc;
    }, {});
    return { empTotals, groupTotal, colSums };
  };

  const ranked = useMemo(() =>
    companies.map(c => ({ ...c, ...calcTotals(c) })).sort((a, b) => a.groupTotal - b.groupTotal),
    [companies, nActive]
  );
  const best = ranked[0];
  const worst = ranked[ranked.length - 1];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", minHeight: "calc(100vh - 90px)" }}>
      <div style={{ padding: "20px 16px", borderRight: `1px solid ${C.border}`, overflowY: "auto", minWidth: 0 }}>
        <Section title="Anställda">
          {employees.map((emp, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 8, padding: "8px", background: i < nActive ? C.goldLight : C.surface2, borderRadius: 6, border: `1px solid ${i < nActive ? C.gold : C.border}` }}>
              <div style={{ display: "flex", gap: 5, minWidth: 0 }}>
                <input placeholder={`Namn ${i+1}`} value={emp.namn} onChange={e => updateEmp(i, "namn", e.target.value)}
                  style={{ ...cellInputStyle, flex: 1, minWidth: 0, fontSize: 11, padding: "6px 8px" }} />
                <input placeholder="Personnr" value={emp.persnr} onChange={e => updateEmp(i, "persnr", e.target.value)}
                  style={{ ...cellInputStyle, flex: 1, minWidth: 0, fontSize: 11, padding: "6px 8px" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, overflow: "hidden" }}>
                <input type="number" placeholder="Årslön" value={emp.arslön || ""} min={0} step={10000} onChange={e => updateEmp(i, "arslön", Number(e.target.value))}
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 11, padding: "6px 8px", fontFamily: "inherit", minWidth: 0, width: "100%", boxSizing: "border-box" }} />
                <span style={{ color: C.textLight, fontSize: 10, padding: "0 8px", borderLeft: `1px solid ${C.border}`, whiteSpace: "nowrap", flexShrink: 0 }}>kr/år</span>
              </div>
            </div>
          ))}
          <div style={{ color: C.textLight, fontSize: 10, textAlign: "center", marginTop: 4 }}>{nActive} aktiva anställda</div>
        </Section>

        <Section title="Bolagsinställningar">
          {companies.map(c => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: C.surface2, borderRadius: 6, border: `1px solid ${C.border}`, marginBottom: 6, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1, overflow: "hidden" }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: c.color, flexShrink: 0 }} />
                <span style={{ color: C.text, fontSize: 11, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
              </div>
              <div style={{ flexShrink: 0, marginLeft: 8 }}>
                <div style={{ color: C.textLight, fontSize: 9, textTransform: "uppercase", textAlign: "right" }}>Prem.befr</div>
                <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <input type="number" value={c.premiebefrielse} step={0.01} min={0} onChange={e => updateCompany(c.id, "premiebefrielse", e.target.value)}
                    style={{ width: 40, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 3, color: C.text, padding: "2px 4px", fontSize: 10, textAlign: "right", outline: "none", fontFamily: "inherit" }} />
                  <span style={{ color: C.textLight, fontSize: 9 }}>%</span>
                </div>
              </div>
            </div>
          ))}
        </Section>

        <div style={{ background: C.navy, borderRadius: 8, padding: "14px 16px" }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Billigaste alternativet</div>
          <div style={{ color: C.gold, fontSize: 20, fontWeight: 700 }}>{best?.name}</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontFamily: "monospace", marginTop: 2 }}>{fmt(best?.groupTotal)}/mån</div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 12, paddingTop: 10 }}>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginBottom: 4 }}>Besparing vs dyraste</div>
            <div style={{ color: "#6EE0A4", fontSize: 16, fontWeight: 700, fontFamily: "monospace" }}>{fmt((worst?.groupTotal || 0) - (best?.groupTotal || 0))}/mån</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>{fmt(((worst?.groupTotal || 0) - (best?.groupTotal || 0)) * 12)}/år</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 20px", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
            <span style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Offertjämförelse</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[{ id: "jamforelse", label: "Jämförelse" }, { id: "detaljer", label: "Redigera premier" }].map(v => (
              <button key={v.id} onClick={() => setView(v.id)} style={{
                padding: "7px 16px", borderRadius: 5, border: `1.5px solid ${view === v.id ? C.navy : C.border}`,
                background: view === v.id ? C.navy : "transparent", color: view === v.id ? "#fff" : C.textMid,
                fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit"
              }}>{v.label}</button>
            ))}
          </div>
        </div>

        {view === "jamforelse" && (
          <>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "20px", marginBottom: 14, boxShadow: "0 1px 4px rgba(15,40,71,0.06)" }}>
              <div style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 14 }}>Total grupppremie / mån</div>
              {ranked.map((c, i) => {
                const barW = worst.groupTotal > 0 ? (c.groupTotal / worst.groupTotal) * 100 : 0;
                return (
                  <div key={c.id} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: c.color }} />
                        <span style={{ color: C.text, fontSize: 12, fontWeight: i === 0 ? 700 : 400 }}>{c.name}</span>
                        {i === 0 && <span style={{ background: "#E8F5EE", color: C.green, fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3, border: `1px solid ${C.green}` }}>BILLIGAST</span>}
                      </div>
                      <span style={{ color: i === 0 ? C.green : C.text, fontSize: 13, fontWeight: 700, fontFamily: "monospace" }}>{fmt(c.groupTotal)}</span>
                    </div>
                    <div style={{ background: C.surface2, borderRadius: 3, height: 8 }}>
                      <div style={{ width: `${barW}%`, background: c.color, borderRadius: 3, height: 8, opacity: i === 0 ? 1 : 0.5, transition: "width 0.4s" }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 4px rgba(15,40,71,0.06)", marginBottom: 14 }}>
              <div style={{ background: C.navy, padding: "10px 16px", display: "grid", gridTemplateColumns: `160px repeat(${ranked.length}, 1fr)` }}>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>Komponent</div>
                {ranked.map(c => <div key={c.id} style={{ color: "#fff", fontSize: 10, fontWeight: 700, textAlign: "right" }}>{c.name}</div>)}
              </div>
              {[...COLS, { key: "total", label: "TOTAL / MÅN" }].map((col, ri) => {
                const isTotal = col.key === "total";
                return (
                  <div key={col.key} style={{ display: "grid", gridTemplateColumns: `160px repeat(${ranked.length}, 1fr)`, padding: "9px 16px", background: isTotal ? C.navy : ri % 2 === 0 ? C.surface : C.surface2, borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ color: isTotal ? "rgba(255,255,255,0.7)" : C.textMid, fontSize: isTotal ? 11 : 12, fontWeight: isTotal ? 700 : 400 }}>{col.label}</span>
                    {ranked.map((c, ci) => {
                      const val = isTotal ? c.groupTotal : c.colSums[col.key];
                      const isMin = ranked.reduce((min, cc) => (isTotal ? cc.groupTotal : cc.colSums[col.key]) < (isTotal ? min.groupTotal : min.colSums[col.key]) ? cc : min, ranked[0]).id === c.id;
                      return <div key={c.id} style={{ textAlign: "right", color: isTotal ? (ci === 0 ? "#6EE0A4" : "rgba(255,255,255,0.7)") : isMin ? C.green : C.text, fontSize: 12, fontWeight: isTotal || isMin ? 700 : 400, fontFamily: "monospace" }}>{fmt(val)}</div>;
                    })}
                  </div>
                );
              })}
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 4px rgba(15,40,71,0.06)" }}>
              <div style={{ background: C.navy, padding: "10px 16px", display: "grid", gridTemplateColumns: `180px repeat(${ranked.length}, 1fr)`, gap: 4 }}>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>Anställd</div>
                {ranked.map(c => <div key={c.id} style={{ color: "#fff", fontSize: 10, fontWeight: 700, textAlign: "right" }}>{c.name}</div>)}
              </div>
              {activeEmps.map((emp, ei) => (
                <div key={ei} style={{ display: "grid", gridTemplateColumns: `180px repeat(${ranked.length}, 1fr)`, padding: "9px 16px", gap: 4, background: ei % 2 === 0 ? C.surface : C.surface2, borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ color: C.text, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8 }}>{emp.namn || `Anställd ${ei+1}`}</span>
                  {ranked.map((c, ci) => {
                    const e = c.employees[ei] || {};
                    const total = (e.sjuk||0)+(e.pbf||0)+(e.tjp||0)+(e.lo||0)+(e.sjukvard||0);
                    const isMin = ranked.reduce((min, cc) => {
                      const t = cc.employees[ei] || {}; const tv = (t.sjuk||0)+(t.pbf||0)+(t.tjp||0)+(t.lo||0)+(t.sjukvard||0);
                      const mv = min.employees[ei] || {};
                      return tv < ((mv.sjuk||0)+(mv.pbf||0)+(mv.tjp||0)+(mv.lo||0)+(mv.sjukvard||0)) ? cc : min;
                    }, ranked[0]).id === c.id;
                    return <div key={c.id} style={{ textAlign: "right", color: isMin ? C.green : C.text, fontSize: 12, fontWeight: isMin ? 700 : 400, fontFamily: "monospace" }}>{fmt(total)}</div>;
                  })}
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: `180px repeat(${ranked.length}, 1fr)`, padding: "10px 16px", gap: 4, background: C.navy }}>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 700 }}>Summa grupp</span>
                {ranked.map((c, ci) => <div key={c.id} style={{ textAlign: "right", color: ci === 0 ? "#6EE0A4" : "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>{fmt(c.groupTotal)}</div>)}
              </div>
            </div>
          </>
        )}

        {view === "detaljer" && (() => {
          const comp = companies.find(c => c.id === selectedCompany);
          const totals = calcTotals(comp);
          const cols = "minmax(100px,1.4fr) minmax(80px,1fr) minmax(80px,1fr) 70px 60px 70px 70px 70px 90px";
          return (
            <>
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                {companies.map(c => (
                  <button key={c.id} onClick={() => setSelectedCompany(c.id)} style={{ padding: "8px 16px", borderRadius: 5, border: `1.5px solid ${selectedCompany === c.id ? c.color : C.border}`, background: selectedCompany === c.id ? c.color : "transparent", color: selectedCompany === c.id ? "#fff" : C.textMid, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{c.name}</button>
                ))}
              </div>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 4px rgba(15,40,71,0.06)" }}>
                <div style={{ background: comp.color, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Redigera premier</div>
                    <div style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>{comp.name}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10 }}>Premiebefrielse</div>
                    <div style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>{comp.premiebefrielse} %</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: cols, background: C.navy, padding: "8px 16px", gap: 4 }}>
                  {["Namn","Personnr","Årslön (kr)","Sjukförs.","PBF","TJP","Liv & Ol.","Sjukvård","Total/mån"].map((h, hi) => (
                    <div key={h} style={{ color: "rgba(255,255,255,0.6)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", textAlign: hi <= 2 ? "left" : "right" }}>{h}</div>
                  ))}
                </div>
                {employees.map((emp, ei) => {
                  const ep = comp.employees[ei] || {};
                  const total = (ep.sjuk||0)+(ep.pbf||0)+(ep.tjp||0)+(ep.lo||0)+(ep.sjukvard||0);
                  const isActive = emp.namn || emp.arslön > 0;
                  return (
                    <div key={ei} style={{ display: "grid", gridTemplateColumns: cols, padding: "6px 16px", gap: 4, background: isActive ? (ei % 2 === 0 ? C.surface : C.surface2) : "#f8f9fb", borderBottom: `1px solid ${C.border}`, opacity: isActive ? 1 : 0.45, alignItems: "center" }}>
                      <input value={emp.namn} placeholder={`Anställd ${ei+1}`} onChange={e => updateEmp(ei, "namn", e.target.value)} style={{ ...cellInputStyle, fontSize: 11, padding: "5px 6px" }} />
                      <input value={emp.persnr} placeholder="ÅÅMMDD-XXXX" onChange={e => updateEmp(ei, "persnr", e.target.value)} style={{ ...cellInputStyle, fontSize: 10, padding: "5px 6px" }} />
                      <input type="number" value={emp.arslön || ""} placeholder="0" min={0} step={10000} onChange={e => updateEmp(ei, "arslön", Number(e.target.value))} style={{ ...cellInputStyle, textAlign: "right", fontFamily: "monospace", fontSize: 11, padding: "5px 6px" }} />
                      {["sjuk","pbf","tjp","lo","sjukvard"].map(field => (
                        <input key={field} type="number" value={ep[field] ?? 0} min={0} step={10} onChange={e => updatePremium(comp.id, ei, field, e.target.value)} style={{ ...cellInputStyle, textAlign: "right", fontFamily: "monospace", fontSize: 11, padding: "5px 6px" }} />
                      ))}
                      <div style={{ color: isActive ? C.navy : C.textLight, fontSize: 12, fontWeight: 700, fontFamily: "monospace", textAlign: "right" }}>{isActive ? fmt(total) : "—"}</div>
                    </div>
                  );
                })}
                <div style={{ display: "grid", gridTemplateColumns: cols, padding: "10px 16px", gap: 4, background: C.navy, alignItems: "center" }}>
                  <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 700 }}>Summa grupp</div>
                  <div /><div />
                  {COLS.map(col => <div key={col.key} style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontFamily: "monospace", textAlign: "right" }}>{fmt(totals.colSums[col.key])}</div>)}
                  <div style={{ color: "#6EE0A4", fontSize: 13, fontWeight: 700, fontFamily: "monospace", textAlign: "right" }}>{fmt(totals.groupTotal)}</div>
                </div>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
};

// ── LIVFÖRSÄKRING ─────────────────────────────────────────────────────────────
const LivforsakringView = () => {
  const [civilstand, setCivilstand] = useState("gift");
  const [gemensamma, setGemensamma] = useState(0);
  const [sarkull, setSarkull] = useState(0);
  const [marknadsvarde, setMarknadsvarde] = useState(3000000);
  const [andelLan, setAndelLan] = useState(60);

  const calc = useMemo(() => {
    const lan = marknadsvarde * (andelLan / 100);
    const nettoEget = marknadsvarde - lan;
    const totalBarn = gemensamma + sarkull;
    if (civilstand === "gift") {
      const avlidenAndel = nettoEget / 2;
      if (sarkull === 0) {
        return { forsikringsbehov: 0, avlidenAndel, nettoEget, lan, scenario: "gift_inga_sarkull", message: "Inga särkullsbarn — efterlevande make/maka ärver allt med fri förfoganderätt. Gemensamma barn erhåller arv när båda föräldrarna gått bort. Livförsäkring för husändamål behövs ej, men kan vara aktuell av andra skäl.", varning: false };
      } else {
        const arvslottPerBarn = totalBarn > 0 ? avlidenAndel / totalBarn : 0;
        const sarkullArvslott = arvslottPerBarn * sarkull;
        const sarkullLaglott = sarkullArvslott / 2;
        return { forsikringsbehov: sarkullArvslott, forsikringsbehovLaglott: sarkullLaglott, avlidenAndel, nettoEget, lan, arvslottPerBarn, sarkullArvslott, sarkullLaglott, scenario: "gift_med_sarkull", message: `Särkullsbarn har rätt att ta ut sin arvslott omedelbart vid dödsfall. Efterlevande make/maka behöver lösa ut särkullsbarnens andel ur dödsboet för att behålla huset.`, varning: true };
      }
    }
    const avlidenAndel = nettoEget / 2;
    if (totalBarn === 0) {
      return { forsikringsbehov: avlidenAndel, avlidenAndel, nettoEget, lan, scenario: "sambo_inga_barn", message: "Inga barn. Utan testamente ärver den avlidnes föräldrar (eller syskon) boets andel. Sambon har ingen arvsrätt men kan kräva bodelning och behålla sin halva. Livförsäkring behövs för att lösa ut arvtagarna.", varning: true };
    }
    const arvslottPerBarn = avlidenAndel / totalBarn;
    const totalLaglott = (arvslottPerBarn / 2) * totalBarn;
    return { forsikringsbehov: avlidenAndel, forsikringsbehovLaglott: totalLaglott, avlidenAndel, nettoEget, lan, arvslottPerBarn, allaBarnAndel: avlidenAndel, totalLaglott, scenario: "sambo_med_barn", message: `Alla barn (gemensamma och särkullsbarn) ärver den avlidnes andel direkt. Sambon saknar arvsrätt och kan behöva lösa ut barnen för att behålla hemmet.`, varning: true };
  }, [civilstand, gemensamma, sarkull, marknadsvarde, andelLan]);

  const Counter = ({ value, onChange }) => (
    <div style={{ display: "flex", alignItems: "center", border: `1.5px solid ${C.border}`, borderRadius: 8, overflow: "hidden", background: C.surface }}>
      <button onClick={() => onChange(Math.max(0, value - 1))} style={{ width: 40, height: 40, background: C.surface2, border: "none", cursor: "pointer", fontSize: 18, color: C.navy, fontWeight: 700 }}>−</button>
      <span style={{ flex: 1, textAlign: "center", fontSize: 18, fontWeight: 700, color: C.navy, minWidth: 40 }}>{value}</span>
      <button onClick={() => onChange(value + 1)} style={{ width: 40, height: 40, background: C.surface2, border: "none", cursor: "pointer", fontSize: 18, color: C.navy, fontWeight: 700 }}>+</button>
    </div>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", minHeight: "calc(100vh - 90px)" }}>
      <div style={{ padding: "20px 16px", borderRight: `1px solid ${C.border}`, overflowY: "auto" }}>
        <Section title="Civilstånd">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[{ id: "gift", icon: "💍", label: "Gift" }, { id: "sambo", icon: "🏠", label: "Sambo" }].map(alt => (
              <button key={alt.id} onClick={() => setCivilstand(alt.id)} style={{ padding: "14px 10px", borderRadius: 8, border: `2px solid ${civilstand === alt.id ? C.navy : C.border}`, background: civilstand === alt.id ? C.navy : C.surface, color: civilstand === alt.id ? "#fff" : C.textMid, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", textAlign: "center" }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{alt.icon}</div>{alt.label}
              </button>
            ))}
          </div>
        </Section>
        <Section title="Barn">
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: C.textMid, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8 }}>Gemensamma barn</div>
            <Counter value={gemensamma} onChange={setGemensamma} />
          </div>
          <div>
            <div style={{ color: C.textMid, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8 }}>Särkullsbarn <span style={{ color: C.red, fontWeight: 400 }}>(din partners barn)</span></div>
            <Counter value={sarkull} onChange={setSarkull} />
          </div>
        </Section>
        <Section title="Fastighet">
          <InputRow label="Marknadsvärde hus" value={marknadsvarde} onChange={setMarknadsvarde} suffix="kr" step={50000} />
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <label style={{ color: C.textMid, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>Andel lån</label>
              <span style={{ color: C.navy, fontSize: 12, fontWeight: 700 }}>{andelLan} %</span>
            </div>
            <input type="range" min={0} max={100} step={5} value={andelLan} onChange={e => setAndelLan(Number(e.target.value))} style={{ width: "100%", accentColor: C.navy, cursor: "pointer" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 6, padding: "10px 12px" }}>
              <div style={{ color: C.textLight, fontSize: 10, marginBottom: 3 }}>Lån</div>
              <div style={{ color: C.red, fontSize: 14, fontWeight: 700 }}>{fmtShort(marknadsvarde * andelLan / 100)}</div>
            </div>
            <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 6, padding: "10px 12px" }}>
              <div style={{ color: C.textLight, fontSize: 10, marginBottom: 3 }}>Eget kapital</div>
              <div style={{ color: C.green, fontSize: 14, fontWeight: 700 }}>{fmtShort(calc.nettoEget || 0)}</div>
            </div>
          </div>
        </Section>
      </div>
      <div style={{ padding: "24px 28px", overflowY: "auto" }}>
        <div style={{ background: calc.forsikringsbehov > 0 ? C.navy : C.green, borderRadius: 12, padding: "28px 32px", marginBottom: 20 }}>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Rekommenderat försäkringsbelopp</div>
          <div style={{ color: calc.forsikringsbehov > 0 ? C.gold : "#6EE0A4", fontSize: 42, fontWeight: 700 }}>{fmtShort(calc.forsikringsbehov || 0)}</div>
          {calc.forsikringsbehovLaglott > 0 && <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 4 }}>Minimibelopp (laglott): {fmtShort(calc.forsikringsbehovLaglott)}</div>}
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 12, lineHeight: 1.7 }}>{calc.message}</div>
        </div>
        <div style={{ background: "#F0FBF5", border: `1px solid ${C.green}`, borderRadius: 8, padding: "16px 20px" }}>
          <div style={{ color: C.textLight, fontSize: 10, lineHeight: 1.6 }}>* Vägledande beräkningar baserade på Ärvdabalken (SFS 1958:637) och Sambolagen (SFS 2003:376). Konsultera juridisk rådgivare för personlig rådgivning.</div>
        </div>
      </div>
    </div>
  );
};

// ── KF AVGIFTER ───────────────────────────────────────────────────────────────
const FOND_DEFAULT = [
  { name: "Länsförsäkringar (kapitalavg)", engångsPct: 0, löpandePct: 0, kapitalPct: 0.35, fast: 0 },
  { name: "Länsförsäkringar (premieavg)", engångsPct: 0, löpandePct: 2, kapitalPct: 0.15, fast: 200 },
  { name: "Folksam", engångsPct: 0, löpandePct: 0, kapitalPct: 0.35, fast: 120 },
  { name: "Futur (<600k)", engångsPct: 0, löpandePct: 0, kapitalPct: 0.40, fast: 180 },
  { name: "Futur (>600k)", engångsPct: 0, löpandePct: 0, kapitalPct: 0.25, fast: 180 },
  { name: "SEB (kapitalavg)", engångsPct: 0, löpandePct: 0, kapitalPct: 0.37, fast: 180 },
  { name: "SEB (premieavg)", engångsPct: 3, löpandePct: 3, kapitalPct: 0.15, fast: 180 },
  { name: "SPP (kapitalavg)", engångsPct: 0, löpandePct: 0, kapitalPct: 0.45, fast: 240 },
  { name: "SPP (premieavg)", engångsPct: 0, löpandePct: 3.5, kapitalPct: 0, fast: 0 },
  { name: "Skandia Fond", engångsPct: 0, löpandePct: 2, kapitalPct: 0, fast: 240 },
  { name: "Skandia Depå", engångsPct: 0, löpandePct: 2, kapitalPct: 0.15, fast: 240 },
];
const TRAD_DEFAULT = [
  { name: "SEB Trad (kapitalavg)", engångsPct: 0, löpandePct: 0, kapitalPct: 0.95, fast: 212 },
  { name: "SEB Trad (premieavg)", engångsPct: 3, löpandePct: 3, kapitalPct: 0.60, fast: 212 },
  { name: "Folksam Trad", engångsPct: 3, löpandePct: 0.8, kapitalPct: 0.65, fast: 240 },
  { name: "SPP Trad (kapitalavg)", engångsPct: 0, löpandePct: 0, kapitalPct: 0.80, fast: 240 },
  { name: "SPP Trad (premieavg)", engångsPct: 0, löpandePct: 3.5, kapitalPct: 0.45, fast: 0 },
  { name: "Skandia Trad Liv", engångsPct: 3, löpandePct: 1, kapitalPct: 0.60, fast: 240 },
  { name: "SH Pension", engångsPct: 1, löpandePct: 2, kapitalPct: 0.70, fast: 240 },
];

function calcProviderFees(provider, inputs) {
  const { löpandeMån, engångs, befintligt, år, avkastning } = inputs;
  const r = avkastning / 100;
  const engångsFee = engångs * (provider.engångsPct / 100);
  let capital = befintligt + engångs - engångsFee;
  let totalFee = engångsFee, year1Fee = engångsFee;
  for (let y = 1; y <= år; y++) {
    for (let m = 0; m < 12; m++) {
      const premAvgift = löpandeMån * (provider.löpandePct / 100);
      capital += löpandeMån - premAvgift; totalFee += premAvgift;
      if (y === 1) year1Fee += premAvgift;
    }
    capital *= (1 + r);
    const kFee = capital * (provider.kapitalPct / 100);
    capital -= kFee; capital -= provider.fast;
    totalFee += kFee + provider.fast;
    if (y === 1) year1Fee += kFee + provider.fast;
  }
  return { engångsFee, year1Fee, totalFee, avgFee: totalFee / år };
}

const ProviderModal = ({ provider, onSave, onClose, onReset }) => {
  const [vals, setVals] = useState({ löpandePct: provider.löpandePct, kapitalPct: provider.kapitalPct, fast: provider.fast });
  const set = (k, v) => setVals(prev => ({ ...prev, [k]: v }));
  const MI = ({ label, value, onChange, suffix, hint }) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <label style={{ color: C.textMid, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>{label}</label>
        {hint && <span style={{ color: C.textLight, fontSize: 10 }}>{hint}</span>}
      </div>
      <div style={{ display: "flex", alignItems: "center", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
        <input type="number" value={value} min={0} step={0.01} onChange={e => onChange(Number(e.target.value))}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 15, fontWeight: 600, padding: "10px 12px", fontFamily: "inherit", minWidth: 0 }} />
        <span style={{ color: C.textLight, padding: "10px 12px", fontSize: 12, borderLeft: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>{suffix}</span>
      </div>
    </div>
  );
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,40,71,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: C.surface, borderRadius: 10, padding: "28px 28px 24px", width: 400, boxShadow: "0 8px 40px rgba(15,40,71,0.18)", border: `1px solid ${C.border}` }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
          <div>
            <div style={{ color: C.gold, fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Redigera avgifter</div>
            <div style={{ color: C.navy, fontSize: 16, fontWeight: 700 }}>{provider.name}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 6, color: C.textLight, cursor: "pointer", padding: "6px 10px", fontSize: 14 }}>✕</button>
        </div>
        <div style={{ height: 1, background: C.border, marginBottom: 20 }} />
        <MI label="Premieavgift (löpande)" value={vals.löpandePct} onChange={v => set("löpandePct", v)} suffix="% av inbetald premie" hint="Dras månadsvis" />
        <MI label="Kapitalavgift" value={vals.kapitalPct} onChange={v => set("kapitalPct", v)} suffix="% / år av totalt kapital" hint="Dras årsvis" />
        <MI label="Fast avgift" value={vals.fast} onChange={v => set("fast", v)} suffix="kr / år" />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onReset} style={{ flex: 1, padding: "10px", borderRadius: 6, border: `1px solid ${C.border}`, background: "transparent", color: C.textMid, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Återställ standard</button>
          <button onClick={() => onSave(vals)} style={{ flex: 2, padding: "10px", borderRadius: 6, border: "none", background: C.navy, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Spara ändringar</button>
        </div>
      </div>
    </div>
  );
};

const AvgiftsView = ({ defaultMånSparande }) => {
  const [löpandeMån, setLöpandeMån] = useState(defaultMånSparande || 10000);
  const [engångs, setEngångs] = useState(0);
  const [befintligt, setBefintligt] = useState(500000);
  const [år, setÅr] = useState(20);
  const [avkastning, setAvkastning] = useState(7);
  const [kategori, setKategori] = useState("fond");
  const [sortKey, setSortKey] = useState("totalFee");
  const [customOverrides, setCustomOverrides] = useState({});
  const [editingProvider, setEditingProvider] = useState(null);

  const inputs = { löpandeMån, engångs, befintligt, år, avkastning };
  const baseProviders = kategori === "fond" ? FOND_DEFAULT : TRAD_DEFAULT;
  const providers = useMemo(() => baseProviders.map(p => ({ ...p, ...(customOverrides[p.name] || {}), isCustom: !!customOverrides[p.name] })), [baseProviders, customOverrides]);
  const results = useMemo(() => providers.map(p => ({ ...p, ...calcProviderFees(p, inputs) })).sort((a, b) => a[sortKey] - b[sortKey]), [providers, löpandeMån, engångs, befintligt, år, avkastning, sortKey]);
  const best = results[0], worst = results[results.length - 1];
  const colW = "52px 1fr 100px 100px 100px 110px 100px";
  const SH = ({ label, k }) => (
    <div onClick={() => setSortKey(k)} style={{ cursor: "pointer", color: sortKey === k ? "#fff" : "rgba(255,255,255,0.5)", fontWeight: sortKey === k ? 700 : 400, fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase", userSelect: "none", display: "flex", alignItems: "center", gap: 4 }}>
      {label}{sortKey === k && <span style={{ color: C.gold }}>▲</span>}
    </div>
  );

  return (
    <>
      {editingProvider && (
        <ProviderModal provider={{ ...providers.find(p => p.name === editingProvider) }}
          onSave={vals => { setCustomOverrides(prev => ({ ...prev, [editingProvider]: vals })); setEditingProvider(null); }}
          onReset={() => { setCustomOverrides(prev => { const n = { ...prev }; delete n[editingProvider]; return n; }); setEditingProvider(null); }}
          onClose={() => setEditingProvider(null)} />
      )}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", minHeight: "calc(100vh - 90px)" }}>
        <div style={{ padding: "20px 16px", borderRight: `1px solid ${C.border}` }}>
          <Section title="Dina förutsättningar">
            <InputRow label="Löpande premie / mån" value={löpandeMån} onChange={setLöpandeMån} suffix="kr / mån" step={500} />
            <InputRow label="Engångsinsättning" value={engångs} onChange={setEngångs} suffix="kr" step={10000} />
            <InputRow label="Befintligt kapital" value={befintligt} onChange={setBefintligt} suffix="kr" step={10000} />
            <InputRow label="Antal år" value={år} onChange={setÅr} suffix="år" step={1} min={1} max={40} />
            <InputRow label="Förväntad avkastning" value={avkastning} onChange={setAvkastning} suffix="% / år" step={0.5} min={0} max={20} hint="Före avgifter" />
          </Section>
          <Section title="Produkttyp">
            {[{ id: "fond", label: "Fondförsäkring" }, { id: "trad", label: "Traditionell förvaltning" }].map(k => (
              <button key={k.id} onClick={() => setKategori(k.id)} style={{ width: "100%", marginBottom: 8, padding: "11px 14px", borderRadius: 6, border: `1.5px solid ${kategori === k.id ? C.navy : C.border}`, background: kategori === k.id ? C.navy : C.surface, color: kategori === k.id ? "#fff" : C.textMid, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>{k.label}</button>
            ))}
          </Section>
          <div style={{ background: C.navy, borderRadius: 8, padding: "16px" }}>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Potentiell besparing</div>
            <div style={{ color: C.gold, fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{fmtShort(worst.totalFee - best.totalFee)}</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginBottom: 14 }}>Skillnad billigast vs dyrast över {år} år</div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Billigast</span>
                <span style={{ color: "#6EE0A4", fontSize: 12, fontWeight: 700 }}>{best.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Dyrast</span>
                <span style={{ color: "#F08080", fontSize: 12, fontWeight: 700 }}>{worst.name}</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: "20px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
              <span style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>{kategori === "fond" ? "Fondförsäkring" : "Traditionell Förvaltning"} — Jämförelse</span>
            </div>
            <div style={{ color: C.textLight, fontSize: 11 }}>Klicka på ett bolag för att redigera avgifter</div>
          </div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "20px", marginBottom: 14, boxShadow: "0 1px 4px rgba(15,40,71,0.06)" }}>
            <div style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 14 }}>Total avgift alla år</div>
            {results.map((p, i) => {
              const barW = worst.totalFee > 0 ? (p.totalFee / worst.totalFee) * 100 : 0;
              return (
                <div key={p.name} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: i === 0 ? C.gold : C.textMid, fontSize: 10, fontWeight: 700, width: 16, textAlign: "right" }}>#{i+1}</span>
                      <span style={{ color: C.text, fontSize: 12, fontWeight: i === 0 ? 700 : 400 }}>{p.name}</span>
                      {p.isCustom && <span style={{ background: C.goldLight, color: C.gold, fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3, border: `1px solid ${C.gold}` }}>ANPASSAD</span>}
                    </div>
                    <span style={{ color: i === 0 ? C.green : C.text, fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>{fmtShort(p.totalFee)}</span>
                  </div>
                  <div style={{ background: C.surface2, borderRadius: 3, height: 8 }}>
                    <div style={{ width: `${barW}%`, background: i === 0 ? C.green : i === results.length-1 ? C.red : C.navy, opacity: i === 0 ? 1 : i === results.length-1 ? 0.7 : 0.25, borderRadius: 3, height: 8 }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 4px rgba(15,40,71,0.06)" }}>
            <div style={{ display: "grid", gridTemplateColumns: colW, background: C.navy, padding: "12px 16px", gap: 8 }}>
              <SH label="Rank" k="totalFee" /><div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase" }}>Bolag</div>
              <SH label="Engångsfee" k="engångsFee" /><SH label="Avgift år 1" k="year1Fee" /><SH label="Snitt/år" k="avgFee" /><SH label="Total avgift" k="totalFee" />
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase" }}>Kapitalavg %</div>
            </div>
            {results.map((p, i) => {
              const isF = i === 0, isL = i === results.length - 1;
              return (
                <div key={p.name} onClick={() => setEditingProvider(p.name)}
                  style={{ display: "grid", gridTemplateColumns: colW, padding: "11px 16px", gap: 8, background: isF ? "#F0FBF5" : i % 2 === 0 ? C.surface : C.surface2, borderBottom: `1px solid ${C.border}`, borderLeft: isF ? `3px solid ${C.green}` : isL ? `3px solid ${C.red}` : `3px solid transparent`, cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#E8F0FA"}
                  onMouseLeave={e => e.currentTarget.style.background = isF ? "#F0FBF5" : i % 2 === 0 ? C.surface : C.surface2}>
                  <div style={{ display: "flex", alignItems: "center" }}><span style={{ background: isF ? C.green : isL ? C.red : C.navy, color: "#fff", borderRadius: 4, padding: "2px 7px", fontSize: 11, fontWeight: 700, opacity: isF || isL ? 1 : 0.2 }}>#{i+1}</span></div>
                  <div style={{ color: C.text, fontSize: 12, fontWeight: isF ? 700 : 400, display: "flex", alignItems: "center", gap: 6 }}>{p.name}{p.isCustom && <span style={{ background: C.goldLight, color: C.gold, fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3, border: `1px solid ${C.gold}` }}>✎</span>}</div>
                  <div style={{ color: p.engångsFee > 0 ? C.red : C.textLight, fontSize: 12, fontFamily: "monospace", display: "flex", alignItems: "center" }}>{fmt(p.engångsFee)}</div>
                  <div style={{ color: C.text, fontSize: 12, fontFamily: "monospace", display: "flex", alignItems: "center" }}>{fmt(p.year1Fee)}</div>
                  <div style={{ color: C.text, fontSize: 12, fontFamily: "monospace", display: "flex", alignItems: "center" }}>{fmt(p.avgFee)}</div>
                  <div style={{ color: isF ? C.green : isL ? C.red : C.text, fontSize: 12, fontWeight: 700, fontFamily: "monospace", display: "flex", alignItems: "center" }}>{fmtShort(p.totalFee)}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ flex: 1, background: C.surface2, borderRadius: 2, height: 6 }}><div style={{ width: `${Math.min(100,(p.kapitalPct/1)*100)}%`, background: C.navy, opacity: 0.35, height: 6, borderRadius: 2 }} /></div>
                    <span style={{ color: C.textMid, fontSize: 11, fontFamily: "monospace", whiteSpace: "nowrap" }}>{pct(p.kapitalPct)}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 12, color: C.textLight, fontSize: 11, lineHeight: 1.7 }}>* Premieavgift dras månadsvis på varje inbetalning. Kapitalavgift dras årsvis på totalt ackumulerat kapital.</div>
        </div>
      </div>
    </>
  );
};

// ── SPARANDE VIEW (with bank comparison chart) ────────────────────────────────
const SparandeView = ({ månSparande }) => {
  const [sparande, setSparande] = useState(månSparande || 10000);
  const [avkastning, setAvkastning] = useState(7);
  const [år, setÅr] = useState(20);
  const [engångs, setEngångs] = useState(0);
  const [useKF, setUseKF] = useState(!!månSparande);
  const [bankRanta, setBankRanta] = useState(2.5);
  const [inflation, setInflation] = useState(2.5);
  const [chartView, setChartView] = useState("nominell"); // "nominell" | "real"
  const [tooltip, setTooltip] = useState(null);

  const rows = useMemo(() => {
    const mRate = avkastning / 100 / 12;
    const bankRate = bankRanta / 100 / 12;
    const inflRate = inflation / 100;
    let kf = engångs, bank = engångs;
    const data = [];
    for (let y = 1; y <= år; y++) {
      for (let m = 0; m < 12; m++) {
        kf = kf * (1 + mRate) + sparande;
        bank = bank * (1 + bankRate) + sparande;
      }
      const insatt = engångs + sparande * 12 * y;
      const inflFactor = Math.pow(1 + inflRate, y);
      const kfReal = kf / inflFactor;
      const bankReal = bank / inflFactor;
      const insattReal = insatt / inflFactor;
      data.push({ y, kf, bank, insatt, kfReal, bankReal, insattReal, inflFactor });
    }
    return data;
  }, [sparande, avkastning, bankRanta, inflation, år, engångs]);

  const final = rows[rows.length - 1] || {};
  const milestones = rows.filter(r => [1,2,3,5,7,10,15,20,25,30].includes(r.y));

  // Chart geometry
  const CHART_H = 220;
  const CHART_PAD_L = 72;
  const CHART_PAD_B = 28;

  const nomMax = Math.max(...rows.map(r => r.kf), 1);
  const realMax = Math.max(...rows.map(r => Math.max(r.kfReal, r.bankReal)), 1);
  const maxVal = chartView === "nominell" ? nomMax : realMax;

  const toY = (v) => CHART_PAD_B + (1 - v / maxVal) * (CHART_H - CHART_PAD_B);
  const toX = (i, total, w) => CHART_PAD_L + (i / (total - 1)) * (w - CHART_PAD_L - 8);

  const kfColor = C.gold;
  const bankColor = "#3A7BD5";
  const insattColor = C.navy;
  const inflColor = C.red;

  const gridLines = [0.25, 0.5, 0.75, 1];

  const LineChart = () => {
    const [hoverIdx, setHoverIdx] = useState(null);
    const svgRef = (node) => { /* no-op */ };

    if (rows.length < 2) return null;

    const W = 640;
    const makePoints = (getter) =>
      rows.map((r, i) => `${toX(i, rows.length, W)},${toY(getter(r))}`).join(" ");

    const kfPoints   = makePoints(r => chartView === "nominell" ? r.kf   : r.kfReal);
    const bankPoints = makePoints(r => chartView === "nominell" ? r.bank : r.bankReal);
    const insPoints  = makePoints(r => chartView === "nominell" ? r.insatt : r.insattReal);

    const kfArea = `${CHART_PAD_L},${CHART_H - CHART_PAD_B} ` + kfPoints + ` ${toX(rows.length-1,rows.length,W)},${CHART_H - CHART_PAD_B}`;

    const hRow = hoverIdx !== null ? rows[hoverIdx] : null;
    const hX = hoverIdx !== null ? toX(hoverIdx, rows.length, W) : 0;

    return (
      <div style={{ position: "relative" }}>
        <svg width="100%" viewBox={`0 0 ${W} ${CHART_H}`} style={{ display: "block", overflow: "visible" }}
          onMouseLeave={() => setHoverIdx(null)}>
          <defs>
            <linearGradient id="kfGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={kfColor} stopOpacity="0.18" />
              <stop offset="100%" stopColor={kfColor} stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {gridLines.map(f => {
            const y = toY(maxVal * f);
            return (
              <g key={f}>
                <line x1={CHART_PAD_L} y1={y} x2={W - 8} y2={y} stroke={C.border} strokeWidth="1" strokeDasharray="4,3" />
                <text x={CHART_PAD_L - 6} y={y + 4} textAnchor="end" fontSize="9" fill={C.textLight}>{fmtShort(maxVal * f)}</text>
              </g>
            );
          })}

          {/* X axis ticks */}
          {rows.map((r, i) => {
            const showTick = r.y % (år <= 10 ? 1 : år <= 20 ? 2 : 5) === 0;
            if (!showTick) return null;
            const x = toX(i, rows.length, W);
            return <text key={r.y} x={x} y={CHART_H - 6} textAnchor="middle" fontSize="9" fill={C.textLight}>År {r.y}</text>;
          })}

          {/* KF fill area */}
          <polygon points={kfArea} fill="url(#kfGrad)" />

          {/* Lines */}
          <polyline points={insPoints} fill="none" stroke={insattColor} strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="5,4" />
          <polyline points={bankPoints} fill="none" stroke={bankColor} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          <polyline points={kfPoints} fill="none" stroke={kfColor} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

          {/* Hover capture overlay */}
          {rows.map((r, i) => {
            const x = toX(i, rows.length, W);
            return (
              <rect key={i} x={x - (W / rows.length / 2)} y={0} width={W / rows.length} height={CHART_H}
                fill="transparent" onMouseEnter={() => setHoverIdx(i)} />
            );
          })}

          {/* Hover crosshair + dots */}
          {hoverIdx !== null && hRow && (() => {
            const kfV = chartView === "nominell" ? hRow.kf : hRow.kfReal;
            const bankV = chartView === "nominell" ? hRow.bank : hRow.bankReal;
            const insV = chartView === "nominell" ? hRow.insatt : hRow.insattReal;
            return (
              <g>
                <line x1={hX} y1={toY(maxVal)} x2={hX} y2={CHART_H - CHART_PAD_B} stroke={C.border} strokeWidth="1" strokeDasharray="3,2" />
                <circle cx={hX} cy={toY(kfV)} r="4" fill={kfColor} stroke="#fff" strokeWidth="1.5" />
                <circle cx={hX} cy={toY(bankV)} r="4" fill={bankColor} stroke="#fff" strokeWidth="1.5" />
                <circle cx={hX} cy={toY(insV)} r="3.5" fill={insattColor} stroke="#fff" strokeWidth="1.5" fillOpacity="0.5" />
              </g>
            );
          })()}
        </svg>

        {/* Tooltip */}
        {hoverIdx !== null && rows[hoverIdx] && (() => {
          const r = rows[hoverIdx];
          const kfV = chartView === "nominell" ? r.kf : r.kfReal;
          const bankV = chartView === "nominell" ? r.bank : r.bankReal;
          const insV = chartView === "nominell" ? r.insatt : r.insattReal;
          const diff = kfV - bankV;
          return (
            <div style={{ position: "absolute", top: 8, right: 8, background: C.navy, border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 8, padding: "12px 16px", minWidth: 200, pointerEvents: "none", boxShadow: "0 4px 20px rgba(15,40,71,0.25)" }}>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>År {r.y} {chartView === "real" ? "— realt värde" : ""}</div>
              {[
                { label: "KF / Investering", val: kfV, color: kfColor },
                { label: "Bankkonto", val: bankV, color: bankColor },
                { label: "Insatt kapital", val: insV, color: "rgba(255,255,255,0.4)" },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 3, borderRadius: 2, background: item.color }} />
                    <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>{item.label}</span>
                  </div>
                  <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>{fmtShort(item.val)}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>KF vs Bank</span>
                <span style={{ color: diff >= 0 ? "#6EE0A4" : "#F08080", fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>+{fmtShort(diff)}</span>
              </div>
            </div>
          );
        })()}
      </div>
    );
  };

  const kfFinal = chartView === "nominell" ? (final.kf || 0) : (final.kfReal || 0);
  const bankFinal = chartView === "nominell" ? (final.bank || 0) : (final.bankReal || 0);
  const insattFinal = chartView === "nominell" ? (final.insatt || 0) : (final.insattReal || 0);
  const fördel = kfFinal - bankFinal;
  const realKöpkraftBankVsInsatt = (final.bankReal || 0) - (final.insattReal || 0);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", minHeight: "calc(100vh - 90px)" }}>
      {/* ── VÄNSTER ── */}
      <div style={{ padding: "20px 16px", borderRight: `1px solid ${C.border}`, overflowY: "auto" }}>
        <Section title="Sparparametrar">
          {månSparande > 0 && (
            <div style={{ background: C.goldLight, border: `1px solid ${C.gold}`, borderRadius: 6, padding: "10px 14px", marginBottom: 14, display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: C.gold, fontSize: 11, fontWeight: 700 }}>Från KF-kalkylatorn</span>
              <span style={{ color: C.navy, fontSize: 13, fontWeight: 700 }}>{fmt(månSparande)} / mån</span>
            </div>
          )}
          <div style={{ marginBottom: 14 }}>
            <label style={{ color: C.textMid, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", display: "block", marginBottom: 5 }}>Månatligt sparande</label>
            {månSparande > 0 && (
              <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <button onClick={() => { setUseKF(true); setSparande(Math.max(0, Math.round(månSparande))); }} style={{ flex: 1, padding: "7px", borderRadius: 5, border: `1.5px solid ${useKF ? C.navy : C.border}`, background: useKF ? C.navy : "transparent", color: useKF ? "#fff" : C.textMid, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Från KF</button>
                <button onClick={() => setUseKF(false)} style={{ flex: 1, padding: "7px", borderRadius: 5, border: `1.5px solid ${!useKF ? C.navy : C.border}`, background: !useKF ? C.navy : "transparent", color: !useKF ? "#fff" : C.textMid, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Eget belopp</button>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
              <input type="number" value={sparande} min={0} step={500} onChange={e => { setUseKF(false); setSparande(Number(e.target.value)); }}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 14, fontWeight: 600, padding: "10px 12px", fontFamily: "inherit", minWidth: 0 }} />
              <span style={{ color: C.textLight, padding: "10px 10px", fontSize: 11, borderLeft: `1px solid ${C.border}`, whiteSpace: "nowrap", flexShrink: 0 }}>kr / mån</span>
            </div>
          </div>
          <InputRow label="Engångsinsättning" value={engångs} onChange={setEngångs} suffix="kr" step={10000} hint="Startkapital" />
          <InputRow label="Förväntad avkastning (KF)" value={avkastning} onChange={setAvkastning} suffix="% / år" step={0.5} min={0} max={30} />
          <InputRow label="Spartid" value={år} onChange={setÅr} suffix="år" step={1} min={1} max={40} />
        </Section>

        <Section title="Jämförelse: Bankkonto">
          <InputRow label="Bankränta" value={bankRanta} onChange={setBankRanta} suffix="% / år" step={0.25} min={0} max={15} hint="Räntesats på företagskonto" />
          <InputRow label="Inflation" value={inflation} onChange={setInflation} suffix="% / år" step={0.25} min={0} max={15} hint="KPI — årsgenomsnitt" />
          <div style={{ background: bankRanta < inflation ? "#FEF0EE" : "#F0FBF5", border: `1px solid ${bankRanta < inflation ? "#F5C6C2" : C.green}`, borderRadius: 6, padding: "10px 14px" }}>
            <div style={{ color: bankRanta < inflation ? C.red : C.green, fontSize: 11, fontWeight: 700, marginBottom: 3 }}>
              {bankRanta < inflation ? "⚠ Negativ realränta" : "✓ Positiv realränta"}
            </div>
            <div style={{ color: C.textMid, fontSize: 11 }}>
              Realränta bank: <strong style={{ color: bankRanta < inflation ? C.red : C.green }}>{(bankRanta - inflation).toFixed(2)} %</strong>
            </div>
            <div style={{ color: C.textMid, fontSize: 11, marginTop: 2 }}>
              Realavkastning KF: <strong style={{ color: C.gold }}>{(avkastning - inflation).toFixed(2)} %</strong>
            </div>
          </div>
        </Section>

        <div style={{ background: C.navy, borderRadius: 8, padding: "16px", marginBottom: 12 }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Fördel KF vs bank efter {år} år</div>
          <div style={{ color: "#6EE0A4", fontSize: 28, fontWeight: 700 }}>{fmtShort(kfFinal - bankFinal)}</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, marginTop: 4 }}>nominellt värde</div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 12, paddingTop: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>KF slutvärde</span>
              <span style={{ color: C.gold, fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>{fmtShort(final.kf || 0)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Bank slutvärde</span>
              <span style={{ color: bankColor, fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>{fmtShort(final.bank || 0)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>Köpkraftsförlust bank (real)</span>
              <span style={{ color: realKöpkraftBankVsInsatt >= 0 ? "#6EE0A4" : "#F08080", fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>
                {realKöpkraftBankVsInsatt >= 0 ? "+" : ""}{fmtShort(realKöpkraftBankVsInsatt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── HÖGER ── */}
      <div style={{ padding: "20px 24px", overflowY: "auto" }}>
        {/* Chart header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
            <span style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>KF vs Bankkonto — Kapitalutveckling</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[{ id: "nominell", label: "Nominellt" }, { id: "real", label: "Realt (inf.just.)" }].map(v => (
              <button key={v.id} onClick={() => setChartView(v.id)} style={{ padding: "6px 14px", borderRadius: 5, border: `1.5px solid ${chartView === v.id ? C.navy : C.border}`, background: chartView === v.id ? C.navy : "transparent", color: chartView === v.id ? "#fff" : C.textMid, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{v.label}</button>
            ))}
          </div>
        </div>

        {/* Line chart */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "20px 16px 12px 16px", marginBottom: 14, boxShadow: "0 1px 4px rgba(15,40,71,0.06)", position: "relative" }}>
          <LineChart />
          {/* Legend */}
          <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
            {[
              { c: kfColor, label: `KF / Investering (${avkastning} %)`, thick: true },
              { c: bankColor, label: `Bankkonto (${bankRanta} %)`, thick: false },
              { c: insattColor, o: 0.35, label: "Insatt kapital", dashed: true },
            ].map(lg => (
              <div key={lg.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="20" height="10"><line x1="0" y1="5" x2="20" y2="5" stroke={lg.c} strokeWidth={lg.thick ? 2.5 : 2} strokeOpacity={lg.o ?? 1} strokeDasharray={lg.dashed ? "4,3" : "none"} /></svg>
                <span style={{ color: C.textMid, fontSize: 11 }}>{lg.label}</span>
              </div>
            ))}
          </div>
          {chartView === "real" && (
            <div style={{ marginTop: 10, padding: "8px 12px", background: C.surface2, borderRadius: 6, color: C.textLight, fontSize: 10, textAlign: "center" }}>
              Realt värde = nominellt kapital justerat för {inflation} % inflation per år — visar köpkraft i dagens penningvärde
            </div>
          )}
        </div>

        {/* KPI cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
          {[
            { label: `KF efter ${år} år`, value: fmtShort(final.kf || 0), sub: `Real: ${fmtShort(final.kfReal || 0)}`, color: kfColor },
            { label: `Bank efter ${år} år`, value: fmtShort(final.bank || 0), sub: `Real: ${fmtShort(final.bankReal || 0)}`, color: bankColor },
            { label: "Fördel KF (nominell)", value: fmtShort((final.kf || 0) - (final.bank || 0)), sub: "Extra avkastning", color: C.green },
            { label: "Fördel KF (real)", value: fmtShort((final.kfReal || 0) - (final.bankReal || 0)), sub: "Realt mervärde", color: C.green },
          ].map((k, i) => (
            <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 16px", boxShadow: "0 1px 4px rgba(15,40,71,0.06)" }}>
              <div style={{ color: C.textLight, fontSize: 10, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase", marginBottom: 5 }}>{k.label}</div>
              <div style={{ color: k.color, fontSize: 16, fontWeight: 700, marginBottom: 3 }}>{k.value}</div>
              <div style={{ color: C.textLight, fontSize: 10 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Milestone table */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 4px rgba(15,40,71,0.06)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "50px 1fr 1fr 1fr 1fr 1fr", background: C.navy, padding: "10px 16px" }}>
            {["År", "KF nominell", "Bank nominell", "KF real", "Bank real", "Fördel KF"].map((h, i) => (
              <div key={h} style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", textAlign: i > 0 ? "right" : "left" }}>{h}</div>
            ))}
          </div>
          {milestones.filter(r => r.y <= år).map((row, i) => {
            const fordel = row.kf - row.bank;
            return (
              <div key={row.y} style={{ display: "grid", gridTemplateColumns: "50px 1fr 1fr 1fr 1fr 1fr", padding: "9px 16px", background: i % 2 === 0 ? C.surface : C.surface2, borderBottom: `1px solid ${C.border}` }}>
                <div style={{ color: C.textMid, fontSize: 12, fontWeight: 700 }}>{row.y}</div>
                <div style={{ color: C.text, fontSize: 12, fontWeight: 700, fontFamily: "monospace", textAlign: "right" }}>{fmtShort(row.kf)}</div>
                <div style={{ color: bankColor, fontSize: 12, fontFamily: "monospace", textAlign: "right" }}>{fmtShort(row.bank)}</div>
                <div style={{ color: C.textMid, fontSize: 12, fontFamily: "monospace", textAlign: "right" }}>{fmtShort(row.kfReal)}</div>
                <div style={{ color: C.textMid, fontSize: 12, fontFamily: "monospace", textAlign: "right" }}>{fmtShort(row.bankReal)}</div>
                <div style={{ color: fordel >= 0 ? C.green : C.red, fontSize: 12, fontWeight: 700, fontFamily: "monospace", textAlign: "right" }}>+{fmtShort(fordel)}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 10, color: C.textLight, fontSize: 10, lineHeight: 1.7 }}>
          * Nominellt = bokfört kapital. Realt = inflationsjusterat till dagens köpkraft ({inflation} % inflation/år). KF-avkastning före skatt (1,086 % schablonskatt på ingående värde).
        </div>
      </div>
    </div>
  );
};

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("kalkylator");
  const [intäkterMode, setIntäkterMode] = useState("timbaserat");
  const [timpris, setTimpris] = useState(1200);
  const [timmar, setTimmar] = useState(1800);
  const [debiteringsgrad, setDebiteringsgrad] = useState(85);
  const [direktOmsättning, setDirektOmsättning] = useState(2000000);
  const [vinstmarginal, setVinstmarginal] = useState(30);
  const [bruttolön, setBruttolön] = useState(50000);
  const [lönPeriod, setLönPeriod] = useState("mån");
  const [pensionPct, setPensionPct] = useState(15);
  const [övriga, setÖvriga] = useState([
    { label: "Hyra / kontorsplats", amount: 3000 },
    { label: "Mjukvara & verktyg", amount: 1500 },
    { label: "Försäkringar", amount: 1000 },
  ]);
  const [utdelning, setUtdelning] = useState(200000);
  const [buffertPct, setBuffertPct] = useState(10);

  const r = useMemo(() => {
    const faktTim = timmar * (debiteringsgrad / 100);
    const omsättning = intäkterMode === "timbaserat" ? timpris * faktTim : direktOmsättning;
    const lönTotal = bruttolön * 12 * 1.3142;
    const pension = bruttolön * 12 * (pensionPct / 100);
    const övrigaSum = övriga.reduce((s, k) => s + (k.amount || 0), 0) * 12;
    const ebit = intäkterMode === "marginal" ? omsättning * (vinstmarginal / 100) : omsättning - lönTotal - pension - övrigaSum;
    const buffert = omsättning * (buffertPct / 100);
    const kvarEfterUtdelning = ebit - utdelning;
    const tillgängligtKF_år = kvarEfterUtdelning - buffert;
    const tillgängligtKF_mån = tillgängligtKF_år / 12;
    return { omsättning, lönTotal, pension, övrigaSum, ebit, buffert, kvarEfterUtdelning, tillgängligtKF_år, tillgängligtKF_mån, utdelningNetto: utdelning * 0.8, faktTim };
  }, [intäkterMode, timpris, timmar, debiteringsgrad, direktOmsättning, vinstmarginal, bruttolön, pensionPct, övriga, utdelning, buffertPct]);

  const tabs = [
    { id: "kalkylator", label: "Likviditetskalkylator" },
    { id: "sparande", label: "Sparande & Avkastning" },
    { id: "avgifter", label: "Avgiftskalkylator" },
    { id: "offert", label: "Offertjämförelse" },
    { id: "livforsakring", label: "Livförsäkring" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif", color: C.text }}>
      <div style={{ background: C.navy, padding: "0 32px", display: "flex", alignItems: "center" }}>
        <div style={{ padding: "18px 0", borderRight: `1px solid rgba(255,255,255,0.08)`, paddingRight: 28, marginRight: 28, flexShrink: 0 }}>
          <div style={{ color: C.gold, fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Norrfinans</div>
        </div>
        <div style={{ display: "flex", gap: 2, overflowX: "auto" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? "rgba(255,255,255,0.08)" : "transparent", border: "none", borderBottom: tab === t.id ? `2px solid ${C.gold}` : "2px solid transparent", color: tab === t.id ? "#fff" : "rgba(255,255,255,0.45)", padding: "20px 18px 18px", cursor: "pointer", fontSize: 12, fontWeight: 700, letterSpacing: 0.5, fontFamily: "inherit", transition: "all 0.2s", whiteSpace: "nowrap" }}>{t.label}</button>
          ))}
        </div>
      </div>
      <div style={{ height: 3, background: `linear-gradient(90deg,${C.gold},#E8B84B,${C.gold})` }} />

      {tab === "kalkylator" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 300px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ padding: "20px 16px", borderRight: `1px solid ${C.border}` }}>
            <Section title="Intäkter">
              <div style={{ display: "flex", gap: 6, marginBottom: 16, background: C.surface2, borderRadius: 7, padding: 4 }}>
                {[{ id: "timbaserat", label: "⏱ Timbaserat" }, { id: "marginal", label: "📊 Omsättning & Marginal" }].map(m => (
                  <button key={m.id} onClick={() => setIntäkterMode(m.id)} style={{ flex: 1, padding: "8px 10px", borderRadius: 5, border: "none", background: intäkterMode === m.id ? C.navy : "transparent", color: intäkterMode === m.id ? "#fff" : C.textMid, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{m.label}</button>
                ))}
              </div>
              {intäkterMode === "timbaserat" ? (
                <>
                  <InputRow label="Timpris" value={timpris} onChange={setTimpris} suffix="kr / tim" step={50} />
                  <InputRow label="Timmar / år" value={timmar} onChange={setTimmar} suffix="tim" step={10} />
                  <InputRow label="Debiteringsgrad" value={debiteringsgrad} onChange={setDebiteringsgrad} suffix="%" step={1} max={100} />
                  <InfoChip label="Fakturerbara timmar" value={`${Math.round(r.faktTim).toLocaleString("sv-SE")} tim`} />
                  <div style={{ marginTop: 8 }}><InfoChip label="Omsättning / år" value={fmt(r.omsättning)} /></div>
                </>
              ) : (
                <>
                  <InputRow label="Omsättning / år" value={direktOmsättning} onChange={setDirektOmsättning} suffix="kr / år" step={50000} />
                  <InputRow label="Vinstmarginal (EBIT)" value={vinstmarginal} onChange={setVinstmarginal} suffix="%" step={0.5} min={0} max={100} hint="Resultat / omsättning" />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
                    <InfoChip label="Omsättning / mån" value={fmt(direktOmsättning / 12)} />
                    <InfoChip label="EBIT / år" value={fmt(r.ebit)} />
                  </div>
                </>
              )}
            </Section>
            <Section title="Lön & Arbetsgivaravgift">
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                {[{ id: "mån", label: "Månadsvis" }, { id: "år", label: "Årsvis" }].map(t => (
                  <button key={t.id} onClick={() => setLönPeriod(t.id)} style={{ flex: 1, padding: "7px", borderRadius: 5, border: `1.5px solid ${lönPeriod === t.id ? C.navy : C.border}`, background: lönPeriod === t.id ? C.navy : "transparent", color: lönPeriod === t.id ? "#fff" : C.textMid, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{t.label}</button>
                ))}
              </div>
              <InputRow label={lönPeriod === "mån" ? "Bruttolön / månad" : "Bruttolön / år"} value={lönPeriod === "mån" ? bruttolön : bruttolön * 12} onChange={v => setBruttolön(lönPeriod === "mån" ? v : Math.round(v / 12))} suffix={lönPeriod === "mån" ? "kr / mån" : "kr / år"} step={lönPeriod === "mån" ? 1000 : 12000} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <InfoChip label="AG-avgift" value="31,42 %" />
                <InfoChip label="Lönekostnad / år" value={fmt(bruttolön * 12 * 1.3142)} />
              </div>
              <div style={{ marginTop: 8 }}><InfoChip label={lönPeriod === "mån" ? "Motsvarar årslön" : "Månadsslön"} value={lönPeriod === "mån" ? fmt(bruttolön * 12) : fmt(bruttolön)} /></div>
            </Section>
            <Section title="Pensionsavsättning">
              <InputRow label="% av bruttolön" value={pensionPct} onChange={setPensionPct} suffix="%" step={0.5} min={0} max={100} hint="Typiskt 4,5–35 %" />
              <InfoChip label="Årsavsättning" value={fmt(bruttolön * 12 * pensionPct / 100)} />
            </Section>
            <Section title="Övriga kostnader / mån"><OvrigKostnad items={övriga} onChange={setÖvriga} /></Section>
            <Section title="Utdelning & Buffert">
              <InputRow label="Planerad utdelning brutto / år" value={utdelning} onChange={setUtdelning} suffix="kr / år" step={10000} hint="Skatt 20 % (3:12)" />
              <InputRow label="Likviditetsbuffert" value={buffertPct} onChange={setBuffertPct} suffix="% av omsättning" step={1} min={0} max={100} />
              <InfoChip label="Buffertbelopp" value={fmt(r.buffert)} />
            </Section>
          </div>
          <div style={{ padding: "20px 16px", borderRight: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
              <span style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Resultatöversikt — Helår</span>
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "18px 20px", marginBottom: 12, boxShadow: "0 1px 4px rgba(15,40,71,0.06)" }}>
              <WRow label="Omsättning" value={r.omsättning} bold />
              <WRow separator />
              {intäkterMode === "timbaserat" ? (<>
                <WRow label="Lön & arbetsgivaravgift" value={-r.lönTotal} />
                <WRow label="Pensionsavsättning" value={-r.pension} />
                <WRow label="Övriga kostnader" value={-r.övrigaSum} />
                <WRow separator />
              </>) : (
                <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0 7px", borderBottom: `1px solid #F0F3F7`, marginBottom: 6 }}>
                  <span style={{ color: C.textMid, fontSize: 12 }}>Rörelsekostnader (inkl. i marginal)</span>
                  <span style={{ background: C.goldLight, color: C.gold, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 3, border: `1px solid ${C.gold}` }}>{vinstmarginal} % marginal</span>
                </div>
              )}
              <WRow label="EBIT" value={r.ebit} bold />
              <WRow separator />
              <WRow label="Planerad utdelning (brutto)" value={-utdelning} />
              <WRow separator />
              <WRow label="Kvar i bolaget efter utdelning" value={r.kvarEfterUtdelning} bold />
              <WRow label={`Likviditetsbuffert (${buffertPct} % av oms.)`} value={-r.buffert} />
              <WRow separator />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: C.navy, borderRadius: 6, marginTop: 6 }}>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600 }}>Tillgängligt för kapitalförsäkring / år</span>
                <span style={{ color: r.tillgängligtKF_år >= 0 ? "#6EE0A4" : "#F08080", fontSize: 15, fontWeight: 700, fontFamily: "monospace" }}>{r.tillgängligtKF_år >= 0 ? "" : "−"}{fmt(Math.abs(r.tillgängligtKF_år))}</span>
              </div>
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "18px 20px", boxShadow: "0 1px 4px rgba(15,40,71,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
                <span style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Fördelning av omsättning</span>
              </div>
              {(intäkterMode === "timbaserat" ? [
                { label: "Lön (inkl. AG-avgift)", value: r.lönTotal, color: "#3A7BD5" },
                { label: "Pension", value: r.pension, color: "#7B5EA7" },
                { label: "Övriga kostnader", value: r.övrigaSum, color: "#E08A3C" },
                { label: "Utdelning (brutto)", value: utdelning, color: C.green },
                { label: "Buffert", value: r.buffert, color: C.blue },
                { label: "Kapitalförsäkring", value: Math.max(0, r.tillgängligtKF_år), color: C.gold },
              ] : [
                { label: "Rörelsekostnader (i marginal)", value: r.omsättning - r.ebit, color: "#3A7BD5" },
                { label: "Utdelning (brutto)", value: utdelning, color: C.green },
                { label: "Buffert", value: r.buffert, color: C.blue },
                { label: "Kapitalförsäkring", value: Math.max(0, r.tillgängligtKF_år), color: C.gold },
              ]).map((item, i) => {
                const w = r.omsättning > 0 ? Math.max(0, Math.min(100, (item.value / r.omsättning) * 100)) : 0;
                return (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color }} />
                        <span style={{ color: C.textMid, fontSize: 11 }}>{item.label}</span>
                      </div>
                      <span style={{ color: C.text, fontSize: 11, fontWeight: 600, fontFamily: "monospace" }}>{pct1(w)}</span>
                    </div>
                    <div style={{ background: C.surface2, borderRadius: 3, height: 6 }}>
                      <div style={{ width: `${w}%`, background: item.color, borderRadius: 3, height: 6, transition: "width 0.4s" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ padding: "20px 16px", background: "#EEF2F7" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
              <div>
                <div style={{ color: C.gold, fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Företagsägd</div>
                <div style={{ color: C.navy, fontSize: 13, fontWeight: 700 }}>Kapitalförsäkring</div>
              </div>
            </div>
            <KFRow label="EBIT (resultat före skatt)" value={r.ebit} />
            <KFRow label={`Likviditetsbuffert (${buffertPct} % av omsättning)`} value={r.buffert} />
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7, padding: "14px 16px", margin: "12px 0" }}>
              <div style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Utdelning</div>
              {[{ l: "Brutto", v: fmt(utdelning), c: C.text }, { l: "Skatt (20 %)", v: `−${fmt(utdelning * 0.20)}`, c: C.red }].map(row => (
                <div key={row.l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: C.textMid, fontSize: 12 }}>{row.l}</span>
                  <span style={{ color: row.c, fontSize: 12, fontFamily: "monospace" }}>{row.v}</span>
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: C.text, fontSize: 12, fontWeight: 700 }}>Netto till ägaren</span>
                <span style={{ color: C.green, fontSize: 13, fontWeight: 700, fontFamily: "monospace" }}>{fmt(r.utdelningNetto)}</span>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
              <div style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Sparande i KF</div>
              <KFRow label="Tillgängligt för sparande / mån" value={r.tillgängligtKF_mån} />
              <KFRow label="Tillgängligt för sparande / år" value={r.tillgängligtKF_år} highlight large />
            </div>
            {r.ebit > 0 && (
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7, padding: "14px 16px", marginTop: 4 }}>
                <div style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Som andel av EBIT</div>
                {[
                  { l: "Utdelning", v: pct1((utdelning / r.ebit) * 100), c: C.green },
                  { l: "Buffert", v: pct1((r.buffert / r.ebit) * 100), c: C.blue },
                  { l: "Kapitalförsäkring", v: pct1(Math.max(0, r.tillgängligtKF_år / r.ebit) * 100), c: C.gold, bold: true },
                ].map(row => (
                  <div key={row.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: row.c }} />
                      <span style={{ color: row.bold ? C.text : C.textMid, fontSize: 11, fontWeight: row.bold ? 700 : 400 }}>{row.l}</span>
                    </div>
                    <span style={{ color: row.c, fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>{row.v}</span>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setTab("sparande")} style={{ width: "100%", marginTop: 10, padding: "12px", background: C.goldLight, border: `1.5px solid ${C.gold}`, borderRadius: 7, color: C.gold, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>📈 Se sparande & avkastning →</button>
            <button onClick={() => setTab("avgifter")} style={{ width: "100%", marginTop: 8, padding: "12px", background: C.surface2, border: `1.5px solid ${C.border}`, borderRadius: 7, color: C.navy, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>🏦 Jämför KF-avgifter →</button>
            <button onClick={() => setTab("offert")} style={{ width: "100%", marginTop: 8, padding: "12px", background: C.surface2, border: `1.5px solid ${C.border}`, borderRadius: 7, color: C.navy, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>📋 Jämför försäkringsofferter →</button>
            <button onClick={() => setTab("livforsakring")} style={{ width: "100%", marginTop: 8, padding: "12px", background: C.surface2, border: `1.5px solid ${C.border}`, borderRadius: 7, color: C.navy, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>🛡️ Beräkna livförsäkring →</button>
          </div>
        </div>
      )}

      {tab === "sparande" && <SparandeView månSparande={Math.max(0, Math.round(r.tillgängligtKF_mån))} />}
      {tab === "avgifter" && <AvgiftsView defaultMånSparande={Math.max(0, Math.round(r.tillgängligtKF_mån))} />}
      {tab === "offert" && <OffertView />}
      {tab === "livforsakring" && <LivforsakringView />}

      <div style={{ textAlign: "center", padding: "14px", color: C.textLight, fontSize: 11, borderTop: `1px solid ${C.border}`, background: C.surface }}>
        Beräkningar baserade på svenska skatteregler 2024 &nbsp;•&nbsp; Konsultera en revisor för rådgivning
      </div>
    </div>
  );
}
