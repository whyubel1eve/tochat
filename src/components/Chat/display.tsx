import TextField from "@mui/material/TextField";
import { listen } from "@tauri-apps/api/event";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import "./display.css";
import { appWindow } from "@tauri-apps/api/window";
import multiavatar from "@multiavatar/multiavatar/esm";
import { Location, useLocation } from "react-router-dom";
import Msg from "./Msg/msg";

type Avatar = string;

function Display() {
  const words_ref: MutableRefObject<any> = useRef(null);
  const location: Location = useLocation();
  const { name } = location.state;

  const [items, setItems]: any = useState([]);

  const svgCode_me: Avatar = multiavatar(name);

  const receive = async () => {
    await listen("receive", (event: any) => {
      const all: string[] = event.payload.split("@");
      const message = JSON.parse(all[1]).msg;
      const info = all[0];

      const name_forAvatar = info.split("  ")[0];
      const time = info.split("  ")[1];

      const svgCode_others = multiavatar(name_forAvatar);

      setItems((arr: any) => [
        ...arr,
        {
          info: "infoA",
          talk: "atalk",
          avatar: "avatarA",
          time: time,
          message: message,
          name_forAvatar: name_forAvatar,
          svgCode: svgCode_others,
        },
      ]);

    });
  };

  const handleKeyDown = (e: any) => {
    // "enter"
    if (!e.shiftKey && e.keyCode === 13) {
      // Don't make a line break when "enter"
      e.cancelBubble = true;
      e.preventDefault();
      e.stopPropagation();

      const msg: string = e.target.value;
      const date = new Date().toLocaleTimeString("en-US", { hour12: false });

      const send = async (msg: any) => {
        await appWindow.emit("send", { msg });
      };

      // send msg to backend
      send(msg);

      setItems((arr: any) => [
        ...arr,
        {
          info: "infoB",
          talk: "btalk",
          avatar: "avatarB",
          time: date,
          message: msg,
          name_forAvatar: name,
          svgCode: svgCode_me,
        },
      ]);

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
        <Msg items={items} words_ref={words_ref} />
      </div>
      <br />
      <div>
        <TextField
          helperText="Please enter your message"
          fullWidth={true}
          id="outlined-basic"
          variant="outlined"
          color="info"
          multiline={true}
          rows="2"
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}

export default Display;
