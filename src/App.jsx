import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import TicketList from "./pages/TicketList";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/tickets" element={
            <ProtectedRoute>
              <TicketList />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;