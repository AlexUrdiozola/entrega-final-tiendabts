import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { money, ProductImage, State } from "./common";
export function CartItem({ product, dispatch }) {
  return (
    <article className="cart-item">
      <Link to={`/item/${product.id}`}>
        <ProductImage product={product} />
      </Link>
      <div>
        <h3>
          <Link to={`/item/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="muted">{money(product.price)} USD / unidad</p>
        <div className="quantity">
          <button
            aria-label={`Quitar una unidad de ${product.name}`}
            disabled={product.quantity <= 1}
            onClick={() =>
              dispatch({
                type: "quantity",
                id: product.id,
                quantity: product.quantity - 1,
              })
            }
          >
            −
          </button>
          <span>{product.quantity}</span>
          <button
            aria-label={`Sumar una unidad de ${product.name}`}
            disabled={product.quantity >= product.stock}
            onClick={() =>
              dispatch({
                type: "quantity",
                id: product.id,
                quantity: product.quantity + 1,
              })
            }
          >
            +
          </button>
        </div>
      </div>
      <div className="cart-item-end">
        <strong>{money(product.price * product.quantity)}</strong>
        <button
          className="icon-button"
          aria-label={`Eliminar ${product.name}`}
          onClick={() => dispatch({ type: "remove", id: product.id })}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </article>
  );
}
export function OrderSummary({ children }) {
  const { total, count } = useCart();
  return (
    <aside className="summary">
      <h2>Tu selección</h2>
      <p>
        <span>Productos ({count})</span>
        <span>{money(total)}</span>
      </p>
      <p>
        <span>Envío</span>
        <span>No aplica</span>
      </p>
      <div className="summary-total">
        <span>Total</span>
        <strong>
          {money(total)} <small>USD</small>
        </strong>
      </div>
      {children}
      <small>Compra académica · No se realiza ningún cobro.</small>
    </aside>
  );
}
export default function Cart() {
  const { cart, dispatch, count } = useCart();
  if (!cart.length)
    return (
      <State title="Tu carrito espera una historia">
        Todavía no agregaste productos. Encuentra algo que se sienta muy tuyo.
      </State>
    );
  return (
    <main className="page">
      <Link className="back" to="/">
        ← Seguir explorando
      </Link>
      <div className="eyebrow">TU UNIVERSO, A UN PASO</div>
      <h1>
        Mi carrito <span className="muted">({count})</span>
      </h1>
      <div className="cart-layout">
        <div>
          {cart.map((p) => (
            <CartItem key={p.id} product={p} dispatch={dispatch} />
          ))}
          <button
            className="text-link"
            onClick={() => dispatch({ type: "clear" })}
          >
            Vaciar carrito
          </button>
        </div>
        <OrderSummary>
          <Link className="button" to="/checkout">
            Continuar al checkout →
          </Link>
        </OrderSummary>
      </div>
    </main>
  );
}
