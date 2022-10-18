import TextField from "@mui/material/TextField";
import { invoke } from "@tauri-apps/api/tauri";
import { useRef, useState } from "react";
import "./display.css";

async function send(msg) {
  await invoke("receive", { msg });
}

function Display() {
  const words = useRef(null);

  const handleKeyDown = (e) => {
    // "enter"
    if (e.keyCode === 13) {
      const msg = e.target.value;
  
      // send msg to backend
      send(msg);

      // sender messages
      words.current.innerHTML =
        words.current.innerHTML +
        '<div class="btalk"><p>' +
        msg +
        "</p></div>";

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
          fullWidth={true}
          label="input"
          color="secondary"
          focused
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}

export default Display;
