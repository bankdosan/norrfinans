import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const fmt = (n) => new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 }).format(n);
const fmtShort = (n) => {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(2).replace(".", ",") + " mnkr";
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(0) + " tkr";
  return fmt(n);
};

const BURGUNDY = "#9B182D";
const RED = "#E73331";
const CREAM = "#F5F3EE";
const GREEN = "#2a7a4b";

function NumInput({ label, value, onChange, prefix, suffix, step = 1, min = 0, max }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", background: "#fff", border: "1.5px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
        {prefix && <span style={{ padding: "0 10px", color: "#888", fontSize: 13, background: "#f8f6f2", borderRight: "1px solid #ddd", whiteSpace: "nowrap" }}>{prefix}</span>}
        <input
          type="number" value={value} min={min} max={max} step={step}
          onChange={e => onChange(Number(e.target.value))}
          style={{ flex: 1, border: "none", outline: "none", padding: "10px 12px", fontSize: 15, background: "transparent", color: "#222", minWidth: 0 }}
        />
        {suffix && <span style={{ padding: "0 10px", color: "#888", fontSize: 13, background: "#f8f6f2", borderLeft: "1px solid #ddd", whiteSpace: "nowrap" }}>{suffix}</span>}
      </div>
    </div>
  );
}

function SegmentToggle({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", background: "#f0ede8", borderRadius: 8, padding: 3, gap: 2 }}>
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)}
          style={{
            padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer",
            fontWeight: 600, fontSize: 13,
            background: value === o.value ? BURGUNDY : "transparent",
            color: value === o.value ? "#fff" : "#888",
            transition: "all 0.15s"
          }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function KPI({ label, value, sub, accent }) {
  return (
    <div style={{ background: "#fff", borderRadius: 10, padding: "14px 18px", border: `1.5px solid ${accent || "#e5e1d8"}`, flex: 1, minWidth: 130 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: accent || BURGUNDY }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#aaa", marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label, visning }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{ background: "#fff", border: "1px solid #e0ddd7", borderRadius: 8, padding: "10px 14px", fontSize: 13, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
      <div style={{ fontWeight: 700, color: BURGUNDY, marginBottom: 4 }}>{visning === "år" ? `År ${label}` : `Månad ${label}`}</div>
      <div>Kapital kvar: <strong>{fmt(d?.kapital ?? 0)}</strong></div>
      {d?.fas === "tillväxt"
        ? <div style={{ color: GREEN }}>Tillväxtfas – ingen utbetalning</div>
        : <div style={{ color: "#555" }}>Utbetalt hittills: {fmt(d?.utbetaltTotalt ?? 0)}</div>
      }
      <div style={{ color: GREEN }}>Återbäring hittills: {fmt(d?.aterbäringTotalt ?? 0)}</div>
    </div>
  );
};

export default function Livranta() {
  const [kapital, setKapital] = useState(2_000_000);
  const [utbetalning, setUtbetalning] = useState(10_000);
  const [utbMode, setUtbMode] = useState("månadsbelopp");
  const [månader, setMånader] = useState(120);
  const [ränta, setRänta] = useState(6);
  const [startÅr, setStartÅr] = useState(1);
  const [visning, setVisning] = useState("år");

  const calc = useMemo(() => {
    const månRänta = ränta / 100 / 12;
    const startMånad = startÅr * 12;

    // Kapital vid utbetalningsstart — ränta tillförs årsvis under tillväxtfasen
    let saldoVidStart = kapital;
    for (let å = 0; å < startÅr; å++) {
      saldoVidStart *= (1 + ränta / 100);
    }

    // Bestäm månadsutbetalning
    let månUtbetalning;
    if (utbMode === "utbetalningstid") {
      if (månRänta === 0) {
        månUtbetalning = saldoVidStart / månader;
      } else {
        månUtbetalning = saldoVidStart * månRänta / (1 - Math.pow(1 + månRänta, -månader));
      }
    } else {
      månUtbetalning = utbetalning;
    }

    // Simulera månad för månad
    // Logik: ränta tillförs ENDAST vid årets slut (månad 12, 24, 36 ...)
    // Utbetalning sker varje månad från startMånad+1
    let saldo = kapital;
    let utbetaltTotalt = 0;
    let aterbäringTotalt = 0;
    let tomMånad = null;

    const maxMånader = Math.min(
      utbMode === "utbetalningstid" ? startMånad + månader : startMånad + 600,
      240 // max 20 år
    );

    const månadsData = [{
      månad: 0, kapital: saldo, utbetaltTotalt: 0, aterbäringTotalt: 0, fas: "tillväxt", label: 0
    }];

    for (let m = 1; m <= maxMånader; m++) {
      const iUtbetalning = m > startMånad;

      // 1. Utbetalning varje månad (om utbetalningsfas)
      if (iUtbetalning) {
        const faktiskUtb = Math.min(månUtbetalning, saldo);
        saldo -= faktiskUtb;
        utbetaltTotalt += faktiskUtb;
      }

      // 2. Ränta tillförs endast vid årets slut
      if (m % 12 === 0) {
        const aterbäring = saldo * (ränta / 100);
        saldo += aterbäring;
        aterbäringTotalt += aterbäring;
      }

      if (saldo <= 0.01 && iUtbetalning && !tomMånad) {
        tomMånad = m;
        saldo = 0;
      }

      månadsData.push({
        månad: m,
        kapital: Math.max(saldo, 0),
        utbetaltTotalt,
        aterbäringTotalt,
        fas: iUtbetalning ? "utbetalning" : "tillväxt",
        label: m
      });

      if (tomMånad && m > tomMånad) break;
    }

    // Årsdata — ta snapshot vid varje helårsskifte
    const totalMånader = månadsData.length - 1;
    const totalÅr = Math.ceil(totalMånader / 12);
    const årsData = [];
    for (let å = 0; å <= totalÅr; å++) {
      const idx = Math.min(å * 12, totalMånader);
      const d = månadsData[idx];
      årsData.push({ ...d, år: å, label: å });
    }

    const räckerTid = tomMånad
      ? `${tomMånad} mån (${(tomMånad / 12).toFixed(1)} år)`
      : "Hela perioden";

    return {
      månadsData,
      årsData,
      månUtbetalning,
      utbetaltTotalt,
      aterbäringTotalt,
      tomMånad,
      saldoVidStart,
      räckerTid,
      totalÅr,
    };
  }, [kapital, utbetalning, utbMode, månader, ränta, startÅr]);

  const chartData = visning === "år" ? calc.årsData : calc.månadsData;

  // X-axel intervall: aldrig mer än ~12 labels i årsvy, ~24 i månadsvy
  const xInterval = visning === "år"
    ? Math.max(1, Math.ceil(calc.totalÅr / 12))
    : Math.max(1, Math.ceil(calc.månadsData.length / 24));

  const startIdx = visning === "år" ? startÅr : startÅr * 12;
  const tomIdx = calc.tomMånad
    ? (visning === "år" ? Math.ceil(calc.tomMånad / 12) : calc.tomMånad)
    : null;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: CREAM, minHeight: "100vh", padding: "24px 20px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        <div style={{ marginBottom: 22 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: BURGUNDY }}>Livränta</h2>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: 13 }}>
            Återbäringsräntan tillförs varje månad på befintligt kapital — före utbetalning. Under tillväxtfasen (innan utbetalning startar) växer hela kapitalet.
          </p>
        </div>

        {/* Inputs */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", marginBottom: 16, border: "1px solid #e5e1d8" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            <NumInput label="Engångsinsättning" value={kapital} onChange={setKapital} prefix="kr" step={50000} min={1} />
            <NumInput label="Återbäringsränta" value={ränta} onChange={setRänta} suffix="%" step={0.5} min={0} max={30} />
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.05em" }}>Utbetalning börjar år</label>
              <div style={{ display: "flex", gap: 6 }}>
                {[0, 1, 2, 3, 4, 5].map(å => (
                  <button key={å} onClick={() => setStartÅr(å)}
                    style={{
                      flex: 1, padding: "9px 4px", borderRadius: 7, border: "1.5px solid",
                      borderColor: startÅr === å ? BURGUNDY : "#ddd",
                      background: startÅr === å ? BURGUNDY : "#fff",
                      color: startÅr === å ? "#fff" : "#555",
                      fontWeight: 700, fontSize: 14, cursor: "pointer"
                    }}>
                    {å}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #f0ede8" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.05em" }}>Utbetalningsläge</span>
              <SegmentToggle
                options={[{ value: "månadsbelopp", label: "Ange månadsbelopp" }, { value: "utbetalningstid", label: "Ange utbetalningstid" }]}
                value={utbMode} onChange={setUtbMode}
              />
            </div>
            {utbMode === "månadsbelopp"
              ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <NumInput label="Månadsutbetalning" value={utbetalning} onChange={setUtbetalning} prefix="kr/mån" step={500} min={1} />
                  <button
                    onClick={() => setUtbetalning(Math.floor(calc.saldoVidStart * (ränta / 100) / 12))}
                    style={{
                      alignSelf: "flex-start", padding: "6px 14px", borderRadius: 7,
                      border: `1.5px solid ${GREEN}`, background: "#f0faf4",
                      color: GREEN, fontWeight: 700, fontSize: 12, cursor: "pointer"
                    }}>
                    Max utan kapitalminskning → {fmt(Math.floor(calc.saldoVidStart * (ränta / 100) / 12))} /mån
                  </button>
                </div>
              )
              : <NumInput label="Utbetalningstid (från startår)" value={månader} onChange={setMånader} suffix="månader" step={12} min={1} />
            }
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
          <KPI label="Månadsutbetalning" value={fmt(calc.månUtbetalning)} sub={`Börjar år ${startÅr}`} accent={BURGUNDY} />
          <KPI
            label={`Kapital år ${startÅr}`}
            value={fmtShort(calc.saldoVidStart)}
            sub={startÅr > 1 ? `+${fmtShort(calc.saldoVidStart - kapital)} i tillväxt` : "Ingen tillväxtfas"}
            accent="#2a5f9e"
          />
          <KPI label="Total återbäring" value={fmtShort(calc.aterbäringTotalt)} sub={`Vid ${ränta}% p.a.`} accent={GREEN} />
          <KPI label="Kapitalet räcker" value={calc.räckerTid} sub={calc.tomMånad ? "OBS: tar slut!" : "Hela perioden"} accent={calc.tomMånad ? RED : GREEN} />
        </div>

        {/* Chart */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1px solid #e5e1d8" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#333" }}>Kapitalutveckling</span>
            <SegmentToggle
              options={[{ value: "år", label: "Per år" }, { value: "månad", label: "Per månad" }]}
              value={visning} onChange={setVisning}
            />
          </div>

          {calc.tomMånad && (
            <div style={{ background: "#fff3f3", border: "1px solid #f5c0c0", borderRadius: 8, padding: "8px 14px", marginBottom: 14, fontSize: 13, color: "#c0392b" }}>
              ⚠️ Kapitalet tar slut efter {calc.tomMånad} månader ({(calc.tomMånad / 12).toFixed(1)} år) — minska månadsbeloppet eller öka återbäringsräntan.
            </div>
          )}

          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="kapGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={BURGUNDY} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={BURGUNDY} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#999" }}
                tickFormatter={v => visning === "år" ? `År ${v}` : `M${v}`}
                interval={xInterval}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#999" }}
                tickFormatter={v => v >= 1_000_000 ? (v / 1_000_000).toFixed(1) + "M" : v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}
                width={62}
              />
              <Tooltip content={<CustomTooltip visning={visning} />} />
              <ReferenceLine x={startIdx} stroke={GREEN} strokeDasharray="4 4"
                label={{ value: `Utbet. år ${startÅr}`, fill: GREEN, fontSize: 11, position: "insideTopRight" }} />
              {tomIdx && (
                <ReferenceLine x={tomIdx} stroke={RED} strokeDasharray="4 4"
                  label={{ value: "Tomt", fill: RED, fontSize: 11 }} />
              )}
              <Area type="monotone" dataKey="kapital"
                stroke={BURGUNDY} strokeWidth={2.5}
                fill="url(#kapGrad)"
                dot={false} activeDot={{ r: 5, fill: BURGUNDY }}
              />
            </AreaChart>
          </ResponsiveContainer>

          <div style={{ display: "flex", gap: 20, marginTop: 12, fontSize: 12, color: "#aaa", justifyContent: "center", flexWrap: "wrap" }}>
            <span><span style={{ display: "inline-block", width: 12, height: 3, background: BURGUNDY, borderRadius: 2, verticalAlign: "middle", marginRight: 4 }} />Kapital kvar</span>
            <span><span style={{ display: "inline-block", width: 20, borderTop: `2px dashed ${GREEN}`, verticalAlign: "middle", marginRight: 4 }} />Utbetalning startar</span>
            {calc.tomMånad && <span><span style={{ display: "inline-block", width: 20, borderTop: `2px dashed ${RED}`, verticalAlign: "middle", marginRight: 4 }} />Kapital tomt</span>}
          </div>
        </div>

      </div>
    </div>
  );
}
