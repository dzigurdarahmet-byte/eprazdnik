function SidebarItem({ icon, label, count, active, onClick, indent = 0, expandable, expanded, onToggleExpand, accent }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '4px 8px 4px ' + (8 + indent * 14) + 'px',
        margin: '0 6px', borderRadius: 4, cursor: 'pointer',
        background: active ? 'rgba(35,131,226,.10)' : hover ? 'var(--bg-hover)' : 'transparent',
        color: 'var(--text)',
        fontSize: 14, lineHeight: '20px', userSelect: 'none',
      }}>
      <span
        onClick={e => { if (expandable) { e.stopPropagation(); onToggleExpand && onToggleExpand(); } }}
        style={{
          width: 14, height: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)', opacity: expandable && hover ? 1 : 0,
          transition: 'opacity .1s',
        }}>
        {expandable && <Chevron open={expanded} size={10} />}
      </span>
      <span style={{ width: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: accent || 'inherit' }}>
        {icon}
      </span>
      <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
      {count != null && (
        <span style={{ color: 'var(--text-light)', fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>{count}</span>
      )}
    </div>
  );
}

function SidebarSection({ title, action }) {
  return (
    <div style={{
      padding: '14px 14px 4px 14px', fontSize: 11, fontWeight: 600,
      color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '.06em',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <span>{title}</span>
      {action}
    </div>
  );
}

// Tiny program color square — accent block, replaces the emoji indicator
function ProgramDot({ accent }) {
  return <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: accent }} />;
}

function Sidebar({ route, onNav }) {
  const [programsOpen, setProgramsOpen] = React.useState(
    route.name === 'programs' || route.name === 'detail' || route.name === 'sheet'
  );

  const sections = [
    { id: 'programs',  icon: '📚', label: 'Программы',     count: 12 },
    { id: 'shows',     icon: '🎭', label: 'Шоу',           count: 8 },
    { id: 'masterclass', icon: '🎨', label: 'Мастер-классы', count: 14 },
    { id: 'teambuild', icon: '🤝', label: 'Тимбилдинги',   count: 6 },
    { id: 'welcome',   icon: '🎉', label: 'Велком-зоны',   count: 9 },
    { id: 'extra',     icon: '➕', label: 'Доп. услуги',   count: 21 },
    { id: 'actors',    icon: '🎬', label: 'Актёры',        count: 34 },
  ];

  const onSection = id => {
    if (id === 'programs') onNav({ name: 'programs' });
    else onNav({ name: 'stub', section: id });
  };

  return (
    <aside style={{
      width: 240, flexShrink: 0, height: '100vh',
      background: 'var(--bg-soft)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Workspace header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '12px 12px 10px',
        cursor: 'pointer',
      }}
        onClick={() => onNav({ name: 'home' })}>
        <div style={{
          width: 24, height: 24, borderRadius: 5,
          background: '#1d1d1b', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, letterSpacing: '-0.02em', flexShrink: 0,
        }}>е</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Е-Праздник
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-light)' }}>workspace · 7 человек</div>
        </div>
        <span style={{ color: 'var(--text-light)', fontSize: 11 }}>⌄</span>
      </div>

      <div style={{ padding: '0 6px 4px' }}>
        <SidebarItem icon="⌕" label="Поиск" onClick={() => {}} />
        <SidebarItem icon="◉" label="Главная" active={route.name === 'home'} onClick={() => onNav({ name: 'home' })} />
        <SidebarItem icon="✦" label="Входящие" count={3} onClick={() => {}} />
      </div>

      <SidebarSection title="Каталог" action={<Plus size={11} />} />
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 8 }}>
        {sections.map(s => (
          <React.Fragment key={s.id}>
            <SidebarItem
              icon={s.icon}
              label={s.label}
              count={s.count}
              active={s.id === 'programs' && route.name === 'programs'}
              expandable={s.id === 'programs'}
              expanded={programsOpen}
              onToggleExpand={() => setProgramsOpen(o => !o)}
              onClick={() => onSection(s.id)}
            />
            {s.id === 'programs' && programsOpen && (
              <div>
                {window.PROGRAMS.slice(0, 6).map(p => (
                  <SidebarItem
                    key={p.id}
                    icon={<ProgramDot accent={p.accent} />}
                    label={p.title}
                    indent={1}
                    active={(route.name === 'detail' || route.name === 'sheet') && route.programId === p.id}
                    onClick={() => onNav({ name: 'detail', programId: p.id })}
                  />
                ))}
                <div style={{
                  padding: '4px 8px 4px 36px', margin: '0 6px', fontSize: 13,
                  color: 'var(--text-light)', cursor: 'pointer', borderRadius: 4,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <Plus size={11} /> Добавить программу
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--border)', padding: '6px 6px 10px' }}>
        <SidebarItem icon="👤" label="Команда" onClick={() => {}} />
        <SidebarItem icon="⚙" label="Настройки" onClick={() => {}} />
        <SidebarItem icon="🗑" label="Корзина" onClick={() => {}} />
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;
