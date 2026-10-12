import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <section className="section wrap center">
      <h2 className="serif">Page not found</h2>
      <p className="muted">That page doesn't exist.</p><br />
      <Link className="btn btn-dark" to="/">Back to the shop</Link>
    </section>
  );
}
