class AppSidebar extends HTMLElement {
  constructor() {
    super();
    this.currentPage = "dashboard";
  }

  static ensureGlobalStyles() {
    // Check if global styles already exist
    if (!document.getElementById("sidebar-global-styles")) {
      const style = document.createElement("style");
      style.id = "sidebar-global-styles";
      style.textContent = `
        app-sidebar {
            width: 250px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-right: 1px solid var(--border-color);
            padding: 20px 0;
            display: flex;
            flex-direction: column;
        }
        app-sidebar .logo {
            padding: 0 20px 30px;
            text-align: center;
        }
        app-sidebar .logo h1 {
            color: var(--primary-color);
            font-size: 24px;
            font-weight: 700;
        }
        app-sidebar .nav-menu {
            flex: 1;
        }
        app-sidebar .nav-item{
            display: flex;
            align-items: center;
            padding: 12px 20px;
            color: var(--text-secondary);
            text-decoration: none;
            transition: all 0.3s ease;
            border-left: 3px solid transparent;
            cursor: pointer;
        }
        app-sidebar .nav-item:hover,
        app-sidebar .nav-item.active {
            background: rgba(59, 130, 246, 0.1);
            color: var(--primary-color);
            border-left-color: var(--primary-color);
        }
        app-sidebar .nav-item i {
            margin-right: 12px;
            width: 20px;
            font-size: 18px;
        }
        app-sidebar .icon-dashboard::before { content: "📊"; }
        app-sidebar .icon-invoice::before { content: "📄"; }
        app-sidebar .icon-customers::before { content: "👥"; }
        app-sidebar .icon-products::before { content: "📦"; }
        app-sidebar .icon-reports::before { content: "📈"; }
        app-sidebar .icon-settings::before { content: "⚙️"; }
        @media (max-width: 768px) {
            app-sidebar {
                width: 200px;
            }
        }
    `;
      document.head.appendChild(style);
    }
  }

  connectedCallback() {
    // Ensure global styles are loaded
    AppSidebar.ensureGlobalStyles();

      this.innerHTML = `
    <div class="logo">
        <h1>BillPro</h1>
    </div>
    <nav class="nav-menu">
        <div class="nav-item active" data-page="dashboard" data-href="../index.html">
            <i class="icon-dashboard"></i> Dashboard
        </div>
        <div class="nav-item" data-page="invoices" data-href="pages/invoices.html">
            <i class="icon-invoice"></i> Faturalar
        </div>
        <div class="nav-item" data-page="customers" data-href="pages/customers.html">
            <i class="icon-customers"></i> Müşteriler
        </div>
        <div class="nav-item" data-page="products" data-href="pages/products.html">
            <i class="icon-products"></i> Ürünler
        </div>
        <div class="nav-item" data-page="reports" data-href="pages/reports.html">
            <i class="icon-reports"></i> Raporlar
        </div>
        <div class="nav-item" data-page="settings" data-href="pages/settings.html">
            <i class="icon-settings"></i> Ayarlar
        </div>
    </nav>
  `;

   this.querySelectorAll(".nav-item").forEach((item) => {
     item.addEventListener("click", () => {
       const href = item.getAttribute("data-href");
       if (href) {
         const current = window.location.pathname.split("/").pop();
         const target = href.split("/").pop();
         if (current !== target) {
           window.location.href = href;
         }
       }
     });
   });

  }
  setActivePage(page) {
    this.currentPage = page;
    const navItems = this.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("data-page") === page) {
        item.classList.add("active");
      }
    });
  }
}

customElements.define("app-sidebar", AppSidebar);
