// Program data, used across screens.
const PROGRAMS = [
  { id: "frost",     title: "Холодное Сердце",      sub: "Тайна кристаллов Эренделла", cover: "ice",       price: 182000, age: "5–12", duration: "1,5 ч", guests: "до 50",  tags: ["сюжетная","КРИО","премиум"], b2: "B2C", category: "Шоу" },
  { id: "wizard",    title: "Школа Магии",          sub: "Тайны волшебных стен",       cover: "arcane",    price: 215000, age: "8–14", duration: "2 ч",   guests: "до 40",  tags: ["сюжетная","квест"],          b2: "B2C", category: "Квесты" },
  { id: "ladybug",   title: "Леди Баг",             sub: "Супергерои Парижа",          cover: "ladybug",   price: 168000, age: "5–10", duration: "1,5 ч", guests: "до 40",  tags: ["сюжетная"],                  b2: "B2C", category: "Шоу" },
  { id: "heroes",    title: "Супергерои",           sub: "Команда Z собирается",       cover: "hero",      price: 196000, age: "5–12", duration: "2 ч",   guests: "до 60",  tags: ["сюжетная","активная"],       b2: "B2C", category: "Шоу" },
  { id: "paper",     title: "Бумажное шоу",         sub: "Тонны конфетти и азарта",    cover: "paper",     price: 78000,  age: "3–10", duration: "45 м",  guests: "до 80",  tags: ["активное"],                  b2: "B2B", category: "Шоу" },
  { id: "tesla",     title: "Тесла шоу",            sub: "Молнии 250 000 вольт",       cover: "tesla",     price: 124000, age: "8+",   duration: "40 м",  guests: "до 100", tags: ["научное","wow"],             b2: "B2B", category: "Шоу" },
  { id: "neon",      title: "Неоновое шоу",         sub: "Светящаяся графика и танец", cover: "neon",      price: 96000,  age: "6+",   duration: "30 м",  guests: "до 200", tags: ["wow"],                       b2: "B2B", category: "Шоу" },
  { id: "cryo",      title: "Крио шоу",             sub: "Облака сухого льда",         cover: "cryo",      price: 72000,  age: "5+",   duration: "20 м",  guests: "до 150", tags: ["wow"],                       b2: "B2B", category: "Шоу" },
  { id: "chem",      title: "Химическое шоу",       sub: "Опыты как у Менделеева",     cover: "chemistry", price: 89000,  age: "6–14", duration: "45 м",  guests: "до 60",  tags: ["научное"],                   b2: "B2C", category: "Шоу" },
  { id: "slime",     title: "Мастер-класс Слаймы",  sub: "Каждый делает свой",         cover: "slime",     price: 38000,  age: "5+",   duration: "1 ч",   guests: "до 30",  tags: ["МК","активное"],             b2: "B2C", category: "Мастер-классы" },
  { id: "fort",      title: "Квест Форт Боярд",     sub: "10 испытаний на команду",    cover: "adventure", price: 112000, age: "10+",  duration: "2 ч",   guests: "до 30",  tags: ["квест","командное"],         b2: "B2B", category: "Квесты" },
  { id: "princess",  title: "Принцессы",            sub: "Бал в королевском зале",     cover: "princess",  price: 174000, age: "4–9",  duration: "1,5 ч", guests: "до 40",  tags: ["сюжетная","премиум"],        b2: "B2C", category: "Шоу" },
  { id: "alice",     title: "Алиса в Стране Чудес", sub: "Безумное чаепитие",          cover: "whimsy",    price: 158000, age: "5–10", duration: "1,5 ч", guests: "до 35",  tags: ["сюжетная"],                  b2: "B2C", category: "Шоу" },
];

const byId = (id) => PROGRAMS.find(p => p.id === id);

const formatPrice = (n) => {
  return n.toLocaleString("ru-RU") + " ₽";
};

const RECENT_IDS = ["frost","wizard","ladybug","heroes"];

const COLLECTIONS = [
  { name: "Выпускной 4 класс «Б»", count: 5, when: "Сегодня 12:00", tone: "purple" },
  { name: "Корпоратив Сбербанк IT", count: 4, when: "Вчера 17:20",  tone: "pink"   },
  { name: "День рождения Миши, 10 лет", count: 6, when: "Вчера 19:30", tone: "amber" },
  { name: "Юбилей компании Альфа",  count: 3, when: "12 мая",      tone: "cyan"   },
];

const UPDATES = [
  { kind: "video", title: "Химическое шоу — новый Reels",   meta: "Сегодня 18:30", color: "purple" },
  { kind: "image", title: "Квест Форт Боярд — обновлены фото", meta: "Вчера 17:00", color: "amber"  },
  { kind: "video", title: "Мастер-класс Слаймы — новое видео", meta: "Вчера 19:30", color: "pink"   },
  { kind: "tag",   title: "Холодное Сердце — обновлён прайс", meta: "21 мая 14:10", color: "cyan"   },
];

const CHIPS = [
  { key: "all",    label: "Все",      ico: "sparkles" },
  { key: "shows",  label: "Шоу",      ico: "wand"     },
  { key: "quests", label: "Квесты",   ico: "puzzle"   },
  { key: "mk",     label: "Мастер-классы", ico: "palette" },
  { key: "b2b",    label: "B2B",      ico: "briefcase"},
  { key: "b2c",    label: "B2C",      ico: "users"    },
  { key: "kids",   label: "Для детей", ico: "baby"    },
  { key: "adults", label: "Для взрослых", ico: "user" },
];

window.PROGRAMS = PROGRAMS;
window.byId = byId;
window.formatPrice = formatPrice;
window.RECENT_IDS = RECENT_IDS;
window.COLLECTIONS = COLLECTIONS;
window.UPDATES = UPDATES;
window.CHIPS = CHIPS;
