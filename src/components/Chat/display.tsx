import TextField from "@mui/material/TextField";
import { listen } from "@tauri-apps/api/event";
import { MutableRefObject, useEffect, useRef } from "react";
import "./display.css";
import { appWindow } from "@tauri-apps/api/window";
import multiavatar from "@multiavatar/multiavatar/esm";
import { Location, useLocation } from "react-router-dom";

type Avatar = string;

function Display() {
  const words_ref: MutableRefObject<any> = useRef(null);
  const location: Location = useLocation();
  const { name } = location.state;

  const svgCode_me: Avatar = multiavatar(name);

  const receive = async () => {
    await listen("receive", (event: any) => {
      const all: string[] = event.payload.split("@");
      const message = JSON.parse(all[1]).msg;
      const info = all[0];

      const name_forAvatar = info.split(" ")[0];

      const svgCode_others = multiavatar(name_forAvatar);

      words_ref.current.innerHTML =
        words_ref.current.innerHTML +
        '<div class="infoA">' +
        info +
        "</div>" +
        '<div class="atalk">' +
        '<div class="avatarA">' +
        svgCode_others +
        "</div>" +
        "<span>" +
        message +
        "</span>" +
        "</div>";

      // scroll to the bottom
      words_ref.current.scrollTop = words_ref.current.scrollHeight;
    });
  };

  const handleKeyDown = (e: any) => {
    // "enter"
    if (e.keyCode === 13) {
      const msg: string = e.target.value;
      const date = new Date().toLocaleTimeString("en-US", { hour12: false });

      const send = async (msg: any) => {
        await appWindow.emit("send", { msg });
      };

      // send msg to backend
      send(msg);

      // sender messages
      words_ref.current.innerHTML =
        words_ref.current.innerHTML +
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
        svgCode_me +
        "</div>" +
        "</div>";

      // scroll to the bottom
      words_ref.current.scrollTop = words_ref.current.scrollHeight;

      // reset input area
      e.target.value = "";
    }
  };

  useEffect(() => {
    receive();
  }, []);

  return (
    <div className="area">
      <div className="show" ref={words_ref}>
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
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}

export default Display;
