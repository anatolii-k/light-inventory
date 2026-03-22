use serde::{Deserialize, Serialize};
use crate::common::repository::{BasicRepository, Entity};
use crate::common::response::ResponseStatus;
use crate::{ProductRepository, StockRepository};
use crate::product_catalog::Product;

#[derive(Serialize,Deserialize,Clone)]
pub struct StockItem {
    pub id: u32,
    pub product_id: u32,
    pub total: u32,
    pub reserved: u32,
}

impl StockItem {
    pub fn get_available(&self) -> u32 {
        self.total - self.reserved
    }
}

impl Entity for StockItem {
    fn id(&self) -> u32 {
        self.id
    }
}

#[derive(Serialize,Deserialize,Clone)]
pub struct StockItemDTO {
    pub id: u32,
    pub product_id: u32,
    pub product_name: String,
    pub total: u32,
    pub reserved: u32,
    pub available: u32,
}

#[derive(Serialize,Deserialize)]
pub struct StockListData {
    pub status: ResponseStatus,
    pub data: Vec<StockItemDTO>,
}

fn get_product_name( product_id: u32, product_list: &Vec<Product>) -> String {
    let product = product_list.iter()
        .find( |product| product.id() == product_id );

    match product {
        Some(product) => return product.name.clone(),
        None => return format!("ID:{} (N/A)", product_id),
    }
}

fn combine_data(stock_list: &Vec<StockItem>, product_list: &Vec<Product>) -> Vec<StockItemDTO> {
    stock_list.iter()
        .map(|db_item| {
            let product_name = get_product_name(db_item.product_id, product_list);
            StockItemDTO { id:db_item.id,
                product_id: db_item.product_id,
                product_name,
                total: db_item.total,
                reserved: db_item.reserved,
                available: db_item.get_available() }
        })
    .collect()
}

#[tauri::command]
pub fn get_stock_list(stock_repository: StockRepository, product_repository: ProductRepository ) -> StockListData {

    let stock = stock_repository.lock().unwrap().get_all();
    if let Err(err) = stock {
        return StockListData { status: ResponseStatus{is_ok: false, error: err}, data: vec![] };
    }
    let product_list = product_repository.lock().unwrap().get_all();
    if let Err(err) = product_list {
        return StockListData { status: ResponseStatus{is_ok: false, error: err}, data: vec![] };
    }

    let stock = stock.unwrap();
    let product_list = product_list.unwrap();
    let stock_data = combine_data(&stock, &product_list);

    StockListData{status: ResponseStatus{is_ok: true, error: "".to_string() }, data:stock_data }
}


