mod owner;
mod product_catalog;
pub mod common;

use std::sync::Mutex;
use tauri::{App, Manager};
use owner::get_owner_info;
use product_catalog::get_product_catalog;
use product_catalog::add_product_to_catalog;
use crate::common::repository::BasicRepository;
use crate::common::repository::file_repository::FileBasicRepository;
use crate::common::repository::file_repository_config::{DbEntity, FileRepositoryCofig};
use crate::product_catalog::Product;

type ProductRepository<'a> = tauri::State<'a, Mutex<Box<dyn BasicRepository<Product>>>>;

fn setup_app(app: &mut App) ->  std::result::Result<(), Box<dyn std::error::Error>> {
    if cfg!(debug_assertions) {
        app.handle().plugin(
            tauri_plugin_log::Builder::default()
                .level(log::LevelFilter::Info)
                .build(),
        )?;
    }

    let product_rep_file_path = FileRepositoryCofig::get_db_file_path_for(DbEntity::ProductCatalog);
    let product_repository: Box::<dyn BasicRepository<Product>> = Box::new(FileBasicRepository::<Product>::new(product_rep_file_path));
    app.manage(Mutex::new(product_repository));

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(setup_app)
    .invoke_handler(tauri::generate_handler![get_owner_info, 
                                              get_product_catalog, 
                                              add_product_to_catalog,
                                              ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
