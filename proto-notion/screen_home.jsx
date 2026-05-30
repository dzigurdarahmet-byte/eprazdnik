function ScreenHome({ onNav }) {
  const quickCards = [
    { id: 'programs', label: 'Все программы',  count: 12, sub: 'Каталог сюжетных программ', target: { name: 'programs' }, icon: 'catalog' },
    { id: 'b2b',      label: 'B2B-каталог',    count: 7,  sub: 'Корпоративные мероприятия', target: { name: 'stub', section: 'b2b' }, icon: 'building' },
    { id: 'b2c',      label: 'B2C-каталог',    count: 24, sub: 'Детские праздники под ключ', target: { name: 'stub', section: 'b2c' }, icon: 'balloon' },
  ];
  const recents = window.PROGRAMS.slice(0, 6);

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', padding: '56px 96px 96px' }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: 18 }}>
        workspace · каталог услуг
      </div>
      <h1 style={{ fontSize: 56, fontWeight: 700, margin: '0 0 14px', letterSpacing: '-0.025em', lineHeight: 1.05 }}>
        Е-Праздник.<br />
        <span style={{ color: 'var(--text-muted)' }}>Каталог программ.</span>
      </h1>
      <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: '0 0 48px', maxWidth: 640, lineHeight: 1.55 }}>
        Единая база программ, шоу и мастер-классов. Менеджер собирает заказ за&nbsp;30 секунд: открыл карточку — взял описание, медиа и&nbsp;цену из конструктора.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 56 }}>
        {quickCards.map(c => (
          <button key={c.id} onClick={() => onNav(c.target)}
            style={{
              textAlign: 'left', background: 'white',
              border: '1px solid var(--border)', borderRadius: 6,
              padding: '20px 20px 18px', cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', flexDirection: 'column', gap: 14, minHeight: 156,
              transition: 'border-color .12s, transform .12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text-light)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <IconSlot name={c.icon} size={32} accent="var(--text-muted)" tint="var(--bg-soft)" />
              <span style={{ fontSize: 28, fontWeight: 600, color: 'var(--text)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
                {c.count}
              </span>
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', marginBottom: 4, letterSpacing: '-0.01em' }}>{c.label}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{c.sub}</div>
            </div>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
        <h2 style={{ fontSize: 13, fontWeight: 600, margin: 0, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
          Недавно открытые
        </h2>
        <button onClick={() => onNav({ name: 'programs' })} style={{
          background: 'transparent', border: 'none', color: 'var(--link)', cursor: 'pointer',
          fontSize: 13, fontFamily: 'inherit', padding: 0,
        }}>Все программы →</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
        {recents.map((p, i) => {
          const col = i % 3, row = Math.floor(i / 3);
          const borderRight = col < 2 ? '1px solid var(--border)' : 'none';
          const borderBottom = row < Math.floor((recents.length - 1) / 3) ? '1px solid var(--border)' : 'none';
          return (
            <button key={p.id}
              onClick={() => onNav({ name: 'detail', programId: p.id })}
              style={{
                background: 'white', border: 'none',
                borderRight, borderBottom, cursor: 'pointer', fontFamily: 'inherit',
                padding: '14px 16px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12,
                transition: 'background .1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}>
              <span style={{ width: 4, height: 28, borderRadius: 2, background: p.accent, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.title}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 2 }}>
                  {p.age} · {p.duration}
                </div>
              </div>
              <Tag color={p.status.color}>{p.status.dot}</Tag>
            </button>
          );
        })}
      </div>

      <div style={{
        marginTop: 64, padding: '24px 28px',
        background: 'var(--bg-soft)', border: '1px solid var(--border)', borderRadius: 8,
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: 8 }}>
              витрина
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6, letterSpacing: '-0.01em' }}>Notion — для навигации</div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.55 }}>
              Карточки программ с легендой, персонажами, медиа и&nbsp;чек-листом готовности. Поиск, фильтры, тег-система.
            </p>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: 8 }}>
              движок
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6, letterSpacing: '-0.01em' }}>Google&nbsp;Sheets — для цен</div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.55 }}>
              Конструктор стоимости, маржа и&nbsp;расходники остаются в&nbsp;таблицах и&nbsp;подтягиваются в&nbsp;карточку по&nbsp;ссылке.
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 28, fontSize: 12, color: 'var(--text-light)', display: 'flex', gap: 14 }}>
        <span>Обновлено · 22 мая 2026</span>
        <span>·</span>
        <span>Владелец · Мария Корнева</span>
        <span>·</span>
        <span>Доступ — вся команда</span>
      </div>
    </div>
  );
}

window.ScreenHome = ScreenHome;
