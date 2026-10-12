import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProductArt from "./ProductArt";
import Qty from "./Qty";
import { useStore, cartCount, subtotal, setDiscount } from "../store/useStore";
import { byId } from "../data/products";
import { CURRENCIES, fmt } from "../lib/money";
import { waLink } from "../lib/whatsapp";

export default function CartDrawer() {
  const { cartOpen, closeCart, cart, currency, setQty } = useStore();
  const nav = useNavigate();
  const n = cartCount(cart);
  const disc = setDiscount(cart, currency);
  const total = subtotal(cart, currency) - disc;
  const free = CURRENCIES[currency].free;
  const left = free - total;

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div className="overlay" onClick={closeCart} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside
            className="drawer" aria-label="Shopping cart" role="dialog" aria-modal="true"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <div className="d-head"><h3>Your cart</h3><button className="x" onClick={closeCart} aria-label="Close cart" autoFocus>×</button></div>
            {n > 0 && (
              <div className="ship-bar">
                {left > 0 ? <>You're <b>{fmt(left, currency)}</b> away from free delivery</> : <>🎉 You've unlocked <b>free delivery</b></>}
                <div className="bar"><motion.i animate={{ width: `${Math.min(100, (total / free) * 100)}%` }} /></div>
              </div>
            )}
            <div className="items">
              {n === 0 ? (
                <div className="cart-empty"><div>🛍️</div><p>Your cart is empty.</p><button className="btn btn-ghost" onClick={closeCart}>Start shopping</button></div>
              ) : (
                <AnimatePresence initial={false}>
                  {Object.entries(cart).map(([id, q]) => {
                    const p = byId(id); if (!p) return null;
                    return (
                      <motion.div key={id} className="item" layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60, height: 0, paddingTop: 0, paddingBottom: 0 }}>
                        <div className="thumb"><ProductArt p={p} k="c" /></div>
                        <div>
                          <h4>{p.name}</h4>
                          <div className="sub">{p.size} · {fmt(p.price[currency], currency)}</div>
                          <Qty value={q} onChange={(v) => setQty(id, v)} />
                          <button className="remove" onClick={() => setQty(id, 0)}>Remove</button>
                        </div>
                        <div className="lt">{fmt(p.price[currency] * q, currency)}</div>
                      </motion.div>
                    );
                  })}
                  {disc > 0 && (
                    <motion.div key="disc" className="row disc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <span>Glow Routine Set discount</span><b>−{fmt(disc, currency)}</b>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
            {n > 0 && (
              <div className="d-foot">
                <div className="row"><span>Subtotal</span><b>{fmt(total, currency)}</b></div>
                <button className="btn btn-dark btn-block" onClick={() => { closeCart(); nav("/checkout"); }}>Checkout</button>
                <a className="btn btn-wa btn-block" href={waLink(cart, currency)} target="_blank" rel="noopener noreferrer">
                  <WaIcon /> Order on WhatsApp
                </a>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function WaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.6c-.1.2-.3.3-.1.6.2.3.7 1.2 1.6 2 1.1 1 2 1.3 2.3 1.4.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.8-.1 1.5z" />
    </svg>
  );
}
