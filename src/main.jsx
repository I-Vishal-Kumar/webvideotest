import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
// import { RtcProvider } from "./useRTC/useRTC.jsx";
// import { SocketContextProvider } from "./useSocket/useSocket.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  // <SocketContextProvider>
  // <RtcProvider>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  // </RtcProvider>
  // </SocketContextProvider>
);
