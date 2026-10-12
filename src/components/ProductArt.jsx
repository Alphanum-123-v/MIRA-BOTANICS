// Lightweight 2D product illustration (SVG). Used for product cards, cart and
// summaries so the grid stays fast; the 3D models are used in the hero and viewer.
export default function ProductArt({ p, k = "", noBg = false, className }) {
  const [c1, c2] = p.c;
  const id = p.id + k;
  const Label = ({ x, y, w }) => (
    <g>
      <rect x={x} y={y} width={w} height="54" rx="6" fill="#fffdf9" opacity=".92" />
      <text x={x + w / 2} y={y + 24} textAnchor="middle" fontFamily="Fraunces,Georgia,serif" fontSize="15" fontWeight="600" fill="#1d2a22">mira</text>
      <text x={x + w / 2} y={y + 42} textAnchor="middle" fontFamily="Inter,Arial,sans-serif" fontSize="9" fontWeight="700" letterSpacing="1.5" fill={c2}>{p.label}</text>
    </g>
  );
  const g = `url(#g${id})`, s = `url(#s${id})`;
  let body;
  if (p.shape === "dropper")
    body = (<>
      <rect x="128" y="40" width="44" height="58" rx="18" fill="#2b2b2b" /><rect x="122" y="92" width="56" height="26" rx="5" fill="#d9c7a7" />
      <rect x="100" y="114" width="100" height="148" rx="22" fill={g} /><rect x="108" y="122" width="22" height="130" rx="11" fill={s} /><Label x={112} y={160} w={76} />
    </>);
  else if (p.shape === "pump")
    body = (<>
      <path d="M150 34h44v12h-30v20h-14z" fill="#2b2b2b" /><rect x="138" y="62" width="24" height="30" rx="4" fill="#2b2b2b" />
      <rect x="98" y="88" width="104" height="176" rx="26" fill={g} /><rect x="106" y="98" width="22" height="156" rx="11" fill={s} /><Label x={110} y={150} w={80} />
    </>);
  else if (p.shape === "jar")
    body = (<>
      <rect x="80" y="112" width="140" height="40" rx="10" fill="#2b2b2b" /><rect x="74" y="146" width="152" height="112" rx="28" fill={g} />
      <rect x="84" y="156" width="24" height="92" rx="12" fill={s} /><Label x={110} y={178} w={80} />
    </>);
  else if (p.shape === "tube")
    body = (<>
      <path d="M106 52h88l-8 168H114z" fill={g} /><rect x="124" y="218" width="52" height="42" rx="8" fill="#2b2b2b" />
      <rect x="102" y="44" width="96" height="14" rx="3" fill={c2} /><path d="M114 62h18l-6 150h-8z" fill={s} /><Label x={112} y={110} w={76} />
    </>);
  else
    body = (<>
      <rect x="132" y="38" width="36" height="34" rx="6" fill="#2b2b2b" />
      <path d="M134 70h32v18c22 8 34 22 34 44v110a20 20 0 0 1-20 20h-60a20 20 0 0 1-20-20V132c0-22 12-36 34-44z" fill={g} />
      <path d="M112 130h18v118h-18z" fill={s} /><Label x={112} y={160} w={76} />
    </>);
  return (
    <svg className={className} viewBox="0 0 300 300" role="img" aria-label={p.name} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`g${id}`} x1="0" x2="1"><stop offset="0" stopColor={c1} /><stop offset="1" stopColor={c2} /></linearGradient>
        <linearGradient id={`s${id}`} x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity=".55" /><stop offset=".5" stopColor="#fff" stopOpacity="0" /></linearGradient>
      </defs>
      {!noBg && (<>
        <rect width="300" height="300" fill={p.bg} /><circle cx="150" cy="168" r="112" fill="#fff" opacity=".35" />
        <path d="M232 236c22-6 34-24 34-46-22 4-36 22-34 46z" fill={c2} opacity=".35" />
        <path d="M50 90c-2-20 10-36 30-42 2 22-10 36-30 42z" fill={c2} opacity=".25" />
      </>)}
      <ellipse cx="150" cy="268" rx="70" ry="9" fill="#000" opacity=".1" />
      {body}
    </svg>
  );
}
