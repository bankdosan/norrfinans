import { useMemo, useState } from "react";

const fmt = (n) =>
  new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(n || 0);

const fmtShort = (n) => (n >= 1000000 ? `${(n / 1000000).toFixed(2)} Mkr` : fmt(n));
const pct1 = (n) => `${Number(n || 0).toFixed(1)} %`;

const C = {
  bg: "#F4F6F9",
  surface: "#FFFFFF",
  surface2: "#F0F3F7",
  border: "#DDE3ED",
  navy: "#0F2847",
  gold: "#B8892A",
  goldLight: "#F5EDD8",
  text: "#0F2847",
  textMid: "#4A5E78",
  textLight: "#8A9BB0",
  green: "#1A7A4A",
  red: "#C0392B",
};

const InputRow = ({ label, value, onChange, suffix, step = 1000, min = 0, max, hint }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
      <label style={{ color: C.textMid, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>{label}</label>
      {hint && <span style={{ color: C.textLight, fontSize: 10 }}>{hint}</span>}
    </div>
    <div style={{ display: "flex", alignItems: "center", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
      <input type="number" value={value} min={min} max={max} step={step} onChange={(e) => onChange(Number(e.target.value))} style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 14, fontWeight: 600, padding: "10px 12px", fontFamily: "inherit", minWidth: 0 }} />
      <span style={{ color: C.textLight, padding: "10px 12px", fontSize: 12, borderLeft: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>{suffix}</span>
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
    <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #F0F3F7" }}>
      <span style={{ color: bold ? C.text : C.textMid, fontSize: bold ? 13 : 12, fontWeight: bold ? 700 : 400 }}>{label}</span>
      <span style={{ color: bold ? C.text : value >= 0 ? C.green : C.red, fontSize: bold ? 13 : 12, fontWeight: bold ? 700 : 500, fontFamily: "monospace" }}>{value >= 0 ? "" : "-"}{fmt(Math.abs(value))}</span>
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
  const remove = (i) => onChange(items.filter((_, j) => j !== i));
  const update = (i, field, val) => onChange(items.map((item, j) => (j === i ? { ...item, [field]: val } : item)));

  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input placeholder="Beskrivning" value={item.label} onChange={(e) => update(i, "label", e.target.value)} style={{ flex: 2, background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 6, color: C.text, padding: "9px 12px", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
          <input type="number" placeholder="0" value={item.amount} min={0} step={500} onChange={(e) => update(i, "amount", Number(e.target.value))} style={{ flex: 1, background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 6, color: C.text, padding: "9px 12px", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
          <button onClick={() => remove(i)} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 6, color: C.textLight, cursor: "pointer", padding: "8px 10px" }}>?</button>
        </div>
      ))}
      <button onClick={add} style={{ background: C.goldLight, border: `1.5px dashed ${C.gold}`, borderRadius: 6, color: C.gold, cursor: "pointer", padding: "9px 20px", fontSize: 11, fontWeight: 700, width: "100%", fontFamily: "inherit" }}>
        + L gg till kostnad
      </button>
    </div>
  );
};

const OffertView = () => {
  const companies = [
    { id: "seb", name: "SEB", color: "#7B5EA7", total: 11887 },
    { id: "folksam", name: "Folksam", color: "#1A7A4A", total: 12340 },
    { id: "skandia", name: "Skandia", color: "#1A5296", total: 12667 },
    { id: "ea", name: "Euro Accident", color: "#E08A3C", total: 12682 },
    { id: "lf", name: "L nsf rs kringar", color: "#B8892A", total: 13246 },
  ];
  const best = companies[0];
  const worst = companies[companies.length - 1];

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <Section title="Offertj mf relse">
        {companies.map((company, i) => (
          <div key={company.id} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: company.color }} />
                <span style={{ color: C.text, fontSize: 12, fontWeight: i === 0 ? 700 : 400 }}>{company.name}</span>
              </div>
              <span style={{ color: i === 0 ? C.green : C.text, fontSize: 13, fontWeight: 700, fontFamily: "monospace" }}>{fmt(company.total)}</span>
            </div>
            <div style={{ background: C.surface2, borderRadius: 3, height: 8 }}>
              <div style={{ width: `${(company.total / worst.total) * 100}%`, background: company.color, borderRadius: 3, height: 8, opacity: i === 0 ? 1 : 0.55 }} />
            </div>
          </div>
        ))}
        <KFRow label="Billigaste alternativet" value={best.total} highlight large />
        <InfoChip label="Besparing vs dyraste" value={`${fmt(worst.total - best.total)} / m n`} />
      </Section>
    </div>
  );
};

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
    const avlidenAndel = nettoEget / 2;

    if (civilstand === "gift" && sarkull === 0) {
      return { behov: 0, nettoEget, avlidenAndel, message: "Efterlevande make eller maka  rver normalt med fri f rfogander tt n r s rkullsbarn saknas." };
    }

    if (civilstand === "gift") {
      const arvslottPerBarn = totalBarn > 0 ? avlidenAndel / totalBarn : 0;
      return { behov: arvslottPerBarn * sarkull, nettoEget, avlidenAndel, message: "S rkullsbarn har r tt att f  ut sin arvslott direkt vid d dsfall." };
    }

    return { behov: avlidenAndel, nettoEget, avlidenAndel, message: totalBarn === 0 ? "Sambo saknar automatisk arvsr tt utan testamente." : "Barnen  rver den avlidnes andel direkt n r sambor inte  r gifta." };
  }, [civilstand, gemensamma, sarkull, marknadsvarde, andelLan]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", minHeight: "calc(100vh - 90px)" }}>
      <div style={{ padding: "20px 16px", borderRight: `1px solid ${C.border}` }}>
        <Section title="Civilst nd">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[{ id: "gift", label: "Gift" }, { id: "sambo", label: "Sambo" }].map((alt) => (
              <button key={alt.id} onClick={() => setCivilstand(alt.id)} style={{ padding: "14px 10px", borderRadius: 8, border: `2px solid ${civilstand === alt.id ? C.navy : C.border}`, background: civilstand === alt.id ? C.navy : C.surface, color: civilstand === alt.id ? "#fff" : C.textMid, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{alt.label}</button>
            ))}
          </div>
        </Section>
        <Section title="Barn">
          <InputRow label="Gemensamma barn" value={gemensamma} onChange={setGemensamma} suffix="st" step={1} />
          <InputRow label="S rkullsbarn" value={sarkull} onChange={setSarkull} suffix="st" step={1} />
        </Section>
        <Section title="Fastighet">
          <InputRow label="Marknadsv rde hus" value={marknadsvarde} onChange={setMarknadsvarde} suffix="kr" step={50000} />
          <InputRow label="Andel l n" value={andelLan} onChange={setAndelLan} suffix="%" step={5} min={0} max={100} />
        </Section>
      </div>
      <div style={{ padding: "24px 28px" }}>
        <Section title="Livf rs kringsanalys">
          <KFRow label="Rekommenderat f rs kringsbelopp" value={calc.behov} highlight large />
          <div style={{ color: C.textMid, fontSize: 12, lineHeight: 1.7, marginBottom: 16 }}>{calc.message}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <InfoChip label="Eget kapital" value={fmtShort(calc.nettoEget)} />
            <InfoChip label="D dsboets andel" value={fmtShort(calc.avlidenAndel)} />
          </div>
        </Section>
      </div>
    </div>
  );
};

function calcProviderFees(provider, inputs) {
  const { lopandeMan, engangs, befintligt, ar, avkastning } = inputs;
  const r = avkastning / 100;
  const engangsFee = engangs * (provider.engangsPct / 100);
  let capital = befintligt + engangs - engangsFee;
  let totalFee = engangsFee;

  for (let y = 1; y <= ar; y += 1) {
    for (let m = 0; m < 12; m += 1) {
      const premieavgift = lopandeMan * (provider.lopandePct / 100);
      capital += lopandeMan - premieavgift;
      totalFee += premieavgift;
    }
    capital *= 1 + r;
    const kapitalavgift = capital * (provider.kapitalPct / 100);
    capital -= kapitalavgift + provider.fast;
    totalFee += kapitalavgift + provider.fast;
  }

  return { totalFee };
}

const AvgiftsView = ({ defaultManSparande }) => {
  const [lopandeMan, setLopandeMan] = useState(defaultManSparande || 10000);
  const [engangs, setEngangs] = useState(0);
  const [befintligt, setBefintligt] = useState(500000);
  const [ar, setAr] = useState(20);
  const [avkastning, setAvkastning] = useState(7);

  const providers = [
    { name: "L nsf rs kringar", engangsPct: 0, lopandePct: 2, kapitalPct: 0.15, fast: 200 },
    { name: "SEB", engangsPct: 3, lopandePct: 3, kapitalPct: 0.15, fast: 180 },
    { name: "SPP", engangsPct: 0, lopandePct: 3.5, kapitalPct: 0, fast: 0 },
    { name: "Skandia", engangsPct: 0, lopandePct: 2, kapitalPct: 0.15, fast: 240 },
  ];

  const results = useMemo(() => providers.map((p) => ({ ...p, ...calcProviderFees(p, { lopandeMan, engangs, befintligt, ar, avkastning }) })).sort((a, b) => a.totalFee - b.totalFee), [lopandeMan, engangs, befintligt, ar, avkastning]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", minHeight: "calc(100vh - 90px)" }}>
      <div style={{ padding: "20px 16px", borderRight: `1px solid ${C.border}` }}>
        <Section title="Dina f ruts ttningar">
          <InputRow label="L pande premie / m n" value={lopandeMan} onChange={setLopandeMan} suffix="kr / m n" step={500} />
          <InputRow label="Eng ngsins ttning" value={engangs} onChange={setEngangs} suffix="kr" step={10000} />
          <InputRow label="Befintligt kapital" value={befintligt} onChange={setBefintligt} suffix="kr" step={10000} />
          <InputRow label="Antal  r" value={ar} onChange={setAr} suffix=" r" step={1} min={1} max={40} />
          <InputRow label="F rv ntad avkastning" value={avkastning} onChange={setAvkastning} suffix="% /  r" step={0.5} min={0} max={20} />
        </Section>
      </div>
      <div style={{ padding: "20px" }}>
        <Section title="Avgiftsj mf relse">
          {results.map((provider, i) => (
            <div key={provider.name} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ color: C.text, fontWeight: i === 0 ? 700 : 400 }}>{provider.name}</span>
              <span style={{ color: i === 0 ? C.green : C.text, fontWeight: 700, fontFamily: "monospace" }}>{fmtShort(provider.totalFee)}</span>
            </div>
          ))}
        </Section>
      </div>
    </div>
  );
};

const SparandeView = ({ manSparande }) => {
  const [sparande, setSparande] = useState(manSparande || 10000);
  const [avkastning, setAvkastning] = useState(7);
  const [ar, setAr] = useState(20);
  const [engangs, setEngangs] = useState(0);

  const rows = useMemo(() => {
    const mRate = avkastning / 100 / 12;
    let kapital = engangs;
    const data = [];
    for (let y = 1; y <= ar; y += 1) {
      for (let m = 0; m < 12; m += 1) kapital = kapital * (1 + mRate) + sparande;
      const insatt = engangs + sparande * 12 * y;
      data.push({ y, kapital, insatt, avkastning: kapital - insatt });
    }
    return data;
  }, [sparande, avkastning, ar, engangs]);

  const final = rows[rows.length - 1] || { kapital: 0, insatt: 0, avkastning: 0 };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", minHeight: "calc(100vh - 90px)" }}>
      <div style={{ padding: "20px 16px", borderRight: `1px solid ${C.border}` }}>
        <Section title="Sparparametrar">
          <InputRow label="M natligt sparande" value={sparande} onChange={setSparande} suffix="kr / m n" step={500} />
          <InputRow label="Eng ngsins ttning" value={engangs} onChange={setEngangs} suffix="kr" step={10000} />
          <InputRow label="F rv ntad avkastning" value={avkastning} onChange={setAvkastning} suffix="% /  r" step={0.5} />
          <InputRow label="Spartid" value={ar} onChange={setAr} suffix=" r" step={1} min={1} max={40} />
        </Section>
      </div>
      <div style={{ padding: "20px 24px" }}>
        <Section title="Kapitalutveckling">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
            <InfoChip label="Totalt kapital" value={fmtShort(final.kapital)} />
            <InfoChip label="Totalt insatt" value={fmtShort(final.insatt)} />
            <InfoChip label="Avkastning" value={fmtShort(final.avkastning)} />
          </div>
          {rows.filter((row) => [1, 3, 5, 10, 15, 20, 25, 30].includes(row.y)).map((row) => (
            <div key={row.y} style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr 1fr", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ color: C.textMid }}> r {row.y}</span>
              <span style={{ color: C.text, fontFamily: "monospace" }}>{fmtShort(row.kapital)}</span>
              <span style={{ color: C.textMid, fontFamily: "monospace" }}>{fmtShort(row.insatt)}</span>
              <span style={{ color: C.green, fontFamily: "monospace" }}>{fmtShort(row.avkastning)}</span>
            </div>
          ))}
        </Section>
      </div>
    </div>
  );
};

export default function App() {
  const [tab, setTab] = useState("kalkylator");
  const [intakterMode, setIntakterMode] = useState("timbaserat");
  const [timpris, setTimpris] = useState(1200);
  const [timmar, setTimmar] = useState(1800);
  const [debiteringsgrad, setDebiteringsgrad] = useState(85);
  const [direktOmsattning, setDirektOmsattning] = useState(2000000);
  const [vinstmarginal, setVinstmarginal] = useState(30);
  const [bruttolon, setBruttolon] = useState(50000);
  const [lonPeriod, setLonPeriod] = useState("man");
  const [pensionPct, setPensionPct] = useState(15);
  const [ovriga, setOvriga] = useState([
    { label: "Hyra / kontorsplats", amount: 3000 },
    { label: "Mjukvara & verktyg", amount: 1500 },
    { label: "F rs kringar", amount: 1000 },
  ]);
  const [utdelning, setUtdelning] = useState(200000);
  const [buffertPct, setBuffertPct] = useState(10);

  const r = useMemo(() => {
    const faktTim = timmar * (debiteringsgrad / 100);
    const omsattning = intakterMode === "timbaserat" ? timpris * faktTim : direktOmsattning;
    const lonTotal = bruttolon * 12 * 1.3142;
    const pension = bruttolon * 12 * (pensionPct / 100);
    const ovrigaSum = ovriga.reduce((s, k) => s + (k.amount || 0), 0) * 12;
    const ebit = intakterMode === "marginal" ? omsattning * (vinstmarginal / 100) : omsattning - lonTotal - pension - ovrigaSum;
    const buffert = omsattning * (buffertPct / 100);
    const kvarEfterUtdelning = ebit - utdelning;
    const tillgangligtKFAr = kvarEfterUtdelning - buffert;
    const tillgangligtKFMan = tillgangligtKFAr / 12;
    return { omsattning, lonTotal, pension, ovrigaSum, ebit, buffert, tillgangligtKFAr, tillgangligtKFMan, utdelningNetto: utdelning * 0.8, faktTim };
  }, [intakterMode, timpris, timmar, debiteringsgrad, direktOmsattning, vinstmarginal, bruttolon, pensionPct, ovriga, utdelning, buffertPct]);

  const tabs = [
    { id: "kalkylator", label: "Likviditetskalkylator" },
    { id: "sparande", label: "Sparande & Avkastning" },
    { id: "avgifter", label: "Avgiftskalkylator" },
    { id: "offert", label: "Offertj mf relse" },
    { id: "livforsakring", label: "Livf rs kring" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif", color: C.text }}>
      <div style={{ background: C.navy, padding: "0 32px", display: "flex", alignItems: "center" }}>
        <div style={{ padding: "18px 0", borderRight: "1px solid rgba(255,255,255,0.08)", paddingRight: 28, marginRight: 28, flexShrink: 0 }}>
          <div style={{ color: C.gold, fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Norrfinans</div>
        </div>
        <div style={{ display: "flex", gap: 2, overflowX: "auto" }}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? "rgba(255,255,255,0.08)" : "transparent", border: "none", borderBottom: tab === t.id ? `2px solid ${C.gold}` : "2px solid transparent", color: tab === t.id ? "#fff" : "rgba(255,255,255,0.45)", padding: "20px 18px 18px", cursor: "pointer", fontSize: 12, fontWeight: 700, letterSpacing: 0.5, fontFamily: "inherit", whiteSpace: "nowrap" }}>{t.label}</button>
          ))}
        </div>
      </div>
      <div style={{ height: 3, background: `linear-gradient(90deg,${C.gold},#E8B84B,${C.gold})` }} />

      {tab === "kalkylator" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 300px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ padding: "20px 16px", borderRight: `1px solid ${C.border}` }}>
            <Section title="Int kter">
              <div style={{ display: "flex", gap: 6, marginBottom: 16, background: C.surface2, borderRadius: 7, padding: 4 }}>
                {[{ id: "timbaserat", label: "Timbaserat" }, { id: "marginal", label: "Oms ttning & Marginal" }].map((m) => (
                  <button key={m.id} onClick={() => setIntakterMode(m.id)} style={{ flex: 1, padding: "8px 10px", borderRadius: 5, border: "none", background: intakterMode === m.id ? C.navy : "transparent", color: intakterMode === m.id ? "#fff" : C.textMid, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{m.label}</button>
                ))}
              </div>
              {intakterMode === "timbaserat" ? (
                <>
                  <InputRow label="Timpris" value={timpris} onChange={setTimpris} suffix="kr / tim" step={50} />
                  <InputRow label="Timmar /  r" value={timmar} onChange={setTimmar} suffix="tim" step={10} />
                  <InputRow label="Debiteringsgrad" value={debiteringsgrad} onChange={setDebiteringsgrad} suffix="%" step={1} max={100} />
                  <InfoChip label="Fakturerbara timmar" value={`${Math.round(r.faktTim).toLocaleString("sv-SE")} tim`} />
                  <div style={{ marginTop: 8 }}><InfoChip label="Oms ttning /  r" value={fmt(r.omsattning)} /></div>
                </>
              ) : (
                <>
                  <InputRow label="Oms ttning /  r" value={direktOmsattning} onChange={setDirektOmsattning} suffix="kr /  r" step={50000} />
                  <InputRow label="Vinstmarginal (EBIT)" value={vinstmarginal} onChange={setVinstmarginal} suffix="%" step={0.5} min={0} max={100} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <InfoChip label="Oms ttning / m n" value={fmt(direktOmsattning / 12)} />
                    <InfoChip label="EBIT /  r" value={fmt(r.ebit)} />
                  </div>
                </>
              )}
            </Section>

            <Section title="L n & Arbetsgivaravgift">
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                {[{ id: "man", label: "M nadsvis" }, { id: "ar", label: " rsvis" }].map((t) => (
                  <button key={t.id} onClick={() => setLonPeriod(t.id)} style={{ flex: 1, padding: "7px", borderRadius: 5, border: `1.5px solid ${lonPeriod === t.id ? C.navy : C.border}`, background: lonPeriod === t.id ? C.navy : "transparent", color: lonPeriod === t.id ? "#fff" : C.textMid, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{t.label}</button>
                ))}
              </div>
              <InputRow label={lonPeriod === "man" ? "Bruttol n / m nad" : "Bruttol n /  r"} value={lonPeriod === "man" ? bruttolon : bruttolon * 12} onChange={(v) => setBruttolon(lonPeriod === "man" ? v : Math.round(v / 12))} suffix={lonPeriod === "man" ? "kr / m n" : "kr /  r"} step={lonPeriod === "man" ? 1000 : 12000} />
            </Section>

            <Section title="Pensionsavs ttning">
              <InputRow label="% av bruttol n" value={pensionPct} onChange={setPensionPct} suffix="%" step={0.5} min={0} max={100} />
            </Section>

            <Section title=" vriga kostnader / m n">
              <OvrigKostnad items={ovriga} onChange={setOvriga} />
            </Section>

            <Section title="Utdelning & Buffert">
              <InputRow label="Planerad utdelning brutto /  r" value={utdelning} onChange={setUtdelning} suffix="kr /  r" step={10000} />
              <InputRow label="Likviditetsbuffert" value={buffertPct} onChange={setBuffertPct} suffix="% av oms ttning" step={1} min={0} max={100} />
            </Section>
          </div>

          <div style={{ padding: "20px 16px", borderRight: `1px solid ${C.border}` }}>
            <Section title="Resultat versikt">
              <WRow label="Oms ttning" value={r.omsattning} bold />
              <WRow label="L n & arbetsgivaravgift" value={-r.lonTotal} />
              <WRow label="Pensionsavs ttning" value={-r.pension} />
              <WRow label=" vriga kostnader" value={-r.ovrigaSum} />
              <WRow separator />
              <WRow label="EBIT" value={r.ebit} bold />
              <WRow label="Planerad utdelning" value={-utdelning} />
              <WRow label="Likviditetsbuffert" value={-r.buffert} />
              <WRow separator />
              <WRow label="Tillg ngligt f r kapitalf rs kring /  r" value={r.tillgangligtKFAr} bold />
            </Section>
          </div>

          <div style={{ padding: "20px 16px", background: "#EEF2F7" }}>
            <KFRow label="Tillg ngligt f r sparande / m n" value={r.tillgangligtKFMan} />
            <KFRow label="Tillg ngligt f r sparande /  r" value={r.tillgangligtKFAr} highlight large />
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7, padding: "14px 16px", margin: "12px 0" }}>
              <div style={{ color: C.textMid, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Netto utdelning</div>
              <div style={{ color: C.green, fontSize: 18, fontWeight: 700, fontFamily: "monospace" }}>{fmt(r.utdelningNetto)}</div>
            </div>
            <button onClick={() => setTab("sparande")} style={{ width: "100%", marginTop: 10, padding: "12px", background: C.goldLight, border: `1.5px solid ${C.gold}`, borderRadius: 7, color: C.gold, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Se sparande & avkastning</button>
            <button onClick={() => setTab("avgifter")} style={{ width: "100%", marginTop: 8, padding: "12px", background: C.surface2, border: `1.5px solid ${C.border}`, borderRadius: 7, color: C.navy, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>J mf r KF-avgifter</button>
            <button onClick={() => setTab("offert")} style={{ width: "100%", marginTop: 8, padding: "12px", background: C.surface2, border: `1.5px solid ${C.border}`, borderRadius: 7, color: C.navy, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>J mf r f rs kringsofferter</button>
            <button onClick={() => setTab("livforsakring")} style={{ width: "100%", marginTop: 8, padding: "12px", background: C.surface2, border: `1.5px solid ${C.border}`, borderRadius: 7, color: C.navy, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Ber kna livf rs kring</button>
          </div>
        </div>
      )}

      {tab === "sparande" && <SparandeView manSparande={Math.max(0, Math.round(r.tillgangligtKFMan))} />}
      {tab === "avgifter" && <AvgiftsView defaultManSparande={Math.max(0, Math.round(r.tillgangligtKFMan))} />}
      {tab === "offert" && <OffertView />}
      {tab === "livforsakring" && <LivforsakringView />}

      <div style={{ textAlign: "center", padding: "14px", color: C.textLight, fontSize: 11, borderTop: `1px solid ${C.border}`, background: C.surface }}>
        Ber kningar baserade p  svenska skatteregler 2024   Konsultera en revisor f r r dgivning
      </div>
    </div>
  );
}
