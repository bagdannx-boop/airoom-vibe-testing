import { project } from "./project.js";
import {
  escapeHtml,
  formatNewsDate,
  onRouteChange,
  qs,
  qsa,
  renderShell,
  route,
  setNotice,
} from "./ui.js";
import { renderStyleguide } from "./styleguide.js";

function wireTelegramLinks() {
  for (const link of qsa("[data-tg-link]")) {
    link.addEventListener("click", () => {
      setNotice("Открываем Telegram — оттуда переходи в подписку", "success");
    });
  }
}

function wireReveal() {
  const targets = qsa(".reveal, .reveal-stagger");
  if (!targets.length) return;
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.3 });
  for (const target of targets) observer.observe(target);
}

function wireScrollProgress() {
  const bar = qs("#scroll-progress");
  if (!bar) return;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = max > 0 ? `${Math.min(100, (window.scrollY / max) * 100)}%` : "0%";
  };
  update();
  addEventListener("scroll", update, { passive: true });
}

const nav = (active) => [
  { href: "#/", label: "Главная", active: active === "/" },
];

function emptyState(title, text) {
  return `
    <div class="empty" style="grid-column:1/-1">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(text)}</p>
      <div class="actions" style="justify-content:center;margin-top:16px">
        <a class="button button--small" href="${escapeHtml(project.telegramUrl)}" target="_blank" rel="noopener" data-tg-link>Перейти в Telegram</a>
      </div>
    </div>
  `;
}

function newsCard(item) {
  return `
    <article class="card">
      <span class="badge">${escapeHtml(item.category)}</span>
      <h3 style="margin-top:12px">${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.excerpt)}</p>
      <p class="record-meta">${escapeHtml(formatNewsDate(item.date))}</p>
      <div class="actions" style="margin-top:14px">
        <a class="button button--small" href="${escapeHtml(project.telegramUrl)}" target="_blank" rel="noopener" data-tg-link>Перейти в Telegram</a>
      </div>
    </article>
  `;
}

function sceneIntro() {
  return `
    <section class="story-scene story-gradient" id="scene-1">
      <div class="story" style="text-align:center">
        <img src="./src/assets/logo-180.png" alt="" width="96" height="96" class="reveal" style="margin:0 auto 24px;border-radius:22px">
        <p class="story-number reveal">01</p>
        <h1 class="reveal">${escapeHtml(project.mainIdea)}</h1>
        <div class="actions reveal" style="justify-content:center">
          <a class="button" href="${escapeHtml(project.telegramUrl)}" target="_blank" rel="noopener" data-tg-link>Перейти в Telegram</a>
        </div>
        <p class="lead reveal" style="margin-inline:auto">${escapeHtml(project.lead)}</p>
        <div class="scroll-hint reveal" aria-hidden="true">↓</div>
      </div>
    </section>
  `;
}

function sceneNews() {
  const published = project.news.filter((item) => item.status === "published");
  return `
    <section class="section" id="scene-2">
      <div class="container story-wide">
        <p class="story-number reveal">02</p>
        <h2 class="reveal">Последние новости</h2>
        <div class="grid grid-3 reveal-stagger" style="margin-top:24px">
          ${published.length ? published.map(newsCard).join("") : emptyState("Новостей пока нет", "В Telegram-канале уже есть свежие обновления.")}
        </div>
      </div>
    </section>
  `;
}

function sceneDevices() {
  return `
    <section class="section section--soft" id="scene-3">
      <div class="container story-wide">
        <p class="story-number reveal">03</p>
        <h2 class="reveal">Обновления для устройств</h2>
        <p class="lead reveal">${escapeHtml(project.devicesNote)}</p>
        <div class="grid grid-2 reveal-stagger" style="margin-top:24px">
          ${project.devices.length ? project.devices.map((device) => `
            <article class="card">
              <h3>${escapeHtml(device.name)}</h3>
              <p class="muted">${escapeHtml(device.status)}</p>
            </article>
          `).join("") : emptyState("Список пока пуст", "Актуальные устройства и версии — в Telegram-канале.")}
        </div>
      </div>
    </section>
  `;
}

function sceneMaterials() {
  return `
    <section class="section" id="scene-4">
      <div class="container story-wide">
        <p class="story-number reveal">04</p>
        <h2 class="reveal">Полезные материалы</h2>
        <p class="lead reveal">Файлы уже собраны в Telegram-канале.</p>
        <div class="grid grid-3 reveal-stagger" style="margin-top:24px">
          ${project.materials.length ? project.materials.map((material) => `
            <article class="card">
              <h3>${escapeHtml(material.title)}</h3>
              <p class="muted">${escapeHtml(material.description)}</p>
            </article>
          `).join("") : emptyState("Материалов пока нет", "Файлы уже собраны в Telegram-канале.")}
        </div>
      </div>
    </section>
  `;
}

function sceneReasons() {
  return `
    <section class="section section--soft" id="scene-5">
      <div class="container story-wide">
        <p class="story-number reveal">05</p>
        <h2 class="reveal">Почему стоит подписаться</h2>
        <div class="grid grid-3 reveal-stagger" style="margin-top:24px">
          ${project.reasons.length ? project.reasons.map((reason) => `
            <article class="card">
              <h3>${escapeHtml(reason.title)}</h3>
              <p class="muted">${escapeHtml(reason.description)}</p>
            </article>
          `).join("") : emptyState("Скоро здесь появятся причины подписаться", "А пока — просто загляни в канал.")}
        </div>
      </div>
    </section>
  `;
}

function sceneSubscribe() {
  return `
    <section class="story-scene story-gradient--end" id="scene-6">
      <div class="story" style="text-align:center">
        <p class="story-number reveal">06</p>
        <h2 class="reveal">${escapeHtml(project.mainIdea)}</h2>
        <div class="actions reveal" style="justify-content:center">
          <a class="button pulse-button" href="${escapeHtml(project.telegramUrl)}" target="_blank" rel="noopener" data-tg-link>Подписаться</a>
        </div>
      </div>
    </section>
  `;
}

function renderHome() {
  renderShell({
    title: `${project.name} — ${project.mainIdea}`,
    brand: project.name,
    nav: nav("/"),
    content: [sceneIntro(), sceneNews(), sceneDevices(), sceneMaterials(), sceneReasons(), sceneSubscribe()].join(""),
  });
  wireTelegramLinks();
  wireReveal();
  wireScrollProgress();
}

function renderError() {
  renderShell({
    title: `${project.name} — ошибка`,
    brand: project.name,
    nav: nav("/"),
    content: `
      <section class="section">
        <div class="container">
          <div class="empty">
            <h3>Не получилось показать страницу</h3>
            <p>Попробуй ещё раз или перейди сразу в Telegram-канал.</p>
            <div class="actions" style="justify-content:center;margin-top:16px">
              <button id="retry" class="button button--small">Попробовать снова</button>
              <a class="button button--small button--secondary" href="${escapeHtml(project.telegramUrl)}" target="_blank" rel="noopener" data-tg-link>Перейти в Telegram</a>
            </div>
          </div>
        </div>
      </section>
    `,
  });
  qs("#retry")?.addEventListener("click", () => {
    render();
  });
  wireTelegramLinks();
}

function render() {
  try {
    const current = route();
    if (current === "/styleguide") return renderStyleguide();
    return renderHome();
  } catch (error) {
    console.error(error);
    renderError();
  }
}

onRouteChange(render);
