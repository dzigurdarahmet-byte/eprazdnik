// Shared atoms.

function Tag({ color = 'gray', children, dot, style }) {
  const bg = `var(--tag-${color}-bg)`;
  const fg = `var(--tag-${color}-fg)`;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 3,
      fontSize: 12, lineHeight: '18px', fontWeight: 500,
      background: bg, color: fg, whiteSpace: 'nowrap', ...style,
    }}>
      {dot && <span style={{ fontSize: 10 }}>{dot}</span>}
      {children}
    </span>
  );
}

function Breadcrumbs({ items, onNav }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-muted)', padding: '8px 0' }}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color: 'var(--text-light)', padding: '0 2px' }}>/</span>}
          <button
            onClick={() => it.to && onNav(it.to)}
            style={{
              border: 'none', background: 'transparent', cursor: it.to ? 'pointer' : 'default',
              color: i === items.length - 1 ? 'var(--text)' : 'var(--text-muted)',
              padding: '2px 4px', borderRadius: 3, fontSize: 13,
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}
            onMouseEnter={e => { if (it.to) e.currentTarget.style.background = 'var(--bg-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
            {it.emoji && <span>{it.emoji}</span>}
            <span>{it.label}</span>
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}

// IconSlot — explicit "place an icon here" mark. The client replaces these
// with final SVGs from the brief. While the icon is missing, we render a
// dashed square with a tiny mono caption. Once the icons land, swap to <Icon name=...>.
function IconSlot({ name, size = 24, accent = 'currentColor', tint, showLabel = false, style }) {
  const w = size;
  return (
    <span
      title={`icon: ${name}`}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: w, height: w,
        background: tint || 'transparent',
        border: `1px dashed ${accent}`,
        borderRadius: Math.max(2, Math.round(w / 8)),
        color: accent,
        position: 'relative',
        flexShrink: 0,
        ...style,
      }}>
      <span style={{
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        fontSize: Math.max(8, Math.round(w * 0.20)),
        letterSpacing: '.02em',
        opacity: .75,
        whiteSpace: 'nowrap',
        userSelect: 'none',
      }}>
        {showLabel ? name : (name || '·').slice(0, Math.max(2, Math.floor(w / 6)))}
      </span>
    </span>
  );
}

function Chevron({ open, size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform .12s' }}>
      <path d="M4 2 L8 6 L4 10" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Plus({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14"><path d="M7 2 V12 M2 7 H12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
  );
}

function FilterPill({ children, active }) {
  return (
    <button
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '3px 10px', borderRadius: 999, border: '1px solid var(--border)',
        background: active ? 'var(--bg-hover)' : 'white',
        color: active ? 'var(--text)' : 'var(--text-muted)',
        fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
      onMouseLeave={e => e.currentTarget.style.background = active ? 'var(--bg-hover)' : 'white'}>
      {children}
    </button>
  );
}

// Generic spreadsheet-style icon (green grid) — original mark
function SheetIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <rect x="3" y="3" width="18" height="18" rx="3" fill="#1f8a4d" />
      <rect x="5.5" y="5.5" width="13" height="13" rx="1.5" fill="#ffffff" />
      <line x1="5.5" y1="10" x2="18.5" y2="10" stroke="#1f8a4d" strokeWidth="1" />
      <line x1="5.5" y1="14" x2="18.5" y2="14" stroke="#1f8a4d" strokeWidth="1" />
      <line x1="10" y1="5.5" x2="10" y2="18.5" stroke="#1f8a4d" strokeWidth="1" />
      <line x1="14" y1="5.5" x2="14" y2="18.5" stroke="#1f8a4d" strokeWidth="1" />
    </svg>
  );
}

// Tiny avatar with initials, deterministic color from string
function Avatar({ name, size = 22 }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  // pick from a fixed list based on hash
  const palette = ['#7a4ad8', '#2383e2', '#1a6055', '#a85978', '#c47a14', '#4a5360'];
  let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  const c = palette[Math.abs(h) % palette.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: c, color: 'white',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: Math.round(size * 0.42), fontWeight: 600, lineHeight: 1,
      flexShrink: 0,
    }}>{initials}</div>
  );
}

// kbd-style small label
function Kbd({ children }) {
  return (
    <span style={{
      fontFamily: 'JetBrains Mono, ui-monospace, monospace',
      fontSize: 11, padding: '1px 5px',
      background: 'var(--bg-soft)', border: '1px solid var(--border)', borderRadius: 3,
      color: 'var(--text-muted)',
    }}>{children}</span>
  );
}

Object.assign(window, { Tag, Breadcrumbs, IconSlot, Chevron, Plus, FilterPill, SheetIcon, Avatar, Kbd });
