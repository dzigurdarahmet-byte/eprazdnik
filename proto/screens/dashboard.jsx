// Screen 1: Dashboard — "Доброе утро, Анна!"

const Dashboard = ({ go, openProgram, toast }) => {
  const recent = RECENT_IDS.map(byId);

  const [match, setMatch] = React.useState({
    type: "Детский праздник", age: "8–12", guests: "20–40", budget: "50–100к ₽",
  });

  const setKey = (k) => (e) => setMatch({ ...match, [k]: e.target.value });

  return (
    <div className="main page-enter">
      <div className="hero-row">
        <div>
          <h1 className="page-title">Доброе утро, Анна! <span style={{display:"inline-block", transform:"rotate(-12deg)"}}>👋</span></h1>
          <div className="page-sub">Все материалы для успешных продаж — под рукой.</div>
        </div>
        <div className="hero-stats">
          <Icon n="briefcase" size={14}/> <b>5</b> активных подборок
          <span className="dot">·</span>
          <Icon n="calendar" size={14}/> <b>12</b> встреч на неделе
        </div>
      </div>

      <div className="qa-grid">
        <div className="qa qa--purple" onClick={() => go("collections")}>
          <div className="qa-arrow"><Icon n="arrow-up-right" size={18}/></div>
          <div className="qa-ico"><Icon n="send" size={20}/></div>
          <div>
            <div className="qa-title">Что отправить клиенту</div>
            <div className="qa-meta">23 готовых подборки</div>
          </div>
        </div>
        <div className="qa qa--pink" onClick={() => go("catalog")}>
          <div className="qa-arrow"><Icon n="arrow-up-right" size={18}/></div>
          <div className="qa-ico"><Icon n="library" size={20}/></div>
          <div>
            <div className="qa-title">Каталог услуг</div>
            <div className="qa-meta">86 программ и шоу</div>
          </div>
        </div>
        <div className="qa qa--amber" onClick={() => go("scripts")}>
          <div className="qa-arrow"><Icon n="arrow-up-right" size={18}/></div>
          <div className="qa-ico"><Icon n="flame" size={20}/></div>
          <div>
            <div className="qa-title">Скрипты продаж</div>
            <div className="qa-meta">14 сценариев</div>
          </div>
        </div>
        <div className="qa qa--cyan" onClick={() => go("prices")}>
          <div className="qa-arrow"><Icon n="arrow-up-right" size={18}/></div>
          <div className="qa-ico"><Icon n="wallet" size={20}/></div>
          <div>
            <div className="qa-title">Прайсы и КП</div>
            <div className="qa-meta">Обновлены сегодня</div>
          </div>
        </div>
      </div>

      <div className="match-panel">
        <div className="match-panel-head">
          <Icon n="compass" size={20} style={{color: "var(--purple)"}}/>
          <span>Быстрый подбор услуги</span>
          <span className="tag">AI</span>
          <span style={{marginLeft: "auto", fontSize: 12, color: "var(--text-3)", fontWeight: 500}}>
            ~6 сек на подбор · 86 программ в базе
          </span>
        </div>
        <div className="match-row">
          <div className="field">
            <div className="field-label">Тип мероприятия</div>
            <select className="field-select" value={match.type} onChange={setKey("type")}>
              <option>Детский праздник</option>
              <option>Корпоратив</option>
              <option>Свадьба</option>
              <option>Выпускной</option>
              <option>Юбилей</option>
            </select>
          </div>
          <div className="field">
            <div className="field-label">Возраст гостей</div>
            <select className="field-select" value={match.age} onChange={setKey("age")}>
              <option>3–5</option><option>5–8</option><option>8–12</option><option>12–16</option><option>Взрослые</option>
            </select>
          </div>
          <div className="field">
            <div className="field-label">Количество гостей</div>
            <select className="field-select" value={match.guests} onChange={setKey("guests")}>
              <option>до 20</option><option>20–40</option><option>40–80</option><option>80+</option>
            </select>
          </div>
          <div className="field">
            <div className="field-label">Бюджет</div>
            <select className="field-select" value={match.budget} onChange={setKey("budget")}>
              <option>до 50к ₽</option><option>50–100к ₽</option><option>100–200к ₽</option><option>200к+ ₽</option>
            </select>
          </div>
          <button className="btn btn-primary lg" onClick={() => go("match", { filters: match })}>
            <Icon n="gift" size={16}/> Подобрать программу
          </button>
        </div>
      </div>

      <div className="sec-head">
        <div className="sec-title">
          <span className="ico"><Icon n="clock" size={18}/></span>
          Недавно просмотренные
        </div>
        <a className="sec-link" onClick={() => go("catalog")}>
          Весь каталог <Icon n="arrow-right" size={13}/>
        </a>
      </div>
      <div className="cards-grid">
        {recent.map(p => (
          <ProgramCard key={p.id} p={p} onOpen={openProgram}/>
        ))}
      </div>

      <div className="dash-bottom">
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">
              <span className="ico"><Icon n="briefcase" size={16}/></span>
              Мои подборки для клиентов
            </div>
            <a className="sec-link" onClick={() => go("collections")}>
              Все подборки <Icon n="arrow-right" size={13}/>
            </a>
          </div>
          {COLLECTIONS.map((c, i) => (
            <div className="collection-row" key={i}>
              <div className="collection-name">
                {c.name}
                <small>отправлено клиенту в WhatsApp</small>
              </div>
              <div className="coll-count">{c.count} услуг</div>
              <div className="coll-time">{c.when}</div>
              <button className="coll-go" onClick={() => toast("Подборка открыта")}>
                <Icon n="arrow-right" size={14}/>
              </button>
            </div>
          ))}
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">
              <span className="ico"><Icon n="bell" size={16}/></span>
              Последние обновления
            </div>
            <a className="sec-link" onClick={() => toast("Открыты обновления")}>
              Всё <Icon n="arrow-right" size={13}/>
            </a>
          </div>
          {UPDATES.map((u, i) => (
            <div className="feed-row" key={i}>
              <div className={"feed-ico " + u.color}>
                <Icon n={u.kind === "video" ? "video" : u.kind === "image" ? "image" : "tag"} size={16}/>
              </div>
              <div style={{flex:1}}>
                <div className="feed-title">{u.title}</div>
                <div className="feed-meta">{u.meta}</div>
              </div>
              <button className="coll-go" style={{alignSelf:"center"}} onClick={() => toast("Открыто")}>
                <Icon n="play" size={12}/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

window.Dashboard = Dashboard;
