import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db, isDemo, buyerSession } from "./firebase";
import { products } from "../data/products";
const demoStock = new Map(products.map((p) => [p.id, p.stock]));
function database() {
  if (!db)
    throw new Error(
      "Configura Firebase en .env.local para cargar el catálogo.",
    );
  return db;
}
export async function getProducts(category) {
  if (isDemo)
    return products
      .filter((p) => !category || p.category === category)
      .map((p) => ({ ...p, stock: demoStock.get(p.id) }));
  const ref = collection(database(), "products");
  const result = await getDocs(
    category ? query(ref, where("category", "==", category)) : ref,
  );
  return result.docs.map((d) => ({ ...d.data(), id: d.id }));
}
export async function getProduct(id) {
  if (isDemo) return (await getProducts()).find((p) => p.id === id) ?? null;
  const result = await getDoc(doc(database(), "products", id));
  return result.exists() ? { ...result.data(), id: result.id } : null;
}
export function prepareOrder(buyer, cart, current) {
  if (
    !buyer.name ||
    buyer.name.trim().length < 2 ||
    buyer.name.trim().length > 100 ||
    !/^\S+@\S+\.\S+$/.test(buyer.email?.trim() ?? "") ||
    buyer.email.length > 150 ||
    !/^[+0-9 ()-]{6,25}$/.test(buyer.phone?.trim() ?? "")
  )
    throw new Error(
      "Completa tus datos de contacto con un nombre, correo y teléfono válidos.",
    );
  if (
    !cart.length ||
    cart.length > 10 ||
    new Set(cart.map((p) => p.id)).size !== cart.length
  )
    throw new Error("La orden debe contener entre 1 y 10 productos distintos.");
  const items = cart.map((line) => {
    const p = current.find((p) => p.id === line.id);
    if (
      !p ||
      !Number.isInteger(line.quantity) ||
      line.quantity < 1 ||
      line.quantity > p.stock
    )
      throw new Error(
        `Stock insuficiente para ${p?.name ?? line.name}. Actualiza el carrito.`,
      );
    if (p.price !== line.price)
      throw new Error(
        `El precio de ${p.name} cambió. Vuelve a agregarlo al carrito.`,
      );
    return { id: p.id, name: p.name, quantity: line.quantity, price: p.price };
  });
  return {
    buyer: {
      name: buyer.name.trim(),
      email: buyer.email.trim(),
      phone: buyer.phone.trim(),
    },
    items,
    total: items.reduce((n, p) => n + p.price * p.quantity, 0),
    currency: "USD",
  };
}
export async function createOrder(buyer, cart) {
  if (isDemo) {
    const order = prepareOrder(buyer, cart, await getProducts());
    order.items.forEach((p) =>
      demoStock.set(p.id, demoStock.get(p.id) - p.quantity),
    );
    return {
      id: `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      total: order.total,
      demo: true,
    };
  }
  const uid = await buyerSession();
  const orderRef = doc(collection(database(), "orders"));
  return runTransaction(db, async (tx) => {
    const snapshots = await Promise.all(
      cart.map((p) => tx.get(doc(db, "products", p.id))),
    );
    const current = snapshots
      .filter((d) => d.exists())
      .map((d) => ({ ...d.data(), id: d.id }));
    const order = prepareOrder(buyer, cart, current);
    tx.set(orderRef, {
      ...order,
      uid,
      createdAt: serverTimestamp(),
      status: "received",
    });
    // Stock is checked against current Firestore data. Fulfillment and stock
    // reservation belong to a trusted backend, not to public client writes.
    return { id: orderRef.id, total: order.total, demo: false };
  });
}
