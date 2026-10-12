import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductArt from "../components/ProductArt";
import ProductCard from "../components/ProductCard";
import Qty from "../components/Qty";
import Reveal from "../components/Reveal";
import { Viewer3D } from "../three/Scene3D";
import { useStore } from "../store/useStore";
import { byId, PRODUCTS } from "../data/products";
import { fmt } from "../lib/money";
import NotFound from "./NotFound";

const TABS = [["desc", "Benefits"], ["ingr", "Ingredients"], ["how", "How to use"]];

export default function ProductPage() {
  const { id } = useParams();
  const p = byId(id);
  const { currency, add } = useStore();
  const [q, setQ] = useState(1);
  const [tab, setTab] = useState("desc");
  useEffect(() => { setQ(1); setTab("desc"); document.title = p ? `${p.name} · Mira Botanics` : "Mira Botanics"; }, [id, p]);
  if (!p) return <NotFound />;

  const related = PRODUCTS.filter((x) => x.id !== p.id && x.f.some((f) => p.f.includes(f))).slice(0, 4);

  return (
    <>
      <section className="section product-page">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Shop</Link> / <span>{p.tag}</span> / <b>{p.name}</b></nav>
          <div className="pp-grid">
            <motion.div className="viewer big" style={{ background: `radial-gradient(circle at 50% 40%, #fff 0, ${p.bg} 70%)` }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Viewer3D p={p} fallback={<ProductArt p={p} k="pp" />} />
              {p.badge && <span className="badge">{p.badge}</span>}
              <span className="hint">↻ Drag to rotate</span>
            </motion.div>
            <motion.div className="pp-info" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <span className="tag">{p.tag} · {p.size}</span>
              <h1>{p.name}</h1>
              <span className="rating"><span className="stars">★★★★★</span> {p.rating} · {p.reviews} reviews</span>
              <div className="price big">{fmt(p.price[currency], currency)}{p.was && <s>{fmt(p.was[currency], currency)}</s>}</div>
              <p className="desc">{p.desc}</p>
              <div className="buy">
                <Qty value={q} min={1} onChange={setQ} size="lg" />
                <button className="btn btn-dark" onClick={() => add(p.id, q)}>Add to cart · {fmt(p.price[currency] * q, currency)}</button>
              </div>
              <div className="perks"><span>🚚 Free delivery over the threshold</span><span>↩️ 30-day returns</span><span>🐰 Cruelty-free</span></div>
              <div className="tabs" role="tablist">
                {TABS.map(([k, l]) => (
                  <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>
                    {l}{tab === k && <motion.i layoutId="tab-line" className="tab-line" />}
                  </button>
                ))}
              </div>
              <motion.div key={tab} className="tab-body" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                {tab === "desc" && <ul className="ticks">{p.points.map((x) => <li key={x}>{x}</li>)}</ul>}
                {tab === "ingr" && <p>{p.ingr}</p>}
                {tab === "how" && <p>{p.how}</p>}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="section related">
          <div className="wrap">
            <Reveal className="head"><div><h2>Pairs well with</h2><p>Build a routine that works together.</p></div></Reveal>
            <div className="grid">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
