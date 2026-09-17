import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { cartReducer } from "../src/context/cartReducer";
import { CartProvider } from "../src/context/CartContext";
import { prepareOrder } from "../src/services/shop";
import ItemCount from "../src/components/ItemCount";
import App from "../src/App";
const product = { id: "proof", name: "Proof", price: 39.27, stock: 3 };
describe("Límites del carrito", () => {
  it("acumula unidades y rechaza cantidades inválidas o superiores al stock", () => {
    let state = cartReducer([], { type: "add", product, quantity: 2 });
    state = cartReducer(state, { type: "add", product, quantity: 1 });
    expect(state[0].quantity).toBe(3);
    for (const quantity of [1, -1, 0, NaN, 1.5])
      expect(cartReducer(state, { type: "add", product, quantity })).toBe(
        state,
      );
    expect(
      cartReducer(state, { type: "quantity", id: "proof", quantity: 0 })[0]
        .quantity,
    ).toBe(3);
  });
  it("elimina y vacía", () => {
    const cart = [{ ...product, quantity: 1 }];
    expect(cartReducer(cart, { type: "remove", id: "proof" })).toEqual([]);
    expect(cartReducer(cart, { type: "clear" })).toEqual([]);
  });
});
describe("Validación de orden", () => {
  const buyer = {
    name: "Army Test",
    email: "army@example.com",
    phone: "123456789",
  };
  it("usa cantidades y calcula el total", () => {
    expect(
      prepareOrder(buyer, [{ ...product, quantity: 2 }], [product]).total,
    ).toBe(78.54);
  });
  it("rechaza stock agotado y precios obsoletos", () => {
    expect(() =>
      prepareOrder(buyer, [{ ...product, quantity: 4 }], [product]),
    ).toThrow(/Stock/);
    expect(() =>
      prepareOrder(
        buyer,
        [{ ...product, quantity: 1 }],
        [{ ...product, price: 40 }],
      ),
    ).toThrow(/precio/);
  });
});
it("ItemCount bloquea mínimo, máximo, campo vacío y fracciones", async () => {
  const user = userEvent.setup();
  const add = vi.fn();
  render(<ItemCount stock={2} onAdd={add} />);
  expect(
    screen.getByRole("button", { name: "Disminuir cantidad" }),
  ).toBeDisabled();
  await user.click(screen.getByRole("button", { name: "Aumentar cantidad" }));
  expect(
    screen.getByRole("button", { name: "Aumentar cantidad" }),
  ).toBeDisabled();
  await user.clear(screen.getByRole("spinbutton"));
  expect(screen.getByRole("button", { name: /Agregar/ })).toBeDisabled();
  await user.type(screen.getByRole("spinbutton"), "1.5");
  expect(screen.getByRole("button", { name: /Agregar/ })).toBeDisabled();
});
it("completa detalle → carrito → checkout y muestra ID demo sin guardar en Firestore", async () => {
  window.scrollTo = vi.fn();
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={["/item/proof"]}>
      <CartProvider>
        <App />
      </CartProvider>
    </MemoryRouter>,
  );
  await user.click(
    await screen.findByRole("button", { name: /Agregar al carrito/ }),
  );
  expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  await user.click(screen.getByRole("link", { name: /Ir al carrito/ }));
  await user.click(screen.getByRole("link", { name: /Continuar al checkout/ }));
  await user.type(screen.getByLabelText("Nombre y apellido"), "Army Test");
  await user.type(
    screen.getByLabelText("Correo electrónico"),
    "army@example.com",
  );
  await user.type(
    screen.getByLabelText("Confirmar correo"),
    "army@example.com",
  );
  await user.type(screen.getByLabelText("Teléfono"), "123456789");
  await user.click(screen.getByRole("checkbox"));
  await user.click(screen.getByRole("button", { name: /Simular compra/ }));
  await waitFor(() =>
    expect(screen.getByText("¡Simulación completada!")).toBeInTheDocument(),
  );
  expect(screen.getByText(/^DEMO-/)).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Carrito, 0 unidades" }),
  ).toBeInTheDocument();
});
