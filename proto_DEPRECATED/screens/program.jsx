// Screen 3: Program detail — "Холодное Сердце" (uses byId(programId))

const Program = ({ programId, go, openProgram, toast }) => {
  const p = byId(programId) || byId("frost");
  const [tab, setTab] = React.useState("desc");

  const includes = [
    { ico: "compass",    color:"linear-gradient(135deg,#22d3ee,#0891b2)", title: "Оленья тропа",     desc: "Игровая стартовая сцена с интерактивом гостей" },
    { ico: "snowflake",  color:"linear-gradient(135deg,#a78bfa,#6366f1)", title: "Ледяной страж",    desc: "Танцевальный батл с подсветкой и LED-костюмом" },
    { ico: "sparkles",   color:"linear-gradient(135deg,#f9a8d4,#ec4899)", title: "Зов кристалла",    desc: "Тематический квест по 4 локациям" },
    { ico: "wand",       color:"linear-gradient(135deg,#fbbf24,#d97706)", title: "Магический урок",  desc: "Мастер-класс по созданию ледяного браслета" },
    { ico: "snowflake",  color:"linear-gradient(135deg,#22d3ee,#0ea5e9)", title: "Крио-финал",       desc: "Облака сухого льда + фото-сет с гостями" },
    { ico: "gift",       color:"linear-gradient(135deg,#a78bfa,#7c3aed)", title: "Подарок Эльзы",    desc: "Брендированный сувенир каждому ребёнку" },
    { ico: "image",      color:"linear-gradient(135deg,#f472b6,#db2777)", title: "Фотозона + видео", desc: "Профессиональная съёмка 90 мин в подарок" },
  ];

  const characters = [
    { name: "Эльза",        role: "Снежная королева",   bg:"linear-gradient(135deg,#c7d2fe,#6366f1)"   },
    { name: "Анна",         role: "Принцесса Эренделла", bg:"linear-gradient(135deg,#fed7aa,#dc2626)"  },
    { name: "Кристофф",     role: "Горный проводник",   bg:"linear-gradient(135deg,#fde68a,#92400e)"   },
    { name: "Принц Ханс",   role: "Антагонист сюжета",  bg:"linear-gradient(135deg,#cbd5e1,#475569)"   },
    { name: "Тумрана",      role: "Дух леса",            bg:"linear-gradient(135deg,#bef264,#65a30d)"  },
    { name: "Олаф",         role: "Ростовой персонаж",  bg:"linear-gradient(135deg,#fef3c7,#fb923c)"   },
  ];

  const similar = ["princess", "alice", "ladybug"].map(byId);

  return (
    <div className="main page-enter">
      <div className="crumbs">
        <a onClick={() => go("catalog")}>Каталог</a>
        <span className="sep">/</span>
        <a onClick={() => go("catalog")}>Программы</a>
        <span className="sep">/</span>
        <span className="cur">{p.title}</span>
      </div>

      <div className="prog-hero">
        <div className="prog-hero-img">
          <Cover kind={p.cover}/>
          <div style={{position:"absolute", top: 20, left: 20, display:"flex", gap: 8, zIndex:2}}>
            <span className="pbadge" style={{background:"rgba(16,185,129,.95)", color:"white"}}>
              <Icon n="check" size={12}/> Готово к продаже
            </span>
            <span className="pbadge story">Сюжетная</span>
          </div>
          <div style={{position:"absolute", bottom: 20, left: 20, zIndex:2, display:"flex", gap: 8}}>
            <button className="pbadge" style={{cursor:"pointer", background:"rgba(20,20,28,.8)", color:"white", backdropFilter:"blur(8px)"}} onClick={() => toast("Видео-демо")}>
              <Icon n="play" size={11}/> Видео-демо · 1:24
            </button>
            <span className="pbadge" style={{background:"rgba(20,20,28,.8)", color:"white", backdropFilter:"blur(8px)"}}>
              <Icon n="image" size={11}/> 48 фото
            </span>
          </div>
        </div>
        <div className="prog-hero-info">
          <div>
            <h1 className="prog-hero-title">{p.title}</h1>
            <div className="prog-hero-sub">{p.sub}</div>
          </div>

          <div style={{display:"flex", gap: 6, flexWrap:"wrap"}}>
            <span className="ptag green"><Icon n="check" size={11}/> готово к продаже</span>
            <span className="ptag amber">сюжетная</span>
            <span className="ptag cyan">КРИО</span>
            <span className="ptag purple">премиум</span>
          </div>

          <div className="metrics-row">
            <div className="metric">
              <div className="metric-ico pink"><Icon n="baby" size={16}/></div>
              <div>
                <div className="metric-label">Возраст</div>
                <div className="metric-value">{p.age} лет</div>
              </div>
            </div>
            <div className="metric">
              <div className="metric-ico amber"><Icon n="clock" size={16}/></div>
              <div>
                <div className="metric-label">Длительность</div>
                <div className="metric-value">{p.duration}</div>
              </div>
            </div>
            <div className="metric">
              <div className="metric-ico cyan"><Icon n="users" size={16}/></div>
              <div>
                <div className="metric-label">Гостей</div>
                <div className="metric-value">{p.guests}</div>
              </div>
            </div>
            <div className="metric">
              <div className="metric-ico purple"><Icon n="ruble" size={16}/></div>
              <div>
                <div className="metric-label">Стоимость</div>
                <div className="metric-value">от {formatPrice(p.price)}</div>
              </div>
            </div>
          </div>

          <div className="hero-ctas">
            <button className="btn btn-primary full" onClick={() => toast("Открыто окно отправки клиенту")}>
              <Icon n="send" size={15}/> Отправить клиенту
            </button>
            <button className="btn btn-outline full" onClick={() => toast("Добавлено в подборку «Выпускной 4 Б»")}>
              <Icon n="plus" size={15}/> В подборку
            </button>
          </div>
        </div>
      </div>

      <div className="tabs">
        {[
          ["desc",    "Описание"],
          ["compose", "Состав программы"],
          ["calc",    "Расчёт"],
          ["media",   "Медиа"],
          ["scripts", "Скрипты продаж"],
        ].map(([k, lbl]) => (
          <button key={k} className={"tab " + (tab === k ? "active" : "")} onClick={() => setTab(k)}>
            {lbl}
          </button>
        ))}
      </div>

      <div className="prog-body">
        <div>
          <div className="prog-section">
            <h3><Icon n="book" size={18} style={{color:"var(--purple)"}}/> Легенда программы</h3>
            <p>
              В королевстве Эренделл случилась беда: древние кристаллы потеряли свою силу,
              и волшебная зима застыла на полпути. Только команда смелых героев — наши гости —
              способна разгадать тайну и вернуть магию в королевский замок.
            </p>
            <p>
              По ходу программы дети проходят 4 интерактивные локации, выполняют задания вместе
              с актёрами и в финале встречаются с Снежной королевой Эльзой. Программа сочетает
              иммерсивный театр, квест-механику и крио-шоу с облаками сухого льда.
            </p>
          </div>

          <div className="prog-section">
            <h3><Icon n="sparkles" size={18} style={{color:"var(--purple)"}}/> Что входит</h3>
            <div className="includes-list">
              {includes.map((it, i) => (
                <div className="includes-item" key={i}>
                  <div className="includes-ico" style={{background: it.color}}>
                    <Icon n={it.ico} size={16}/>
                  </div>
                  <div style={{flex:1}}>
                    <div className="includes-title">{it.title}</div>
                    <div className="includes-desc">{it.desc}</div>
                  </div>
                  <Icon n="check" size={16} style={{color: "var(--green)"}}/>
                </div>
              ))}
            </div>
          </div>

          <div className="prog-section">
            <h3><Icon n="users" size={18} style={{color:"var(--purple)"}}/> Персонажи</h3>
            <div className="chars-row">
              {characters.map((c, i) => (
                <div className="char-card" key={i}>
                  <div className="char-avatar" style={{background: c.bg}}>
                    <div style={{position:"absolute", inset:0, display:"grid", placeItems:"center", color:"white", fontWeight:800}}>
                      {c.name[0]}
                    </div>
                  </div>
                  <div>
                    <div className="char-name">{c.name}</div>
                    <div className="char-role">{c.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="aside-card">
            <h4>Цена и условия</h4>
            <div className="spec-row"><span className="label">База (до 30 гостей)</span><b>от 182 000 ₽</b></div>
            <div className="spec-row"><span className="label">Доп. гость (свыше 30)</span><b>+1 800 ₽</b></div>
            <div className="spec-row"><span className="label">Крио-усиление</span><b>+24 000 ₽</b></div>
            <div className="spec-row"><span className="label">Локация в МО</span><b>+8 000 ₽</b></div>
            <div className="spec-row"><span className="label">Предоплата</span><b>30%</b></div>
            <button className="btn btn-outline full" style={{marginTop: 14}} onClick={() => toast("Открыт калькулятор")}>
              <Icon n="wallet" size={14}/> Открыть калькулятор
            </button>
          </div>

          <div className="aside-card">
            <h4>Маркетинг-кит</h4>
            {[
              ["Reels для Stories", "0:30 · 14 МБ", "video", "pink"],
              ["Презентация PDF", "12 слайдов · 4 МБ", "book", "purple"],
              ["Фото-сет 2025", "48 фото · 132 МБ", "image", "amber"],
              ["Отзывы клиентов", "8 видео-отзывов", "play", "cyan"],
            ].map(([t, m, ic, cl], i) => (
              <div className="feed-row" key={i} style={{cursor:"pointer"}} onClick={() => toast(t + " скачано")}>
                <div className={"feed-ico " + cl}><Icon n={ic} size={14}/></div>
                <div style={{flex:1}}>
                  <div className="feed-title">{t}</div>
                  <div className="feed-meta">{m}</div>
                </div>
                <Icon n="arrow-up-right" size={14} style={{color:"var(--text-3)", alignSelf:"center"}}/>
              </div>
            ))}
          </div>

          <div className="aside-card">
            <h4>Менеджер программы</h4>
            <div style={{display:"flex", alignItems:"center", gap:12}}>
              <div className="sb-avatar" style={{width:42, height:42, fontSize:14}}>МК</div>
              <div>
                <div style={{fontWeight:700, fontSize:14}}>Мария Костина</div>
                <div style={{color:"var(--text-3)", fontSize:12}}>Отвечает за КРИО-серию</div>
              </div>
            </div>
            <button className="btn btn-outline full" style={{marginTop: 14}} onClick={() => toast("Открыт чат")}>
              <Icon n="send" size={14}/> Написать
            </button>
          </div>
        </div>
      </div>

      <div className="sec-head" style={{marginTop: 36}}>
        <div className="sec-title">
          <span className="ico"><Icon n="sparkles" size={18}/></span>
          Похожие программы
        </div>
        <a className="sec-link" onClick={() => go("catalog")}>
          Весь каталог <Icon n="arrow-right" size={13}/>
        </a>
      </div>
      <div className="cards-grid-3">
        {similar.map(s => (
          <ProgramCard key={s.id} p={s} onOpen={openProgram} lg/>
        ))}
      </div>
    </div>
  );
};

window.Program = Program;
