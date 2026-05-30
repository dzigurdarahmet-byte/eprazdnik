// Imitates an embedded spreadsheet within the page — generic spreadsheet UI, not branded.

const COL_WIDTHS = {
  A: 36,   // row number col (handled separately)
  B: 50,   // №
  C: 240,  // Позиция
  D: 220,  // Описание
  E: 80,   // Длительность
  F: 90,   // Цена
  G: 60,   // Кол-во
  H: 70,   // Актёры
  I: 110,  // Итого
  J: 90,   // Маржа
};
const COLS = ['B','C','D','E','F','G','H','I','J'];
const COL_LABELS = { B:'B', C:'C', D:'D', E:'E', F:'F', G:'G', H:'H', I:'I', J:'J' };
const HEADER_LABELS = { B:'№', C:'Позиция', D:'Описание', E:'Длительность', F:'Цена, ₽', G:'Кол-во', H:'Актёры', I:'Итого, ₽', J:'Маржа' };

function fmt(v) {
  if (typeof v !== 'number') return v;
  return v.toLocaleString('ru-RU');
}
function pct(v) {
  return (v * 100).toFixed(0) + ' %';
}

function CellGrid() {
  const rows = window.SHEET_ROWS;
  const [selectedCell, setSelectedCell] = React.useState({ col: 'C', row: 4 });

  // Build flattened row list with row numbers
  const flatRows = [];
  flatRows.push({ kind: 'header' });
  rows.forEach(r => flatRows.push(r));

  return (
    <div style={{ position: 'relative', overflow: 'auto', flex: 1, background: 'white' }}>
      <table style={{
        borderCollapse: 'collapse', fontSize: 13, fontFamily: 'Inter, sans-serif',
        color: 'var(--text)', tableLayout: 'fixed', width: 'max-content',
      }}>
        <colgroup>
          <col style={{ width: COL_WIDTHS.A }} />
          {COLS.map(c => <col key={c} style={{ width: COL_WIDTHS[c] }} />)}
        </colgroup>

        {/* Column letter row */}
        <thead>
          <tr style={{ height: 22 }}>
            <th style={colHeaderStyle({ corner: true })}></th>
            {COLS.map(c => (
              <th key={c} style={colHeaderStyle({ selected: selectedCell.col === c })}>{COL_LABELS[c]}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {flatRows.map((r, idx) => {
            if (r.kind === 'header') {
              return (
                <tr key="thead" style={{ height: 32 }}>
                  <td style={rowHeaderStyle({ idx: 1 })}>1</td>
                  {COLS.map(c => (
                    <td key={c} style={{ ...cellStyle, background: '#f3f3f1', fontWeight: 600, color: 'var(--text)' }}>
                      {HEADER_LABELS[c]}
                    </td>
                  ))}
                </tr>
              );
            }
            const rowNum = idx + 1;
            if (r.kind === 'section') {
              return (
                <tr key={idx} style={{ height: 30 }}>
                  <td style={rowHeaderStyle({ idx: rowNum })}>{rowNum}</td>
                  <td colSpan={COLS.length} style={{
                    ...cellStyle, background: '#e7eef9', fontWeight: 700, color: '#1d4789',
                    letterSpacing: '.02em', fontSize: 12,
                  }}>{r.label}</td>
                </tr>
              );
            }
            if (r.kind === 'total') {
              return (
                <tr key={idx} style={{ height: 30 }}>
                  <td style={rowHeaderStyle({ idx: rowNum })}>{rowNum}</td>
                  <td colSpan={6} style={{ ...cellStyle, background: '#fff6d6', fontWeight: 700, color: '#6a4b00', textAlign: 'right', paddingRight: 12 }}>
                    {r.label}
                  </td>
                  <td style={{ ...cellStyle, background: '#fff6d6', fontWeight: 700, fontVariantNumeric: 'tabular-nums', textAlign: 'right', paddingRight: 10 }}>
                    {fmt(r.total)}
                  </td>
                  <td style={{ ...cellStyle, background: '#fff6d6', fontWeight: 700, color: '#1a6055', textAlign: 'right', paddingRight: 10, fontVariantNumeric: 'tabular-nums' }}>
                    {pct(r.margin)}
                  </td>
                </tr>
              );
            }
            // Data row
            const isSel = c => selectedCell.row === rowNum && selectedCell.col === c;
            const cellOn = (col) => () => setSelectedCell({ col, row: rowNum });
            return (
              <tr key={idx} style={{ height: 32 }}>
                <td style={rowHeaderStyle({ idx: rowNum })}>{rowNum}</td>
                <td onClick={cellOn('B')} style={{ ...cellStyle, ...selOverlay(isSel('B')), textAlign: 'center', color: 'var(--text-muted)' }}>{r.n}</td>
                <td onClick={cellOn('C')} style={{ ...cellStyle, ...selOverlay(isSel('C')), fontWeight: 500 }}>{r.name}</td>
                <td onClick={cellOn('D')} style={{ ...cellStyle, ...selOverlay(isSel('D')), color: 'var(--text-muted)' }}>{r.desc}</td>
                <td onClick={cellOn('E')} style={{ ...cellStyle, ...selOverlay(isSel('E')), textAlign: 'center' }}>{r.dur}</td>
                <td onClick={cellOn('F')} style={{ ...cellStyle, ...selOverlay(isSel('F')), textAlign: 'right', paddingRight: 10, fontVariantNumeric: 'tabular-nums' }}>{fmt(r.price)}</td>
                <td onClick={cellOn('G')} style={{ ...cellStyle, ...selOverlay(isSel('G')), textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{r.qty}</td>
                <td onClick={cellOn('H')} style={{ ...cellStyle, ...selOverlay(isSel('H')), textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{r.actors || '—'}</td>
                <td onClick={cellOn('I')} style={{ ...cellStyle, ...selOverlay(isSel('I')), textAlign: 'right', paddingRight: 10, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmt(r.total)}</td>
                <td onClick={cellOn('J')} style={{ ...cellStyle, ...selOverlay(isSel('J')), textAlign: 'right', paddingRight: 10, color: '#1a6055', fontVariantNumeric: 'tabular-nums' }}>{pct(r.margin)}</td>
              </tr>
            );
          })}
          {/* Empty rows to fill out the grid */}
          {Array.from({ length: 12 }).map((_, i) => (
            <tr key={'e' + i} style={{ height: 30 }}>
              <td style={rowHeaderStyle({ idx: flatRows.length + i + 1 })}>{flatRows.length + i + 1}</td>
              {COLS.map(c => <td key={c} style={{ ...cellStyle }} />)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const cellStyle = {
  border: '1px solid #e1e1de',
  padding: '4px 8px',
  verticalAlign: 'middle',
  cursor: 'cell',
  background: 'white',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

function selOverlay(sel) {
  return sel ? { outline: '2px solid #1a73e8', outlineOffset: -2, position: 'relative', zIndex: 1 } : {};
}

function colHeaderStyle({ selected, corner }) {
  return {
    background: '#f8f9fa',
    border: '1px solid #e1e1de',
    borderTop: 'none',
    color: selected ? '#1a73e8' : '#5f6368',
    fontSize: 11,
    fontWeight: 500,
    textAlign: 'center',
    width: corner ? 36 : 'auto',
    position: 'sticky', top: 0, zIndex: 2,
  };
}
function rowHeaderStyle({ idx }) {
  return {
    background: '#f8f9fa',
    border: '1px solid #e1e1de',
    color: '#5f6368',
    fontSize: 11,
    fontWeight: 500,
    textAlign: 'center',
    width: 36,
    position: 'sticky', left: 0, zIndex: 1,
  };
}

function SheetToolbar({ programTitle, activeTab, onTab }) {
  return (
    <div style={{ background: 'white', borderBottom: '1px solid #e1e1de' }}>
      {/* Title bar */}
      <div style={{ padding: '8px 14px 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <SheetIcon size={22} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>Конструктор «{programTitle}»</span>
            <span style={{ fontSize: 12, color: 'var(--text-light)' }}>★</span>
          </div>
          <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            {['Файл','Правка','Вид','Вставка','Формат','Данные','Инструменты','Дополнения','Справка'].map(m => (
              <span key={m} style={{ cursor: 'pointer' }}>{m}</span>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-light)' }}>Сохранено · только что</div>
      </div>
      {/* Format toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '4px 14px 6px',
        fontSize: 12, color: 'var(--text-muted)',
      }}>
        <span style={{ padding: '2px 6px', border: '1px solid #e1e1de', borderRadius: 3, background: 'var(--bg-soft)' }}>↶</span>
        <span style={{ padding: '2px 6px', border: '1px solid #e1e1de', borderRadius: 3, background: 'var(--bg-soft)' }}>↷</span>
        <span style={{ width: 1, height: 16, background: '#e1e1de' }} />
        <span style={{ fontWeight: 600 }}>100%</span>
        <span>·</span>
        <span>₽</span>
        <span>%</span>
        <span>.0</span>
        <span style={{ width: 1, height: 16, background: '#e1e1de' }} />
        <span>Inter</span>
        <span>·</span>
        <span style={{ fontWeight: 600 }}>B</span>
        <span style={{ fontStyle: 'italic' }}>I</span>
        <span style={{ textDecoration: 'underline' }}>U</span>
        <span style={{ width: 1, height: 16, background: '#e1e1de' }} />
        <span>Σ</span>
        <span style={{ marginLeft: 'auto', color: 'var(--text-light)' }}>Доступ: все менеджеры</span>
      </div>
      {/* Cell ref + formula bar */}
      <div style={{ display: 'flex', alignItems: 'center', borderTop: '1px solid #e1e1de', height: 26 }}>
        <div style={{
          width: 60, fontSize: 12, fontFamily: 'JetBrains Mono, monospace',
          padding: '0 8px', borderRight: '1px solid #e1e1de', color: '#5f6368',
          display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%',
        }}>C4</div>
        <div style={{ width: 32, color: '#5f6368', fontFamily: 'JetBrains Mono', textAlign: 'center', borderRight: '1px solid #e1e1de', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>fx</div>
        <div style={{ padding: '0 8px', fontSize: 12, color: 'var(--text)', fontFamily: 'JetBrains Mono', flex: 1 }}>
          МК по созданию снежных шаров
        </div>
      </div>
    </div>
  );
}

function SheetTabsBar({ activeTab, onTab }) {
  const tabs = [
    { id: 'constructor', label: 'Конструктор' },
    { id: 'packages', label: 'Пакеты' },
    { id: 'expenses', label: 'Расходники' },
    { id: 'margin', label: 'Маржа' },
  ];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', height: 32,
      borderTop: '1px solid #e1e1de', background: '#f8f9fa',
      paddingLeft: 8, fontSize: 13,
    }}>
      <span style={{ color: '#5f6368', padding: '0 6px' }}>＋</span>
      <span style={{ color: '#5f6368', padding: '0 6px' }}>≡</span>
      <div style={{ width: 1, height: 18, background: '#e1e1de', margin: '0 6px' }} />
      {tabs.map(t => (
        <div key={t.id}
          onClick={() => onTab(t.id)}
          style={{
            padding: '0 14px', height: '100%', display: 'flex', alignItems: 'center',
            cursor: 'pointer',
            background: activeTab === t.id ? 'white' : 'transparent',
            color: activeTab === t.id ? 'var(--text)' : 'var(--text-muted)',
            fontWeight: activeTab === t.id ? 500 : 400,
            borderRight: '1px solid #e1e1de',
            borderTop: activeTab === t.id ? '2px solid #1f8a4d' : '2px solid transparent',
            marginTop: -1,
          }}>
          {t.label}
        </div>
      ))}
    </div>
  );
}

function ScreenSheet({ programId, tab, onNav }) {
  const p = window.PROGRAMS.find(x => x.id === programId) || window.PROGRAMS[0];
  const [activeTab, setActiveTab] = React.useState(tab || 'constructor');

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Page chrome (still inside the workspace) */}
      <div style={{ padding: '8px 40px 0', background: 'white', flexShrink: 0 }}>
        <Breadcrumbs items={[
          { label: 'Главная', emoji: '🏠', to: { name: 'home' } },
          { label: 'Программы', emoji: '📚', to: { name: 'programs' } },
          { label: p.title, emoji: p.emoji, to: { name: 'detail', programId: p.id } },
          { label: 'Конструктор' },
        ]} onNav={onNav} />

        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-light)', letterSpacing: '.06em', textTransform: 'uppercase', margin: '6px 0 6px' }}>
          embed · google sheets
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 12 }}>
          <SheetIcon size={26} />
          <span>Конструктор «{p.title}»</span>
        </h1>
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          background: '#fbf6ea', border: '1px solid #ecdfb8', borderRadius: 6,
          padding: '10px 14px', margin: '10px 0 14px', maxWidth: 920,
        }}>
          <span style={{ fontSize: 14, marginTop: 1 }}>✱</span>
          <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.55 }}>
            Изменения сохраняются автоматически. Доступ есть у всех менеджеров. Цены и&nbsp;маржа из&nbsp;этой таблицы автоматически подтягиваются в&nbsp;карточку программы.
          </div>
        </div>
      </div>

      {/* Embedded sheet frame */}
      <div style={{ padding: '0 40px 24px', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          border: '1px solid #c1c1bf', borderRadius: 4, overflow: 'hidden',
          background: 'white', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0,
          boxShadow: '0 1px 2px rgba(15,15,15,.06)',
        }}>
          {/* Frame top bar — like a browser/iframe label */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
            background: '#f1f3f4', borderBottom: '1px solid #dadce0', fontSize: 11, color: '#5f6368',
          }}>
            <div style={{ display: 'flex', gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', flex: 1, textAlign: 'center', color: '#5f6368' }}>
              🔒 docs.google.com / spreadsheets / d / 1aB...zXc / edit#gid=2 — конструктор Холодное Сердце
            </div>
            <span style={{ color: '#5f6368' }}>⤢</span>
          </div>

          <SheetToolbar programTitle={p.title} activeTab={activeTab} onTab={setActiveTab} />

          <CellGrid />

          <SheetTabsBar activeTab={activeTab} onTab={setActiveTab} />
        </div>

        <div style={{
          marginTop: 10, fontSize: 12, color: 'var(--text-light)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span>↻ Синхронизация: данные подтянутся в карточку «{p.title}» за ~30 сек</span>
          <span>·</span>
          <button onClick={() => onNav({ name: 'detail', programId: p.id })} style={{
            border: 'none', background: 'transparent', color: 'var(--link)', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 12, padding: 0,
          }}>← Вернуться к карточке программы</button>
        </div>
      </div>
    </div>
  );
}

window.ScreenSheet = ScreenSheet;
