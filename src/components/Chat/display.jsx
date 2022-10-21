import TextField from "@mui/material/TextField";
import { listen } from "@tauri-apps/api/event";
import { useRef } from "react";
import "./display.css";
import { appWindow } from "@tauri-apps/api/window";
import multiavatar from "@multiavatar/multiavatar/esm";
import { useLocation } from "react-router-dom";



function Display() {
  const n1 = Math.random() * 10000;
  const n2 = Math.random() * 10000;

  const svgCode1 = multiavatar(n1);
  const svgCode2 = multiavatar(n2);

  const words = useRef(null);
  const location = useLocation();
  const { name } = location.state;

  const receive = async () => {
    await listen("receive", (event) => {
      const all = event.payload.split("@");
      const message = JSON.parse(all[1]).msg;
      const info = all[0];

      words.current.innerHTML =
        words.current.innerHTML +
        '<div class="infoA">' +
        info +
        "</div>" +
        '<div class="atalk">' +
        '<div class="avatarA">' +
        svgCode1 +
        "</div>" +
        "<span>" +
        message +
        "</span>" +
        "</div>";

      // scroll to the bottom
      words.current.scrollTop = words.current.scrollHeight;
    });
  };

  receive();

  const handleKeyDown = (e) => {
    // "enter"
    if (e.keyCode === 13) {
      const msg = e.target.value;
      const date = new Date().toLocaleTimeString("en-US", { hour12: false });

      const send = async (msg) => {
        await appWindow.emit("send", { msg });
      }
      // send msg to backend
      send(msg);

      // sender messages
      words.current.innerHTML =
        words.current.innerHTML +
        '<div class="infoB">' +
        name +
        "&nbsp;" +
        date +
        "</div>" +
        '<div class="btalk">' +
        "<span>" +
        msg +
        "</span>" +
        '<div class="avatarB">' +
        svgCode2 +
        "</div>" +
        "</div>";

      // scroll to the bottom
      words.current.scrollTop = words.current.scrollHeight;

      // reset input area
      e.target.value = "";
    }
  };

  return (
    <div className="area">
      <div className="show" ref={words}>
        <div className="atalk"></div>
        <div className="btalk"></div>
      </div>
      <br />
      <div>
        <TextField
          helperText="Please enter your message"
          fullWidth={true}
          id="outlined-basic"
          label="Message"
          variant="outlined"
          color="info"
          // focused
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}

export default Display;
