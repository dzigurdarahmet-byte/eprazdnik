function ProgramCard({ p, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textAlign: 'left', background: 'white',
        border: '1px solid var(--border)', borderRadius: 6,
        cursor: 'pointer', fontFamily: 'inherit', padding: 0,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        borderColor: hover ? 'var(--text-light)' : 'var(--border)',
        transition: 'border-color .12s',
      }}>
      {/* Accent strip (single solid color — no gradient, no image) */}
      <div style={{ height: 4, background: p.accent }} />
      <div style={{ padding: '16px 16px 14px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <IconSlot name={p.iconKey} size={36} accent={p.accent} tint={p.tint} />
          <Tag color={p.status.color} dot={p.status.dot}>{p.status.label}</Tag>
        </div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em', marginBottom: 2, lineHeight: 1.2 }}>
            {p.title}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.4 }}>
            {p.subtitle}
          </div>
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {p.tags.slice(0, 2).map((t, i) => <Tag key={i} color={t.color}>{t.label}</Tag>)}
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-light)', whiteSpace: 'nowrap' }}>
            {p.age}
          </span>
        </div>
      </div>
    </button>
  );
}

function ScreenPrograms({ onNav }) {
  const programs = window.PROGRAMS;

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '8px 96px 96px' }}>
      <Breadcrumbs items={[
        { label: 'Главная', to: { name: 'home' } },
        { label: 'Программы' },
      ]} onNav={onNav} />

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', margin: '20px 0 6px', gap: 24 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: 6 }}>
            каталог · gallery view
          </div>
          <h1 style={{ fontSize: 44, fontWeight: 700, margin: 0, letterSpacing: '-0.025em' }}>Программы</h1>
        </div>
        <button style={{
          background: 'var(--text)', color: 'white', border: 'none', cursor: 'pointer',
          padding: '7px 14px', borderRadius: 5, fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}><Plus size={12} /> Создать программу</button>
      </div>
      <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28, maxWidth: 720 }}>
        12 сюжетных программ. Кликните на «Холодное Сердце» — это полностью заполненная карточка, остальные мы наполним по тому же шаблону.
      </div>

      {/* View tabs */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 0,
        borderBottom: '1px solid var(--border)', marginBottom: 14,
      }}>
        {[
          { id: 'gallery', label: 'Галерея', active: true },
          { id: 'table', label: 'Таблица' },
          { id: 'board', label: 'Доска' },
          { id: 'list', label: 'Список' },
        ].map(t => (
          <div key={t.id} style={{
            padding: '8px 12px', fontSize: 13, cursor: 'pointer',
            color: t.active ? 'var(--text)' : 'var(--text-muted)',
            borderBottom: t.active ? '2px solid var(--text)' : '2px solid transparent',
            marginBottom: -1, fontWeight: t.active ? 500 : 400,
          }}>{t.label}</div>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
          <span>{programs.length} карточек</span>
          <span style={{ color: 'var(--text-light)' }}>·</span>
          <span>Сортировка: дата</span>
        </div>
      </div>

      {/* Filter row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 22, flexWrap: 'wrap' }}>
        <FilterPill>Категория <span style={{ color: 'var(--text-light)' }}>▾</span></FilterPill>
        <FilterPill>Статус <span style={{ color: 'var(--text-light)' }}>▾</span></FilterPill>
        <FilterPill>B2B / B2C <span style={{ color: 'var(--text-light)' }}>▾</span></FilterPill>
        <FilterPill>Возраст <span style={{ color: 'var(--text-light)' }}>▾</span></FilterPill>
        <FilterPill><Plus size={11} /> Добавить фильтр</FilterPill>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-muted)' }}>
          <span>⌕</span>
          <input
            placeholder="Поиск по каталогу"
            style={{
              border: '1px solid var(--border)', borderRadius: 999, padding: '4px 12px',
              fontSize: 13, fontFamily: 'inherit', width: 200, outline: 'none', background: 'white',
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {programs.map(p => (
          <ProgramCard key={p.id} p={p} onClick={() => onNav({ name: 'detail', programId: p.id })} />
        ))}
        <button style={{
          background: 'transparent', border: '1px dashed var(--border-strong)', borderRadius: 6,
          minHeight: 180, cursor: 'pointer', color: 'var(--text-light)', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13,
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <Plus size={14} /> Новая программа
        </button>
      </div>
    </div>
  );
}

window.ScreenPrograms = ScreenPrograms;
