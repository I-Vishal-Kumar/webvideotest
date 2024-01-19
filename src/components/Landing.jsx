import { useCallback, useEffect, useRef, useState } from "react";
// import useSocket from "../useSocket/useSocket";
import ReactPlayer from "react-player";

// import { useNavigate } from "react-router-dom";
import Peer from "peerjs";

const Landing = () => {
  // const socket = useSocket();
  // const navigate = useNavigate();
  const [remote_id, update_id] = useState("");
  const [my_stream, update_my_stream] = useState(null);
  const [remote_stream, update_remote_stream] = useState(null);
  const [id, update] = useState("");
  const peer = useRef(null);

  useEffect(() => {
    peer.current = new Peer({
      config: {
        iceServers: [
          { url: "stun:stun.l.google.com:19302" },
          {
            url: "turn:numb.viagenie.ca",
            credential: "muazkh",
            username: "webrtc@live.com",
          },
        ],
      } /* Sample servers, please use appropriate ones */,
    });
    peer.current.on("open", (id) => {
      update(id);
    });
    peer.current.on("call", async (call) => {
      let stream = await getUserMedia();

      update_my_stream(stream);
      call.answer(stream);

      call.on("stream", (stream) => {
        update_remote_stream(stream);
      });
    });
  }, []);
  async function getUserMedia() {
    let stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    return stream;
  }
  const call_user = useCallback(async () => {
    let stream = await getUserMedia();
    update_my_stream(stream);
    let call = peer.current.call(remote_id, stream);
    call.on("stream", (stream) => {
      update_remote_stream(stream);
    });
  }, [remote_id]);

  // function start_connection() {
  //   peer.current.connect(remote_id);
  // }

  return (
    <div>
      <h2>my id : {id}</h2>
      <div>
        <h2>My video</h2>
        <div>
          <ReactPlayer url={my_stream} muted playing />
        </div>
      </div>
      <div>
        <h2>Remote video</h2>
        <div>
          <ReactPlayer url={remote_stream} muted playing />
        </div>
      </div>
      <input
        type="text"
        name=""
        value={remote_id}
        onChange={(e) => update_id(e.target.value)}
        placeholder="Enter Name"
      />
      <div>
        <button onClick={call_user}>Enter room</button>
      </div>
    </div>
  );
};

export default Landing;
