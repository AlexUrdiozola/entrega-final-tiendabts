import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import NavBar, { Footer } from "./components/NavBar";
import ItemListContainer from "./components/ItemListContainer";
import ItemDetailContainer from "./components/ItemDetailContainer";
import Cart from "./components/Cart";
import CheckoutForm from "./components/CheckoutForm";
import { State } from "./components/common";
import { isDemo } from "./services/firebase";
export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Purple Shop · BTS";
  }, [pathname]);
  return (
    <>
      <a
        className="skip-link"
        href="#content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("content")?.focus();
        }}
      >
        Saltar al contenido
      </a>
      <NavBar />
      <div id="content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<ItemListContainer />} />
          <Route path="/category/:categoryId" element={<ItemListContainer />} />
          <Route path="/item/:itemId" element={<ItemDetailContainer />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckoutForm />} />
          <Route
            path="*"
            element={
              <State title="Esta página no está en nuestro universo">
                Volvamos a la colección.
              </State>
            }
          />
        </Routes>
      </div>
      <div className="demo-note">
        {isDemo
          ? "Modo demostración · Las compras no se guardan en la nube."
          : "Catálogo conectado a Firebase · Compras académicas sin cobros."}
      </div>
      <Footer />
    </>
  );
}
