import { MutableRefObject, useRef } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow, WebviewWindow } from "@tauri-apps/api/window";
import "./login.css";
import { listen } from "@tauri-apps/api/event";
import { NavigateFunction, useNavigate } from "react-router-dom";

export default function Login() {
  const name_ref: MutableRefObject<any> = useRef(null);
  const topic_ref: MutableRefObject<any> = useRef(null);
  const relay_ref: MutableRefObject<any> = useRef(null);

  const navigate: NavigateFunction = useNavigate();

  const start = async (appWindow: WebviewWindow, username: string, channelTopic: string, relayServer: string) => {
    await invoke("start", {
      window: appWindow,
      name: username,
      topic: channelTopic,
      relay: relayServer,
    });
  };

  const connect = () => {
    const username: string = name_ref.current.value;
    const channelTopic: string = topic_ref.current.value;
    const relayServer: string = relay_ref.current.value;

    navigate("/progress");

    start(appWindow, username, channelTopic, relayServer);
    const connected = async () => {
      await listen("connected", (event: any) => {
        navigate("/display", { state: { name: username } });
        alert(event.payload);
      });
    };

    connected();
  };

  return (
    <div className="login">
      <h2>ToChat</h2>
      <div className="login_box">
        <input type="text" name="name" id="name" required ref={name_ref} />
        <label htmlFor="name">Username</label>
      </div>
      <div className="login_box">
        <input type="text" name="topic" id="topic" required ref={topic_ref} />
        <label htmlFor="topic">Topic</label>
      </div>
      <div className="login_box">
        <input
          type="password"
          name="relay"
          id="relay"
          defaultValue="/ip4/1.12.76.121/tcp/4001/p2p/12D3KooWDpJ7As7BWAwRMfu1VU2WCqNjvq387JEYKDBj4kx6nXTN"
          required
          style={{ color: "grey" }}
          ref={relay_ref}
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
