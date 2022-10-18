#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[tauri::command]
fn receive(msg: &str) {
  println!("{}", msg)
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![receive])
    .run(tauri::generate_context!())
    .expect("failed to run app");
}