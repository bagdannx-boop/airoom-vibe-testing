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

const nav = (active) => [
  { href: "#/", label: "Новости", active: active === "/" },
  { href: "#/styleguide", label: "Стиль", active: active === "/styleguide" },
];

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

function renderHome() {
  const published = project.news.filter((item) => item.status === "published");

  renderShell({
    title: `${project.name} — ${project.title}`,
    brand: project.name,
    nav: nav("/"),
    content: `
      <section class="hero">
        <div class="container hero-grid">
          <div>
            <p class="eyebrow">${escapeHtml(project.eyebrow)}</p>
            <h1>${escapeHtml(project.title)}</h1>
            <p class="lead">${escapeHtml(project.lead)}</p>
            <div class="actions">
              <a class="button" href="${escapeHtml(project.telegramUrl)}" target="_blank" rel="noopener" data-tg-link>Перейти в Telegram</a>
            </div>
          </div>
          <aside class="panel">
            <p class="eyebrow">Канал</p>
            <h2 style="font-size:32px">Xiaomi | HyperOS Updates</h2>
            <p>Полные материалы, подробности и все обновления — только в Telegram.</p>
            <div class="actions" style="margin-top:20px">
              <a class="button" href="${escapeHtml(project.telegramUrl)}" target="_blank" rel="noopener" data-tg-link>Подписаться</a>
            </div>
          </aside>
        </div>
      </section>
      <section class="section section--soft">
        <div class="container">
          <h2>Новости Xiaomi, Redmi, Poco и HyperOS</h2>
          <div class="grid grid-3" style="margin-top:24px">
            ${published.length ? published.map(newsCard).join("") : `
              <div class="empty" style="grid-column:1/-1">
                <h3>Новостей пока нет</h3>
                <p>В Telegram-канале уже есть свежие обновления.</p>
                <div class="actions" style="justify-content:center;margin-top:16px">
                  <a class="button button--small" href="${escapeHtml(project.telegramUrl)}" target="_blank" rel="noopener" data-tg-link>Перейти в Telegram</a>
                </div>
              </div>
            `}
          </div>
        </div>
      </section>
    `,
  });
  wireTelegramLinks();
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
