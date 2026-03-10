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

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────
const InputRow = ({ label, value, onChange, suffix, step = 1000, min = 0, max, hint }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
      <label style={{ color: C.textMid, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>{label}</label>
      {hint && <span style={{ color: C.textLight, fontSize: 10 }}>{hint}</span>}
    </div>
    <div style={{ display: "flex", alignItems: "center", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 6 }}>
      <input type="number" value={value} min={min} max={max} step={step} onChange={e => onChange(Number(e.target.value))}
        style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 14, fontWeight: 600, padding: "10px 12px", fontFamily: "inherit" }} />
      <span style={{ color: C.textLight, padding: "10px 12px", fontSize: 12, borderLeft: `1px solid ${C.border}` }}>{suffix}</span>
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

// ── PROVIDER DATA ─────────────────────────────────────────────────────────────
const FOND = [
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

const TRAD = [
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
  const löpandeÅr = löpandeMån * 12;
  const r = avkastning / 100;

  // One-time fee on lump sum
  const engångsFee = engångs * (provider.engångsPct / 100);
  let capital = befintligt + engångs - engångsFee;

  let totalFee = engångsFee;
  let year1Fee = engångsFee;

  for (let y = 1; y <= år; y++) {
    capital *= (1 + r); // growth
    const lFee = löpandeÅr * (provider.löpandePct / 100);
    capital += löpandeÅr - lFee;
    const kFee = capital * (provider.kapitalPct / 100);
    capital -= kFee;
    capital -= provider.fast;
    const yearFee = lFee + kFee + provider.fast;
    totalFee += yearFee;
    if (y === 1) year1Fee += yearFee;
  }

  return {
    engångsFee,
    year1Fee,
    totalFee,
    avgFee: totalFee / år,
  };
}

// ── AVGIFTSKALKYLATOR ─────────────────────────────────────────────────────────
const AvgiftsView = ({ defaultMånSparande }) => {
  const [löpandeMån, setLöpandeMån] = useState(defaultMånSparande || 10000);
  const [engångs, setEngångs] = useState(0);
  const [befintligt, setBefintligt] = useState(500000);
  const [år, setÅr] = useState(20);
  const [avkastning, setAvkastning] = useState(7);
  const [kategori, setKategori] = useState("fond");
  const [sortKey, setSortKey] = useState("totalFee");

  const inputs = { löpandeMån, engångs, befintligt, år, avkastning };

  const results = useMemo(() => {
    const providers = kategori === "fond" ? FOND : TRAD;
    return providers
      .map(p => ({ ...p, ...calcProviderFees(p, inputs) }))
      .sort((a, b) => a[sortKey] - b[sortKey]);
  }, [löpandeMån, engångs, befintligt, år, avkastning, kategori, sortKey]);

  const best = results[0];
  const worst = results[results.length - 1];
  const saving = worst.totalFee - best.totalFee;

  const colW = "60px 1fr 110px 110px 110px 110px 110px";

  const SortHeader = ({ label, k }) => (
    <div onClick={() => setSortKey(k)} style={{ cursor: "pointer", color: sortKey === k ? "#fff" : "rgba(255,255,255,0.5)", fontWeight: sortKey === k ? 700 : 400, fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase", userSelect: "none", display: "flex", alignItems: "center", gap: 4 }}>
      {label}{sortKey === k && <span style={{ color: C.gold }}>▲</span>}
    </div>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", minHeight: "calc(100vh - 90px)" }}>
      {/* Inputs */}
      <div style={{ padding: "20px 16px", borderRight: `1px solid ${C.border}` }}>
        <Section title="Dina förutsättningar">
          <InputRow label="Löpande premie / mån" value={löpandeMån} onChange={setLöpandeMån} suffix="kr / mån" step={500} />
          <InputRow label="Engångsinsättning" value={engångs} onChange={setEngångs} suffix="kr" step={10000} />
          <InputRow label="Befintligt kapital" value={befintligt} onChange={setBefintligt} suffix="kr" step={10000} />
          <InputRow label="Antal år" value={år} onChange={setÅr} suffix="år" step={1} min={1} max={40} />
          <InputRow label="Förväntad avkastning" value={avkastning} onChange={setAvkastning} suffix="% / år" step={0.5} min={0} max={20} hint="Används för kapitalberäkning" />
        </Section>

        {/* Kategoriväljare */}
        <Section title="Produkttyp">
          {[{ id: "fond", label: "Fondförsäkring" }, { id: "trad", label: "Traditionell förvaltning" }].map(k => (
            <button key={k.id} onClick={() => setKategori(k.id)} style={{
              width: "100%", marginBottom: 8, padding: "11px 14px", borderRadius: 6,
              border: `1.5px solid ${kategori === k.id ? C.navy : C.border}`,
              background: kategori === k.id ? C.navy : C.surface,
              color: kategori === k.id ? "#fff" : C.textMid,
              fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", textAlign: "left"
            }}>{k.label}</button>
          ))}
        </Section>

        {/* Summary KPIs */}
        <div style={{ background: C.navy, borderRadius: 8, padding: "16px" }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Potentiell besparing</div>
          <div style={{ color: C.gold, fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{fmtShort(saving)}</div>
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

      {/* Results table */}
      <div style={{ padding: "20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
            <span style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>
              {kategori === "fond" ? "Fondförsäkring" : "Traditionell Förvaltning"} — Jämförelse
            </span>
          </div>
          <div style={{ color: C.textLight, fontSize: 11 }}>Klicka på kolumnrubrik för att sortera</div>
        </div>

        {/* Bar chart — total fee */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "20px", marginBottom: 14, boxShadow: "0 1px 4px rgba(15,40,71,0.06)" }}>
          <div style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 14 }}>Total avgift alla år</div>
          {results.map((p, i) => {
            const barW = worst.totalFee > 0 ? (p.totalFee / worst.totalFee) * 100 : 0;
            const isFirst = i === 0;
            return (
              <div key={p.name} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: isFirst ? C.gold : C.textMid, fontSize: 10, fontWeight: 700, width: 16, textAlign: "right" }}>#{i+1}</span>
                    <span style={{ color: C.text, fontSize: 12, fontWeight: isFirst ? 700 : 400 }}>{p.name}</span>
                  </div>
                  <span style={{ color: isFirst ? C.green : C.text, fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>{fmtShort(p.totalFee)}</span>
                </div>
                <div style={{ background: C.surface2, borderRadius: 3, height: 8 }}>
                  <div style={{ width: `${barW}%`, background: isFirst ? C.green : i === results.length-1 ? C.red : C.navy, opacity: isFirst ? 1 : i === results.length-1 ? 0.7 : 0.25, borderRadius: 3, height: 8, transition: "width 0.5s" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 4px rgba(15,40,71,0.06)" }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: colW, background: C.navy, padding: "12px 16px", gap: 8 }}>
            <SortHeader label="Rank" k="totalFee" />
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase" }}>Bolag</div>
            <SortHeader label="Engångsfee" k="engångsFee" />
            <SortHeader label="Avgift år 1" k="year1Fee" />
            <SortHeader label="Snitt/år" k="avgFee" />
            <SortHeader label="Total avgift" k="totalFee" />
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase" }}>Kapitalavg %</div>
          </div>

          {/* Rows */}
          {results.map((p, i) => {
            const isFirst = i === 0;
            const isLast = i === results.length - 1;
            return (
              <div key={p.name} style={{
                display: "grid", gridTemplateColumns: colW, padding: "11px 16px", gap: 8,
                background: isFirst ? "#F0FBF5" : i % 2 === 0 ? C.surface : C.surface2,
                borderBottom: `1px solid ${C.border}`,
                borderLeft: isFirst ? `3px solid ${C.green}` : isLast ? `3px solid ${C.red}` : `3px solid transparent`
              }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{
                    background: isFirst ? C.green : isLast ? C.red : C.navy,
                    color: "#fff", borderRadius: 4, padding: "2px 7px", fontSize: 11, fontWeight: 700, opacity: isFirst || isLast ? 1 : 0.2
                  }}>#{i+1}</span>
                </div>
                <div style={{ color: C.text, fontSize: 12, fontWeight: isFirst ? 700 : 400, display: "flex", alignItems: "center" }}>{p.name}</div>
                <div style={{ color: p.engångsFee > 0 ? C.red : C.textLight, fontSize: 12, fontFamily: "monospace", display: "flex", alignItems: "center" }}>{fmt(p.engångsFee)}</div>
                <div style={{ color: C.text, fontSize: 12, fontFamily: "monospace", display: "flex", alignItems: "center" }}>{fmt(p.year1Fee)}</div>
                <div style={{ color: C.text, fontSize: 12, fontFamily: "monospace", display: "flex", alignItems: "center" }}>{fmt(p.avgFee)}</div>
                <div style={{ color: isFirst ? C.green : isLast ? C.red : C.text, fontSize: 12, fontWeight: 700, fontFamily: "monospace", display: "flex", alignItems: "center" }}>{fmtShort(p.totalFee)}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ flex: 1, background: C.surface2, borderRadius: 2, height: 6 }}>
                    <div style={{ width: `${Math.min(100,(p.kapitalPct/1)*100)}%`, background: C.navy, opacity: 0.35, height: 6, borderRadius: 2 }} />
                  </div>
                  <span style={{ color: C.textMid, fontSize: 11, fontFamily: "monospace", whiteSpace: "nowrap" }}>{pct(p.kapitalPct)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footnote */}
        <div style={{ marginTop: 12, color: C.textLight, fontSize: 11, lineHeight: 1.7 }}>
          * Beräkningar inkluderar premieavgift på engångsinsättning, löpande premieavgift, kapitalavgift på ackumulerat kapital samt fasta årsavgifter.
          Avkastning {avkastning} % per år används för kapitaluppbyggnad.
        </div>
      </div>
    </div>
  );
};

// ── SPARANDE VIEW ─────────────────────────────────────────────────────────────
const SparandeView = ({ månSparande }) => {
  const [sparande, setSparande] = useState(månSparande || 10000);
  const [avkastning, setAvkastning] = useState(7);
  const [år, setÅr] = useState(20);
  const [engångs, setEngångs] = useState(0);
  const [useKF, setUseKF] = useState(!!månSparande);

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

  return (
    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", minHeight: "calc(100vh - 90px)" }}>
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
                <button onClick={() => { setUseKF(true); setSparande(Math.max(0, Math.round(månSparande))); }}
                  style={{ flex: 1, padding: "7px", borderRadius: 5, border: `1.5px solid ${useKF ? C.navy : C.border}`, background: useKF ? C.navy : "transparent", color: useKF ? "#fff" : C.textMid, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  Från KF
                </button>
                <button onClick={() => setUseKF(false)}
                  style={{ flex: 1, padding: "7px", borderRadius: 5, border: `1.5px solid ${!useKF ? C.navy : C.border}`, background: !useKF ? C.navy : "transparent", color: !useKF ? "#fff" : C.textMid, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  Eget belopp
                </button>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 6 }}>
              <input type="number" value={sparande} min={0} step={500} onChange={e => { setUseKF(false); setSparande(Number(e.target.value)); }}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 14, fontWeight: 600, padding: "10px 12px", fontFamily: "inherit" }} />
              <span style={{ color: C.textLight, padding: "10px 12px", fontSize: 12, borderLeft: `1px solid ${C.border}` }}>kr / mån</span>
            </div>
          </div>
          <InputRow label="Engångsinsättning" value={engångs} onChange={setEngångs} suffix="kr" step={10000} hint="Startkapital" />
          <InputRow label="Förväntad avkastning" value={avkastning} onChange={setAvkastning} suffix="% / år" step={0.5} min={0} max={30} />
          <InputRow label="Spartid" value={år} onChange={setÅr} suffix="år" step={1} min={1} max={40} />
        </Section>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { l: "Totalt kapital", v: fmtShort(final.kapital || 0), big: true },
            { l: "Totalavkastning", v: fmtShort(final.avk || 0) },
            { l: "Totalt insatt", v: fmtShort(final.insatt || 0) },
            { l: "Avkastning / år", v: fmtShort(((final.kapital||0) - (final.insatt||0)) / år) },
          ].map((k, i) => (
            <div key={i} style={{ background: i === 0 ? C.navy : C.surface, border: `1px solid ${i === 0 ? C.navy : C.border}`, borderRadius: 8, padding: "14px", gridColumn: i === 0 ? "1 / -1" : "auto" }}>
              <div style={{ color: i === 0 ? "rgba(255,255,255,0.55)" : C.textLight, fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 5 }}>{k.l}</div>
              <div style={{ color: i === 0 ? "#fff" : C.text, fontSize: i === 0 ? 26 : 18, fontWeight: 700 }}>{k.v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
          <span style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Kapitalutveckling över {år} år</span>
        </div>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "24px 20px", marginBottom: 16, boxShadow: "0 1px 4px rgba(15,40,71,0.06)" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 180, paddingBottom: 28, position: "relative" }}>
            {[0.25,0.5,0.75,1].map(f => (
              <div key={f} style={{ position: "absolute", left: 0, right: 0, bottom: 28 + f * 152, borderTop: `1px dashed ${C.border}`, zIndex: 0 }}>
                <span style={{ position: "absolute", right: "100%", paddingRight: 6, top: -8, color: C.textLight, fontSize: 9, whiteSpace: "nowrap" }}>{fmtShort(maxVal * f)}</span>
              </div>
            ))}
            {rows.map((row, i) => {
              const totalH = (row.kapital / maxVal) * 152;
              const insattH = (row.insatt / maxVal) * 152;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end", position: "relative", zIndex: 1 }}>
                  <div style={{ width: "100%", display: "flex", flexDirection: "column", cursor: "pointer" }}>
                    <div style={{ background: C.gold, height: totalH - insattH, borderRadius: "2px 2px 0 0", opacity: 0.85 }} />
                    <div style={{ background: C.navy, height: insattH, opacity: 0.3 }} />
                  </div>
                  {(row.y % (år <= 10 ? 1 : år <= 20 ? 2 : 5) === 0) && (
                    <div style={{ position: "absolute", bottom: -20, color: C.textLight, fontSize: 9 }}>År {row.y}</div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 8 }}>
            {[{ c: C.navy, o: 0.3, l: "Insatt kapital" }, { c: C.gold, o: 0.85, l: "Avkastning" }].map(lg => (
              <div key={lg.l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 2, background: lg.c, opacity: lg.o }} />
                <span style={{ color: C.textMid, fontSize: 11 }}>{lg.l}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 4px rgba(15,40,71,0.06)" }}>
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
      </div>
    </div>
  );
};

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("kalkylator");
  const [timpris, setTimpris] = useState(1200);
  const [timmar, setTimmar] = useState(1800);
  const [debiteringsgrad, setDebiteringsgrad] = useState(85);
  const [bruttolön, setBruttolön] = useState(50000);
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
    const omsättning = timpris * faktTim;
    const lönTotal = bruttolön * 12 * 1.3142;
    const pension = bruttolön * 12 * (pensionPct / 100);
    const övrigaSum = övriga.reduce((s, k) => s + (k.amount || 0), 0) * 12;
    const ebit = omsättning - lönTotal - pension - övrigaSum;
    const skatt = Math.max(0, ebit * 0.206);
    const netto = ebit - skatt;
    const buffert = omsättning * (buffertPct / 100);
    const kvarEfterUtdelning = netto - utdelning;
    const tillgängligtKF_år = kvarEfterUtdelning - buffert;
    const tillgängligtKF_mån = tillgängligtKF_år / 12;
    return { omsättning, lönTotal, pension, övrigaSum, ebit, skatt, netto, buffert, kvarEfterUtdelning, tillgängligtKF_år, tillgängligtKF_mån, utdelningNetto: utdelning * 0.8, faktTim };
  }, [timpris, timmar, debiteringsgrad, bruttolön, pensionPct, övriga, utdelning, buffertPct]);

  const tabs = [
    { id: "kalkylator", label: "Likviditetskalkylator" },
    { id: "sparande", label: "Sparande & Avkastning" },
    { id: "avgifter", label: "Avgiftskalkylator" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif", color: C.text }}>
      {/* Header */}
      <div style={{ background: C.navy, padding: "0 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ padding: "18px 0", borderRight: `1px solid rgba(255,255,255,0.08)`, paddingRight: 28, marginRight: 28 }}>
          <div style={{ color: C.gold, fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Norrfinans</div>
        </div>
        <div style={{ display: "flex", gap: 2, flex: 1 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: tab === t.id ? "rgba(255,255,255,0.08)" : "transparent",
              border: "none", borderBottom: tab === t.id ? `2px solid ${C.gold}` : "2px solid transparent",
              color: tab === t.id ? "#fff" : "rgba(255,255,255,0.45)",
              padding: "20px 20px 18px", cursor: "pointer", fontSize: 12, fontWeight: 700,
              letterSpacing: 0.5, fontFamily: "inherit", transition: "all 0.2s"
            }}>{t.label}</button>
          ))}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: C.gold, fontSize: 18, fontWeight: 700 }}>{fmt(r.omsättning)}</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>Omsättning / år</div>
        </div>
      </div>
      <div style={{ height: 3, background: `linear-gradient(90deg,${C.gold},#E8B84B,${C.gold})` }} />

      {/* LIKVIDITETSKALKYLATOR */}
      {tab === "kalkylator" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 300px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ padding: "20px 16px", borderRight: `1px solid ${C.border}` }}>
            <Section title="Intäkter">
              <InputRow label="Timpris" value={timpris} onChange={setTimpris} suffix="kr / tim" step={50} />
              <InputRow label="Timmar / år" value={timmar} onChange={setTimmar} suffix="tim" step={10} />
              <InputRow label="Debiteringsgrad" value={debiteringsgrad} onChange={setDebiteringsgrad} suffix="%" step={1} max={100} />
              <InfoChip label="Fakturerbara timmar" value={`${Math.round(r.faktTim).toLocaleString("sv-SE")} tim`} />
            </Section>
            <Section title="Lön & Arbetsgivaravgift">
              <InputRow label="Bruttolön / månad" value={bruttolön} onChange={setBruttolön} suffix="kr / mån" step={1000} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <InfoChip label="AG-avgift" value="31,42 %" />
                <InfoChip label="Lönekostnad / år" value={fmt(bruttolön * 12 * 1.3142)} />
              </div>
            </Section>
            <Section title="Pensionsavsättning">
              <InputRow label="% av bruttolön" value={pensionPct} onChange={setPensionPct} suffix="%" step={0.5} min={0} max={100} hint="Typiskt 4,5–35 %" />
              <InfoChip label="Årsavsättning" value={fmt(bruttolön * 12 * pensionPct / 100)} />
            </Section>
            <Section title="Övriga kostnader / mån">
              <OvrigKostnad items={övriga} onChange={setÖvriga} />
            </Section>
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
              <WRow separator /><WRow label="Lön & arbetsgivaravgift" value={-r.lönTotal} />
              <WRow label="Pensionsavsättning" value={-r.pension} />
              <WRow label="Övriga kostnader" value={-r.övrigaSum} />
              <WRow separator /><WRow label="EBIT" value={r.ebit} bold />
              <WRow label="Bolagsskatt (20,6 %)" value={-r.skatt} />
              <WRow separator /><WRow label="Nettoresultat" value={r.netto} bold />
              <WRow label="Planerad utdelning (brutto)" value={-utdelning} />
              <WRow separator /><WRow label="Kvar i bolaget efter utdelning" value={r.kvarEfterUtdelning} bold />
              <WRow label={`Likviditetsbuffert (${buffertPct} % av oms.)`} value={-r.buffert} />
              <WRow separator />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: C.navy, borderRadius: 6, marginTop: 6 }}>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600 }}>Tillgängligt för kapitalförsäkring / år</span>
                <span style={{ color: r.tillgängligtKF_år >= 0 ? "#6EE0A4" : "#F08080", fontSize: 15, fontWeight: 700, fontFamily: "monospace" }}>
                  {r.tillgängligtKF_år >= 0 ? "" : "−"}{fmt(Math.abs(r.tillgängligtKF_år))}
                </span>
              </div>
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "18px 20px", boxShadow: "0 1px 4px rgba(15,40,71,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
                <span style={{ color: C.navy, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Fördelning av omsättning</span>
              </div>
              {[
                { label: "Lön (inkl. AG-avgift)", value: r.lönTotal, color: "#3A7BD5" },
                { label: "Pension", value: r.pension, color: "#7B5EA7" },
                { label: "Övriga kostnader", value: r.övrigaSum, color: "#E08A3C" },
                { label: "Bolagsskatt", value: r.skatt, color: C.red },
                { label: "Utdelning (brutto)", value: utdelning, color: C.green },
                { label: "Buffert", value: r.buffert, color: C.blue },
                { label: "Kapitalförsäkring", value: Math.max(0, r.tillgängligtKF_år), color: C.gold },
              ].map((item, i) => {
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
            <KFRow label="Kvar i bolaget efter utdelning" value={r.kvarEfterUtdelning} />
            <KFRow label={`Buffertbelopp (${buffertPct} % av omsättning)`} value={r.buffert} />
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7, padding: "14px 16px", margin: "12px 0" }}>
              <div style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Utdelning</div>
              {[{ l: "Brutto", v: fmt(utdelning), c: C.text }, { l: "Skatt (20 %)", v: `−${fmt(utdelning * 0.20)}`, c: C.red }].map(row => (
                <div key={row.l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: C.textMid, fontSize: 12 }}>{row.l}</span>
                  <span style={{ color: row.c, fontSize: 12, fontFamily: "monospace" }}>{row.v}</span>
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: C.text, fontSize: 12, fontWeight: 700 }}>Netto</span>
                <span style={{ color: C.green, fontSize: 13, fontWeight: 700, fontFamily: "monospace" }}>{fmt(r.utdelningNetto)}</span>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
              <div style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Sparande i KF</div>
              <KFRow label="Tillgängligt för sparande / mån" value={r.tillgängligtKF_mån} />
              <KFRow label="Tillgängligt för sparande / år" value={r.tillgängligtKF_år} highlight large />
            </div>
            {r.netto > 0 && (
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7, padding: "14px 16px", marginTop: 4 }}>
                <div style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Som andel av nettoresultat</div>
                {[
                  { l: "Utdelning", v: pct1((utdelning / r.netto) * 100), c: C.green },
                  { l: "Buffert", v: pct1((r.buffert / r.netto) * 100), c: C.blue },
                  { l: "Kapitalförsäkring", v: pct1(Math.max(0, r.tillgängligtKF_år / r.netto) * 100), c: C.gold, bold: true },
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
            <button onClick={() => setTab("sparande")} style={{ width: "100%", marginTop: 10, padding: "12px", background: C.goldLight, border: `1.5px solid ${C.gold}`, borderRadius: 7, color: C.gold, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              📈 Se sparande & avkastning →
            </button>
            <button onClick={() => setTab("avgifter")} style={{ width: "100%", marginTop: 8, padding: "12px", background: C.surface2, border: `1.5px solid ${C.border}`, borderRadius: 7, color: C.navy, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              🏦 Jämför avgifter →
            </button>
          </div>
        </div>
      )}

      {tab === "sparande" && <SparandeView månSparande={Math.max(0, Math.round(r.tillgängligtKF_mån))} />}
      {tab === "avgifter" && <AvgiftsView defaultMånSparande={Math.max(0, Math.round(r.tillgängligtKF_mån))} />}

      <div style={{ textAlign: "center", padding: "14px", color: C.textLight, fontSize: 11, borderTop: `1px solid ${C.border}`, background: C.surface }}>
        Beräkningar baserade på svenska skatteregler 2024 &nbsp;•&nbsp; Konsultera en revisor för rådgivning
      </div>
    </div>
  );
}
