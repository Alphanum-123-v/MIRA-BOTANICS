import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "../store/useStore";

export default function Toast() {
  const { toast, hideToast, openCart } = useStore();
  return (
    <div className="toast-zone" role="status" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.key} className="toast"
            initial={{ y: 40, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
          >
            <span>{toast.text}</span>
            {toast.withCart && <button onClick={() => { hideToast(); openCart(); }}>View cart</button>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
