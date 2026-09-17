import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { products } from "../src/data/products.js";
const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
if (!projectId) throw new Error("Falta VITE_FIREBASE_PROJECT_ID en .env.local");
initializeApp({ credential: applicationDefault(), projectId });
const db = getFirestore();
// create prevents accidental overwriting of existing catalogue/stock.
for (const product of products) {
  const { id, ...data } = product;
  try {
    await db.collection("products").doc(id).create(data);
    console.log("Creado:", id);
  } catch (error) {
    if (error.code === 6) console.log("Ya existe, sin cambios:", id);
    else throw error;
  }
}
console.log("Catálogo listo.");
