import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../services/shop";
import ItemDetail from "./ItemDetail";
import { Loader, State } from "./common";
export default function ItemDetailContainer() {
  const { itemId } = useParams();
  const [state, setState] = useState({ loading: true });
  useEffect(() => {
    let active = true;
    setState({ loading: true });
    getProduct(itemId)
      .then((product) => {
        if (active) setState({ product });
      })
      .catch(() => {
        if (active) setState({ error: true });
      });
    return () => {
      active = false;
    };
  }, [itemId]);
  return state.loading ? (
    <Loader />
  ) : state.error ? (
    <State title="No pudimos cargar el producto">
      Comprueba tu conexión e inténtalo nuevamente.
    </State>
  ) : !state.product ? (
    <State title="Producto no encontrado">
      Quizás tu próximo favorito esté en el catálogo.
    </State>
  ) : (
    <ItemDetail key={itemId} product={state.product} />
  );
}
