import { useCallback, useEffect, useState } from "react";
import useSocket from "../useSocket/useSocket";
import useRtc from "../useRTC/useRTC";
import ReactPlayer from "react-player";
const Room = () => {
  const socket = useSocket();
  const {
    peer,
    createOffer,
    createAnswer,
    saveAnswer,
    saveLocal,
    startCalling,
  } = useRtc();

  const [myStream, update_My_stream] = useState(null);
  const [remoteStream, update_Remote_stream] = useState(null);
  const [remote_user, update_remote_user] = useState(null);

  const newUserJoined = useCallback(
    async ({ name }) => {
      // create a offer and send it to the user that joined;
      const offer = await createOffer();
      update_remote_user(name);
      console.log(name);
      socket.emit("send_offer", { call_user: name, offer });
    },
    [createOffer, socket]
  );

  const gotAOffer = useCallback(
    async ({ offer, from }) => {
      alert("got offer and answer created.");
      const answer = await createAnswer(offer);
      socket.emit("answer_created", { answer, answer_for: from });
    },
    [createAnswer, socket]
  );

  const gotAAnswer = useCallback(
    async ({ answer, from }) => {
      await saveAnswer(answer);
      socket.emit("connection_created", { answer, connected_with: from });
    },
    [saveAnswer, socket]
  );

  const startCall = useCallback(async () => {
    let stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    let tracks = stream.getTracks();
    console.log(tracks);
    for (const track of tracks) {
      peer.addTrack(track, stream);
    }
    update_My_stream(stream);

    // let tracks = streams.getVideoTracks()[0];
    // startCalling(tracks, streams);
    // update_My_stream(streams);
  }, [peer]);

  const connected = useCallback(
    async ({ answer, from }) => {
      // await saveLocal(answer);
      alert("connected start call");
      startCall();
      socket.emit("initiate_call", { connected_with: from });
    },
    [socket, startCall]
  );

  const got_remote_track = useCallback(async (e) => {
    alert("got track");
    const remoteTrack = e.streams;
    console.log("track", remoteTrack);
    update_Remote_stream(remoteTrack[0]);
  }, []);

  const negotiation_needed = useCallback(async () => {
    alert("negotiating with " + remote_user);
    let offer = await createOffer();
    // console.log(offer, "to", remote_user);
    socket.emit("send_offer", { call_user: remote_user, offer });
  }, [createOffer, remote_user, socket]);

  useEffect(() => {
    peer.addEventListener("track", got_remote_track);
    peer.addEventListener("negotiationneeded", negotiation_needed);
    socket.on("new_user_joined", newUserJoined);
    socket.on("got_offer", gotAOffer);
    socket.on("got_answer", gotAAnswer);
    socket.on("connected", connected);
    socket.on("start_calling", startCall);
    return () => {
      peer.removeEventListener("track", got_remote_track);
      peer.removeEventListener("negotiationneeded", negotiation_needed);
      socket.off("new_user_joined", newUserJoined);
      socket.off("got_offer", gotAOffer);
      socket.off("got_answer", gotAAnswer);
      socket.off("connected", connected);
    };
  }, [
    connected,
    gotAAnswer,
    gotAOffer,
    got_remote_track,
    negotiation_needed,
    newUserJoined,
    peer,
    socket,
    startCall,
  ]);

  return (
    <div>
      room
      <h2>connected with {remote_user}</h2>
      <section>
        <h1>my video</h1>
        <ReactPlayer url={myStream} muted playing />
        <h1>remote video</h1>
        <ReactPlayer url={remoteStream} muted playing />
      </section>
    </div>
  );
};

export default Room;
