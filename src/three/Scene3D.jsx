import { Component, lazy, Suspense, useEffect, useRef, useState } from "react";

// Loads the 3D code only when needed, and falls back to the 2D picture when
// WebGL isn't available, the device asks for reduced motion data, or anything fails.
const HeroScene = lazy(() => import("./HeroScene"));
const ViewerScene = lazy(() => import("./ViewerScene"));

export function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}

export function useReducedMotion() {
  const [r, setR] = useState(() => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const m = matchMedia("(prefers-reduced-motion: reduce)");
    const f = () => setR(m.matches);
    m.addEventListener?.("change", f);
    return () => m.removeEventListener?.("change", f);
  }, []);
  return r;
}

// Only render frames while the element is on screen (saves battery)
export function useOnScreen(ref) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    if (!ref.current || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.01 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref]);
  return on;
}

class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(e) { console.warn("3D scene failed, showing 2D fallback", e); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

const webgl = typeof window !== "undefined" && hasWebGL();

export function Hero3D({ fallback, onSelect }) {
  const ref = useRef();
  const onScreen = useOnScreen(ref);
  const still = useReducedMotion();
  return (
    <div ref={ref} className="scene">
      {webgl ? (
        <Boundary fallback={fallback}>
          <Suspense fallback={fallback}>
            <HeroScene active={onScreen} onSelect={onSelect} still={still} />
          </Suspense>
        </Boundary>
      ) : fallback}
    </div>
  );
}

export function Viewer3D({ p, fallback }) {
  const still = useReducedMotion();
  return (
    <div className="scene">
      {webgl ? (
        <Boundary fallback={fallback}>
          <Suspense fallback={fallback}>
            <ViewerScene p={p} still={still} />
          </Suspense>
        </Boundary>
      ) : fallback}
    </div>
  );
}
