import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/shop";
import { isDemo } from "../services/firebase";
import { OrderSummary } from "./Cart";
import { money, State } from "./common";
export default function CheckoutForm() {
  const { cart, dispatch } = useCart();
  const [pending, setPending] = useState(false);
  const lock = useRef(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);
  async function submit(event) {
    event.preventDefault();
    if (lock.current) return;
    const data = Object.fromEntries(new FormData(event.currentTarget));
    if (data.email.trim() !== data.confirmEmail.trim()) {
      setError("Los correos electrónicos no coinciden.");
      return;
    }
    lock.current = true;
    setPending(true);
    setError("");
    try {
      const result = await createOrder(data, cart);
      setOrder(result);
      dispatch({ type: "clear" });
    } catch (e) {
      setError(
        e.code
          ? "No se pudo guardar la compra. Revisa tu conexión y los permisos de Firebase. Tu carrito se conserva."
          : e.message,
      );
    } finally {
      setPending(false);
      lock.current = false;
    }
  }
  if (order)
    return (
      <section className="state success">
        <span className="star">♡</span>
        <div className="eyebrow">GRACIAS POR SER PARTE</div>
        <h1>{order.demo ? "¡Simulación completada!" : "¡Orden registrada!"}</h1>
        <p>
          {order.demo
            ? "Esta compra de prueba no se guardó en Firestore."
            : "Tu compra se guardó en Firestore. Conserva el número de orden."}
        </p>
        <div className="order-id">
          <small>{order.demo ? "ID DE DEMOSTRACIÓN" : "ID DE ORDEN"}</small>
          <strong>{order.id}</strong>
          <span>Total: {money(order.total)} USD</span>
        </div>
        <Link className="button" to="/">
          Volver a la colección →
        </Link>
      </section>
    );
  if (!cart.length)
    return (
      <State title="Primero, encuentra tu favorito">
        Agrega productos al carrito para continuar al checkout.
      </State>
    );
  return (
    <main className="page">
      <Link className="back" to="/cart">
        ← Volver al carrito
      </Link>
      <div className="eyebrow">EL ÚLTIMO PASO</div>
      <h1>Un poco más cerca.</h1>
      <div className="cart-layout">
        <form id="checkout" onSubmit={submit} className="checkout">
          <h2>Tus datos</h2>
          <p>Usaremos estos datos para registrar tu orden.</p>
          <fieldset disabled={pending}>
            <label>
              Nombre y apellido
              <input
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
                placeholder="Tu nombre completo"
              />
            </label>
            <label>
              Correo electrónico
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={150}
                placeholder="army@ejemplo.com"
              />
            </label>
            <label>
              Confirmar correo
              <input
                name="confirmEmail"
                type="email"
                autoComplete="off"
                required
                maxLength={150}
                placeholder="Repite tu correo electrónico"
              />
            </label>
            <label>
              Teléfono
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                pattern="[+0-9 ()-]{6,25}"
                maxLength={25}
                placeholder="+52 55 1234 5678"
              />
            </label>
            <label className="consent">
              <input type="checkbox" required />
              Entiendo que esta es una compra académica sin pago ni envío.
            </label>
          </fieldset>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
        </form>
        <OrderSummary>
          <div className="checkout-items">
            {cart.map((p) => (
              <p key={p.id}>
                <span>
                  {p.quantity} × {p.name}
                </span>
                <span>{money(p.price * p.quantity)}</span>
              </p>
            ))}
          </div>
          <button form="checkout" className="button" disabled={pending}>
            {pending
              ? "Guardando orden…"
              : isDemo
                ? "Simular compra →"
                : "Confirmar compra →"}
          </button>
        </OrderSummary>
      </div>
    </main>
  );
}
