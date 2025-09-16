class AppSidebar extends HTMLElement {
  constructor() {
    super();
    this.currentPage = "dashboard";
  }

  static ensureGlobalStyles() {
    if (!document.getElementById("sidebar-global-styles")) {
      const style = document.createElement("style");
      style.id = "sidebar-global-styles";
      style.textContent = `
        app-sidebar { width: 250px; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border-right:1px solid var(--border-color); padding:20px 0; display:flex; flex-direction:column; }
        app-sidebar .logo { padding:0 20px 30px; text-align:center; }
        app-sidebar .logo h1 { color: var(--primary-color); font-size:24px; font-weight:700; }
        app-sidebar .nav-menu { flex:1; }
        app-sidebar .nav-item { display:flex; align-items:center; padding:12px 20px; color:var(--text-secondary); text-decoration:none; transition:all 0.3s ease; border-left:3px solid transparent; cursor:pointer; }
        app-sidebar .nav-item:hover, app-sidebar .nav-item.active { background: rgba(59,130,246,0.1); color: var(--primary-color); border-left-color: var(--primary-color); }
        app-sidebar .nav-item i { margin-right:12px; width:20px; font-size:18px; }
        app-sidebar .icon-dashboard::before { content:"📊"; }
        app-sidebar .icon-invoice::before { content:"📄"; }
        app-sidebar .icon-customers::before { content:"👥"; }
        app-sidebar .icon-products::before { content:"📦"; }
        app-sidebar .icon-reports::before { content:"📈"; }
        app-sidebar .icon-settings::before { content:"⚙️"; }
        app-sidebar .icon-offers::before { content:"💼"; }
        app-sidebar .icon-orders::before { content:"🛒"; }
        app-sidebar .icon-signup::before { content:"📝"; }
        app-sidebar .icon-info::before { content:"ℹ️"; }
        @media (max-width:768px){ app-sidebar{ width:200px; } }
      `;
      document.head.appendChild(style);
    }
  }

  analyzePath() {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split("/");
    const pagesIndex = pathParts.indexOf("pages");

    if (pagesIndex === -1) {
      return "Ana dizin";
    } else if (pagesIndex === pathParts.length - 2) {
      return "Pages klasörü";
    } else {
      return `Pages alt klasörü (${pathParts[pagesIndex + 1]})`;
    }
  }

  resolveHref(href) {
    const currentPath = window.location.pathname;
    if (href === "index.html") {
      if (currentPath.includes("/pages/")) {
        // pages klasöründen ana dizine git
        const depth = (currentPath.match(/\/pages\/[^\/]+/g) || []).length;
        return depth > 1 ? "../../index.html" : "../index.html";
      } else {
        return "index.html";
      }
    }

    if (href.startsWith("pages/")) {
      const targetFile = href.replace("pages/", "");

      if (currentPath.includes("/pages/")) {
        const pathParts = currentPath.split("/");
        const pagesIndex = pathParts.indexOf("pages");

        if (pagesIndex !== -1 && pagesIndex < pathParts.length - 2) {
          return "../" + targetFile;
        } else {
          return targetFile;
        }
      } else {
        return href;
      }
    }

    return href;
  }

  connectedCallback() {
    AppSidebar.ensureGlobalStyles();

    this.innerHTML = `
      <div class="logo"><h1>BillPro</h1></div>
      <nav class="nav-menu">
        <div class="nav-item" data-page="dashboard" data-href="index.html"><i class="icon-dashboard"></i> Dashboard</div>
        <div class="nav-item" data-page="invoices" data-href="pages/invoices.html"><i class="icon-invoice"></i> Invoices</div>
        <div class="nav-item" data-page="customers" data-href="pages/customers/index.html"><i class="icon-customers"></i> Customers</div>
        <div class="nav-item" data-page="offers" data-href="pages/offers.html"><i class="icon-offers"></i> Offers</div>
        <div class="nav-item" data-page="orders" data-href="pages/orders.html"><i class="icon-orders"></i> Orders</div>
        <div class="nav-item" data-page="reports" data-href="pages/reports.html"><i class="icon-reports"></i> Reports</div>
        <div class="nav-item" data-page="settings" data-href="pages/settings.html"><i class="icon-settings"></i> Settings</div>
        <div class="nav-item" data-page="tseregister" data-href="pages/tseRegister.html"><i class="icon-signup"></i> TSE Register</div>
        <div class="nav-item" data-page="about" data-href="pages/about.html"><i class="icon-info"></i> About</div>
      </nav>
    `;

    this.addEventListener("click", (ev) => {
      const item = ev.target.closest(".nav-item");
      if (!item) return;
      this.setActivePage(item.dataset.page);
      const href = item.dataset.href;
      if (href) {
        const resolvedHref = this.resolveHref(href);

        console.log(`Original href: ${href}`);
        console.log(`Current path: ${window.location.pathname}`);
        console.log(`Path analysis: ${this.analyzePath()}`);
        console.log(`Resolved href: ${resolvedHref}`);

        window.location.href = resolvedHref;
      }
    });

    this.setActivePage();
  }

  setActivePage(page) {
    const navItems = Array.from(this.querySelectorAll(".nav-item"));
    navItems.forEach((it) => it.classList.remove("active"));

    if (page) {
      const active = this.querySelector(`.nav-item[data-page="${page}"]`);
      if (active) {
        active.classList.add("active");
        this.currentPage = page;
      }
      return;
    }
    const currentPath = window.location.pathname.toLowerCase();

    if (currentPath.includes("index.html") || currentPath.endsWith("/")) {
      const dashboardItem = this.querySelector(
        '.nav-item[data-page="dashboard"]'
      );
      if (dashboardItem) {
        dashboardItem.classList.add("active");
        this.currentPage = "dashboard";
      }
      return;
    }
    navItems.forEach((item) => {
      const href = item.dataset.href;
      const page = item.dataset.page;

      if (href) {
        const fileName = href.split("/").pop().toLowerCase();
        const pageFileName = fileName.replace(".html", "");
        if (
          currentPath.includes(pageFileName) ||
          currentPath.includes(fileName)
        ) {
          item.classList.add("active");
          this.currentPage = page;
        }
      }
    });
  }
}

customElements.define("app-sidebar", AppSidebar);
