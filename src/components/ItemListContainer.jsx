import { useEffect, useMemo, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { ArrowDown, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { getProducts } from "../services/shop";
import { categories } from "../data/products";
import ItemList from "./ItemList";
import { Loader, assetUrl } from "./common";
export default function ItemListContainer() {
  const { categoryId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getProducts(categoryId)
      .then((data) => {
        if (active) setItems(data);
      })
      .catch(() => {
        if (active)
          setError(
            "No pudimos cargar los productos. Comprueba tu conexión y la configuración de Firestore.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [categoryId, retry]);
  const filtered = useMemo(() => {
    const list = items.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    );
    return sort === "featured"
      ? list
      : list.sort((a, b) =>
          sort === "low" ? a.price - b.price : b.price - a.price,
        );
  }, [items, search, sort]);
  return (
    <>
      {!categoryId && (
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span /> THE PURPLE COLLECTION
            </div>
            <h1>
              Tu música.
              <br />
              Tu historia.
              <br />
              <em>Tu universo.</em>
            </h1>
            <p>
              Un pedacito de BTS, siempre contigo.
              <br />
              Encuentra tu próximo recuerdo favorito.
            </p>
            <button
              className="button light"
              onClick={() =>
                document.getElementById("catalog")?.scrollIntoView()
              }
            >
              Explorar colección <ArrowDown size={17} />
            </button>
            <div className="hero-bottom">
              <span>방탄소년단</span>
              <span>EST. 2013 · FOREVER WITH ARMY</span>
            </div>
          </div>
          <div className="hero-photo">
            <img
              src={assetUrl("/img/bts-foto-2.webp")}
              alt="Los siete integrantes de BTS"
            />
            <span className="photo-label">
              BTS <small>BEYOND THE SCENE</small>
            </span>
            <span className="photo-note">
              OUR MOST BEAUTIFUL MOMENT <span>↗</span>
            </span>
          </div>
        </section>
      )}
      <div className="values">
        <span>
          <Sparkles size={16} /> Hecho para tu universo ARMY
        </span>
        <span>Álbumes que cuentan historias</span>
        <span>Recuerdos que se quedan contigo ♡</span>
      </div>
      <main id="catalog" className="catalog">
        <div className="section-heading">
          <div className="eyebrow">ENCUENTRA TU FAVORITO</div>
          <div className="title-row">
            <h2>
              {categories.find((c) => c.id === categoryId)?.name ??
                "Pequeñas cosas. Gran conexión."}
            </h2>
            <span className="muted">{filtered.length} productos</span>
          </div>
          <p>Para escuchar, coleccionar y llevar un poco de ellos contigo.</p>
        </div>
        <div className="catalog-tools">
          <div className="category-tabs">
            <NavLink to="/" end>
              Todo
            </NavLink>
            {categories.map((c) => (
              <NavLink key={c.id} to={`/category/${c.id}`}>
                {c.name}
              </NavLink>
            ))}
          </div>
          <div className="filters">
            <label className="search">
              <Search size={16} />
              <input
                aria-label="Buscar productos"
                placeholder="Busca tu favorito"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <label className="sort">
              <SlidersHorizontal size={16} />
              <select
                aria-label="Ordenar productos"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="featured">Destacados</option>
                <option value="low">Menor precio</option>
                <option value="high">Mayor precio</option>
              </select>
            </label>
          </div>
        </div>
        {loading ? (
          <Loader />
        ) : error ? (
          <div role="alert" className="state">
            <p>{error}</p>
            <button onClick={() => setRetry((r) => r + 1)}>Reintentar</button>
          </div>
        ) : filtered.length ? (
          <ItemList products={filtered} />
        ) : (
          <div className="state">
            <h2>No encontramos productos</h2>
            <p>Prueba otra búsqueda o categoría.</p>
            <button onClick={() => setSearch("")}>Limpiar búsqueda</button>
          </div>
        )}
        <div className="collection-note">
          <span>보라해</span>
          <div>
            <h3>Más que una colección, una conexión.</h3>
            <p>Los recuerdos más lindos también se pueden guardar.</p>
          </div>
          <span className="note-star" aria-hidden="true">
            💜
          </span>
        </div>
      </main>
    </>
  );
}
