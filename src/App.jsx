import React, { useState, useMemo } from "react";

const fmt = (n) => new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 }).format(n);
const fmtShort = (n) => n >= 1000000 ? `${(n/1000000).toFixed(2)} Mkr` : fmt(n);
const pct = (n) => `${Number(n).toFixed(2)} %`;
const pct1 = (n) => `${Number(n).toFixed(1)} %`;

const C = {
  bg: "#F5F3EE", surface: "#FFFFFF", surface2: "#F0EDE6", border: "#E0D8CC",
  navy: "#9B182D",     // Hjerta mörk burgundy (RGB 155/24/45)
  gold: "#E73331",     // Hjerta röd (RGB 231/51/49)
  goldLight: "#F7EDEB", // ljus röd tint
  text: "#2A1015",     // mörk text
  textMid: "#6B3040",  // mellanton burgundy
  textLight: "#A87880", // ljus ton
  green: "#1A7A4A", red: "#9B182D", blue: "#E73331",
  tan: "#CEC09E",      // Hjerta beige/tan (RGB 206/192/158)
  tanLight: "#F2EDE3", // ljus beige
};

const fmtInput = v => {
  const n = Number(v);
  if (v === 0 || v === "" || isNaN(n)) return "";
  return new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 2 }).format(n);
};
const parseInput = s => {
  const clean = String(s).replace(/\s/g, "").replace(",", ".");
  return clean === "" ? 0 : Number(clean) || 0;
};

const InputRow = ({ label, value, onChange, suffix, step = 1000, min = 0, max, hint }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
      <label style={{ color: C.textMid, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>{label}</label>
      {hint && <span style={{ color: C.textLight, fontSize: 10 }}>{hint}</span>}
    </div>
    <div style={{ display: "flex", alignItems: "center", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
      <input
        type="number"
        value={value === 0 ? "" : value}
        min={min} max={max} step={step}
        placeholder="0"
        onChange={e => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
        style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 14, fontWeight: 600, padding: "10px 12px", fontFamily: "inherit", minWidth: 0 }}
      />
      <span style={{ color: C.textLight, padding: "10px 12px", fontSize: 12, borderLeft: `1px solid ${C.border}`, whiteSpace: "nowrap", flexShrink: 0 }}>{suffix}</span>
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "18px 20px", marginBottom: 12, boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
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
    <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid #F0EDE6` }}>
      <span style={{ color: bold ? C.text : C.textMid, fontSize: bold ? 13 : 12, fontWeight: bold ? 700 : 400 }}>{label}</span>
      <span style={{ color: bold ? C.text : value >= 0 ? C.green : C.red, fontSize: bold ? 13 : 12, fontWeight: bold ? 700 : 500, fontFamily: "monospace" }}>
        {value >= 0 ? "" : "−"}{fmt(Math.abs(value))}
      </span>
    </div>
  );
};

const KFRow = ({ label, value, highlight, large, color }) => {
  const bg = highlight ? C.navy : color === "blue" ? "#FFF0F0" : C.surface2;
  const border = highlight ? C.navy : color === "blue" ? "#BFCFEE" : C.border;
  const valColor = highlight ? "#FFF" : color === "blue" ? "#9B182D" : value < 0 ? C.red : C.text;
  return (
    <div style={{ padding: "14px 16px", background: bg, border: `1px solid ${border}`, borderRadius: 7, marginBottom: 10 }}>
      <div style={{ color: highlight ? "rgba(255,255,255,0.6)" : C.textLight, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
      <div style={{ color: valColor, fontSize: large ? 26 : 20, fontWeight: 700 }}>{fmt(value)}</div>
    </div>
  );
};

const OvrigKostnad = ({ items, onChange, period = "mån" }) => {
  const add = () => onChange([...items, { label: "", amount: 0 }]);
  const remove = i => onChange(items.filter((_, j) => j !== i));
  const update = (i, field, val) => onChange(items.map((item, j) => j === i ? { ...item, [field]: val } : item));
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input placeholder="Beskrivning" value={item.label} onChange={e => update(i, "label", e.target.value)}
            style={{ flex: 2, background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 6, color: C.text, padding: "9px 12px", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
          <div style={{ flex: 1, display: "flex", alignItems: "center", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
            <input type="number" placeholder="0" value={item.amount === 0 ? "" : item.amount} min={0} step={500} onChange={e => update(i, "amount", e.target.value === "" ? 0 : Number(e.target.value))}
              style={{ flex: 1, background: "transparent", border: "none", color: C.text, padding: "9px 8px", fontSize: 12, outline: "none", fontFamily: "inherit", minWidth: 0 }} />
            <span style={{ color: C.textLight, fontSize: 10, paddingRight: 8, whiteSpace: "nowrap" }}>kr/{period}</span>
          </div>
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
  { id: "skandia", name: "Skandia", color: "#9B182D", premiebefrielse: 1.51, sparpremie: 10,
    employees: [
      { sjuk: 745, pbf: 83, tjp: 5500, lo: 62, sjukvard: 300 },
      { sjuk: 522, pbf: 83, tjp: 5500, lo: 62, sjukvard: 300 },
      { sjuk: 0, pbf: 0, tjp: 0, lo: 0, sjukvard: 0 },
      { sjuk: 0, pbf: 0, tjp: 0, lo: 0, sjukvard: 0 },
      { sjuk: 0, pbf: 0, tjp: 0, lo: 0, sjukvard: 0 },
      { sjuk: 0, pbf: 0, tjp: 0, lo: 0, sjukvard: 0 },
    ]},
  { id: "lf", name: "Länsförsäkringar", color: "#E73331", premiebefrielse: 2.20, sparpremie: 10,
    employees: [
      { sjuk: 635, pbf: 121, tjp: 5500, lo: 78, sjukvard: 331 },
      { sjuk: 580, pbf: 121, tjp: 5500, lo: 78, sjukvard: 331 },
      { sjuk: 0, pbf: 0, tjp: 0, lo: 0, sjukvard: 0 },
      { sjuk: 0, pbf: 0, tjp: 0, lo: 0, sjukvard: 0 },
      { sjuk: 0, pbf: 0, tjp: 0, lo: 0, sjukvard: 0 },
      { sjuk: 0, pbf: 0, tjp: 0, lo: 0, sjukvard: 0 },
    ]},
  { id: "seb", name: "SEB", color: "#CEC09E", premiebefrielse: 2.10, sparpremie: 10,
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

// ── OFFERT VIEW ───────────────────────────────────────────────────────────────
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
      ...c,
      employees: c.employees.map((e, i) => i !== empIdx ? e : { ...e, [field]: Number(val) })
    }));
  };

  const updateCompany = (companyId, field, val) => {
    setCompanies(prev => prev.map(c => c.id !== companyId ? c : { ...c, [field]: Number(val) }));
  };

  const calcEmp = (company, empIdx) => {
    const e = company.employees[empIdx] || {};
    const arslön = employees[empIdx]?.arslön || 0;
    const tjp = Math.round(arslön * (company.sparpremie / 100) / 12);
    const pbf = Math.round((e.sjuk + tjp + e.lo + e.sjukvard) * (company.premiebefrielse / 100));
    return { sjuk: e.sjuk, lo: e.lo, sjukvard: e.sjukvard, tjp, pbf };
  };

  const calcTotals = (company) => {
    const empTotals = Array.from({ length: nActive }).map((_, i) => {
      const e = calcEmp(company, i);
      return e.sjuk + e.pbf + e.tjp + e.lo + e.sjukvard;
    });
    const groupTotal = empTotals.reduce((s, v) => s + v, 0);
    const colSums = COLS.reduce((acc, col) => {
      acc[col.key] = Array.from({ length: nActive }).reduce((s, _, i) => s + (calcEmp(company, i)[col.key] || 0), 0);
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

  const TinyInput = ({ value, onChange }) => (
    <input type="number" value={value === 0 || value === "" ? "" : value} placeholder="0" min={0} step={10} onChange={e => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
      style={{ width: "100%", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, padding: "4px 6px", fontSize: 11, fontFamily: "monospace", outline: "none", textAlign: "right" }} />
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", minHeight: "calc(100vh - 90px)" }}>
      <div style={{ padding: "20px 16px", borderRight: `1px solid ${C.border}`, overflowY: "auto" }}>
        <Section title="Anställda">
          {employees.map((emp, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 8, padding: "8px", background: i < nActive ? C.goldLight : C.surface2, borderRadius: 6, border: `1px solid ${i < nActive ? C.gold : C.border}`, minWidth: 0, overflow: "hidden" }}>
              <input placeholder={`Namn ${i+1}`} value={emp.namn} onChange={e => updateEmp(i, "namn", e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", minWidth: 0, background: "transparent", border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, padding: "6px 8px", fontSize: 11, outline: "none", fontFamily: "inherit" }} />
              <input placeholder="Personnr" value={emp.persnr} onChange={e => updateEmp(i, "persnr", e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", minWidth: 0, background: "transparent", border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, padding: "6px 8px", fontSize: 11, outline: "none", fontFamily: "inherit" }} />
              <div style={{ gridColumn: "1/-1", display: "flex", alignItems: "center", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, overflow: "hidden", minWidth: 0 }}>
                <input type="number" placeholder="Årslön" value={emp.arslön || ""} min={0} step={10000} onChange={e => updateEmp(i, "arslön", Number(e.target.value))}
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 11, padding: "6px 8px", fontFamily: "inherit", minWidth: 0, width: 0 }} />
                <span style={{ color: C.textLight, fontSize: 10, padding: "0 8px", borderLeft: `1px solid ${C.border}`, whiteSpace: "nowrap", flexShrink: 0 }}>kr/år</span>
              </div>
            </div>
          ))}
          <div style={{ color: C.textLight, fontSize: 10, textAlign: "center", marginTop: 4 }}>{nActive} aktiva anställda</div>
        </Section>

        <Section title="Bolagsinställningar">
          {companies.map(c => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: C.surface2, borderRadius: 6, border: `1px solid ${C.border}`, marginBottom: 6, minWidth: 0, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1, overflow: "hidden" }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: c.color, flexShrink: 0 }} />
                <span style={{ color: C.text, fontSize: 11, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: C.textLight, fontSize: 9, textTransform: "uppercase" }}>Prem.befr</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <input type="number" value={c.premiebefrielse} step={0.01} min={0} onChange={e => updateCompany(c.id, "premiebefrielse", e.target.value)}
                      style={{ width: 40, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 3, color: C.text, padding: "2px 4px", fontSize: 10, textAlign: "right", outline: "none", fontFamily: "inherit" }} />
                    <span style={{ color: C.textLight, fontSize: 9 }}>%</span>
                  </div>
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
            <div style={{ color: "#F9C5A5", fontSize: 16, fontWeight: 700, fontFamily: "monospace" }}>{fmt((worst?.groupTotal || 0) - (best?.groupTotal || 0))}/mån</div>
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
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "20px", marginBottom: 14, boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
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

            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 4px rgba(155,24,45,0.06)", marginBottom: 14 }}>
              <div style={{ background: C.navy, padding: "10px 16px", display: "grid", gridTemplateColumns: `140px repeat(${ranked.length}, 1fr)` }}>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>Komponent</div>
                {ranked.map(c => (
                  <div key={c.id} style={{ color: "#fff", fontSize: 10, fontWeight: 700, textAlign: "right" }}>{c.name}</div>
                ))}
              </div>
              {[...COLS, { key: "total", label: "TOTAL / MÅN" }].map((col, ri) => {
                const isTotal = col.key === "total";
                return (
                  <div key={col.key} style={{ display: "grid", gridTemplateColumns: `140px repeat(${ranked.length}, 1fr)`, padding: "9px 16px", background: isTotal ? C.navy : ri % 2 === 0 ? C.surface : C.surface2, borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ color: isTotal ? "rgba(255,255,255,0.7)" : C.textMid, fontSize: isTotal ? 11 : 12, fontWeight: isTotal ? 700 : 400 }}>{col.label}</span>
                    {ranked.map((c, ci) => {
                      const val = isTotal ? c.groupTotal : c.colSums[col.key];
                      const isMin = ranked.reduce((min, cc) => (isTotal ? cc.groupTotal : cc.colSums[col.key]) < (isTotal ? min.groupTotal : min.colSums[col.key]) ? cc : min, ranked[0]).id === c.id;
                      return (
                        <div key={c.id} style={{ textAlign: "right", color: isTotal ? (ci === 0 ? "#F9C5A5" : "rgba(255,255,255,0.7)") : isMin ? C.green : C.text, fontSize: 12, fontWeight: isTotal || isMin ? 700 : 400, fontFamily: "monospace" }}>
                          {fmt(val)}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
              <div style={{ background: C.navy, padding: "10px 16px", display: "grid", gridTemplateColumns: `140px repeat(${ranked.length}, 1fr)` }}>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>Anställd</div>
                {ranked.map(c => <div key={c.id} style={{ color: "#fff", fontSize: 10, fontWeight: 700, textAlign: "right" }}>{c.name}</div>)}
              </div>
              {activeEmps.map((emp, ei) => (
                <div key={ei} style={{ display: "grid", gridTemplateColumns: `140px repeat(${ranked.length}, 1fr)`, padding: "9px 16px", background: ei % 2 === 0 ? C.surface : C.surface2, borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ color: C.text, fontSize: 12 }}>{emp.namn || `Anställd ${ei+1}`}</span>
                  {ranked.map((c, ci) => {
                    const e = calcEmp(c, ei);
                    const total = e.sjuk + e.pbf + e.tjp + e.lo + e.sjukvard;
                    const isMin = ranked.reduce((min, cc) => {
                      const t = calcEmp(cc, ei);
                      const tv = t.sjuk + t.pbf + t.tjp + t.lo + t.sjukvard;
                      const mv = calcEmp(min, ei);
                      return tv < (mv.sjuk + mv.pbf + mv.tjp + mv.lo + mv.sjukvard) ? cc : min;
                    }, ranked[0]).id === c.id;
                    return <div key={c.id} style={{ textAlign: "right", color: isMin ? C.green : C.text, fontSize: 12, fontWeight: isMin ? 700 : 400, fontFamily: "monospace" }}>{fmt(total)}</div>;
                  })}
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: `140px repeat(${ranked.length}, 1fr)`, padding: "10px 16px", background: C.navy }}>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 700 }}>Summa grupp</span>
                {ranked.map((c, ci) => (
                  <div key={c.id} style={{ textAlign: "right", color: ci === 0 ? "#F9C5A5" : "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>{fmt(c.groupTotal)}</div>
                ))}
              </div>
            </div>
          </>
        )}

        {view === "detaljer" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {companies.map(c => (
                <button key={c.id} onClick={() => setSelectedCompany(c.id)} style={{
                  padding: "8px 16px", borderRadius: 5,
                  border: `1.5px solid ${selectedCompany === c.id ? c.color : C.border}`,
                  background: selectedCompany === c.id ? c.color : "transparent",
                  color: selectedCompany === c.id ? "#fff" : C.textMid,
                  fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6
                }}>{c.name}</button>
              ))}
            </div>

            {(() => {
              const comp = companies.find(c => c.id === selectedCompany);
              const totals = calcTotals(comp);
              return (
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
                  <div style={{ background: comp.color, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Redigera premier</div>
                      <div style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>{comp.name}</div>
                    </div>
                    <div style={{ display: "flex", gap: 16 }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10 }}>Premiebefrielse</div>
                        <div style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>{comp.premiebefrielse} %</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10 }}>Sparpremie</div>
                        <div style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>{comp.sparpremie} %</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "130px 100px 80px 80px 80px 100px 100px 90px", background: C.navy, padding: "8px 16px", gap: 4 }}>
                    {["Anställd", "Årslön", "Sjukförs.", "PBF", "TJP", "Liv & Olycka", "Sjukvård", "Total/mån"].map(h => (
                      <div key={h} style={{ color: "rgba(255,255,255,0.6)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", textAlign: h === "Anställd" || h === "Årslön" ? "left" : "right" }}>{h}</div>
                    ))}
                  </div>

                  {employees.map((emp, ei) => {
                    const ep = comp.employees[ei] || {};
                    const calc = calcEmp(comp, ei);
                    const total = calc.sjuk + calc.pbf + calc.tjp + calc.lo + calc.sjukvard;
                    const isActive = emp.namn || emp.arslön > 0;
                    return (
                      <div key={ei} style={{ display: "grid", gridTemplateColumns: "130px 100px 80px 80px 80px 100px 100px 90px", padding: "8px 16px", gap: 4, background: isActive ? (ei % 2 === 0 ? C.surface : C.surface2) : "#f8f9fb", borderBottom: `1px solid ${C.border}`, opacity: isActive ? 1 : 0.4 }}>
                        <div style={{ color: C.text, fontSize: 11, display: "flex", alignItems: "center" }}>{emp.namn || `—`}</div>
                        <div style={{ color: C.textMid, fontSize: 11, fontFamily: "monospace", display: "flex", alignItems: "center" }}>{emp.arslön ? fmt(emp.arslön) : "—"}</div>
                        {["sjuk","pbf","tjp","lo","sjukvard"].map(field => (
                          <div key={field} style={{ display: "flex", alignItems: "center" }}>
                            {isActive ? (
                              field === "tjp" || field === "pbf" ? (
                                <div style={{ width: "100%", textAlign: "right", fontSize: 11, fontFamily: "monospace", color: C.navy, fontWeight: 600, padding: "4px 6px", background: "#F0EDE6", border: `1px solid #E0D8CC`, borderRadius: 4 }} title={field === "tjp" ? `${comp.sparpremie}% av lön` : `${comp.premiebefrielse}% av premier`}>
                                  {fmt(calc[field])}
                                </div>
                              ) : (
                                <input type="number" value={ep[field] ? ep[field] : ""} placeholder="0" min={0} step={10} onChange={e => updatePremium(comp.id, ei, field, e.target.value === "" ? 0 : Number(e.target.value))}
                                  style={{ width: "100%", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, padding: "4px 6px", fontSize: 11, fontFamily: "monospace", outline: "none", textAlign: "right" }} />
                              )
                            ) : (
                              <span style={{ color: C.textLight, fontSize: 11, fontFamily: "monospace", textAlign: "right", width: "100%", display: "block" }}>—</span>
                            )}
                          </div>
                        ))}
                        <div style={{ color: isActive ? C.navy : C.textLight, fontSize: 12, fontWeight: 700, fontFamily: "monospace", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                          {isActive ? fmt(total) : "—"}
                        </div>
                      </div>
                    );
                  })}

                  <div style={{ display: "grid", gridTemplateColumns: "130px 100px 80px 80px 80px 100px 100px 90px", padding: "10px 16px", gap: 4, background: C.navy }}>
                    <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center" }}>Summa grupp</div>
                    <div />
                    {COLS.map(col => (
                      <div key={col.key} style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontFamily: "monospace", textAlign: "right", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>{fmt(totals.colSums[col.key])}</div>
                    ))}
                    <div style={{ color: "#F9C5A5", fontSize: 13, fontWeight: 700, fontFamily: "monospace", textAlign: "right", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>{fmt(totals.groupTotal)}</div>
                  </div>
                </div>
              );
            })()}
          </>
        )}
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
  let totalFee = engångsFee;
  let year1Fee = engångsFee;
  for (let y = 1; y <= år; y++) {
    for (let m = 0; m < 12; m++) {
      const premAvgift = löpandeMån * (provider.löpandePct / 100);
      capital += löpandeMån - premAvgift;
      totalFee += premAvgift;
      if (y === 1) year1Fee += premAvgift;
    }
    capital *= (1 + r);
    const kFee = capital * (provider.kapitalPct / 100);
    capital -= kFee;
    capital -= provider.fast;
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
        <input type="number" value={value === 0 ? "" : value} placeholder="0" min={0} step={0.01} onChange={e => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 15, fontWeight: 600, padding: "10px 12px", fontFamily: "inherit", minWidth: 0 }} />
        <span style={{ color: C.textLight, padding: "10px 12px", fontSize: 12, borderLeft: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>{suffix}</span>
      </div>
    </div>
  );
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(155,24,45,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: C.surface, borderRadius: 10, padding: "28px 28px 24px", width: 400, boxShadow: "0 8px 40px rgba(155,24,45,0.18)", border: `1px solid ${C.border}` }} onClick={e => e.stopPropagation()}>
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
        <div style={{ background: C.goldLight, border: `1px solid ${C.gold}`, borderRadius: 6, padding: "10px 14px", marginBottom: 20 }}>
          <div style={{ color: C.gold, fontSize: 11, lineHeight: 1.7 }}>
            <strong>Premieavgift</strong> dras på varje månatlig inbetalning.<br />
            <strong>Kapitalavgift</strong> dras årsvis på totalt ackumulerat kapital.
          </div>
        </div>
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
  const [befintligt, setBefintligt] = useState(0);
  const [år, setÅr] = useState(0);
  const [avkastning, setAvkastning] = useState(0);
  const [kategori, setKategori] = useState("fond");
  const [sortKey, setSortKey] = useState("totalFee");
  const [customOverrides, setCustomOverrides] = useState({});
  const [editingProvider, setEditingProvider] = useState(null);

  const inputs = { löpandeMån, engångs, befintligt, år, avkastning };
  const baseProviders = kategori === "fond" ? FOND_DEFAULT : TRAD_DEFAULT;
  const providers = useMemo(() => baseProviders.map(p => ({ ...p, ...(customOverrides[p.name] || {}), isCustom: !!customOverrides[p.name] })), [baseProviders, customOverrides]);
  const results = useMemo(() => providers.map(p => ({ ...p, ...calcProviderFees(p, inputs) })).sort((a, b) => a[sortKey] - b[sortKey]), [providers, löpandeMån, engångs, befintligt, år, avkastning, sortKey]);
  const best = results[0];
  const worst = results[results.length - 1];

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
                <span style={{ color: "#F9C5A5", fontSize: 12, fontWeight: 700 }}>{best.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Dyrast</span>
                <span style={{ color: "#FFB0B0", fontSize: 12, fontWeight: 700 }}>{worst.name}</span>
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
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "20px", marginBottom: 14, boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
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
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
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

// ── MARKNADSRÖRELSER ──────────────────────────────────────────────────────────
const MarknadsrorelseDiagram = () => {
  // Kvartalsvisa S&P 500-approximationer för mer detaljerade rörelser
  const kvartal = [
    // 1994
    {t:"1994 Q1",v:97.9},{t:"1994 Q2",v:95.4},{t:"1994 Q3",v:98.1},{t:"1994 Q4",v:101.3},
    // 1995
    {t:"1995 Q1",v:112.0},{t:"1995 Q2",v:121.4},{t:"1995 Q3",v:131.2},{t:"1995 Q4",v:139.0},
    // 1996
    {t:"1996 Q1",v:148.2},{t:"1996 Q2",v:145.6},{t:"1996 Q3",v:153.4},{t:"1996 Q4",v:171.1},
    // 1997
    {t:"1997 Q1",v:184.9},{t:"1997 Q2",v:205.7},{t:"1997 Q3",v:218.5},{t:"1997 Q4",v:228.2},
    // 1998
    {t:"1998 Q1",v:249.7},{t:"1998 Q2",v:258.1},{t:"1998 Q3",v:218.9},{t:"1998 Q4",v:293.5},
    // 1999
    {t:"1999 Q1",v:308.6},{t:"1999 Q2",v:316.4},{t:"1999 Q3",v:312.2},{t:"1999 Q4",v:355.4},
    // 2000 — IT-topp → krasch
    {t:"2000 Q1",v:371.8},{t:"2000 Q2",v:345.2},{t:"2000 Q3",v:330.8},{t:"2000 Q4",v:322.9},
    // 2001
    {t:"2001 Q1",v:300.5},{t:"2001 Q2",v:304.7},{t:"2001 Q3",v:269.1},{t:"2001 Q4",v:284.6},
    // 2002 — bottenkrasch
    {t:"2002 Q1",v:275.3},{t:"2002 Q2",v:248.1},{t:"2002 Q3",v:208.7},{t:"2002 Q4",v:221.8},
    // 2003 — återhämtning
    {t:"2003 Q1",v:211.4},{t:"2003 Q2",v:240.3},{t:"2003 Q3",v:260.8},{t:"2003 Q4",v:285.4},
    // 2004
    {t:"2004 Q1",v:289.7},{t:"2004 Q2",v:278.4},{t:"2004 Q3",v:283.1},{t:"2004 Q4",v:316.6},
    // 2005
    {t:"2005 Q1",v:314.9},{t:"2005 Q2",v:318.4},{t:"2005 Q3",v:326.7},{t:"2005 Q4",v:332.1},
    // 2006
    {t:"2006 Q1",v:347.4},{t:"2006 Q2",v:337.2},{t:"2006 Q3",v:348.6},{t:"2006 Q4",v:384.6},
    // 2007 — peak innan finanskris
    {t:"2007 Q1",v:395.8},{t:"2007 Q2",v:412.4},{t:"2007 Q3",v:406.1},{t:"2007 Q4",v:405.8},
    // 2008 — finanskris
    {t:"2008 Q1",v:368.2},{t:"2008 Q2",v:347.5},{t:"2008 Q3",v:301.4},{t:"2008 Q4",v:255.6},
    // 2009 — botten + återhämtning
    {t:"2009 Q1",v:210.4},{t:"2009 Q2",v:255.8},{t:"2009 Q3",v:283.6},{t:"2009 Q4",v:322.4},
    // 2010
    {t:"2010 Q1",v:338.2},{t:"2010 Q2",v:319.8},{t:"2010 Q3",v:347.4},{t:"2010 Q4",v:371.0},
    // 2011
    {t:"2011 Q1",v:383.4},{t:"2011 Q2",v:389.6},{t:"2011 Q3",v:336.2},{t:"2011 Q4",v:379.0},
    // 2012
    {t:"2012 Q1",v:406.8},{t:"2012 Q2",v:396.4},{t:"2012 Q3",v:414.2},{t:"2012 Q4",v:440.7},
    // 2013
    {t:"2013 Q1",v:469.3},{t:"2013 Q2",v:492.4},{t:"2013 Q3",v:523.6},{t:"2013 Q4",v:583.4},
    // 2014
    {t:"2014 Q1",v:581.2},{t:"2014 Q2",v:607.4},{t:"2014 Q3",v:615.8},{t:"2014 Q4",v:663.5},
    // 2015
    {t:"2015 Q1",v:672.4},{t:"2015 Q2",v:671.8},{t:"2015 Q3",v:622.1},{t:"2015 Q4",v:672.8},
    // 2016
    {t:"2016 Q1",v:648.3},{t:"2016 Q2",v:660.4},{t:"2016 Q3",v:683.6},{t:"2016 Q4",v:753.4},
    // 2017
    {t:"2017 Q1",v:793.6},{t:"2017 Q2",v:817.4},{t:"2017 Q3",v:848.2},{t:"2017 Q4",v:917.5},
    // 2018
    {t:"2018 Q1",v:881.4},{t:"2018 Q2",v:919.6},{t:"2018 Q3",v:963.8},{t:"2018 Q4",v:877.1},
    // 2019
    {t:"2019 Q1",v:956.3},{t:"2019 Q2",v:1008.4},{t:"2019 Q3",v:1022.6},{t:"2019 Q4",v:1153.7},
    // 2020 — COVID-krasch + återhämtning
    {t:"2020 Q1",v:944.2},{t:"2020 Q2",v:1063.8},{t:"2020 Q3",v:1168.4},{t:"2020 Q4",v:1365.6},
    // 2021
    {t:"2021 Q1",v:1447.3},{t:"2021 Q2",v:1528.6},{t:"2021 Q3",v:1601.4},{t:"2021 Q4",v:1757.2},
    // 2022 — inflation/räntechock
    {t:"2022 Q1",v:1692.4},{t:"2022 Q2",v:1453.8},{t:"2022 Q3",v:1362.1},{t:"2022 Q4",v:1439.6},
    // 2023
    {t:"2023 Q1",v:1521.4},{t:"2023 Q2",v:1587.2},{t:"2023 Q3",v:1534.8},{t:"2023 Q4",v:1817.3},
    // 2024
    {t:"2024 Q1",v:1953.4},{t:"2024 Q2",v:2019.6},{t:"2024 Q3",v:2103.8},{t:"2024 Q4",v:2240.4},
  ].filter(d => d.v > 0);

  const crisisZones = [
    { label: "IT-kraschen", startQ: "2000 Q1", endQ: "2002 Q4", color: "#EF4444", peak: "2000 Q1", trough: "2002 Q3" },
    { label: "Finanskrisen", startQ: "2007 Q3", endQ: "2009 Q1", color: "#DC2626", peak: "2007 Q2", trough: "2009 Q1" },
    { label: "COVID-19",     startQ: "2020 Q1", endQ: "2020 Q2", color: "#F97316", peak: "2019 Q4", trough: "2020 Q1" },
    { label: "2022 Räntehopp", startQ: "2022 Q1", endQ: "2022 Q3", color: "#7C3AED", peak: "2021 Q4", trough: "2022 Q3" },
  ];

  const W = 900, H = 300, PAD = { t: 28, r: 24, b: 40, l: 64 };
  const gW = W - PAD.l - PAD.r;
  const gH = H - PAD.t - PAD.b;
  const n = kvartal.length;

  const maxV = Math.max(...kvartal.map(d => d.v));
  const minV = Math.min(...kvartal.map(d => d.v)) * 0.92;
  const range = maxV - minV;

  const xPos = i => PAD.l + (i / (n - 1)) * gW;
  const yPos = v => PAD.t + gH - ((v - minV) / range) * gH;

  const linePath = kvartal.map((d, i) => `${i === 0 ? "M" : "L"}${xPos(i).toFixed(1)},${yPos(d.v).toFixed(1)}`).join(" ");
  const fillPath = linePath + ` L${xPos(n-1).toFixed(1)},${(PAD.t+gH).toFixed(1)} L${xPos(0).toFixed(1)},${(PAD.t+gH).toFixed(1)} Z`;

  // Rolling peak for drawdown shading
  let peak = kvartal[0].v;
  const withDrawdown = kvartal.map(d => {
    if (d.v > peak) peak = d.v;
    return { ...d, peak, drawdown: (d.v / peak - 1) * 100 };
  });

  // Drawdown fill path (red shade between peak and current)
  const ddPath = withDrawdown.map((d, i) => {
    const x = xPos(i).toFixed(1);
    const y = yPos(d.v).toFixed(1);
    const yPeak = yPos(d.peak).toFixed(1);
    return { x, y, yPeak, dd: d.drawdown };
  });

  // Year tick positions (first quarter of each year)
  const yearTicks = kvartal.reduce((acc, d, i) => {
    const yr = d.t.split(" ")[0];
    if (!acc.find(a => a.yr === yr)) acc.push({ yr, i });
    return acc;
  }, []);

  // Y-axis grid values
  const yTicks = [];
  const step = Math.ceil(range / 8 / 100) * 100;
  for (let v = Math.ceil(minV / step) * step; v <= maxV; v += step) yTicks.push(v);

  return (
    <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 10, padding: "20px 24px", marginTop: 20, boxShadow: "0 2px 8px rgba(155,24,45,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <div style={{ width: 3, height: 16, background: C.navy, borderRadius: 2 }} />
        <span style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Marknadsrörelser 1994–2024</span>
      </div>
      <div style={{ color: C.textMid, fontSize: 11, marginBottom: 16 }}>Globala aktier (S&P 500-liknande index), kvartalsdata. Röd skuggning = drawdown från senaste topp.</div>

      {/* Main line chart */}
      <div style={{ overflowX: "auto" }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", minWidth: 600 }}>
          <defs>
            <linearGradient id="fillGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.navy} stopOpacity="0.12" />
              <stop offset="100%" stopColor={C.navy} stopOpacity="0.01" />
            </linearGradient>
            <clipPath id="chartClip">
              <rect x={PAD.l} y={PAD.t} width={gW} height={gH} />
            </clipPath>
          </defs>

          {/* Y-axis gridlines */}
          {yTicks.map(v => {
            const y = yPos(v);
            if (y < PAD.t || y > PAD.t + gH) return null;
            return (
              <g key={v}>
                <line x1={PAD.l} x2={W - PAD.r} y1={y} y2={y} stroke="#F0EDE6" strokeWidth="0.7" />
                <text x={PAD.l - 7} y={y + 3.5} textAnchor="end" fill="#A87880" fontSize="8">{v >= 1000 ? (v/1000).toFixed(1)+"k" : v}</text>
              </g>
            );
          })}

          {/* Crisis zone shading */}
          {crisisZones.map(zone => {
            const si = kvartal.findIndex(d => d.t === zone.startQ);
            const ei = kvartal.findIndex(d => d.t === zone.endQ);
            if (si < 0 || ei < 0) return null;
            const x1 = xPos(si);
            const x2 = xPos(ei);
            return (
              <rect key={zone.label} x={x1} y={PAD.t} width={x2-x1} height={gH}
                fill={zone.color} opacity="0.07" clipPath="url(#chartClip)" />
            );
          })}

          {/* Drawdown red fill */}
          <g clipPath="url(#chartClip)">
            {ddPath.map((d, i) => {
              if (i === 0 || d.dd >= -1) return null;
              const prev = ddPath[i-1];
              return (
                <polygon key={i}
                  points={`${prev.x},${prev.yPeak} ${d.x},${d.yPeak} ${d.x},${d.y} ${prev.x},${prev.y}`}
                  fill="#EF4444" opacity="0.18" />
              );
            })}
          </g>

          {/* Area fill */}
          <path d={fillPath} fill="url(#fillGrad2)" clipPath="url(#chartClip)" />

          {/* Main line */}
          <path d={linePath} fill="none" stroke={C.navy} strokeWidth="1.8"
            strokeLinejoin="miter" strokeLinecap="square" clipPath="url(#chartClip)" />

          {/* Crisis zone labels */}
          {crisisZones.map(zone => {
            const si = kvartal.findIndex(d => d.t === zone.startQ);
            const ei = kvartal.findIndex(d => d.t === zone.endQ);
            if (si < 0 || ei < 0) return null;
            const midX = (xPos(si) + xPos(ei)) / 2;
            return (
              <text key={zone.label} x={midX} y={PAD.t + 14} textAnchor="middle"
                fill={zone.color} fontSize="8" fontWeight="700">{zone.label}</text>
            );
          })}

          {/* Data point dots — only yearly (every 4th quarter) */}
          {kvartal.map((d, i) => {
            if (i % 4 !== 0 && i !== n - 1) return null;
            const inCrisis = crisisZones.some(z => {
              const si = kvartal.findIndex(q => q.t === z.startQ);
              const ei = kvartal.findIndex(q => q.t === z.endQ);
              return i >= si && i <= ei;
            });
            return (
              <circle key={d.t} cx={xPos(i).toFixed(1)} cy={yPos(d.v).toFixed(1)} r="2.8"
                fill={inCrisis ? "#EF4444" : C.navy} stroke="#fff" strokeWidth="1.2" />
            );
          })}

          {/* Value labels at key turning points */}
          {[
            kvartal.findIndex(d => d.t === "2000 Q1"),
            kvartal.findIndex(d => d.t === "2002 Q3"),
            kvartal.findIndex(d => d.t === "2007 Q2"),
            kvartal.findIndex(d => d.t === "2009 Q1"),
            kvartal.findIndex(d => d.t === "2020 Q1"),
            n - 1,
          ].filter(i => i >= 0).map(i => {
            const d = kvartal[i];
            const x = xPos(i);
            const y = yPos(d.v);
            const above = i === kvartal.findIndex(q => q.t === "2000 Q1") || i === kvartal.findIndex(q => q.t === "2007 Q2") || i === n - 1;
            return (
              <g key={i}>
                <rect x={x - 14} y={above ? y - 18 : y + 4} width={28} height={12} rx={2}
                  fill={above ? C.navy : "#EF4444"} opacity="0.85" />
                <text x={x} y={above ? y - 8 : y + 13} textAnchor="middle"
                  fill="#fff" fontSize="7.5" fontWeight="700">
                  {d.v >= 1000 ? (d.v/1000).toFixed(1)+"k" : d.v.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* X-axis year labels */}
          {yearTicks.filter((_, i) => i % 2 === 0 || i === yearTicks.length - 1).map(({ yr, i }) => (
            <text key={yr} x={xPos(i)} y={H - 6} textAnchor="middle" fill="#A87880" fontSize="8">{yr}</text>
          ))}

          {/* X-axis baseline */}
          <line x1={PAD.l} x2={W - PAD.r} y1={PAD.t + gH} y2={PAD.t + gH} stroke="#E0D8CC" strokeWidth="1" />
        </svg>
      </div>

      {/* Bar chart: quarterly returns */}
      <div style={{ marginTop: 10 }}>
        <div style={{ color: "#A87880", fontSize: 9, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>Kvartalsvisa rörelser (%)</div>
        <div style={{ overflowX: "auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 1, height: 64, minWidth: 600, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: "50%", borderTop: `1px solid ${C.border}`, zIndex: 0 }} />
            {kvartal.map((d, i) => {
              if (i === 0) return <div key={d.t} style={{ flex: 1 }} />;
              const prev = kvartal[i - 1];
              const chg = (d.v / prev.v - 1) * 100;
              const maxAbs = 15;
              const barH = Math.min(Math.abs(chg), maxAbs) / maxAbs * 28;
              const isNeg = chg < 0;
              const inCrisis = crisisZones.some(z => {
                const si = kvartal.findIndex(q => q.t === z.startQ);
                const ei = kvartal.findIndex(q => q.t === z.endQ);
                return i >= si && i <= ei;
              });
              return (
                <div key={d.t} title={`${d.t}: ${chg.toFixed(1)}%`}
                  style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "center", position: "relative", zIndex: 1 }}>
                  {!isNeg && <div style={{ width: "100%", background: inCrisis ? "#F97316" : C.green, height: barH, borderRadius: "2px 2px 0 0", opacity: 0.85 }} />}
                  <div style={{ height: 1 }} />
                  {isNeg && <div style={{ width: "100%", background: "#EF4444", height: barH, borderRadius: "0 0 2px 2px", opacity: 0.85 }} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
        {[
          { color: C.navy, label: "Indexvärde (vänster)" },
          { color: "#EF4444", opacity: 0.3, label: "Drawdown från topp" },
          ...crisisZones.map(z => ({ color: z.color, opacity: 0.4, label: z.label })),
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color, opacity: l.opacity || 1 }} />
            <span style={{ color: "#A87880", fontSize: 10 }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── SPARANDE VIEW ─────────────────────────────────────────────────────────────
const SparandeView = ({ månSparande }) => {
  const [sparande, setSparande] = useState(månSparande || 10000);
  const [avkastning, setAvkastning] = useState(0);
  const [år, setÅr] = useState(0);
  const [engångs, setEngångs] = useState(0);
  const [useKF, setUseKF] = useState(!!månSparande);
  const [färgInsatt, setFärgInsatt] = useState("#9B182D");
  const [färgAvkastning, setFärgAvkastning] = useState("#E73331");
  const [vy, setVy] = useState("sparande"); // "sparande" | "jamfor"

  // Jämför-fonder — namn + avgift + 3 års historisk avkastning
  const [fonder, setFonder] = useState([
    { namn: "Länsförsäkringar Global Index", avgift: 0.20, avk1: 24.5, avk2: 18.3, avk3: 12.1 },
    { namn: "Avanza Global", avgift: 0.05, avk1: 25.1, avk2: 18.8, avk3: 12.4 },
    { namn: "Swedbank Robur Access Global", avgift: 0.19, avk1: 24.2, avk2: 18.0, avk3: 11.9 },
    { namn: "SEB Sverige Index", avgift: 0.15, avk1: 14.2, avk2: 8.5, avk3: 6.1 },
    { namn: "Aktiv förvaltad fond", avgift: 1.50, avk1: 20.0, avk2: 14.0, avk3: 9.0 },
  ]);
  const setFond = (i, field, val) => setFonder(prev => prev.map((f, j) => j === i ? { ...f, [field]: val } : f));
  const addFond = () => setFonder(prev => [...prev, { namn: `Fond ${prev.length + 1}`, avgift: 0.50, avk1: 10, avk2: 8, avk3: 6 }]);
  const removeFond = i => setFonder(prev => prev.filter((_, j) => j !== i));

  // Beräkna per fond — netto = snitt 3 år minus avgift, återupprepas cykliskt
  const jämförRows = useMemo(() => {
    return fonder.map(fond => {
      const årsAvk = [fond.avk1, fond.avk2, fond.avk3]; // brutto per år, cycling
      let kapital = engångs;
      const årsData = [];
      for (let y = 1; y <= (år || 20); y++) {
        const bruttoÅr = årsAvk[(y - 1) % 3];
        const nettoÅr = bruttoÅr - fond.avgift;
        const mRate = nettoÅr / 100 / 12;
        for (let m = 0; m < 12; m++) kapital = kapital * (1 + mRate) + sparande;
        const insatt = engångs + sparande * 12 * y;
        årsData.push({ y, kapital, insatt, avk: kapital - insatt, bruttoÅr, nettoÅr });
      }
      const final = årsData[årsData.length - 1] || {};
      const snittBrutto = ((fond.avk1 + fond.avk2 + fond.avk3) / 3);
      const nettoSnitt = snittBrutto - fond.avgift;
      return { ...fond, årsData, final, nettoSnitt, snittBrutto };
    });
  }, [fonder, sparande, engångs, år]);

  const rows = useMemo(() => {
    const mRate = avkastning / 100 / 12;
    let kapital = engångs;
    const data = [];
    for (let y = 1; y <= år; y++) {
      for (let m = 0; m < 12; m++) kapital = kapital * (1 + mRate) + sparande;
      const insatt = engångs + sparande * 12 * y;
      data.push({ y, kapital, insatt, avk: kapital - insatt });
    }
    return data;
  }, [sparande, avkastning, år, engångs]);

  const final = rows[rows.length - 1] || {};
  const maxVal = final.kapital || 1;
  const milestones = rows.filter(r => [1,2,3,5,7,10,15,20,25,30].includes(r.y));

  // Colors for comparison
  const FOND_COLORS = ["#9B182D", "#E73331", "#CEC09E", "#1A7A4A", "#6B3040", "#E08A3C", "#3A7BD5"];

  const JAMFOR_ÅR = år || 20;
  const maxJämförKap = jämförRows.length > 0
    ? Math.max(...jämförRows.map(f => f.final.kapital || 0))
    : 1;
  const bestFond = jämförRows.reduce((b, f) => (f.final.kapital || 0) > (b.final.kapital || 0) ? f : b, jämförRows[0] || {});
  const worstFond = jämförRows.reduce((b, f) => (f.final.kapital || 0) < (b.final.kapital || 0) ? f : b, jämförRows[0] || {});


  return (
    <div style={{ fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif" }}>
      {/* ── VY-TOGGLE ── */}
      <div style={{ display: "flex", gap: 8, padding: "12px 20px", background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        {[{ id: "sparande", label: "📈 Sparande & Avkastning" }, { id: "jamfor", label: "⚖️ Jämför fondavgifter" }].map(v => (
          <button key={v.id} onClick={() => setVy(v.id)}
            style={{ padding: "8px 18px", borderRadius: 7, border: `1.5px solid ${vy === v.id ? C.navy : C.border}`, background: vy === v.id ? C.navy : "transparent", color: vy === v.id ? "#fff" : C.textMid, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            {v.label}
          </button>
        ))}
      </div>

      {/* ── SPARANDE VY ── */}
      {vy === "sparande" && (
    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", minHeight: "calc(100vh - 130px)" }}>
      <div style={{ padding: "20px 16px", borderRight: `1px solid ${C.border}` }}>
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
              <input type="number" value={sparande} min={0} step={500} onChange={e => { setUseKF(false); setSparande(Number(e.target.value)); }} style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 14, fontWeight: 600, padding: "10px 12px", fontFamily: "inherit", minWidth: 0 }} />
              <span style={{ color: C.textLight, padding: "10px 10px", fontSize: 11, borderLeft: `1px solid ${C.border}`, whiteSpace: "nowrap", flexShrink: 0 }}>kr / mån</span>
            </div>
          </div>
          <InputRow label="Engångsinsättning" value={engångs} onChange={setEngångs} suffix="kr" step={10000} hint="Startkapital" />
          <InputRow label="Förväntad avkastning" value={avkastning} onChange={setAvkastning} suffix="% / år" step={0.5} min={0} max={30} />
          <InputRow label="Spartid" value={år} onChange={setÅr} suffix="år" step={1} min={1} max={40} />
        </Section>

        {/* Färgval */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>Diagramfärger</div>
          {[
            { label: "Insatt kapital", value: färgInsatt, onChange: setFärgInsatt },
            { label: "Avkastning", value: färgAvkastning, onChange: setFärgAvkastning },
          ].map(fc => (
            <div key={fc.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ color: C.textMid, fontSize: 12 }}>{fc.label}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: 5, background: fc.value, border: `1.5px solid ${C.border}`, cursor: "pointer", overflow: "hidden", position: "relative" }}>
                  <input type="color" value={fc.value} onChange={e => fc.onChange(e.target.value)}
                    style={{ position: "absolute", inset: -4, width: "calc(100% + 8px)", height: "calc(100% + 8px)", cursor: "pointer", border: "none", padding: 0, opacity: 0 }} />
                </div>
                <span style={{ color: C.textLight, fontSize: 10, fontFamily: "monospace" }}>{fc.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[{ l: "Totalt kapital", v: fmtShort(final.kapital || 0), big: true }, { l: "Totalavkastning", v: fmtShort(final.avk || 0) }, { l: "Totalt insatt", v: fmtShort(final.insatt || 0) }, { l: "Avkastning / år", v: fmtShort(((final.kapital||0)-(final.insatt||0))/år) }].map((k, i) => (
            <div key={i} style={{ background: i === 0 ? C.navy : C.surface, border: `1px solid ${i === 0 ? C.navy : C.border}`, borderRadius: 8, padding: "14px", gridColumn: i === 0 ? "1 / -1" : "auto" }}>
              <div style={{ color: i === 0 ? "rgba(255,255,255,0.55)" : C.textLight, fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 5 }}>{k.l}</div>
              <div style={{ color: i === 0 ? "#fff" : C.text, fontSize: i === 0 ? 26 : 18, fontWeight: 700 }}>{k.v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "20px 24px", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
          <span style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Kapitalutveckling över {år} år</span>
        </div>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "24px 20px 24px 80px", marginBottom: 16, boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 180, paddingBottom: 28, position: "relative" }}>
            {[0.25,0.5,0.75,1].map(f => (
              <div key={f} style={{ position: "absolute", left: -60, right: 0, bottom: 28 + f * 152, borderTop: `1px dashed ${C.border}`, zIndex: 0 }}>
                <span style={{ position: "absolute", left: 0, top: -8, color: C.textLight, fontSize: 9, whiteSpace: "nowrap", width: 56, textAlign: "right" }}>{fmtShort(maxVal * f)}</span>
              </div>
            ))}
            {rows.map((row, i) => {
              const totalH = (row.kapital / maxVal) * 152;
              const insattH = (row.insatt / maxVal) * 152;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end", position: "relative", zIndex: 1 }}>
                  <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                    <div style={{ background: färgAvkastning, height: totalH - insattH, borderRadius: "2px 2px 0 0", opacity: 0.85 }} />
                    <div style={{ background: färgInsatt, height: insattH, opacity: 0.7 }} />
                  </div>
                  {(row.y % (år <= 10 ? 1 : år <= 20 ? 2 : 5) === 0) && (
                    <div style={{ position: "absolute", bottom: -20, color: C.textLight, fontSize: 9 }}>År {row.y}</div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 8 }}>
            {[{ c: färgInsatt, l: "Insatt kapital" }, { c: färgAvkastning, l: "Avkastning" }].map(lg => (
              <div key={lg.l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 2, background: lg.c }} />
                <span style={{ color: C.textMid, fontSize: 11 }}>{lg.l}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr 1fr", background: C.navy, padding: "10px 16px" }}>
            {["År","Totalt kapital","Varav insatt","Varav avkastning"].map(h => (
              <div key={h} style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{h}</div>
            ))}
          </div>
          {milestones.map((row, i) => (
            <div key={row.y} style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr 1fr", padding: "10px 16px", background: i % 2 === 0 ? C.surface : C.surface2, borderBottom: `1px solid ${C.border}` }}>
              <div style={{ color: C.textMid, fontSize: 12, fontWeight: 700 }}>{row.y}</div>
              <div style={{ color: C.text, fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>{fmtShort(row.kapital)}</div>
              <div style={{ color: C.textMid, fontSize: 12, fontFamily: "monospace" }}>{fmtShort(row.insatt)}</div>
              <div style={{ color: C.green, fontSize: 12, fontWeight: 600, fontFamily: "monospace" }}>{fmtShort(row.avk)}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, background: C.goldLight, border: `1px solid ${C.gold}`, borderRadius: 8, padding: "14px 16px" }}>
          <div style={{ color: C.gold, fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>Avkastningsskatt — Företagsägd KF</div>
          <div style={{ color: C.textMid, fontSize: 11, lineHeight: 1.7 }}>
            Avkastning i en företagsägd KF beskattas med <strong>avkastningsskatt</strong>, beräknad som statslåneräntan (1 nov föregående år) + 1 procentenhet × 0,75 × KF-värdet. 2024 innebär detta ca <strong>1,3–1,9 % per år</strong> på hela kapitalvärdet — oavsett faktisk avkastning. Diagrammet visar bruttoavkastning. Avkastningsskatten ersätter bolagsskatt på avkastningen och är lägre än kapitalvinstskatt, vilket är KF:s skattemässiga fördel.
          </div>
        </div>
        <MarknadsrorelseDiagram />
      </div>
    </div>
      )}

      {/* ── JÄMFÖR VY ── */}
      {vy === "jamfor" && (
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", minHeight: "calc(100vh - 130px)" }}>

          {/* Vänster — inställningar */}
          <div style={{ padding: "20px 16px", borderRight: `1px solid ${C.border}`, overflowY: "auto" }}>
            <Section title="Sparparametrar">
              <InputRow label="Månatligt sparande" value={sparande} onChange={setSparande} suffix="kr / mån" step={500} />
              <InputRow label="Engångsinsättning" value={engångs} onChange={setEngångs} suffix="kr" step={10000} hint="Startkapital" />
              <InputRow label="Spartid" value={år || 20} onChange={v => setÅr(Math.max(1, Math.min(40, v)))} suffix="år" step={1} min={1} max={40} />

            </Section>

            <Section title="Fonder att jämföra">
              {fonder.map((fond, i) => (
                <div key={i} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: FOND_COLORS[i % FOND_COLORS.length], flexShrink: 0 }} />
                    <input value={fond.namn} onChange={e => setFond(i, "namn", e.target.value)}
                      style={{ flex: 1, background: "transparent", border: "none", borderBottom: `1px solid ${C.border}`, color: C.text, padding: "4px 0", fontSize: 12, fontWeight: 700, outline: "none", fontFamily: "inherit" }} />
                    <button onClick={() => removeFond(i)} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 4, color: C.textLight, cursor: "pointer", padding: "3px 7px", fontSize: 11 }}>✕</button>
                  </div>
                  {/* Avgift */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ color: C.textMid, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, width: 60, flexShrink: 0 }}>Avgift</span>
                    <div style={{ display: "flex", alignItems: "center", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 5, overflow: "hidden", flex: 1 }}>
                      <input type="number" value={fond.avgift} min={0} max={5} step={0.05}
                        onChange={e => setFond(i, "avgift", Number(e.target.value))}
                        style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 12, fontWeight: 600, padding: "5px 8px", fontFamily: "inherit" }} />
                      <span style={{ color: C.textLight, padding: "5px 8px", fontSize: 10, borderLeft: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>% / år</span>
                    </div>
                  </div>
                  {/* 3 års avkastning */}
                  <div style={{ color: C.textMid, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>Historisk avkastning (brutto)</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                    {[{label:"År 1", field:"avk1"},{label:"År 2", field:"avk2"},{label:"År 3", field:"avk3"}].map(({label, field}) => (
                      <div key={field}>
                        <div style={{ color: C.textLight, fontSize: 9, marginBottom: 3 }}>{label}</div>
                        <div style={{ display: "flex", alignItems: "center", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 5, overflow: "hidden" }}>
                          <input type="number" value={fond[field]} min={-50} max={100} step={0.5}
                            onChange={e => setFond(i, field, Number(e.target.value))}
                            style={{ flex: 1, minWidth: 0, width: 0, background: "transparent", border: "none", outline: "none", color: fond[field] >= 0 ? C.green : C.red, fontSize: 11, fontWeight: 600, padding: "5px 6px", fontFamily: "inherit" }} />
                          <span style={{ color: C.textLight, padding: "5px 5px", fontSize: 9, borderLeft: `1px solid ${C.border}`, flexShrink: 0 }}>%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: C.textLight, fontSize: 10 }}>Snitt brutto</span>
                    <span style={{ color: C.green, fontSize: 11, fontWeight: 700 }}>{((fond.avk1+fond.avk2+fond.avk3)/3).toFixed(1).replace(".",",")} %</span>
                    <span style={{ color: C.textLight, fontSize: 10 }}>Snitt netto</span>
                    <span style={{ color: C.navy, fontSize: 11, fontWeight: 700 }}>{(((fond.avk1+fond.avk2+fond.avk3)/3)-fond.avgift).toFixed(1).replace(".",",")} %</span>
                  </div>
                </div>
              ))}
              {fonder.length < 7 && (
                <button onClick={addFond} style={{ width: "100%", padding: "8px", background: C.goldLight, border: `1.5px dashed ${C.gold}`, borderRadius: 6, color: C.gold, cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit" }}>+ Lägg till fond</button>
              )}
            </Section>
          </div>

          {/* Höger — resultat */}
          <div style={{ padding: "20px 24px", overflowY: "auto" }}>

            {/* Sammanfattning */}
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(fonder.length, 4)}, 1fr)`, gap: 10, marginBottom: 20 }}>
              {jämförRows.map((fond, i) => {
                const isBest = fond.namn === bestFond?.namn;
                const isWorst = fond.namn === worstFond?.namn && fonder.length > 1;
                return (
                  <div key={i} style={{ background: isBest ? C.navy : C.surface, border: `1px solid ${isBest ? C.navy : C.border}`, borderRadius: 8, padding: "14px 16px", boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: FOND_COLORS[i % FOND_COLORS.length] }} />
                      <div style={{ color: isBest ? "rgba(255,255,255,0.7)" : C.textLight, fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fond.namn}</div>
                    </div>
                    <div style={{ color: isBest ? "#F9C5A5" : isWorst ? C.red : C.navy, fontSize: 16, fontWeight: 800, fontFamily: "monospace" }}>{fmt(fond.final.kapital || 0)}</div>
                    <div style={{ color: isBest ? "rgba(255,255,255,0.5)" : C.textLight, fontSize: 10, marginTop: 2 }}>{fond.avgift.toFixed(2).replace(".", ",")} % avgift · netto {fond.nettoSnitt.toFixed(2).replace(".", ",")} %</div>
                    {isBest && fonder.length > 1 && <div style={{ marginTop: 6, background: C.gold, borderRadius: 4, padding: "2px 8px", display: "inline-block", color: "#fff", fontSize: 9, fontWeight: 700 }}>BÄST</div>}
                    {isWorst && fonder.length > 1 && <div style={{ marginTop: 6, background: "#FEE2E2", borderRadius: 4, padding: "2px 8px", display: "inline-block", color: C.red, fontSize: 9, fontWeight: 700 }}>DYRAST</div>}
                  </div>
                );
              })}
            </div>

            {/* Besparing */}
            {fonder.length > 1 && bestFond?.final?.kapital && worstFond?.final?.kapital && (
              <div style={{ background: C.navy, borderRadius: 8, padding: "14px 20px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Skillnad billigast vs dyrast efter {JAMFOR_ÅR} år</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>{bestFond.namn} vs {worstFond.namn}</div>
                </div>
                <div style={{ color: "#F9C5A5", fontSize: 24, fontWeight: 800, fontFamily: "monospace" }}>{fmt((bestFond.final.kapital || 0) - (worstFond.final.kapital || 0))}</div>
              </div>
            )}

            {/* Linjediagram */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "20px 24px", marginBottom: 20, boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
                <span style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Kapitalutveckling — {JAMFOR_ÅR} år</span>
              </div>
              {(() => {
                const VW = 800, VH = 220, PAD_L = 72, PAD_B = 22, PAD_T = 16;
                const plotW = VW - PAD_L - 8, plotH = VH - PAD_B - PAD_T;
                const maxKap = Math.max(...jämförRows.map(f => Math.max(...f.årsData.map(r => r.kapital))), 1);
                const toY = v => PAD_T + plotH - (v / maxKap) * plotH;
                const gap = plotW / JAMFOR_ÅR;
                return (
                  <svg width="100%" viewBox={`0 0 ${VW} ${VH}`} style={{ display: "block" }}>
                    {[0, 0.25, 0.5, 0.75, 1].map(frac => {
                      const val = frac * maxKap;
                      const y = toY(val);
                      return (
                        <g key={frac}>
                          <line x1={PAD_L} y1={y} x2={VW - 8} y2={y} stroke={C.border} strokeWidth={0.6} strokeDasharray="3,5" />
                          <text x={PAD_L - 5} y={y + 3.5} textAnchor="end" fontSize={8} fill={C.textLight} fontFamily="inherit">{fmtShort(val)}</text>
                        </g>
                      );
                    })}
                    {jämförRows.map((fond, fi) => (
                      <polyline key={fi} fill="none" stroke={FOND_COLORS[fi % FOND_COLORS.length]} strokeWidth={fi === 0 ? 2.5 : 1.8} opacity={0.9}
                        points={fond.årsData.map((r, i) => `${PAD_L + i * gap + gap / 2},${toY(r.kapital)}`).join(" ")} />
                    ))}
                    {jämförRows.map((fond, fi) => {
                      const last = fond.årsData[fond.årsData.length - 1];
                      if (!last) return null;
                      const cx = PAD_L + (fond.årsData.length - 1) * gap + gap / 2;
                      return <circle key={fi} cx={cx} cy={toY(last.kapital)} r={3} fill={FOND_COLORS[fi % FOND_COLORS.length]} stroke="#fff" strokeWidth={1.2} />;
                    })}
                    {jämförRows[0]?.årsData.filter((_, i) => (i + 1) % 5 === 0 || i === 0).map((r, i) => {
                      const cx = PAD_L + r.y * gap - gap / 2;
                      return <text key={i} x={cx} y={VH - 6} textAnchor="middle" fontSize={7.5} fill={C.textLight} fontFamily="inherit">{r.y}</text>;
                    })}
                  </svg>
                );
              })()}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 8 }}>
                {jämförRows.map((fond, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 20, height: 2.5, background: FOND_COLORS[i % FOND_COLORS.length], borderRadius: 2 }} />
                    <span style={{ fontSize: 10, color: C.textLight }}>{fond.namn} ({fond.avgift.toFixed(2).replace(".", ",")} %)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Avgiftstabell */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "20px 24px", boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
                <span style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Detaljerad jämförelse</span>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: C.navy }}>
                    {["Fond", "Avgift / år", "Nettoavk.", `Kapital år ${JAMFOR_ÅR}`, "Avkastning", "Avgiftskostnad*"].map(h => (
                      <th key={h} style={{ padding: "8px 12px", color: "#fff", fontWeight: 700, textAlign: h === "Fond" ? "left" : "right", fontSize: 11, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {jämförRows
                    .map((fond, i) => ({ ...fond, origIdx: i }))
                    .sort((a, b) => (b.final.kapital || 0) - (a.final.kapital || 0))
                    .map((fond, rank) => {
                      const isBest = rank === 0 && fonder.length > 1;
                      const insattTotal = engångs + sparande * 12 * JAMFOR_ÅR;
                      // Avgiftskostnad: skill mot noll-avgift men med samma bruttosekvens
                      const avgiftKostnad = (() => {
                        const årsAvk = [fond.avk1, fond.avk2, fond.avk3];
                        let kap = engångs;
                        for (let y = 1; y <= JAMFOR_ÅR; y++) {
                          const bruttoÅr = årsAvk[(y-1)%3];
                          const mRate = bruttoÅr / 100 / 12;
                          for (let m = 0; m < 12; m++) kap = kap * (1 + mRate) + sparande;
                        }
                        return kap - (fond.final.kapital || 0);
                      })();
                      return (
                        <tr key={fond.origIdx} style={{ background: isBest ? "#FFF0F0" : rank % 2 === 0 ? C.surface : C.surface2 }}>
                          <td style={{ padding: "9px 12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                              <div style={{ width: 8, height: 8, borderRadius: 2, background: FOND_COLORS[fond.origIdx % FOND_COLORS.length] }} />
                              <span style={{ color: C.text, fontWeight: isBest ? 700 : 400 }}>{fond.namn}</span>
                              {isBest && <span style={{ background: C.navy, color: "#fff", fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 3 }}>BÄST</span>}
                            </div>
                          </td>
                          <td style={{ padding: "9px 12px", textAlign: "right", color: fond.avgift > 1 ? C.red : C.text, fontFamily: "monospace" }}>{fond.avgift.toFixed(2).replace(".", ",")} %</td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: C.green }}>{fond.nettoSnitt.toFixed(2).replace(".", ",")} %</td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, fontFamily: "monospace", color: isBest ? C.green : C.text }}>{fmt(fond.final.kapital || 0)}</td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: C.green }}>{fmt(fond.final.avk || 0)}</td>
                          <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: C.red }}>−{fmt(avgiftKostnad)}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              <div style={{ color: C.textLight, fontSize: 10, marginTop: 8, fontStyle: "italic" }}>* Avgiftskostnad = skillnad mot 0 % avgift med samma bruttoavkastning</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── LIKVIDITETSANALYS ─────────────────────────────────────────────────────────
const LikviditetsanalysView = ({ r, utdelning, buffertPct, buffertMode, buffertKr }) => {
  const [tillväxt, setTillväxt] = useState(0);
  const [år, setÅr] = useState(5);

  const rows = useMemo(() => {
    const res = [];
    for (let y = 1; y <= år; y++) {
      const faktor = Math.pow(1 + tillväxt / 100, y - 1);
      const omsättning = r.omsättning * faktor;
      const kostnader = (r.lönTotal + r.pensionTotal + r.övrigaSum) * faktor;
      const ebit = omsättning - kostnader;
      const bolagsskatt = Math.max(0, ebit) * 0.206;
      const resultat = ebit - bolagsskatt;
      const utd = Math.min(utdelning, Math.max(0, resultat));
      const buffert = y === 1
        ? (buffertMode === "pct" ? Math.max(0, ebit) * (buffertPct / 100) : buffertKr)
        : 0;
      const kfSparande = resultat - utd - buffert;
      res.push({ y, omsättning, kostnader, ebit, bolagsskatt, resultat, utd, buffert, kfSparande });
    }
    return res;
  }, [r, utdelning, buffertPct, buffertMode, buffertKr, tillväxt, år]);

  const colStyle = (val, highlight) => ({
    padding: "11px 14px", fontSize: 12, fontFamily: "monospace", fontWeight: highlight ? 700 : 400,
    color: val < 0 ? C.red : highlight ? C.gold : C.text, textAlign: "right", whiteSpace: "nowrap"
  });
  const hdr = { padding: "10px 14px", fontSize: 10, fontWeight: 700, letterSpacing: 1.2,
    textTransform: "uppercase", color: "rgba(255,255,255,0.6)", textAlign: "right", whiteSpace: "nowrap" };
  const hdrL = { ...hdr, textAlign: "left" };

  const cols = [
    { label: "År", key: "y", left: true, plain: true },
    { label: "Omsättning", key: "omsättning" },
    { label: "Kostnader", key: "kostnader", neg: true },
    { label: "Resultat före skatt", key: "ebit" },
    { label: "Bolagsskatt", key: "bolagsskatt", neg: true },
    { label: "Res. efter skatt", key: "resultat" },
    { label: "Utdelning", key: "utd", neg: true },
    { label: "Buffert (år 1)", key: "buffert", neg: true },
    { label: "KF-sparande", key: "kfSparande", highlight: true },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <div style={{ width: 3, height: 20, background: C.gold, borderRadius: 2 }} />
        <div>
          <div style={{ color: C.gold, fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Flerårsöversikt</div>
          <div style={{ color: C.navy, fontSize: 16, fontWeight: 700 }}>Likviditetsanalys</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24, maxWidth: 480 }}>
        <div>
          <label style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Antal år</label>
          <div style={{ display: "flex", alignItems: "center", background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
            <input type="number" value={år === 0 ? "" : år} placeholder="5" min={1} max={20} step={1}
              onChange={e => setÅr(e.target.value === "" ? 0 : Math.max(1, Math.min(20, Number(e.target.value))))}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 14, fontWeight: 600, padding: "9px 12px", fontFamily: "inherit" }} />
            <span style={{ color: C.textLight, padding: "9px 12px", fontSize: 12, borderLeft: `1px solid ${C.border}` }}>år</span>
          </div>
        </div>
        <div>
          <label style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Omsättningstillväxt</label>
          <div style={{ display: "flex", alignItems: "center", background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
            <input type="number" value={tillväxt === 0 ? "" : tillväxt} placeholder="0" min={-20} max={50} step={1}
              onChange={e => setTillväxt(e.target.value === "" ? 0 : Number(e.target.value))}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 14, fontWeight: 600, padding: "9px 12px", fontFamily: "inherit" }} />
            <span style={{ color: C.textLight, padding: "9px 12px", fontSize: 12, borderLeft: `1px solid ${C.border}` }}>% / år</span>
          </div>
        </div>
      </div>

      {/* Info buffert */}
      <div style={{ background: C.goldLight, border: `1px solid ${C.gold}`, borderRadius: 8, padding: "12px 16px", marginBottom: 20 }}>
        <div style={{ color: C.textMid, fontSize: 11, lineHeight: 1.7 }}>
          <strong style={{ color: C.navy }}>Likviditetsbuffert</strong> byggs upp år 1 och finansieras ur bolagets resultat efter skatt. Från år 2 är bufferten redan finansierad — hela överskottet (efter utdelning) är disponibelt för KF-inbetalning eller återinvestering.
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(155,24,45,0.07)" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 780 }}>
          <thead>
            <tr style={{ background: C.navy }}>
              {cols.map(col => (
                <th key={col.key} style={col.left ? hdrL : hdr}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.y} style={{ background: i % 2 === 0 ? "#fff" : C.surface, borderBottom: `1px solid ${C.border}` }}>
                {cols.map(col => {
                  if (col.plain) return (
                    <td key={col.key} style={{ padding: "11px 14px", fontSize: 12, fontWeight: 700, color: C.navy }}>
                      {row.y === 1 ? "År 1" : `År ${row.y}`}
                    </td>
                  );
                  const val = row[col.key];
                  const display = col.neg ? (val > 0 ? `−${fmt(val)}` : "—") : fmt(val);
                  return (
                    <td key={col.key} style={colStyle(col.neg ? -val : val, col.highlight)}>
                      {col.key === "buffert" && row.y > 1 ? <span style={{ color: C.textLight, fontSize: 11 }}>finansierad</span> : display}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          {/* Totals row */}
          <tfoot>
            <tr style={{ background: C.navy, borderTop: `2px solid ${C.gold}` }}>
              <td style={{ padding: "12px 14px", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1 }}>Totalt</td>
              {cols.slice(1).map(col => {
                const total = rows.reduce((s, row) => s + (row[col.key] || 0), 0);
                return (
                  <td key={col.key} style={{ padding: "12px 14px", fontSize: 12, fontFamily: "monospace", fontWeight: 700, textAlign: "right",
                    color: col.highlight ? C.gold : total < 0 ? "#f87171" : "rgba(255,255,255,0.85)" }}>
                    {fmt(total)}
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* KF-sparande summary */}
      {rows.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 20 }}>
          {[
            { label: "KF-sparande år 1", value: rows[0].kfSparande, sub: "inkl. buffertuppbyggnad" },
            { label: `KF-sparande år 2${rows.length > 2 ? "+" : ""}`, value: rows.length > 1 ? rows[1].kfSparande : 0, sub: "buffert redan finansierad" },
            { label: `Totalt KF ${år} år`, value: rows.reduce((s, r) => s + r.kfSparande, 0), sub: "kumulativt", highlight: true },
          ].map(card => (
            <div key={card.label} style={{ background: card.highlight ? C.goldLight : "#fff", border: `1px solid ${card.highlight ? C.gold : C.border}`, borderRadius: 8, padding: "16px 18px" }}>
              <div style={{ color: C.textLight, fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>{card.label}</div>
              <div style={{ color: card.highlight ? C.gold : card.value < 0 ? C.red : C.navy, fontSize: 20, fontWeight: 700, fontFamily: "monospace", marginBottom: 4 }}>{fmt(card.value)}</div>
              <div style={{ color: C.textLight, fontSize: 11 }}>{card.sub}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── MAIN APP ──────────────────────────────────────────────────────────────────
// ── ÄRENDEN VIEW ──────────────────────────────────────────────────────────────
const FInput = ({ label, value, onChange, placeholder, half, type = "text" }) => (
  <div style={{ marginBottom: 14, flex: half ? "0 0 calc(50% - 6px)" : "1 1 100%" }}>
    <label style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 5 }}>{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || ""}
      style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", border: `1.5px solid ${C.border}`, borderRadius: 6, fontSize: 13, color: C.text, outline: "none", fontFamily: "inherit", background: "#fff" }} />
  </div>
);

const FTextarea = ({ label, value, onChange, rows = 3 }) => (
  <div style={{ marginBottom: 14, flex: "1 1 100%" }}>
    <label style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 5 }}>{label}</label>
    <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows}
      style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", border: `1.5px solid ${C.border}`, borderRadius: 6, fontSize: 13, color: C.text, outline: "none", fontFamily: "inherit", background: "#fff", resize: "vertical" }} />
  </div>
);

const FSect = ({ title, children }) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <div style={{ width: 3, height: 14, background: C.gold, borderRadius: 2 }} />
      <span style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>{title}</span>
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>{children}</div>
  </div>
);

// ─── LÖNESUMMA / 3:12 ────────────────────────────────────────────────────────
const IBB_2026 = 80600;
const GRUNDBELOPP_IBB = 4;    // 4 IBB per bolag
const LONEAVDRAG_IBB = 8;     // 8 IBB avdrag per delägare
const MAX_LONEUTRYMME_FAKTOR = 50; // max 50x ägarens lön

const LönesummaView = () => {
  const [antalDelägare, setAntalDelägare] = useState(1);
  const [totLönesumma, setTotLönesumma] = useState(0);
  const [delägare, setDelägare] = useState([
    { namn: "Delägare 1", ägarandel: 100, egnLön: 0, sparat: 0, omkostnad: 0, make: false }
  ]);
  const [förenklad, setFörenklad] = useState(true);

  const setDelField = (i, field, val) => setDelägare(prev => prev.map((d, j) => j === i ? { ...d, [field]: val } : d));

  // Sync antal delägare with array
  const syncAntal = (n) => {
    setAntalDelägare(n);
    setDelägare(prev => {
      const next = [...prev];
      while (next.length < n) next.push({ namn: `Delägare ${next.length + 1}`, ägarandel: 0, egnLön: 0, sparat: 0, omkostnad: 0, make: false });
      return next.slice(0, n);
    });
  };

  const grundbeloppTotal = GRUNDBELOPP_IBB * IBB_2026; // 322 400 kr per bolag

  // Beräkna per delägare
  const beräkningar = useMemo(() => {
    return delägare.map((d, i) => {
      const ägarPct = d.ägarandel / 100;
      // Grundbelopp: 4 IBB × ägarandel
      const grundbelopp = grundbeloppTotal * ägarPct;

      // Lönebaserat utrymme: (lönesumma × ägarandel − 8 IBB) × 0,5
      const löneunderlagAndel = totLönesumma * ägarPct;
      const löneavdrag = LONEAVDRAG_IBB * IBB_2026; // 644 800 kr
      const lönebasRaw = (löneunderlagAndel - löneavdrag) * 0.5;
      // Max 50x ägarens egen lön
      const maxLönebaserat = d.egnLön * MAX_LONEUTRYMME_FAKTOR;
      const lönebaseratUtrymme = Math.max(0, Math.min(lönebasRaw, maxLönebaserat));

      // Sparat utdelningsutrymme förs vidare till nominellt värde
      const sparatUtrymme = d.sparat || 0;

      // Totalt gränsbelopp
      const gränsbelopp = grundbelopp + lönebaseratUtrymme + sparatUtrymme;

      // Skatteeffekt på utdelning inom gränsbelopp: 2/3 × 30% = 20%
      const skattInomGräns = gränsbelopp * (2 / 3) * 0.30;

      return {
        grundbelopp,
        löneunderlagAndel,
        löneavdrag,
        lönebasRaw,
        lönebaseratUtrymme,
        sparatUtrymme,
        gränsbelopp,
        skattInomGräns,
        maxLönebaserat,
        begränsadAvLön: lönebasRaw > maxLönebaserat && maxLönebaserat > 0,
      };
    });
  }, [delägare, totLönesumma, grundbeloppTotal]);

  const totÄgarandel = delägare.reduce((s, d) => s + (d.ägarandel || 0), 0);
  const ägarandelOk = Math.abs(totÄgarandel - 100) < 0.01;

  const SektionRubrik = ({ title }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
      <h3 style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: 0 }}>{title}</h3>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif", background: C.bg, minHeight: "calc(100vh - 130px)" }}>

      {/* Toggle bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 32px", background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <button onClick={() => setFörenklad(v => !v)}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 16px", borderRadius: 7, border: `1.5px solid ${förenklad ? C.gold : C.border}`, background: förenklad ? C.goldLight : C.surface, color: förenklad ? C.gold : C.textMid, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          <span>{förenklad ? "⚙️" : "✨"}</span>
          {förenklad ? "Avancerad vy" : "Förenklad vy"}
        </button>
        <span style={{ color: C.textLight, fontSize: 12 }}>
          {förenklad ? "Visar förenklad vy — tryck för att se beräkningsdetaljer" : "Visar avancerad vy med fullständig beräkningsstegstabell"}
        </span>
      </div>

      <div style={{ padding: "28px 32px" }}>
      {/* Info banner */}
      <div style={{ background: "#FFF0F0", border: "1px solid #F5C5C5", borderRadius: 8, padding: "12px 18px", marginBottom: 24, display: "flex", gap: 16, alignItems: "flex-start" }}>
        <span style={{ fontSize: 16 }}>ℹ️</span>
        <div style={{ color: "#7A1020", fontSize: 12, lineHeight: 1.7 }}>
          <strong>Nya 3:12-regler fr.o.m. inkomstår 2026 (K10 deklaration 2027).</strong> Gränsbeloppet beräknas enligt en gemensam modell: Grundbelopp (4 IBB × ägarandel) + Lönebaserat utrymme + Sparat utdelningsutrymme. Löneuttagskravet och 4%-kapitalandelskravet är avskaffade. IBB 2026 = {fmt(IBB_2026)}.
        </div>
      </div>

      {/* ── FÖRENKLAD VY ── */}
      {förenklad && (
        <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 24 }}>
          {/* Vänster input */}
          <div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "18px 20px", marginBottom: 14, boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
              <SektionRubrik title="Bolagets lönesumma" />
              <InputRow label="Total kontant ersättning föregående år" value={totLönesumma} onChange={setTotLönesumma} suffix="kr / år" step={50000} hint="Alla anställda inkl. ägare" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
                <InfoChip label="Löneavdrag (8 IBB)" value={fmt(LONEAVDRAG_IBB * IBB_2026)} />
                <InfoChip label="Grundbelopp (4 IBB)" value={fmt(grundbeloppTotal)} />
              </div>
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "18px 20px", boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
              <SektionRubrik title="Delägare" />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.surface2, borderRadius: 7, padding: "10px 14px", marginBottom: 16 }}>
                <span style={{ color: C.textMid, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>Antal delägare</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => syncAntal(Math.max(1, antalDelägare - 1))} style={{ width: 28, height: 28, borderRadius: 6, border: `1.5px solid ${C.border}`, background: C.surface, color: C.navy, fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>−</button>
                  <span style={{ color: C.navy, fontSize: 16, fontWeight: 800, minWidth: 20, textAlign: "center" }}>{antalDelägare}</span>
                  <button onClick={() => syncAntal(Math.min(10, antalDelägare + 1))} style={{ width: 28, height: 28, borderRadius: 6, border: `1.5px solid ${C.border}`, background: C.surface, color: C.navy, fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>+</button>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, padding: "8px 12px", borderRadius: 6, background: ägarandelOk ? "#FFF0F0" : "#FEF2F2", border: `1px solid ${ägarandelOk ? "#F5C5C5" : "#FECACA"}` }}>
                <span style={{ fontSize: 11, color: ägarandelOk ? C.green : C.red, fontWeight: 600 }}>Totala ägarandel</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: ägarandelOk ? C.green : C.red, fontFamily: "monospace" }}>{totÄgarandel.toFixed(1)} %</span>
              </div>
              {delägare.map((d, i) => (
                <div key={i} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", marginBottom: 10 }}>
                  <input value={d.namn} onChange={e => setDelField(i, "namn", e.target.value)}
                    style={{ fontSize: 12, fontWeight: 700, color: C.navy, background: "transparent", border: "none", outline: "none", fontFamily: "inherit", display: "block", marginBottom: 10, width: "100%" }} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, minWidth: 0 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: C.textMid, fontSize: 10, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.6 }}>Ägarandel %</div>
                      <div style={{ display: "flex", alignItems: "center", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
                        <input type="number" value={d.ägarandel === 0 ? "" : d.ägarandel} placeholder="0" min={0} max={100} step={1} onChange={e => setDelField(i, "ägarandel", e.target.value === "" ? 0 : Number(e.target.value))}
                          style={{ flex: 1, minWidth: 0, width: 0, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 13, fontWeight: 600, padding: "8px 10px", fontFamily: "inherit" }} />
                        <span style={{ color: C.textLight, padding: "8px 8px", fontSize: 11, borderLeft: `1px solid ${C.border}`, flexShrink: 0 }}>%</span>
                      </div>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: C.textMid, fontSize: 10, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.6 }}>Egen lön / år</div>
                      <div style={{ display: "flex", alignItems: "center", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
                        <input type="number" value={d.egnLön === 0 ? "" : d.egnLön} placeholder="0" min={0} step={10000} onChange={e => setDelField(i, "egnLön", e.target.value === "" ? 0 : Number(e.target.value))}
                          style={{ flex: 1, minWidth: 0, width: 0, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 13, fontWeight: 600, padding: "8px 10px", fontFamily: "inherit" }} />
                        <span style={{ color: C.textLight, padding: "8px 8px", fontSize: 11, borderLeft: `1px solid ${C.border}`, flexShrink: 0 }}>kr</span>
                      </div>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: C.textMid, fontSize: 10, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.6 }}>Sparat utrymme</div>
                      <div style={{ display: "flex", alignItems: "center", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
                        <input type="number" value={d.sparat === 0 ? "" : d.sparat} placeholder="0" min={0} step={10000} onChange={e => setDelField(i, "sparat", e.target.value === "" ? 0 : Number(e.target.value))}
                          style={{ flex: 1, minWidth: 0, width: 0, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 13, fontWeight: 600, padding: "8px 10px", fontFamily: "inherit" }} />
                        <span style={{ color: C.textLight, padding: "8px 8px", fontSize: 11, borderLeft: `1px solid ${C.border}`, flexShrink: 0 }}>kr</span>
                      </div>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: C.textMid, fontSize: 10, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.6 }}>Omkostnadsbelopp</div>
                      <div style={{ display: "flex", alignItems: "center", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
                        <input type="number" value={d.omkostnad === 0 ? "" : d.omkostnad} placeholder="0" min={0} step={10000} onChange={e => setDelField(i, "omkostnad", e.target.value === "" ? 0 : Number(e.target.value))}
                          style={{ flex: 1, minWidth: 0, width: 0, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 13, fontWeight: 600, padding: "8px 10px", fontFamily: "inherit" }} />
                        <span style={{ color: C.textLight, padding: "8px 8px", fontSize: 11, borderLeft: `1px solid ${C.border}`, flexShrink: 0 }}>kr</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Höger — förenklat resultat per delägare */}
          <div>
            {beräkningar.map((b, i) => {
              const d = delägare[i];
              return (
                <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "20px 24px", marginBottom: 16, boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 3, height: 20, background: C.gold, borderRadius: 2 }} />
                      <div>
                        <div style={{ color: C.navy, fontSize: 14, fontWeight: 700 }}>{d.namn}</div>
                        <div style={{ color: C.textLight, fontSize: 11 }}>{d.ägarandel} % ägare{d.make ? " · Make/maka" : ""}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: C.textLight, fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>Gränsbelopp</div>
                      <div style={{ color: C.navy, fontSize: 22, fontWeight: 800, fontFamily: "monospace" }}>{fmt(b.gränsbelopp)}</div>
                    </div>
                  </div>
                  {/* Tre delar */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                    <div style={{ background: "#FFF0F0", border: "1px solid #86EFAC", borderRadius: 7, padding: "12px 14px" }}>
                      <div style={{ color: "#7A1020", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 }}>Grundbelopp</div>
                      <div style={{ color: "#7A1020", fontSize: 15, fontWeight: 800, fontFamily: "monospace" }}>{fmt(b.grundbelopp)}</div>
                      <div style={{ color: "#E5A0A0", fontSize: 10, marginTop: 2 }}>4 IBB × {d.ägarandel} %</div>
                    </div>
                    <div style={{ background: b.lönebaseratUtrymme > 0 ? "#FFF0F0" : C.surface2, border: `1px solid ${b.lönebaseratUtrymme > 0 ? "#E5A0A0" : C.border}`, borderRadius: 7, padding: "12px 14px" }}>
                      <div style={{ color: b.lönebaseratUtrymme > 0 ? "#7A1020" : C.textLight, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 }}>Lönebaserat</div>
                      <div style={{ color: b.lönebaseratUtrymme > 0 ? "#7A1020" : C.textLight, fontSize: 15, fontWeight: 800, fontFamily: "monospace" }}>{fmt(b.lönebaseratUtrymme)}</div>
                      <div style={{ color: C.textLight, fontSize: 10, marginTop: 2 }}>{b.begränsadAvLön ? "⚠ Begränsat av 50×-tak" : totLönesumma === 0 ? "Ange lönesumma" : b.lönebasRaw <= 0 ? "Under löneavdrag" : "(lön × andel − 8 IBB) × 50%"}</div>
                    </div>
                    <div style={{ background: b.sparatUtrymme > 0 ? "#FFF8EC" : C.surface2, border: `1px solid ${b.sparatUtrymme > 0 ? C.gold : C.border}`, borderRadius: 7, padding: "12px 14px" }}>
                      <div style={{ color: b.sparatUtrymme > 0 ? C.gold : C.textLight, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 }}>Sparat</div>
                      <div style={{ color: b.sparatUtrymme > 0 ? C.gold : C.textLight, fontSize: 15, fontWeight: 800, fontFamily: "monospace" }}>{fmt(b.sparatUtrymme)}</div>
                      <div style={{ color: C.textLight, fontSize: 10, marginTop: 2 }}>Nominellt värde</div>
                    </div>
                  </div>
                  {/* Skatt */}
                  <div style={{ background: C.navy, borderRadius: 7, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>Skatt inom gränsbelopp</div>
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, marginTop: 2 }}>2/3 × 30 % = 20 % effektivt</div>
                    </div>
                    <div style={{ color: "#F9C5A5", fontSize: 18, fontWeight: 800, fontFamily: "monospace" }}>{fmt(b.skattInomGräns)}</div>
                  </div>
                  {b.begränsadAvLön && (
                    <div style={{ marginTop: 10, background: "#FFF5F0", border: "1px solid #FCD34D", borderRadius: 6, padding: "8px 12px", color: "#7A1020", fontSize: 11 }}>
                      ⚠ Lönebaserat utrymme begränsat till 50× din lön ({fmt(b.maxLönebaserat)}). Höj din lön för att öka utrymmet.
                    </div>
                  )}
                </div>
              );
            })}
            {beräkningar.length > 1 && (
              <div style={{ background: C.navy, borderRadius: 8, padding: "18px 24px" }}>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Summering — alla delägare</div>
                {beräkningar.map((b, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < beräkningar.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>{delägare[i].namn} ({delägare[i].ägarandel} %)</span>
                    <span style={{ color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "monospace" }}>{fmt(b.gränsbelopp)}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, marginTop: 6 }}>
                  <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 700 }}>Totalt gränsbelopp</span>
                  <span style={{ color: "#F9C5A5", fontSize: 16, fontWeight: 800, fontFamily: "monospace" }}>{fmt(beräkningar.reduce((s, b) => s + b.gränsbelopp, 0))}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── AVANCERAD VY ── */}
      {!förenklad && (
      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 24 }}>

        {/* ── VÄNSTER ── */}
        <div>
          {/* Bolagets lönesumma */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "18px 20px", marginBottom: 14, boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
            <SektionRubrik title="Bolagets lönesumma" />
            <InputRow label="Total kontant ersättning föregående år" value={totLönesumma} onChange={setTotLönesumma} suffix="kr / år" step={50000} hint="Alla anställda inkl. ägare" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
              <InfoChip label="Löneavdrag (8 IBB)" value={fmt(LONEAVDRAG_IBB * IBB_2026)} />
              <InfoChip label="Grundbelopp (4 IBB)" value={fmt(grundbeloppTotal)} />
            </div>
          </div>

          {/* Antal delägare */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "18px 20px", marginBottom: 14, boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
            <SektionRubrik title="Delägare" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.surface2, borderRadius: 7, padding: "10px 14px", marginBottom: 16 }}>
              <span style={{ color: C.textMid, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>Antal delägare</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => syncAntal(Math.max(1, antalDelägare - 1))} style={{ width: 28, height: 28, borderRadius: 6, border: `1.5px solid ${C.border}`, background: C.surface, color: C.navy, fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>−</button>
                <span style={{ color: C.navy, fontSize: 16, fontWeight: 800, minWidth: 20, textAlign: "center" }}>{antalDelägare}</span>
                <button onClick={() => syncAntal(Math.min(10, antalDelägare + 1))} style={{ width: 28, height: 28, borderRadius: 6, border: `1.5px solid ${C.border}`, background: C.surface, color: C.navy, fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>+</button>
              </div>
            </div>

            {/* Ägarandelsvalidering */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, padding: "8px 12px", borderRadius: 6, background: ägarandelOk ? "#FFF0F0" : "#FEF2F2", border: `1px solid ${ägarandelOk ? "#F5C5C5" : "#FECACA"}` }}>
              <span style={{ fontSize: 11, color: ägarandelOk ? C.green : C.red, fontWeight: 600 }}>Totala ägarandel</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: ägarandelOk ? C.green : C.red, fontFamily: "monospace" }}>{totÄgarandel.toFixed(1)} %</span>
            </div>

            {/* Per delägare */}
            {delägare.map((d, i) => (
              <div key={i} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 16px", marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <input value={d.namn} onChange={e => setDelField(i, "namn", e.target.value)}
                    style={{ fontSize: 12, fontWeight: 700, color: C.navy, background: "transparent", border: "none", outline: "none", fontFamily: "inherit", flex: 1 }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 10, color: C.textLight }}>Make/maka</span>
                    <button onClick={() => setDelField(i, "make", !d.make)} style={{ width: 22, height: 22, borderRadius: 4, border: `1.5px solid ${d.make ? C.navy : C.border}`, background: d.make ? C.navy : "transparent", color: "#fff", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{d.make ? "✓" : ""}</button>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, minWidth: 0 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: C.textMid, fontSize: 10, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.6 }}>Ägarandel %</div>
                    <div style={{ display: "flex", alignItems: "center", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
                      <input type="number" value={d.ägarandel === 0 ? "" : d.ägarandel} placeholder="0" min={0} max={100} step={1} onChange={e => setDelField(i, "ägarandel", e.target.value === "" ? 0 : Number(e.target.value))}
                        style={{ flex: 1, minWidth: 0, width: 0, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 13, fontWeight: 600, padding: "8px 10px", fontFamily: "inherit" }} />
                      <span style={{ color: C.textLight, padding: "8px 8px", fontSize: 11, borderLeft: `1px solid ${C.border}`, flexShrink: 0 }}>%</span>
                    </div>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: C.textMid, fontSize: 10, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.6 }}>Egen lön / år</div>
                    <div style={{ display: "flex", alignItems: "center", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
                      <input type="number" value={d.egnLön === 0 ? "" : d.egnLön} placeholder="0" min={0} step={10000} onChange={e => setDelField(i, "egnLön", e.target.value === "" ? 0 : Number(e.target.value))}
                        style={{ flex: 1, minWidth: 0, width: 0, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 13, fontWeight: 600, padding: "8px 10px", fontFamily: "inherit" }} />
                      <span style={{ color: C.textLight, padding: "8px 8px", fontSize: 11, borderLeft: `1px solid ${C.border}`, flexShrink: 0 }}>kr</span>
                    </div>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: C.textMid, fontSize: 10, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.6 }}>Sparat utrymme</div>
                    <div style={{ display: "flex", alignItems: "center", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
                      <input type="number" value={d.sparat === 0 ? "" : d.sparat} placeholder="0" min={0} step={10000} onChange={e => setDelField(i, "sparat", e.target.value === "" ? 0 : Number(e.target.value))}
                        style={{ flex: 1, minWidth: 0, width: 0, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 13, fontWeight: 600, padding: "8px 10px", fontFamily: "inherit" }} />
                      <span style={{ color: C.textLight, padding: "8px 8px", fontSize: 11, borderLeft: `1px solid ${C.border}`, flexShrink: 0 }}>kr</span>
                    </div>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: C.textMid, fontSize: 10, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.6 }}>Omkostnadsbelopp</div>
                    <div style={{ display: "flex", alignItems: "center", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
                      <input type="number" value={d.omkostnad === 0 ? "" : d.omkostnad} placeholder="0" min={0} step={10000} onChange={e => setDelField(i, "omkostnad", e.target.value === "" ? 0 : Number(e.target.value))}
                        style={{ flex: 1, minWidth: 0, width: 0, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 13, fontWeight: 600, padding: "8px 10px", fontFamily: "inherit" }} />
                      <span style={{ color: C.textLight, padding: "8px 8px", fontSize: 11, borderLeft: `1px solid ${C.border}`, flexShrink: 0 }}>kr</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── HÖGER ── */}
        <div>
          {beräkningar.map((b, i) => {
            const d = delägare[i];
            return (
              <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "20px 24px", marginBottom: 16, boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
                {/* Rubrik */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 3, height: 20, background: C.gold, borderRadius: 2 }} />
                    <div>
                      <div style={{ color: C.navy, fontSize: 14, fontWeight: 700 }}>{d.namn}</div>
                      <div style={{ color: C.textLight, fontSize: 11 }}>{d.ägarandel} % ägare{d.make ? " · Make/maka" : ""}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: C.textLight, fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>Gränsbelopp</div>
                    <div style={{ color: C.navy, fontSize: 22, fontWeight: 800, fontFamily: "monospace" }}>{fmt(b.gränsbelopp)}</div>
                  </div>
                </div>

                {/* Beräkningssteg */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  {/* Grundbelopp */}
                  <div style={{ background: "#FFF0F0", border: "1px solid #86EFAC", borderRadius: 7, padding: "12px 14px" }}>
                    <div style={{ color: "#7A1020", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>① Grundbelopp</div>
                    <div style={{ color: "#7A1020", fontSize: 16, fontWeight: 800, fontFamily: "monospace" }}>{fmt(b.grundbelopp)}</div>
                    <div style={{ color: "#E5A0A0", fontSize: 10, marginTop: 2 }}>4 IBB × {d.ägarandel} %</div>
                  </div>

                  {/* Lönebaserat */}
                  <div style={{ background: b.lönebaseratUtrymme > 0 ? "#FFF0F0" : C.surface2, border: `1px solid ${b.lönebaseratUtrymme > 0 ? "#E5A0A0" : C.border}`, borderRadius: 7, padding: "12px 14px" }}>
                    <div style={{ color: b.lönebaseratUtrymme > 0 ? "#7A1020" : C.textLight, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>② Lönebaserat utrymme</div>
                    <div style={{ color: b.lönebaseratUtrymme > 0 ? "#7A1020" : C.textLight, fontSize: 16, fontWeight: 800, fontFamily: "monospace" }}>{fmt(b.lönebaseratUtrymme)}</div>
                    <div style={{ color: C.textLight, fontSize: 10, marginTop: 2 }}>
                      {totLönesumma === 0 ? "Ange lönesumma" : b.lönebasRaw <= 0 ? `Löneunderlag (${fmt(b.löneunderlagAndel)}) < löneavdrag` : b.begränsadAvLön ? `Begränsat av max lön (50× ${fmt(d.egnLön)})` : `(${fmt(b.löneunderlagAndel)} − 8 IBB) × 50 %`}
                    </div>
                  </div>

                  {/* Sparat */}
                  <div style={{ background: b.sparatUtrymme > 0 ? "#FFF8EC" : C.surface2, border: `1px solid ${b.sparatUtrymme > 0 ? C.gold : C.border}`, borderRadius: 7, padding: "12px 14px" }}>
                    <div style={{ color: b.sparatUtrymme > 0 ? C.gold : C.textLight, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>③ Sparat utrymme</div>
                    <div style={{ color: b.sparatUtrymme > 0 ? C.gold : C.textLight, fontSize: 16, fontWeight: 800, fontFamily: "monospace" }}>{fmt(b.sparatUtrymme)}</div>
                    <div style={{ color: C.textLight, fontSize: 10, marginTop: 2 }}>Förs vidare nominellt</div>
                  </div>

                  {/* Skatteeffekt */}
                  <div style={{ background: C.navy, borderRadius: 7, padding: "12px 14px" }}>
                    <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Skatt inom gränsbelopp</div>
                    <div style={{ color: "#F9C5A5", fontSize: 16, fontWeight: 800, fontFamily: "monospace" }}>{fmt(b.skattInomGräns)}</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, marginTop: 2 }}>2/3 × 30 % = 20 % effektivt</div>
                  </div>
                </div>

                {/* Beräkningssteg detail */}
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                  <div style={{ color: C.textLight, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Beräkningsdetaljer</div>
                  {[
                    { label: "Lönesumma bolaget", value: fmt(totLönesumma) },
                    { label: `Andel av lönesumma (${d.ägarandel} %)`, value: fmt(b.löneunderlagAndel) },
                    { label: "− Löneavdrag (8 IBB = 644 800 kr)", value: `−${fmt(b.löneavdrag)}` },
                    { label: "× 50 % = lönebaserat råvärde", value: fmt(Math.max(0, b.lönebasRaw)) },
                    ...(b.begränsadAvLön ? [{ label: `⚠ Begränsat av 50× egen lön`, value: fmt(b.maxLönebaserat), warn: true }] : []),
                    { label: "Grundbelopp (4 IBB × ägarandel)", value: fmt(b.grundbelopp) },
                    { label: "Sparat utdelningsutrymme", value: fmt(b.sparatUtrymme) },
                  ].map((row, j) => (
                    <div key={j} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: j < 6 ? `1px solid ${C.border}` : "none" }}>
                      <span style={{ color: row.warn ? "#C04020" : C.textMid, fontSize: 11 }}>{row.label}</span>
                      <span style={{ color: row.warn ? "#C04020" : C.text, fontSize: 11, fontWeight: 600, fontFamily: "monospace" }}>{row.value}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0", marginTop: 4 }}>
                    <span style={{ color: C.navy, fontSize: 12, fontWeight: 700 }}>= Totalt gränsbelopp</span>
                    <span style={{ color: C.navy, fontSize: 14, fontWeight: 800, fontFamily: "monospace" }}>{fmt(b.gränsbelopp)}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Sammanfattning */}
          {beräkningar.length > 1 && (
            <div style={{ background: C.navy, borderRadius: 8, padding: "18px 24px" }}>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Summering — alla delägare</div>
              {beräkningar.map((b, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < beräkningar.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>{delägare[i].namn} ({delägare[i].ägarandel} %)</span>
                  <span style={{ color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "monospace" }}>{fmt(b.gränsbelopp)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, marginTop: 6 }}>
                <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 700 }}>Totalt gränsbelopp</span>
                <span style={{ color: "#F9C5A5", fontSize: 16, fontWeight: 800, fontFamily: "monospace" }}>{fmt(beräkningar.reduce((s, b) => s + b.gränsbelopp, 0))}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      )}
      </div>
    </div>
  );
};

// ─── TRAD & FOND ─────────────────────────────────────────────────────────────
const TradFondView = () => {
  const [totalKapital, setTotalKapital] = useState(10000000);
  const [tradPct, setTradPct] = useState(50);
  const fondPct = 100 - tradPct;
  const [år, setÅr] = useState(10);

  // TRAD parametrar
  const [tradRänta, setTradRänta] = useState(6.0);
  const [tradAvgift, setTradAvgift] = useState(0.40);
  const [tradFastAvgift, setTradFastAvgift] = useState(0);

  // Fond parametrar
  const [fondAvkastning, setFondAvkastning] = useState(8.0);
  const [fondAvgift, setFondAvgift] = useState(0.80);

  const tradKapital = totalKapital * (tradPct / 100);
  const fondKapital = totalKapital * (fondPct / 100);

  const rows = useMemo(() => {
    const res = [];
    let tKap = tradKapital;
    let fKap = fondKapital;
    for (let y = 1; y <= år; y++) {
      // TRAD: avkastning appliceras sedan avgift dras
      const tAvk = tKap * (tradRänta / 100);
      const tKap31 = tKap + tAvk;
      const tAvgift = tKap31 * (tradAvgift / 100) + tradFastAvgift;
      const tKapEfter = tKap31 - tAvgift;

      // Fond: avkastning minus avgift (avgift på ingående kapital)
      const fAvgiftKr = fKap * (fondAvgift / 100);
      const fNettoAvk = fKap * ((fondAvkastning - fondAvgift) / 100);
      const fKapEfter = fKap + fNettoAvk;

      const totalt = tKapEfter + fKapEfter;
      res.push({ y, tKap: tKapEfter, fKap: fKapEfter, totalt, tAvk, fNettoAvk, tAvgift, fAvgiftKr });
      tKap = tKapEfter;
      fKap = fKapEfter;
    }
    return res;
  }, [tradKapital, fondKapital, år, tradRänta, tradAvgift, tradFastAvgift, fondAvkastning, fondAvgift]);

  const slutKapital = rows.length > 0 ? rows[rows.length - 1].totalt : totalKapital;
  const totalAvk = slutKapital - totalKapital;
  const totalAvgifter = rows.reduce((s, r) => s + r.tAvgift + r.fAvgiftKr, 0);
  const maxTot = rows.length > 0 ? Math.max(...rows.map(r => r.totalt)) : 1;

  const [TRAD_COLOR, setTradColor] = useState("#9B182D");
  const [FOND_COLOR, setFondColor] = useState("#CEC09E");

  const SektionRubrik = ({ title, color = C.gold }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div style={{ width: 3, height: 16, background: color, borderRadius: 2 }} />
      <h3 style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: 0 }}>{title}</h3>
    </div>
  );

  return (
    <div style={{ padding: "28px 32px", fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif", background: C.bg, minHeight: "calc(100vh - 130px)" }}>

      {/* Sammanfattningskort */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
        {[
          { label: `Totalt kapital år ${år}`, value: fmt(slutKapital), color: C.navy },
          { label: "Total avkastning (netto)", value: fmt(totalAvk), color: C.green },
          { label: `TRAD (${tradPct} %)`, value: rows.length > 0 ? fmt(rows[rows.length-1].tKap) : fmt(tradKapital), color: TRAD_COLOR },
          { label: `Fond (${fondPct} %)`, value: rows.length > 0 ? fmt(rows[rows.length-1].fKap) : fmt(fondKapital), color: FOND_COLOR },
        ].map((card, i) => (
          <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "16px 18px", boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
            <div style={{ color: C.textLight, fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 }}>{card.label}</div>
            <div style={{ color: card.color, fontSize: 18, fontWeight: 800, fontFamily: "monospace" }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24 }}>

        {/* ── VÄNSTER ── */}
        <div>
          {/* Totalkapital & fördelning */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "18px 20px", marginBottom: 14, boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
            <SektionRubrik title="Kapital & fördelning" />
            <InputRow label="Totalt kapital" value={totalKapital} onChange={setTotalKapital} suffix="kr" step={100000} />
            <InputRow label="Antal år" value={år} onChange={v => setÅr(Math.max(1, Math.min(30, v)))} suffix="år" step={1} min={1} max={30} />
            <div style={{ marginTop: 8 }}>
              <div style={{ color: C.textMid, fontSize: 11, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>Fördelning TRAD / Fond</div>
              <input type="range" min={0} max={100} step={5} value={tradPct} onChange={e => setTradPct(Number(e.target.value))}
                style={{ width: "100%", accentColor: TRAD_COLOR, marginBottom: 10 }} />
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: tradPct, background: TRAD_COLOR, borderRadius: 4, padding: "8px 0", textAlign: "center", color: "#fff", fontSize: 12, fontWeight: 700, minWidth: 28, transition: "flex 0.2s" }}>{tradPct}%</div>
                <div style={{ flex: fondPct, background: FOND_COLOR, borderRadius: 4, padding: "8px 0", textAlign: "center", color: "#fff", fontSize: 12, fontWeight: 700, minWidth: 28, transition: "flex 0.2s" }}>{fondPct}%</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ color: TRAD_COLOR, fontSize: 11, fontWeight: 600 }}>TRAD: {fmt(tradKapital)}</span>
                <span style={{ color: FOND_COLOR, fontSize: 11, fontWeight: 600 }}>Fond: {fmt(fondKapital)}</span>
              </div>
            </div>
          </div>

          {/* TRAD parametrar */}
          <div style={{ background: C.surface, border: `1.5px solid ${TRAD_COLOR}22`, borderRadius: 8, padding: "18px 20px", marginBottom: 14, boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 3, height: 16, background: TRAD_COLOR, borderRadius: 2 }} />
                <h3 style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: 0 }}>Traditionell förvaltning</h3>
              </div>
              <input type="color" value={TRAD_COLOR} onChange={e => setTradColor(e.target.value)}
                style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${C.border}`, padding: 2, cursor: "pointer", background: "none" }} />
            </div>
            <InputRow label="Återbäringsränta" value={tradRänta} onChange={setTradRänta} suffix="% / år" step={0.1} min={0} max={30} />
            <InputRow label="Kapitalavgift" value={tradAvgift} onChange={setTradAvgift} suffix="% / år" step={0.05} min={0} max={5} hint="Ord 0,80%" />
            <InputRow label="Fast avgift / år" value={tradFastAvgift} onChange={setTradFastAvgift} suffix="kr" step={100} min={0} />
            <div style={{ background: `${TRAD_COLOR}12`, border: `1px solid ${TRAD_COLOR}33`, borderRadius: 6, padding: "8px 12px", display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: TRAD_COLOR, fontSize: 11, fontWeight: 700 }}>Nettoavkastning</span>
              <span style={{ color: TRAD_COLOR, fontSize: 13, fontWeight: 800 }}>{(tradRänta - tradAvgift).toFixed(2).replace(".", ",")} %</span>
            </div>
          </div>

          {/* Fond parametrar */}
          <div style={{ background: C.surface, border: `1.5px solid ${FOND_COLOR}22`, borderRadius: 8, padding: "18px 20px", boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 3, height: 16, background: FOND_COLOR, borderRadius: 2 }} />
                <h3 style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: 0 }}>Fondförvaltning</h3>
              </div>
              <input type="color" value={FOND_COLOR} onChange={e => setFondColor(e.target.value)}
                style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${C.border}`, padding: 2, cursor: "pointer", background: "none" }} />
            </div>
            <InputRow label="Förväntad avkastning" value={fondAvkastning} onChange={setFondAvkastning} suffix="% / år" step={0.5} min={0} max={30} />
            <InputRow label="Förvaltningsavgift" value={fondAvgift} onChange={setFondAvgift} suffix="% / år" step={0.05} min={0} max={5} hint="TER / löpande avgift" />
            <div style={{ background: `${FOND_COLOR}12`, border: `1px solid ${FOND_COLOR}33`, borderRadius: 6, padding: "8px 12px", display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: FOND_COLOR, fontSize: 11, fontWeight: 700 }}>Nettoavkastning</span>
              <span style={{ color: FOND_COLOR, fontSize: 13, fontWeight: 800 }}>{(fondAvkastning - fondAvgift).toFixed(2).replace(".", ",")} %</span>
            </div>
          </div>
        </div>

        {/* ── HÖGER ── */}
        <div>
          {/* Kumulativt diagram */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "20px 24px", marginBottom: 20, boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
                <span style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Kumulativ kapitalutveckling</span>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                {[
                  { color: TRAD_COLOR, label: "TRAD", bar: true },
                  { color: FOND_COLOR, label: "Fond", bar: true },
                  { color: C.navy, label: "Totalt (linje)", bar: false },
                ].map((l, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    {l.bar
                      ? <div style={{ width: 12, height: 12, background: l.color, opacity: 0.6, borderRadius: 2 }} />
                      : <div style={{ width: 20, height: 2.5, background: l.color, borderRadius: 2 }} />}
                    <span style={{ fontSize: 10, color: C.textLight }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            {(() => {
              const [hovered, setHovered] = useState(null);
              const VW = 800, VH = 240, PAD_L = 68, PAD_B = 22, PAD_T = 16;
              const plotW = VW - PAD_L - 8, plotH = VH - PAD_B - PAD_T;
              const n = rows.length;
              if (n === 0) return null;
              const minVal = 0;
              const range = Math.max(1, maxTot - minVal);
              const toY = v => PAD_T + plotH - ((v - minVal) / range) * plotH;
              const gap = plotW / n;
              const barW = Math.max(10, Math.min(40, gap * 0.6));
              return (
                <div style={{ position: "relative" }}>
                  <svg width="100%" viewBox={`0 0 ${VW} ${VH}`} style={{ display: "block" }}>
                    {/* Gridlines */}
                    {[0, 0.25, 0.5, 0.75, 1].map(frac => {
                      const val = minVal + frac * range;
                      const y = toY(val);
                      return (
                        <g key={frac}>
                          <line x1={PAD_L} y1={y} x2={VW - 8} y2={y} stroke={C.border} strokeWidth={0.6} strokeDasharray="3,5" />
                          <text x={PAD_L - 5} y={y + 3.5} textAnchor="end" fontSize={8} fill={C.textLight} fontFamily="inherit">{fmtShort(val)}</text>
                        </g>
                      );
                    })}
                    {/* Staplade staplar */}
                    {rows.map((row, i) => {
                      const cx = PAD_L + i * gap + gap / 2;
                      const x = cx - barW / 2;
                      const baseY = PAD_T + plotH;
                      const totH = ((row.totalt - minVal) / range) * plotH;
                      const tradShare = row.totalt > 0 ? row.tKap / row.totalt : tradPct / 100;
                      const tBarH = totH * tradShare;
                      const fBarH = totH * (1 - tradShare);
                      const isHov = hovered === i;
                      return (
                        <g key={i}
                          onMouseEnter={() => setHovered(i)}
                          onMouseLeave={() => setHovered(null)}
                          style={{ cursor: "pointer" }}>
                          {/* Hover target — full bar area */}
                          <rect x={x - 4} y={baseY - totH - 4} width={barW + 8} height={totH + 4} fill="transparent" />
                          {/* Fond segment — top */}
                          <rect x={x} y={baseY - totH} width={barW} height={Math.max(0, fBarH)} fill={FOND_COLOR} opacity={isHov ? 0.85 : 0.55} rx={2} />
                          {/* TRAD segment — bottom */}
                          <rect x={x} y={baseY - totH + fBarH} width={barW} height={Math.max(0, tBarH)} fill={TRAD_COLOR} opacity={isHov ? 0.75 : 0.45} />
                          {/* Divider */}
                          {tBarH > 2 && fBarH > 2 && <line x1={x} y1={baseY - totH + fBarH} x2={x + barW} y2={baseY - totH + fBarH} stroke="#fff" strokeWidth={1} opacity={0.7} />}
                          {/* År label */}
                          <text x={cx} y={VH - 6} textAnchor="middle" fontSize={7.5} fill={isHov ? C.navy : C.textLight} fontWeight={isHov ? "bold" : "normal"} fontFamily="inherit">{row.y}</text>
                        </g>
                      );
                    })}
                    {/* Totallinje */}
                    <polyline fill="none" stroke={C.navy} strokeWidth={2} opacity={0.85}
                      points={rows.map((r, i) => `${PAD_L + i * gap + gap / 2},${toY(r.totalt)}`).join(" ")} />
                    {rows.map((row, i) => (
                      <circle key={i} cx={PAD_L + i * gap + gap / 2} cy={toY(row.totalt)} r={hovered === i ? 4 : 2.5}
                        fill={C.navy} stroke="#fff" strokeWidth={1} />
                    ))}
                  </svg>
                  {/* Tooltip */}
                  {hovered !== null && rows[hovered] && (() => {
                    const row = rows[hovered];
                    const cx = PAD_L + hovered * gap + gap / 2;
                    const pct = VW > 0 ? (cx / VW) * 100 : 50;
                    const alignRight = pct > 65;
                    return (
                      <div style={{
                        position: "absolute", top: 8,
                        left: alignRight ? "auto" : `${Math.max(0, pct - 8)}%`,
                        right: alignRight ? `${100 - pct - 8}%` : "auto",
                        background: C.navy, borderRadius: 8, padding: "10px 14px",
                        boxShadow: "0 4px 16px rgba(155,24,45,0.25)", pointerEvents: "none", minWidth: 170, zIndex: 10
                      }}>
                        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>År {row.y}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: 2, background: TRAD_COLOR, opacity: 0.8 }} />
                            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>TRAD</span>
                          </div>
                          <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>{fmt(row.tKap)}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: 2, background: FOND_COLOR, opacity: 0.8 }} />
                            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>Fond</span>
                          </div>
                          <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>{fmt(row.fKap)}</span>
                        </div>
                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 7, display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 11, fontWeight: 700 }}>Totalt</span>
                          <span style={{ color: "#F9C5A5", fontSize: 13, fontWeight: 800, fontFamily: "monospace" }}>{fmt(row.totalt)}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              );
            })()}
          </div>

          {/* Årsvis tabell */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "20px 24px", boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
              <span style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Årsvis utveckling</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: C.navy }}>
                    {["År", "TRAD kapital", "TRAD avk.", "Fond kapital", "Fond avk.", "Totalt kapital", "Totalt avk."].map(h => (
                      <th key={h} style={{ padding: "8px 12px", color: "#fff", fontWeight: 700, textAlign: h === "År" ? "left" : "right", fontSize: 11, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? C.surface : C.surface2 }}>
                      <td style={{ padding: "7px 12px", color: C.text, fontWeight: 600 }}>{row.y}</td>
                      <td style={{ padding: "7px 12px", textAlign: "right", color: TRAD_COLOR, fontFamily: "monospace", fontWeight: 600 }}>{fmt(row.tKap)}</td>
                      <td style={{ padding: "7px 12px", textAlign: "right", color: TRAD_COLOR, fontFamily: "monospace", fontWeight: 600 }}>{fmt(row.tAvk)}</td>
                      <td style={{ padding: "7px 12px", textAlign: "right", color: FOND_COLOR, fontFamily: "monospace", fontWeight: 600 }}>{fmt(row.fKap)}</td>
                      <td style={{ padding: "7px 12px", textAlign: "right", color: FOND_COLOR, fontFamily: "monospace", fontWeight: 600 }}>{fmt(row.fNettoAvk)}</td>
                      <td style={{ padding: "7px 12px", textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 4, alignItems: "center" }}>
                          <span style={{ color: TRAD_COLOR, fontSize: 11, fontWeight: 700, fontFamily: "monospace" }}>{fmt(row.tKap)}</span>
                          <span style={{ color: C.textLight, fontSize: 10 }}>+</span>
                          <span style={{ color: FOND_COLOR, fontSize: 11, fontWeight: 700, fontFamily: "monospace" }}>{fmt(row.fKap)}</span>
                        </div>
                        <div style={{ color: C.navy, fontSize: 12, fontWeight: 800, fontFamily: "monospace", textAlign: "right", marginTop: 1 }}>{fmt(row.totalt)}</div>
                      </td>
                      <td style={{ padding: "7px 12px", textAlign: "right", color: C.green, fontFamily: "monospace", fontWeight: 600 }}>{fmt(row.tAvk + row.fNettoAvk)}</td>
                    </tr>
                  ))}
                  <tr style={{ background: C.navy }}>
                    <td style={{ padding: "8px 12px", color: "#fff", fontWeight: 700 }}>Totalt</td>
                    <td colSpan={1} />
                    <td style={{ padding: "8px 12px", textAlign: "right", color: "#E8A0A0", fontFamily: "monospace", fontWeight: 700 }}>{fmt(rows.reduce((s,r)=>s+r.tAvk,0))}</td>
                    <td colSpan={1} />
                    <td style={{ padding: "8px 12px", textAlign: "right", color: "#CEC09E", fontFamily: "monospace", fontWeight: 700 }}>{fmt(rows.reduce((s,r)=>s+r.fNettoAvk,0))}</td>
                    <td style={{ padding: "8px 12px", textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 4, alignItems: "center" }}>
                        <span style={{ color: "#E8A0A0", fontSize: 10, fontWeight: 700, fontFamily: "monospace" }}>{rows.length > 0 ? fmt(rows[rows.length-1].tKap) : ""}</span>
                        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>+</span>
                        <span style={{ color: "#CEC09E", fontSize: 10, fontWeight: 700, fontFamily: "monospace" }}>{rows.length > 0 ? fmt(rows[rows.length-1].fKap) : ""}</span>
                      </div>
                      <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "monospace", textAlign: "right", marginTop: 1 }}>{fmt(slutKapital)}</div>
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", color: "#F9C5A5", fontFamily: "monospace", fontWeight: 700 }}>{fmt(totalAvk)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── TRAD AVKASTNING ────────────────────────────────────────────────────────
const TRAD_BOLAG = {
  skandia: {
    namn: "Skandia",
    återbäringsränta: 6.00,
    snitt5år: 6.80,
    kapitalavgift: 0.40,
    fastAvgiftÅr: 0,
    premieavgiftTrappor: [{ under: 500000, pct: 2.0 }, { under: 1000000, pct: 1.0 }, { under: Infinity, pct: 0 }],
    riskkapitaljustering: 1.0,
    återköp: [
      { år: 1, rörlig: 3, fast: 350 },
      { år: 2, rörlig: 3, fast: 350 },
      { år: 3, rörlig: 3, fast: 350 },
      { år: 4, rörlig: 2, fast: 350 },
      { år: 5, rörlig: 2, fast: 350 },
      { år: 6, rörlig: 2, fast: 350 },
      { år: 7, rörlig: 2, fast: 350 },
      { år: 8, rörlig: 1, fast: 350 },
      { år: 9, rörlig: 1, fast: 350 },
      { år: 10, rörlig: 1, fast: 350 },
    ],
    color: "#9B182D",
  },
  folksam: {
    namn: "Folksam",
    återbäringsränta: 9.00,
    snitt5år: 6.20,
    kapitalavgift: 0.45,
    fastAvgiftÅr: 288,
    premieavgiftTrappor: [{ under: 1000000, pct: 1.0 }, { under: Infinity, pct: 0 }],
    riskkapitaljustering: 0,
    återköp: [
      { år: 1, ejÅterköpsbar: true },
      { år: 2, rörlig: 3, fast: 250 },
      { år: 3, rörlig: 3, fast: 250 },
      { år: 4, rörlig: 3, fast: 250 },
      { år: 5, rörlig: 2, fast: 250 },
      { år: 6, rörlig: 2, fast: 250 },
      { år: 7, rörlig: 2, fast: 250 },
      { år: 8, rörlig: 1, fast: 250 },
      { år: 9, rörlig: 1, fast: 250 },
      { år: 10, rörlig: 0, fast: 250 },
    ],
    color: "#C0392B",
  },
};

const TradAvgiftCard = ({ totalAvgift }) => {
  const [visa, setVisa] = useState(false);
  return (
    <div onClick={() => setVisa(v => !v)} style={{ background: visa ? "#FEF2F2" : C.surface, border: `1px solid ${visa ? "#FECACA" : C.border}`, borderRadius: 8, padding: "16px 18px", boxShadow: "0 1px 4px rgba(155,24,45,0.06)", cursor: "pointer", userSelect: "none" }}>
      <div style={{ color: C.textLight, fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>Total avgift</span>
        <span style={{ fontSize: 9, color: C.textLight }}>{visa ? "▲" : "▼ visa"}</span>
      </div>
      {visa ? (
        <>
          <div style={{ color: C.red, fontSize: 20, fontWeight: 800, fontFamily: "monospace", marginBottom: 2 }}>{fmt(totalAvgift)}</div>
          <div style={{ color: C.textLight, fontSize: 10 }}>kapital- + fast avgift</div>
        </>
      ) : (
        <div style={{ color: C.textLight, fontSize: 12, marginTop: 6 }}>Klicka för att visa</div>
      )}
    </div>
  );
};

const TradView = () => {
  const [bolag, setBolag] = useState("skandia");
  const [kapital, setKapital] = useState(10000000);
  const [extra, setExtra] = useState(0);
  const [år, setÅr] = useState(10);
  const [räntaOverride, setRäntaOverride] = useState(null);
  const [använd5år, setAnvänd5år] = useState(false);
  const [uttakÅr, setUttakÅr] = useState(null);
  const [uttakBelopp, setUttakBelopp] = useState(0);
  const [inkluderaAvkSkatt, setInkluderaAvkSkatt] = useState(true);
  const [slr, setSlr] = useState(2.62); // statslåneränta, default 2026

  // Editerbar bolagsdata per bolag
  const [bolagData, setBolagData] = useState({
    skandia: { återbäringsränta: 6.00, snitt5år: 6.80, kapitalavgift: 0.40, fastAvgiftÅr: 0, riskkapitaljustering: 1.0 },
    folksam: { återbäringsränta: 9.00, snitt5år: 6.20, kapitalavgift: 0.45, fastAvgiftÅr: 288, riskkapitaljustering: 0 },
  });
  const setField = (field, val) => setBolagData(prev => ({ ...prev, [bolag]: { ...prev[bolag], [field]: val } }));
  const resetBolag = (k) => setBolagData(prev => ({
    ...prev,
    [k]: { återbäringsränta: TRAD_BOLAG[k].återbäringsränta, snitt5år: TRAD_BOLAG[k].snitt5år, kapitalavgift: TRAD_BOLAG[k].kapitalavgift, fastAvgiftÅr: TRAD_BOLAG[k].fastAvgiftÅr, riskkapitaljustering: TRAD_BOLAG[k].riskkapitaljustering },
  }));

  // Merge static bolag data with editable overrides
  const b = { ...TRAD_BOLAG[bolag], ...bolagData[bolag] };
  const ränta = räntaOverride !== null ? räntaOverride : (använd5år ? b.snitt5år : b.återbäringsränta);

  const avkSkattSats = (slr + 1) * 0.75 / 100; // (SLR + 1pp) × 0,75

  const rows = useMemo(() => {
    const res = [];
    let kapNu = kapital + extra;
    for (let y = 1; y <= år; y++) {
      const avkSkatt = inkluderaAvkSkatt ? kapNu * avkSkattSats : 0;
      const avkastning = kapNu * (ränta / 100);
      const kapital31 = kapNu + avkastning;
      const avgift = kapital31 * (b.kapitalavgift / 100) + b.fastAvgiftÅr;
      let kapEfterAvg = kapital31 - avgift;
      const avkEfterAvg = kapEfterAvg - kapNu;

      // Tillämpa uttag om detta är uttaksåret
      let uttagGjort = null;
      if (uttakÅr === y) {
        const rule = b.återköp.find(r => r.år === y);
        if (rule && !rule.ejÅterköpsbar) {
          const belopp = uttakBelopp > 0 ? Math.min(uttakBelopp, kapEfterAvg) : kapEfterAvg;
          const rörligAvgift = belopp * ((rule.rörlig || 0) / 100);
          const fastAvgiftUttag = rule.fast || 0;
          const riskKostnad = bolag === "skandia" ? belopp * (b.riskkapitaljustering / 100) : 0;
          const totalUttagsavgift = rörligAvgift + fastAvgiftUttag + riskKostnad;
          const netto = belopp - totalUttagsavgift;
          kapEfterAvg = kapEfterAvg - belopp;
          uttagGjort = { belopp, totalUttagsavgift, netto };
        }
      }

      res.push({ y, kapStart: kapNu, avkastning, kapital31, avgift, kapEfterAvg, avkEfterAvg, uttagGjort, avkSkatt });
      kapNu = kapEfterAvg;
    }
    return res;
  }, [kapital, extra, år, ränta, b, uttakÅr, uttakBelopp, bolag, inkluderaAvkSkatt, avkSkattSats]);

  const getÅterköp = (y) => {
    const rule = b.återköp.find(r => r.år === y);
    if (!rule) return { rörlig: 0, fast: 0, ejÅterköpsbar: false, fri: true };
    return rule;
  };

  const uttakKalkyl = useMemo(() => {
    if (!uttakÅr || uttakÅr < 1 || uttakÅr > rows.length) return null;
    const row = rows[uttakÅr - 1];
    const kapitalVid = row.kapEfterAvg;
    const rule = getÅterköp(uttakÅr);
    if (rule.ejÅterköpsbar) return { ejÅterköpsbar: true, kapitalVid };
    const belopp = uttakBelopp > 0 ? Math.min(uttakBelopp, kapitalVid) : kapitalVid;
    const rörligAvgift = belopp * ((rule.rörlig || 0) / 100);
    const fastAvgift = rule.fast || 0;
    const riskKostnad = bolag === "skandia" ? belopp * (b.riskkapitaljustering / 100) : 0;
    const totalUttagsavgift = rörligAvgift + fastAvgift + riskKostnad;
    const netto = belopp - totalUttagsavgift;
    return { ejÅterköpsbar: false, kapitalVid, belopp, rörligAvgift, fastAvgift, riskKostnad, totalUttagsavgift, netto, rörligPct: rule.rörlig || 0, fri: rule.fri };
  }, [uttakÅr, uttakBelopp, rows, bolag, b]);

  const totalAvkastning = rows.length > 0 ? rows[rows.length - 1].kapEfterAvg - (kapital + extra) : 0;
  const maxKap = rows.length > 0 ? Math.max(...rows.map(r => r.kapEfterAvg)) : 1;
  const chartH = 180;

  return (
    <div style={{ padding: "28px 32px", fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif", background: C.bg, minHeight: "calc(100vh - 130px)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 }}>

        {/* ── VÄNSTERKOLUMN ── */}
        <div>
          {/* Bolagsväljare */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "18px 20px", marginBottom: 14, boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
              <h3 style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: 0 }}>Bolag</h3>
            </div>
            <div style={{ display: "flex", gap: 6, background: C.surface2, borderRadius: 7, padding: 4 }}>
              {Object.entries(TRAD_BOLAG).map(([k, v]) => (
                <button key={k} onClick={() => { setBolag(k); setRäntaOverride(null); setAnvänd5år(false); }}
                  style={{ flex: 1, padding: "9px", borderRadius: 5, border: "none", background: bolag === k ? C.navy : "transparent", color: bolag === k ? "#fff" : C.textMid, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  {v.namn}
                </button>
              ))}
            </div>
          </div>

          {/* Bolagsdata — editerbar */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "18px 20px", marginBottom: 14, boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
                <h3 style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: 0 }}>Bolagsuppgifter</h3>
              </div>
              <button onClick={() => resetBolag(bolag)}
                style={{ fontSize: 10, padding: "4px 10px", background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 5, color: C.textMid, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
                ↺ Återställ
              </button>
            </div>
            <InputRow label="Återbäringsränta" value={bolagData[bolag].återbäringsränta} onChange={v => setField("återbäringsränta", v)} suffix="% / år" step={0.1} min={0} max={30} hint="Aktuell" />
            <InputRow label="Genomsnittlig 5 år" value={bolagData[bolag].snitt5år} onChange={v => setField("snitt5år", v)} suffix="% / år" step={0.1} min={0} max={30} hint="5-årssnitt" />
            <InputRow label="Kapitalavgift" value={bolagData[bolag].kapitalavgift} onChange={v => setField("kapitalavgift", v)} suffix="% / år" step={0.05} min={0} max={5} hint="Ord 0,80%" />
            {bolag === "folksam" && (
              <InputRow label="Fast avgift / år" value={bolagData[bolag].fastAvgiftÅr} onChange={v => setField("fastAvgiftÅr", v)} suffix="kr / år" step={50} min={0} />
            )}
            {bolag === "skandia" && (
              <InputRow label="Riskkapitaljustering uttag" value={bolagData[bolag].riskkapitaljustering} onChange={v => setField("riskkapitaljustering", v)} suffix="%" step={0.1} min={0} max={5} />
            )}
          </div>

          {/* Parametrar */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "18px 20px", marginBottom: 14, boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
              <h3 style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: 0 }}>Parametrar</h3>
            </div>
            <InputRow label="Placerat kapital" value={kapital} onChange={setKapital} suffix="kr" step={100000} hint={bolag === "folksam" ? "Min 50 000 kr" : ""} />
            <InputRow label="Extrainsättning" value={extra} onChange={setExtra} suffix="kr" step={100000} />
            <InputRow label="Antal år" value={år} onChange={v => setÅr(Math.max(1, Math.min(30, v)))} suffix="år" step={1} min={1} max={30} />

            <div style={{ marginTop: 4 }}>
              <div style={{ color: C.textMid, fontSize: 11, fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>Ränteantagande</div>
              <div style={{ display: "flex", gap: 6, background: C.surface2, borderRadius: 7, padding: 4, marginBottom: 8 }}>
                {[{ id: "aktuell", label: `Aktuell ${b.återbäringsränta.toFixed(2).replace(".", ",")} %` }, { id: "snitt", label: `Snitt ${b.snitt5år.toFixed(2).replace(".", ",")} %` }, { id: "manuell", label: "Manuell" }].map(t => (
                  <button key={t.id} onClick={() => { if (t.id === "aktuell") { setAnvänd5år(false); setRäntaOverride(null); } else if (t.id === "snitt") { setAnvänd5år(true); setRäntaOverride(null); } else { setAnvänd5år(false); setRäntaOverride(räntaOverride !== null ? räntaOverride : b.återbäringsränta); } }}
                    style={{ flex: 1, padding: "6px 4px", borderRadius: 5, border: "none", background: (t.id === "aktuell" && !använd5år && räntaOverride === null) || (t.id === "snitt" && använd5år) || (t.id === "manuell" && räntaOverride !== null) ? C.navy : "transparent", color: (t.id === "aktuell" && !använd5år && räntaOverride === null) || (t.id === "snitt" && använd5år) || (t.id === "manuell" && räntaOverride !== null) ? "#fff" : C.textMid, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{t.label}</button>
                ))}
              </div>
              {räntaOverride !== null && (
                <InputRow label="Manuell ränta" value={räntaOverride} onChange={setRäntaOverride} suffix="% / år" step={0.1} min={0} max={30} />
              )}
              <div style={{ background: C.goldLight, border: `1px solid ${C.gold}`, borderRadius: 5, padding: "8px 12px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: C.gold, fontSize: 11, fontWeight: 700 }}>Använd ränta</span>
                <span style={{ color: C.gold, fontSize: 13, fontWeight: 800 }}>{ränta.toFixed(2).replace(".", ",")} %</span>
              </div>
            </div>

            {/* Avkastningsskatt */}
            <div style={{ marginTop: 16, borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: inkluderaAvkSkatt ? 10 : 0 }}>
                <div>
                  <div style={{ color: C.textMid, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>Avkastningsskatt</div>
                  <div style={{ color: C.textLight, fontSize: 10, marginTop: 2 }}>(SLR + 1 pp) × 0,75 × ingående kapital</div>
                </div>
                <button onClick={() => setInkluderaAvkSkatt(v => !v)}
                  style={{ padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${inkluderaAvkSkatt ? C.navy : C.border}`, background: inkluderaAvkSkatt ? C.navy : "transparent", color: inkluderaAvkSkatt ? "#fff" : C.textMid, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  {inkluderaAvkSkatt ? "Aktiv" : "Av"}
                </button>
              </div>
              {inkluderaAvkSkatt && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: C.textLight, fontSize: 10, marginBottom: 4 }}>Statslåneränta (SLR)</div>
                      <div style={{ display: "flex", alignItems: "center", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
                        <input type="number" value={slr} min={0} max={10} step={0.01}
                          onChange={e => setSlr(Number(e.target.value))}
                          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 13, fontWeight: 600, padding: "8px 10px", fontFamily: "inherit" }} />
                        <span style={{ color: C.textLight, padding: "8px 10px", fontSize: 11, borderLeft: `1px solid ${C.border}` }}>%</span>
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: C.textLight, fontSize: 10, marginBottom: 4 }}>Effektiv skattesats</div>
                      <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 6, padding: "9px 12px", color: C.navy, fontSize: 13, fontWeight: 700 }}>
                        {(avkSkattSats * 100).toFixed(3).replace(".", ",")} %
                      </div>
                    </div>
                  </div>
                  <div style={{ background: "#FFF5F0", border: `1px solid ${C.gold}`, borderRadius: 6, padding: "8px 12px" }}>
                    <div style={{ color: C.textMid, fontSize: 10, lineHeight: 1.6 }}>
                      Betalas av <strong>bolaget</strong> utanför försäkringen. Påverkar inte kapitalvärdet i KF men är en verklig kostnad som redovisas separat nedan.
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Återköp */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "18px 20px", boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 3, height: 16, background: C.red, borderRadius: 2 }} />
              <h3 style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: 0 }}>Återköp / Uttag</h3>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: C.textMid, fontSize: 11, fontWeight: 700, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.8 }}>Uttag år</div>
                <select value={uttakÅr || ""} onChange={e => setUttakÅr(e.target.value ? Number(e.target.value) : null)}
                  style={{ width: "100%", padding: "10px 12px", border: `1.5px solid ${C.border}`, borderRadius: 6, fontSize: 13, color: C.text, background: C.surface, fontFamily: "inherit", outline: "none" }}>
                  <option value="">— Inget uttag —</option>
                  {Array.from({ length: år }, (_, i) => i + 1).map(y => {
                    const rule = getÅterköp(y);
                    return <option key={y} value={y}>År {y}{rule.ejÅterköpsbar ? " (ej återköpsbar)" : rule.fri ? " (fri)" : ` (avgift ${rule.rörlig || 0}%)`}</option>;
                  })}
                </select>
              </div>
            </div>
            {uttakÅr && (
              <InputRow label="Uttagsbelopp (0 = hela)" value={uttakBelopp} onChange={setUttakBelopp} suffix="kr" step={100000} hint="0 kr = hela kapitalet" />
            )}
            {uttakKalkyl && (
              uttakKalkyl.ejÅterköpsbar ? (
                <div style={{ background: "#FEF2F2", border: `1px solid ${C.red}`, borderRadius: 6, padding: "12px 14px" }}>
                  <div style={{ color: C.red, fontSize: 12, fontWeight: 700, marginBottom: 4 }}>⛔ Ej återköpsbar år {uttakÅr}</div>
                  <div style={{ color: C.textMid, fontSize: 11 }}>Folksam tillåter inte återköp under det första försäkringsåret.</div>
                </div>
              ) : (
                <div style={{ background: "#F0F7FF", border: `1px solid #F5C5C5`, borderRadius: 6, padding: "12px 14px" }}>
                  <div style={{ color: C.navy, fontSize: 11, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Uttagsberäkning — År {uttakÅr}</div>
                  {[
                    { label: "Kapitalvärde vid uttag", value: fmt(uttakKalkyl.kapitalVid), bold: true },
                    { label: "Uttagsbelopp", value: fmt(uttakKalkyl.belopp) },
                    { label: `Rörlig avgift (${uttakKalkyl.rörligPct} %)`, value: `−${fmt(uttakKalkyl.rörligAvgift)}`, red: true },
                    ...(uttakKalkyl.fastAvgift > 0 ? [{ label: "Fast avgift", value: `−${fmt(uttakKalkyl.fastAvgift)} kr`, red: true }] : []),
                    ...(uttakKalkyl.riskKostnad > 0 ? [{ label: `Riskkapitaljustering (${b.riskkapitaljustering} %)`, value: `−${fmt(uttakKalkyl.riskKostnad)}`, red: true }] : []),
                    { label: "Total uttagsavgift", value: `−${fmt(uttakKalkyl.totalUttagsavgift)}`, bold: true, red: true },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: i < 4 ? `1px solid #DBEAFE` : "none" }}>
                      <span style={{ color: C.textMid, fontSize: 11 }}>{item.label}</span>
                      <span style={{ color: item.red ? C.red : C.text, fontSize: 12, fontWeight: item.bold ? 700 : 400, fontFamily: "monospace" }}>{item.value}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 8, background: "#1A7A4A", borderRadius: 5, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>Nettoutbetalning</span>
                    <span style={{ color: "#fff", fontSize: 15, fontWeight: 800, fontFamily: "monospace" }}>{fmt(uttakKalkyl.netto)}</span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* ── HÖGERKOLUMN ── */}
        <div>
          {/* Sammanfattning */}
          <div style={{ display: "grid", gridTemplateColumns: inkluderaAvkSkatt ? "1fr 1fr 1fr 1fr" : "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "16px 18px", boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
              <div style={{ color: C.textLight, fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 }}>Kapital år {år}</div>
              <div style={{ color: C.navy, fontSize: 20, fontWeight: 800, fontFamily: "monospace", marginBottom: 2 }}>{rows.length > 0 ? fmt(rows[rows.length - 1].kapEfterAvg) : "—"}</div>
              <div style={{ color: C.textLight, fontSize: 10 }}>efter avgifter</div>
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "16px 18px", boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
              <div style={{ color: C.textLight, fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 }}>Total avkastning</div>
              <div style={{ color: C.green, fontSize: 20, fontWeight: 800, fontFamily: "monospace", marginBottom: 2 }}>{fmt(totalAvkastning)}</div>
              <div style={{ color: C.textLight, fontSize: 10 }}>över {år} år</div>
            </div>
            <TradAvgiftCard totalAvgift={rows.reduce((s, r) => s + r.avgift, 0)} />
            {inkluderaAvkSkatt && (
              <div style={{ background: "#FFF5F0", border: `1px solid ${C.gold}`, borderRadius: 8, padding: "16px 18px", boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
                <div style={{ color: C.textLight, fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 }}>Avkastningsskatt totalt</div>
                <div style={{ color: C.gold, fontSize: 20, fontWeight: 800, fontFamily: "monospace", marginBottom: 2 }}>−{fmt(rows.reduce((s, r) => s + r.avkSkatt, 0))}</div>
                <div style={{ color: C.textLight, fontSize: 10 }}>{(avkSkattSats * 100).toFixed(3).replace(".", ",")} % / år på ingående kap.</div>
              </div>
            )}
          </div>

          {/* Chart */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "20px 24px", marginBottom: 20, boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
              <span style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Kapitalutveckling — {b.namn}</span>
            </div>
            {(() => {
              const VW = 800, VH = 220, PAD_L = 62, PAD_B = 22, PAD_T = 16, plotW = VW - PAD_L - 8, plotH = VH - PAD_B - PAD_T;
              const n = rows.length;
              const barW = Math.max(14, Math.min(40, (plotW / n) * 0.6));
              const gap = plotW / n;
              const minVal = kapital + extra;
              const range = Math.max(1, maxKap - minVal);
              const toY = v => PAD_T + plotH - ((v - minVal) / range) * plotH;
              return (
                <svg width="100%" viewBox={`0 0 ${VW} ${VH}`} style={{ display: "block" }}>
                  {/* Y-axis gridlines + labels */}
                  {[0, 0.25, 0.5, 0.75, 1].map(frac => {
                    const val = minVal + frac * range;
                    const y = toY(val);
                    return (
                      <g key={frac}>
                        <line x1={PAD_L} y1={y} x2={VW - 8} y2={y} stroke={C.border} strokeWidth={0.6} strokeDasharray="3,5" />
                        <text x={PAD_L - 5} y={y + 3.5} textAnchor="end" fontSize={8} fill={C.textLight} fontFamily="inherit">{fmtShort(val)}</text>
                      </g>
                    );
                  })}
                  {/* Bars */}
                  {rows.map((row, i) => {
                    const cx = PAD_L + i * gap + gap / 2;
                    const x = cx - barW / 2;
                    const kapH = ((row.kapEfterAvg - minVal) / range) * plotH;
                    const avkH = Math.max(0, (row.avkEfterAvg / range) * plotH);
                    const baseY = PAD_T + plotH;
                    return (
                      <g key={i}>
                        <rect x={x} y={baseY - kapH} width={barW} height={kapH} fill={b.color} opacity={0.13} rx={2} />
                        <rect x={x} y={baseY - avkH} width={barW} height={avkH} fill={b.color} opacity={0.6} rx={2} />
                        <text x={cx} y={VH - 6} textAnchor="middle" fontSize={7.5} fill={C.textLight} fontFamily="inherit">{row.y}</text>
                        {uttakÅr === row.y && (
                          <line x1={cx} y1={PAD_T} x2={cx} y2={PAD_T + plotH} stroke={C.red} strokeWidth={1} strokeDasharray="3,3" opacity={0.7} />
                        )}
                      </g>
                    );
                  })}
                  {/* Line */}
                  <polyline fill="none" stroke={b.color} strokeWidth={1.5} opacity={0.9}
                    points={rows.map((row, i) => {
                      const cx = PAD_L + i * gap + gap / 2;
                      const y = toY(row.kapEfterAvg);
                      return `${cx},${y}`;
                    }).join(" ")} />
                  {/* Dots */}
                  {rows.map((row, i) => {
                    const cx = PAD_L + i * gap + gap / 2;
                    const y = toY(row.kapEfterAvg);
                    return <circle key={i} cx={cx} cy={y} r={2.5} fill={b.color} stroke="#fff" strokeWidth={1.2} />;
                  })}
                </svg>
              );
            })()}
            <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 10, height: 7, background: b.color, opacity: 0.6, borderRadius: 1 }} /><span style={{ fontSize: 10, color: C.textLight }}>Årets avkastning</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 10, height: 7, background: b.color, opacity: 0.13, borderRadius: 1 }} /><span style={{ fontSize: 10, color: C.textLight }}>Kapitaluppbyggnad</span></div>
              {uttakÅr && <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 10, height: 1.5, background: C.red, opacity: 0.7 }} /><span style={{ fontSize: 10, color: C.textLight }}>Uttag år {uttakÅr}</span></div>}
            </div>
          </div>

          {/* Återköpsavgifter tabell */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "20px 24px", marginBottom: 20, boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
              <span style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Återköpsavgifter — {b.namn}</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: C.navy }}>
                    {["År", "Rörlig avgift", "Fast avgift", ...(bolag === "skandia" ? ["Rabatterad avg"] : []), "Not"].map(h => (
                      <th key={h} style={{ padding: "8px 12px", color: "#fff", fontWeight: 700, textAlign: h === "År" ? "left" : "right", fontSize: 11 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {b.återköp.map((rule, i) => (
                    <tr key={i} style={{ background: rule.ejÅterköpsbar ? "#FEF2F2" : i % 2 === 0 ? C.surface : C.surface2 }}>
                      <td style={{ padding: "7px 12px", color: C.text, fontWeight: 600 }}>År {rule.år}</td>
                      <td style={{ padding: "7px 12px", textAlign: "right", color: rule.ejÅterköpsbar ? C.red : C.text }}>{rule.ejÅterköpsbar ? "—" : `${rule.rörlig} %`}</td>
                      <td style={{ padding: "7px 12px", textAlign: "right", color: C.text }}>{rule.ejÅterköpsbar ? "—" : `${rule.fast} kr`}</td>
                      {bolag === "skandia" && <td style={{ padding: "7px 12px", textAlign: "right", color: C.text }}>{rule.år <= 3 ? "1,50 %" : rule.år <= 7 ? "1,00 %" : "0,50 %"}</td>}
                      <td style={{ padding: "7px 12px", textAlign: "right", color: C.red, fontSize: 11 }}>{rule.ejÅterköpsbar ? "Ej återköpsbar" : rule.fri ? "Två fria/år" : ""}</td>
                    </tr>
                  ))}
                  <tr style={{ background: C.surface2 }}>
                    <td style={{ padding: "7px 12px", color: C.textMid }}>År 11+</td>
                    <td style={{ padding: "7px 12px", textAlign: "right", color: C.green, fontWeight: 600 }}>0 %</td>
                    <td style={{ padding: "7px 12px", textAlign: "right", color: C.green, fontWeight: 600 }}>0 kr</td>
                    {bolag === "skandia" && <td style={{ padding: "7px 12px", textAlign: "right", color: C.green }}>—</td>}
                    <td style={{ padding: "7px 12px", textAlign: "right", color: C.green, fontSize: 11, fontWeight: 600 }}>Fritt</td>
                  </tr>
                </tbody>
              </table>
              {bolag === "skandia" && (
                <div style={{ marginTop: 8, color: C.textLight, fontSize: 10, fontStyle: "italic" }}>* Riskkapitaljusteringskostnad vid uttag tillkommer med {b.riskkapitaljustering} %</div>
              )}
              {bolag === "folksam" && (
                <div style={{ marginTop: 8, color: C.textLight, fontSize: 10, fontStyle: "italic" }}>* Från år 11 tillåts två fria återköp per år</div>
              )}
            </div>
          </div>

          {/* Årsvis tabell */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "20px 24px", boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
              <span style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Årsvis beräkning</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: C.navy }}>
                    {["År", "Avkastning", "Kapital 31/12", "Avgift", "Kapital efter avg", "Avkastn. efter avg", ...(inkluderaAvkSkatt ? ["Avk.skatt (ext.)"] : [])].map(h => (
                      <th key={h} style={{ padding: "8px 12px", color: "#fff", fontWeight: 700, textAlign: h === "År" ? "left" : "right", fontSize: 11, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <>
                      <tr key={i} style={{ background: uttakÅr === row.y ? "#FFF5F0" : i % 2 === 0 ? C.surface : C.surface2 }}>
                        <td style={{ padding: "7px 12px", color: C.text, fontWeight: 600 }}>
                          {row.y}{uttakÅr === row.y ? " 🔴" : ""}
                        </td>
                        <td style={{ padding: "7px 12px", textAlign: "right", color: C.green, fontFamily: "monospace" }}>{fmt(row.avkastning)}</td>
                        <td style={{ padding: "7px 12px", textAlign: "right", fontFamily: "monospace" }}>{fmt(row.kapital31)}</td>
                        <td style={{ padding: "7px 12px", textAlign: "right", color: C.red, fontFamily: "monospace" }}>−{fmt(row.avgift)}</td>
                        <td style={{ padding: "7px 12px", textAlign: "right", fontWeight: 700, fontFamily: "monospace" }}>
                          {row.uttagGjort ? fmt(row.kapital31 - row.avgift) : fmt(row.kapEfterAvg)}
                        </td>
                        <td style={{ padding: "7px 12px", textAlign: "right", color: C.green, fontFamily: "monospace" }}>{fmt(row.avkEfterAvg)}</td>
                        {inkluderaAvkSkatt && (
                          <td style={{ padding: "7px 12px", textAlign: "right", color: "#C04020", fontFamily: "monospace", fontSize: 11 }}>−{fmt(row.avkSkatt)}</td>
                        )}
                      </tr>
                      {row.uttagGjort && (
                        <tr key={`uttag-${i}`} style={{ background: "#FEF2F2", borderLeft: `3px solid ${C.red}` }}>
                          <td style={{ padding: "7px 12px", color: C.red, fontWeight: 700, fontSize: 11 }}>↳ Uttag år {row.y}</td>
                          <td style={{ padding: "7px 12px", textAlign: "right", color: C.textMid, fontSize: 11, fontFamily: "monospace" }}>Belopp: {fmt(row.uttagGjort.belopp)}</td>
                          <td style={{ padding: "7px 12px", textAlign: "right", color: C.red, fontSize: 11, fontFamily: "monospace" }}>Avgift: −{fmt(row.uttagGjort.totalUttagsavgift)}</td>
                          <td colSpan={2} style={{ padding: "7px 12px", textAlign: "right" }}>
                            <span style={{ color: C.green, fontWeight: 700, fontSize: 12, fontFamily: "monospace" }}>Netto: {fmt(row.uttagGjort.netto)}</span>
                          </td>
                          <td style={{ padding: "7px 12px", textAlign: "right", color: C.navy, fontWeight: 700, fontSize: 11, fontFamily: "monospace" }}>
                            Kvar: {fmt(row.kapEfterAvg)}
                          </td>
                          {inkluderaAvkSkatt && <td />}
                        </tr>
                      )}
                    </>
                  ))}
                  <tr style={{ background: C.navy }}>
                    <td style={{ padding: "8px 12px", color: "#fff", fontWeight: 700 }}>Totalt</td>
                    <td style={{ padding: "8px 12px", textAlign: "right", color: "#F9C5A5", fontFamily: "monospace", fontWeight: 700 }}>{fmt(rows.reduce((s, r) => s + r.avkastning, 0))}</td>
                    <td />
                    <td style={{ padding: "8px 12px", textAlign: "right", color: "#FFB0B0", fontFamily: "monospace", fontWeight: 700 }}>−{fmt(rows.reduce((s, r) => s + r.avgift, 0))}</td>
                    <td />
                    <td style={{ padding: "8px 12px", textAlign: "right", color: "#F9C5A5", fontFamily: "monospace", fontWeight: 700 }}>{fmt(rows.reduce((s, r) => s + r.avkEfterAvg, 0))}</td>
                    {inkluderaAvkSkatt && (
                      <td style={{ padding: "8px 12px", textAlign: "right", color: "#FFD0B0", fontFamily: "monospace", fontWeight: 700 }}>−{fmt(rows.reduce((s, r) => s + r.avkSkatt, 0))}</td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── ÄRENDEN ────────────────────────────────────────────────────────────────
const ArendenView = () => {
  const [mode, setMode] = useState(null); // null | "nyteckning" | "andring"
  const [mottagarMail, setMottagarMail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // ── Nyteckning state ──
  const [nt, setNt] = useState({
    // Kunduppgifter
    foretagsnamn: "", orgnr: "",
    ägarAntal: 1,
    ägare: Array.from({length: 5}, () => ({ personnr: "", andel: "" })),
    // Försäkringsval
    tjanstepension: false, plansjuk: false, gruppliv: false, kassplacering: false,
    // Tjänstepension sub
    tjpTecknasTill: "67", tjpUtbetalningstid: "10", tjpSparpremie: "", tjpAntalFonder: 1,
    tjpFonder: Array.from({length: 10}, () => ({ namn: "", procent: "" })),
    // Plansjuk sub
    psHalsokrav: "", psForsAkradLon: "", psForsAkradTjp: "", psFaktura: "",
    // Gruppliv sub
    glSjukvard: "", glSjukOlycka: "", glSjukOlyckaBolag: "", glSjukOlyckaPBB: "10", glLiv: "", glLivPBB: "1",
    // Kassplacering
    kassInsättningsTyp: "engång", kassPremie: "", kassForvaltning: "traditionell", kassTradPct: 50,
    // Önskat
    startdatum: "",
    // Förmedlare
    formedlarNamn: "", formedlarTel: "", formedlarEmail: "",
    // Övrigt
    noteringar: "",
  });

  // ── Ändring state ──
  const [an, setAn] = useState({
    foretagsnamn: "", orgnr: "",
    kontaktperson: "", kontaktTel: "", kontaktEmail: "",
    andringTyp: "", befintligPolice: "",
    beskrivning: "",
    formedlarNamn: "", formedlarTel: "", formedlarEmail: "",
    noteringar: "",
  });

  const updNt = (k, v) => setNt(p => ({ ...p, [k]: v }));
  const updAn = (k, v) => setAn(p => ({ ...p, [k]: v }));

  const buildNtBody = () => {
    const L = 26; // label width for alignment
    const pad = (label) => label.padEnd(L, " ");
    const sep  = "═".repeat(56);
    const sep2 = "─".repeat(56);

    const ägarRader = Array.from({ length: nt.ägarAntal }).map((_, i) =>
      `  ${pad(`Ägare ${i+1} personnr:`)}${nt.ägare[i].personnr || "–"}\n  ${pad(`Ägare ${i+1} ägarandel:`)}${nt.ägare[i].andel || "–"} %`
    ).join("\n");

    let fsBlock = "";

    if (nt.tjanstepension) {
      const fonder = Array.from({ length: nt.tjpAntalFonder }).map((_, i) =>
        `  ${pad(`  Fond ${i+1}:`)}${nt.tjpFonder[i].namn || "–"}  (${nt.tjpFonder[i].procent || "0"} %)`
      ).join("\n");
      fsBlock += `
${sep2}
  TJÄNSTEPENSION
${sep2}
  ${pad("Teckna till:")}${nt.tjpTecknasTill || "67"} år
  ${pad("Utbetalningstid:")}${nt.tjpUtbetalningstid || "10"} år
  ${pad("Sparpremie / mån:")}${nt.tjpSparpremie || "–"} kr
  ${pad("Antal fonder:")}${nt.tjpAntalFonder}
${fonder}`;
    }

    if (nt.plansjuk) {
      fsBlock += `
${sep2}
  PLANSJUK
${sep2}
  ${pad("Klarar hälsokrav 14/90:")}${nt.psHalsokrav || "–"}
  ${pad("Försäkrad lön:")}${nt.psForsAkradLon || "–"} kr/år
  ${pad("Försäkrad tjänstepension:")}${nt.psForsAkradTjp || "–"} kr/mån
  ${pad("Faktura skickas till:")}${nt.psFaktura || "–"}`;
    }

    if (nt.gruppliv) {
      fsBlock += `
${sep2}
  GRUPPLIV
${sep2}
  ${pad("Sjukvårdsförsäkring:")}${nt.glSjukvard || "–"}
  ${pad("Sjuk & Olycksfall:")}${nt.glSjukOlycka || "–"}
  ${pad("Livförsäkring:")}${nt.glLiv || "–"}`;
    }

    if (nt.kassplacering) {
      fsBlock += `
${sep2}
  KASSPLACERING
${sep2}
  ${pad("Insättningstyp:")}${nt.kassInsättningsTyp === "engång" ? "Engångsinsättning" : "Månadsinsättning"}
  ${pad("Premie:")}${nt.kassPremie || "–"} kr
  ${pad("Förvaltningsform:")}${nt.kassForvaltning === "traditionell" ? "Traditionell försäkring" : nt.kassForvaltning === "fond" ? "Fondförsäkring" : "Kombinerad"}
  ${pad("Fördelning (om kombinerad):")}${nt.kassForvaltning === "kombinerad" ? "Traditionell " + nt.kassTradPct + "% / Fond " + (100 - nt.kassTradPct) + "%" : "–"}`;
    }

    const valtaTyper = [
      nt.tjanstepension && "Tjänstepension",
      nt.plansjuk && "Plansjuk",
      nt.gruppliv && "Gruppliv",
      nt.kassplacering && "Kassplacering",
    ].filter(Boolean).join(", ") || "–";

    return `${sep}
  NYTECKNING — NORRFINANS FÖRMEDLING
${sep}

  KUNDUPPGIFTER
${sep2}
  ${pad("Företagsnamn:")}${nt.foretagsnamn || "–"}
  ${pad("Organisationsnummer:")}${nt.orgnr || "–"}

  ÄGARE (${nt.ägarAntal} st)
${sep2}
${ägarRader}

  ÖNSKAT STARTDATUM
${sep2}
  ${pad("Startdatum:")}${nt.startdatum || "–"}

  FÖRSÄKRINGSTYPER: ${valtaTyper}
${fsBlock ? fsBlock : ""}

${sep2}
  FÖRMEDLARE
${sep2}
  ${pad("Namn:")}${nt.formedlarNamn || "–"}
  ${pad("Telefon:")}${nt.formedlarTel || "–"}
  ${pad("E-post:")}${nt.formedlarEmail || "–"}

  NOTERINGAR
${sep2}
  ${nt.noteringar || "–"}

${sep}
  Skickat via Norrfinans Rådgivningsverktyg
${sep}`;
  };

  const buildAnBody = () => `ÄNDRING — NORRFINANS FÖRMEDLING
${"=".repeat(50)}

KUND
Företagsnamn:     ${an.foretagsnamn}
Organisationsnr:  ${an.orgnr}
Kontaktperson:    ${an.kontaktperson}
Telefon:          ${an.kontaktTel}
E-post:           ${an.kontaktEmail}

ÄRENDE
Typ av ändring:   ${an.andringTyp}
Befintlig police: ${an.befintligPolice}

BESKRIVNING
${an.beskrivning}

FÖRMEDLARE
Namn:             ${an.formedlarNamn}
Telefon:          ${an.formedlarTel}
E-post:           ${an.formedlarEmail}

NOTERINGAR
${an.noteringar || "–"}

${"=".repeat(50)}
Skickat via Norrfinans Rådgivningsverktyg`;

  const handleDownloadPDF = () => {
    const isNt = mode === "nyteckning";
    const title = isNt
      ? `Nyteckning — ${nt.foretagsnamn || "Ny kund"}`
      : `Ändring — ${an.foretagsnamn || "Kund"}`;

    // Build structured rows for PDF
    const rows = isNt ? buildNtRows() : buildAnRows();

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>${title}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Inter', Arial, sans-serif; font-size: 11px; color: #2A1015; background: #F5F3EE; padding: 32px 40px; }
  .header { display:flex; align-items:center; gap:14px; margin-bottom:28px; padding-bottom:16px; border-bottom:3px solid #9B182D; }
  .logo { width:38px; height:38px; background:#E73331; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:20px; font-weight:900; flex-shrink:0; }
  .brand { color:#9B182D; font-size:16px; font-weight:800; letter-spacing:1px; }
  .subtitle { color:#888; font-size:9px; letter-spacing:2px; text-transform:uppercase; }
  .doc-title { font-size:14px; font-weight:700; color:#9B182D; margin-left:auto; }
  .section { margin-bottom:18px; }
  .section-header { background:#9B182D; color:#fff; font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase; padding:6px 12px; border-radius:4px 4px 0 0; }
  .section-body { border:1px solid #E0D8CC; border-top:none; border-radius:0 0 4px 4px; overflow:hidden; }
  .row { display:flex; border-bottom:1px solid #f0f3f7; }
  .row:last-child { border-bottom:none; }
  .row.alt { background:#F5F3EE; }
  .label { width:200px; flex-shrink:0; padding:7px 12px; color:#6B3040; font-weight:600; font-size:10px; }
  .value { padding:7px 12px; color:#2A1015; font-size:10px; flex:1; }
  .value.bold { font-weight:700; }
  .subsection-title { background:#F0EDE6; color:#9B182D; font-size:9px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; padding:6px 12px; border-bottom:1px solid #E0D8CC; }
  .chip { display:inline-block; background:#9B182D; color:#fff; font-size:9px; font-weight:700; padding:2px 8px; border-radius:3px; margin-right:4px; }
  .footer { margin-top:32px; padding-top:12px; border-top:1px solid #E0D8CC; color:#aaa; font-size:9px; display:flex; justify-content:space-between; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
  <div class="header">
    <div class="logo">N</div>
    <div>
      <div class="brand">Norrfinans</div>
      <div class="subtitle">Rådgivningsverktyg</div>
    </div>
    <div class="doc-title">${title}</div>
  </div>
  ${rows}
  <div class="footer">
    <span>Norrfinans — Konfidentiellt</span>
    <span>Genererat ${new Date().toLocaleDateString("sv-SE")} ${new Date().toLocaleTimeString("sv-SE", {hour:"2-digit",minute:"2-digit"})}</span>
  </div>
</body>
</html>`;

    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); }, 600);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const row = (label, value, alt, bold) =>
    `<div class="row${alt ? " alt" : ""}"><div class="label">${label}</div><div class="value${bold ? " bold" : ""}">${value || "–"}</div></div>`;

  const sectionHtml = (title, rowsHtml) =>
    `<div class="section"><div class="section-header">${title}</div><div class="section-body">${rowsHtml}</div></div>`;

  const buildNtRows = () => {
    let html = "";

    // Kunduppgifter
    html += sectionHtml("Kunduppgifter",
      row("Företagsnamn", nt.foretagsnamn, false, true) +
      row("Organisationsnummer", nt.orgnr, true)
    );

    // Ägare
    const ägarRows = Array.from({ length: nt.ägarAntal }).map((_, i) =>
      row(`Ägare ${i+1} — Personnummer`, nt.ägare[i].personnr, i%2===0) +
      row(`Ägare ${i+1} — Ägarandel`, nt.ägare[i].andel ? nt.ägare[i].andel + " %" : "–", i%2!==0)
    ).join("");
    html += sectionHtml(`Ägare (${nt.ägarAntal} st)`, ägarRows);

    // Startdatum
    html += sectionHtml("Önskat startdatum", row("Startdatum", nt.startdatum));

    // Försäkringstyper
    const typer = [
      nt.tjanstepension && "Tjänstepension",
      nt.plansjuk && "Plansjuk",
      nt.gruppliv && "Gruppliv",
      nt.kassplacering && "Kassplacering",
    ].filter(Boolean);
    const chips = typer.map(t => `<span class="chip">${t}</span>`).join("") || "–";
    html += sectionHtml("Försäkringstyper",
      `<div class="row"><div class="label">Valda försäkringar</div><div class="value">${chips}</div></div>`
    );

    // Tjänstepension
    if (nt.tjanstepension) {
      const fonderRows = Array.from({ length: nt.tjpAntalFonder }).map((_, i) =>
        row(`Fond ${i+1}`, `${nt.tjpFonder[i].namn || "–"} — ${nt.tjpFonder[i].procent || "0"} %`, i%2===0)
      ).join("");
      html += sectionHtml("Tjänstepension",
        row("Teckna till", (nt.tjpTecknasTill || "67") + " år", false) +
        row("Utbetalningstid", (nt.tjpUtbetalningstid || "10") + " år", true) +
        row("Sparpremie / mån", nt.tjpSparpremie ? nt.tjpSparpremie + " kr" : "–", false) +
        `<div class="subsection-title">Fondfördelning (${nt.tjpAntalFonder} fonder)</div>` +
        fonderRows
      );
    }

    // Plansjuk
    if (nt.plansjuk) {
      html += sectionHtml("Plansjuk",
        row("Klarar hälsokrav 14/90", nt.psHalsokrav, false, true) +
        row("Försäkrad lön", nt.psForsAkradLon ? nt.psForsAkradLon + " kr/år" : "–", true) +
        row("Försäkrad tjänstepension", nt.psForsAkradTjp ? nt.psForsAkradTjp + " kr/mån" : "–", false) +
        row("Faktura skickas till", nt.psFaktura, true)
      );
    }

    // Gruppliv
    if (nt.gruppliv) {
      html += sectionHtml("Gruppliv",
        row("Sjukvårdsförsäkring", nt.glSjukvard, false) +
        row("Sjuk & Olycksfallsförsäkring", nt.glSjukOlycka, true) +
        row("Livförsäkring", nt.glLiv, false)
      );
    }

    // Kassplacering
    if (nt.kassplacering) {
      html += sectionHtml("Kassplacering",
        row("Status", "Inkluderas i ärendet", false, true)
      );
    }

    // Förmedlare
    html += sectionHtml("Förmedlare",
      row("Namn", nt.formedlarNamn, false) +
      row("Telefon", nt.formedlarTel, true) +
      row("E-post", nt.formedlarEmail, false)
    );

    // Noteringar
    if (nt.noteringar) {
      html += sectionHtml("Noteringar",
        `<div class="row"><div class="value" style="padding:10px 12px;line-height:1.6;">${nt.noteringar}</div></div>`
      );
    }

    return html;
  };

  const buildAnRows = () => {
    let html = "";
    html += sectionHtml("Kund",
      row("Företagsnamn", an.foretagsnamn, false, true) +
      row("Organisationsnummer", an.orgnr, true) +
      row("Kontaktperson", an.kontaktperson, false) +
      row("Telefon", an.kontaktTel, true) +
      row("E-post", an.kontaktEmail, false)
    );
    html += sectionHtml("Ärende",
      row("Typ av ändring", an.andringTyp, false, true) +
      row("Befintlig police/avtal", an.befintligPolice, true)
    );
    if (an.beskrivning) {
      html += sectionHtml("Beskrivning",
        `<div class="row"><div class="value" style="padding:10px 12px;line-height:1.6;">${an.beskrivning}</div></div>`
      );
    }
    html += sectionHtml("Förmedlare",
      row("Namn", an.formedlarNamn, false) +
      row("Telefon", an.formedlarTel, true) +
      row("E-post", an.formedlarEmail, false)
    );
    if (an.noteringar) {
      html += sectionHtml("Noteringar",
        `<div class="row"><div class="value" style="padding:10px 12px;line-height:1.6;">${an.noteringar}</div></div>`
      );
    }
    return html;
  };

  const handleSend = handleDownloadPDF;


  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
        <div style={{ width: 3, height: 20, background: C.gold, borderRadius: 2 }} />
        <div>
          <div style={{ color: C.gold, fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Förmedling</div>
          <div style={{ color: C.navy, fontSize: 18, fontWeight: 700 }}>Ärenden</div>
        </div>
      </div>



      {/* Mode buttons */}
      <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
        {[{ id: "nyteckning", label: "📋 Nyteckning", desc: "Ny kund / ny försäkring" },
          { id: "andring", label: "✏️ Ändring", desc: "Ändra befintligt avtal" }].map(m => (
          <button key={m.id} onClick={() => { setMode(m.id); setSubmitted(false); }}
            style={{ flex: 1, padding: "18px 20px", background: mode === m.id ? C.navy : "#fff", border: `2px solid ${mode === m.id ? C.navy : C.border}`, borderRadius: 10, cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "all 0.15s" }}>
            <div style={{ color: mode === m.id ? "#fff" : C.navy, fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{m.label}</div>
            <div style={{ color: mode === m.id ? "rgba(255,255,255,0.6)" : C.textLight, fontSize: 11 }}>{m.desc}</div>
          </button>
        ))}
      </div>

      {/* NYTECKNING FORM */}
      {mode === "nyteckning" && (
        <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: "28px 28px" }}>
          <FSect title="Kunduppgifter">
            <FInput label="Företagsnamn" value={nt.foretagsnamn} onChange={v => updNt("foretagsnamn", v)} placeholder="AB Exempel" />
            <FInput label="Organisationsnummer" value={nt.orgnr} onChange={v => updNt("orgnr", v)} placeholder="556123-4567" half />
            <div style={{ marginBottom: 14, flex: "0 0 calc(50% - 6px)" }}>
              <label style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 5 }}>Antal ägare</label>
              <select value={nt.ägarAntal} onChange={e => updNt("ägarAntal", Number(e.target.value))}
                style={{ width: "100%", padding: "9px 12px", border: `1.5px solid ${C.border}`, borderRadius: 6, fontSize: 13, color: C.text, outline: "none", fontFamily: "inherit", background: "#fff", cursor: "pointer" }}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} {n === 1 ? "ägare" : "ägare"}</option>)}
              </select>
            </div>
            {(() => {
              const totalAndel = nt.ägare.slice(0, nt.ägarAntal).reduce((s, o) => s + (parseFloat(o.andel) || 0), 0);
              const isOk = Math.abs(totalAndel - 100) < 0.01;
              const hasAny = nt.ägare.slice(0, nt.ägarAntal).some(o => o.andel !== "");
              return (
                <>
                  {Array.from({ length: nt.ägarAntal }).map((_, i) => (
                    <div key={i} style={{ flex: "1 1 100%", display: "flex", gap: 12, alignItems: "flex-end", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7, padding: "12px 14px" }}>
                      <div style={{ color: C.textMid, fontSize: 11, fontWeight: 700, minWidth: 56, paddingBottom: 10 }}>Ägare {i + 1}</div>
                      <div style={{ flex: 2 }}>
                        <label style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 5 }}>Personnummer</label>
                        <input type="text" value={nt.ägare[i].personnr}
                          onChange={e => { const a = nt.ägare.map((o,j) => j===i ? {...o, personnr: e.target.value} : o); updNt("ägare", a); }}
                          placeholder="YYYYMMDD-XXXX"
                          style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", border: `1.5px solid ${C.border}`, borderRadius: 6, fontSize: 13, color: C.text, outline: "none", fontFamily: "inherit", background: "#fff" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 5 }}>Ägarandel %</label>
                        <input type="number" value={nt.ägare[i].andel}
                          onChange={e => { const a = nt.ägare.map((o,j) => j===i ? {...o, andel: e.target.value} : o); updNt("ägare", a); }}
                          placeholder="0" min={0} max={100}
                          style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", border: `1.5px solid ${hasAny ? (isOk ? "#16A34A" : "#EF4444") : C.border}`, borderRadius: 6, fontSize: 13, color: C.text, outline: "none", fontFamily: "inherit", background: hasAny ? (isOk ? "#FFF0F0" : "#FEF2F2") : "#fff" }} />
                      </div>
                    </div>
                  ))}
                  {hasAny && (
                    <div style={{ flex: "1 1 100%", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10, padding: "6px 4px" }}>
                      <span style={{ color: C.textLight, fontSize: 11 }}>Total ägarandel:</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: isOk ? "#16A34A" : "#EF4444", fontFamily: "monospace" }}>{totalAndel.toFixed(0)}%</span>
                      {isOk
                        ? <span style={{ background: "#DCFCE7", color: "#15803D", fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 5 }}>✓ OK</span>
                        : <span style={{ background: "#FEE2E2", color: "#B91C1C", fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 5 }}>Måste bli 100%</span>
                      }
                    </div>
                  )}
                </>
              );
            })()}
          </FSect>

{/* ── Försäkringstyper ── */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 3, height: 14, background: C.gold, borderRadius: 2 }} />
              <span style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Försäkringstyper</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
              {[
                { key: "tjanstepension", label: "Tjänstepension" },
                { key: "plansjuk", label: "Plansjuk" },
                { key: "gruppliv", label: "Gruppliv" },
                { key: "kassplacering", label: "Kassplacering" },
              ].map(fs => (
                <label key={fs.key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", border: `1.5px solid ${nt[fs.key] ? C.navy : C.border}`, borderRadius: 7, cursor: "pointer", background: nt[fs.key] ? "#EEF2FF" : "#fff", transition: "all 0.15s" }}>
                  <input type="checkbox" checked={nt[fs.key]} onChange={e => updNt(fs.key, e.target.checked)} style={{ accentColor: C.navy, width: 14, height: 14 }} />
                  <span style={{ color: nt[fs.key] ? C.navy : C.textMid, fontSize: 12, fontWeight: nt[fs.key] ? 700 : 400 }}>{fs.label}</span>
                </label>
              ))}
            </div>

            {/* ── Tjänstepension sub-form ── */}
            {nt.tjanstepension && (
              <div style={{ background: "#EEF2FF", border: "1.5px solid #E0D8CC", borderRadius: 9, padding: "18px 20px", marginBottom: 12 }}>
                <div style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Tjänstepension — detaljer</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ flex: "0 0 calc(50% - 6px)", marginBottom: 14 }}>
                    <label style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 5 }}>Teckna till (år)</label>
                    <input type="number" value={nt.tjpTecknasTill} onChange={e => updNt("tjpTecknasTill", e.target.value)} placeholder="67"
                      style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", border: `1.5px solid ${C.border}`, borderRadius: 6, fontSize: 13, color: C.text, outline: "none", fontFamily: "inherit", background: "#fff" }} />
                  </div>
                  <div style={{ flex: "0 0 calc(50% - 6px)", marginBottom: 14 }}>
                    <label style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 5 }}>Utbetalningstid (år)</label>
                    <input type="number" value={nt.tjpUtbetalningstid} onChange={e => updNt("tjpUtbetalningstid", e.target.value)} placeholder="10"
                      style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", border: `1.5px solid ${C.border}`, borderRadius: 6, fontSize: 13, color: C.text, outline: "none", fontFamily: "inherit", background: "#fff" }} />
                  </div>
                  <div style={{ flex: "1 1 100%", marginBottom: 14 }}>
                    <label style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 5 }}>Sparpremie / mån (kr)</label>
                    <input type="number" value={nt.tjpSparpremie} onChange={e => updNt("tjpSparpremie", e.target.value)} placeholder="0"
                      style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", border: `1.5px solid ${C.border}`, borderRadius: 6, fontSize: 13, color: C.text, outline: "none", fontFamily: "inherit", background: "#fff" }} />
                  </div>
                  <div style={{ flex: "0 0 calc(50% - 6px)", marginBottom: 14 }}>
                    <label style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 5 }}>Antal fonder</label>
                    <select value={nt.tjpAntalFonder} onChange={e => updNt("tjpAntalFonder", Number(e.target.value))}
                      style={{ width: "100%", padding: "9px 12px", border: `1.5px solid ${C.border}`, borderRadius: 6, fontSize: 13, color: C.text, outline: "none", fontFamily: "inherit", background: "#fff", cursor: "pointer" }}>
                      {Array.from({length: 10}, (_,i) => <option key={i+1} value={i+1}>{i+1} fond{i > 0 ? "er" : ""}</option>)}
                    </select>
                  </div>
                </div>
                {(() => {
                  const totalPct = nt.tjpFonder.slice(0, nt.tjpAntalFonder).reduce((s, f) => s + (parseFloat(f.procent) || 0), 0);
                  const fondOk = Math.abs(totalPct - 100) < 0.01;
                  const harNgt = nt.tjpFonder.slice(0, nt.tjpAntalFonder).some(f => f.procent !== "");
                  return (
                    <>
                      {Array.from({ length: nt.tjpAntalFonder }).map((_, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 8 }}>
                          <div style={{ flex: 3 }}>
                            {i === 0 && <label style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 5 }}>Fondens namn</label>}
                            <input type="text" value={nt.tjpFonder[i].namn}
                              onChange={e => { const f = nt.tjpFonder.map((o,j) => j===i ? {...o, namn: e.target.value} : o); updNt("tjpFonder", f); }}
                              placeholder={`Fond ${i+1}`}
                              style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", border: `1.5px solid ${C.border}`, borderRadius: 6, fontSize: 13, color: C.text, outline: "none", fontFamily: "inherit", background: "#fff" }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            {i === 0 && <label style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 5 }}>Fördelning %</label>}
                            <input type="number" value={nt.tjpFonder[i].procent}
                              onChange={e => { const f = nt.tjpFonder.map((o,j) => j===i ? {...o, procent: e.target.value} : o); updNt("tjpFonder", f); }}
                              placeholder="0" min={0} max={100}
                              style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", border: `1.5px solid ${harNgt ? (fondOk ? "#16A34A" : "#EF4444") : C.border}`, borderRadius: 6, fontSize: 13, color: C.text, outline: "none", fontFamily: "inherit", background: harNgt ? (fondOk ? "#FFF0F0" : "#FEF2F2") : "#fff" }} />
                          </div>
                        </div>
                      ))}
                      {harNgt && (
                        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10, marginTop: 4 }}>
                          <span style={{ color: C.textLight, fontSize: 11 }}>Total fondfördelning:</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: fondOk ? "#16A34A" : "#EF4444", fontFamily: "monospace" }}>{totalPct.toFixed(0)}%</span>
                          {fondOk
                            ? <span style={{ background: "#DCFCE7", color: "#15803D", fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 5 }}>✓ OK</span>
                            : <span style={{ background: "#FEE2E2", color: "#B91C1C", fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 5 }}>Måste bli 100%</span>
                          }
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {/* ── Plansjuk sub-form ── */}
            {nt.plansjuk && (
              <div style={{ background: "#FFF7ED", border: "1.5px solid #FED7AA", borderRadius: 9, padding: "18px 20px", marginBottom: 12 }}>
                <div style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Plansjuk — detaljer</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ flex: "1 1 100%", marginBottom: 14 }}>
                    <label style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Klarar hälsokrav 14/90</label>
                    <div style={{ display: "flex", gap: 10 }}>
                      {["Ja", "Nej"].map(v => (
                        <label key={v} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", border: `1.5px solid ${nt.psHalsokrav === v ? (v === "Ja" ? "#16A34A" : "#EF4444") : C.border}`, borderRadius: 7, cursor: "pointer", background: nt.psHalsokrav === v ? (v === "Ja" ? "#FFF0F0" : "#FEF2F2") : "#fff" }}>
                          <input type="radio" name="halsokrav" value={v} checked={nt.psHalsokrav === v} onChange={() => updNt("psHalsokrav", v)} style={{ accentColor: v === "Ja" ? "#16A34A" : "#EF4444" }} />
                          <span style={{ fontSize: 13, fontWeight: 600, color: nt.psHalsokrav === v ? (v === "Ja" ? "#15803D" : "#B91C1C") : C.textMid }}>{v}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div style={{ flex: "0 0 calc(50% - 6px)", marginBottom: 14 }}>
                    <label style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 5 }}>Försäkrad lön (kr/år)</label>
                    <input type="number" value={nt.psForsAkradLon} onChange={e => updNt("psForsAkradLon", e.target.value)} placeholder="0"
                      style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", border: `1.5px solid ${C.border}`, borderRadius: 6, fontSize: 13, color: C.text, outline: "none", fontFamily: "inherit", background: "#fff" }} />
                  </div>
                  <div style={{ flex: "0 0 calc(50% - 6px)", marginBottom: 14 }}>
                    <label style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 5 }}>Försäkrad tjänstepension (kr/mån)</label>
                    <input type="number" value={nt.psForsAkradTjp} onChange={e => updNt("psForsAkradTjp", e.target.value)} placeholder="0"
                      style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", border: `1.5px solid ${C.border}`, borderRadius: 6, fontSize: 13, color: C.text, outline: "none", fontFamily: "inherit", background: "#fff" }} />
                  </div>
                  <div style={{ flex: "1 1 100%", marginBottom: 14 }}>
                    <label style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 5 }}>Faktura skickas till</label>
                    <input type="text" value={nt.psFaktura} onChange={e => updNt("psFaktura", e.target.value)} placeholder="E-post eller adress"
                      style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", border: `1.5px solid ${C.border}`, borderRadius: 6, fontSize: 13, color: C.text, outline: "none", fontFamily: "inherit", background: "#fff" }} />
                  </div>
                </div>
              </div>
            )}

            {/* ── Gruppliv sub-form ── */}
            {nt.gruppliv && (
              <div style={{ background: "#FFF0F0", border: "1.5px solid #E5A0A0", borderRadius: 9, padding: "18px 20px", marginBottom: 12 }}>
                <div style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Gruppliv — detaljer</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  {/* Sjukvårdsförsäkring */}
                  <div style={{ flex: "1 1 100%", marginBottom: 14 }}>
                    <label style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 5 }}>Sjukvårdsförsäkring</label>
                    <select value={nt.glSjukvard} onChange={e => updNt("glSjukvard", e.target.value)}
                      style={{ width: "100%", padding: "9px 12px", border: `1.5px solid ${C.border}`, borderRadius: 6, fontSize: 12, color: C.text, outline: "none", fontFamily: "inherit", background: "#fff", cursor: "pointer" }}>
                      <option value="">— Välj —</option>
                      <option>Sjukvårdsförsäkring PA Guld (utan självrisk) 12 mån. karens, 20% rabatt (EA)</option>
                      <option>Sjukvårdsförsäkring PA Silver (självrisk 1000 kr) 12 mån. karens, 20% rabatt (EA)</option>
                      <option>Sjukvårdsförsäkring PA Silver (självrisk 1500 kr) 12 mån. karens, 20% rabatt (EA)</option>
                      <option>Sjukvårdsförsäkring PA Silver Barn (en/flerbarn, självrisk 1500 kr) 12 mån. karens, 20% rabatt (EA)</option>
                      <option>Sjukvårdsförsäkring PA Silver Barn (enbarn, självrisk 1000 kr) 12 mån. karens, 20% rabatt (EA)</option>
                      <option>Sjukvårdsförsäkring PA Silver Barn (flerbarn, självrisk 1000 kr) 12 mån. karens, 20% rabatt (EA)</option>
                      <option>Sjukvårdsförsäkring (självrisk 750 kr) (LF)</option>
                      <option>Sjukvårdsförsäkring BAS (självrisk 750 kr) (LF)</option>
                    </select>
                  </div>
                  {/* Sjuk & Olycksfall + PBB-val */}
                  <div style={{ flex: "1 1 100%", marginBottom: 14 }}>
                    <label style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 5 }}>Sjuk & Olycksfallsförsäkring</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
                      <select value={nt.glSjukOlycka} onChange={e => updNt("glSjukOlycka", e.target.value)}
                        style={{ padding: "9px 12px", border: `1.5px solid ${C.border}`, borderRadius: 6, fontSize: 12, color: C.text, outline: "none", fontFamily: "inherit", background: "#fff", cursor: "pointer" }}>
                        <option value="">— Välj bolag —</option>
                        <option value="EA">Euro Accident (EA)</option>
                        <option value="LF">Länsförsäkringar (LF)</option>
                      </select>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <select value={nt.glSjukOlyckaPBB} onChange={e => updNt("glSjukOlyckaPBB", e.target.value)}
                          style={{ padding: "9px 12px", border: `1.5px solid ${C.border}`, borderRadius: 6, fontSize: 12, color: C.text, outline: "none", fontFamily: "inherit", background: "#fff", cursor: "pointer", minWidth: 80 }}>
                          {[10,20,30,40,50].map(n => <option key={n} value={String(n)}>{n} PBB</option>)}
                        </select>
                      </div>
                    </div>
                    {nt.glSjukOlycka && <div style={{ marginTop: 5, color: C.textLight, fontSize: 10 }}>
                      Försäkringsbelopp: {nt.glSjukOlyckaPBB} × 57 300 kr = {(Number(nt.glSjukOlyckaPBB) * 57300).toLocaleString("sv-SE")} kr
                    </div>}
                  </div>
                  {/* Livförsäkring + PBB-val */}
                  <div style={{ flex: "1 1 100%", marginBottom: 14 }}>
                    <label style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 5 }}>Livförsäkring</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
                      <select value={nt.glLiv} onChange={e => updNt("glLiv", e.target.value)}
                        style={{ padding: "9px 12px", border: `1.5px solid ${C.border}`, borderRadius: 6, fontSize: 12, color: C.text, outline: "none", fontFamily: "inherit", background: "#fff", cursor: "pointer" }}>
                        <option value="">— Välj bolag —</option>
                        <option value="EA">Euro Accident (EA)</option>
                        <option value="LF">Länsförsäkringar (LF)</option>
                      </select>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <select value={nt.glLivPBB} onChange={e => updNt("glLivPBB", e.target.value)}
                          style={{ padding: "9px 12px", border: `1.5px solid ${C.border}`, borderRadius: 6, fontSize: 12, color: C.text, outline: "none", fontFamily: "inherit", background: "#fff", cursor: "pointer", minWidth: 80 }}>
                          {Array.from({length: 12}, (_, i) => i + 1).map(n => <option key={n} value={String(n)}>{n} PBB</option>)}
                        </select>
                      </div>
                    </div>
                    {nt.glLiv && <div style={{ marginTop: 5, color: C.textLight, fontSize: 10 }}>
                      Försäkringsbelopp: {nt.glLivPBB} × 57 300 kr = {(Number(nt.glLivPBB) * 57300).toLocaleString("sv-SE")} kr
                    </div>}
                  </div>
                </div>
              </div>
            )}

            {/* ── Kassplacering sub-form ── */}
            {nt.kassplacering && (
              <div style={{ background: C.tanLight, border: `1.5px solid ${C.tan}`, borderRadius: 9, padding: "18px 20px", marginBottom: 12 }}>
                <div style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Kassplacering — detaljer</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  {/* Insättningstyp */}
                  <div style={{ flex: "1 1 100%", marginBottom: 4 }}>
                    <label style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Insättningstyp</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[{ val: "engång", label: "Engångsinsättning" }, { val: "månadsvis", label: "Månadsinsättning" }].map(t => (
                        <label key={t.val} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 16px", border: `1.5px solid ${nt.kassInsättningsTyp === t.val ? C.navy : C.border}`, borderRadius: 7, cursor: "pointer", background: nt.kassInsättningsTyp === t.val ? C.goldLight : "#fff", flex: 1, justifyContent: "center" }}>
                          <input type="radio" name="kassTyp" value={t.val} checked={nt.kassInsättningsTyp === t.val} onChange={() => updNt("kassInsättningsTyp", t.val)} style={{ accentColor: C.navy }} />
                          <span style={{ fontSize: 12, fontWeight: 600, color: nt.kassInsättningsTyp === t.val ? C.navy : C.textMid }}>{t.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* Premie */}
                  <div style={{ flex: "1 1 100%", marginBottom: 4 }}>
                    <label style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 5 }}>
                      Premie / {nt.kassInsättningsTyp === "engång" ? "engång" : "mån"}
                    </label>
                    <div style={{ display: "flex", alignItems: "center", background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
                      <input type="number" value={nt.kassPremie} placeholder="0" min={0} step={10000}
                        onChange={e => updNt("kassPremie", e.target.value)}
                        style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 13, fontWeight: 600, padding: "9px 12px", fontFamily: "inherit" }} />
                      <span style={{ color: C.textLight, padding: "9px 12px", fontSize: 11, borderLeft: `1px solid ${C.border}` }}>kr</span>
                    </div>
                  </div>
                  {/* Förvaltningsform */}
                  <div style={{ flex: "1 1 100%", marginBottom: 4 }}>
                    <label style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Förvaltningsform</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[{ val: "traditionell", label: "Traditionell" }, { val: "fond", label: "Fondförsäkring" }, { val: "kombinerad", label: "Kombinerad" }].map(t => (
                        <button key={t.val} onClick={() => updNt("kassForvaltning", t.val)}
                          style={{ flex: 1, padding: "9px 8px", borderRadius: 7, border: `1.5px solid ${nt.kassForvaltning === t.val ? C.navy : C.border}`, background: nt.kassForvaltning === t.val ? C.navy : "#fff", color: nt.kassForvaltning === t.val ? "#fff" : C.textMid, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Fördelning vid kombinerad */}
                  {nt.kassForvaltning === "kombinerad" && (
                    <div style={{ flex: "1 1 100%", background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 16px" }}>
                      <label style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Fördelning Traditionell / Fond</label>
                      <input type="range" min={0} max={100} step={5} value={nt.kassTradPct}
                        onChange={e => updNt("kassTradPct", Number(e.target.value))}
                        style={{ width: "100%", accentColor: C.navy, marginBottom: 10 }} />
                      <div style={{ display: "flex", gap: 8 }}>
                        <div style={{ flex: nt.kassTradPct, background: C.navy, borderRadius: 4, padding: "7px 0", textAlign: "center", color: "#fff", fontSize: 11, fontWeight: 700, minWidth: 28, transition: "flex 0.2s" }}>{nt.kassTradPct}% Trad</div>
                        <div style={{ flex: 100 - nt.kassTradPct, background: C.gold, borderRadius: 4, padding: "7px 0", textAlign: "center", color: "#fff", fontSize: 11, fontWeight: 700, minWidth: 28, transition: "flex 0.2s" }}>{100 - nt.kassTradPct}% Fond</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <FSect title="Önskade villkor">
            <FInput label="Önskat startdatum" value={nt.startdatum} onChange={v => updNt("startdatum", v)} placeholder="2025-01-01" half type="date" />
          </FSect>

          <FSect title="Förmedlare">
            <FInput label="Förmedlarens namn" value={nt.formedlarNamn} onChange={v => updNt("formedlarNamn", v)} placeholder="Erik Svensson" half />
            <FInput label="Telefon" value={nt.formedlarTel} onChange={v => updNt("formedlarTel", v)} placeholder="070-000 00 00" half />
            <FInput label="E-post" value={nt.formedlarEmail} onChange={v => updNt("formedlarEmail", v)} placeholder="erik@norrfinans.se" type="email" />
          </FSect>

          <FSect title="Noteringar">
            <FTextarea label="Övrig information / önskemål" value={nt.noteringar} onChange={v => updNt("noteringar", v)} rows={4} />
          </FSect>

          {/* Send buttons */}
          <button onClick={handleSend}
            style={{ width: "100%", marginTop: 8, padding: "13px 20px", background: C.navy, border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            📄 Generera PDF
          </button>
          {submitted && (
            <div style={{ marginTop: 12, padding: "10px 16px", background: "#ECFDF5", border: "1px solid #6EE7B7", borderRadius: 7, color: "#065F46", fontSize: 12, fontWeight: 600 }}>
              ✓ PDF öppnas — välj Spara som PDF eller Skriv ut för att bifoga i mejl
            </div>
          )}
        </div>
      )}

      {/* ÄNDRING FORM */}
      {mode === "andring" && (
        <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: "28px 28px" }}>
          <FSect title="Kund">
            <FInput label="Företagsnamn" value={an.foretagsnamn} onChange={v => updAn("foretagsnamn", v)} placeholder="AB Exempel" half />
            <FInput label="Organisationsnummer" value={an.orgnr} onChange={v => updAn("orgnr", v)} placeholder="556123-4567" half />
            <FInput label="Kontaktperson" value={an.kontaktperson} onChange={v => updAn("kontaktperson", v)} placeholder="Anna Andersson" half />
            <FInput label="Telefon" value={an.kontaktTel} onChange={v => updAn("kontaktTel", v)} placeholder="070-000 00 00" half />
            <FInput label="E-post" value={an.kontaktEmail} onChange={v => updAn("kontaktEmail", v)} placeholder="anna@exempel.se" type="email" />
          </FSect>

          <FSect title="Ändring">
            <div style={{ flex: "1 1 100%", marginBottom: 4 }}>
              <label style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Typ av ändring</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Tillkommande anställd", "Avgående anställd", "Löneändring", "Utöka försäkring", "Reducera försäkring", "Byte av bolag", "Övrig ändring"].map(t => (
                  <button key={t} onClick={() => updAn("andringTyp", t)}
                    style={{ padding: "8px 14px", borderRadius: 6, border: `1.5px solid ${an.andringTyp === t ? C.navy : C.border}`, background: an.andringTyp === t ? "#EEF2FF" : "#fff", color: an.andringTyp === t ? C.navy : C.textMid, fontSize: 12, fontWeight: an.andringTyp === t ? 700 : 400, cursor: "pointer", fontFamily: "inherit" }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <FInput label="Befintlig policenr / avtalsnr" value={an.befintligPolice} onChange={v => updAn("befintligPolice", v)} placeholder="t.ex. 12345678" />
            <FTextarea label="Beskriv ändringen" value={an.beskrivning} onChange={v => updAn("beskrivning", v)} rows={5} />
          </FSect>

          <FSect title="Förmedlare">
            <FInput label="Förmedlarens namn" value={an.formedlarNamn} onChange={v => updAn("formedlarNamn", v)} placeholder="Erik Svensson" half />
            <FInput label="Telefon" value={an.formedlarTel} onChange={v => updAn("formedlarTel", v)} placeholder="070-000 00 00" half />
            <FInput label="E-post" value={an.formedlarEmail} onChange={v => updAn("formedlarEmail", v)} placeholder="erik@norrfinans.se" type="email" />
          </FSect>

          <FSect title="Noteringar">
            <FTextarea label="Övrig information" value={an.noteringar} onChange={v => updAn("noteringar", v)} rows={3} />
          </FSect>

          <button onClick={handleSend}
            style={{ width: "100%", marginTop: 8, padding: "13px 20px", background: C.navy, border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            📄 Generera PDF
          </button>
          {submitted && (
            <div style={{ marginTop: 12, padding: "10px 16px", background: "#ECFDF5", border: "1px solid #6EE7B7", borderRadius: 7, color: "#065F46", fontSize: 12, fontWeight: 600 }}>
              ✓ PDF öppnas — välj Spara som PDF eller Skriv ut för att bifoga i mejl
            </div>
          )}
        </div>
      )}
    </div>
  );
};


function MainApp({ onLogout }) {
    const [tab, setTab] = useState("kalkylator");
  const [förenkladVy, setFörenkladVy] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [intäkterMode, setIntäkterMode] = useState("timbaserat"); // "timbaserat" | "omsättning"
  const [timpris, setTimpris] = useState(0);
  const [timmar, setTimmar] = useState(1832);
  const [debiteringsgrad, setDebiteringsgrad] = useState(0);
  const [direktOmsättning, setDirektOmsättning] = useState(0);
  const [vinstmarginal, setVinstmarginal] = useState(0);
  const [bruttolön, setBruttolön] = useState(0);
  const [bruttolönÅr, setBruttolönÅr] = useState(0);
  const [lönPeriod, setLönPeriod] = useState("mån");
  const [pensionMån, setPensionMån] = useState(0);
  const [antalÄgare, setAntalÄgare] = useState(1);
  const [användKompletteringsregel, setAnvändKompletteringsregel] = useState(false);

  // Avdragsrätt tjänstepension — beräknas per ägare individuellt
  const PBB_2026 = 57300; // Prisbasbelopp 2026
  const MAX_AVDRAG_PER_PERSON = 10 * PBB_2026; // 573 000 kr
  const lönPerÄgareÅr = lönPeriod === "mån" ? bruttolön * 12 : bruttolönÅr;
  const avdragsgilltPerÄgare = Math.min(lönPerÄgareÅr * 0.35, MAX_AVDRAG_PER_PERSON);
  const totalAvdragsgillt = avdragsgilltPerÄgare * antalÄgare;
  const pensionÅr = pensionMån * 12 * antalÄgare;
  const överskjutandePension = Math.max(0, pensionÅr - totalAvdragsgillt);
  const visaPensionVarning = pensionMån > 0 && överskjutandePension >= 1;
  const [övriga, setÖvriga] = useState([
    { label: "Hyra / kontorsplats", amount: 0 },
    { label: "Mjukvara & verktyg", amount: 0 },
    { label: "Försäkringar", amount: 0 },
  ]);
  const [utdelning, setUtdelning] = useState(0);
  const [buffertPct, setBuffertPct] = useState(0);
  const [buffertMode, setBuffertMode] = useState("kr"); // "pct" | "kr"
  const [buffertKr, setBuffertKr] = useState(0);
  const [övrigaPeriod, setÖvrigaPeriod] = useState("mån"); // "mån" | "år"

  const r = useMemo(() => {
    const faktTim = timmar * (debiteringsgrad / 100);
    const omsättning = intäkterMode === "timbaserat"
      ? timpris * faktTim
      : direktOmsättning;
    const lönTotal = (lönPeriod === "mån" ? bruttolön * 12 : bruttolönÅr) * 1.3142 * antalÄgare;
    const pension = pensionMån * 12 * antalÄgare;
    const pensionSLP = pension * 0.2426;
    const pensionTotal = pension + pensionSLP;
    const övrigaRaw = övriga.reduce((s, k) => s + (k.amount || 0), 0);
    const övrigaSum = övrigaPeriod === "mån" ? övrigaRaw * 12 : övrigaRaw;

    const ebit = omsättning - lönTotal - pensionTotal - övrigaSum;

    const bolagsskatt = Math.max(0, ebit) * 0.206;
    const resultatEfterSkatt = ebit - bolagsskatt;
    const buffert = buffertMode === "pct"
      ? Math.max(0, ebit) * (buffertPct / 100)
      : buffertKr;
    const kvarEfterBuffert = resultatEfterSkatt - buffert;
    const kvarEfterUtdelning = kvarEfterBuffert - utdelning;
    const tillgängligtKF_år = kvarEfterUtdelning;
    const tillgängligtKF_mån = tillgängligtKF_år / 12;
    const totalKostnader = lönTotal + pensionTotal + övrigaSum;
    return {
      omsättning, lönTotal, pension, pensionSLP, pensionTotal, övrigaSum, totalKostnader,
      ebit, bolagsskatt, resultatEfterSkatt,
      buffert, kvarEfterBuffert, kvarEfterUtdelning, tillgängligtKF_år, tillgängligtKF_mån,
      utdelningNetto: utdelning * 0.8, faktTim
    };
  }, [intäkterMode, timpris, timmar, debiteringsgrad, direktOmsättning, vinstmarginal, bruttolön, bruttolönÅr, lönPeriod, antalÄgare, pensionMån, övriga, övrigaPeriod, utdelning, buffertPct, buffertMode, buffertKr]);

  const generatePdf = (typ) => {
    setShowPdfModal(false);
    const datum = new Date().toLocaleDateString("sv-SE");
    const tid = new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });

    const fmtH = (n) => new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 }).format(n);

    const row = (label, value, alt, red) =>
      `<div class="row${alt ? " alt" : ""}"><div class="label">${label}</div><div class="value${red ? " red" : ""}">${value}</div></div>`;
    const sec = (title, body) =>
      `<div class="section"><div class="sec-head">${title}</div><div class="sec-body">${body}</div></div>`;

    const basRows =
      row("Omsättning / år", fmtH(r.omsättning), false) +
      row("Lön & arbetsgivaravgift", "−" + fmtH(r.lönTotal), true, true) +
      row("Tjänstepension inkl. SLP", "−" + fmtH(r.pensionTotal), false, true) +
      row("Övriga kostnader", "−" + fmtH(r.övrigaSum), true, true) +
      row("Resultat före skatt (EBIT)", fmtH(r.ebit), false) +
      row("Bolagsskatt 20,6 %", "−" + fmtH(r.bolagsskatt), true, true) +
      row("Resultat efter skatt", fmtH(r.resultatEfterSkatt), false) +
      row("Planerad utdelning (brutto)", "−" + fmtH(utdelning), true, true) +
      row("Likviditetsbuffert", "−" + fmtH(r.buffert), false, true) +
      row("Likviditet möjlig för placering", fmtH(r.kvarEfterUtdelning), true);

    const kfRows =
      row("Möjlig KF-inbetalning / mån", fmtH(r.tillgängligtKF_mån), false) +
      row("Möjlig KF-inbetalning / år", fmtH(r.tillgängligtKF_år), true);

    let extraRows = "";
    if (typ === "avancerad") {
      extraRows = sec("Intäktsdetaljer",
        row("Intäktsmodell", intäkterMode === "timbaserat" ? "Timbaserat" : "Omsättning", false) +
        (intäkterMode === "timbaserat"
          ? row("Timpris", fmtH(timpris), true) +
            row("Timmar / år", timmar + " tim", false) +
            row("Debiteringsgrad", debiteringsgrad + " %", true) +
            row("Fakturerbara timmar", Math.round(r.faktTim) + " tim", false)
          : "") +
        row("Omsättning / år", fmtH(r.omsättning), true)
      ) + sec("Personalkostnader",
        row("Antal ägare", antalÄgare + " st", false) +
        row("Bruttolön / mån", fmtH(lönPeriod === "mån" ? bruttolön : Math.round(bruttolönÅr / 12)), true) +
        row("Total lönekostnad / år inkl. AG-avg", fmtH(r.lönTotal), false) +
        row("Pensionspremie / mån", fmtH(pensionMån), true) +
        row("Särskild löneskatt (SLP 24,26 %)", fmtH(r.pensionSLP), false) +
        row("Total pensionskostnad / år", fmtH(r.pensionTotal), true)
      ) + sec("Övriga kostnader",
        övriga.filter(k => k.amount > 0).map((k, i) =>
          row(k.label || ("Post " + (i + 1)), fmtH(k.amount) + " / " + övrigaPeriod, i % 2 !== 0)
        ).join("") +
        row("Totalt övriga kostnader / år", fmtH(r.övrigaSum), övriga.filter(k => k.amount > 0).length % 2 === 0)
      );
    }

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Likviditetskalkylator</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',Arial,sans-serif;font-size:11px;color:#2A1015;background:#fff;padding:32px 40px}
.header{display:flex;align-items:center;gap:14px;margin-bottom:24px;padding-bottom:16px;border-bottom:3px solid #9B182D}
.logo{width:40px;height:40px;background:#E73331;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px;font-weight:900;flex-shrink:0}
.brand{color:#9B182D;font-size:17px;font-weight:800;letter-spacing:1px}
.sub{color:#A87880;font-size:9px;letter-spacing:2px;text-transform:uppercase}
.doc-title{margin-left:auto;text-align:right}
.doc-title .typ{font-size:12px;font-weight:700;color:#9B182D}
.doc-title .dat{font-size:10px;color:#A87880;margin-top:2px}
.section{margin-bottom:14px}
.sec-head{background:#9B182D;color:#fff;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:7px 14px;border-radius:4px 4px 0 0}
.sec-body{border:1px solid #E0D8CC;border-top:none;border-radius:0 0 4px 4px;overflow:hidden}
.row{display:flex;border-bottom:1px solid #F0EDE6}
.row:last-child{border-bottom:none}
.row.alt{background:#F5F3EE}
.label{width:250px;flex-shrink:0;padding:7px 14px;color:#6B3040;font-weight:600;font-size:10px}
.value{padding:7px 14px;color:#2A1015;font-size:10px;flex:1;font-weight:700;text-align:right}
.value.red{color:#9B182D}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.card{background:#F5F3EE;border:1px solid #E0D8CC;border-radius:6px;padding:12px 16px}
.card-label{color:#A87880;font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px}
.card-value{color:#9B182D;font-size:17px;font-weight:800}
.card-sub{color:#A87880;font-size:9px;margin-top:2px}
.card.dark{background:#9B182D;border-color:#7A1020}
.card.dark .card-label{color:rgba(255,255,255,0.6)}
.card.dark .card-value{color:#fff;font-size:20px}
.card.dark .card-sub{color:rgba(255,255,255,0.45)}
.footer{margin-top:24px;padding-top:10px;border-top:1px solid #E0D8CC;color:#A87880;font-size:9px;display:flex;justify-content:space-between}
@media print{body{padding:20px}}
</style></head><body>
<div class="header">
  <div class="logo">N</div>
  <div><div class="brand">Norrfinans</div><div class="sub">Rådgivningsverktyg</div></div>
  <div class="doc-title">
    <div class="typ">Likviditetskalkylator — ${typ === "förenklad" ? "Förenklad" : "Avancerad"}</div>
    <div class="dat">Genererad ${datum} kl. ${tid}</div>
  </div>
</div>
<div class="grid2">
  <div class="card"><div class="card-label">Omsättning / år</div><div class="card-value">${fmtH(r.omsättning)}</div></div>
  <div class="card"><div class="card-label">Resultat efter skatt</div><div class="card-value">${fmtH(r.resultatEfterSkatt)}</div></div>
  <div class="card dark"><div class="card-label">KF-inbetalning möjlig / år</div><div class="card-value">${fmtH(r.tillgängligtKF_år)}</div><div class="card-sub">${fmtH(r.tillgängligtKF_mån)} / mån</div></div>
  <div class="card"><div class="card-label">Likviditetsbuffert</div><div class="card-value">${fmtH(r.buffert)}</div><div class="card-sub">${buffertMode === "pct" ? buffertPct + " % av EBIT" : "Fast belopp"}</div></div>
</div>
${sec("Resultatöversikt", basRows)}
${sec("Företagsägd Kapitalförsäkring", kfRows)}
${extraRows}
<div class="footer"><span>Norrfinans — Konfidentiellt</span><span>${datum}</span></div>
</body></html>`;

    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); w.focus(); setTimeout(() => w.print(), 500); }
  };

  const PdfModal = () => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(42,16,21,0.65)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={() => setShowPdfModal(false)}>
      <div style={{ background: "#fff", borderRadius: 14, padding: "32px 32px 28px", width: 480, boxShadow: "0 24px 60px rgba(155,24,45,0.28)", border: `1px solid ${C.border}` }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ color: C.gold, fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Likviditetskalkylator</div>
            <div style={{ color: C.navy, fontSize: 18, fontWeight: 800 }}>Generera PDF</div>
          </div>
          <button onClick={() => setShowPdfModal(false)} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 6, color: C.textLight, cursor: "pointer", padding: "6px 10px", fontSize: 14 }}>✕</button>
        </div>
        <div style={{ color: C.textMid, fontSize: 12, marginBottom: 22, lineHeight: 1.6 }}>
          Välj vilken typ av PDF som ska genereras. Dokumentet öppnas i en ny flik — välj <strong>Spara som PDF</strong> eller <strong>Skriv ut</strong>.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { typ: "förenklad", emoji: "📄", rubrik: "Förenklad", desc: "Resultatöversikt + KF-sammanfattning. Passar som kundpresentation." },
            { typ: "avancerad", emoji: "📊", rubrik: "Avancerad", desc: "Alla detaljer: intäkter, personalkostnader, övriga poster och KF-beräkning." },
          ].map(v => (
            <button key={v.typ} onClick={() => generatePdf(v.typ)}
              style={{ padding: "20px 18px", borderRadius: 10, border: `2px solid ${C.border}`, background: C.surface, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.navy; e.currentTarget.style.background = C.goldLight; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface; }}>
              <div style={{ fontSize: 26, marginBottom: 8 }}>{v.emoji}</div>
              <div style={{ color: C.navy, fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{v.rubrik}</div>
              <div style={{ color: C.textLight, fontSize: 11, lineHeight: 1.5 }}>{v.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: "kalkylator", label: "Likviditetskalkylator" },
    { id: "analys", label: "Likviditetsanalys" },
    { id: "sparande", label: "Sparande & Avkastning" },
    { id: "avgifter", label: "Avgiftskalkylator" },
    { id: "offert", label: "Offertjämförelse" },
    { id: "trad", label: "TRAD Avkastning" },
    { id: "trad-fond", label: "TRAD & Fond" },
    { id: "lönesumma", label: "Lönesumma" },
    { id: "arenden", label: "Ärenden" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif", color: C.text }}>
      <div style={{ background: C.navy, padding: "0 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ padding: "18px 0", borderRight: `1px solid rgba(255,255,255,0.08)`, paddingRight: 28, marginRight: 28 }}>
          <div style={{ color: "#CEC09E", fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Norrfinans</div>
        </div>
        <div style={{ display: "flex", gap: 2, flex: 1 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? "rgba(255,255,255,0.08)" : "transparent", border: "none", borderBottom: tab === t.id ? `2px solid ${C.gold}` : "2px solid transparent", color: tab === t.id ? "#fff" : "rgba(255,255,255,0.45)", padding: "20px 18px 18px", cursor: "pointer", fontSize: 12, fontWeight: 700, letterSpacing: 0.5, fontFamily: "inherit", transition: "all 0.2s" }}>{t.label}</button>
          ))}
        </div>
        <button onClick={onLogout} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, color: "rgba(255,255,255,0.55)", padding: "7px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.5, whiteSpace: "nowrap", transition: "all 0.2s" }}
          onMouseEnter={e => { e.target.style.borderColor = "rgba(255,255,255,0.5)"; e.target.style.color = "#fff"; }}
          onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.2)"; e.target.style.color = "rgba(255,255,255,0.55)"; }}>
          Logga ut
        </button>
      </div>
      <div style={{ height: 3, background: `linear-gradient(90deg,${C.gold},#E8B84B,${C.gold})` }} />

      {/* PDF Modal */}
      {showPdfModal && tab === "kalkylator" && <PdfModal />}

      {tab === "kalkylator" && (
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>

          {/* ── VY-TOGGLE BAR ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", background: C.surface, borderBottom: `1px solid ${C.border}`, boxShadow: "0 1px 3px rgba(155,24,45,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                onClick={() => setFörenkladVy(v => !v)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 18px", borderRadius: 6,
                  border: `1.5px solid ${förenkladVy ? C.gold : C.border}`,
                  background: förenkladVy ? C.goldLight : C.surface,
                  color: förenkladVy ? C.gold : C.textMid,
                  fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.15s"
                }}
              >
                <span style={{ fontSize: 14 }}>{förenkladVy ? "⚙️" : "✨"}</span>
                {förenkladVy ? "Avancerad vy" : "Förenklad vy"}
              </button>
              {förenkladVy && (
                <span style={{ color: C.textLight, fontSize: 11 }}>Visar förenklad vy — tryck för att se alla detaljer</span>
              )}
            </div>
          </div>

          {/* ── FÖRENKLAD VY ── */}
          {förenkladVy ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - 130px)" }}>

              {/* Kolumn 1: Intäkter + Lön */}
              <div style={{ padding: "24px 20px", borderRight: `1px solid ${C.border}` }}>
                <Section title="Intäkter">
                  <div style={{ display: "flex", gap: 6, marginBottom: 16, background: C.surface2, borderRadius: 7, padding: 4 }}>
                    {[{ id: "timbaserat", label: "⏱ Timbaserat" }, { id: "omsättning", label: "📊 Omsättning" }].map(m => (
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
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
                        <InfoChip label="Omsättning / mån" value={fmt(direktOmsättning / 12)} />
                        <InfoChip label="Resultat / år" value={fmt(r.ebit)} />
                      </div>
                    </>
                  )}
                </Section>
                <Section title="Lön & Arbetsgivaravgift">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, background: C.surface2, borderRadius: 7, padding: "10px 14px" }}>
                    <span style={{ color: C.textMid, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>Antal ägare</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => setAntalÄgare(v => Math.max(1, v - 1))} style={{ width: 28, height: 28, borderRadius: 6, border: `1.5px solid ${C.border}`, background: C.surface, color: C.navy, fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>−</button>
                      <span style={{ color: C.navy, fontSize: 16, fontWeight: 800, minWidth: 20, textAlign: "center" }}>{antalÄgare}</span>
                      <button onClick={() => setAntalÄgare(v => Math.min(10, v + 1))} style={{ width: 28, height: 28, borderRadius: 6, border: `1.5px solid ${C.border}`, background: C.surface, color: C.navy, fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>+</button>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                    {[{ id: "mån", label: "Månadsvis" }, { id: "år", label: "Årsvis" }].map(t => (
                      <button key={t.id} onClick={() => setLönPeriod(t.id)} style={{ flex: 1, padding: "7px", borderRadius: 5, border: `1.5px solid ${lönPeriod === t.id ? C.navy : C.border}`, background: lönPeriod === t.id ? C.navy : "transparent", color: lönPeriod === t.id ? "#fff" : C.textMid, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{t.label}</button>
                    ))}
                  </div>
                  <InputRow label={lönPeriod === "mån" ? "Bruttolön / månad" : "Bruttolön / år"} value={lönPeriod === "mån" ? bruttolön : bruttolönÅr} onChange={v => { if (lönPeriod === "mån") setBruttolön(v); else setBruttolönÅr(v); }} suffix={lönPeriod === "mån" ? "kr / mån" : "kr / år"} step={1000} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <InfoChip label="AG-avgift" value="31,42 %" />
                    <InfoChip label={antalÄgare > 1 ? `Lönekostnad / år (${antalÄgare} ägare)` : "Lönekostnad / år"} value={fmt((lönPeriod === "mån" ? bruttolön * 12 : bruttolönÅr) * 1.3142 * antalÄgare)} />
                  </div>
                  <div style={{ marginTop: 8 }}><InfoChip label={lönPeriod === "mån" ? "Motsvarar årslön" : "Motsvarar månadsslön"} value={lönPeriod === "mån" ? fmt(bruttolön * 12) : fmt(Math.round(bruttolönÅr / 12))} /></div>
                </Section>
                <Section title="Tjänstepension">
                  <button onClick={() => {
                    const lönÅr = lönPeriod === "mån" ? bruttolön * 12 : bruttolönÅr;
                    const maxÅr = Math.min(lönÅr * 0.35, MAX_AVDRAG_PER_PERSON);
                    setPensionMån(Math.round(maxÅr / 12));
                  }} style={{ width: "100%", marginBottom: 12, padding: "9px 14px", borderRadius: 7, border: `1.5px solid ${C.tan}`, background: C.tanLight, color: C.navy, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span>🎯 Max pensionsavsättning</span>
                    <span style={{ color: C.textMid, fontSize: 10 }}>{fmt(Math.round(Math.min((lönPeriod === "mån" ? bruttolön * 12 : bruttolönÅr) * 0.35, MAX_AVDRAG_PER_PERSON) / 12))} / mån</span>
                  </button>                  <InputRow label="Premie tjänstepension" value={pensionMån} onChange={setPensionMån} suffix="kr / mån" step={500} min={0} hint="Bolagets kostnad" />
                  <InfoChip label={antalÄgare > 1 ? `Pensionskostnad / år (${antalÄgare} ägare)` : "Pensionskostnad / år"} value={fmt(pensionMån * 12 * antalÄgare)} />
                  {pensionMån > 0 && <div style={{ marginTop: 8 }}><InfoChip label="Inkl. SLP (24,26%) — totalkostnad" value={fmt(pensionMån * 12 * antalÄgare * 1.2426)} /></div>}

                  {/* ── Avdragsrättsvarning ── */}
                  {visaPensionVarning && (
                    <div style={{ marginTop: 10, background: "#FEF2F2", border: `1.5px solid ${C.red}`, borderRadius: 8, padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: C.red, fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Avdragsrätten kan överskridas</div>
                          <div style={{ color: C.textMid, fontSize: 11, lineHeight: 1.7, marginBottom: 10 }}>
                            Enligt <strong>huvudregeln</strong> är max avdragsgillt <strong>{fmt(avdragsgilltPerÄgare)}/ägare/år</strong> (35 % av lön, max 10 PBB = {fmt(MAX_AVDRAG_PER_PERSON)}).
                            Nuvarande premie överstiger detta med <strong style={{ color: C.red }}>{fmt(överskjutandePension)}</strong> totalt.
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
                            {[
                              { label: "Avdragsgillt/ägare", value: fmt(avdragsgilltPerÄgare) },
                              { label: `Totalt avdragsgillt (${antalÄgare} ägare)`, value: fmt(totalAvdragsgillt) },
                              { label: "Överskjutande belopp", value: fmt(överskjutandePension), red: true },
                            ].map((k, i) => (
                              <div key={i} style={{ background: k.red ? "#FEE2E2" : C.surface, border: `1px solid ${k.red ? "#FECACA" : C.border}`, borderRadius: 6, padding: "8px 10px" }}>
                                <div style={{ color: C.textLight, fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 3 }}>{k.label}</div>
                                <div style={{ color: k.red ? C.red : C.navy, fontSize: 13, fontWeight: 800, fontFamily: "monospace" }}>{k.value}</div>
                              </div>
                            ))}
                          </div>
                          <div style={{ borderTop: `1px solid #FECACA`, paddingTop: 10 }}>
                            <div style={{ color: C.textMid, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>Tillämpa kompletteringsregeln?</div>
                            <div style={{ color: C.textMid, fontSize: 10, lineHeight: 1.7, marginBottom: 10 }}>
                              Kompletteringsregeln kan i vissa fall tillåta högre avdrag — exempelvis vid <strong>förtida avgång</strong> från anställning eller när en anställd historiskt haft en <strong>otillräckligt tryggad pensionsutfästelse</strong> ("köpa i kapp"). Regeln gäller <em>engångspremier</em> och Skatteverket är restriktivt med tillämpningen. Den är <strong>inte</strong> tillämplig vid exempelvis bonusväxling.
                            </div>
                            <button onClick={() => setAnvändKompletteringsregel(v => !v)}
                              style={{ width: "100%", padding: "10px 14px", borderRadius: 7, border: `1.5px solid ${användKompletteringsregel ? C.navy : C.border}`, background: användKompletteringsregel ? C.navy : "transparent", color: användKompletteringsregel ? "#fff" : C.textMid, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ fontSize: 16 }}>{användKompletteringsregel ? "✓" : "○"}</span>
                              <span>Använd kompletteringsregeln</span>
                            </button>
                            {användKompletteringsregel && (
                              <div style={{ marginTop: 10, background: "#FFF0F0", border: `1px solid ${C.gold}`, borderRadius: 6, padding: "10px 14px" }}>
                                <div style={{ color: C.gold, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>⚖️ Kompletteringsregeln aktiv</div>
                                <div style={{ color: C.textMid, fontSize: 10, lineHeight: 1.7 }}>
                                  Avdraget behandlas som tillåtet enligt kompletteringsregeln. Säkerställ att förutsättningarna är uppfyllda och dokumentera beslutsunderlaget. Konsultera en skatterådgivare innan avsättning görs.
                                </div>
                              </div>
                            )}
                            {!användKompletteringsregel && (
                              <div style={{ marginTop: 8, color: C.textLight, fontSize: 10, lineHeight: 1.6 }}>
                                Det överskjutande beloppet ({fmt(överskjutandePension)}) är <strong>ej avdragsgillt</strong> och påverkar bolagets skatteberäkning.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Section>
                <Section title="Övriga kostnader">
                  <div style={{ display: "flex", gap: 6, marginBottom: 12, background: C.surface2, borderRadius: 7, padding: 4 }}>
                    {[{ id: "mån", label: "Månad" }, { id: "år", label: "År" }].map(t => (
                      <button key={t.id} onClick={() => setÖvrigaPeriod(t.id)} style={{ flex: 1, padding: "7px", borderRadius: 5, border: "none", background: övrigaPeriod === t.id ? C.navy : "transparent", color: övrigaPeriod === t.id ? "#fff" : C.textMid, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{t.label}</button>
                    ))}
                  </div>
                  <OvrigKostnad items={övriga} onChange={setÖvriga} period={övrigaPeriod} />
                  <div style={{ marginTop: 4 }}><InfoChip label="Totala övriga kostnader / år" value={fmt(r.övrigaSum)} /></div>
                </Section>

              </div>

              {/* Kolumn 2: Förenklad resultat + KF */}
              <div style={{ padding: "24px 20px", background: "#F2EDE3" }}>
                {/* Förenklad resultatöversikt */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
                  <span style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Resultatöversikt — Helår</span>
                </div>
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "18px 20px", marginBottom: 20, boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>Omsättning</span>
                    <span style={{ color: C.text, fontSize: 16, fontWeight: 700, fontFamily: "monospace" }}>{fmt(r.omsättning)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div>
                      <div style={{ color: C.textMid, fontSize: 13 }}>Totala kostnader / år</div>
                      <div style={{ color: C.textLight, fontSize: 10, marginTop: 2 }}>Lön {fmt(r.lönTotal)} · Pension {fmt(r.pensionTotal)} · Övrigt {fmt(r.övrigaSum)}</div>
                    </div>
                    <span style={{ color: C.red, fontSize: 14, fontFamily: "monospace" }}>−{fmt(r.totalKostnader)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div>
                      <div style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>Resultat före skatt</div>
                      <div style={{ color: C.textLight, fontSize: 11, marginTop: 2 }}>Före bolagsskatt</div>
                    </div>
                    <span style={{ color: r.ebit >= 0 ? C.green : C.red, fontSize: 16, fontWeight: 700, fontFamily: "monospace" }}>{fmt(r.ebit)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div>
                      <div style={{ color: C.textMid, fontSize: 13 }}>Bolagsskatt</div>
                      <div style={{ color: C.textLight, fontSize: 11, marginTop: 2 }}>20,6 % av EBIT</div>
                    </div>
                    <span style={{ color: C.red, fontSize: 14, fontFamily: "monospace" }}>−{fmt(r.bolagsskatt)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div>
                      <div style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>Resultat efter skatt</div>
                    </div>
                    <span style={{ color: r.resultatEfterSkatt >= 0 ? C.green : C.red, fontSize: 16, fontWeight: 700, fontFamily: "monospace" }}>{fmt(r.resultatEfterSkatt)}</span>
                  </div>
                </div>

                {/* Utdelning & Buffert — inline */}
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "16px 20px", marginBottom: 14, boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 3, height: 14, background: C.gold, borderRadius: 2 }} />
                    <span style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.3, textTransform: "uppercase" }}>Utdelning & Buffert</span>
                  </div>
                  <InputRow label="Planerad utdelning brutto / år" value={utdelning} onChange={setUtdelning} suffix="kr / år" step={10000} hint="Skatt 20 % (3:12)" />
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ color: C.textMid, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>Likviditetsbuffert</div>
                    <div style={{ display: "flex", gap: 6, marginBottom: 8, background: C.surface2, borderRadius: 7, padding: 4 }}>
                      {[{ id: "pct", label: "% av resultat" }, { id: "kr", label: "Fast belopp (kr)" }].map(t => (
                        <button key={t.id} onClick={() => setBuffertMode(t.id)} style={{ flex: 1, padding: "7px", borderRadius: 5, border: "none", background: buffertMode === t.id ? C.navy : "transparent", color: buffertMode === t.id ? "#fff" : C.textMid, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{t.label}</button>
                      ))}
                    </div>
                    {buffertMode === "pct"
                      ? <InputRow label="Buffert % av resultat" value={buffertPct} onChange={setBuffertPct} suffix="%" step={1} min={0} max={100} />
                      : <InputRow label="Buffertbelopp" value={buffertKr} onChange={setBuffertKr} suffix="kr / år" step={10000} />
                    }
                  </div>
                  <InfoChip label="Buffertbelopp / år" value={fmt(r.buffert)} />
                </div>

                {/* Disponering — buffert + kvar i bolaget */}
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "18px 20px", marginBottom: 20, boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ color: C.text, fontSize: 14 }}>Total likviditet bolaget</span>
                    <span style={{ color: C.text, fontSize: 16, fontWeight: 700, fontFamily: "monospace" }}>{fmt(r.resultatEfterSkatt)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div>
                      <div style={{ color: C.textMid, fontSize: 13 }}>Varav likviditetsbuffert</div>
                      {r.buffert > 0 && <div style={{ color: C.textLight, fontSize: 10, marginTop: 2 }}>{buffertMode === "pct" ? `${buffertPct} % av EBIT` : `Fast belopp`}</div>}
                    </div>
                    <span style={{ color: C.textMid, fontSize: 14, fontFamily: "monospace" }}>{fmt(r.buffert)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
                    <div>
                      <div style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>Likviditet möjlig för placering</div>
                      <div style={{ color: C.textLight, fontSize: 11, marginTop: 2 }}>Efter utdelning ({fmt(utdelning)})</div>
                    </div>
                    <span style={{ color: r.kvarEfterUtdelning >= 0 ? C.green : C.red, fontSize: 16, fontWeight: 700, fontFamily: "monospace" }}>{fmt(r.kvarEfterUtdelning)}</span>
                  </div>
                </div>

                {/* Sparande i KF */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
                  <div>
                    <div style={{ color: C.gold, fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Företagsägd</div>
                    <div style={{ color: C.navy, fontSize: 13, fontWeight: 700 }}>Kapitalförsäkring — Bolagets inbetalning</div>
                  </div>
                </div>
                <div style={{ background: C.goldLight, border: `1px solid ${C.gold}`, borderRadius: 7, padding: "10px 14px", marginBottom: 12 }}>
                  <div style={{ color: C.textMid, fontSize: 11, lineHeight: 1.6 }}>Premien betalas med bolagets <strong>beskattade medel</strong> och är ej avdragsgill. Kapitalet ägs av bolaget. Avkastning beskattas med avkastningsskatt (~1,3–2%/år).</div>
                </div>
                <KFRow label="Möjlig inbetalning / mån" value={r.tillgängligtKF_mån} />
                <KFRow label="Möjlig inbetalning / år" value={r.tillgängligtKF_år} highlight large />

                <button onClick={() => setTab("sparande")} style={{ width: "100%", marginTop: 16, padding: "13px", background: C.goldLight, border: `1.5px solid ${C.gold}`, borderRadius: 7, color: C.gold, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>📈 Se sparande & avkastning →</button>
                <button onClick={() => setShowPdfModal(true)} style={{ width: "100%", marginTop: 8, padding: "13px", background: C.navy, border: "none", borderRadius: 7, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>📄 Generera PDF</button>
              </div>
            </div>

          ) : (

          /* ── AVANCERAD VY (original) ── */
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 300px" }}>
            <div style={{ padding: "20px 16px", borderRight: `1px solid ${C.border}` }}>
              <Section title="Intäkter">
                <div style={{ display: "flex", gap: 6, marginBottom: 16, background: C.surface2, borderRadius: 7, padding: 4 }}>
                  {[{ id: "timbaserat", label: "⏱ Timbaserat" }, { id: "omsättning", label: "📊 Omsättning" }].map(m => (
                    <button key={m.id} onClick={() => setIntäkterMode(m.id)} style={{ flex: 1, padding: "8px 10px", borderRadius: 5, border: "none", background: intäkterMode === m.id ? C.navy : "transparent", color: intäkterMode === m.id ? "#fff" : C.textMid, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>{m.label}</button>
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
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
                      <InfoChip label="Omsättning / mån" value={fmt(direktOmsättning / 12)} />
                      <InfoChip label="Resultat / år" value={fmt(r.ebit)} />
                    </div>
                    <div style={{ marginTop: 8, background: C.goldLight, border: `1px solid ${C.gold}`, borderRadius: 6, padding: "9px 12px" }}>
                      <div style={{ color: C.gold, fontSize: 11, fontWeight: 700, marginBottom: 2 }}>OBS — marginalläge</div>
                      <div style={{ color: C.textMid, fontSize: 11, lineHeight: 1.6 }}>Bruttomarginal beräknas på omsättningen. Lön, pension & övriga kostnader dras sedan av separat för att ge EBIT.</div>
                    </div>
                  </>
                )}
              </Section>
              <Section title="Lön & Arbetsgivaravgift">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, background: C.surface2, borderRadius: 7, padding: "10px 14px" }}>
                  <span style={{ color: C.textMid, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>Antal ägare</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button onClick={() => setAntalÄgare(v => Math.max(1, v - 1))} style={{ width: 28, height: 28, borderRadius: 6, border: `1.5px solid ${C.border}`, background: C.surface, color: C.navy, fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>−</button>
                    <span style={{ color: C.navy, fontSize: 16, fontWeight: 800, minWidth: 20, textAlign: "center" }}>{antalÄgare}</span>
                    <button onClick={() => setAntalÄgare(v => Math.min(10, v + 1))} style={{ width: 28, height: 28, borderRadius: 6, border: `1.5px solid ${C.border}`, background: C.surface, color: C.navy, fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>+</button>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                  {[{ id: "mån", label: "Månadsvis" }, { id: "år", label: "Årsvis" }].map(t => (
                    <button key={t.id} onClick={() => setLönPeriod(t.id)} style={{ flex: 1, padding: "7px", borderRadius: 5, border: `1.5px solid ${lönPeriod === t.id ? C.navy : C.border}`, background: lönPeriod === t.id ? C.navy : "transparent", color: lönPeriod === t.id ? "#fff" : C.textMid, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{t.label}</button>
                  ))}
                </div>
                <InputRow label={lönPeriod === "mån" ? "Bruttolön / månad" : "Bruttolön / år"} value={lönPeriod === "mån" ? bruttolön : bruttolönÅr} onChange={v => { if (lönPeriod === "mån") setBruttolön(v); else setBruttolönÅr(v); }} suffix={lönPeriod === "mån" ? "kr / mån" : "kr / år"} step={1000} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <InfoChip label="AG-avgift" value="31,42 %" />
                  <InfoChip label={antalÄgare > 1 ? `Lönekostnad / år (${antalÄgare} ägare)` : "Lönekostnad / år"} value={fmt((lönPeriod === "mån" ? bruttolön * 12 : bruttolönÅr) * 1.3142 * antalÄgare)} />
                </div>
                <div style={{ marginTop: 8 }}><InfoChip label={lönPeriod === "mån" ? "Motsvarar årslön" : "Motsvarar månadsslön"} value={lönPeriod === "mån" ? fmt(bruttolön * 12) : fmt(Math.round(bruttolönÅr / 12))} /></div>
              </Section>
              <Section title="Tjänstepension">
                <button onClick={() => {
                  const lönÅr = lönPeriod === "mån" ? bruttolön * 12 : bruttolönÅr;
                  const maxÅr = Math.min(lönÅr * 0.35, MAX_AVDRAG_PER_PERSON);
                  setPensionMån(Math.round(maxÅr / 12));
                }} style={{ width: "100%", marginBottom: 12, padding: "9px 14px", borderRadius: 7, border: `1.5px solid ${C.tan}`, background: C.tanLight, color: C.navy, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>🎯 Max pensionsavsättning</span>
                  <span style={{ color: C.textMid, fontSize: 10 }}>{fmt(Math.round(Math.min((lönPeriod === "mån" ? bruttolön * 12 : bruttolönÅr) * 0.35, MAX_AVDRAG_PER_PERSON) / 12))} / mån</span>
                </button>                <InputRow label="Premie tjänstepension" value={pensionMån} onChange={setPensionMån} suffix="kr / mån" step={500} min={0} hint="Bolagets kostnad" />
                <InfoChip label={antalÄgare > 1 ? `Pensionskostnad / år (${antalÄgare} ägare)` : "Pensionskostnad / år"} value={fmt(pensionMån * 12 * antalÄgare)} />
              {pensionMån > 0 && <div style={{ marginTop: 8 }}><InfoChip label="Inkl. SLP (24,26%) — totalkostnad" value={fmt(pensionMån * 12 * antalÄgare * 1.2426)} /></div>}

                  {/* ── Avdragsrättsvarning ── */}
                  {visaPensionVarning && (
                    <div style={{ marginTop: 10, background: "#FEF2F2", border: `1.5px solid ${C.red}`, borderRadius: 8, padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: C.red, fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Avdragsrätten kan överskridas</div>
                          <div style={{ color: C.textMid, fontSize: 11, lineHeight: 1.7, marginBottom: 10 }}>
                            Enligt <strong>huvudregeln</strong> är max avdragsgillt <strong>{fmt(avdragsgilltPerÄgare)}/ägare/år</strong> (35 % av lön, max 10 PBB = {fmt(MAX_AVDRAG_PER_PERSON)}).
                            Nuvarande premie överstiger detta med <strong style={{ color: C.red }}>{fmt(överskjutandePension)}</strong> totalt.
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
                            {[
                              { label: "Avdragsgillt/ägare", value: fmt(avdragsgilltPerÄgare) },
                              { label: `Totalt avdragsgillt (${antalÄgare} ägare)`, value: fmt(totalAvdragsgillt) },
                              { label: "Överskjutande belopp", value: fmt(överskjutandePension), red: true },
                            ].map((k, i) => (
                              <div key={i} style={{ background: k.red ? "#FEE2E2" : C.surface, border: `1px solid ${k.red ? "#FECACA" : C.border}`, borderRadius: 6, padding: "8px 10px" }}>
                                <div style={{ color: C.textLight, fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 3 }}>{k.label}</div>
                                <div style={{ color: k.red ? C.red : C.navy, fontSize: 13, fontWeight: 800, fontFamily: "monospace" }}>{k.value}</div>
                              </div>
                            ))}
                          </div>
                          <div style={{ borderTop: `1px solid #FECACA`, paddingTop: 10 }}>
                            <div style={{ color: C.textMid, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>Tillämpa kompletteringsregeln?</div>
                            <div style={{ color: C.textMid, fontSize: 10, lineHeight: 1.7, marginBottom: 10 }}>
                              Kompletteringsregeln kan i vissa fall tillåta högre avdrag — exempelvis vid <strong>förtida avgång</strong> från anställning eller när en anställd historiskt haft en <strong>otillräckligt tryggad pensionsutfästelse</strong> ("köpa i kapp"). Regeln gäller <em>engångspremier</em> och Skatteverket är restriktivt med tillämpningen. Den är <strong>inte</strong> tillämplig vid exempelvis bonusväxling.
                            </div>
                            <button onClick={() => setAnvändKompletteringsregel(v => !v)}
                              style={{ width: "100%", padding: "10px 14px", borderRadius: 7, border: `1.5px solid ${användKompletteringsregel ? C.navy : C.border}`, background: användKompletteringsregel ? C.navy : "transparent", color: användKompletteringsregel ? "#fff" : C.textMid, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ fontSize: 16 }}>{användKompletteringsregel ? "✓" : "○"}</span>
                              <span>Använd kompletteringsregeln</span>
                            </button>
                            {användKompletteringsregel && (
                              <div style={{ marginTop: 10, background: "#FFF0F0", border: `1px solid ${C.gold}`, borderRadius: 6, padding: "10px 14px" }}>
                                <div style={{ color: C.gold, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>⚖️ Kompletteringsregeln aktiv</div>
                                <div style={{ color: C.textMid, fontSize: 10, lineHeight: 1.7 }}>
                                  Avdraget behandlas som tillåtet enligt kompletteringsregeln. Säkerställ att förutsättningarna är uppfyllda och dokumentera beslutsunderlaget. Konsultera en skatterådgivare innan avsättning görs.
                                </div>
                              </div>
                            )}
                            {!användKompletteringsregel && (
                              <div style={{ marginTop: 8, color: C.textLight, fontSize: 10, lineHeight: 1.6 }}>
                                Det överskjutande beloppet ({fmt(överskjutandePension)}) är <strong>ej avdragsgillt</strong> och påverkar bolagets skatteberäkning.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </Section>
              <Section title="Övriga kostnader">
                <div style={{ display: "flex", gap: 6, marginBottom: 12, background: C.surface2, borderRadius: 7, padding: 4 }}>
                  {[{ id: "mån", label: "Månad" }, { id: "år", label: "År" }].map(t => (
                    <button key={t.id} onClick={() => setÖvrigaPeriod(t.id)} style={{ flex: 1, padding: "7px", borderRadius: 5, border: "none", background: övrigaPeriod === t.id ? C.navy : "transparent", color: övrigaPeriod === t.id ? "#fff" : C.textMid, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{t.label}</button>
                  ))}
                </div>
                <OvrigKostnad items={övriga} onChange={setÖvriga} period={övrigaPeriod} />
                <div style={{ marginTop: 4 }}><InfoChip label="Totala övriga kostnader / år" value={fmt(r.övrigaSum)} /></div>
              </Section>

            </div>

            {/* ── RESULTATÖVERSIKT ── */}
            <div style={{ padding: "20px 16px", borderRight: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
                <span style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Resultatöversikt — Helår</span>
              </div>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "18px 20px", marginBottom: 12, boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
                <WRow label="Omsättning" value={r.omsättning} bold />
                <WRow separator />
                {intäkterMode === "timbaserat" ? (
                  <>
                    <WRow label="Lön & arbetsgivaravgift" value={-r.lönTotal} />
                    <WRow label="Tjänstepension" value={-r.pension} />
                    {r.pensionSLP > 0 && <WRow label="Särskild löneskatt pension (24,26%)" value={-r.pensionSLP} />}
                    <WRow label="Övriga kostnader" value={-r.övrigaSum} />
                    <WRow separator />
                  </>
                ) : (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0 7px", borderBottom: `1px solid #F0EDE6`, marginBottom: 6 }}>
                      <span style={{ color: C.textMid, fontSize: 12 }}>Rörelsekostnader (inkl. i marginal)</span>

                    </div>
                    <WRow label="Lön & arbetsgivaravgift" value={-r.lönTotal} />
                    {r.pensionTotal > 0 && <WRow label="Tjänstepension inkl. SLP" value={-r.pensionTotal} />}
                    {r.övrigaSum > 0 && <WRow label="Övriga kostnader" value={-r.övrigaSum} />}
                    <WRow separator />
                  </>
                )}
                <WRow label="Resultat före skatt" value={r.ebit} bold />
                <WRow label="Bolagsskatt (20,6%)" value={-r.bolagsskatt} />
                <WRow separator />
                <WRow label="Resultat efter skatt" value={r.resultatEfterSkatt} bold />
                <WRow separator />
                {/* Utdelning & Buffert inline */}
                <div style={{ background: "#F8FAFC", borderRadius: 6, padding: "12px 14px", margin: "6px 0 2px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 2, height: 12, background: C.gold, borderRadius: 1 }} />
                    <span style={{ color: C.navy, fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>Utdelning & Buffert</span>
                  </div>
                  <InputRow label="Planerad utdelning brutto / år" value={utdelning} onChange={setUtdelning} suffix="kr / år" step={10000} hint="Skatt 20 % (3:12)" />
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ color: C.textMid, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>Likviditetsbuffert</div>
                    <div style={{ display: "flex", gap: 6, marginBottom: 8, background: C.surface2, borderRadius: 7, padding: 4 }}>
                      {[{ id: "pct", label: "% av resultat" }, { id: "kr", label: "Fast belopp (kr)" }].map(t => (
                        <button key={t.id} onClick={() => setBuffertMode(t.id)} style={{ flex: 1, padding: "7px", borderRadius: 5, border: "none", background: buffertMode === t.id ? C.navy : "transparent", color: buffertMode === t.id ? "#fff" : C.textMid, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{t.label}</button>
                      ))}
                    </div>
                    {buffertMode === "pct"
                      ? <InputRow label="Buffert % av resultat" value={buffertPct} onChange={setBuffertPct} suffix="%" step={1} min={0} max={100} />
                      : <InputRow label="Buffertbelopp" value={buffertKr} onChange={setBuffertKr} suffix="kr / år" step={10000} />
                    }
                  </div>
                  <InfoChip label="Buffertbelopp / år" value={fmt(r.buffert)} />
                </div>
                {r.buffert > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", background: "#FFF0F0", borderRadius: 5, margin: "4px 0" }}>
                    <div>
                      <span style={{ color: "#9B182D", fontSize: 12, fontWeight: 600 }}>{buffertMode === "pct" ? `Likviditetsbuffert (${buffertPct}% av EBIT)` : `Likviditetsbuffert (fast belopp)`}</span>
                    </div>
                    <span style={{ color: "#9B182D", fontSize: 13, fontFamily: "monospace", fontWeight: 600 }}>−{fmt(r.buffert)}</span>
                  </div>
                )}
                <WRow label="Planerad utdelning (brutto)" value={-utdelning} />
                <WRow separator />
                <WRow label="Kvar i bolaget efter utdelning" value={r.kvarEfterUtdelning} bold />
                <WRow separator />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: C.navy, borderRadius: 6, marginTop: 6 }}>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600 }}>Tillgängligt för kapitalförsäkring / år</span>
                  <span style={{ color: r.tillgängligtKF_år >= 0 ? "#F9C5A5" : "#FFB0B0", fontSize: 15, fontWeight: 700, fontFamily: "monospace" }}>{r.tillgängligtKF_år >= 0 ? "" : "−"}{fmt(Math.abs(r.tillgängligtKF_år))}</span>
                </div>
              </div>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "18px 20px", boxShadow: "0 1px 4px rgba(155,24,45,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
                  <span style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Fördelning av omsättning</span>
                </div>
                {(intäkterMode === "timbaserat" ? [
                  { label: "Lön (inkl. AG-avgift)", value: r.lönTotal, color: "#3A7BD5" },
                  { label: "Pension inkl. SLP", value: r.pensionTotal, color: "#CEC09E" },
                  { label: "Övriga kostnader", value: r.övrigaSum, color: "#E08A3C" },
                  { label: "Bolagsskatt (20,6%)", value: r.bolagsskatt, color: "#C0392B" },
                  { label: "Utdelning (brutto)", value: utdelning, color: C.green },
                  { label: "Buffert", value: r.buffert, color: C.blue },
                  { label: "Kapitalförsäkring", value: Math.max(0, r.tillgängligtKF_år), color: C.gold },
                ] : [
                  { label: "Lön (inkl. AG-avgift)", value: r.lönTotal, color: "#3A7BD5" },
                  { label: "Pension inkl. SLP", value: r.pensionTotal, color: "#CEC09E" },
                  { label: "Övriga kostnader", value: r.övrigaSum, color: "#E08A3C" },
                  { label: "Bolagsskatt (20,6%)", value: r.bolagsskatt, color: "#C0392B" },
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

            {/* ── KF PANEL ── */}
            <div style={{ padding: "20px 16px", background: "#F2EDE3" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
                <div>
                  <div style={{ color: C.gold, fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Företagsägd</div>
                  <div style={{ color: C.navy, fontSize: 13, fontWeight: 700 }}>Kapitalförsäkring</div>
                </div>
              </div>
              <KFRow label="Resultat före skatt" value={r.ebit} />
              <KFRow label={buffertMode === "pct" ? `Likviditetsbuffert (${buffertPct}% av EBIT)` : `Likviditetsbuffert (fast ${fmt(buffertKr)} kr)`} value={-r.buffert} color="blue" />
              <KFRow label="Bolagsskatt (20,6%)" value={-r.bolagsskatt} />
              <KFRow label="Resultat efter skatt" value={r.resultatEfterSkatt} />

              {/* Utdelning + KF */}
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7, padding: "14px 16px", margin: "12px 0" }}>
                <div style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Fördelning av resultat</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: C.textMid, fontSize: 12 }}>Utdelning till ägaren (brutto)</span>
                  <span style={{ color: C.text, fontSize: 12, fontFamily: "monospace" }}>−{fmt(utdelning)}</span>
                </div>
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: C.text, fontSize: 12, fontWeight: 700 }}>Kvar för KF-inbetalning</span>
                  <span style={{ color: r.tillgängligtKF_år >= 0 ? C.green : C.red, fontSize: 13, fontWeight: 700, fontFamily: "monospace" }}>{fmt(r.tillgängligtKF_år)}</span>
                </div>
              </div>

              {/* Info: KF ägs av bolaget */}
              <div style={{ background: C.goldLight, border: `1px solid ${C.gold}`, borderRadius: 7, padding: "12px 14px", marginBottom: 12 }}>
                <div style={{ color: C.gold, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 5 }}>Företagsägd KF</div>
                <div style={{ color: C.textMid, fontSize: 11, lineHeight: 1.7 }}>
                  KF-premien betalas med bolagets beskattade medel och är <strong>inte avdragsgill</strong>. Kapitalet ägs av <strong>bolaget</strong> och bokförs som en tillgång. Avkastningen beskattas med <strong>avkastningsskatt</strong> (~1,3–2% per år på värdet) — inte bolagsskatt. Uttag till ägaren sker via lön eller utdelning.
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                <div style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Bolagets KF-sparande</div>
                <KFRow label="Möjlig inbetalning / mån" value={r.tillgängligtKF_mån} />
                <KFRow label="Möjlig inbetalning / år" value={r.tillgängligtKF_år} highlight large />
              </div>
              {r.resultatEfterSkatt > 0 && (
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7, padding: "14px 16px", marginTop: 4 }}>
                  <div style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Som andel av resultat efter skatt</div>
                  {[
                    { l: "Utdelning", v: pct1((utdelning / r.resultatEfterSkatt) * 100), c: C.green },
                    { l: "Buffert", v: pct1((r.buffert / r.resultatEfterSkatt) * 100), c: C.blue },
                    { l: "KF-inbetalning", v: pct1(Math.max(0, r.tillgängligtKF_år / r.resultatEfterSkatt) * 100), c: C.gold, bold: true },
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
              <button onClick={() => setShowPdfModal(true)} style={{ width: "100%", marginTop: 12, padding: "12px", background: C.navy, border: "none", borderRadius: 7, color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>📄 Generera PDF</button>
            </div>
          </div>
          )}
        </div>
      )}

      {tab === "analys" && <LikviditetsanalysView r={r} utdelning={utdelning} buffertPct={buffertPct} buffertMode={buffertMode} buffertKr={buffertKr} />}
      {tab === "sparande" && <SparandeView månSparande={Math.max(0, Math.round(r.tillgängligtKF_mån))} />}
      {tab === "avgifter" && <AvgiftsView defaultMånSparande={Math.max(0, Math.round(r.tillgängligtKF_mån))} />}
      {tab === "offert" && <OffertView />}
      {tab === "arenden" && <ArendenView />}
      {tab === "trad" && <TradView />}
      {tab === "trad-fond" && <TradFondView />}
      {tab === "lönesumma" && <LönesummaView />}

      <div style={{ textAlign: "center", padding: "14px", color: C.textLight, fontSize: 11, borderTop: `1px solid ${C.border}`, background: C.surface }}>
        Beräkningar baserade på svenska skatteregler 2024 &nbsp;•&nbsp; Konsultera en revisor för rådgivning
      </div>
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginErr, setLoginErr] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = () => {
    if (loginUser.trim() === "Norrfinans" && loginPass === "NorrfinansLIV") {
      setAuthed(true);
    } else {
      setLoginErr(true);
    }
  };

  if (authed) return <MainApp onLogout={() => { setAuthed(false); setLoginUser(""); setLoginPass(""); }} />;

  return (
    <div style={{ minHeight: "100vh", background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif" }}>
      <div style={{ width: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: C.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 22, fontWeight: 900 }}>N</span>
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ color: "#CEC09E", fontSize: 22, fontWeight: 800, letterSpacing: 0.5 }}>Norrfinans</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase" }}>Rådgivningsverktyg</div>
            </div>
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 14, padding: "36px 32px", boxShadow: "0 24px 60px rgba(0,0,0,0.35)" }}>
          <div style={{ color: C.navy, fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Logga in</div>
          <div style={{ color: C.textLight, fontSize: 12, marginBottom: 28 }}>Ange dina uppgifter för att fortsätta</div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: C.textMid, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Användarnamn</label>
            <input type="text" value={loginUser} onChange={e => { setLoginUser(e.target.value); setLoginErr(false); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="Användarnamn"
              style={{ width: "100%", boxSizing: "border-box", padding: "11px 14px", border: `1.5px solid ${loginErr ? C.red : C.border}`, borderRadius: 7, fontSize: 14, color: C.text, outline: "none", fontFamily: "inherit", background: C.surface }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ color: C.textMid, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Lösenord</label>
            <div style={{ position: "relative" }}>
              <input type={showPass ? "text" : "password"} value={loginPass} onChange={e => { setLoginPass(e.target.value); setLoginErr(false); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="Lösenord"
                style={{ width: "100%", boxSizing: "border-box", padding: "11px 42px 11px 14px", border: `1.5px solid ${loginErr ? C.red : C.border}`, borderRadius: 7, fontSize: 14, color: C.text, outline: "none", fontFamily: "inherit", background: C.surface }} />
              <button onClick={() => setShowPass(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.textLight, fontSize: 16, padding: 0 }}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          {loginErr && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 7, padding: "10px 14px", marginBottom: 16, color: C.red, fontSize: 12, fontWeight: 600 }}>
              Fel användarnamn eller lösenord
            </div>
          )}
          <button onClick={handleLogin} style={{ width: "100%", padding: "13px", background: C.navy, border: "none", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            Logga in →
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 24, color: "rgba(255,255,255,0.25)", fontSize: 11 }}>
          © {new Date().getFullYear()} Norrfinans — Konfidentiellt
        </div>
      </div>
    </div>
  );
}
