import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProductArt from "./ProductArt";
import { useStore } from "../store/useStore";
import { fmt } from "../lib/money";

const ProductCard = forwardRef(function ProductCard({ p }, ref) {
  const { currency, add, openQuickView } = useStore();
  return (
    <motion.article
      ref={ref} layout className="card"
      initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -6 }}
    >
      <div className="pic">
        <Link to={`/product/${p.id}`} aria-label={p.name}><ProductArt p={p} /></Link>
        {p.badge && <span className={`badge ${p.badge === "New" ? "new" : ""}`}>{p.badge}</span>}
        <button className="quick" onClick={() => openQuickView(p.id)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" /></svg>
          View in 3D
        </button>
      </div>
      <div className="body">
        <span className="tag">{p.tag}</span>
        <h3><Link to={`/product/${p.id}`}>{p.name}</Link></h3>
        <span className="rating"><span className="stars">★</span> {p.rating} ({p.reviews})</span>
        <div className="bottom">
          <span className="price">{fmt(p.price[currency], currency)}{p.was && <s>{fmt(p.was[currency], currency)}</s>}</span>
          <motion.button whileTap={{ scale: 0.85, rotate: 90 }} className="add" onClick={() => add(p.id)} aria-label={`Add ${p.name} to cart`}>+</motion.button>
        </div>
      </div>
    </motion.article>
  );
});
export default ProductCard;
