// Abstract gradient/pattern covers for programs.
// All hand-composed CSS gradients — no character art, no copyrighted imagery.
// Each cover is a function that returns a styled div.

const Cover = ({ kind, children, style }) => {
  const base = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  const variants = {
    // Icy crystals — for "Холодное Сердце" themed package
    ice: {
      background:
        "radial-gradient(ellipse at 30% 20%, #e0f2fe 0%, transparent 50%)," +
        "radial-gradient(ellipse at 80% 70%, #c4b5fd 0%, transparent 60%)," +
        "linear-gradient(135deg, #93c5fd 0%, #6366f1 60%, #312e81 100%)",
    },
    // Wizardly purple/gold
    arcane: {
      background:
        "radial-gradient(circle at 20% 30%, rgba(252,211,77,.4) 0%, transparent 40%)," +
        "radial-gradient(circle at 80% 80%, rgba(124,58,237,.5) 0%, transparent 50%)," +
        "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #831843 100%)",
    },
    // Vibrant red/black for hero-themed
    hero: {
      background:
        "radial-gradient(circle at 70% 30%, #fde047 0%, transparent 30%)," +
        "linear-gradient(135deg, #dc2626 0%, #991b1b 50%, #1c1917 100%)",
    },
    // Lightning/electric
    tesla: {
      background:
        "radial-gradient(circle at 50% 40%, #fef3c7 0%, transparent 25%)," +
        "linear-gradient(135deg, #0c4a6e 0%, #1e3a8a 50%, #312e81 100%)",
    },
    // Paper / pastel
    paper: {
      background:
        "linear-gradient(45deg, #fef3c7 25%, transparent 25%, transparent 75%, #fef3c7 75%)," +
        "linear-gradient(45deg, #fef3c7 25%, #fde68a 25%, #fde68a 75%, transparent 75%)",
      backgroundSize: "32px 32px",
      backgroundPosition: "0 0, 16px 16px",
      backgroundColor: "#fef9c3",
    },
    // Neon cyan/magenta
    neon: {
      background:
        "radial-gradient(circle at 30% 40%, #f0abfc 0%, transparent 35%)," +
        "radial-gradient(circle at 70% 70%, #22d3ee 0%, transparent 40%)," +
        "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #581c87 100%)",
    },
    // Cryo / frost
    cryo: {
      background:
        "radial-gradient(circle at 40% 30%, #ddd6fe 0%, transparent 40%)," +
        "radial-gradient(circle at 80% 80%, #67e8f9 0%, transparent 50%)," +
        "linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 50%, #0c4a6e 100%)",
    },
    // Chemistry green/yellow
    chemistry: {
      background:
        "radial-gradient(circle at 30% 30%, #d9f99d 0%, transparent 35%)," +
        "radial-gradient(circle at 70% 70%, #fde047 0%, transparent 40%)," +
        "linear-gradient(135deg, #065f46 0%, #064e3b 50%, #1e1b4b 100%)",
    },
    // Slime / playful green
    slime: {
      background:
        "radial-gradient(ellipse at 30% 40%, #86efac 0%, transparent 50%)," +
        "radial-gradient(ellipse at 70% 70%, #fcd34d 0%, transparent 45%)," +
        "linear-gradient(135deg, #84cc16 0%, #65a30d 100%)",
    },
    // Adventure / fort
    adventure: {
      background:
        "radial-gradient(circle at 30% 40%, #fed7aa 0%, transparent 40%)," +
        "linear-gradient(135deg, #92400e 0%, #7c2d12 50%, #1c1917 100%)",
    },
    // Princess pink/gold
    princess: {
      background:
        "radial-gradient(circle at 30% 30%, #fde68a 0%, transparent 35%)," +
        "radial-gradient(circle at 70% 70%, #f9a8d4 0%, transparent 45%)," +
        "linear-gradient(135deg, #ec4899 0%, #be185d 50%, #831843 100%)",
    },
    // Whimsy / Alice-ish teal/red
    whimsy: {
      background:
        "radial-gradient(circle at 30% 30%, #5eead4 0%, transparent 40%)," +
        "radial-gradient(circle at 70% 70%, #fda4af 0%, transparent 40%)," +
        "linear-gradient(135deg, #134e4a 0%, #831843 100%)",
    },
    // Ladybug — red/black
    ladybug: {
      background:
        "radial-gradient(circle at 20% 30%, #18181b 0%, transparent 8%)," +
        "radial-gradient(circle at 75% 25%, #18181b 0%, transparent 10%)," +
        "radial-gradient(circle at 50% 70%, #18181b 0%, transparent 12%)," +
        "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
    },
    // Generic purple
    purple: {
      background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    },
  };
  return (
    <div className="cover" style={{ ...base, ...(variants[kind] || variants.purple), ...(style || {}) }}>
      {/* decorative shapes layered on top */}
      <CoverDeco kind={kind} />
      {children}
    </div>
  );
};

// Small decorative SVG / shape overlay per kind. Simple primitives only.
const CoverDeco = ({ kind }) => {
  const wrap = { position: "absolute", inset: 0, pointerEvents: "none" };
  switch (kind) {
    case "ice":
      return (
        <svg viewBox="0 0 200 200" preserveAspectRatio="none" style={wrap}>
          {[[40,60,18],[150,40,12],[170,140,16],[60,160,14],[110,100,22]].map(([x,y,r],i)=>(
            <g key={i} opacity={0.7 - i*0.08}>
              <circle cx={x} cy={y} r={r/3} fill="white"/>
              <g stroke="white" strokeWidth="1.2" fill="none" opacity="0.85">
                <line x1={x-r} y1={y} x2={x+r} y2={y}/>
                <line x1={x} y1={y-r} x2={x} y2={y+r}/>
                <line x1={x-r*0.7} y1={y-r*0.7} x2={x+r*0.7} y2={y+r*0.7}/>
                <line x1={x-r*0.7} y1={y+r*0.7} x2={x+r*0.7} y2={y-r*0.7}/>
              </g>
            </g>
          ))}
        </svg>
      );
    case "arcane":
      return (
        <svg viewBox="0 0 200 200" preserveAspectRatio="none" style={wrap}>
          <g stroke="rgba(252,211,77,.6)" strokeWidth="1" fill="none">
            <circle cx="100" cy="100" r="60"/>
            <circle cx="100" cy="100" r="40"/>
            <polygon points="100,55 138,120 62,120"/>
          </g>
          {[[40,160],[160,60],[170,150],[30,40]].map(([x,y],i)=>(
            <circle key={i} cx={x} cy={y} r="2" fill="rgba(252,211,77,.9)"/>
          ))}
        </svg>
      );
    case "tesla":
      return (
        <svg viewBox="0 0 200 200" preserveAspectRatio="none" style={wrap}>
          <path d="M50 20 L70 80 L40 100 L80 180" stroke="rgba(255,255,255,.85)" strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
          <path d="M140 30 L155 90 L130 110 L160 170" stroke="rgba(254,243,199,.7)" strokeWidth="2" fill="none" strokeLinejoin="round"/>
        </svg>
      );
    case "neon":
      return (
        <svg viewBox="0 0 200 200" preserveAspectRatio="none" style={wrap}>
          <g stroke="rgba(34,211,238,.7)" strokeWidth="1.5" fill="none">
            <circle cx="60" cy="80" r="36"/>
          </g>
          <g stroke="rgba(240,171,252,.7)" strokeWidth="1.5" fill="none">
            <rect x="100" y="80" width="70" height="70" rx="12"/>
          </g>
        </svg>
      );
    case "cryo":
      return (
        <svg viewBox="0 0 200 200" preserveAspectRatio="none" style={wrap}>
          <g fill="rgba(255,255,255,.65)">
            <circle cx="40" cy="40" r="3"/>
            <circle cx="80" cy="60" r="2"/>
            <circle cx="160" cy="40" r="4"/>
            <circle cx="170" cy="120" r="2"/>
            <circle cx="50" cy="150" r="3"/>
            <circle cx="120" cy="170" r="2"/>
            <circle cx="100" cy="100" r="5"/>
          </g>
          <path d="M0 130 Q 50 110 100 130 T 200 130" stroke="rgba(255,255,255,.4)" strokeWidth="2" fill="none"/>
        </svg>
      );
    case "chemistry":
      return (
        <svg viewBox="0 0 200 200" preserveAspectRatio="none" style={wrap}>
          <g fill="none" stroke="rgba(217,249,157,.8)" strokeWidth="2">
            <circle cx="60" cy="120" r="30"/>
            <path d="M60 90 L60 70 M50 70 L70 70"/>
          </g>
          <g fill="none" stroke="rgba(253,224,71,.6)" strokeWidth="2">
            <circle cx="140" cy="80" r="22"/>
          </g>
        </svg>
      );
    case "slime":
      return (
        <svg viewBox="0 0 200 200" preserveAspectRatio="none" style={wrap}>
          <path d="M40 80 Q 80 40 120 70 Q 170 90 150 140 Q 110 180 70 150 Q 20 130 40 80 Z" fill="rgba(255,255,255,.25)"/>
          <circle cx="80" cy="95" r="6" fill="rgba(255,255,255,.8)"/>
          <circle cx="130" cy="115" r="4" fill="rgba(255,255,255,.6)"/>
        </svg>
      );
    case "adventure":
      return (
        <svg viewBox="0 0 200 200" preserveAspectRatio="none" style={wrap}>
          <g fill="rgba(254,215,170,.6)">
            <rect x="40" y="100" width="20" height="60"/>
            <rect x="70" y="80" width="20" height="80"/>
            <rect x="100" y="60" width="20" height="100"/>
            <rect x="130" y="80" width="20" height="80"/>
            <rect x="160" y="100" width="14" height="60"/>
          </g>
        </svg>
      );
    case "princess":
      return (
        <svg viewBox="0 0 200 200" preserveAspectRatio="none" style={wrap}>
          <path d="M60 110 L80 60 L100 100 L120 60 L140 110 L140 140 L60 140 Z" fill="rgba(253,230,138,.85)" stroke="rgba(254,243,199,.9)" strokeWidth="1.5"/>
          <circle cx="80" cy="60" r="4" fill="#fef3c7"/>
          <circle cx="120" cy="60" r="4" fill="#fef3c7"/>
          <circle cx="100" cy="100" r="4" fill="#fef3c7"/>
        </svg>
      );
    case "whimsy":
      return (
        <svg viewBox="0 0 200 200" preserveAspectRatio="none" style={wrap}>
          <g fill="none" stroke="rgba(94,234,212,.7)" strokeWidth="2">
            <circle cx="70" cy="80" r="20"/>
            <circle cx="130" cy="110" r="14"/>
          </g>
          <g fill="rgba(253,164,175,.5)">
            <path d="M100 160 L110 140 L130 145 L120 165 Z"/>
          </g>
        </svg>
      );
    case "paper":
      return (
        <svg viewBox="0 0 200 200" preserveAspectRatio="none" style={wrap}>
          <g fill="rgba(255,255,255,.5)">
            <polygon points="40,40 60,60 50,90 30,70"/>
            <polygon points="120,30 140,50 130,80 110,60"/>
            <polygon points="60,140 80,160 70,180 50,160"/>
            <polygon points="150,140 170,160 160,180 140,160"/>
          </g>
        </svg>
      );
    case "ladybug":
      return (
        <svg viewBox="0 0 200 200" preserveAspectRatio="none" style={wrap}>
          <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(0,0,0,.55)" strokeWidth="3"/>
        </svg>
      );
    case "hero":
      return (
        <svg viewBox="0 0 200 200" preserveAspectRatio="none" style={wrap}>
          <polygon points="100,40 110,75 145,75 117,95 128,130 100,108 72,130 83,95 55,75 90,75" fill="rgba(253,224,71,.85)"/>
        </svg>
      );
    default:
      return null;
  }
};

window.Cover = Cover;
