import { Link } from "react-router-dom";
export const assetUrl = (path) =>
  path?.startsWith("/") && !path.startsWith("//")
    ? `${import.meta.env.BASE_URL}${path.slice(1)}`
    : path;
export const money = (value) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
export function State({ title, children }) {
  return (
    <section className="state">
      <span className="star">✦</span>
      <h1>{title}</h1>
      <p>{children}</p>
      <Link className="button" to="/">
        Explorar el catálogo →
      </Link>
    </section>
  );
}
export function Loader() {
  return (
    <div role="status" className="loading">
      <span className="spinner" /> Preparando algo especial…
    </div>
  );
}
export function ProductImage({ product, ...props }) {
  return (
    <img
      {...props}
      src={assetUrl(product.image)}
      alt={product.name}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = assetUrl("/img/bts_logo_(2017).png");
      }}
    />
  );
}
