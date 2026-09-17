import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { money, ProductImage } from "./common";
import { categories } from "../data/products";
export function Item({ product }) {
  return (
    <article className="product">
      <Link
        to={`/item/${product.id}`}
        className={`product-image ${product.category}`}
      >
        <span className={`badge ${!product.stock ? "sold" : ""}`}>
          {product.badge}
        </span>
        <ProductImage product={product} loading="lazy" />
        <span className="image-action" aria-hidden="true">
          <ArrowUpRight size={20} />
        </span>
      </Link>
      <div className="product-meta">
        {categories.find((c) => c.id === product.category)?.name}{" "}
        <span>BTS</span>
      </div>
      <h3>
        <Link to={`/item/${product.id}`}>{product.name}</Link>
      </h3>
      <div className="price-line">
        <strong>
          {money(product.price)} <small>USD</small>
        </strong>
        <span>{product.stock ? "Ver detalle →" : "Sin stock"}</span>
      </div>
    </article>
  );
}
export default function ItemList({ products }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <Item key={product.id} product={product} />
      ))}
    </div>
  );
}
