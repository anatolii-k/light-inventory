mod owner;
mod product_catalog;
pub mod common;
mod counterparty;

use std::sync::Mutex;
use serde::{Deserialize, Serialize};
use tauri::{App, Manager};
use owner::get_owner_info;
use product_catalog::get_product_catalog;
use product_catalog::add_product_to_catalog;
use crate::common::repository::BasicRepository;
use crate::common::repository::file_repository::FileBasicRepository;
use crate::common::repository::file_repository_config::{DbEntity, FileRepositoryCofig};
use crate::counterparty::{get_counterparties, Counterparty, add_counterparty};
use crate::product_catalog::Product;

type ProductRepository<'a> = tauri::State<'a, Mutex<Box<dyn BasicRepository<Product>>>>;
type CounterpartiesRepository<'a> = tauri::State<'a, Mutex<Box<dyn BasicRepository<Counterparty>>>>;

fn register_repository_state<T>(app: &mut App, db_entity: DbEntity )
where
T: Send + 'static,
for<'a> T: Serialize + Deserialize<'a> + Send {
    let rep_file_path = FileRepositoryCofig::get_db_file_path_for(db_entity);
    let product_repository: Box::<dyn BasicRepository<T>> = Box::new(FileBasicRepository::<T>::new(rep_file_path));
    app.manage(Mutex::new(product_repository));

}

fn setup_app(app: &mut App) ->  std::result::Result<(), Box<dyn std::error::Error>> {
    if cfg!(debug_assertions) {
        app.handle().plugin(
            tauri_plugin_log::Builder::default()
                .level(log::LevelFilter::Info)
                .build(),
        )?;
    }

    register_repository_state::<Product>(app, DbEntity::ProductCatalog);
    register_repository_state::<Counterparty>(app, DbEntity::Counterparties);


    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(setup_app)
    .invoke_handler(tauri::generate_handler![get_owner_info, 
                                            get_product_catalog,
                                            add_product_to_catalog,
                                            get_counterparties,
                                            add_counterparty
                                              ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
