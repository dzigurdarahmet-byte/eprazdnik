// Screen 2: Catalog gallery

const Catalog = ({ go, openProgram, toast }) => {
  const [chip, setChip] = React.useState("all");
  const [q, setQ] = React.useState("");

  const filtered = React.useMemo(() => {
    return PROGRAMS.filter(p => {
      if (q && !(p.title.toLowerCase().includes(q.toLowerCase()) || p.sub.toLowerCase().includes(q.toLowerCase()))) return false;
      if (chip === "all") return true;
      if (chip === "shows") return p.category === "Шоу";
      if (chip === "quests") return p.category === "Квесты";
      if (chip === "mk") return p.category === "Мастер-классы";
      if (chip === "b2b") return p.b2 === "B2B";
      if (chip === "b2c") return p.b2 === "B2C";
      if (chip === "kids") return /^[0-9]/.test(p.age) && parseInt(p.age) < 13;
      if (chip === "adults") return p.age.includes("+") || p.age.toLowerCase().includes("взросл");
      return true;
    });
  }, [chip, q]);

  return (
    <div className="main page-enter">
      <div className="hero-row" style={{marginBottom: 18}}>
        <div>
          <h1 className="page-title">Каталог услуг</h1>
          <div className="page-sub">86 программ и шоу для любого формата мероприятия.</div>
        </div>
        <div className="hero-stats">
          <Icon n="check" size={14}/> <b>{filtered.length}</b> в выдаче
          <span className="dot">·</span>
          <Icon n="library" size={14}/> 86 всего
        </div>
      </div>

      <div className="search-row">
        <div className="search-box">
          <Icon n="search" size={18} style={{color:"var(--text-3)"}}/>
          <input value={q} onChange={(e)=>setQ(e.target.value)}
                 placeholder="Найти услугу по названию, тегу или ключевому слову..."/>
          <span className="kbd">⌘K</span>
        </div>
        <button className="filters-btn" onClick={() => toast("Открыты фильтры")}>
          <Icon n="filter" size={16}/> Фильтры <span className="num">3</span>
        </button>
      </div>

      <div className="chips-row">
        {CHIPS.map(c => (
          <button key={c.key}
                  className={"chip " + (chip === c.key ? "active" : "")}
                  onClick={() => setChip(c.key)}>
            <Icon n={c.ico} size={14}/> {c.label}
          </button>
        ))}
      </div>

      <div className="cards-grid lg">
        {filtered.map(p => (
          <ProgramCard key={p.id} p={p} onOpen={openProgram} lg/>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{padding: 60, textAlign:"center", color:"var(--text-3)"}}>
          Ничего не найдено по запросу «{q}»
        </div>
      )}

      <div className="cta-banner">
        <div className="cta-banner-ico">
          <Icon n="send" size={24}/>
        </div>
        <div className="cta-banner-content">
          <div className="cta-banner-title">Что отправить клиенту</div>
          <div className="cta-banner-text">
            Готовые подборки материалов для быстрого общения — Reels, прайсы, видео-отзывы. Открывается одним кликом.
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => go("collections")}>
          Открыть подборки <Icon n="arrow-right" size={14}/>
        </button>
      </div>
    </div>
  );
};

window.Catalog = Catalog;
