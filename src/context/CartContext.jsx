import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { cartReducer, restoreCart } from "./cartReducer";
const CartContext = createContext(null);
export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, undefined, restoreCart);
  useEffect(() => {
    try {
      localStorage.setItem("purple-cart-usd", JSON.stringify(cart));
    } catch {
      /* Shopping remains available without persistence. */
    }
  }, [cart]);
  const value = useMemo(
    () => ({
      cart,
      dispatch,
      count: cart.reduce((n, p) => n + p.quantity, 0),
      total: cart.reduce((n, p) => n + p.price * p.quantity, 0),
    }),
    [cart],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export const useCart = () => useContext(CartContext);
