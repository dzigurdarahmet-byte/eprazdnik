function PropertyRow({ icon, label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, marginBottom: 1, fontSize: 14 }}>
      <div style={{
        width: 200, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8,
        color: 'var(--text-muted)', padding: '6px 8px', borderRadius: 4,
      }}>
        <span style={{ width: 14, textAlign: 'center', fontSize: 13, opacity: .7 }}>{icon}</span>
        <span style={{ fontSize: 14 }}>{label}</span>
      </div>
      <div style={{ flex: 1, padding: '6px 8px', minHeight: 32, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
        {children}
      </div>
    </div>
  );
}

function SectionLabel({ children, num }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', gap: 10,
      margin: '40px 0 14px',
    }}>
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-light)', letterSpacing: '.05em' }}>
        {num}
      </span>
      <h2 style={{
        fontSize: 22, fontWeight: 700, margin: 0,
        letterSpacing: '-0.015em',
      }}>{children}</h2>
    </div>
  );
}

function ChecklistItem({ state, label, col }) {
  const icon = state === 'done' ? '●' : state === 'wip' ? '◐' : '○';
  const c = state === 'done' ? '#1a6055' : state === 'wip' ? '#c47a14' : '#b13a3a';
  return (
    <li style={{
      listStyle: 'none', padding: '7px 0', display: 'flex', alignItems: 'center', gap: 10,
      color: 'var(--text)', fontSize: 14,
      borderBottom: '1px solid var(--border)',
    }}>
      <span style={{ fontSize: 12, color: c, width: 14, textAlign: 'center' }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-light)' }}>
        {col}
      </span>
    </li>
  );
}

function MediaCard({ kind, title, sub }) {
  return (
    <button style={{
      background: 'white', border: '1px solid var(--border)', borderRadius: 6,
      padding: '14px 14px', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
      display: 'flex', flexDirection: 'column', gap: 10, minHeight: 100,
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text-light)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconSlot name={kind} size={28} accent="var(--text-muted)" tint="var(--bg-soft)" />
        <span style={{ color: 'var(--text-light)', fontSize: 13 }}>↗</span>
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{title}</div>
        <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 3 }}>{sub}</div>
      </div>
    </button>
  );
}

function CalcLinkCard({ title, sub, badge, onClick }) {
  return (
    <button onClick={onClick}
      style={{
        background: 'white', border: '1px solid var(--border)', borderRadius: 6,
        padding: '18px 20px', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
        display: 'flex', alignItems: 'center', gap: 16, width: '100%',
        transition: 'background .1s, border-color .1s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#f6fbf7'; e.currentTarget.style.borderColor = '#bfe1c8'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
      <SheetIcon size={32} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{title}</span>
          <span style={{ color: 'var(--link)', fontSize: 12 }}>↗</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>{sub}</div>
      </div>
      {badge && (
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
          padding: '3px 8px', background: 'var(--bg-soft)', borderRadius: 3,
          color: 'var(--text-muted)',
        }}>{badge}</div>
      )}
    </button>
  );
}

function ScreenProgramDetail({ programId, onNav }) {
  const p = window.PROGRAMS.find(x => x.id === programId) || window.PROGRAMS[0];
  const isFrozen = p.id === 'frozen';
  const F = window.FROZEN;

  return (
    <div style={{ background: 'white', minHeight: '100%' }}>
      {/* Accent strip — replaces the cover image */}
      <div style={{ height: 4, background: p.accent }} />

      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '0 96px 96px' }}>
        <Breadcrumbs items={[
          { label: 'Главная', to: { name: 'home' } },
          { label: 'Программы', to: { name: 'programs' } },
          { label: p.title },
        ]} onNav={onNav} />

        {/* Hero */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, margin: '22px 0 28px' }}>
          <IconSlot name={p.iconKey} size={64} accent={p.accent} tint={p.tint} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              color: 'var(--text-light)', letterSpacing: '.06em',
              marginBottom: 8, textTransform: 'uppercase',
            }}>
              программа · {p.id}
            </div>
            <h1 style={{
              fontSize: 44, fontWeight: 700, margin: 0,
              letterSpacing: '-0.025em', lineHeight: 1.1,
            }}>
              {p.title}
            </h1>
            <div style={{
              fontSize: 20, color: 'var(--text-muted)', marginTop: 8,
              fontWeight: 400, letterSpacing: '-0.01em',
            }}>
              {isFrozen ? 'Тайна кристаллов Эренделла' : p.subtitle}
            </div>
          </div>
        </div>

        {/* Properties — two columns to feel less Notion-list-y */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px',
          padding: '8px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        }}>
          <PropertyRow icon="◇" label="Категория"><Tag color="brown">ПРОГРАММЫ</Tag></PropertyRow>
          <PropertyRow icon="◎" label="Тип">
            <Tag color="blue">B2C</Tag>
            <span style={{ color: 'var(--text-muted)' }}>детский праздник</span>
          </PropertyRow>
          <PropertyRow icon="●" label="Статус">
            <Tag color={p.status.color} dot={p.status.dot}>{p.status.label}</Tag>
          </PropertyRow>
          <PropertyRow icon="✦" label="Теги">
            {p.tags.map((t, i) => <Tag key={i} color={t.color}>{t.label}</Tag>)}
          </PropertyRow>
          <PropertyRow icon="○" label="Возраст">
            <span style={{ color: 'var(--text)' }}>{p.age}</span>
          </PropertyRow>
          <PropertyRow icon="◐" label="Длительность">
            <span style={{ color: 'var(--text)' }}>{p.duration}</span>
          </PropertyRow>
          <PropertyRow icon="◆" label="Цена от">
            <span style={{ color: 'var(--text)', fontWeight: 500 }}>{p.priceFrom.toLocaleString('ru-RU')} ₽</span>
            <span style={{ color: 'var(--text-light)', fontSize: 12 }}>маржа 76%</span>
          </PropertyRow>
          <PropertyRow icon="∴" label="Менеджер">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Avatar name="Мария Корнева" size={20} />
              <span style={{ fontSize: 13 }}>Мария Корнева</span>
            </div>
          </PropertyRow>
        </div>

        {!isFrozen && (
          <div style={{
            marginTop: 40, padding: '40px 28px', background: 'var(--bg-soft)',
            border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-muted)',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14,
          }}>
            <div style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.5 }}>
              Карточка программы <strong>{p.title}</strong> заполняется по тому же шаблону, что и «Холодное Сердце». Полный пример с легендой, конструктором и чек-листом — там.
            </div>
            <button onClick={() => onNav({ name: 'detail', programId: 'frozen' })} style={{
              background: 'var(--text)', color: 'white', border: 'none', cursor: 'pointer',
              padding: '7px 14px', borderRadius: 5, fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
            }}>Открыть «Холодное Сердце» →</button>
          </div>
        )}

        {isFrozen && (
          <>
            <SectionLabel num="01">Легенда</SectionLabel>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--text)', margin: '0', maxWidth: 720, fontWeight: 400 }}>
              {F.legend}
            </p>

            <SectionLabel num="02">Персонажи</SectionLabel>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
              border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden',
            }}>
              {F.characters.map((c, i) => {
                const col = i % 3;
                const row = Math.floor(i / 3);
                const lastRow = row === Math.floor((F.characters.length - 1) / 3);
                return (
                  <div key={i} style={{
                    padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
                    borderRight: col < 2 ? '1px solid var(--border)' : 'none',
                    borderBottom: lastRow ? 'none' : '1px solid var(--border)',
                  }}>
                    <IconSlot name="character" size={32} accent={p.accent} tint={p.tint} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-0.01em' }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.role}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <SectionLabel num="03">Активности</SectionLabel>
            <ol style={{ margin: 0, padding: 0, counterReset: 'act' }}>
              {F.activities.map((a, i) => (
                <li key={i} style={{
                  listStyle: 'none', padding: '12px 0',
                  borderBottom: i < F.activities.length - 1 ? '1px solid var(--border)' : 'none',
                  display: 'grid', gridTemplateColumns: '48px 1fr 1fr', gap: 16, alignItems: 'baseline',
                }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                    color: 'var(--text-light)', fontVariantNumeric: 'tabular-nums',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)' }}>
                    {a.name}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {a.note}
                  </span>
                </li>
              ))}
            </ol>

            <SectionLabel num="04">Финал</SectionLabel>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--text)', margin: 0, maxWidth: 720, fontWeight: 400 }}>
              {F.finale}
            </p>

            {/* ★ KEY BLOCK */}
            <SectionLabel num="05">Расчёт и расходники</SectionLabel>
            <div style={{
              background: '#fbf6ea', border: '1px solid #ecdfb8', borderRadius: 6,
              padding: '14px 18px', display: 'flex', gap: 14, alignItems: 'flex-start',
              marginBottom: 12,
            }}>
              <div style={{ fontSize: 18, lineHeight: 1, marginTop: 1 }}>✱</div>
              <div style={{ flex: 1, fontSize: 14, lineHeight: 1.55, color: 'var(--text)' }}>
                Детальный конструктор стоимости, расчёт маржи и&nbsp;список расходников ведутся в&nbsp;Google&nbsp;Sheets. Все изменения автоматически отражаются здесь по&nbsp;ссылке.
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <CalcLinkCard
                title="Конструктор «Холодное Сердце»"
                sub="Велком · Игровая · Шоу · Доп. — позиции, цены, маржа"
                badge="11 позиций"
                onClick={() => onNav({ name: 'sheet', programId: 'frozen', tab: 'constructor' })}
              />
              <CalcLinkCard
                title="Простой · Средний · Премиум"
                sub="3 готовые сборки с фиксированной ценой для менеджера"
                badge="3 пакета"
                onClick={() => onNav({ name: 'sheet', programId: 'frozen', tab: 'packages' })}
              />
            </div>

            <SectionLabel num="06">Медиа и материалы</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              <MediaCard kind="photo"  title="Фото с праздника" sub="Яндекс.Диск · 248 файлов" />
              <MediaCard kind="video"  title="Видео-тизер"     sub="Яндекс.Диск · 30 сек, 1080p" />
              <MediaCard kind="poster" title="Афиша"           sub="Яндекс.Диск · PDF, A3" />
              <MediaCard kind="doc"    title="Шаблон КП"       sub="Яндекс.Диск · .docx" />
            </div>

            <SectionLabel num="07">Чек-лист материалов</SectionLabel>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', margin: '-6px 0 12px', maxWidth: 720 }}>
              Колонки берутся из вашего файла <span style={{ fontFamily: 'JetBrains Mono, monospace', background: 'var(--bg-soft)', padding: '1px 6px', borderRadius: 3, fontSize: 12 }}>MEDIA HUB Е-ПРАЗДНИК</span>. ● готово · ◐ в работе · ○ нет.
            </div>
            <ul style={{ margin: 0, padding: 0, columnCount: 2, columnGap: 40, maxWidth: 760 }}>
              {F.readiness.map((c, i) => <ChecklistItem key={i} {...c} />)}
            </ul>

            <div style={{
              marginTop: 56, paddingTop: 18, borderTop: '1px solid var(--border)',
              fontSize: 12, color: 'var(--text-light)', display: 'flex', gap: 14,
            }}>
              <span>Создано · 14 марта 2026</span>
              <span>·</span>
              <span>Изменено · 22 мая 2026</span>
              <span>·</span>
              <span>Автор · Мария Корнева</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

window.ScreenProgramDetail = ScreenProgramDetail;
