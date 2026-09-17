export function cartReducer(state, action) {
  switch (action.type) {
    case "add": {
      const p = action.product;
      const old = state.find((i) => i.id === p.id);
      const quantity = (old?.quantity ?? 0) + action.quantity;
      if (
        !Number.isInteger(action.quantity) ||
        action.quantity < 1 ||
        quantity > p.stock
      )
        return state;
      return old
        ? state.map((i) => (i.id === p.id ? { ...p, quantity } : i))
        : [...state, { ...p, quantity }];
    }
    case "quantity":
      return state.map((p) =>
        p.id === action.id &&
        Number.isInteger(action.quantity) &&
        action.quantity >= 1 &&
        action.quantity <= p.stock
          ? { ...p, quantity: action.quantity }
          : p,
      );
    case "remove":
      return state.filter((p) => p.id !== action.id);
    case "clear":
      return [];
    default:
      return state;
  }
}
export function restoreCart() {
  try {
    const value = JSON.parse(localStorage.getItem("purple-cart-usd") ?? "[]");
    return Array.isArray(value)
      ? value.filter(
          (p) =>
            typeof p.id === "string" &&
            typeof p.name === "string" &&
            Number.isFinite(p.price) &&
            p.price >= 0 &&
            Number.isInteger(p.stock) &&
            Number.isInteger(p.quantity) &&
            p.quantity > 0 &&
            p.quantity <= p.stock,
        )
      : [];
  } catch {
    return [];
  }
}
