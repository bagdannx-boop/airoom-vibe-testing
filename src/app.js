import { project } from "./project.js";
import {
  escapeHtml,
  formatNewsDate,
  onRouteChange,
  renderShell,
  route,
} from "./ui.js";
import { renderStyleguide } from "./styleguide.js";

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
        <a class="button button--small" href="${escapeHtml(project.telegramUrl)}" target="_blank" rel="noopener">Перейти в Telegram</a>
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
              <a class="button" href="${escapeHtml(project.telegramUrl)}" target="_blank" rel="noopener">Перейти в Telegram</a>
            </div>
          </div>
          <aside class="panel">
            <p class="eyebrow">Канал</p>
            <h2 style="font-size:32px">Xiaomi | HyperOS Updates</h2>
            <p>Полные материалы, подробности и все обновления — только в Telegram.</p>
            <div class="actions" style="margin-top:20px">
              <a class="button" href="${escapeHtml(project.telegramUrl)}" target="_blank" rel="noopener">Подписаться</a>
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
                <p>Загляни в Telegram-канал — там уже есть свежие обновления.</p>
              </div>
            `}
          </div>
        </div>
      </section>
    `,
  });
}

async function render() {
  const current = route();
  if (current === "/styleguide") return renderStyleguide();
  return renderHome();
}

onRouteChange(() => {
  render().catch((error) => {
    console.error(error);
  });
});
