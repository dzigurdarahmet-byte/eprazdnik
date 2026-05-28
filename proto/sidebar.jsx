// Sidebar + Program card components (reused across all screens).

const Sidebar = ({ active, onNav }) => {
  const items = [
    { id: "home",     label: "Главная",        ico: "zap" },
    { id: "catalog",  label: "Каталог услуг",  ico: "library" },
    { id: "collections", label: "Мои подборки", ico: "briefcase", badge: 5 },
    { id: "scripts",  label: "Скрипты продаж", ico: "flame" },
    { id: "prices",   label: "Прайсы и КП",    ico: "wallet" },
    { id: "media",    label: "Медиа",          ico: "image" },
    { id: "favs",     label: "Избранное",      ico: "star" },
  ];
  return (
    <aside className="sb">
      <div className="sb-logo">
        <div className="sb-logo-mark"><span>Е</span></div>
        <div>Е-<span className="accent">Праздник</span></div>
      </div>

      <div className="sb-section-title">Навигация</div>
      {items.slice(0,2).map(it => (
        <div key={it.id}
             className={"sb-item " + (active === it.id ? "active" : "")}
             onClick={() => onNav(it.id)}>
          <span className="ico"><Icon n={it.ico} size={17}/></span>
          <span>{it.label}</span>
          {it.badge && <span className="badge">{it.badge}</span>}
        </div>
      ))}

      <div className="sb-section-title">Продажи</div>
      {items.slice(2,5).map(it => (
        <div key={it.id}
             className={"sb-item " + (active === it.id ? "active" : "")}
             onClick={() => onNav(it.id)}>
          <span className="ico"><Icon n={it.ico} size={17}/></span>
          <span>{it.label}</span>
          {it.badge && <span className="badge">{it.badge}</span>}
        </div>
      ))}

      <div className="sb-section-title">Ресурсы</div>
      {items.slice(5).map(it => (
        <div key={it.id}
             className={"sb-item " + (active === it.id ? "active" : "")}
             onClick={() => onNav(it.id)}>
          <span className="ico"><Icon n={it.ico} size={17}/></span>
          <span>{it.label}</span>
        </div>
      ))}

      <div className="sb-spacer"/>

      <div className="sb-user">
        <div className="sb-avatar">АК</div>
        <div>
          <div className="sb-user-name">Анна К.</div>
          <div className="sb-user-role">Менеджер · Отдел B2C</div>
        </div>
        <span className="sb-user-cog"><Icon n="settings" size={16}/></span>
      </div>
    </aside>
  );
};

// Program card — reused everywhere.
// variant: default | recommended (gradient border)
// rank: undefined | "gold" | "silver" | "bronze"
// score: optional integer match %
const ProgramCard = ({ p, onOpen, onSend, variant, rank, score, badge, lg, withActions }) => {
  const badgeNode = badge ? <span className={"pbadge " + (badge.tone || "")}>{badge.label}</span> : null;
  return (
    <div className={"pcard " + (variant || "") + (lg ? " lg" : "")}
         onClick={() => onOpen && onOpen(p)}>
      <div className="pcard-cover">
        <Cover kind={p.cover}/>
        <div className="pcard-badges">
          <span className={"pbadge " + (p.b2 === "B2C" ? "b2c" : "b2b")}>{p.b2}</span>
          {badgeNode}
        </div>
        {rank && (
          <div className={"match-rank " + rank}>
            {rank === "gold" ? "1" : rank === "silver" ? "2" : "3"}
          </div>
        )}
        {!rank && (
          <button className="pcard-fav" onClick={(e)=>{e.stopPropagation();}} aria-label="В избранное">
            <Icon n="heart" size={14}/>
          </button>
        )}
        {score && (
          <div className="match-score"><span className="dot"/> Совпадение {score}%</div>
        )}
      </div>
      <div className="pcard-body">
        <div className="pcard-title">{p.title}</div>
        <div className="pcard-sub">{p.sub}</div>
        <div className="pcard-tags">
          <span className="ptag purple">{p.category}</span>
          <span className="ptag">{p.age} лет</span>
          <span className="ptag">{p.duration}</span>
        </div>
        {withActions ? (
          <div className="pcard-actions" onClick={(e)=>e.stopPropagation()}>
            <button className="btn btn-outline" onClick={() => onOpen && onOpen(p)}>Открыть</button>
            <button className="btn btn-primary" onClick={() => onSend && onSend(p)}>
              <Icon n="send" size={14}/> Отправить
            </button>
          </div>
        ) : (
          <div className="pcard-foot">
            <div className="pcard-price"><small>от</small>{formatPrice(p.price)}</div>
            <div className="pcard-cta">Открыть <Icon n="chevron-right" size={14}/></div>
          </div>
        )}
      </div>
    </div>
  );
};

window.Sidebar = Sidebar;
window.ProgramCard = ProgramCard;
