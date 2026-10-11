import "./style.css";
// v1.1 - Auth & Account update
import { route, startRouter, navigate } from "./router.js";
import { renderNavbar, initNavbar, bindNavbarGlobalListeners } from "./components/navbar.js";
import { renderFooter } from "./components/footer.js";
import { renderCartDrawer, initCartDrawer } from "./components/cart.js";
import { renderHome } from "./pages/home.js";
import { renderCatalog } from "./pages/catalog.js";
import { renderProduct } from "./pages/product.js";
import { renderLogin } from "./pages/login.js";
import { renderCheckout } from "./pages/checkout.js";
import { renderCheckoutResult } from "./pages/checkout-result.js";
import { renderAccount } from "./pages/account.js";
import { api } from "./api.js";
import { initTheme } from "./theme.js";

export const store = {
    user: null,
};

// Re-renderiza solo el navbar y el drawer del carrito. Nunca toca el <main>,
// así la página actual conserva su DOM, sus listeners y sus timers.
export function refreshApp() {
    const navbarRoot = document.getElementById("navbar-root");
    const cartRoot = document.getElementById("cart-root");
    if (!navbarRoot || !cartRoot) return;

    navbarRoot.innerHTML = renderNavbar();
    cartRoot.innerHTML = renderCartDrawer();

    initNavbar(navbarRoot);
    initCartDrawer(cartRoot);

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            try {
                await api.logout();
            } catch {}
            store.user = null;
            refreshApp();
            navigate("/");
        });
    }
}

async function init() {
    initTheme();
    try {
        const user = await api.getMe();
        store.user = user;
    } catch {}

    route("/", renderHome);
    route("/catalog", renderCatalog);
    route("/product/:id", renderProduct);
    route("/login", renderLogin);
    route("/account", renderAccount);
    route("/checkout", renderCheckout);
    route("/checkout/result", renderCheckoutResult);

    const app = document.getElementById("app");
    app.innerHTML = `
        <div id="navbar-root"></div>
        <main></main>
        <div id="cart-root"></div>
        ${renderFooter()}
    `;

    document.querySelectorAll("footer [data-link]").forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            navigate(link.dataset.link);
        });
    });

    bindNavbarGlobalListeners();
    refreshApp();

    startRouter();
}

init();
