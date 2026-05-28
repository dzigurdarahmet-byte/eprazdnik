// Screen 4: Match results — AI recommendation

const Match = ({ filters, go, openProgram, toast }) => {
  const f = filters || { type: "Детский праздник", age: "8–12", guests: "20–40", budget: "50–100к ₽" };

  // Top 3 picks
  const top = [byId("frost"), byId("wizard"), byId("princess")];
  // More candidates
  const more = ["heroes","ladybug","alice","slime","fort","chem"].map(byId);

  return (
    <div className="main page-enter">
      <div className="hero-row" style={{marginBottom: 16}}>
        <div>
          <h1 className="page-title">AI-подбор готов</h1>
          <div className="page-sub">3 идеальных совпадения · ещё {more.length} подходят почти так же.</div>
        </div>
        <div className="hero-stats">
          <Icon n="zap" size={14} style={{color:"var(--amber)"}}/> Подобрано за <b>5,8 сек</b>
          <span className="dot">·</span>
          <span style={{color:"var(--text-3)"}}>проверено 86 программ</span>
        </div>
      </div>

      <div className="recap">
        <span className="recap-label">Подбор для:</span>
        {[
          ["Тип",     f.type],
          ["Возраст", f.age + " лет"],
          ["Гостей",  f.guests],
          ["Бюджет",  f.budget],
        ].map(([k, v], i) => (
          <span className="recap-chip" key={i}>
            <b style={{fontWeight: 700}}>{k}:</b> {v}
            <button aria-label="убрать"><Icon n="x" size={10}/></button>
          </span>
        ))}
        <button className="recap-edit" onClick={() => go("home")}>
          <Icon n="settings" size={13}/> Изменить фильтры
        </button>
      </div>

      <div className="ai-card">
        <div className="ai-avatar">
          <Icon n="sparkles" size={26}/>
        </div>
        <div className="ai-content">
          <div className="ai-eyebrow"><Icon n="sparkles" size={11}/> AI-помощник</div>
          <div className="ai-title">Под Ваш запрос идеально подходят 3 программы</div>
          <div className="ai-text">
            Все три попадают в бюджет 50–100к с возможностью апсейла до 200к.
            «Холодное Сердце» — лучший матч: возраст, формат и наличие крио-усиления
            закрывают запрос «премиум на 4 класс».
          </div>
        </div>
        <div className="ai-stat">
          <div className="ai-stat-num">94%</div>
          <div className="ai-stat-label">Точность подбора</div>
        </div>
      </div>

      <div className="cards-grid-3" style={{marginBottom: 36}}>
        <ProgramCard p={top[0]} variant="recommended" rank="gold"   score={94}
                     badge={{label:"🏆 Лучший матч", tone:"best"}}
                     onOpen={openProgram} onSend={()=>toast("Отправлено клиенту")}
                     withActions lg/>
        <ProgramCard p={top[1]} variant="recommended" rank="silver" score={88}
                     badge={{label:"📚 Сюжетная", tone:"story"}}
                     onOpen={openProgram} onSend={()=>toast("Отправлено клиенту")}
                     withActions lg/>
        <ProgramCard p={top[2]} variant="recommended" rank="bronze" score={81}
                     badge={{label:"✨ Премиум", tone:"premium"}}
                     onOpen={openProgram} onSend={()=>toast("Отправлено клиенту")}
                     withActions lg/>
      </div>

      <div className="sec-head">
        <div className="sec-title">
          <span className="ico"><Icon n="sparkles" size={18}/></span>
          Ещё подходящие
          <span style={{fontSize:12, fontWeight:600, color:"var(--text-3)", marginLeft: 4}}>
            совпадение 60–75%
          </span>
        </div>
        <a className="sec-link" onClick={() => go("catalog")}>
          Весь каталог <Icon n="arrow-right" size={13}/>
        </a>
      </div>
      <div className="cards-grid">
        {more.map(p => (
          <ProgramCard key={p.id} p={p} onOpen={openProgram}/>
        ))}
      </div>

      <div className="cta-banner" style={{marginTop: 36}}>
        <div className="cta-banner-ico" style={{background:"linear-gradient(135deg,#a78bfa,#7c3aed)"}}>
          <Icon n="send" size={24}/>
        </div>
        <div className="cta-banner-content">
          <div className="cta-banner-title">Собрать подборку и отправить клиенту</div>
          <div className="cta-banner-text">
            Сгенерируем PDF с тремя программами, прайсами и Reels — за 1 клик в WhatsApp.
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => toast("Подборка сформирована и отправлена")}>
          <Icon n="send" size={14}/> Отправить тройку клиенту
        </button>
      </div>
    </div>
  );
};

window.Match = Match;
