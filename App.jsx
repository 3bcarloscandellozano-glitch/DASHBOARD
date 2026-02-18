import { useState, useEffect, useRef } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

// ═══════════════════════════════════════════════════════════════
//  DATA — Thessalian dialect in the Dodona corpus
// ═══════════════════════════════════════════════════════════════

const REGIONS = [
  { id: "general", name: "Sin adscripción regional", short: "General", en: "Unassigned", value: 57, seguro: 33, dudoso: 22, nombre: 2,
    chronoV: 21, chronoVIV: 14, noDate: 22 },
  { id: "pelasgiotis", name: "Pelasgiótide", short: "Pelasg.", en: "Pelasgiotis", value: 11, seguro: 10, dudoso: 1, nombre: 0,
    chronoV: 3, chronoVIV: 3, noDate: 5 },
  { id: "histiaiotis", name: "Histiótide", short: "Histiot.", en: "Histiaiotis", value: 8, seguro: 7, dudoso: 1, nombre: 0,
    chronoV: 1, chronoVIV: 4, noDate: 3 },
  { id: "thessaliotis", name: "Tesaliótide", short: "Tesaliot.", en: "Thessaliotis", value: 5, seguro: 4, dudoso: 1, nombre: 0,
    chronoV: 1, chronoVIV: 4, noDate: 0 },
];

const TOTAL_DIALECT = 806;
const TOTAL_THESS = 81;
const TOTAL_THESS_UNIQUE = 75;
const TOTAL_CORPUS = 4438;

const CHRONO_DETAIL = [
  { period: "Pr. V", n: 3 },
  { period: "1ª mit. V", n: 7 },
  { period: "Med. V", n: 4 },
  { period: "2ª mit. V", n: 3 },
  { period: "Fin. V", n: 9 },
  { period: "V (gen.)", n: 3 },
  { period: "V – IV", n: 5 },
  { period: "Pr. IV", n: 5 },
  { period: "1ª mit. IV", n: 3 },
  { period: "Med. IV", n: 5 },
  { period: "2ª mit. IV", n: 3 },
  { period: "Fin. IV", n: 2 },
  { period: "III–II", n: 1 },
];

const THEMES = [
  { name: "Religión", value: 17 },
  { name: "Amor / Familia", value: 10 },
  { name: "Dinero", value: 9 },
  { name: "Vida / Salud", value: 8 },
  { name: "Oficio / Comercio", value: 7 },
  { name: "Viaje", value: 4 },
  { name: "Otros", value: 6 },
  { name: "Desconocido", value: 15 },
];

// Vowel notation data (19 inscriptions)
// dvcs as arrays of {src, id} for italic rendering
const VOWEL_NOTATION = [
  { type: "⟨ΕΙ⟩ ⟨ΟΥ⟩ sin ⟨Η⟩ ⟨Ω⟩", n: 6, desc: "Notación tesalia estándar", color: "#2e7d46",
    dvcs: [
      { src: "DVC", id: "31A" }, { src: "DVC", id: "159A" }, { src: "DVC", id: "1134A" },
      { src: "DVC", id: "2015B" }, { src: "DVC", id: "3274A" }, { src: "DVC", id: "3687A" },
    ] },
  { type: "⟨ΕΙ⟩ ⟨ΟΥ⟩ + ⟨Η⟩ ⟨Ω⟩", n: 9, desc: "Mezcla de notaciones", color: "#b07520",
    dvcs: [
      { src: "DVC", id: "217A" }, { src: "DVC", id: "219B" }, { src: "DVC", id: "1340A" },
      { src: "DVC", id: "2204A" }, { src: "DVC", id: "3002B" }, { src: "DVC", id: "3055A" },
      { src: "DVC", id: "3113A" }, { src: "DVC", id: "3545B" }, { src: "Lhôte", id: "80" },
    ] },
  { type: "⟨Η⟩ ⟨Ω⟩ sin ⟨ΕΙ⟩ ⟨ΟΥ⟩", n: 4, desc: "Notación ática / koiné", color: "#b04535",
    dvcs: [
      { src: "DVC", id: "556A" }, { src: "DVC", id: "992A" }, { src: "DVC", id: "1416A" },
      { src: "Lhôte", id: "8B" },
    ] },
];

// Detailed inscriptions for the vowel table
const VOWEL_EXAMPLES = [
  { src: "DVC", id: "31A", cat: 1, date: "Med. IV", region: "—", form: "ἔχου (= ático ἔχω)" },
  { src: "DVC", id: "159A", cat: 1, date: "Fin. V", region: "Pelasg.", form: "Πυρκοτέλεις (= ático -τέλης)" },
  { src: "DVC", id: "1134A", cat: 1, date: "1ª mit. IV", region: "Tesaliot.", form: "ὑγιείς (= ático ὑγιής)" },
  { src: "DVC", id: "2015B", cat: 1, date: "1ª mit. IV", region: "Histiot.", form: "σουτειρί[α] (= ático σωτηρία)" },
  { src: "DVC", id: "3274A", cat: 1, date: "1ª mit. IV", region: "—", form: "μα[στε]ύουμεν" },
  { src: "DVC", id: "3687A", cat: 1, date: "Princ. IV", region: "—", form: "[τί]νι κα θεοῦν εἴει" },
  { src: "DVC", id: "217A", cat: 2, date: "Med. IV", region: "Histiot.?", form: "Δου[δουναῖον] + ἦ" },
  { src: "DVC", id: "219B", cat: 2, date: "2ª mit. IV", region: "—", form: "τίνι θεοῦ (= ático θεῷ) + σωτηρί[ας]" },
  { src: "DVC", id: "1340A", cat: 2, date: "Fin. IV", region: "Histiot.?", form: "εἶ + γαοργέω" },
  { src: "DVC", id: "2204A", cat: 2, date: "Fin. V", region: "Histiot.?", form: "Δουδωναίει (dativo híbrido)" },
  { src: "DVC", id: "3002B", cat: 2, date: "1ª mit. IV", region: "—", form: "γαοργέουμ̣[εν] + ἦ"  },
  { src: "DVC", id: "3055A", cat: 2, date: "c. 350", region: "—", form: "Κούας (= Κώιας?) + Διώνα" },
  { src: "DVC", id: "3113A", cat: 2, date: "Fin. IV", region: "Pelasg.", form: "εἶ, σούσεται + [Δι]ώνηι" },
  { src: "DVC", id: "3545B", cat: 2, date: "Fin. V", region: "—", form: "κί̣νι κε + [μ]αντήαν" },
  { src: "Lhôte", id: "80A", cat: 2, date: "c. 375", region: "—", form: "ἐρουτᾶι + Διώναν, ὠφέλιμον" },
  { src: "DVC", id: "556A", cat: 3, date: "Fin. IV", region: "Pelasg.", form: "ἀρρωστήσαεν + ἀρρωστεματος" },
  { src: "DVC", id: "992A", cat: 3, date: "2ª mit. IV", region: "Tesaliot.?", form: "κε + Μέννη (nombre frecuentemente atestiguado en Tesalia) → único caso sistemático" },
  { src: "DVC", id: "1416A", cat: 3, date: "1ª mit. IV", region: "Pelasg.", form: "Μελανθίων + θεο͂ν" },
  { src: "Lhôte", id: "8B", cat: 3, date: "III–II", region: "Pelasg.", form: "Μον[δ]α̣ιατᾶν τὸ κοινὸν + Νάωι, Διώναι{ς} (¿dórico local?)" },
];

// ═══════════════════════════════════════════════════════════════
//  HELPERS — render "I. Dodone DVC 31A" / "I. Dodone Lhôte 80A"
// ═══════════════════════════════════════════════════════════════

const Ref = ({ src, id, style }) => (
  <span style={style}>
    <i>I. Dodone {src}</i> {id}
  </span>
);

const RefList = ({ dvcs }) => (
  <span>
    {dvcs.map((d, i) => (
      <span key={i}>
        {i > 0 && ", "}
        <Ref src={d.src} id={d.id} />
      </span>
    ))}
  </span>
);

// ═══════════════════════════════════════════════════════════════
//  PALETTE — Light parchment theme
// ═══════════════════════════════════════════════════════════════

const C = {
  bg: "#f5f0e8",
  card: "rgba(120,90,40,0.05)",
  border: "rgba(120,90,40,0.15)",
  gold: "#8b6914",
  amber: "#a06a10",
  terra: "#a54030",
  green: "#2e7d46",
  blue: "#2a6a8e",
  muted: "#7a7060",
  text: "#3a352e",
  dim: "#9a9080",
  heading: "#2c2720",
  regions: {
    general: "#8a7e6a",
    pelasgiotis: "#2a6a8e",
    histiaiotis: "#a54030",
    thessaliotis: "#2e7d46",
    phthiotis: "#a06a10",
  },
};

// ═══════════════════════════════════════════════════════════════
//  COMPONENTS
// ═══════════════════════════════════════════════════════════════

const Tip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{ background: "rgba(255,252,245,0.97)", border: `1px solid ${C.border}`, borderRadius: 6,
      padding: "10px 14px", fontFamily: "var(--fb)", color: C.text, fontSize: 13, maxWidth: 260,
      boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
      <div style={{ fontWeight: 700, color: C.gold, marginBottom: 3, fontFamily: "var(--fh)" }}>
        {d?.name || d?.label || d?.period || d?.type || ""}
      </div>
      {payload.map((p, i) => <div key={i}>{p.name}: <b style={{ color: C.heading }}>{p.value}</b></div>)}
      {d?.en && <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{d.en}</div>}
      {d?.desc && <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{d.desc}</div>}
    </div>
  );
};

const Stat = ({ label, value, sub, accent }) => (
  <div style={{ background: "rgba(255,252,245,0.6)", border: `1px solid ${C.border}`, borderRadius: 8,
    padding: "16px 18px", textAlign: "center", flex: "1 1 120px", minWidth: 120 }}>
    <div style={{ fontFamily: "var(--fh)", fontSize: 30, fontWeight: 700, color: accent || C.gold, lineHeight: 1.1 }}>{value}</div>
    <div style={{ fontFamily: "var(--fb)", fontSize: 10, color: C.muted, marginTop: 4, textTransform: "uppercase", letterSpacing: 1.6 }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: C.dim, marginTop: 2 }}>{sub}</div>}
  </div>
);

const Sec = ({ title, sub, children, note }) => (
  <section style={{ marginBottom: 40 }}>
    <h2 style={{ fontFamily: "var(--fh)", fontSize: 21, fontWeight: 600, color: C.heading, margin: "0 0 2px" }}>{title}</h2>
    {sub && <p style={{ fontSize: 12, color: C.muted, margin: "0 0 12px", fontStyle: "italic" }}>{sub}</p>}
    {children}
    {note && <div style={{ background: "rgba(255,252,245,0.6)", border: `1px solid ${C.border}`, borderRadius: 8, padding: "13px 16px", marginTop: 12 }}>
      <p style={{ margin: 0, fontSize: 12.5, color: C.text, lineHeight: 1.7 }}>{note}</p>
    </div>}
  </section>
);

const Tag = ({ children, active, onClick }) => (
  <button onClick={onClick} style={{
    background: active ? "rgba(139,105,20,0.12)" : "transparent",
    border: active ? `1px solid rgba(139,105,20,0.25)` : "1px solid transparent",
    borderRadius: 7, padding: "8px 14px", cursor: "pointer",
    color: active ? C.gold : C.muted,
    fontFamily: "var(--fh)", fontSize: 13.5, fontWeight: active ? 700 : 400, transition: "all 0.15s",
  }}>{children}</button>
);

// ═══════════════════════════════════════════════════════════════
//  SVG MAP OF THESSALY
// ═══════════════════════════════════════════════════════════════

const ThessalyMap = ({ hover, setHover, selected, setSelected }) => {
  const regions = [
    {
      id: "histiaiotis", label: "Histiótide", en: "Histiaiotis", city: "Trikala",
      path: "M 55,42 L 105,28 L 168,32 L 172,58 L 168,90 L 140,108 L 100,112 L 62,100 L 42,75 Z",
      labelPos: [108, 72], cityPos: [120, 58],
    },
    {
      id: "pelasgiotis", label: "Pelasgiótide", en: "Pelasgiotis", city: "Larissa",
      path: "M 168,32 L 230,22 L 290,38 L 305,70 L 295,108 L 260,128 L 210,125 L 168,112 L 168,90 L 172,58 Z",
      labelPos: [230, 75], cityPos: [240, 60],
    },
    {
      id: "thessaliotis", label: "Tesaliótide", en: "Thessaliotis", city: "Farsalo",
      path: "M 62,100 L 100,112 L 140,108 L 168,112 L 172,140 L 158,172 L 120,190 L 78,180 L 48,155 L 42,125 Z",
      labelPos: [108, 150], cityPos: [120, 138],
    },
    {
      id: "phthiotis", label: "Ftiótide", en: "Phthiotis", city: "Lamia",
      path: "M 168,112 L 210,125 L 260,128 L 278,150 L 272,182 L 240,205 L 190,210 L 152,195 L 120,190 L 158,172 L 172,140 Z",
      labelPos: [210, 162], cityPos: [218, 148],
    },
  ];

  const mountains = [
    { name: "Olimpo", x: 270, y: 28, icon: "▲" },
    { name: "Pindo", x: 35, y: 90, icon: "▲" },
    { name: "Otris", x: 195, y: 215, icon: "▲" },
    { name: "Osa", x: 305, y: 88, icon: "▲" },
  ];

  const dataByRegion = {
    histiaiotis: REGIONS.find(r => r.id === "histiaiotis"),
    pelasgiotis: REGIONS.find(r => r.id === "pelasgiotis"),
    thessaliotis: REGIONS.find(r => r.id === "thessaliotis"),
    phthiotis: null,
  };

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox="10 5 320 225" style={{ width: "100%", maxWidth: 520, display: "block", margin: "0 auto" }}>
        <defs>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {regions.map(r => {
          const data = dataByRegion[r.id];
          const isHovered = hover === r.id;
          const isSel = selected === r.id;
          const hasData = !!data;
          const baseColor = C.regions[r.id] || "#999";
          const fillOpacity = isHovered ? 0.35 : isSel ? 0.28 : hasData ? 0.15 : 0.05;

          return (
            <g key={r.id}
              onMouseEnter={() => setHover(r.id)}
              onMouseLeave={() => setHover(null)}
              onClick={() => hasData && setSelected(selected === r.id ? null : r.id)}
              style={{ cursor: hasData ? "pointer" : "default" }}>
              <path d={r.path} fill={baseColor} fillOpacity={fillOpacity}
                stroke={isHovered || isSel ? C.gold : baseColor}
                strokeWidth={isHovered || isSel ? 2 : 1}
                strokeOpacity={isHovered || isSel ? 0.9 : 0.35}
                filter={isHovered ? "url(#glow)" : "none"}
                style={{ transition: "all 0.2s" }} />
              <text x={r.labelPos[0]} y={r.labelPos[1]} textAnchor="middle"
                style={{ fontSize: 11, fontWeight: 600, fill: isHovered || isSel ? C.heading : C.text,
                  fontFamily: "Playfair Display, Georgia, serif", transition: "fill 0.2s" }}>
                {r.label}
              </text>
              <text x={r.labelPos[0]} y={r.labelPos[1] + 13} textAnchor="middle"
                style={{ fontSize: 8.5, fill: C.muted, fontFamily: "DM Sans, sans-serif", fontStyle: "italic" }}>
                {r.en}
              </text>
              {hasData && (
                <text x={r.labelPos[0]} y={r.labelPos[1] + 27} textAnchor="middle"
                  style={{ fontSize: 16, fontWeight: 700, fill: C.gold, fontFamily: "Playfair Display, serif" }}>
                  {data.value}
                </text>
              )}
              {!hasData && (
                <text x={r.labelPos[0]} y={r.labelPos[1] + 25} textAnchor="middle"
                  style={{ fontSize: 9, fill: C.dim, fontFamily: "DM Sans, sans-serif" }}>
                  (sin datos)
                </text>
              )}
              <circle cx={r.cityPos[0]} cy={r.cityPos[1]} r={2.5}
                fill={isHovered || isSel ? C.heading : C.muted} style={{ transition: "fill 0.2s" }} />
              <text x={r.cityPos[0] + 6} y={r.cityPos[1] + 3}
                style={{ fontSize: 7.5, fill: C.dim, fontFamily: "DM Sans, sans-serif" }}>
                {r.city}
              </text>
            </g>
          );
        })}

        {mountains.map(m => (
          <g key={m.name}>
            <text x={m.x} y={m.y} textAnchor="middle" style={{ fontSize: 10, fill: "rgba(120,90,40,0.2)" }}>{m.icon}</text>
            <text x={m.x} y={m.y + 10} textAnchor="middle" style={{ fontSize: 6.5, fill: "rgba(120,90,40,0.18)", fontFamily: "DM Sans, sans-serif" }}>{m.name}</text>
          </g>
        ))}

        <g>
          <line x1="28" y1="72" x2="10" y2="62" stroke={C.amber} strokeWidth={0.8} strokeDasharray="3 2" opacity={0.4} />
          <text x="10" y="58" textAnchor="start" style={{ fontSize: 7, fill: C.amber, fontFamily: "DM Sans, sans-serif", fontWeight: 700, opacity: 0.5 }}>← Dodona</text>
        </g>

        <text x="168" y="118" textAnchor="middle"
          style={{ fontSize: 7, fill: "rgba(139,105,20,0.35)", fontFamily: "DM Sans, sans-serif" }}>
          n = 57 sin región
        </text>
      </svg>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  APP
// ═══════════════════════════════════════════════════════════════

export default function App() {
  const [tab, setTab] = useState("map");
  const [hover, setHover] = useState(null);
  const [selected, setSelected] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => { setFadeIn(true); }, []);

  const tabs = [
    { id: "map", l: "Mapa / Regiones", i: "🗺" },
    { id: "profile", l: "Perfil dialectal", i: "Θ" },
    { id: "vowels", l: "Vocalismo", i: "Ε" },
  ];

  const selRegion = selected ? REGIONS.find(r => r.id === selected) : null;

  const certezaData = [
    { name: "Seguro", value: 54, c: C.green },
    { name: "Dudoso", value: 25, c: C.terra },
    { name: "Solo nombre/alfab.", value: 2, c: C.muted },
  ];

  const regionPie = REGIONS.map(r => ({ name: r.short, value: r.value, full: r.name, en: r.en }));

  const contextPie = [
    { name: "Dórico", value: 409, c: "#a54030" },
    { name: "Jón-Át-Koiné", value: 139, c: "#2a6a8e" },
    { name: "Mezcla dial.", value: 110, c: "#a06a10" },
    { name: "Tesalio", value: 81, c: "#2e7d46" },
    { name: "Dór. M.Gr.", value: 25, c: "#7a5e3c" },
    { name: "Beocio", value: 23, c: "#6a5b89" },
    { name: "Otros", value: 19, c: "#888" },
  ];

  return (
    <div style={{
      "--fh": "'Playfair Display', Georgia, serif",
      "--fb": "'DM Sans', 'Helvetica Neue', sans-serif",
      minHeight: "100vh",
      background: `linear-gradient(170deg, #f7f2ea 0%, #f0ebe0 40%, #ece6d8 100%)`,
      color: C.text, fontFamily: "var(--fb)",
      opacity: fadeIn ? 1 : 0, transition: "opacity 0.6s",
    }}>

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse at 30% 25%, rgba(46,125,70,0.03) 0%, transparent 55%),
                     radial-gradient(ellipse at 75% 70%, rgba(42,106,142,0.02) 0%, transparent 45%)` }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 920, margin: "0 auto", padding: "28px 22px 60px" }}>

        {/* HEADER */}
        <header style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 9.5, letterSpacing: 6, textTransform: "uppercase", color: C.green, opacity: 0.8, marginBottom: 8 }}>
            Corpus DVC · Dodona · Monográfico
          </div>
          <h1 style={{ fontFamily: "var(--fh)", fontSize: 36, fontWeight: 400, margin: 0, color: C.heading, lineHeight: 1.2 }}>
            El dialecto{" "}
            <span style={{ fontWeight: 700, color: C.gold, fontStyle: "italic" }}>tesalio</span>
            {" "}en Dodona
          </h1>
          <p style={{ fontSize: 12, color: C.muted, margin: "6px 0 0", fontStyle: "italic" }}>
            81 inscripciones · 10,3% del corpus con clasificación dialectal · ss. V–II a.C.
          </p>
          <div style={{ width: 50, height: 1, background: `linear-gradient(90deg, transparent, ${C.border}, transparent)`, margin: "14px auto 0" }} />
        </header>

        {/* STATS */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
          <Stat label="Inscripciones" value="81" sub="Con duplicación" accent={C.green} />
          <Stat label="Únicas" value="75" sub="Sin duplicación" />
          <Stat label="% del corpus dial." value="10,3%" sub="81 / 806" accent={C.terra} />
          <Stat label="Regiones" value="3+1" sub="3 tétradas + general" />
          <Stat label="Arco temporal" value="V–II" sub="a.C." />
        </div>

        {/* NAV */}
        <nav style={{ display: "flex", gap: 3, justifyContent: "center", flexWrap: "wrap", marginBottom: 26,
          background: "rgba(255,252,245,0.5)", borderRadius: 10, padding: 4, border: `1px solid ${C.border}` }}>
          {tabs.map(t => <Tag key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
            <span style={{ marginRight: 5 }}>{t.i}</span>{t.l}
          </Tag>)}
        </nav>

        {/* ════════════ MAP / REGIONS ════════════ */}
        {tab === "map" && (<>
          <Sec title="Distribución regional" sub="Clic en una tétrada para ver su detalle · Ftiótide no aparece en el corpus">
            <ThessalyMap hover={hover} setHover={setHover} selected={selected} setSelected={setSelected} />
          </Sec>

          {selRegion && (
            <Sec title={`⤷ ${selRegion.name}`} sub={`${selRegion.en} · ${selRegion.value} inscripciones`}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                <Stat label="Total" value={selRegion.value} accent={C.regions[selRegion.id]} />
                {selRegion.nombre > 0 && <Stat label="Solo nombre" value={selRegion.nombre} accent={C.muted} />}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Stat label="s. V a.C." value={selRegion.chronoV} />
                <Stat label="Transición V–IV" value={selRegion.chronoVIV} />
                {selRegion.noDate > 0 && <Stat label="Sin fecha" value={selRegion.noDate} accent={C.dim} />}
              </div>
            </Sec>
          )}

          <Sec title="Inscripciones por tétrada" sub="Distribución de las 81 adscripciones tesalias (con duplicación)">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
              <div style={{ flex: "1 1 300px" }}>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={regionPie} cx="50%" cy="50%" outerRadius={110} innerRadius={40}
                      dataKey="value" stroke="rgba(255,252,245,0.8)" strokeWidth={2}
                      label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                      labelLine={{ stroke: C.dim }}>
                      {regionPie.map((_, i) => <Cell key={i} fill={[C.muted, C.blue, C.terra, C.green][i]} />)}
                    </Pie>
                    <Tooltip content={<Tip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: "1 1 200px" }}>
                {REGIONS.map((r, i) => (
                  <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8,
                    padding: "6px 10px", borderRadius: 6,
                    background: selected === r.id ? C.card : "transparent",
                    border: selected === r.id ? `1px solid ${C.border}` : "1px solid transparent",
                    cursor: "pointer", transition: "all 0.15s" }}
                    onClick={() => setSelected(selected === r.id ? null : r.id)}>
                    <div style={{ width: 11, height: 11, borderRadius: 3, background: [C.muted, C.blue, C.terra, C.green][i] }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{r.name}</div>
                      <div style={{ fontSize: 10.5, color: C.dim }}>{r.en}</div>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: C.gold, fontFamily: "var(--fh)" }}>{r.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </Sec>

          <Sec title="Tesalio en contexto" sub="Peso relativo del tesalio respecto a los demás dialectos del corpus">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={contextPie} margin={{ top: 5, right: 20, left: 0, bottom: 45 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,90,40,0.08)" />
                <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 11 }} angle={-25} textAnchor="end" interval={0} stroke={C.border} />
                <YAxis tick={{ fill: C.muted, fontSize: 11 }} stroke={C.border} />
                <Tooltip content={<Tip />} />
                <Bar dataKey="value" name="Inscr." radius={[4,4,0,0]}>
                  {contextPie.map((d, i) => <Cell key={i} fill={d.c} opacity={d.name === "Tesalio" ? 1 : 0.5} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Sec>
        </>)}

        {/* ════════════ PROFILE ════════════ */}
        {tab === "profile" && (<>
          <Sec title="Grado de certeza" sub="Seguridad de la atribución dialectal tesalia">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
              <div style={{ flex: "1 1 250px" }}>
                <ResponsiveContainer width="100%" height={230}>
                  <PieChart>
                    <Pie data={certezaData} cx="50%" cy="50%" outerRadius={95} innerRadius={35}
                      dataKey="value" stroke="rgba(255,252,245,0.8)" strokeWidth={2}
                      label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                      labelLine={{ stroke: C.dim }}>
                      {certezaData.map((d, i) => <Cell key={i} fill={d.c} />)}
                    </Pie>
                    <Tooltip content={<Tip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: "1 1 200px" }}>
                {certezaData.map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 11, height: 11, borderRadius: 3, background: d.c }} />
                    <span style={{ flex: 1, fontSize: 13, color: C.text }}>{d.name}</span>
                    <span style={{ fontSize: 17, fontWeight: 700, color: C.gold, fontFamily: "var(--fh)" }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Sec>

          <Sec title="Distribución cronológica" sub="Las inscripciones tesalias se concentran entre el s. V y la primera mitad del IV a.C., con ejemplos tardíos hasta el s. II a.C.">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={CHRONO_DETAIL} margin={{ top: 5, right: 20, left: 0, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,90,40,0.08)" />
                <XAxis dataKey="period" tick={{ fill: C.muted, fontSize: 10 }} angle={-35} textAnchor="end" interval={0} stroke={C.border} />
                <YAxis tick={{ fill: C.muted, fontSize: 11 }} stroke={C.border} />
                <Tooltip content={<Tip />} />
                <Bar dataKey="n" name="Inscripciones" radius={[4,4,0,0]} fill={C.green} />
              </BarChart>
            </ResponsiveContainer>
          </Sec>

          <Sec title="Temática de las consultas tesalias" sub="Distribución de los temas de consulta">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
              <div style={{ flex: "1 1 350px" }}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={THEMES} layout="vertical" margin={{ top: 0, right: 30, left: 110, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,90,40,0.08)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: C.muted, fontSize: 11 }} stroke={C.border} />
                    <YAxis type="category" dataKey="name" width={105}
                      tick={{ fill: C.text, fontSize: 12.5 }} stroke={C.border} />
                    <Tooltip content={<Tip />} />
                    <Bar dataKey="value" name="Inscripciones" radius={[0,4,4,0]} fill={C.amber} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: "1 1 200px" }}>
                <ResponsiveContainer width="100%" height={240}>
                  <RadarChart data={THEMES.filter(t => t.name !== "Desconocido")} cx="50%" cy="50%" outerRadius={90}>
                    <PolarGrid stroke="rgba(120,90,40,0.1)" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: C.muted, fontSize: 9.5 }} />
                    <PolarRadiusAxis tick={{ fill: C.dim, fontSize: 9 }} stroke={C.border} />
                    <Radar dataKey="value" stroke={C.gold} fill={C.gold} fillOpacity={0.12} strokeWidth={2} />
                    <Tooltip content={<Tip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Sec>

          <Sec title="Alfabeto"
            note="La gran mayoría de inscripciones tesalias (70/81) están en alfabeto reformado/milesio. Solo 11 conservan escritura local: 4 en alfabeto tesalio/beocio, 3 en el alfabeto de Dodona, y ejemplos aislados en eubeo, corintio, eleo y otros. Las inscripciones en alfabeto epicórico no permiten distinguir las vocales medias largas.">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Stat label="Reformado / Milesio" value="70" sub="86%" />
              <Stat label="Tesalio / Beocio" value="4" accent={C.terra} />
              <Stat label="Dodona" value="3" accent={C.blue} />
              <Stat label="Otros (Eub/Cor/El/Occ)" value="4" accent={C.muted} />
            </div>
          </Sec>
        </>)}

        {/* ════════════ VOWELS ════════════ */}
        {tab === "vowels" && (<>
          <Sec title="Notación de vocales medias largas" sub="19 inscripciones tesalias en alfabeto reformado con grafías vocálicas identificables">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {VOWEL_NOTATION.map((v, i) => <Stat key={i} label={v.type} value={v.n} sub={v.desc} accent={v.color} />)}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
              <div style={{ flex: "1 1 300px" }}>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={VOWEL_NOTATION} cx="50%" cy="50%" outerRadius={100} innerRadius={35}
                      dataKey="n" stroke="rgba(255,252,245,0.8)" strokeWidth={2}
                      label={({ type, percent }) => `${type} (${(percent*100).toFixed(0)}%)`}
                      labelLine={{ stroke: C.dim }}>
                      {VOWEL_NOTATION.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip content={<Tip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: "1 1 250px" }}>
                {VOWEL_NOTATION.map((v, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <div style={{ width: 11, height: 11, borderRadius: 3, background: v.color }} />
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: C.text }}>{v.type}</span>
                      <span style={{ fontSize: 17, fontWeight: 700, color: C.gold, fontFamily: "var(--fh)", marginLeft: "auto" }}>{v.n}</span>
                    </div>
                    <div style={{ fontSize: 11, color: C.dim, paddingLeft: 19 }}>
                      <RefList dvcs={v.dvcs} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Sec>

          {/* Inscription detail table */}
          <Sec title="Detalle de las 19 inscripciones" sub="Con formas vocálicas identificables en alfabeto reformado">
            <div style={{ overflowX: "auto", maxHeight: 480, overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                <thead style={{ position: "sticky", top: 0 }}>
                  <tr style={{ background: "#ede8dc", borderBottom: `2px solid ${C.border}` }}>
                    {["Inscripción", "Cat.", "Fecha", "Región", "Forma(s) destacada(s)"].map(h => (
                      <th key={h} style={{ padding: "7px 10px", textAlign: "left", color: C.gold,
                        fontWeight: 600, fontSize: 11, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>{VOWEL_EXAMPLES.map((r, i) => {
                  const catColor = [null, C.green, C.amber, C.terra][r.cat];
                  const catLabel = ["", "ΕΙ/ΟΥ", "Mixta", "Η/Ω"][r.cat];
                  return (
                    <tr key={i} style={{ borderBottom: `1px solid rgba(120,90,40,0.08)`,
                      background: i % 2 === 0 ? "rgba(255,252,245,0.4)" : "transparent" }}>
                      <td style={{ padding: "6px 10px", color: C.gold, fontFamily: "var(--fh)", fontWeight: 600, whiteSpace: "nowrap" }}>
                        <Ref src={r.src} id={r.id} />
                      </td>
                      <td style={{ padding: "6px 10px" }}>
                        <span style={{ display: "inline-block", padding: "2px 7px", borderRadius: 4, fontSize: 10,
                          background: `${catColor}18`, color: catColor, border: `1px solid ${catColor}30` }}>{catLabel}</span>
                      </td>
                      <td style={{ padding: "6px 10px", color: C.muted, fontSize: 11.5, whiteSpace: "nowrap" }}>{r.date}</td>
                      <td style={{ padding: "6px 10px", color: C.muted, fontSize: 11.5 }}>{r.region}</td>
                      <td style={{ padding: "6px 10px", color: C.text, fontStyle: "italic" }}>{r.form}</td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
          </Sec>

          {/* Orthographic system table */}
          <Sec title="Sistema de notación vocálica" sub="Evolución ortográfica del tesalio (según Scarborough 2014: 1538)">
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr style={{ borderBottom: `2px solid ${C.border}` }}>
                  {["Fuente etimológica", "Alfab. arcaico", "Alfab. reformado", "Ático post-403"].map(h => (
                    <th key={h} style={{ padding: "9px 12px", textAlign: "center", color: C.gold,
                      fontFamily: "var(--fh)", fontWeight: 600, fontSize: 12 }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {[
                    ["*ē", "⟨Ε⟩", "⟨ΕΙ⟩", "⟨Η⟩"],
                    ["*ĕ + ĕ", "⟨Ε⟩", "⟨ΕΙ⟩", "⟨ΕΙ⟩"],
                    ["*ĕ", "⟨Ε⟩", "⟨Ε⟩", "⟨Ε⟩"],
                    ["*ei̯", "⟨ΕΙ⟩", "⟨ΕΙ⟩", "⟨ΕΙ⟩"],
                    ["*ō", "⟨Ο⟩", "⟨ΟΥ⟩", "⟨Ω⟩"],
                    ["*ŏ + ŏ", "⟨Ο⟩", "⟨ΟΥ⟩", "⟨ΟΥ⟩"],
                    ["*ŏ", "⟨Ο⟩", "⟨Ο⟩", "⟨Ο⟩"],
                    ["*ou̯", "⟨ΟΥ⟩", "⟨ΟΥ⟩ / ⟨Υ⟩", "⟨ΟΥ⟩"],
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid rgba(120,90,40,0.08)`,
                      background: i % 2 === 0 ? "rgba(255,252,245,0.4)" : "transparent" }}>
                      {row.map((cell, j) => (
                        <td key={j} style={{
                          padding: "8px 12px", textAlign: "center",
                          color: j === 0 ? C.amber : (j === 2 ? C.green : C.text),
                          fontWeight: j === 0 ? 600 : (j === 2 ? 700 : 400),
                          fontFamily: j === 0 ? "var(--fb)" : "var(--fh)",
                          fontSize: j === 0 ? 13 : 15,
                        }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Sec>

          {/* Theories */}
          <Sec title="Teorías sobre el vocalismo tesalio" sub="Tres interpretaciones del cierre de vocales medias largas">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { author: "Bechtel (1921) / Buck (1910)", title: "Elevación paralela",
                  desc: "⟨ΕΙ⟩ y ⟨ΟΥ⟩ representan vocales cerradas /eː/ y /oː/, como en ático. El tesalio habría experimentado una elevación paralela, resultando en un sistema tipo doris severior con cinco vocales largas cerradas." },
                { author: "Bartoněk (1966)", title: "Cadena de desplazamientos",
                  desc: "Una elevación de /aː/ empujó las demás vocales largas hacia posiciones más altas (chain shift). Las medias largas heredadas acabaron como cerradas /eː/ y /oː/." },
                { author: "Scarborough (2014)", title: "Vocales medias centrales",
                  desc: "⟨ΕΙ⟩ y ⟨ΟΥ⟩ representan vocales verdaderamente medias /e̞ː/ y /o̞ː/, no cerradas. Un sistema doris severior único donde las medias retienen su naturaleza central. Los dígrafos son convención gráfica, no elevación fonética." },
              ].map((t, i) => (
                <div key={i} style={{ background: "rgba(255,252,245,0.6)", border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 18px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.gold, fontFamily: "var(--fh)" }}>{t.title}</span>
                    <span style={{ fontSize: 11, color: C.muted }}>— {t.author}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12.5, color: C.text, lineHeight: 1.7 }}>{t.desc}</p>
                </div>
              ))}
            </div>
          </Sec>

          <Sec title="Conclusiones"
            note={`De las 19 inscripciones: 6 emplean exclusivamente ⟨ΕΙ⟩/⟨ΟΥ⟩ (notación canónica tesalia); 9 mezclan dígrafos con ⟨Η⟩/⟨Ω⟩ (vacilaciones tras la adopción del alfabeto reformado); y 4 usan exclusivamente ⟨Η⟩/⟨Ω⟩ — de las cuales solo I. Dodone DVC 992A lo hace de forma sistemática, y con reservas (su único rasgo tesalio seguro es la partícula κε). I. Dodone Lhôte 8B (s. III–II) solo presenta ⟨Ω⟩ en la fórmula introductoria (Νάωι, Διώναι), que podría reflejar el dialecto dórico local del santuario. El corpus de Dodona confirma la norma tesalia sin introducir anomalías: las vacilaciones encajan con las documentadas en la epigrafía tesalia (cf. Blümel 1982, Helly 2018).`} />
        </>)}

        {/* FOOTER */}
        <footer style={{ marginTop: 44, paddingTop: 16, borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
          <p style={{ fontSize: 11, color: C.muted, margin: 0, lineHeight: 1.8 }}>
            Datos: Dakaris, Vokotopoulou &amp; Christidis, <i>Τα χρηστήρια ελάσματα της Δωδώνης</i> (DVC)<br />
            Anotaciones dialectales: elaboración propia · Sistema vocálico según Scarborough (2014)<br />
            Aplicación monográfica · Tesalio en Dodona · {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}
