// App shell — routing between 4 screens + toast.

const App = () => {
  // route: { name: "home" | "catalog" | "program" | "match" | ..., params: {} }
  const [route, setRoute] = React.useState({ name: "home", params: {} });
  const [toast, setToast] = React.useState(null);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => setToast(null), 2200);
  };

  const go = (name, params = {}) => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setRoute({ name, params });
  };

  const openProgram = (p) => go("program", { programId: p.id });

  // Sidebar routes — many redirect home with a toast.
  const onNav = (id) => {
    if (id === "home") go("home");
    else if (id === "catalog") go("catalog");
    else if (id === "collections") { go("home"); showToast("Раздел «Мои подборки» — в разработке"); }
    else if (id === "scripts") { go("home"); showToast("Раздел «Скрипты продаж» — в разработке"); }
    else if (id === "prices") { go("home"); showToast("Раздел «Прайсы и КП» — в разработке"); }
    else if (id === "media") { go("home"); showToast("Раздел «Медиа» — в разработке"); }
    else if (id === "favs") { go("home"); showToast("Раздел «Избранное» — в разработке"); }
  };

  // Map screen → sidebar active key
  const sbActive = (() => {
    if (route.name === "home") return "home";
    if (route.name === "catalog") return "catalog";
    if (route.name === "program") return "catalog";
    if (route.name === "match") return "home";
    return route.name;
  })();

  let screenEl = null;
  if (route.name === "home")    screenEl = <Dashboard go={go} openProgram={openProgram} toast={showToast}/>;
  if (route.name === "catalog") screenEl = <Catalog   go={go} openProgram={openProgram} toast={showToast}/>;
  if (route.name === "program") screenEl = <Program   programId={route.params.programId} go={go} openProgram={openProgram} toast={showToast}/>;
  if (route.name === "match")   screenEl = <Match     filters={route.params.filters} go={go} openProgram={openProgram} toast={showToast}/>;

  // Tweak panel
  const [t, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "primary":      "#7c3aed",
    "accent":       "#ec4899",
    "sidebarTheme": "dark",
    "fontHeading":  "Manrope",
    "cardRadius":   16
  }/*EDITMODE-END*/);

  // Apply tweaks via CSS vars
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--purple", t.primary);
    root.style.setProperty("--pink",   t.accent);
    root.style.setProperty("--grad-cta", `linear-gradient(135deg, ${t.primary} 0%, ${t.accent} 100%)`);
    root.style.setProperty("--shadow-cta", `0 8px 24px ${t.primary}59`);
    root.style.setProperty("--r-lg", t.cardRadius + "px");
    if (t.sidebarTheme === "light") {
      root.style.setProperty("--sidebar-bg",      "#f4f4f7");
      root.style.setProperty("--sidebar-bg-2",    "#e9e9ef");
      root.style.setProperty("--sidebar-hover",   "#e1e1eb");
      root.style.setProperty("--sidebar-text",    "#4d4d5c");
      root.style.setProperty("--sidebar-text-dim","#8a8a99");
    } else {
      root.style.setProperty("--sidebar-bg",      "#1a1a26");
      root.style.setProperty("--sidebar-bg-2",    "#22222f");
      root.style.setProperty("--sidebar-hover",   "#2a2a3a");
      root.style.setProperty("--sidebar-text",    "#b7b7c2");
      root.style.setProperty("--sidebar-text-dim","#71717f");
    }
    document.body.style.fontFamily = `'${t.fontHeading}', system-ui, sans-serif`;
  }, [t.primary, t.accent, t.sidebarTheme, t.fontHeading, t.cardRadius]);

  return (
    <div className="app">
      <Sidebar active={sbActive} onNav={onNav}/>
      <main style={{minHeight: "100vh"}}>
        {screenEl}
      </main>

      <div className={"toast " + (toast ? "show" : "")}>
        <span className="check"><Icon n="check" size={12}/></span>
        {toast}
      </div>

      <TweaksPanel title="Tweaks · Е-Праздник">
        <TweakSection label="Бренд">
          <TweakColor
            label="Основной"
            value={t.primary}
            options={["#7c3aed","#2563eb","#0891b2","#059669"]}
            onChange={(v) => setTweak("primary", v)}/>
          <TweakColor
            label="Акцент"
            value={t.accent}
            options={["#ec4899","#f59e0b","#f43f5e","#8b5cf6"]}
            onChange={(v) => setTweak("accent", v)}/>
        </TweakSection>
        <TweakSection label="Интерфейс">
          <TweakRadio
            label="Сайдбар"
            value={t.sidebarTheme}
            options={[{value:"dark", label:"Тёмный"},{value:"light", label:"Светлый"}]}
            onChange={(v) => setTweak("sidebarTheme", v)}/>
          <TweakSelect
            label="Шрифт"
            value={t.fontHeading}
            options={[
              {value:"Manrope",            label:"Manrope"},
              {value:"Plus Jakarta Sans",  label:"Plus Jakarta Sans"},
              {value:"Onest",              label:"Onest"},
            ]}
            onChange={(v) => setTweak("fontHeading", v)}/>
          <TweakSlider
            label="Радиус карточек" min={4} max={24} step={1}
            value={t.cardRadius}
            onChange={(v) => setTweak("cardRadius", v)}/>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
