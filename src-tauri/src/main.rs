#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::sync::Arc;

use futures::executor::block_on;
use libp2p::Multiaddr;
use tauri::{async_runtime::spawn, Window};
use tokio::sync::mpsc;

mod network;
use network::{connection_channel::establish_connection, secure::*};

use crate::network::connection_channel::handle_msg;

// init a background process on the command, and emit periodic events only to the window that used the command
#[tauri::command]
async fn start(window: Window, name: String, topic: String) {
    let key = get_secret();
    let relay: Multiaddr = "/ip4/43.139.136.140/tcp/4001/p2p/12D3KooWDpJ7As7BWAwRMfu1VU2WCqNjvq387JEYKDBj4kx6nXTN".parse().unwrap();

    let swarm = establish_connection(&key, &topic, &relay).await;

    // crossed thread data
    let window = Arc::new(window);
    let window_clone1 = window.clone();
    let window_clone2 = window.clone();

    // send a message to display chat component

   window.emit("connected", "successful").unwrap();

    // send messages to other peers
    let (tx1, rx1) = mpsc::channel::<String>(32);
    // receive messages from other peers
    let (tx2, mut rx2) = mpsc::channel::<String>(32);

    spawn(async move {
        window_clone1.listen("send", move |event| {
            block_on(tx1.send(format!("{}*{}", name, event.payload().unwrap().to_string())))
                .unwrap();
        });
    });
    spawn(async move {
        loop {
            while let Some(msg) = block_on(rx2.recv()) {
                window_clone2.emit("receive", msg).unwrap();
            }
        }
    });
    handle_msg(swarm, rx1, tx2, topic).await;
}

fn main() {
    env_logger::init();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start])
        .run(tauri::generate_context!())
        .expect("failed to run app");
}
