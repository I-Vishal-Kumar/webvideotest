import { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";
import { PropTypes } from "prop-types";

export const socketContext = createContext(null);

export const SocketContextProvider = ({ children }) => {
  const socket = useMemo(() => io("http://localhost:8000"));
  return (
    <socketContext.Provider value={socket}>{children}</socketContext.Provider>
  );
};

SocketContextProvider.propTypes = {
  children: PropTypes.node,
};

export default function useSocket() {
  return useContext(socketContext);
}
