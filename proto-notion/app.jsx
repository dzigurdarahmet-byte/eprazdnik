function ScreenStub({ section, onNav }) {
  const labels = {
    shows: { icon: '🎭', title: 'Шоу' },
    masterclass: { icon: '🎨', title: 'Мастер-классы' },
    teambuild: { icon: '🤝', title: 'Тимбилдинги' },
    welcome: { icon: '🎉', title: 'Велком-зоны' },
    extra: { icon: '➕', title: 'Доп. услуги' },
    actors: { icon: '🎬', title: 'Актёры' },
    b2b: { icon: '🏢', title: 'B2B-каталог' },
    b2c: { icon: '🎈', title: 'B2C-каталог' },
  };
  const s = labels[section] || { icon: '📄', title: section };
  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '8px 96px 80px' }}>
      <Breadcrumbs items={[
        { label: 'Главная', emoji: '🏠', to: { name: 'home' } },
        { label: s.title },
      ]} onNav={onNav} />
      <div style={{ fontSize: 56, lineHeight: 1, margin: '20px 0 8px' }}>{s.icon}</div>
      <h1 style={{ fontSize: 36, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.02em' }}>{s.title}</h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: 720, marginTop: 16 }}>
        Раздел в работе. Структура — как у{' '}
        <button onClick={() => onNav({ name: 'programs' })} style={{
          background: 'transparent', border: 'none', color: 'var(--link)', cursor: 'pointer',
          padding: 0, fontFamily: 'inherit', fontSize: 'inherit', textDecoration: 'underline',
        }}>«Программ»</button>: gallery view с фильтрами по категории/статусу/B2B-B2C, у каждой карточки — те же блоки (Легенда, Персонажи, Расчёт в Sheets, Чек-лист).
      </p>

      <div style={{
        marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
      }}>
        {[1,2,3,4,5,6].map(i => (
          <div key={i} style={{
            background: 'white', border: '1px solid var(--border)', borderRadius: 4,
            height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-light)', fontSize: 13,
          }}>
            <span>Карточка #{i}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopBar({ route, onNav }) {
  // Page-level breadcrumb / star / share row — light, like the top strip of a doc workspace
  let title = 'Главная';
  if (route.name === 'programs') title = 'Программы';
  else if (route.name === 'detail') {
    const p = window.PROGRAMS.find(x => x.id === route.programId);
    title = p ? p.title : '—';
  } else if (route.name === 'sheet') title = 'Конструктор';
  else if (route.name === 'stub') {
    const ls = { shows:'Шоу', masterclass:'Мастер-классы', teambuild:'Тимбилдинги', welcome:'Велком-зоны', extra:'Доп. услуги', actors:'Актёры', b2b:'B2B-каталог', b2c:'B2C-каталог' };
    title = ls[route.section] || '—';
  }
  return (
    <div style={{
      height: 44, display: 'flex', alignItems: 'center', gap: 8,
      padding: '0 18px', borderBottom: '1px solid var(--border)', background: 'white',
      flexShrink: 0,
    }}>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: 'var(--text-light)' }}>‹</span>
        <span style={{ color: 'var(--text-light)' }}>›</span>
        <span style={{ marginLeft: 4, color: 'var(--text)', fontWeight: 500 }}>{title}</span>
      </div>
      <div style={{ flex: 1 }} />
      <button style={btnGhost}>Поделиться</button>
      <button style={btnGhost}>💬</button>
      <button style={btnGhost}>⏱</button>
      <button style={btnGhost}>★</button>
      <button style={btnGhost}>⋯</button>
    </div>
  );
}
const btnGhost = {
  background: 'transparent', border: 'none', cursor: 'pointer',
  color: 'var(--text-muted)', fontSize: 13, padding: '4px 8px', borderRadius: 4,
  fontFamily: 'inherit',
};

function App() {
  const [route, setRoute] = React.useState({ name: 'home' });
  const [history, setHistory] = React.useState([{ name: 'home' }]);

  const onNav = (r) => {
    setRoute(r);
    setHistory(h => [...h, r]);
    // scroll main pane to top
    requestAnimationFrame(() => {
      const main = document.getElementById('main-scroll');
      if (main) main.scrollTop = 0;
    });
  };

  let screen;
  if (route.name === 'home') screen = <ScreenHome onNav={onNav} />;
  else if (route.name === 'programs') screen = <ScreenPrograms onNav={onNav} />;
  else if (route.name === 'detail') screen = <ScreenProgramDetail programId={route.programId} onNav={onNav} />;
  else if (route.name === 'sheet') screen = <ScreenSheet programId={route.programId} tab={route.tab} onNav={onNav} />;
  else if (route.name === 'stub') screen = <ScreenStub section={route.section} onNav={onNav} />;
  else screen = <div style={{ padding: 48 }}>Неизвестная страница</div>;

  // Sheet screen owns its full layout (full-bleed), so don't add main-scroll wrapper for it
  const isSheet = route.name === 'sheet';

  return (
    <div style={{ display: 'flex', height: '100vh' }} data-screen-label={
      route.name === 'home' ? '01 Главная' :
      route.name === 'programs' ? '02 Программы' :
      route.name === 'detail' ? '03 Карточка программы' :
      route.name === 'sheet' ? '04 Конструктор (Google Sheets)' :
      'Заглушка раздела'
    }>
      <Sidebar route={route} onNav={onNav} />
      <main style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        background: 'white', minWidth: 0, overflow: 'hidden',
      }}>
        <TopBar route={route} onNav={onNav} />
        {isSheet ? (
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>{screen}</div>
        ) : (
          <div id="main-scroll" style={{ flex: 1, overflowY: 'auto' }}>
            {screen}
          </div>
        )}
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
