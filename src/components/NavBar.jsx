import { NavLink, Link } from "react-router-dom";
import { ShoppingBag, ArrowUpRight } from "lucide-react";
import { useCart } from "../context/CartContext";
export function CartWidget() {
  const { count } = useCart();
  return (
    <NavLink
      to="/cart"
      className="cart-widget"
      aria-label={`Carrito, ${count} unidades`}
    >
      <ShoppingBag size={21} />
      <span className="cart-label">Mi carrito</span>
      <span className="cart-badge">{count}</span>
    </NavLink>
  );
}
export default function NavBar() {
  return (
    <>
      <div className="announcement">
        De ARMY, para ARMY <span>✦</span> Un pequeño universo de BTS
      </div>
      <header>
        <nav aria-label="Navegación principal">
          <Link className="brand" to="/">
            <span className="bts-mark">
              <i />
              <i />
            </span>
            <span>
              PURPLE<span className="brand-light">SHOP</span>
              <small>BTS FAN COLLECTION</small>
            </span>
          </Link>
          <div className="nav-links">
            <NavLink to="/" end>
              Catálogo
            </NavLink>
            <NavLink to="/category/albums">Álbumes</NavLink>
            <NavLink to="/category/lightsticks">Light sticks</NavLink>
            <NavLink to="/category/collectibles">Coleccionables</NavLink>
          </div>
          <CartWidget />
        </nav>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer>
      <div>
        <Link to="/" className="footer-brand">
          PURPLE SHOP <span aria-hidden="true">💜</span>
        </Link>
        <p>Siete artistas. Millones de historias. Un mismo amor.</p>
      </div>
      <div>
        <a
          href="https://shop.weverse.io/es/shop/MXN/artists/2/categories/175"
          target="_blank"
          rel="noreferrer"
        >
          Descubrir Weverse <ArrowUpRight size={14} />
        </a>
        <small>
          Proyecto académico fan · Sin afiliación con BTS o Weverse.
          <br />
          Precios y stock ilustrativos. No se procesan pagos.
        </small>
      </div>
    </footer>
  );
}
