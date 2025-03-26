import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { CreateClient } from "./pages/CreateClient";
import { Navbar } from "./components/Navbar";
import { EditClient } from "./pages/EditClient";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastrar" element={<CreateClient />} />
        <Route path="/editar/:id" element={<EditClient />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
