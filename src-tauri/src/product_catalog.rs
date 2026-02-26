use std::sync::{LazyLock, Mutex};

use serde::{Deserialize, Serialize};

use crate::common::repository::{BasicRepository, file_repository::FileBasicRepository, file_repository_config::{DbEntity, FileRepositoryCofig}};

#[derive(Serialize,Deserialize)]
pub struct Product {
  id: u32,
  name: String,
  unit: String,
}

#[derive(Serialize)]
pub struct ProductCatalogData {
  is_ok : bool,
  error: String,
  data: Vec<Product>,
}

#[derive(Deserialize)]
pub struct NewProductRequest {
  name: String,
  unit: String,
}

#[derive(Serialize)]
pub struct NewProductResponse {
  is_ok : bool,
  error: String,
}

pub static REPOSITORY: LazyLock<Mutex<FileBasicRepository<Product>>> = LazyLock::new( || {
        let file_path = FileRepositoryCofig::get_db_file_path_for(DbEntity::ProductCatalog);
        Mutex::new( FileBasicRepository::<Product>::new(file_path) )
} );

#[tauri::command]
pub fn get_product_catalog() -> ProductCatalogData {
    let result = REPOSITORY.lock().unwrap().get_all();
    match result {
        Ok(product_list) => ProductCatalogData { is_ok: true, error: String::new(), data: product_list },
        Err(err) => ProductCatalogData { is_ok:false, error: err, data: Vec::new() },
    }
}

#[tauri::command]
pub fn add_product_to_catalog(request: NewProductRequest) -> NewProductResponse {

  let all_products = get_product_catalog().data;
  let next_id = all_products.iter()
  .map( |data| data.id)
  .max()
  .unwrap_or(0)
  + 1;

  match REPOSITORY.lock().unwrap().save_new_item( &Product { 
                                  id: next_id, name: request.name, unit: request.unit 
                                } ) {
    Ok(_) => NewProductResponse{ is_ok: true, error: String::new() },
    Err(err) => NewProductResponse { is_ok: false, error: err },
  }
}