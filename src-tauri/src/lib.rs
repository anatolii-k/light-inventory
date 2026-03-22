mod owner;
mod product_catalog;
pub mod common;
mod counterparty;
mod stock_list;

use std::sync::Mutex;
use serde::{Deserialize, Serialize};
use tauri::{App, Manager};
use owner::get_owner_info;
use product_catalog::get_product_catalog;
use product_catalog::add_product_to_catalog;
use crate::common::repository::{Entity};
use crate::common::repository::cache::CachedBasicRepository;
use crate::common::repository::file_repository::FileBasicRepository;
use crate::common::repository::file_repository_config::{DbEntity, FileRepositoryCofig};
use crate::counterparty::{get_counterparties, Counterparty, add_counterparty};
use crate::product_catalog::Product;
use crate::stock_list::{get_stock_list, StockItem};

type ProductRepository<'a> = tauri::State<'a, Mutex<CachedBasicRepository<Product,FileBasicRepository<Product>>>>;
type CounterpartiesRepository<'a> = tauri::State<'a, Mutex<CachedBasicRepository<Counterparty,FileBasicRepository<Counterparty>>>>;
type StockRepository<'a> = tauri::State<'a, Mutex<FileBasicRepository<StockItem>>>;

fn register_cached_repository<T>(app: &mut App, db_entity: DbEntity )
where
T: Send + Sync + 'static + Entity + Clone,
for<'a> T: Serialize + Deserialize<'a> + Send {
    let db_file_path = FileRepositoryCofig::get_db_file_path_for(db_entity);
    let repository =  CachedBasicRepository::new( FileBasicRepository::<T>::new(db_file_path) );

    app.manage(Mutex::new(repository));

}

fn register_repository<T>(app: &mut App, db_entity: DbEntity )
where
    T: Send + Sync + 'static + Entity + Clone,
    for<'a> T: Serialize + Deserialize<'a> + Send {
    let db_file_path = FileRepositoryCofig::get_db_file_path_for(db_entity);
    let repository =  FileBasicRepository::<T>::new(db_file_path);

    app.manage(Mutex::new(repository));
}

fn setup_app(app: &mut App) ->  std::result::Result<(), Box<dyn std::error::Error>> {
    if cfg!(debug_assertions) {
        app.handle().plugin(
            tauri_plugin_log::Builder::default()
                .level(log::LevelFilter::Info)
                .build(),
        )?;
    }

    register_cached_repository::<Product>(app, DbEntity::ProductCatalog);
    register_cached_repository::<Counterparty>(app, DbEntity::Counterparties);
    register_repository::<StockItem>(app, DbEntity::Stock);

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
                                            add_counterparty,
                                            get_stock_list,
                                              ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
