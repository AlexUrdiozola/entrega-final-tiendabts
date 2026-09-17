import { useState } from "react";
export default function ItemCount({ stock, onAdd }) {
  const [quantity, setQuantity] = useState(1);
  const valid =
    Number.isInteger(quantity) && quantity >= 1 && quantity <= stock;
  if (stock <= 0)
    return <p className="stock-empty">Producto sin stock disponible.</p>;
  return (
    <div className="count-area">
      <div className="quantity">
        <button
          aria-label="Disminuir cantidad"
          disabled={quantity <= 1}
          onClick={() => setQuantity((q) => q - 1)}
        >
          −
        </button>
        <input
          aria-label="Cantidad"
          type="number"
          min="1"
          max={stock}
          step="1"
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
        <button
          aria-label="Aumentar cantidad"
          disabled={quantity >= stock}
          onClick={() => setQuantity((q) => Number(q) + 1)}
        >
          +
        </button>
      </div>
      <button
        className="button"
        disabled={!valid}
        onClick={() => onAdd(quantity)}
      >
        Agregar al carrito →
      </button>
      {!valid && (
        <p role="alert">Elige una cantidad entera entre 1 y {stock}.</p>
      )}
    </div>
  );
}
