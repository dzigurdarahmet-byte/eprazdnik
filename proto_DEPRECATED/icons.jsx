// Lucide-style stroke icons. Keeping it lightweight: a single Icon component with name dispatch.
const Icon = ({ n, size = 18, stroke = 2, ...rest }) => {
  const s = size;
  const sw = stroke;
  const common = {
    width: s, height: s, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round",
    ...rest,
  };
  switch (n) {
    case "zap":           return <svg {...common}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
    case "library":       return <svg {...common}><path d="M3 5v14M8 5v14M13 4l4 14M21 5v14"/></svg>;
    case "briefcase":     return <svg {...common}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
    case "flame":         return <svg {...common}><path d="M8.5 14.5C5 13 5 8 9 5c-.5 3 1 4 2 5 2-3 4-4 6-7 3 7-2 13-6 14-2 .5-4-.5-4-2.5z"/></svg>;
    case "wallet":        return <svg {...common}><path d="M19 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z"/><path d="M16 14h2"/><path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v0"/></svg>;
    case "image":         return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>;
    case "star":          return <svg {...common}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
    case "search":        return <svg {...common}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
    case "settings":      return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
    case "send":          return <svg {...common}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
    case "plus":          return <svg {...common}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    case "users":         return <svg {...common}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case "clock":         return <svg {...common}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
    case "baby":          return <svg {...common}><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.5.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/></svg>;
    case "ruble":         return <svg {...common}><path d="M8 21V4h6.5a4.5 4.5 0 0 1 0 9H6"/><path d="M6 17h9"/></svg>;
    case "sparkles":      return <svg {...common}><path d="M9.94 5.34L8 2 6.06 5.34 2.6 6.93 6 9l-1.06 4L8 11l3.06 2L10 9l3.4-2.07L9.94 5.34zM20 16l-1.2-2.4L16 12l2.8-1.6L20 8l1.2 2.4L24 12l-2.8 1.6L20 16zm-4 5l-.8-1.6L13.6 18l1.6-.8L16 16l.8 1.2 1.6.8-1.6.8L16 21z"/></svg>;
    case "wand":          return <svg {...common}><path d="M15 4V2m0 14v-2M8 9h2m10 0h2m-9.5-6.5L13 4m6 6l1.5-1.5M4 20l9-9"/><circle cx="14" cy="6" r="2"/></svg>;
    case "puzzle":        return <svg {...common}><path d="M19.4 11H21a2 2 0 0 1 0 4h-1.6a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1h-3.4a1 1 0 0 1-1-1v-1.6a2 2 0 1 0-4 0V20a1 1 0 0 1-1 1H4.6a1 1 0 0 1-1-1v-3.4a1 1 0 0 0-1-1H1a2 2 0 0 1 0-4h1.6a1 1 0 0 0 1-1V7.6a1 1 0 0 1 1-1H8a2 2 0 1 0 0-4h-.4a1 1 0 0 1 1-1H12a1 1 0 0 1 1 1V3a2 2 0 0 0 4 0v-.4a1 1 0 0 1 1-1h3.4a1 1 0 0 1 1 1V6.6a1 1 0 0 0 1 1z"/></svg>;
    case "palette":       return <svg {...common}><circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/><circle cx="8.5" cy="7.5" r="0.5" fill="currentColor"/><circle cx="6.5" cy="12.5" r="0.5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.7 0 3-1.3 3-3 0-.8-.3-1.5-.8-2-.5-.5-.8-1.2-.8-2 0-1.7 1.3-3 3-3h2c2.8 0 5-2.2 5-5 0-5-4.5-9-10-9z"/></svg>;
    case "arrow-right":   return <svg {...common}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
    case "arrow-up-right":return <svg {...common}><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>;
    case "chevron-right": return <svg {...common}><polyline points="9 18 15 12 9 6"/></svg>;
    case "chevron-down":  return <svg {...common}><polyline points="6 9 12 15 18 9"/></svg>;
    case "heart":         return <svg {...common}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
    case "x":             return <svg {...common}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
    case "filter":        return <svg {...common}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
    case "play":          return <svg {...common}><polygon points="5 3 19 12 5 21 5 3"/></svg>;
    case "video":         return <svg {...common}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>;
    case "snowflake":     return <svg {...common}><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/><path d="M20 16l-4-4 4-4"/><path d="M4 8l4 4-4 4"/><path d="M16 4l-4 4-4-4"/><path d="M8 20l4-4 4 4"/></svg>;
    case "check":         return <svg {...common}><polyline points="20 6 9 17 4 12"/></svg>;
    case "bell":          return <svg {...common}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
    case "trophy":        return <svg {...common}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;
    case "book":          return <svg {...common}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
    case "crown":         return <svg {...common}><path d="M2 6l4 4 6-7 6 7 4-4-2 13H4z"/></svg>;
    case "calendar":      return <svg {...common}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
    case "tag":           return <svg {...common}><path d="M20.59 13.41L13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
    case "external":      return <svg {...common}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
    case "kbd-cmd":       return <svg {...common}><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>;
    case "user":          return <svg {...common}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
    case "compass":       return <svg {...common}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>;
    case "gift":          return <svg {...common}><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>;
    default: return null;
  }
};

window.Icon = Icon;
