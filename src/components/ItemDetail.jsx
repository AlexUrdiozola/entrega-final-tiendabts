import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, ArrowUpRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import ItemCount from "./ItemCount";
import { money, ProductImage } from "./common";
export default function ItemDetail({ product }) {
  const { cart, dispatch } = useCart();
  const [added, setAdded] = useState(false);
  const available =
    product.stock - (cart.find((p) => p.id === product.id)?.quantity ?? 0);
  function add(quantity) {
    dispatch({ type: "add", product, quantity });
    setAdded(true);
  }
  return (
    <main className="page">
      <Link className="back" to="/">
        ← Volver al catálogo
      </Link>
      <div className="detail">
        <div className={`detail-image ${product.category}`}>
          <ProductImage product={product} />
        </div>
        <div className="detail-copy">
          <div className="eyebrow">BTS · {product.badge}</div>
          <h1>{product.name}</h1>
          <p className="detail-price">
            {money(product.price)} <small>USD</small>
          </p>
          <p>{product.description}</p>
          <p className="stock">
            {product.stock
              ? `${product.stock} unidades en catálogo`
              : "Agotado por el momento"}
          </p>
          {added ? (
            <div className="added" role="status">
              <p>
                <Check size={18} /> Agregado a tu universo
              </p>
              <Link to="/cart" className="button">
                Ir al carrito →
              </Link>
              <Link className="text-link" to="/">
                Seguir explorando
              </Link>
            </div>
          ) : (
            <ItemCount stock={available} onAdd={add} />
          )}
          <div className="detail-notes">
            <p>♡ Una colección pensada para ARMY.</p>
            <p>Precios y stock de ejemplo. Sin cobros ni envíos reales.</p>
            {product.source ? (
              <a href={product.source} target="_blank" rel="noreferrer">
                Ver producto de referencia en Weverse <ArrowUpRight size={14} />
              </a>
            ) : (
              <p>Diseño conceptual del proyecto académico.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
