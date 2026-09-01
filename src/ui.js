export function qs(selector, root = document) {
  return root.querySelector(selector);
}

export function qsa(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

export function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);
}

export function formatNewsDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "long" }).format(new Date(`${value}T12:00:00`));
}

export function renderShell({ title, nav, content, brand = "HyperOS Updates" }) {
  document.title = title;
  const root = qs("#app");
  root.innerHTML = `
    <header class="site-header">
      <a class="brand" href="#/">
        <img src="./src/assets/logo-64.png" alt="" width="32" height="32" class="brand-logo">
        ${escapeHtml(brand)}
      </a>
      <nav class="nav" aria-label="Главная навигация">
        ${nav.map((item) => `<a href="${item.href}" ${item.active ? 'aria-current="page"' : ""}>${escapeHtml(item.label)}</a>`).join("")}
      </nav>
    </header>
    <main id="main">${content}</main>
    <footer class="site-footer">
      <span>Xiaomi | HyperOS Updates</span>
      <a href="#/styleguide">Стиль проекта</a>
    </footer>
    <div id="global-notice" class="notice" hidden role="status" aria-live="polite"></div>
  `;
}

export function setNotice(message, type = "success") {
  const node = qs("#global-notice");
  if (!node) return;
  node.textContent = message;
  node.className = `notice notice--${type}`;
  node.hidden = false;
  window.clearTimeout(window.__aircNoticeTimer);
  window.__aircNoticeTimer = window.setTimeout(() => {
    node.hidden = true;
  }, 3000);
}

export function route() {
  const hash = location.hash.replace(/^#/, "") || "/";
  return hash.split("?")[0];
}

export function onRouteChange(callback) {
  addEventListener("hashchange", callback);
  callback();
}

