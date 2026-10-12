export default function Qty({ value, onChange, min = 0, size }) {
  return (
    <div className={`qty ${size || ""}`}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} aria-label="Decrease quantity">−</button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} aria-label="Increase quantity">+</button>
    </div>
  );
}
