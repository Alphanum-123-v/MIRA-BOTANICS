import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useStore, cartCount, subtotal, setDiscount } from "../store/useStore";
import { fmt } from "../lib/money";

export default function MobileCartBar() {
  const { cart, currency, openCart, cartOpen } = useStore();
  const { pathname } = useLocation();
  const n = cartCount(cart);
  const show = n > 0 && !cartOpen && pathname !== "/checkout";
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="mobile-cart" initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ type: "spring", stiffness: 380, damping: 32 }}>
          <button className="btn btn-dark" onClick={openCart}>
            View cart · {n} item{n === 1 ? "" : "s"} · {fmt(subtotal(cart, currency) - setDiscount(cart, currency), currency)}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
