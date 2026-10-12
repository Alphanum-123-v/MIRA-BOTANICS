import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { byId, SET, SET_DISCOUNT } from "../data/products";

// Storage that never throws (private browsing, blocked storage, etc.)
const safeStorage = {
  getItem: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  setItem: (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
  removeItem: (k) => { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};

export const useStore = create(
  persist(
    (set, get) => ({
      currency: "NGN",
      cart: {},              // { productId: quantity }
      cartOpen: false,
      quickView: null,       // product id shown in the quick-view modal
      search: "",
      toast: null,

      setCurrency: (currency) => set({ currency }),
      setSearch: (search) => set({ search }),
      openCart: () => set({ cartOpen: true }),
      closeCart: () => set({ cartOpen: false }),
      openQuickView: (id) => set({ quickView: id }),
      closeQuickView: () => set({ quickView: null }),

      add: (id, qty = 1, { silent } = {}) => {
        set((s) => ({ cart: { ...s.cart, [id]: (s.cart[id] || 0) + qty } }));
        if (!silent) get().showToast(`Added ${qty > 1 ? qty + " × " : ""}${byId(id).name}`, true);
      },
      setQty: (id, qty) =>
        set((s) => {
          const cart = { ...s.cart };
          if (qty <= 0) delete cart[id]; else cart[id] = qty;
          return { cart };
        }),
      clear: () => set({ cart: {} }),

      showToast: (text, withCart = false) => {
        const t = { text, withCart, key: Date.now() };
        set({ toast: t });
        setTimeout(() => { if (get().toast?.key === t.key) set({ toast: null }); }, 2600);
      },
      hideToast: () => set({ toast: null }),
    }),
    {
      name: "mira-cart",
      storage: createJSONStorage(() => safeStorage),
      partialize: (s) => ({ currency: s.currency, cart: s.cart }),
    }
  )
);

// Derived values
export const price = (p, cur) => p.price[cur];
export const cartCount = (cart) => Object.values(cart).reduce((a, b) => a + b, 0);
export const subtotal = (cart, cur) =>
  Object.entries(cart).reduce((s, [id, q]) => s + (byId(id) ? byId(id).price[cur] * q : 0), 0);
export const setDiscount = (cart, cur) => {
  const n = Math.min(...SET.map((id) => cart[id] || 0));
  return n > 0 ? n * SET.reduce((s, id) => s + byId(id).price[cur], 0) * SET_DISCOUNT : 0;
};
