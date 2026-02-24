use serde::Serialize;


#[derive(Serialize)]
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

fn get_tmp_data() -> Vec<Product> {
    vec![
        Product{ id: 1, name: "Золото вагове".to_string(), unit: "гр".to_string() },
        Product{ id: 2, name: "Золото злиток 100 гр".to_string(), unit: "шт".to_string() },
        Product{ id: 5, name: "Срібло вагове".to_string(), unit: "гр".to_string() },
        Product{ id: 6, name: "Срібло злиток 100 гр".to_string(), unit: "шт".to_string() },
        Product{ id: 100, name: "Мідь лом вагова".to_string(), unit: "кг".to_string() },
        Product{ id: 335, name: "Дріт оцинкований".to_string(), unit: "м".to_string() },
        Product{ id: 336, name: "Дріт оцинкований d2".to_string(), unit: "м".to_string() },
    ]
}

#[tauri::command]
pub fn get_product_catalog() -> ProductCatalogData {
    ProductCatalogData { is_ok: true, error: String::new(), data: get_tmp_data() }
}