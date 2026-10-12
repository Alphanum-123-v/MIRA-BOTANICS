import { Logo } from "./Header";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot">
          <div>
            <Logo />
            <p>Clean, plant-powered skincare made for melanin-rich skin. Formulated in Lagos.</p>
          </div>
          <div><h4>Shop</h4><a href="#/">All products</a><a href="#/">Routine sets</a><a href="#/">Bestsellers</a></div>
          <div><h4>Help</h4><a href="#/">Delivery</a><a href="#/">Returns</a><a href="#/">Contact us</a></div>
          <div><h4>Follow</h4><a href="#/">Instagram</a><a href="#/">TikTok</a><a href="#/">X</a></div>
        </div>
        <div className="legal">
          <span>© 2026 Mira Botanics · A demo store (fictional brand, no real payments)</span>
          <span>Designed & built by <a href="#/">BoostLine</a> · React + Three.js</span>
        </div>
      </div>
    </footer>
  );
}
