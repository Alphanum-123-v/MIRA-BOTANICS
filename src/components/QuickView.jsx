import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import ProductArt from "./ProductArt";
import Qty from "./Qty";
import { Viewer3D } from "../three/Scene3D";
import { useStore } from "../store/useStore";
import { byId } from "../data/products";
import { fmt } from "../lib/money";

export default function QuickView() {
  const { quickView, closeQuickView, currency, add } = useStore();
  const p = quickView ? byId(quickView) : null;
  const [q, setQ] = useState(1);
  useEffect(() => setQ(1), [quickView]);

  return (
    <AnimatePresence>
      {p && (
        <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeQuickView}>
          <motion.div
            className="box pv" role="dialog" aria-modal="true" aria-label={p.name}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
          >
            <button className="x" onClick={closeQuickView} aria-label="Close" autoFocus>×</button>
            <div className="viewer" style={{ background: `radial-gradient(circle at 50% 40%, #fff 0, ${p.bg} 70%)` }}>
              <Viewer3D p={p} fallback={<ProductArt p={p} k="m" />} />
              <span className="hint">↻ Drag to rotate</span>
            </div>
            <div className="info">
              <span className="tag">{p.tag}</span>
              <h2>{p.name}</h2>
              <span className="rating"><span className="stars">★★★★★</span> {p.rating} · {p.reviews} reviews</span>
              <div className="price big">{fmt(p.price[currency], currency)}{p.was && <s>{fmt(p.was[currency], currency)}</s>}</div>
              <p className="desc">{p.desc}</p>
              <ul className="ticks">{p.points.map((x) => <li key={x}>{x}</li>)}</ul>
              <div className="buy">
                <Qty value={q} min={1} onChange={setQ} size="lg" />
                <button className="btn btn-dark" onClick={() => { add(p.id, q); closeQuickView(); }}>Add to cart · {fmt(p.price[currency] * q, currency)}</button>
              </div>
              <Link className="more" to={`/product/${p.id}`} onClick={closeQuickView}>See full details →</Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
