import { useRef } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import "./login.css";
import { listen } from "@tauri-apps/api/event";
import { useNavigate } from "react-router-dom";

export default function Login(props) {
  const name = useRef(null);
  const topic = useRef(null);
  const relay = useRef(null);
  const key = useRef(null);

  const navigate = useNavigate();

  const start = async (appWindow, username, channelTopic, relayServer, secretKey) => {
    await invoke("start", {
      window: appWindow,
      name: username,
      topic: channelTopic,
      relay: relayServer,
      key: secretKey,
    });
  };

  const connect = () => {

    const username = name.current.value;
    const channelTopic = topic.current.value;
    const relayServer = relay.current.value;
    const secretKey = key.current.value;

    navigate("/progress");

    start(appWindow, username, channelTopic, relayServer, secretKey);
    const connected = async () => {
      await listen("connected", (event) => {
        navigate("/display", { state: {name: username }});
        alert(event.payload);
      });
    };

    connected();
  };

  return (
    <div className="login">
      <h2>ToChat</h2>
      <div className="login_box">
        <input type="text" name="name" id="name" required ref={name} />
        <label htmlFor="name">Username</label>
      </div>
      <div className="login_box">
        <input type="text" name="topic" id="topic" required ref={topic} />
        <label htmlFor="topic">Topic</label>
      </div>
      <div className="login_box">
        <input type="text" name="key" id="key" required ref={key} defaultValue="a1b059933d8a843fabd2c9a08dd824df292d974ce0f2ed0c08e14c4e38c79894" />
        <label htmlFor="key">Key</label>
      </div>
      <div className="login_box">
        <input
          type="password"
          name="relay"
          id="relay"
          defaultValue="/ip4/1.12.76.121/tcp/4001/p2p/12D3KooWDpJ7As7BWAwRMfu1VU2WCqNjvq387JEYKDBj4kx6nXTN"
          required
          style={{ color: "grey" }}
          ref={relay}
        />
        <label htmlFor="relay">Relay</label>
      </div>
      <a href="#" onClick={connect}>
        login
        <span />
        <span />
        <span />
        <span />
      </a>
    </div>
  );
}
