import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex gap-4">
      <Link to="/" className="hover:underline">Clientes</Link>
      <Link to="/cadastrar" className="hover:underline">Cadastrar Cliente</Link>
    </nav>
  );
}
