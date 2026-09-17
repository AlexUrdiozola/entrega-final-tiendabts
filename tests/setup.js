import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
// Node 25 also exposes localStorage. Use a deterministic browser Storage mock.
const storage = new Map();
vi.stubGlobal("localStorage", {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: (key) => storage.delete(key),
  clear: () => storage.clear(),
});
afterEach(() => {
  cleanup();
  localStorage.clear();
});
