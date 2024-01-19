import { useContext, useMemo, createContext } from "react";
import { PropTypes } from "prop-types";

export const RtcContext = createContext(null);

export const RtcProvider = ({ children }) => {
  const peer = useMemo(() => new RTCPeerConnection(), []);

  // user 1
  async function createOffer() {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  }

  //  user 1
  async function saveAnswer(answer) {
    await peer.setRemoteDescription(answer);
  }

  // user 2
  async function createAnswer(offer) {
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  }

  // user 2
  // async function saveLocal(answer) {
  //   await peer.setLocalDescription(answer);
  // }

  async function startCalling(track, stream) {
    // let tracks = stream.getTracks()[[0]];
    try {
      peer.addTrack(track, stream);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <RtcContext.Provider
      value={{
        peer,
        createOffer,
        createAnswer,
        saveAnswer,
        // saveLocal,
        startCalling,
      }}
    >
      {children}
    </RtcContext.Provider>
  );
};

RtcProvider.propTypes = {
  children: PropTypes.node,
};

export default function useRtc() {
  return useContext(RtcContext);
}
