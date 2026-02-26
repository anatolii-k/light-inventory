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

#[tauri::command]
pub fn get_product_catalog() -> ProductCatalogData {
    let result = Repository::get_product_catalog();
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

  match Repository::save_new_record( &Product { id: next_id, name: request.name, unit: request.unit } ) {
    Ok(_) => NewProductResponse{ is_ok: true, error: String::new() },
    Err(err) => NewProductResponse { is_ok: false, error: err },
  }
}