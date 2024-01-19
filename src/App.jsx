import "./App.css";
import Landing from "./components/Landing";
import Room from "./components/Room";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <Routes>
      <Route path="" element={<Landing />} />
      <Route path="room/:roomId" element={<Room />} />
    </Routes>
  );
}

export default App;
