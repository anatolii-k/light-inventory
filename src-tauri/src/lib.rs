mod owner;
mod product_catalog;

use owner::get_owner_info;
use product_catalog::get_product_catalog;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![get_owner_info, get_product_catalog])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
