// import TicketList from "./pages/TicketList";
// function App(){
//   return (
//     <div className="container mt-4">
//       <TicketList />
//     </div>
//   );
// }

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import TicketList from "./pages/TicketList";
function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/tickets" element={<TicketList />}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;