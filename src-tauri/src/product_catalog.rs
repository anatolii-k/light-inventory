use serde::{Deserialize, Serialize};

mod repository;
use repository::FileRepository as Repository;

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

#[tauri::command]
pub fn get_product_catalog() -> ProductCatalogData {
    let result = Repository::get_product_catalog();
    match result {
        Ok(product_list) => ProductCatalogData { is_ok: true, error: String::new(), data: product_list },
        Err(err) => ProductCatalogData { is_ok:false, error: err, data: Vec::new() },
    }
}