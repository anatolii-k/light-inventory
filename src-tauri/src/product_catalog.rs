use serde::{Deserialize, Serialize};
use crate::common::repository::Entity;
use crate::common::response::ResponseStatus;
use crate::ProductRepository;

#[derive(Serialize,Deserialize,Clone)]
pub struct Product {
  id: u32,
  name: String,
  unit: String,
}

impl Entity for Product {
    fn id(&self) -> u32 { self.id }
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

#[tauri::command]
pub fn get_product_catalog( repository: ProductRepository<'_> ) -> ProductCatalogData {
    let result = repository.lock().unwrap().get_all();
    match result {
        Ok(product_list) => ProductCatalogData { is_ok: true, error: String::new(), data: product_list },
        Err(err) => ProductCatalogData { is_ok:false, error: err, data: Vec::new() },
    }
}

#[tauri::command]
pub fn add_product_to_catalog(request: NewProductRequest, repository: ProductRepository<'_>) -> ResponseStatus {
    
    let next_id = match repository.lock().unwrap().get_next_id() {
        Ok(next_id) => next_id,
        Err(err) => return ResponseStatus { is_ok: false, error: err }
    };

  match repository.lock().unwrap().save_new_item( &Product {
                                  id: next_id, name: request.name, unit: request.unit 
                                } ) {
    Ok(_) => ResponseStatus{ is_ok: true, error: String::new() },
    Err(err) => ResponseStatus { is_ok: false, error: err },
  }
}