import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import TicketList from "./pages/TicketList";
import ProtectedRoute from "./components/ProtectedRoute";
import OAuthCallback from "./pages/OAuthCallback";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />

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